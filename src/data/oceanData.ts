import { OceanLocation, ArgoFloat, OceanNotification } from '../types';

export const OCEAN_LOCATIONS: OceanLocation[] = [
  {
    id: 'bay-of-bengal',
    name: 'Bay of Bengal',
    type: 'ocean',
    nearestOcean: 'Indian Ocean',
    lat: 15.0,
    lng: 88.0,
    zoomDistance: 3.2,
    avgTemp: 29.4,
    avgSalinity: 32.8,
    avgDepth: 2600,
    avgPressure: 2620,
    currentSpeed: '2.4 knots (NE)',
    healthScore: 78,
    lastUpdated: '12 mins ago',
    story: 'Welcome to the Bay of Bengal, one of the most hydro-dynamically intense ocean basins on Earth. Nestled in the northeastern corner of the Indian Ocean, this vast marine realm plays a decisive role in shaping the South Asian Monsoon.',
    storyParagraphs: [
      {
        title: '1. GEOGRAPHIC & HYDROLOGICAL ENGINE',
        text: 'The Bay of Bengal spans roughly 2.17 million square kilometers, bounded by India, Bangladesh, Myanmar, and the Andaman Islands. It receives an astonishing volume of freshwater discharge—over 1.5 trillion cubic meters annually—primarily from the Ganges, Brahmaputra, Meghna, and Irrawaddy river networks.'
      },
      {
        title: '2. CLIMATE & MONSOON DYNAMICS',
        text: 'Freshwater influx creates a lightweight, low-salinity surface layer that floats over dense, salty ocean water below. This barrier layer inhibits vertical ocean mixing, trapping solar heat near the surface and elevating sea surface temperatures above 28.5°C, providing immense thermal fuel for tropical cyclones.'
      },
      {
        title: '3. REVERSING MONSOON CURRENTS',
        text: 'Ocean currents in the Bay undergo a complete bi-annual reversal driven by monsoon winds. During the summer SW monsoon, the East India Coastal Current (EICC) surges northward, while during the winter NE monsoon, it reverses southward, sweeping river plumes across thousands of kilometers.'
      },
      {
        title: '4. MARINE ECOSYSTEMS & OMZ ANOMALIES',
        text: 'Despite immense biological productivity along coastal mangroves and coral reefs in the Andaman Sea, the deep Bay harbors a massive Oxygen Minimum Zone (OMZ) between 100m and 600m depth, where dissolved oxygen drops to near suboxic thresholds.'
      },
      {
        title: '5. HISTORICAL IMPORTANCE & DISCOVERIES',
        text: 'For millennia, seafaring merchants navigated the Bay using seasonal trade winds. Today, modern oceanographers utilize satellite altimetry and deep autonomous profilers to decode the basin’s complex thermohaline circulation.'
      },
      {
        title: '6. ARGO FLOAT CONTRIBUTION & REALTIME SENSING',
        text: 'More than 40 active ARGO floats drift across the Bay of Bengal, diving every 10 days down to 2000 meters depth. They record continuous profiles of temperature, salinity, pH, and dissolved oxygen, transmitting data directly to INCOIS and global data centers via satellite constellation.'
      },
      {
        title: '7. CLIMATE CHANGE IMPACT & FUTURE OUTLOOK',
        text: 'Global warming has accelerated sea level rise and intensified marine heatwaves in the Bay. High-frequency observation networks powered by FloatChat AI ensure early cyclone warnings, safeguarding over 500 million coastal residents across South Asia.'
      }
    ],
    insights: [
      'Low surface salinity creates intense thermal stratification, inhibiting upper ocean mixing.',
      'Surface temperature exceeds climatological baseline by +1.4°C, triggering localized Marine Heatwave Alert Grade II.',
      'Surface currents driven by monsoon reverse semi-annually, transporting freshwater toward the equator during winter.',
      'Oxygen minimum zone (OMZ) detected at depths between 100m and 600m with suboxic conditions.'
    ],
    historicalEvents: [
      { year: '2024', event: 'Severe Cyclone Remal', impact: 'Sub-surface thermocline cooling by 1.8°C along track.' },
      { year: '2023', event: 'Extended Summer Heatwave', impact: 'Bleaching observed across North Andaman coral reefs.' },
      { year: '2021', event: 'ARGO Fleet Expansion', impact: '24 biogeochemical ARGO floats deployed by INCOIS & Oceanography institutes.' }
    ],
    argoFloatIds: ['ARGO-IN-9842', 'ARGO-IN-9843', 'ARGO-IN-9850'],
    depthProfile: [
      { depth: 0, temp: 29.4, salinity: 32.8 },
      { depth: 50, temp: 28.1, salinity: 33.6 },
      { depth: 100, temp: 24.2, salinity: 34.5 },
      { depth: 250, temp: 16.5, salinity: 35.0 },
      { depth: 500, temp: 10.2, salinity: 35.1 },
      { depth: 1000, temp: 6.8, salinity: 34.9 },
      { depth: 2000, temp: 2.9, salinity: 34.8 }
    ],
    timeSeriesData: [
      { date: '00:00', temp: 29.1, salinity: 32.7, currentSpeed: 2.2 },
      { date: '04:00', temp: 29.2, salinity: 32.7, currentSpeed: 2.3 },
      { date: '08:00', temp: 29.5, salinity: 32.8, currentSpeed: 2.5 },
      { date: '12:00', temp: 29.8, salinity: 32.9, currentSpeed: 2.6 },
      { date: '16:00', temp: 29.6, salinity: 32.8, currentSpeed: 2.4 },
      { date: '20:00', temp: 29.4, salinity: 32.8, currentSpeed: 2.4 }
    ]
  },
  {
    id: 'arabian-sea',
    name: 'Arabian Sea',
    type: 'ocean',
    nearestOcean: 'Indian Ocean',
    lat: 19.0,
    lng: 65.0,
    zoomDistance: 3.5,
    avgTemp: 28.5,
    avgSalinity: 36.6,
    avgDepth: 2734,
    avgPressure: 2760,
    currentSpeed: '2.8 knots (SW)',
    healthScore: 80,
    lastUpdated: '8 mins ago',
    story: 'The Arabian Sea is a region of extreme evaporation, intense seasonal winds, and high surface salinity in the northwestern Indian Ocean.',
    storyParagraphs: [
      {
        title: '1. GEOGRAPHY & BOUNDARIES',
        text: 'Spanning between the Arabian Peninsula, Horn of Africa, and the western coast of India, the Arabian Sea connects the Persian Gulf and Red Sea to the open Indian Ocean through the Strait of Hormuz and Bab-el-Mandeb.'
      },
      {
        title: '2. HIGH SALINITY & EVAPORATION',
        text: 'Dry continental air sweeping across desert regions causes immense surface evaporation, creating the Arabian Sea High Salinity Water (ASHSW) with salinity values exceeding 36.5 PSU.'
      },
      {
        title: '3. MONSOON UPWELLING & BIOLOGICAL BLOOMS',
        text: 'During the Southwest Monsoon (June–September), Findlater Jet winds drag surface water away from Somalia and Oman, triggering massive upwelling of nutrient-dense deep water that turns the basin emerald green with phytoplankton.'
      },
      {
        title: '4. OXYGEN MINIMUM ZONE (OMZ)',
        text: 'High biological productivity coupled with sluggish deep ventilation creates the world’s most intense oxygen minimum zone at mid-depths (200m–1000m).'
      },
      {
        title: '5. SCIENTIFIC OBSERVATIONS & ARGO NETWORK',
        text: 'Autonomous ARGO floats stationed across the Arabian Sea track heat uptake, thermocline fluctuations, and monsoon current inversions year-round.'
      }
    ],
    insights: [
      'Elevated surface salinity (36.6 PSU) due to dry trade wind evaporation.',
      'Active Findlater Jet wind stress generating coastal upwelling along Somali & Omani coastlines.',
      'Dense ASHSW water mass sinking and spreading southward at 150m depth.',
      'Mid-water suboxic OMZ detected across central basin.'
    ],
    historicalEvents: [
      { year: '2023', event: 'Cyclone Biparjoy', impact: 'Sustained surface cooling along central Arabian Sea track.' },
      { year: '2021', event: 'Deep Salinity Study', impact: 'ARGO sensors confirmed subduction rate of high salinity surface water.' }
    ],
    argoFloatIds: ['ARGO-AS-7711'],
    depthProfile: [
      { depth: 0, temp: 28.5, salinity: 36.6 },
      { depth: 50, temp: 27.2, salinity: 36.7 },
      { depth: 100, temp: 23.8, salinity: 36.2 },
      { depth: 250, temp: 16.2, salinity: 35.7 },
      { depth: 500, temp: 10.5, salinity: 35.2 },
      { depth: 1000, temp: 6.9, salinity: 35.0 },
      { depth: 2000, temp: 2.8, salinity: 34.8 }
    ],
    timeSeriesData: [
      { date: '00:00', temp: 28.3, salinity: 36.5, currentSpeed: 2.6 },
      { date: '04:00', temp: 28.4, salinity: 36.5, currentSpeed: 2.7 },
      { date: '08:00', temp: 28.6, salinity: 36.6, currentSpeed: 2.9 },
      { date: '12:00', temp: 28.8, salinity: 36.7, currentSpeed: 3.0 },
      { date: '16:00', temp: 28.6, salinity: 36.6, currentSpeed: 2.8 },
      { date: '20:00', temp: 28.5, salinity: 36.6, currentSpeed: 2.8 }
    ]
  },
  {
    id: 'indian-ocean',
    name: 'Indian Ocean',
    type: 'ocean',
    nearestOcean: 'Indian Ocean',
    lat: -10.0,
    lng: 75.0,
    zoomDistance: 4.5,
    avgTemp: 27.2,
    avgSalinity: 35.2,
    avgDepth: 3741,
    avgPressure: 3810,
    currentSpeed: '3.1 knots (E)',
    healthScore: 82,
    lastUpdated: '5 mins ago',
    story: 'The Indian Ocean is the third-largest of the world ocean divisions, covering approximately 20% of Earth’s water surface. It drives the Asian Monsoon system and hosts the Indian Ocean Dipole (IOD), a primary climatic driver influencing rainfall patterns across Africa, South Asia, and Australia.',
    insights: [
      'Positive Indian Ocean Dipole (IOD) condition active, creating warm sea surface temperature anomalies in the western basin.',
      'Equatorial surface currents transporting warm water westward toward the African coast.',
      'Subtropical Gyre exhibits strong oxygenation down to 800m depth.',
      'Active ARGO telemetry indicates steady deep water circulation along the Ninety East Ridge.'
    ],
    historicalEvents: [
      { year: '2025', event: 'Extreme Positive IOD Event', impact: 'Altered regional precipitation patterns across South Asia.' },
      { year: '2020', event: 'Deep ARGO Deployments', impact: '6000m depth sensors mapped deep ocean warming trends.' }
    ],
    argoFloatIds: ['ARGO-IN-9842', 'ARGO-IN-9845', 'ARGO-IN-9860'],
    depthProfile: [
      { depth: 0, temp: 27.2, salinity: 35.2 },
      { depth: 50, temp: 26.5, salinity: 35.3 },
      { depth: 100, temp: 22.0, salinity: 35.4 },
      { depth: 250, temp: 14.8, salinity: 35.2 },
      { depth: 500, temp: 9.1, salinity: 34.8 },
      { depth: 1000, temp: 5.4, salinity: 34.7 },
      { depth: 2000, temp: 2.5, salinity: 34.7 }
    ],
    timeSeriesData: [
      { date: '00:00', temp: 27.0, salinity: 35.1, currentSpeed: 2.9 },
      { date: '04:00', temp: 27.1, salinity: 35.2, currentSpeed: 3.0 },
      { date: '08:00', temp: 27.3, salinity: 35.2, currentSpeed: 3.2 },
      { date: '12:00', temp: 27.4, salinity: 35.3, currentSpeed: 3.3 },
      { date: '16:00', temp: 27.3, salinity: 35.2, currentSpeed: 3.1 },
      { date: '20:00', temp: 27.2, salinity: 35.2, currentSpeed: 3.1 }
    ]
  },
  {
    id: 'chennai',
    name: 'Chennai Coast',
    type: 'city',
    nearestOcean: 'Bay of Bengal',
    lat: 13.0827,
    lng: 80.2707,
    zoomDistance: 2.2,
    avgTemp: 28.8,
    avgSalinity: 33.5,
    avgDepth: 450,
    avgPressure: 455,
    currentSpeed: '1.9 knots (NNE)',
    healthScore: 76,
    lastUpdated: '2 mins ago',
    story: 'Situated along the Coromandel Coast of Southeast India, Chennai is a critical marine observation hub. Coastal upwelling during the summer monsoon brings nutrient-rich deeper waters to the surface, supporting vibrant coastal biodiversity and local fisheries monitored by nearby ARGO floats.',
    insights: [
      'Coastal water quality station reports healthy dissolved oxygen levels at 6.2 mg/L.',
      'Nearshore surface temperature current tracking shows northward drift driven by the East India Coastal Current (EICC).',
      'Salinity gradients reflect seasonal mixing with runoff from the Adyar and Cooum rivers.',
      'Active ARGO Float #ARGO-IN-9842 drifting 42 nautical miles offshore broadcasting CTD profile data.'
    ],
    historicalEvents: [
      { year: '2023', event: 'Cyclone Michaung', impact: 'Coastal storm surge telemetry recorded 1.2m sea height anomaly.' },
      { year: '2022', event: 'Smart Buoy Installation', impact: 'Real-time coastal monitoring node integrated with FloatChat network.' }
    ],
    argoFloatIds: ['ARGO-IN-9842'],
    depthProfile: [
      { depth: 0, temp: 28.8, salinity: 33.5 },
      { depth: 25, temp: 28.0, salinity: 33.8 },
      { depth: 50, temp: 26.2, salinity: 34.2 },
      { depth: 100, temp: 22.1, salinity: 34.8 },
      { depth: 250, temp: 15.2, salinity: 35.0 },
      { depth: 400, temp: 11.5, salinity: 35.0 }
    ],
    timeSeriesData: [
      { date: '00:00', temp: 28.5, salinity: 33.4, currentSpeed: 1.8 },
      { date: '04:00', temp: 28.6, salinity: 33.5, currentSpeed: 1.8 },
      { date: '08:00', temp: 28.9, salinity: 33.5, currentSpeed: 2.0 },
      { date: '12:00', temp: 29.1, salinity: 33.6, currentSpeed: 2.1 },
      { date: '16:00', temp: 28.9, salinity: 33.5, currentSpeed: 1.9 },
      { date: '20:00', temp: 28.8, salinity: 33.5, currentSpeed: 1.9 }
    ]
  },
  {
    id: 'mumbai',
    name: 'Mumbai offshore (Arabian Sea)',
    type: 'city',
    nearestOcean: 'Arabian Sea',
    lat: 18.969,
    lng: 72.821,
    zoomDistance: 2.2,
    avgTemp: 28.2,
    avgSalinity: 36.4,
    avgDepth: 820,
    avgPressure: 835,
    currentSpeed: '2.1 knots (S)',
    healthScore: 81,
    lastUpdated: '15 mins ago',
    story: 'Offshore from Mumbai in the Arabian Sea lies a highly dynamic ocean zone characterized by high surface evaporation, strong seasonal winds, and high salinity waters. High rates of evaporation over the northern Arabian Sea produce dense Arabian Sea High Salinity Water (ASHSW).',
    insights: [
      'Elevated surface salinity (36.4 PSU) resulting from dry continental trade winds and high evaporation rates.',
      'Strong seasonal upwelling along the western coast of India supports high chlorophyll-a concentrations.',
      'West India Coastal Current (WICC) reversing direction in response to winter monsoons.',
      'High density surface layer subducting southward into the central Indian Ocean basin.'
    ],
    historicalEvents: [
      { year: '2023', event: 'Very Severe Cyclonic Storm Biparjoy', impact: 'Deep thermocline mixing down to 180m depth.' },
      { year: '2021', event: 'Arabian Sea Warming Study', impact: 'Long-term temperature rise trend estimated at +0.12°C/decade.' }
    ],
    argoFloatIds: ['ARGO-AS-7711', 'ARGO-AS-7712'],
    depthProfile: [
      { depth: 0, temp: 28.2, salinity: 36.4 },
      { depth: 50, temp: 27.0, salinity: 36.5 },
      { depth: 100, temp: 23.5, salinity: 36.1 },
      { depth: 250, temp: 16.0, salinity: 35.6 },
      { depth: 500, temp: 10.8, salinity: 35.2 },
      { depth: 800, temp: 7.5, salinity: 35.0 }
    ],
    timeSeriesData: [
      { date: '00:00', temp: 28.0, salinity: 36.3, currentSpeed: 2.0 },
      { date: '04:00', temp: 28.1, salinity: 36.4, currentSpeed: 2.1 },
      { date: '08:00', temp: 28.3, salinity: 36.4, currentSpeed: 2.2 },
      { date: '12:00', temp: 28.5, salinity: 36.5, currentSpeed: 2.3 },
      { date: '16:00', temp: 28.3, salinity: 36.4, currentSpeed: 2.1 },
      { date: '20:00', temp: 28.2, salinity: 36.4, currentSpeed: 2.1 }
    ]
  },
  {
    id: 'pacific-ocean',
    name: 'Pacific Ocean',
    type: 'ocean',
    nearestOcean: 'Pacific Ocean',
    lat: 0.0,
    lng: -160.0,
    zoomDistance: 5.0,
    avgTemp: 25.8,
    avgSalinity: 34.6,
    avgDepth: 4280,
    avgPressure: 4350,
    currentSpeed: '3.8 knots (W)',
    healthScore: 86,
    lastUpdated: '1 min ago',
    story: 'The Pacific Ocean is the largest and deepest of Earth’s ocean divisions. Stretching from the Arctic in the north to the Southern Ocean in the south, it governs global climate dynamics through El Niño-Southern Oscillation (ENSO) cycles and houses the vast North and South Pacific Subtropical Gyres.',
    insights: [
      'Neutral ENSO status currently recorded across Niño 3.4 region with sea surface temperatures near baseline.',
      'Equatorial Pacific trade winds pushing warm surface water westward toward Australia and Indonesia.',
      'Active ARGO arrays (~1,800 floats) transmit temperature and salinity profiles every 10 days.',
      'Pacific Decadal Oscillation (PDO) phase transition detected in northern Pacific surface layer.'
    ],
    historicalEvents: [
      { year: '2023-2024', event: 'Strong El Niño Event', impact: 'Global mean sea surface temperature reached historical high.' },
      { year: '2022', event: 'Hunga Tonga Eruption', impact: 'Tsunami waves and underwater acoustic waves logged by deep ARGO sensors.' }
    ],
    argoFloatIds: ['ARGO-PAC-3312', 'ARGO-PAC-3314', 'ARGO-PAC-3320'],
    depthProfile: [
      { depth: 0, temp: 25.8, salinity: 34.6 },
      { depth: 50, temp: 25.1, salinity: 34.8 },
      { depth: 100, temp: 20.4, salinity: 35.1 },
      { depth: 250, temp: 13.2, salinity: 34.7 },
      { depth: 500, temp: 8.0, salinity: 34.5 },
      { depth: 1000, temp: 4.2, salinity: 34.6 },
      { depth: 2000, temp: 2.1, salinity: 34.6 }
    ],
    timeSeriesData: [
      { date: '00:00', temp: 25.6, salinity: 34.5, currentSpeed: 3.7 },
      { date: '04:00', temp: 25.7, salinity: 34.6, currentSpeed: 3.8 },
      { date: '08:00', temp: 25.9, salinity: 34.6, currentSpeed: 3.9 },
      { date: '12:00', temp: 26.0, salinity: 34.7, currentSpeed: 4.0 },
      { date: '16:00', temp: 25.9, salinity: 34.6, currentSpeed: 3.8 },
      { date: '20:00', temp: 25.8, salinity: 34.6, currentSpeed: 3.8 }
    ]
  },
  {
    id: 'atlantic-ocean',
    name: 'Atlantic Ocean',
    type: 'ocean',
    nearestOcean: 'Atlantic Ocean',
    lat: 25.0,
    lng: -40.0,
    zoomDistance: 4.8,
    avgTemp: 23.4,
    avgSalinity: 36.8,
    avgDepth: 3646,
    avgPressure: 3700,
    currentSpeed: '4.2 knots (N)',
    healthScore: 74,
    lastUpdated: '8 mins ago',
    story: 'The Atlantic Ocean is known for driving the Atlantic Meridional Overturning Circulation (AMOC), a global conveyor belt transporting warm tropical water northward via the Gulf Stream. AMOC stability is critical to climate regulation across North America and Western Europe.',
    insights: [
      'Gulf Stream velocity measuring 4.2 knots along North American eastern seaboard.',
      'Tropical Atlantic surface warming remains +1.2°C above 30-year average baseline.',
      'Sargasso Sea surface salinity elevated due to high evaporation rates under subtropical high pressure.',
      'Deep convection monitoring in Labrador Sea shows active North Atlantic Deep Water formation.'
    ],
    historicalEvents: [
      { year: '2024', event: 'Record Tropical Warming', impact: 'Main Development Region (MDR) sea surface temps set all-time record.' },
      { year: '2023', event: 'AMOC Flux Array Benchmark', impact: 'RAPID array confirmed ongoing monitoring of deep Atlantic overturn.' }
    ],
    argoFloatIds: ['ARGO-ATL-1102', 'ARGO-ATL-1105'],
    depthProfile: [
      { depth: 0, temp: 23.4, salinity: 36.8 },
      { depth: 50, temp: 22.8, salinity: 36.9 },
      { depth: 100, temp: 18.5, salinity: 36.4 },
      { depth: 250, temp: 12.0, salinity: 35.6 },
      { depth: 500, temp: 7.8, salinity: 35.1 },
      { depth: 1000, temp: 4.5, salinity: 35.0 },
      { depth: 2000, temp: 2.8, salinity: 34.9 }
    ],
    timeSeriesData: [
      { date: '00:00', temp: 23.2, salinity: 36.7, currentSpeed: 4.0 },
      { date: '04:00', temp: 23.3, salinity: 36.8, currentSpeed: 4.1 },
      { date: '08:00', temp: 23.5, salinity: 36.8, currentSpeed: 4.3 },
      { date: '12:00', temp: 23.6, salinity: 36.9, currentSpeed: 4.4 },
      { date: '16:00', temp: 23.5, salinity: 36.8, currentSpeed: 4.2 },
      { date: '20:00', temp: 23.4, salinity: 36.8, currentSpeed: 4.2 }
    ]
  },
  {
    id: 'arctic-ocean',
    name: 'Arctic Ocean',
    type: 'ocean',
    nearestOcean: 'Arctic Ocean',
    lat: 82.0,
    lng: 0.0,
    zoomDistance: 3.8,
    avgTemp: -1.2,
    avgSalinity: 31.2,
    avgDepth: 1038,
    avgPressure: 1050,
    currentSpeed: '0.8 knots (SW)',
    healthScore: 65,
    lastUpdated: '20 mins ago',
    story: 'The Arctic Ocean is the smallest and shallowest of the world’s major ocean divisions. Cold, sea-ice covered, and highly sensitive to polar amplification, it plays a key role in Earth’s albedo and global thermohaline circulation.',
    insights: [
      'Polar sea ice extent monitoring indicates rapid seasonal melt and thinning ice cover.',
      'Beaufort Gyre accumulation of fresh water reaching historic high levels due to river discharge and ice melt.',
      'Atlantic Water inflow through Fram Strait introducing anomalous thermal pulse at 200m depth.',
      'Specialized Ice-Tethered Profilers (ITPs) reporting CTD telemetry under polar ice canopy.'
    ],
    historicalEvents: [
      { year: '2024', event: 'Fram Strait Thermal Peak', impact: 'Warm Atlantic inflow recorded at +2.1°C above polar normal.' },
      { year: '2020', event: 'MOSAiC Expedition', impact: 'Year-long drift provided baseline polar atmosphere-ice-ocean data.' }
    ],
    argoFloatIds: ['ARGO-ARC-001', 'ARGO-ARC-004'],
    depthProfile: [
      { depth: 0, temp: -1.2, salinity: 31.2 },
      { depth: 25, temp: -1.5, salinity: 32.0 },
      { depth: 50, temp: -1.0, salinity: 33.1 },
      { depth: 100, temp: 0.5, salinity: 34.2 },
      { depth: 250, temp: 1.8, salinity: 34.8 },
      { depth: 500, temp: 0.8, salinity: 34.9 }
    ],
    timeSeriesData: [
      { date: '00:00', temp: -1.3, salinity: 31.1, currentSpeed: 0.7 },
      { date: '04:00', temp: -1.3, salinity: 31.2, currentSpeed: 0.8 },
      { date: '08:00', temp: -1.2, salinity: 31.2, currentSpeed: 0.8 },
      { date: '12:00', temp: -1.1, salinity: 31.3, currentSpeed: 0.9 },
      { date: '16:00', temp: -1.2, salinity: 31.2, currentSpeed: 0.8 },
      { date: '20:00', temp: -1.2, salinity: 31.2, currentSpeed: 0.8 }
    ]
  },
  {
    id: 'southern-ocean',
    name: 'Southern Ocean',
    type: 'ocean',
    nearestOcean: 'Southern Ocean',
    lat: -62.0,
    lng: 120.0,
    zoomDistance: 4.2,
    avgTemp: 1.8,
    avgSalinity: 34.1,
    avgDepth: 3270,
    avgPressure: 3320,
    currentSpeed: '4.8 knots (E)',
    healthScore: 79,
    lastUpdated: '10 mins ago',
    story: 'Encircling Antarctica, the Southern Ocean is home to the Antarctic Circumpolar Current (ACC)—the largest, strongest ocean current on Earth. It connects the Atlantic, Pacific, and Indian Oceans and absorbs over 40% of all anthropogenic carbon emissions.',
    insights: [
      'Antarctic Circumpolar Current (ACC) flow velocity clocked at 4.8 knots through Drake Passage.',
      'Deep ocean upwelling of Circumpolar Deep Water (CDW) transporting heat toward ice shelf bases.',
      'Biogeochemical ARGO floats monitoring intense spring phytoplankton blooms and carbon drawdown.',
      'Subantarctic Mode Water (SAMW) formation active north of the Subtropical Front.'
    ],
    historicalEvents: [
      { year: '2024', event: 'Winter Ice Minimum', impact: 'Lowest winter sea-ice maximum on satellite record.' },
      { year: '2022', event: 'SOCCOM Array Milestone', impact: '200th biogeochemical float active in Southern Ocean.' }
    ],
    argoFloatIds: ['ARGO-SO-501', 'ARGO-SO-502'],
    depthProfile: [
      { depth: 0, temp: 1.8, salinity: 34.1 },
      { depth: 50, temp: 1.2, salinity: 34.3 },
      { depth: 100, temp: 0.8, salinity: 34.5 },
      { depth: 250, temp: 2.1, salinity: 34.7 },
      { depth: 500, temp: 1.9, salinity: 34.7 },
      { depth: 1000, temp: 1.1, salinity: 34.7 }
    ],
    timeSeriesData: [
      { date: '00:00', temp: 1.7, salinity: 34.0, currentSpeed: 4.6 },
      { date: '04:00', temp: 1.7, salinity: 34.1, currentSpeed: 4.7 },
      { date: '08:00', temp: 1.8, salinity: 34.1, currentSpeed: 4.9 },
      { date: '12:00', temp: 1.9, salinity: 34.2, currentSpeed: 5.0 },
      { date: '16:00', temp: 1.8, salinity: 34.1, currentSpeed: 4.8 },
      { date: '20:00', temp: 1.8, salinity: 34.1, currentSpeed: 4.8 }
    ]
  },
  {
    id: 'sydney',
    name: 'Sydney Coast',
    type: 'city',
    nearestOcean: 'Pacific Ocean',
    lat: -33.8688,
    lng: 151.2093,
    zoomDistance: 2.2,
    avgTemp: 21.5,
    avgSalinity: 35.5,
    avgDepth: 1200,
    avgPressure: 1215,
    currentSpeed: '3.2 knots (S)',
    healthScore: 88,
    lastUpdated: '14 mins ago',
    story: 'Located on Australia’s southeast coast, Sydney is situated directly along the path of the East Australian Current (EAC). The EAC transports warm tropical waters southward from the Coral Sea, influencing local marine biodiversity, weather, and pelagic ecosystems.',
    insights: [
      'East Australian Current (EAC) poleward flow jet active with warm core eddies off Tasman Sea.',
      'Subtropical coastal water temperatures 1.1°C above seasonal climatology.',
      'Active kelp forest biodiversity monitoring underway near Botany Bay.',
      'ARGO Float #ARGO-PAC-3314 profiling EAC eddy separation point.'
    ],
    historicalEvents: [
      { year: '2024', event: 'Tasman Sea Marine Heatwave', impact: 'Extended warm eddy persistence recorded for 60 days.' }
    ],
    argoFloatIds: ['ARGO-PAC-3314'],
    depthProfile: [
      { depth: 0, temp: 21.5, salinity: 35.5 },
      { depth: 50, temp: 20.2, salinity: 35.6 },
      { depth: 100, temp: 17.8, salinity: 35.5 },
      { depth: 250, temp: 13.5, salinity: 35.1 },
      { depth: 500, temp: 9.0, salinity: 34.8 }
    ],
    timeSeriesData: [
      { date: '00:00', temp: 21.3, salinity: 35.4, currentSpeed: 3.0 },
      { date: '04:00', temp: 21.4, salinity: 35.5, currentSpeed: 3.1 },
      { date: '08:00', temp: 21.6, salinity: 35.5, currentSpeed: 3.3 },
      { date: '12:00', temp: 21.7, salinity: 35.6, currentSpeed: 3.4 },
      { date: '16:00', temp: 21.5, salinity: 35.5, currentSpeed: 3.2 },
      { date: '20:00', temp: 21.5, salinity: 35.5, currentSpeed: 3.2 }
    ]
  },
  {
    id: 'tokyo',
    name: 'Tokyo Bay & Kuroshio',
    type: 'city',
    nearestOcean: 'Pacific Ocean',
    lat: 35.6762,
    lng: 139.6503,
    zoomDistance: 2.2,
    avgTemp: 22.8,
    avgSalinity: 34.8,
    avgDepth: 1850,
    avgPressure: 1880,
    currentSpeed: '3.9 knots (NE)',
    healthScore: 85,
    lastUpdated: '18 mins ago',
    story: 'Off the coast of Tokyo flows the Kuroshio Current, the Pacific equivalent of the Atlantic Gulf Stream. Transporting vast amounts of warm tropical water from the Philippines northward toward Japan, it strongly impacts Japan’s weather, fisheries, and ocean energy.',
    insights: [
      'Kuroshio large meander path stable offshore of Kii Peninsula.',
      'Surface temperature gradient across Kuroshio front exceeds 4.5°C over 20 nautical miles.',
      'High thermal transport contributing to sea surface warmth east of Honshu.',
      'JAMSTEC ARGO array actively measuring deep Kuroshio extension transport.'
    ],
    historicalEvents: [
      { year: '2023', event: 'Kuroshio Meander Persistence', impact: 'Longest continuous meander path recorded in 40 years.' }
    ],
    argoFloatIds: ['ARGO-PAC-3320'],
    depthProfile: [
      { depth: 0, temp: 22.8, salinity: 34.8 },
      { depth: 50, temp: 21.5, salinity: 34.9 },
      { depth: 100, temp: 18.0, salinity: 34.7 },
      { depth: 250, temp: 12.2, salinity: 34.4 },
      { depth: 500, temp: 7.5, salinity: 34.2 }
    ],
    timeSeriesData: [
      { date: '00:00', temp: 22.6, salinity: 34.7, currentSpeed: 3.7 },
      { date: '04:00', temp: 22.7, salinity: 34.8, currentSpeed: 3.8 },
      { date: '08:00', temp: 22.9, salinity: 34.8, currentSpeed: 4.0 },
      { date: '12:00', temp: 23.1, salinity: 34.9, currentSpeed: 4.1 },
      { date: '16:00', temp: 22.9, salinity: 34.8, currentSpeed: 3.9 },
      { date: '20:00', temp: 22.8, salinity: 34.8, currentSpeed: 3.9 }
    ]
  },
  {
    id: 'san-francisco',
    name: 'San Francisco Coast',
    type: 'city',
    nearestOcean: 'Pacific Ocean',
    lat: 37.7749,
    lng: -122.4194,
    zoomDistance: 2.2,
    avgTemp: 13.5,
    avgSalinity: 33.8,
    avgDepth: 650,
    avgPressure: 660,
    currentSpeed: '1.4 knots (S)',
    healthScore: 89,
    lastUpdated: '22 mins ago',
    story: 'The coastal waters off San Francisco are governed by the southward-flowing California Current and intense coastal upwelling during spring and summer. Strong northwesterly winds draw deep, nutrient-dense, cool waters up into the photic zone, fostering rich kelp forest ecosystems.',
    insights: [
      'Active wind-driven coastal upwelling lowering surface temperatures to 13.5°C.',
      'High chlorophyll concentrations detected along Farallon Islands biological marine sanctuary.',
      'Ocean acidification monitoring sensors reporting surface pH at 7.98.',
      'ARGO profiling float array monitoring California Undercurrent northward counter-flow.'
    ],
    historicalEvents: [
      { year: '2022', event: 'Upwelling Intensity Record', impact: 'Strongest spring nutrient transport logged in Greater Farallones.' }
    ],
    argoFloatIds: ['ARGO-PAC-3312'],
    depthProfile: [
      { depth: 0, temp: 13.5, salinity: 33.8 },
      { depth: 50, temp: 11.2, salinity: 33.9 },
      { depth: 100, temp: 9.8, salinity: 34.0 },
      { depth: 250, temp: 7.5, salinity: 34.1 },
      { depth: 500, temp: 5.8, salinity: 34.3 }
    ],
    timeSeriesData: [
      { date: '00:00', temp: 13.3, salinity: 33.7, currentSpeed: 1.3 },
      { date: '04:00', temp: 13.4, salinity: 33.8, currentSpeed: 1.3 },
      { date: '08:00', temp: 13.6, salinity: 33.8, currentSpeed: 1.5 },
      { date: '12:00', temp: 13.7, salinity: 33.9, currentSpeed: 1.6 },
      { date: '16:00', temp: 13.6, salinity: 33.8, currentSpeed: 1.4 },
      { date: '20:00', temp: 13.5, salinity: 33.8, currentSpeed: 1.4 }
    ]
  },
  {
    id: 'red-sea',
    name: 'Red Sea Rift Valley',
    type: 'ocean',
    nearestOcean: 'Indian Ocean',
    lat: 20.0,
    lng: 38.5,
    zoomDistance: 3.0,
    avgTemp: 30.2,
    avgSalinity: 40.5,
    avgDepth: 1950,
    avgPressure: 1980,
    currentSpeed: '1.2 knots (NW)',
    healthScore: 84,
    lastUpdated: '4 mins ago',
    story: 'The Red Sea is one of the warmest and saltiest bodies of water on Earth. Nestled between Africa and the Arabian Peninsula, its enclosed geography and high evaporation rates produce ultra-saline deep water and resilient coral reef ecosystems.',
    insights: [
      'Record high salinity levels reaching 40.5 PSU due to intense evaporation and minimal freshwater inflow.',
      'Thermal resilience observed in northern Red Sea coral reefs surviving temperatures above 30°C.',
      'Active seafloor spreading creating deep brine pools with hydrothermal chemical signatures.',
      'ARGO profiling sensors tracking seasonal exchange through Bab-el-Mandeb Strait.'
    ],
    historicalEvents: [
      { year: '2024', event: 'Hydrothermal Vent Discovery', impact: 'Sub-surface temperature anomalies logged at 1500m depth.' }
    ],
    argoFloatIds: ['ARGO-AS-7711'],
    depthProfile: [
      { depth: 0, temp: 30.2, salinity: 40.5 },
      { depth: 100, temp: 26.5, salinity: 40.6 },
      { depth: 500, temp: 21.8, salinity: 40.5 },
      { depth: 1000, temp: 21.6, salinity: 40.5 }
    ],
    timeSeriesData: [
      { date: '00:00', temp: 30.0, salinity: 40.4, currentSpeed: 1.1 },
      { date: '04:00', temp: 30.1, salinity: 40.5, currentSpeed: 1.2 },
      { date: '08:00', temp: 30.3, salinity: 40.5, currentSpeed: 1.3 },
      { date: '12:00', temp: 30.5, salinity: 40.6, currentSpeed: 1.4 },
      { date: '16:00', temp: 30.3, salinity: 40.5, currentSpeed: 1.2 },
      { date: '20:00', temp: 30.2, salinity: 40.5, currentSpeed: 1.2 }
    ]
  },
  {
    id: 'mediterranean',
    name: 'Mediterranean Sea',
    type: 'ocean',
    nearestOcean: 'Atlantic Ocean',
    lat: 35.0,
    lng: 18.0,
    zoomDistance: 3.2,
    avgTemp: 22.4,
    avgSalinity: 38.6,
    avgDepth: 1500,
    avgPressure: 1520,
    currentSpeed: '1.6 knots (E)',
    healthScore: 73,
    lastUpdated: '11 mins ago',
    story: 'An intercontinental sea bounded by Europe, Asia, and Africa. High evaporation rates make the Mediterranean denser and saltier than the Atlantic, driving Mediterranean Outflow Water (MOW) into the North Atlantic.',
    insights: [
      'Mediterranean Outflow Water (MOW) cascading through Gibraltar Strait into deep Atlantic layers.',
      'Surface marine heatwaves recorded in eastern Levant basin with SST exceeding +2.1°C anomaly.',
      'Coastal seagrass (Posidonia) meadows providing significant carbon sequestration.',
      'Euro-Argo float cluster monitoring thermohaline deep convection in Levantine Basin.'
    ],
    historicalEvents: [
      { year: '2023', event: 'Levantine Basin Marine Heatwave', impact: 'Thermal peak recorded at 28.5°C in August.' }
    ],
    argoFloatIds: ['ARGO-ATL-1102'],
    depthProfile: [
      { depth: 0, temp: 22.4, salinity: 38.6 },
      { depth: 50, temp: 19.5, salinity: 38.7 },
      { depth: 250, temp: 14.2, salinity: 38.8 },
      { depth: 1000, temp: 13.5, salinity: 38.5 }
    ],
    timeSeriesData: [
      { date: '00:00', temp: 22.2, salinity: 38.5, currentSpeed: 1.5 },
      { date: '04:00', temp: 22.3, salinity: 38.6, currentSpeed: 1.5 },
      { date: '08:00', temp: 22.5, salinity: 38.6, currentSpeed: 1.7 },
      { date: '12:00', temp: 22.7, salinity: 38.7, currentSpeed: 1.8 },
      { date: '16:00', temp: 22.5, salinity: 38.6, currentSpeed: 1.6 },
      { date: '20:00', temp: 22.4, salinity: 38.6, currentSpeed: 1.6 }
    ]
  },
  {
    id: 'caribbean-sea',
    name: 'Caribbean Sea',
    type: 'ocean',
    nearestOcean: 'Atlantic Ocean',
    lat: 15.0,
    lng: -75.0,
    zoomDistance: 3.5,
    avgTemp: 28.6,
    avgSalinity: 35.8,
    avgDepth: 2200,
    avgPressure: 2230,
    currentSpeed: '2.5 knots (NW)',
    healthScore: 82,
    lastUpdated: '7 mins ago',
    story: 'A tropical sea of the Atlantic Ocean bounded by Mexico, Central America, South America, and the Greater and Lesser Antilles. It plays an essential role in fueling tropical Atlantic storms.',
    insights: [
      'Warm surface water layer (>28.5°C) extending down to 80m depth.',
      'Caribbean Current flowing northwestward into the Gulf of Mexico Loop Current.',
      'Coral reef bleaching monitoring alert active across Mesoamerican barrier reef.',
      'NOAA ARGO profilers recording upper ocean thermal storage.'
    ],
    historicalEvents: [
      { year: '2024', event: 'Hurricane Beryl Heat Transfer', impact: 'Post-storm thermocline mixing cooled surface water by 1.5°C.' }
    ],
    argoFloatIds: ['ARGO-ATL-1105'],
    depthProfile: [
      { depth: 0, temp: 28.6, salinity: 35.8 },
      { depth: 50, temp: 28.1, salinity: 36.1 },
      { depth: 100, temp: 24.5, salinity: 36.5 },
      { depth: 500, temp: 11.2, salinity: 35.2 }
    ],
    timeSeriesData: [
      { date: '00:00', temp: 28.4, salinity: 35.7, currentSpeed: 2.4 },
      { date: '04:00', temp: 28.5, salinity: 35.8, currentSpeed: 2.4 },
      { date: '08:00', temp: 28.7, salinity: 35.8, currentSpeed: 2.6 },
      { date: '12:00', temp: 28.9, salinity: 35.9, currentSpeed: 2.7 },
      { date: '16:00', temp: 28.7, salinity: 35.8, currentSpeed: 2.5 },
      { date: '20:00', temp: 28.6, salinity: 35.8, currentSpeed: 2.5 }
    ]
  },
  {
    id: 'great-barrier-reef',
    name: 'Great Barrier Reef (Coral Sea)',
    type: 'ocean',
    nearestOcean: 'Pacific Ocean',
    lat: -18.0,
    lng: 148.0,
    zoomDistance: 2.8,
    avgTemp: 27.8,
    avgSalinity: 35.2,
    avgDepth: 1100,
    avgPressure: 1120,
    currentSpeed: '2.1 knots (S)',
    healthScore: 77,
    lastUpdated: '16 mins ago',
    story: 'Located off Queensland, Australia, the Coral Sea houses the world’s largest coral reef ecosystem. Intensive satellite and float monitoring tracks thermal stress and water chemistry to protect marine life.',
    insights: [
      'High-resolution thermal sensors tracking reef-wide sea surface temperature anomalies.',
      'South Equatorial Current splitting into East Australian Current and Hiri Current.',
      'Biogeochemical sensors recording pH level at 8.05 with dissolved oxygen at 6.4 mg/L.',
      'IMOS ARGO array deployed to detect seasonal upwelling events.'
    ],
    historicalEvents: [
      { year: '2024', event: 'Mass Coral Bleaching Event', impact: 'Aerial surveys confirmed bleaching across 73% of reef offshore zones.' }
    ],
    argoFloatIds: ['ARGO-PAC-3314'],
    depthProfile: [
      { depth: 0, temp: 27.8, salinity: 35.2 },
      { depth: 50, temp: 26.9, salinity: 35.4 },
      { depth: 100, temp: 22.4, salinity: 35.5 },
      { depth: 500, temp: 9.8, salinity: 34.8 }
    ],
    timeSeriesData: [
      { date: '00:00', temp: 27.6, salinity: 35.1, currentSpeed: 2.0 },
      { date: '04:00', temp: 27.7, salinity: 35.2, currentSpeed: 2.0 },
      { date: '08:00', temp: 27.9, salinity: 35.2, currentSpeed: 2.2 },
      { date: '12:00', temp: 28.1, salinity: 35.3, currentSpeed: 2.3 },
      { date: '16:00', temp: 27.9, salinity: 35.2, currentSpeed: 2.1 },
      { date: '20:00', temp: 27.8, salinity: 35.2, currentSpeed: 2.1 }
    ]
  },
  {
    id: 'gulf-stream-miami',
    name: 'Gulf Stream (Miami Coast)',
    type: 'city',
    nearestOcean: 'Atlantic Ocean',
    lat: 25.7617,
    lng: -80.1918,
    zoomDistance: 2.2,
    avgTemp: 28.2,
    avgSalinity: 36.2,
    avgDepth: 750,
    avgPressure: 765,
    currentSpeed: '4.5 knots (N)',
    healthScore: 83,
    lastUpdated: '9 mins ago',
    story: 'The Straits of Florida off Miami channel the intense northward jet of the Gulf Stream. Transporting over 30 Sverdrups of warm water, it powers European climate moderation.',
    insights: [
      'Peak northward surface velocity measured at 4.5 knots through Florida Straits.',
      'Thermal core temperature 28.2°C maintaining sharp boundary gradient against coastal water.',
      'Autonomous gliders and ARGO profilers logging volume transport fluctuations.',
      'High surface clarity supporting rich pelagic sport fisheries.'
    ],
    historicalEvents: [
      { year: '2023', event: 'Florida Reef Thermal Anomaly', impact: 'Record shallow water temperatures reached 38°C in Florida Bay.' }
    ],
    argoFloatIds: ['ARGO-ATL-1105'],
    depthProfile: [
      { depth: 0, temp: 28.2, salinity: 36.2 },
      { depth: 50, temp: 27.5, salinity: 36.4 },
      { depth: 100, temp: 22.0, salinity: 36.5 },
      { depth: 500, temp: 10.5, salinity: 35.1 }
    ],
    timeSeriesData: [
      { date: '00:00', temp: 28.0, salinity: 36.1, currentSpeed: 4.3 },
      { date: '04:00', temp: 28.1, salinity: 36.2, currentSpeed: 4.4 },
      { date: '08:00', temp: 28.3, salinity: 36.2, currentSpeed: 4.6 },
      { date: '12:00', temp: 28.5, salinity: 36.3, currentSpeed: 4.7 },
      { date: '16:00', temp: 28.3, salinity: 36.2, currentSpeed: 4.5 },
      { date: '20:00', temp: 28.2, salinity: 36.2, currentSpeed: 4.5 }
    ]
  },
  {
    id: 'south-china-sea',
    name: 'South China Sea Basin',
    type: 'ocean',
    nearestOcean: 'Pacific Ocean',
    lat: 12.0,
    lng: 113.0,
    zoomDistance: 3.5,
    avgTemp: 29.0,
    avgSalinity: 33.9,
    avgDepth: 2300,
    avgPressure: 2340,
    currentSpeed: '2.3 knots (SW)',
    healthScore: 81,
    lastUpdated: '13 mins ago',
    story: 'The largest marginal sea in the western Pacific. Monsoon wind reversals drive seasonal circulation and ocean upwelling along Vietnam and Luzon Strait.',
    insights: [
      'Luzon Strait water exchange bringing deep North Pacific water into central basin.',
      'Monsoon-driven seasonal current reversal carrying freshwater plumes across Sunda Shelf.',
      'Active internal wave generation in northern basin observed on satellite radar.',
      'ARGO profiling array maintaining 10-day CTD cycle across deep abyssal plain.'
    ],
    historicalEvents: [
      { year: '2023', event: 'Super Typhoon Yagi Impact', impact: 'Thermocline deepening recorded across northern basin.' }
    ],
    argoFloatIds: ['ARGO-PAC-3320'],
    depthProfile: [
      { depth: 0, temp: 29.0, salinity: 33.9 },
      { depth: 50, temp: 28.2, salinity: 34.2 },
      { depth: 100, temp: 23.5, salinity: 34.6 },
      { depth: 500, temp: 8.9, salinity: 34.5 }
    ],
    timeSeriesData: [
      { date: '00:00', temp: 28.8, salinity: 33.8, currentSpeed: 2.2 },
      { date: '04:00', temp: 28.9, salinity: 33.9, currentSpeed: 2.2 },
      { date: '08:00', temp: 29.1, salinity: 33.9, currentSpeed: 2.4 },
      { date: '12:00', temp: 29.3, salinity: 34.0, currentSpeed: 2.5 },
      { date: '16:00', temp: 29.1, salinity: 33.9, currentSpeed: 2.3 },
      { date: '20:00', temp: 29.0, salinity: 33.9, currentSpeed: 2.3 }
    ]
  }
];

