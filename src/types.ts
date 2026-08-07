export type LocationType = 'ocean' | 'city' | 'float' | 'anomaly';

export interface OceanLocation {
  id: string;
  name: string;
  type: LocationType;
  nearestOcean: string;
  lat: number;
  lng: number;
  zoomDistance: number; // distance for camera zoom
  avgTemp: number; // °C
  avgSalinity: number; // PSU
  avgDepth: number; // meters
  avgPressure: number; // dbar
  currentSpeed: string; // e.g., "1.8 knots (SW)"
  healthScore: number; // 0-100
  lastUpdated: string;
  story: string;
  storyParagraphs?: { title: string; text: string }[];
  insights: string[];
  historicalEvents: { year: string; event: string; impact: string }[];
  argoFloatIds: string[];
  depthProfile: { depth: number; temp: number; salinity: number }[];
  timeSeriesData: { date: string; temp: number; salinity: number; currentSpeed: number }[];
}

export interface ArgoFloat {
  id: string;
  code: string;
  name: string;
  lat: number;
  lng: number;
  ocean: string;
  nearestCity?: string;
  depth: number; // current depth in m
  temp: number; // °C
  salinity: number; // PSU
  battery: number; // %
  lastSurface: string; // timestamp or relative
  status: 'Active' | 'Profiling' | 'Transmitting' | 'Maintenance' | 'Offline';
  deployDate: string;
  trajectoryPoints: { lat: number; lng: number }[];
}

export interface OceanNotification {
  id: string;
  title: string;
  message: string;
  type: 'heatwave' | 'float' | 'temp' | 'salinity' | 'cyclone' | 'stable' | 'current';
  severity: 'critical' | 'warning' | 'info' | 'normal';
  timestamp: string;
  locationId?: string;
  read: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  locationContext?: string;
  isStreaming?: boolean;
}

export interface OceanReport {
  id: string;
  locationName: string;
  generatedAt: string;
  summary: string;
  confidenceScore?: number;
  riskAnalysis?: string;
  keyInsights: string[];
  recommendations: string[];
  metrics: {
    temperature: string;
    salinity: string;
    pressure: string;
    healthScore: number;
    activeFloats: number;
  };
  floatIds?: string[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  organization: string;
  bookmarks: string[]; // location IDs
  savedReports: OceanReport[];
  theme: 'dark' | 'ocean';
}

