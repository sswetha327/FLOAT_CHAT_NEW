import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OceanLocation, ArgoFloat } from '../types';
import { Compass, RotateCw, ZoomIn, ZoomOut, Waves, Globe as GlobeIcon } from 'lucide-react';

interface Globe3DProps {
  locations: OceanLocation[];
  argoFloats: ArgoFloat[];
  selectedLocation: OceanLocation | null;
  onSelectLocation: (location: OceanLocation) => void;
  onSelectFloat?: (float: ArgoFloat) => void;
  showArgoFloats: boolean;
  showCurrents: boolean;
  showGrid: boolean;
}

// Convert lat/lng to 3D Cartesian coordinates on sphere of radius R
function latLngToVector3(lat: number, lng: number, radius: number = 2.0): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

// Convert 3D Point on sphere to Lat/Lng
function vector3ToLatLng(vector: THREE.Vector3, radius: number = 2.0): { lat: number; lng: number } {
  const norm = vector.clone().normalize();
  const lat = 90 - Math.acos(norm.y) * (180 / Math.PI);
  const lng = Math.atan2(norm.z, -norm.x) * (180 / Math.PI) - 180;
  return { lat, lng };
}

// Helper to create high-contrast ocean & city labels as 3D Canvas Sprites
function createLabelSprite(text: string, subtext: string = '', isSelected: boolean = false): THREE.Sprite {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;

  // Pill Background
  ctx.fillStyle = isSelected ? 'rgba(8, 145, 178, 0.92)' : 'rgba(15, 23, 42, 0.85)';
  ctx.strokeStyle = isSelected ? '#22d3ee' : 'rgba(56, 189, 248, 0.5)';
  ctx.lineWidth = isSelected ? 4 : 2;

  // Draw Rounded Rectangle
  const x = 10, y = 10, w = canvas.width - 20, h = canvas.height - 20, r = 20;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Primary Text
  ctx.fillStyle = '#ffffff';
  ctx.font = 'Bold 28px Inter, system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, canvas.width / 2, subtext ? 45 : 64);

  // Subtext if present
  if (subtext) {
    ctx.fillStyle = isSelected ? '#cffafe' : '#38bdf8';
    ctx.font = '18px monospace';
    ctx.fillText(subtext, canvas.width / 2, 85);
  }

  const texture = new THREE.CanvasTexture(canvas);
  const spriteMaterial = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthTest: true,
  });
  const sprite = new THREE.Sprite(spriteMaterial);
  sprite.scale.set(0.65, 0.16, 1);
  return sprite;
}

