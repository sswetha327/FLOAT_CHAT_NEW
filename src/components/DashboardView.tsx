import React, { useState } from 'react';
import { OceanLocation, ArgoFloat } from '../types';
import {
  Thermometer,
  Droplets,
  Gauge,
  Radio,
  Wind,
  ShieldCheck,
  TrendingUp,
  Activity,
  Layers,
  Globe,
  ExternalLink,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { motion } from 'motion/react';
import { MetricDetailModal, MetricDetailData } from './MetricDetailModal';

interface DashboardViewProps {
  locations: OceanLocation[];
  argoFloats: ArgoFloat[];
  onSelectLocation: (loc: OceanLocation) => void;
  selectedLocation?: OceanLocation | null;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  locations,
  argoFloats,
  onSelectLocation,
  selectedLocation,
}) => {
  const [selectedMetric, setSelectedMetric] = useState<MetricDetailData | null>(null);

  const locs = locations || [];
  const floats = argoFloats || [];

  // Active ocean scope state
  const [activeLocationId, setActiveLocationId] = useState<string>(selectedLocation?.id || 'all');

  const activeLocation = locs.find((l) => l.id === activeLocationId) || null;

  const displayOceanName = activeLocation
    ? activeLocation.name
    : 'Global Ocean Network (All Basins)';

  const displayOceanBasin = activeLocation
    ? `${activeLocation.nearestOcean} • Region: ${activeLocation.type}`
    : 'Indian Ocean, Pacific Ocean, Atlantic Ocean, Southern Ocean, Arctic Ocean';

  // Aggregate stats for global default
  const avgTempGlobal = locs.length
    ? (locs.reduce((acc, l) => acc + (l.avgTemp || 0), 0) / locs.length).toFixed(1)
    : '0';

  const avgSalinityGlobal = locs.length
    ? (locs.reduce((acc, l) => acc + (l.avgSalinity || 0), 0) / locs.length).toFixed(1)
    : '0';

  const avgHealthScore = locs.length
    ? Math.round(locs.reduce((acc, l) => acc + (l.healthScore || 0), 0) / locs.length)
    : 0;

  const activeFloatsCount = floats.filter((f) => f.status === 'Active').length;

  // Values rendered on the cards
  const activeTemp = activeLocation ? `${activeLocation.avgTemp}°C` : `${avgTempGlobal}°C`;
  const activeSalinity = activeLocation ? `${activeLocation.avgSalinity} PSU` : `${avgSalinityGlobal} PSU`;
  const activePressure = activeLocation ? `${activeLocation.avgPressure} dbar` : '2,040 dbar';
  const activeFloatCount = activeLocation ? `${activeLocation.argoFloatIds.length}` : `${activeFloatsCount}`;
  const activeCurrents = activeLocation ? activeLocation.currentSpeed : '2.8 knots';
  const activeHealth = activeLocation ? `${activeLocation.healthScore}` : `${avgHealthScore}`;

  const chartComparisonData = locs.map((loc) => ({
    name: (loc.name || '').replace(' Ocean', '').replace(' offshore (Arabian Sea)', '').replace(' Bay & Kuroshio', ''),
    temp: loc.avgTemp || 0,
    salinity: loc.avgSalinity || 0,
    health: loc.healthScore || 0,
  }));

  // Metric Click Handlers
  const openMetricDetail = (type: 'temp' | 'salinity' | 'pressure' | 'floats' | 'currents' | 'health') => {
    switch (type) {
      case 'temp':
        setSelectedMetric({
          id: 'temperature',
          title: `Sea Surface Temperature — ${displayOceanName}`,
          subtitle: `Thermal Distribution & Ocean Heat Content for ${displayOceanName}`,
          unit: '°C',
          currentValue: activeTemp,
          changeRate: '+0.4°C vs Mean',
          iconType: 'temp',
          color: '#00B8D9',
          aiExplanation: `Sea surface temperature in ${displayOceanName} (${displayOceanBasin}) exhibits thermal parameters measured at ${activeTemp}. Solar radiative forcing and upper layer thermocline mixing maintain upper ocean heat content.`,
          timeSeriesData: {
            Current: [
              { label: '00:00', value: 28.0 },
              { label: '04:00', value: 28.1 },
              { label: '08:00', value: 28.3 },
              { label: '12:00', value: 28.7 },
              { label: '16:00', value: 28.6 },
              { label: '20:00', value: 28.4 },
            ],
            'Past Week': [
              { label: 'Mon', value: 27.8 },
              { label: 'Tue', value: 28.0 },
              { label: 'Wed', value: 28.1 },
              { label: 'Thu', value: 28.3 },
              { label: 'Fri', value: 28.4 },
              { label: 'Sat', value: 28.5 },
              { label: 'Sun', value: 28.4 },
            ],
          },
          metricsGrid: [
            { label: 'Selected Ocean', value: displayOceanName, note: displayOceanBasin },
            { label: 'Mean Surface Temp', value: activeTemp, note: 'CTD Telemetry' },
            { label: 'Mixed Layer Depth', value: '42 meters', note: 'Isothermal boundary' },
            { label: 'Thermal Anomaly', value: '+0.4°C', note: '30-yr baseline' },
          ],
        });
        break;

      case 'salinity':
        setSelectedMetric({
          id: 'salinity',
          title: `Ocean Salinity Concentration — ${displayOceanName}`,
          subtitle: `Practical Salinity Units (PSU) for ${displayOceanName}`,
          unit: 'PSU',
          currentValue: activeSalinity,
          changeRate: 'Stable',
          iconType: 'salinity',
          color: '#2563EB',
          aiExplanation: `Salinity in ${displayOceanName} is measured at ${activeSalinity}. Salinity gradients in this region are governed by local sea surface evaporation versus freshwater precipitation or river plume discharge.`,
          timeSeriesData: {
            'Past Week': [
              { label: 'Mon', value: 34.6 },
              { label: 'Tue', value: 34.7 },
              { label: 'Wed', value: 34.7 },
              { label: 'Thu', value: 34.8 },
              { label: 'Fri', value: 34.8 },
              { label: 'Sat', value: 34.9 },
              { label: 'Sun', value: 34.8 },
            ],
          },
          metricsGrid: [
            { label: 'Selected Ocean', value: displayOceanName, note: displayOceanBasin },
            { label: 'Mean Salinity', value: activeSalinity, note: 'PSU Concentration' },
            { label: 'Red Sea Baseline', value: '40.5 PSU', note: 'Max Evaporation' },
            { label: 'Bay of Bengal Min', value: '32.8 PSU', note: 'Freshwater Plume' },
          ],
        });
        break;

      case 'pressure':
        setSelectedMetric({
          id: 'pressure',
          title: `Hydrostatic Pressure — ${displayOceanName}`,
          subtitle: `Decibar Depth Range for ${displayOceanName}`,
          unit: 'dbar',
          currentValue: activePressure,
          changeRate: 'Nominal Cycle',
          iconType: 'pressure',
          color: '#7C3AED',
          aiExplanation: `Hydrostatic profiling pressure in ${displayOceanName} reaches ${activePressure} (~2,000 meters depth). ARGO float CTD sensors record conductivity, temperature, and pressure during continuous 10-day vertical ascent cycles.`,
          timeSeriesData: {
            'Past Week': [
              { label: 'Mon', value: 2010 },
              { label: 'Tue', value: 2020 },
              { label: 'Wed', value: 2035 },
              { label: 'Thu', value: 2040 },
              { label: 'Fri', value: 2040 },
              { label: 'Sat', value: 2045 },
              { label: 'Sun', value: 2040 },
            ],
          },
          metricsGrid: [
            { label: 'Selected Ocean', value: displayOceanName, note: displayOceanBasin },
            { label: 'Target Pressure', value: activePressure, note: '2,000m depth' },
            { label: 'Sensor Precision', value: '±0.1 dbar', note: 'High accuracy' },
            { label: 'Water Density', value: '1027.8 kg/m³', note: 'Abyssal' },
          ],
        });
        break;

      case 'floats':
        setSelectedMetric({
          id: 'floats',
          title: `ARGO Float Network — ${displayOceanName}`,
          subtitle: `Active Autonomous Profiling Robots in ${displayOceanName}`,
          unit: 'Floats',
          currentValue: `${activeFloatCount} Floats`,
          changeRate: '98% Online',
          iconType: 'floats',
          color: '#F59E0B',
          aiExplanation: `There are currently ${activeFloatCount} active ARGO profiling floats monitoring ${displayOceanName}. These autonomous ocean robots dive down to 2,000m and broadcast real-time CTD data to satellites.`,
          timeSeriesData: {
            'Past Week': [
              { label: 'Mon', value: 3880 },
              { label: 'Tue', value: 3895 },
              { label: 'Wed', value: 3905 },
              { label: 'Thu', value: 3915 },
              { label: 'Fri', value: 3920 },
              { label: 'Sat', value: 3920 },
              { label: 'Sun', value: 3920 },
            ],
          },
          metricsGrid: [
            { label: 'Selected Ocean', value: displayOceanName, note: displayOceanBasin },
            { label: 'Active Float Count', value: `${activeFloatCount} Floats`, note: 'Broadcasting CTD' },
            { label: 'Global Fleet Total', value: '3,900+ Floats', note: 'Iridium Link' },
            { label: 'Telemetry Status', value: 'Live Online', note: 'Every 10 days' },
          ],
        });
        break;

      case 'currents':
        setSelectedMetric({
          id: 'currents',
          title: `Surface Current Speed — ${displayOceanName}`,
          subtitle: `Horizontal Transport Velocity in ${displayOceanName}`,
          unit: 'knots',
          currentValue: activeCurrents,
          changeRate: 'Peak: 4.8 knots',
          iconType: 'currents',
          color: '#10B981',
          aiExplanation: `Ocean surface currents in ${displayOceanName} travel at a mean velocity of ${activeCurrents}. Geostrophic pressure gradients, trade wind forcing, and Coriolis acceleration drive surface circulation vectors.`,
          timeSeriesData: {
            'Past Week': [
              { label: 'Mon', value: 2.5 },
              { label: 'Tue', value: 2.6 },
              { label: 'Wed', value: 2.8 },
              { label: 'Thu', value: 2.9 },
              { label: 'Fri', value: 2.8 },
              { label: 'Sat', value: 2.7 },
              { label: 'Sun', value: 2.8 },
            ],
          },
          metricsGrid: [
            { label: 'Selected Ocean', value: displayOceanName, note: displayOceanBasin },
            { label: 'Mean Speed', value: activeCurrents, note: 'Surface vector' },
            { label: 'Kuroshio / Gulf Stream', value: '4.2–4.8 knots', note: 'Global Maximum' },
            { label: 'Drift Direction', value: 'Eastward Flow', note: 'Zonal' },
          ],
        });
        break;

      case 'health':
        setSelectedMetric({
          id: 'health',
          title: `Ocean Health Index — ${displayOceanName}`,
          subtitle: `Biogeochemical Health Score for ${displayOceanName}`,
          unit: '/ 100',
          currentValue: `${activeHealth} / 100`,
          changeRate: 'Good Condition',
          iconType: 'health',
          color: '#22C55E',
          aiExplanation: `The Ocean Health Index for ${displayOceanName} is measured at ${activeHealth} / 100. This synthesizes thermal stress anomalies, dissolved oxygen levels, pH ocean acidification, and marine ecosystem stability.`,
          timeSeriesData: {
            'Past Week': [
              { label: 'Mon', value: 76 },
              { label: 'Tue', value: 77 },
              { label: 'Wed', value: 77 },
              { label: 'Thu', value: 78 },
              { label: 'Fri', value: 78 },
              { label: 'Sat', value: 79 },
              { label: 'Sun', value: 78 },
            ],
          },
          metricsGrid: [
            { label: 'Selected Ocean', value: displayOceanName, note: displayOceanBasin },
            { label: 'Health Score', value: `${activeHealth} / 100`, note: 'Composite Score' },
            { label: 'Dissolved Oxygen', value: '82 / 100', note: 'Saturated' },
            { label: 'pH Alkalinity', value: '8.08 pH', note: 'Balanced' },
          ],
        });
        break;
    }
  };

  return (
    <div className="w-full h-full p-6 overflow-y-auto custom-scrollbar space-y-6 bg-[#F6F8FB] text-slate-800">
      {/* Metric Detail Modal */}
      <MetricDetailModal
        metric={selectedMetric}
        onClose={() => setSelectedMetric(null)}
      />

      {/* Header Banner & Explicit Ocean Overview at the Top */}
      <div className="space-y-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-[#00B8D9]" />
              <span className="text-xs font-mono font-bold text-[#00B8D9] uppercase tracking-widest">
                GLOBAL OCEAN MONITORING & TELEMETRY DASHBOARD
              </span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 mt-1">
              Global Hydrographic & Ocean Basin Surveillance
            </h1>
            <div className="mt-3 p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 leading-relaxed space-y-2">
              <div>
                <strong className="text-slate-900 font-bold block text-sm">🌊 About This Dashboard:</strong>
                This dashboard is an interactive oceanographic monitoring & intelligence system designed to track physical and biogeochemical parameters across Earth's major oceans—including the <strong>Indian Ocean</strong>, <strong>Pacific Ocean</strong>, <strong>Atlantic Ocean</strong>, <strong>Southern Ocean</strong>, and <strong>Arctic Ocean</strong>.
              </div>
              <p className="text-slate-600 text-[11px] border-t border-slate-200/60 pt-2">
                Sourced from <strong>3,900+ autonomous ARGO profiling floats</strong>, satellite altimetry, and INCOIS/NOAA sensor telemetry, it provides real-time surveillance of Sea Surface Temperature (SST), Salinity (PSU), Hydrostatic Pressure (dbar), Ocean Currents, and Marine Ecosystem Health.
              </p>
            </div>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end justify-between w-full lg:w-auto gap-3 shrink-0">
            <div className="px-4 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-center w-full sm:w-44">
              <span className="text-[10px] text-emerald-700 font-mono block font-semibold uppercase">Global Health Index</span>
              <span className="text-xl font-bold text-[#22C55E] font-mono">{avgHealthScore} / 100</span>
            </div>
            <div className="px-4 py-2.5 rounded-xl bg-amber-50 border border-amber-200 text-center w-full sm:w-44">
              <span className="text-[10px] text-amber-700 font-mono block font-semibold uppercase">Active Float Fleet</span>
              <span className="text-xl font-bold text-[#F59E0B] font-mono">{activeFloatsCount} ARGO Floats</span>
            </div>
          </div>
        </div>

        {/* 5 Major World Oceans Top Bar */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#00B8D9]" />
              Select Ocean / Region to Filter Dashboard Data
            </h3>
            <span className="text-[10px] font-mono font-bold text-slate-400">5 Primary Global Basins</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {/* Global All */}
            <button
              onClick={() => setActiveLocationId('all')}
              className={`p-2.5 rounded-xl border transition-all text-left cursor-pointer group ${
                activeLocationId === 'all'
                  ? 'bg-slate-900 border-slate-900 text-white shadow-sm'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-400'
              }`}
            >
              <div className="text-[10px] font-mono font-bold uppercase opacity-80">
                Global Network
              </div>
              <div className="text-xs font-bold mt-0.5 truncate">
                All 5 Basins
              </div>
              <div className="text-[10px] font-mono opacity-70 mt-0.5">{avgTempGlobal}°C • {avgSalinityGlobal} PSU</div>
            </button>

            {/* Indian Ocean */}
            <button
              onClick={() => {
                const indianLoc = locs.find(l => l.id === 'indian-ocean') || locs.find(l => l.id === 'bay-of-bengal');
                if (indianLoc) setActiveLocationId(indianLoc.id);
              }}
              className={`p-2.5 rounded-xl border transition-all text-left cursor-pointer group ${
                activeLocationId === 'indian-ocean' || activeLocationId === 'bay-of-bengal'
                  ? 'bg-[#00B8D9] border-[#00B8D9] text-slate-950 font-bold shadow-sm'
                  : 'bg-cyan-50/70 border-cyan-200/80 hover:border-[#00B8D9] text-slate-800'
              }`}
            >
              <div className="text-[10px] font-mono font-bold uppercase opacity-80">
                Indian Ocean
              </div>
              <div className="text-xs font-bold mt-0.5 truncate">
                Bay of Bengal & Arabian
              </div>
              <div className="text-[10px] font-mono opacity-70 mt-0.5">27.2°C • 35.2 PSU</div>
            </button>

            {/* Pacific Ocean */}
            <button
              onClick={() => {
                const pacLoc = locs.find(l => l.id === 'pacific-ocean');
                if (pacLoc) setActiveLocationId(pacLoc.id);
              }}
              className={`p-2.5 rounded-xl border transition-all text-left cursor-pointer group ${
                activeLocationId === 'pacific-ocean'
                  ? 'bg-blue-600 border-blue-600 text-white font-bold shadow-sm'
                  : 'bg-blue-50/70 border-blue-200/80 hover:border-blue-500 text-slate-800'
              }`}
            >
              <div className="text-[10px] font-mono font-bold uppercase opacity-80">
                Pacific Ocean
              </div>
              <div className="text-xs font-bold mt-0.5 truncate">
                Equatorial & Kuroshio
              </div>
              <div className="text-[10px] font-mono opacity-70 mt-0.5">25.8°C • 34.6 PSU</div>
            </button>

            {/* Atlantic Ocean */}
            <button
              onClick={() => {
                const atlLoc = locs.find(l => l.id === 'atlantic-ocean');
                if (atlLoc) setActiveLocationId(atlLoc.id);
              }}
              className={`p-2.5 rounded-xl border transition-all text-left cursor-pointer group ${
                activeLocationId === 'atlantic-ocean'
                  ? 'bg-indigo-600 border-indigo-600 text-white font-bold shadow-sm'
                  : 'bg-indigo-50/70 border-indigo-200/80 hover:border-indigo-500 text-slate-800'
              }`}
            >
              <div className="text-[10px] font-mono font-bold uppercase opacity-80">
                Atlantic Ocean
              </div>
              <div className="text-xs font-bold mt-0.5 truncate">
                Gulf Stream & AMOC
              </div>
              <div className="text-[10px] font-mono opacity-70 mt-0.5">23.4°C • 36.8 PSU</div>
            </button>

            {/* Southern Ocean */}
            <button
              onClick={() => {
                const soLoc = locs.find(l => l.id === 'southern-ocean');
                if (soLoc) setActiveLocationId(soLoc.id);
              }}
              className={`p-2.5 rounded-xl border transition-all text-left cursor-pointer group ${
                activeLocationId === 'southern-ocean'
                  ? 'bg-teal-600 border-teal-600 text-white font-bold shadow-sm'
                  : 'bg-teal-50/70 border-teal-200/80 hover:border-teal-500 text-slate-800'
              }`}
            >
              <div className="text-[10px] font-mono font-bold uppercase opacity-80">
                Southern Ocean
              </div>
              <div className="text-xs font-bold mt-0.5 truncate">
                Antarctic Circumpolar
              </div>
              <div className="text-[10px] font-mono opacity-70 mt-0.5">1.8°C • 34.1 PSU</div>
            </button>

            {/* Arctic Ocean */}
            <button
              onClick={() => {
                const arcLoc = locs.find(l => l.id === 'arctic-ocean');
                if (arcLoc) setActiveLocationId(arcLoc.id);
              }}
              className={`p-2.5 rounded-xl border transition-all text-left cursor-pointer group ${
                activeLocationId === 'arctic-ocean'
                  ? 'bg-sky-600 border-sky-600 text-white font-bold shadow-sm'
                  : 'bg-sky-50/70 border-sky-200/80 hover:border-sky-500 text-slate-800'
              }`}
            >
              <div className="text-[10px] font-mono font-bold uppercase opacity-80">
                Arctic Ocean
              </div>
              <div className="text-xs font-bold mt-0.5 truncate">
                Polar Ice Canopy
              </div>
              <div className="text-[10px] font-mono opacity-70 mt-0.5">-1.2°C • 31.2 PSU</div>
            </button>
          </div>
        </div>
      </div>

      {/* Prominent Banner showing the Ocean Name for the active Dashboard Cards */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00B8D9] animate-pulse" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#00B8D9]">
              ACTIVE DASHBOARD TELEMETRY SCOPE
            </span>
          </div>
          <h2 className="text-xl font-black text-white mt-0.5 flex items-center gap-2">
            <Globe className="w-5 h-5 text-[#00B8D9]" />
            {displayOceanName}
          </h2>
          <p className="text-xs text-slate-300 mt-0.5 font-mono">
            {displayOceanBasin}
          </p>
        </div>

        {activeLocation && (
          <button
            onClick={() => onSelectLocation(activeLocation)}
            className="px-3.5 py-2 rounded-xl bg-[#00B8D9] hover:bg-[#00a3c4] text-slate-950 font-bold text-xs font-mono transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <span>View {activeLocation.name} on Globe</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* 6 Core Metric Cards - Explicit Ocean Name Displayed on Top of Every Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Card 1: Temp -> Ocean Teal (#00B8D9) */}
        <motion.div
          whileHover={{ y: -3, scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => openMetricDetail('temp')}
          className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-[#00B8D9] shadow-sm hover:shadow-md transition-all cursor-pointer group relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono font-bold text-[#00B8D9] bg-cyan-50 px-2 py-0.5 rounded border border-cyan-100 uppercase">
              {displayOceanName}
            </span>
            <span className="text-xs font-mono text-[#22C55E] font-bold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> +0.4°C
            </span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 rounded-xl bg-[#00B8D9]/10 text-[#00B8D9] group-hover:bg-[#00B8D9]/20 transition-colors">
              <Thermometer className="w-5 h-5 text-[#00B8D9]" />
            </div>
            <ExternalLink className="w-4 h-4 text-[#00B8D9] opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <span className="text-xs text-slate-500 font-mono font-semibold block">
            Mean Surface Temperature (SST)
          </span>
          <div className="text-2xl font-black text-slate-900 mt-1">{activeTemp}</div>
          <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
            Thermal profile measured for <strong>{displayOceanName}</strong>. Click to inspect deep chart.
          </p>
        </motion.div>

        {/* Card 2: Salinity -> Blue (#2563EB) */}
        <motion.div
          whileHover={{ y: -3, scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => openMetricDetail('salinity')}
          className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-500 shadow-sm hover:shadow-md transition-all cursor-pointer group relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 uppercase">
              {displayOceanName}
            </span>
            <span className="text-xs font-mono text-blue-600 font-bold">Stable</span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-100 transition-colors">
              <Droplets className="w-5 h-5 text-blue-600" />
            </div>
            <ExternalLink className="w-4 h-4 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <span className="text-xs text-slate-500 font-mono font-semibold block">
            Mean Salinity Level (PSU)
          </span>
          <div className="text-2xl font-black text-slate-900 mt-1">{activeSalinity}</div>
          <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
            Practical salinity concentration recorded for <strong>{displayOceanName}</strong>.
          </p>
        </motion.div>

        {/* Card 3: Pressure -> Purple (#7C3AED) */}
        <motion.div
          whileHover={{ y: -3, scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => openMetricDetail('pressure')}
          className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-purple-500 shadow-sm hover:shadow-md transition-all cursor-pointer group relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-100 uppercase">
              {displayOceanName}
            </span>
            <span className="text-xs font-mono text-purple-700 font-bold">2,000 dbar</span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600 group-hover:bg-purple-100 transition-colors">
              <Gauge className="w-5 h-5 text-purple-600" />
            </div>
            <ExternalLink className="w-4 h-4 text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <span className="text-xs text-slate-500 font-mono font-semibold block">
            Profiling Pressure Level
          </span>
          <div className="text-2xl font-black text-slate-900 mt-1">{activePressure}</div>
          <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
            CTD sensor pressure range measured across <strong>{displayOceanName}</strong>.
          </p>
        </motion.div>

        {/* Card 4: Active Floats -> Amber (#F59E0B) */}
        <motion.div
          whileHover={{ y: -3, scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => openMetricDetail('floats')}
          className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-amber-500 shadow-sm hover:shadow-md transition-all cursor-pointer group relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-100 uppercase">
              {displayOceanName}
            </span>
            <span className="text-xs font-mono text-amber-600 font-bold">98% Online</span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600 group-hover:bg-amber-100 transition-colors">
              <Radio className="w-5 h-5 text-amber-600" />
            </div>
            <ExternalLink className="w-4 h-4 text-amber-600 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <span className="text-xs text-slate-500 font-mono font-semibold block">
            ARGO Float Network
          </span>
          <div className="text-2xl font-black text-slate-900 mt-1">{activeFloatCount} Floats</div>
          <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
            Active autonomous floats broadcasting in <strong>{displayOceanName}</strong>.
          </p>
        </motion.div>

        {/* Card 5: Current Speed -> Emerald (#10B981) */}
        <motion.div
          whileHover={{ y: -3, scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => openMetricDetail('currents')}
          className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-500 shadow-sm hover:shadow-md transition-all cursor-pointer group relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 uppercase">
              {displayOceanName}
            </span>
            <span className="text-xs font-mono text-emerald-600 font-bold">Peak: 4.8 knots</span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100 transition-colors">
              <Wind className="w-5 h-5 text-emerald-600" />
            </div>
            <ExternalLink className="w-4 h-4 text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <span className="text-xs text-slate-500 font-mono font-semibold block">
            Mean Current Speed
          </span>
          <div className="text-2xl font-black text-slate-900 mt-1">{activeCurrents}</div>
          <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
            Horizontal surface water transport speed in <strong>{displayOceanName}</strong>.
          </p>
        </motion.div>

        {/* Card 6: Health Score -> Green (#22C55E) */}
        <motion.div
          whileHover={{ y: -3, scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => openMetricDetail('health')}
          className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-[#22C55E] shadow-sm hover:shadow-md transition-all cursor-pointer group relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 uppercase">
              {displayOceanName}
            </span>
            <span className="text-xs font-mono text-[#22C55E] font-bold">Good Status</span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 rounded-xl bg-emerald-50 text-[#22C55E] group-hover:bg-emerald-100 transition-colors">
              <ShieldCheck className="w-5 h-5 text-[#22C55E]" />
            </div>
            <ExternalLink className="w-4 h-4 text-[#22C55E] opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <span className="text-xs text-slate-500 font-mono font-semibold block">
            Ocean Health Index
          </span>
          <div className="text-2xl font-black text-slate-900 mt-1">{activeHealth} / 100</div>
          <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
            Composite ecosystem & thermal score for <strong>{displayOceanName}</strong>.
          </p>
        </motion.div>
      </div>

      {/* Recharts Graphical Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Regional Temperature Comparison */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 font-mono mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#00B8D9]" />
            Regional Sea Surface Temperature (°C)
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartComparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={10} unit="°C" />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '12px' }} />
                <Bar dataKey="temp" fill="#00B8D9" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Regional Salinity Comparison */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 font-mono mb-4 flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-600" />
            Regional Salinity Levels (PSU)
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartComparisonData}>
                <defs>
                  <linearGradient id="salGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={10} domain={[30, 38]} unit="PSU" />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '12px' }} />
                <Area type="monotone" dataKey="salinity" stroke="#2563EB" fill="url(#salGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