export const ARGO_FLOATS: ArgoFloat[] = [
  {
    id: 'ARGO-IN-9842',
    code: 'IN-9842',
    name: 'Bay of Bengal DeepProfiler 1',
    lat: 14.5,
    lng: 85.2,
    ocean: 'Bay of Bengal',
    nearestCity: 'Chennai',
    depth: 1850,
    temp: 29.2,
    salinity: 32.9,
    battery: 94,
    lastSurface: '14 mins ago',
    status: 'Active',
    deployDate: '2023-04-12',
    trajectoryPoints: [
      { lat: 14.1, lng: 84.8 },
      { lat: 14.3, lng: 85.0 },
      { lat: 14.5, lng: 85.2 }
    ]
  },
  {
    id: 'ARGO-IN-9843',
    code: 'IN-9843',
    name: 'Andaman Basin Observer',
    lat: 12.8,
    lng: 92.4,
    ocean: 'Bay of Bengal',
    nearestCity: 'Port Blair',
    depth: 2000,
    temp: 28.9,
    salinity: 33.1,
    battery: 88,
    lastSurface: '1 hour ago',
    status: 'Transmitting',
    deployDate: '2022-11-05',
    trajectoryPoints: [
      { lat: 12.5, lng: 92.1 },
      { lat: 12.7, lng: 92.3 },
      { lat: 12.8, lng: 92.4 }
    ]
  },
  {
    id: 'ARGO-IN-9850',
    code: 'IN-9850',
    name: 'Equatorial Indian Sentinel',
    lat: 3.2,
    lng: 78.5,
    ocean: 'Indian Ocean',
    nearestCity: 'Colombo',
    depth: 2000,
    temp: 28.4,
    salinity: 34.8,
    battery: 91,
    lastSurface: '32 mins ago',
    status: 'Profiling',
    deployDate: '2023-08-19',
    trajectoryPoints: [
      { lat: 3.0, lng: 78.1 },
      { lat: 3.1, lng: 78.3 },
      { lat: 3.2, lng: 78.5 }
    ]
  },
  {
    id: 'ARGO-AS-7711',
    code: 'AS-7711',
    name: 'Arabian Sea HighSalinity Float',
    lat: 19.8,
    lng: 68.4,
    ocean: 'Arabian Sea',
    nearestCity: 'Mumbai',
    depth: 1600,
    temp: 28.1,
    salinity: 36.5,
    battery: 82,
    lastSurface: '45 mins ago',
    status: 'Active',
    deployDate: '2022-03-30',
    trajectoryPoints: [
      { lat: 19.5, lng: 68.1 },
      { lat: 19.7, lng: 68.3 },
      { lat: 19.8, lng: 68.4 }
    ]
  },
  {
    id: 'ARGO-PAC-3312',
    code: 'PAC-3312',
    name: 'California Current Bio-Argo',
    lat: 36.2,
    lng: -123.5,
    ocean: 'Pacific Ocean',
    nearestCity: 'San Francisco',
    depth: 1000,
    temp: 13.8,
    salinity: 33.7,
    battery: 96,
    lastSurface: '5 mins ago',
    status: 'Active',
    deployDate: '2024-01-15',
    trajectoryPoints: [
      { lat: 36.5, lng: -123.2 },
      { lat: 36.3, lng: -123.4 },
      { lat: 36.2, lng: -123.5 }
    ]
  },
  {
    id: 'ARGO-PAC-3314',
    code: 'PAC-3314',
    name: 'Tasman Sea EAC Jet Float',
    lat: -34.5,
    lng: 153.2,
    ocean: 'Pacific Ocean',
    nearestCity: 'Sydney',
    depth: 2000,
    temp: 20.8,
    salinity: 35.4,
    battery: 79,
    lastSurface: '2 hours ago',
    status: 'Active',
    deployDate: '2023-02-28',
    trajectoryPoints: [
      { lat: -34.1, lng: 152.8 },
      { lat: -34.3, lng: 153.0 },
      { lat: -34.5, lng: 153.2 }
    ]
  },
  {
    id: 'ARGO-ATL-1102',
    code: 'ATL-1102',
    name: 'North Atlantic Gulfstream Tracker',
    lat: 28.4,
    lng: -76.8,
    ocean: 'Atlantic Ocean',
    nearestCity: 'Miami',
    depth: 2000,
    temp: 24.5,
    salinity: 36.7,
    battery: 89,
    lastSurface: '18 mins ago',
    status: 'Active',
    deployDate: '2023-09-01',
    trajectoryPoints: [
      { lat: 28.0, lng: -77.2 },
      { lat: 28.2, lng: -77.0 },
      { lat: 28.4, lng: -76.8 }
    ]
  },
  {
    id: 'ARGO-SO-501',
    code: 'SO-501',
    name: 'Antarctic Circumpolar Deep-Seeker',
    lat: -58.2,
    lng: 110.5,
    ocean: 'Southern Ocean',
    depth: 4000,
    temp: 1.5,
    salinity: 34.2,
    battery: 85,
    lastSurface: '3 hours ago',
    status: 'Profiling',
    deployDate: '2022-12-10',
    trajectoryPoints: [
      { lat: -58.0, lng: 109.8 },
      { lat: -58.1, lng: 110.1 },
      { lat: -58.2, lng: 110.5 }
    ]
  }
];