export const Globe3D: React.FC<Globe3DProps> = ({
  locations,
  argoFloats,
  selectedLocation,
  onSelectLocation,
  onSelectFloat,
  showArgoFloats,
  showCurrents,
  showGrid,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);

  // Three.js internal refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const globeGroupRef = useRef<THREE.Group | null>(null);
  const globeMeshRef = useRef<THREE.Mesh | null>(null);
  const cloudsMeshRef = useRef<THREE.Mesh | null>(null);
  const currentsGroupRef = useRef<THREE.Group | null>(null);
  const floatsGroupRef = useRef<THREE.Group | null>(null);
  const gridGroupRef = useRef<THREE.Group | null>(null);
  const labelsGroupRef = useRef<THREE.Group | null>(null);

  const markersRef = useRef<{ mesh: THREE.Mesh; location: OceanLocation; sprite?: THREE.Sprite }[]>([]);
  const floatMarkersRef = useRef<{ mesh: THREE.Mesh; float: ArgoFloat }[]>([]);

  // Orbit control state
  const isDraggingRef = useRef<boolean>(false);
  const previousMousePosition = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const cameraDistanceRef = useRef<number>(5.5);
  const targetCamPosRef = useRef<{ lat: number; lng: number; distance: number } | null>(null);

  // High Resolution Procedural Earth Fallback Texture
  const createProceduralEarthTexture = useCallback(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d')!;

    // Rich Bathymetry Ocean Base Gradient
    const oceanGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    oceanGrad.addColorStop(0, '#020617');
    oceanGrad.addColorStop(0.25, '#0a2357');
    oceanGrad.addColorStop(0.5, '#0f3b8c');
    oceanGrad.addColorStop(0.75, '#0a2357');
    oceanGrad.addColorStop(1, '#020617');
    ctx.fillStyle = oceanGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Deep Bathymetry Trenches
    ctx.fillStyle = 'rgba(6, 182, 212, 0.12)';
    for (let i = 0; i < 50; i++) {
      const cx = Math.random() * canvas.width;
      const cy = Math.random() * canvas.height;
      const r = 60 + Math.random() * 220;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Latitude & Longitude Grid Lines
    ctx.strokeStyle = 'rgba(14, 165, 233, 0.18)';
    ctx.lineWidth = 1.2;
    for (let y = 0; y <= canvas.height; y += canvas.height / 18) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
    for (let x = 0; x <= canvas.width; x += canvas.width / 36) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }

    // Continent Outlines & Landmass Fill
    ctx.fillStyle = '#0c2840';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.5;

    const drawContour = (coords: [number, number][]) => {
      ctx.beginPath();
      coords.forEach(([lng, lat], i) => {
        const x = ((lng + 180) / 360) * canvas.width;
        const y = ((90 - lat) / 180) * canvas.height;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    };

    // North America
    drawContour([[-168, 65], [-140, 70], [-100, 75], [-60, 75], [-55, 48], [-75, 35], [-80, 25], [-100, 20], [-120, 35], [-160, 55]]);
    // South America
    drawContour([[-80, 10], [-60, 10], [-35, -5], [-40, -22], [-65, -55], [-75, -45], [-80, -2]]);
    // Eurasia
    drawContour([[-10, 36], [10, 45], [30, 60], [70, 70], [140, 72], [170, 65], [140, 35], [100, 10], [80, 10], [70, 22], [50, 25], [35, 32], [0, 40]]);
    // India Subcontinent
    drawContour([[68, 24], [72, 20], [77, 8], [80, 13], [88, 22], [92, 22], [80, 28]]);
    // Africa
    drawContour([[-15, 35], [35, 30], [50, 10], [40, -10], [20, -35], [15, -34], [8, 5], [-17, 15]]);
    // Australia
    drawContour([[113, -22], [130, -12], [142, -10], [153, -28], [140, -38], [115, -35]]);
    // Antarctica
    drawContour([[-180, -70], [-90, -72], [0, -70], [90, -68], [180, -70]]);

    // Coastal City Hubs
    ctx.fillStyle = '#22d3ee';
    const hubs = [
      [80.27, 13.08], [72.82, 18.96], [151.2, -33.86], [139.65, 35.67],
      [-122.4, 37.77], [-43.17, -22.90], [18.42, -33.92]
    ];
    hubs.forEach(([lng, lat]) => {
      const x = ((lng + 180) / 360) * canvas.width;
      const y = ((90 - lat) / 180) * canvas.height;
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, Math.PI * 2);
      ctx.fill();
    });

    return new THREE.CanvasTexture(canvas);
  }, []);

  // Initialize Three.js Scene
  useEffect(() => {
    if (!mountRef.current) return;

    // STRICT CLEANUP: Guarantee no leftover canvas elements exist
    mountRef.current.innerHTML = '';

    const width = mountRef.current.clientWidth || 800;
    const height = mountRef.current.clientHeight || 600;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, cameraDistanceRef.current);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfef08a, 2.5); // Warm Sunlight
    sunLight.position.set(6, 3, 5);
    scene.add(sunLight);

    const blueRimLight = new THREE.DirectionalLight(0x06b6d4, 1.8);
    blueRimLight.position.set(-6, -3, -5);
    scene.add(blueRimLight);

    // 5. Deep Space Starfield Background
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 2000;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i++) {
      starPositions[i] = (Math.random() - 0.5) * 120;
    }
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMaterial = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.12,
      transparent: true,
      opacity: 0.75,
    });
    const starField = new THREE.Points(starGeometry, starMaterial);
    scene.add(starField);

    // 6. Globe Group
    const globeGroup = new THREE.Group();
    globeGroupRef.current = globeGroup;
    scene.add(globeGroup);

    // 7. Base Globe Mesh with NASA Earth Texture & Fallback
    const globeRadius = 2.0;
    const sphereGeometry = new THREE.SphereGeometry(globeRadius, 64, 64);
    const proceduralTexture = createProceduralEarthTexture();

    const globeMaterial = new THREE.MeshPhongMaterial({
      map: proceduralTexture,
      shininess: 30,
      specular: new THREE.Color(0x38bdf8),
      emissive: new THREE.Color(0x021028),
      emissiveIntensity: 0.25,
    });
    const globeMesh = new THREE.Mesh(sphereGeometry, globeMaterial);
    globeMeshRef.current = globeMesh;
    globeGroup.add(globeMesh);

    // Asynchronously Load NASA Blue Marble High-Res Texture
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_atmos_2048.jpg',
      (loadedMap) => {
        if (globeMeshRef.current) {
          globeMaterial.map = loadedMap;
          globeMaterial.needsUpdate = true;
        }
      },
      undefined,
      (err) => console.log('Using procedural Earth texture fallback:', err)
    );

    // 8. Atmospheric Glow Shader Outer Halo
    const atmosphereGeometry = new THREE.SphereGeometry(globeRadius * 1.05, 64, 64);
    const atmosphereMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.65 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.2);
          gl_FragColor = vec4(0.02, 0.82, 0.98, 1.0) * intensity * 0.95;
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
    });
    const atmosphereMesh = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    globeGroup.add(atmosphereMesh);

    // 10. Coordinate Grid Group
    const gridGroup = new THREE.Group();
    gridGroupRef.current = gridGroup;
    globeGroup.add(gridGroup);

    for (let lat = -60; lat <= 60; lat += 30) {
      const r = globeRadius * 1.005 * Math.cos((lat * Math.PI) / 180);
      const y = globeRadius * 1.005 * Math.sin((lat * Math.PI) / 180);
      const ringGeo = new THREE.BufferGeometry();
      const points: THREE.Vector3[] = [];
      for (let i = 0; i <= 64; i++) {
        const theta = (i / 64) * Math.PI * 2;
        points.push(new THREE.Vector3(r * Math.cos(theta), y, r * Math.sin(theta)));
      }
      ringGeo.setFromPoints(points);
      const ringMat = new THREE.LineBasicMaterial({ color: 0x0ea5e9, transparent: true, opacity: 0.22 });
      gridGroup.add(new THREE.Line(ringGeo, ringMat));
    }

    // 11. Ocean Currents Group
    const currentsGroup = new THREE.Group();
    currentsGroupRef.current = currentsGroup;
    globeGroup.add(currentsGroup);

    const majorGyres = [
      { centerLat: 15, centerLng: 88, radiusDeg: 12, color: 0x22d3ee }, // Bay of Bengal
      { centerLat: 19, centerLng: 65, radiusDeg: 14, color: 0x0ea5e9 }, // Arabian Sea
      { centerLat: 25, centerLng: -150, radiusDeg: 25, color: 0x38bdf8 }, // North Pacific
      { centerLat: -25, centerLng: -100, radiusDeg: 30, color: 0x0284c7 }, // South Pacific
      { centerLat: 30, centerLng: -40, radiusDeg: 22, color: 0x67e8f9 }, // North Atlantic
      { centerLat: -60, centerLng: 0, radiusDeg: 45, color: 0x06b6d4 }, // Antarctic Circumpolar
    ];

    majorGyres.forEach((gyre) => {
      const particlesCount = 100;
      const pointsGeo = new THREE.BufferGeometry();
      const posArray = new Float32Array(particlesCount * 3);
      for (let i = 0; i < particlesCount; i++) {
        const angle = (i / particlesCount) * Math.PI * 2;
        const lat = gyre.centerLat + Math.sin(angle) * gyre.radiusDeg;
        const lng = gyre.centerLng + Math.cos(angle) * gyre.radiusDeg * 1.4;
        const pos = latLngToVector3(lat, lng, globeRadius * 1.018);
        posArray[i * 3] = pos.x;
        posArray[i * 3 + 1] = pos.y;
        posArray[i * 3 + 2] = pos.z;
      }
      pointsGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
      const pointsMat = new THREE.PointsMaterial({
        color: gyre.color,
        size: 0.038,
        transparent: true,
        opacity: 0.85,
      });
      currentsGroup.add(new THREE.Points(pointsGeo, pointsMat));
    });

    // 12. Floats Group
    const floatsGroup = new THREE.Group();
    floatsGroupRef.current = floatsGroup;
    globeGroup.add(floatsGroup);

    // 13. Labels Group
    const labelsGroup = new THREE.Group();
    labelsGroupRef.current = labelsGroup;
    globeGroup.add(labelsGroup);

    // Native Non-Passive Wheel Event Listener for Smooth In/Out Zoom
    const handleNativeWheel = (e: WheelEvent) => {
      e.preventDefault();
      targetCamPosRef.current = null; // Instantly release Fly-To lock when user scrolls
      const zoomFactor = e.deltaY * 0.0025;
      cameraDistanceRef.current = Math.max(1.8, Math.min(8.5, cameraDistanceRef.current + zoomFactor));
      if (cameraRef.current) {
        cameraRef.current.position.setLength(cameraDistanceRef.current);
      }
    };

    const containerElem = mountRef.current;
    if (containerElem) {
      containerElem.addEventListener('wheel', handleNativeWheel, { passive: false });
    }

    // ResizeObserver for Container Bounds Integrity
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (!rendererRef.current || !cameraRef.current) return;
        const cr = entry.contentRect;
        if (cr.width > 0 && cr.height > 0) {
          cameraRef.current.aspect = cr.width / cr.height;
          cameraRef.current.updateProjectionMatrix();
          rendererRef.current.setSize(cr.width, cr.height);
        }
      }
    });
    resizeObserver.observe(mountRef.current);

    // Render Animation Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Camera Smooth Interpolation Fly-To
      if (targetCamPosRef.current && cameraRef.current) {
        const { lat, lng, distance } = targetCamPosRef.current;
        const targetPos = latLngToVector3(lat, lng, distance);
        cameraRef.current.position.lerp(targetPos, 0.07);
        cameraRef.current.lookAt(0, 0, 0);

        if (cameraRef.current.position.distanceTo(targetPos) < 0.02) {
          cameraDistanceRef.current = cameraRef.current.position.length();
          targetCamPosRef.current = null;
        }
      } else if (autoRotate && globeGroupRef.current && !isDraggingRef.current) {
        globeGroupRef.current.rotation.y += 0.0012;
      }

      // Rotate Currents
      if (currentsGroupRef.current) currentsGroupRef.current.rotation.y += 0.0009;

      // Pulse location markers
      markersRef.current.forEach(({ mesh }) => {
        const scale = 1.0 + Math.sin(Date.now() * 0.004) * 0.16;
        mesh.scale.set(scale, scale, scale);
      });

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      if (containerElem) {
        containerElem.removeEventListener('wheel', handleNativeWheel);
      }
      if (rendererRef.current && mountRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement);
      }
    };
  }, [createProceduralEarthTexture, autoRotate]);

  // Update Location Markers & Labels
  useEffect(() => {
    if (!globeGroupRef.current) return;

    markersRef.current.forEach(({ mesh, sprite }) => {
      globeGroupRef.current?.remove(mesh);
      if (sprite) globeGroupRef.current?.remove(sprite);
    });
    markersRef.current = [];

    locations.forEach((loc) => {
      const pos = latLngToVector3(loc.lat, loc.lng, 2.025);
      const isSelected = selectedLocation?.id === loc.id;
      const size = isSelected ? 0.065 : 0.045;
      const color = loc.type === 'ocean' ? 0x06b6d4 : loc.type === 'city' ? 0x38bdf8 : 0x22c55e;

      // Sphere marker
      const markerGeo = new THREE.SphereGeometry(size, 16, 16);
      const markerMat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.9 });
      const markerMesh = new THREE.Mesh(markerGeo, markerMat);
      markerMesh.position.copy(pos);

      // Pulsing Outer Ring
      const ringGeo = new THREE.RingGeometry(size * 1.3, size * 2.2, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: isSelected ? 0x22d3ee : 0x0ea5e9,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.75,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.lookAt(0, 0, 0);
      markerMesh.add(ringMesh);

      // Label Sprite floating slightly above marker
      const labelPos = latLngToVector3(loc.lat, loc.lng, 2.25);
      const sprite = createLabelSprite(loc.name, `${loc.avgTemp}°C | ${loc.avgSalinity} PSU`, isSelected);
      sprite.position.copy(labelPos);

      globeGroupRef.current?.add(markerMesh);
      globeGroupRef.current?.add(sprite);

      markersRef.current.push({ mesh: markerMesh, location: loc, sprite });
    });
  }, [locations, selectedLocation]);

  // Update ARGO Float Markers
  useEffect(() => {
    if (!floatsGroupRef.current) return;

    floatMarkersRef.current.forEach(({ mesh }) => floatsGroupRef.current?.remove(mesh));
    floatMarkersRef.current = [];

    if (!showArgoFloats) return;

    argoFloats.forEach((float) => {
      const pos = latLngToVector3(float.lat, float.lng, 2.035);
      const floatGeo = new THREE.ConeGeometry(0.028, 0.09, 8);
      floatGeo.rotateX(Math.PI);
      const floatMat = new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        emissive: 0xd97706,
        emissiveIntensity: 0.9,
        roughness: 0.2,
      });
      const floatMesh = new THREE.Mesh(floatGeo, floatMat);
      floatMesh.position.copy(pos);
      floatMesh.lookAt(0, 0, 0);

      floatsGroupRef.current?.add(floatMesh);
      floatMarkersRef.current.push({ mesh: floatMesh, float });
    });
  }, [argoFloats, showArgoFloats]);

  // Layer Visibility
  useEffect(() => {
    if (gridGroupRef.current) gridGroupRef.current.visible = showGrid;
    if (currentsGroupRef.current) currentsGroupRef.current.visible = showCurrents;
  }, [showGrid, showCurrents]);

  // Camera fly-to when selectedLocation changes
  useEffect(() => {
    if (selectedLocation) {
      targetCamPosRef.current = {
        lat: selectedLocation.lat,
        lng: selectedLocation.lng,
        distance: selectedLocation.zoomDistance || 3.2,
      };
      setAutoRotate(false);
    }
  }, [selectedLocation]);

  // Mouse Orbit Drag Logic with Inertia
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    targetCamPosRef.current = null; // Instantly release Fly-To lock when user drags
    previousMousePosition.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || !globeGroupRef.current) return;

    const deltaX = e.clientX - previousMousePosition.current.x;
    const deltaY = e.clientY - previousMousePosition.current.y;

    globeGroupRef.current.rotation.y += deltaX * 0.005;
    globeGroupRef.current.rotation.x += deltaY * 0.005;

    previousMousePosition.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (!cameraRef.current) return;
    const zoomFactor = e.deltaY * 0.002;
    cameraDistanceRef.current = Math.max(2.1, Math.min(8.0, cameraDistanceRef.current + zoomFactor));
    cameraRef.current.position.setLength(cameraDistanceRef.current);
  };

  // Double Click Zoom & Fly to exact clicked coordinates on Earth
  const handleDoubleClick = (e: React.MouseEvent) => {
    if (!mountRef.current || !cameraRef.current || !globeMeshRef.current) return;
    const rect = mountRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(x, y), cameraRef.current);

    const intersects = raycaster.intersectObject(globeMeshRef.current);
    if (intersects.length > 0) {
      const point = intersects[0].point;
      const { lat, lng } = vector3ToLatLng(point);

      // Select closest location
      const closest = locations.reduce((prev, curr) => {
        const distPrev = Math.hypot(prev.lat - lat, prev.lng - lng);
        const distCurr = Math.hypot(curr.lat - lat, curr.lng - lng);
        return distCurr < distPrev ? curr : prev;
      }, locations[0]);

      onSelectLocation(closest);
    }
  };

  // Single Click Raycast Selection
  const handleClick = (e: React.MouseEvent) => {
    if (!mountRef.current || !cameraRef.current || !globeMeshRef.current) return;
    const rect = mountRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(x, y), cameraRef.current);

    // 1. Check Location Markers or Sprites
    const markerMeshes = markersRef.current.map((m) => m.mesh);
    const intersects = raycaster.intersectObjects(markerMeshes);

    if (intersects.length > 0) {
      const hitMesh = intersects[0].object as THREE.Mesh;
      const found = markersRef.current.find((m) => m.mesh === hitMesh || hitMesh.parent === m.mesh);
      if (found) {
        onSelectLocation(found.location);
        return;
      }
    }

    // 2. Check Float Markers
    if (showArgoFloats && onSelectFloat) {
      const floatMeshes = floatMarkersRef.current.map((f) => f.mesh);
      const floatIntersects = raycaster.intersectObjects(floatMeshes);
      if (floatIntersects.length > 0) {
        const hitFloatMesh = floatIntersects[0].object as THREE.Mesh;
        const foundFloat = floatMarkersRef.current.find((f) => f.mesh === hitFloatMesh);
        if (foundFloat) {
          onSelectFloat(foundFloat.float);
          return;
        }
      }
    }

    // 3. Check Direct Click on Oceans / Continents on Earth Sphere Surface
    const earthIntersects = raycaster.intersectObject(globeMeshRef.current);
    if (earthIntersects.length > 0) {
      const point = earthIntersects[0].point;
      const { lat, lng } = vector3ToLatLng(point);

      const closest = locations.reduce((prev, curr) => {
        const distPrev = Math.hypot(prev.lat - lat, prev.lng - lng);
        const distCurr = Math.hypot(curr.lat - lat, curr.lng - lng);
        return distCurr < distPrev ? curr : prev;
      }, locations[0]);

      onSelectLocation(closest);
    }
  };

  const zoomIn = () => {
    if (!cameraRef.current) return;
    cameraDistanceRef.current = Math.max(2.1, cameraDistanceRef.current - 0.6);
    cameraRef.current.position.setLength(cameraDistanceRef.current);
  };

  const zoomOut = () => {
    if (!cameraRef.current) return;
    cameraDistanceRef.current = Math.min(8.0, cameraDistanceRef.current + 0.6);
    cameraRef.current.position.setLength(cameraDistanceRef.current);
  };

  const resetCamera = () => {
    targetCamPosRef.current = { lat: 15, lng: 88, distance: 5.5 };
    setAutoRotate(true);
  };

  return (
    <div className="relative w-full h-full min-h-[450px] overflow-hidden rounded-2xl bg-slate-950/80 backdrop-blur-xl border border-white/10 shadow-2xl">
      {/* Canvas Container */}
      <div
        ref={mountRef}
        className="w-full h-full cursor-grab active:cursor-grabbing relative overflow-hidden"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
      />

      {/* Floating Controls Overlay */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2 p-1.5 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-white/10 text-cyan-400 shadow-xl">
        <button
          onClick={zoomIn}
          title="Zoom In"
          className="p-2 rounded-xl hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={zoomOut}
          title="Zoom Out"
          className="p-2 rounded-xl hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={() => setAutoRotate(!autoRotate)}
          title={autoRotate ? 'Pause Rotation' : 'Auto Rotate'}
          className={`p-2 rounded-xl transition-colors cursor-pointer ${
            autoRotate ? 'bg-cyan-500/30 text-cyan-200' : 'hover:bg-white/10 hover:text-white'
          }`}
        >
          <RotateCw className={`w-4 h-4 ${autoRotate ? 'animate-spin' : ''}`} />
        </button>
        <button
          onClick={resetCamera}
          title="Reset Camera View"
          className="p-2 rounded-xl hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
        >
          <Compass className="w-4 h-4" />
        </button>
      </div>

      {/* NASA Digital Twin Badge */}
      <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/10 text-xs font-mono text-cyan-300 shadow-md">
        <GlobeIcon className="w-4 h-4 text-cyan-400 animate-pulse" />
        <span>3D DIGITAL EARTH • NASA & ARGO SYNC</span>
      </div>

      {/* Quick Ocean Preset Selector Floating Bar */}
      <div className="absolute bottom-4 right-4 z-20 hidden sm:flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-white/10 text-xs">
        {locations.slice(0, 6).map((loc) => (
          <button
            key={loc.id}
            onClick={() => onSelectLocation(loc)}
            className={`px-3 py-1.5 rounded-xl transition-all font-medium cursor-pointer ${
              selectedLocation?.id === loc.id
                ? 'bg-cyan-500/30 text-cyan-200 border border-cyan-400/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {loc.name.replace(' Coast', '').replace(' Ocean', '').replace(' offshore (Arabian Sea)', '')}
          </button>
        ))}
      </div>
    </div>
  );
};