export const INITIAL_NOTIFICATIONS: OceanNotification[] = [
  {
    id: 'notif-1',
    title: 'Marine Heatwave Detected',
    message: 'Bay of Bengal sea surface temperature exceeds 29.4°C (+1.4°C anomaly above seasonal normal).',
    type: 'heatwave',
    severity: 'critical',
    timestamp: '10 mins ago',
    locationId: 'bay-of-bengal',
    read: false
  },
  {
    id: 'notif-2',
    title: 'New ARGO Float Started',
    message: 'ARGO Float #IN-9842 successfully deployed off Chennai coast, broadcasting initial CTD profile.',
    type: 'float',
    severity: 'info',
    timestamp: '25 mins ago',
    locationId: 'chennai',
    read: false
  },
  {
    id: 'notif-3',
    title: 'High Salinity Alert',
    message: 'Arabian Sea surface salinity reached 36.6 PSU due to dry winter trade wind evaporation.',
    type: 'salinity',
    severity: 'warning',
    timestamp: '1 hour ago',
    locationId: 'arabian-sea',
    read: false
  },
  {
    id: 'notif-4',
    title: 'Cyclone Alert',
    message: 'Low pressure tropical depression intensifying over Equatorial Indian Ocean; surface wind vectors at 34 knots.',
    type: 'cyclone',
    severity: 'critical',
    timestamp: '2 hours ago',
    locationId: 'indian-ocean',
    read: false
  },
  {
    id: 'notif-5',
    title: 'Temperature Spike',
    message: 'Sudden +2.1°C surface thermal spike logged by Kuroshio Current profiler off Tokyo Bay.',
    type: 'temp',
    severity: 'warning',
    timestamp: '3 hours ago',
    locationId: 'tokyo',
    read: false
  },
  {
    id: 'notif-6',
    title: 'Float Offline Signal',
    message: 'ARGO-ARC-004 in Arctic Ocean under-ice profiler missed scheduled 10-day satellite telemetry window.',
    type: 'float',
    severity: 'warning',
    timestamp: '5 hours ago',
    locationId: 'arctic-ocean',
    read: false
  },
  {
    id: 'notif-7',
    title: 'Strong Ocean Current',
    message: 'Antarctic Circumpolar Current velocity surged to 4.8 knots through Drake Passage.',
    type: 'current',
    severity: 'info',
    timestamp: '6 hours ago',
    locationId: 'southern-ocean',
    read: true
  },
  {
    id: 'notif-8',
    title: 'Ocean Baseline Stable',
    message: 'Pacific Ocean ENSO neutral condition verified across 180 ARGO float profilers.',
    type: 'stable',
    severity: 'normal',
    timestamp: '8 hours ago',
    locationId: 'pacific-ocean',
    read: true
  }
];

