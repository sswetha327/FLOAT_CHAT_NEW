import React, { useState } from 'react';
import { OceanLocation } from '../types';
import {
  Globe,
  LayoutDashboard,
  Radio,
  MapPin,
  Wind,
  Grid,
  Waves,
  ChevronLeft,
  ChevronRight,
  Sliders,
  Clock,
  ShieldCheck,
  Sparkles,
  Download,
  Activity,
  Battery,
  AlertTriangle,
  RefreshCw,
  Search,
  Zap,
  Gauge,
  Thermometer,
  Bot,
  AlertCircle,
  Eye,
} from 'lucide-react';

interface LeftSidebarProps {
  currentView: 'globe' | 'dashboard' | 'fleet';
  onChangeView: (view: 'globe' | 'dashboard' | 'fleet') => void;
  locations: OceanLocation[];
  selectedLocation: OceanLocation | null;
  onSelectLocation: (loc: OceanLocation) => void;
  showArgoFloats: boolean;
  onToggleArgoFloats: () => void;
  showCurrents: boolean;
  onToggleCurrents: () => void;
  showGrid: boolean;
  onToggleGrid: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
  currentView,
  onChangeView,
  locations,
  selectedLocation,
  onSelectLocation,
  showArgoFloats,
  onToggleArgoFloats,
  showCurrents,
  onToggleCurrents,
  showGrid,
  onToggleGrid,
  isCollapsed,
  onToggleCollapse,
}) => {
  const [timeFilter, setTimeFilter] = useState<string>('Live');
  const [fleetOceanFilter, setFleetOceanFilter] = useState<string>('All Oceans');
  const [locationSearch, setLocationSearch] = useState<string>('');

  const filteredLocations = locations.filter((loc) =>
    loc.name.toLowerCase().includes(locationSearch.toLowerCase()) ||
    loc.nearestOcean.toLowerCase().includes(locationSearch.toLowerCase())
  );

  const handleExportDashboard = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(locations, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `floatchat_dashboard_telemetry_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <aside
      className={`relative h-[calc(100vh-4rem)] bg-[#0B3D4C] border-r border-[#1E6091]/40 text-[#FAF6F0] flex flex-col justify-between transition-all duration-300 z-40 shadow-md ${
        isCollapsed ? 'w-16' : 'w-80'
      }`}
    >
      {/* Collapse Toggle Button */}
      <button
        onClick={onToggleCollapse}
        className="absolute -right-3 top-4 z-50 p-1 rounded-full bg-[#0B3D4C] border border-[#1E6091] text-[#FAF6F0] hover:text-[#4ECDC4] shadow-md cursor-pointer transition-transform hover:scale-110"
      >
        {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>

      {/* Main Navigation & Context-Aware Content */}
      <div className="p-3.5 space-y-4 overflow-y-auto custom-scrollbar flex-1 flex flex-col">
        {/* Navigation Mode Switcher */}
        <div className="space-y-1 shrink-0">
          {!isCollapsed && (
            <span className="text-[10px] font-mono font-bold text-[#4ECDC4] uppercase tracking-wider px-2 block mb-1.5">
              PLATFORM NAVIGATION
            </span>
          )}

          <div className="grid grid-cols-1 gap-1">
            {/* Interactive Globe */}
            <button
              onClick={() => onChangeView('globe')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                currentView === 'globe'
                  ? 'bg-[#1E6091] text-white font-bold shadow-md'
                  : 'bg-[#0B3D4C]/80 text-[#FAF6F0]/80 hover:text-[#4ECDC4] hover:bg-[#1E6091]/30 border border-[#1E6091]/30'
              }`}
              title="Interactive 3D Globe"
            >
              <Globe className={`w-4 h-4 shrink-0 ${currentView === 'globe' ? 'text-white' : 'text-[#4ECDC4]'}`} />
              {!isCollapsed && <span>Interactive 3D Globe</span>}
            </button>

            {/* Ocean Dashboard */}
            <button
              onClick={() => onChangeView('dashboard')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                currentView === 'dashboard'
                  ? 'bg-[#1E6091] text-white font-bold shadow-md'
                  : 'bg-[#0B3D4C]/80 text-[#FAF6F0]/80 hover:text-[#4ECDC4] hover:bg-[#1E6091]/30 border border-[#1E6091]/30'
              }`}
              title="Ocean Dashboard"
            >
              <LayoutDashboard className={`w-4 h-4 shrink-0 ${currentView === 'dashboard' ? 'text-white' : 'text-[#4ECDC4]'}`} />
              {!isCollapsed && <span>Ocean Dashboard</span>}
            </button>

            {/* ARGO Tracker */}
            <button
              onClick={() => onChangeView('fleet')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                currentView === 'fleet'
                  ? 'bg-[#1E6091] text-white font-bold shadow-md'
                  : 'bg-[#0B3D4C]/80 text-[#FAF6F0]/80 hover:text-[#4ECDC4] hover:bg-[#1E6091]/30 border border-[#1E6091]/30'
              }`}
              title="ARGO Fleet Tracker"
            >
              <Radio className={`w-4 h-4 shrink-0 ${currentView === 'fleet' ? 'text-white' : 'text-[#4ECDC4]'}`} />
              {!isCollapsed && <span>ARGO Fleet Tracker</span>}
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* VIEW 1: INTERACTIVE GLOBE SIDEBAR                         */}
        {/* ========================================================= */}
        {!isCollapsed && currentView === 'globe' && (
          <div className="space-y-4 flex-1 flex flex-col min-h-0">
            {/* Globe Layers Toggle Section */}
            <div className="space-y-1.5 pt-1 shrink-0">
              <span className="text-[10px] font-mono font-bold text-[#4ECDC4] uppercase tracking-wider px-2 block">
                3D OVERLAY LAYERS
              </span>

              <div className="grid grid-cols-3 gap-1.5">
                <button
                  onClick={onToggleArgoFloats}
                  className={`p-2 rounded-xl text-xs flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                    showArgoFloats
                      ? 'bg-[#1E6091] border border-[#4ECDC4] text-[#4ECDC4] font-bold'
                      : 'bg-[#0B3D4C]/80 text-[#FAF6F0]/80 border border-[#1E6091]/30 hover:text-[#4ECDC4]'
                  }`}
                >
                  <Radio className="w-4 h-4 text-[#4ECDC4]" />
                  <span className="text-[10px] font-mono">ARGO</span>
                </button>

                <button
                  onClick={onToggleCurrents}
                  className={`p-2 rounded-xl text-xs flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                    showCurrents
                      ? 'bg-[#1E6091] border border-[#4ECDC4] text-[#4ECDC4] font-bold'
                      : 'bg-[#0B3D4C]/80 text-[#FAF6F0]/80 border border-[#1E6091]/30 hover:text-[#4ECDC4]'
                  }`}
                >
                  <Wind className="w-4 h-4 text-[#4ECDC4]" />
                  <span className="text-[10px] font-mono">Currents</span>
                </button>

                <button
                  onClick={onToggleGrid}
                  className={`p-2 rounded-xl text-xs flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                    showGrid
                      ? 'bg-[#1E6091] border border-[#4ECDC4] text-[#4ECDC4] font-bold'
                      : 'bg-[#0B3D4C]/80 text-[#FAF6F0]/80 border border-[#1E6091]/30 hover:text-[#4ECDC4]'
                  }`}
                >
                  <Grid className="w-4 h-4 text-[#4ECDC4]" />
                  <span className="text-[10px] font-mono">Grid</span>
                </button>
              </div>
            </div>

            {/* Quick Ocean Targets */}
            <div className="border-t border-[#1E6091]/40 pt-3 flex-1 flex flex-col min-h-0 space-y-2">
              <div className="flex items-center justify-between px-2 shrink-0">
                <span className="text-[10px] font-mono font-bold text-[#4ECDC4] uppercase tracking-wider">
                  QUICK OCEAN TARGETS ({filteredLocations.length})
                </span>
              </div>

              {/* Search Bar for Locations */}
              <div className="relative shrink-0">
                <Search className="w-3.5 h-3.5 text-[#4ECDC4] absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search 18 ocean targets..."
                  value={locationSearch}
                  onChange={(e) => setLocationSearch(e.target.value)}
                  className="w-full bg-[#0B3D4C]/80 border border-[#1E6091]/40 rounded-xl pl-8 pr-3 py-1.5 text-xs text-[#FAF6F0] placeholder-[#FAF6F0]/50 focus:outline-none focus:border-[#4ECDC4]"
                />
              </div>

              {/* Scrollable Location List */}
              <div className="space-y-1 overflow-y-auto custom-scrollbar flex-1 pr-1">
                {filteredLocations.map((loc) => (
                  <button
                    key={loc.id}
                    onClick={() => {
                      onChangeView('globe');
                      onSelectLocation(loc);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all cursor-pointer ${
                      selectedLocation?.id === loc.id
                        ? 'bg-[#1E6091] border border-[#4ECDC4] text-[#4ECDC4] font-bold shadow-2xs'
                        : 'text-[#FAF6F0]/90 hover:text-[#4ECDC4] hover:bg-[#1E6091]/20'
                    }`}
                  >
                    <span className="flex items-center gap-2 truncate">
                      <MapPin className="w-3.5 h-3.5 text-[#4ECDC4] shrink-0" />
                      <span className="truncate">{loc.name}</span>
                    </span>
                    <span className="text-[10px] font-mono text-[#4ECDC4] shrink-0 font-semibold">
                      {loc.avgTemp}°C
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 2: OCEAN DASHBOARD SIDEBAR                           */}
        {/* ========================================================= */}
        {!isCollapsed && currentView === 'dashboard' && (
          <div className="space-y-4 flex-1 flex flex-col min-h-0 overflow-y-auto custom-scrollbar pr-1">
            {/* Timeframe Filters */}
            <div className="space-y-2 border-t border-[#1E6091]/40 pt-3 shrink-0">
              <span className="text-[10px] font-mono font-bold text-[#4ECDC4] uppercase tracking-wider px-2 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#4ECDC4]" /> TIMEFRAME SELECTION
              </span>
              <div className="grid grid-cols-4 gap-1 p-1 bg-[#0B3D4C]/80 rounded-xl border border-[#1E6091]/40">
                {['Live', 'Week', 'Month', 'Year'].map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setTimeFilter(tf)}
                    className={`py-1.5 rounded-lg text-[11px] font-mono font-bold transition-all cursor-pointer text-center ${
                      timeFilter === tf
                        ? 'bg-[#1E6091] text-white shadow-xs'
                        : 'text-[#FAF6F0]/70 hover:text-[#4ECDC4]'
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Alerts Panel */}
            <div className="space-y-2 border-t border-[#1E6091]/40 pt-3 shrink-0">
              <span className="text-[10px] font-mono font-bold text-[#EF4444] uppercase tracking-wider px-2 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 text-[#EF4444]" /> RECENT ANOMALY ALERTS
              </span>
              <div className="space-y-1.5">
                <div className="p-2.5 rounded-xl bg-[#0B3D4C]/90 border border-[#EF4444]/40 text-xs text-[#FAF6F0] space-y-1">
                  <span className="font-bold block text-[#EF4444]">Marine Heatwave Alert</span>
                  <p className="text-[10px] text-[#FAF6F0]/80 leading-tight">
                    Bay of Bengal SST elevated +1.2°C above 30-year seasonal baseline.
                  </p>
                </div>
                <div className="p-2.5 rounded-xl bg-[#0B3D4C]/90 border border-[#F59E0B]/40 text-xs text-[#FAF6F0] space-y-1">
                  <span className="font-bold block text-[#F59E0B]">Salinity Dilution Event</span>
                  <p className="text-[10px] text-[#FAF6F0]/80 leading-tight">
                    Freshwater runoff reduced surface salinity to 31.2 PSU near Chennai coast.
                  </p>
                </div>
              </div>
            </div>

            {/* Recent AI Insights */}
            <div className="space-y-2 border-t border-[#1E6091]/40 pt-3 shrink-0">
              <span className="text-[10px] font-mono font-bold text-[#4ECDC4] uppercase tracking-wider px-2 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#4ECDC4]" /> RECENT AI INSIGHTS
              </span>
              <div className="p-3 bg-[#0B3D4C]/90 rounded-2xl border border-[#1E6091]/40 text-xs text-[#FAF6F0] space-y-1.5">
                <div className="font-bold text-xs text-[#4ECDC4] flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5 text-[#4ECDC4]" /> Thermocline Displacements
                </div>
                <p className="text-[10px] text-[#FAF6F0]/80 leading-relaxed">
                  Deep stratification anomaly detected by Float #2903829 down to 800m depth in the Indian Ocean.
                </p>
              </div>
            </div>

            {/* Latest Measurements */}
            <div className="space-y-2 border-t border-[#1E6091]/40 pt-3 shrink-0">
              <span className="text-[10px] font-mono font-bold text-[#22C55E] uppercase tracking-wider px-2 flex items-center gap-1">
                <Activity className="w-3.5 h-3.5 text-[#22C55E]" /> LATEST MEASUREMENTS
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2 bg-[#0B3D4C]/90 rounded-xl border border-[#1E6091]/40">
                  <span className="text-[#FAF6F0]/60 block text-[9px]">MEAN TEMP</span>
                  <span className="font-bold text-[#4ECDC4]">28.4°C</span>
                </div>
                <div className="p-2 bg-[#0B3D4C]/90 rounded-xl border border-[#1E6091]/40">
                  <span className="text-[#FAF6F0]/60 block text-[9px]">SALINITY</span>
                  <span className="font-bold text-[#4ECDC4]">34.1 PSU</span>
                </div>
              </div>
            </div>

            {/* Mini Forecast */}
            <div className="space-y-2 border-t border-[#1E6091]/40 pt-3 shrink-0">
              <span className="text-[10px] font-mono font-bold text-[#FAF6F0]/70 uppercase tracking-wider px-2 block">
                7-DAY HYDROGRAPHIC FORECAST
              </span>
              <div className="p-3 bg-[#0B3D4C]/90 rounded-2xl border border-[#1E6091]/40 text-xs space-y-1.5">
                <div className="flex justify-between text-[11px] font-mono text-[#FAF6F0]">
                  <span>Surface Temperature:</span>
                  <span className="font-bold text-[#22C55E]">Stable (+0.1°C)</span>
                </div>
                <div className="flex justify-between text-[11px] font-mono text-[#FAF6F0]">
                  <span>Current Velocity:</span>
                  <span className="font-bold text-[#4ECDC4]">0.42 m/s</span>
                </div>
              </div>
            </div>

            {/* Export Dashboard Data Button */}
            <div className="border-t border-[#1E6091]/40 pt-3 shrink-0 pb-2">
              <button
                onClick={handleExportDashboard}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#1E6091] hover:bg-[#4ECDC4] text-white hover:text-[#0B3D4C] text-xs font-mono font-bold transition-all cursor-pointer shadow-xs border border-[#1E6091]"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Telemetry JSON</span>
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 3: ARGO FLEET TRACKER SIDEBAR                         */}
        {/* ========================================================= */}
        {!isCollapsed && currentView === 'fleet' && (
          <div className="space-y-4 flex-1 flex flex-col min-h-0 overflow-y-auto custom-scrollbar pr-1">
            {/* Active Floats & Statistics */}
            <div className="space-y-2 border-t border-[#1E6091]/40 pt-3 shrink-0">
              <span className="text-[10px] font-mono font-bold text-[#F59E0B] uppercase tracking-wider px-2 block">
                ARGO FLEET NETWORK STATS
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2.5 bg-[#0B3D4C]/90 rounded-xl border border-[#1E6091]/40">
                  <span className="text-[9px] text-[#F59E0B] block font-semibold">TOTAL FLOATS</span>
                  <span className="text-[#FAF6F0] font-black text-sm">3,920</span>
                </div>
                <div className="p-2.5 bg-[#0B3D4C]/90 rounded-xl border border-[#1E6091]/40">
                  <span className="text-[9px] text-[#22C55E] block font-semibold">ACTIVE ONLINE</span>
                  <span className="text-[#FAF6F0] font-black text-sm">3,842</span>
                </div>
                <div className="p-2.5 bg-[#0B3D4C]/90 rounded-xl border border-[#1E6091]/40">
                  <span className="text-[9px] text-[#4ECDC4] block font-semibold">TRANSMITTING</span>
                  <span className="text-[#FAF6F0] font-black text-sm">2,910</span>
                </div>
                <div className="p-2.5 bg-[#0B3D4C]/90 rounded-xl border border-[#1E6091]/40">
                  <span className="text-[9px] text-[#EF4444] block font-semibold">LOW BATTERY</span>
                  <span className="text-[#FAF6F0] font-black text-sm">112</span>
                </div>
              </div>
            </div>

            {/* Battery Health & Operational Status */}
            <div className="space-y-2 border-t border-[#1E6091]/40 pt-3 shrink-0">
              <span className="text-[10px] font-mono font-bold text-[#22C55E] uppercase tracking-wider px-2 flex items-center gap-1">
                <Battery className="w-3.5 h-3.5 text-[#22C55E]" /> BATTERY HEALTH & AVAILABILITY
              </span>
              <div className="p-3 bg-[#0B3D4C]/90 rounded-2xl border border-[#1E6091]/40 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#FAF6F0] font-bold">Network Availability</span>
                  <span className="font-bold font-mono text-[#22C55E]">98.4%</span>
                </div>
                <div className="w-full bg-[#1E6091]/40 rounded-full h-2 overflow-hidden">
                  <div className="bg-gradient-to-r from-[#F59E0B] to-[#22C55E] h-full w-[98.4%]" />
                </div>
                <span className="text-[10px] text-[#FAF6F0]/70 font-mono block">
                  Iridium Satellite Uplink • Next Cycle in 4h
                </span>
              </div>
            </div>

            {/* Recently Surfaced Floats */}
            <div className="space-y-2 border-t border-[#1E6091]/40 pt-3 shrink-0">
              <span className="text-[10px] font-mono font-bold text-[#F59E0B] uppercase tracking-wider px-2 flex items-center gap-1">
                <Radio className="w-3.5 h-3.5 text-[#F59E0B]" /> RECENTLY SURFACED FLOATS
              </span>
              <div className="space-y-1.5 text-xs font-mono">
                <div className="p-2 rounded-xl bg-[#0B3D4C]/90 border border-[#1E6091]/40 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-[#FAF6F0] block">Float #IN-9842</span>
                    <span className="text-[9px] text-[#FAF6F0]/60">Bay of Bengal • Surfaced 12m ago</span>
                  </div>
                  <span className="text-[10px] text-[#22C55E] font-bold">Uplink 100%</span>
                </div>
                <div className="p-2 rounded-xl bg-[#0B3D4C]/90 border border-[#1E6091]/40 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-[#FAF6F0] block">Float #AS-2094</span>
                    <span className="text-[9px] text-[#FAF6F0]/60">Arabian Sea • Surfaced 42m ago</span>
                  </div>
                  <span className="text-[10px] text-[#22C55E] font-bold">Uplink 100%</span>
                </div>
              </div>
            </div>

            {/* Today's Missions */}
            <div className="space-y-2 border-t border-[#1E6091]/40 pt-3 shrink-0">
              <span className="text-[10px] font-mono font-bold text-[#4ECDC4] uppercase tracking-wider px-2 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-[#4ECDC4]" /> TODAY'S MISSIONS
              </span>
              <div className="p-3 bg-[#0B3D4C]/90 rounded-2xl border border-[#1E6091]/40 text-[11px] text-[#FAF6F0] space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-[#F59E0B]">
                  <AlertTriangle className="w-3.5 h-3.5 text-[#F59E0B]" /> Scheduled Profiling Cycle
                </div>
                <p className="text-[10px] text-[#FAF6F0]/80 leading-relaxed">
                  Float #2903829 entering 2,000m deep dive cycle in Bay of Bengal. Battery voltage nominal at 94%.
                </p>
              </div>
            </div>

            {/* Ocean Basin Filter */}
            <div className="space-y-2 border-t border-[#1E6091]/40 pt-3 shrink-0 pb-2">
              <span className="text-[10px] font-mono font-bold text-[#FAF6F0]/70 uppercase tracking-wider px-2 block">
                OCEAN BASIN FILTER
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {['All Oceans', 'Indian Ocean', 'Pacific Ocean', 'Atlantic Ocean'].map((basin) => (
                  <button
                    key={basin}
                    onClick={() => setFleetOceanFilter(basin)}
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer truncate text-center ${
                      fleetOceanFilter === basin
                        ? 'bg-[#1E6091] text-white font-bold shadow-xs'
                        : 'bg-[#0B3D4C]/80 text-[#FAF6F0]/80 hover:text-[#4ECDC4] border border-[#1E6091]/30'
                    }`}
                  >
                    {basin}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer System Status */}
      {!isCollapsed && (
        <div className="p-3 border-t border-[#1E6091]/40 bg-[#0B3D4C] shrink-0">
          <div className="p-2.5 rounded-xl bg-[#0B3D4C]/90 border border-[#1E6091]/40 flex items-center justify-between text-[11px] font-mono text-[#FAF6F0] shadow-2xs">
            <span className="flex items-center gap-2 truncate">
              <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-ping shrink-0" />
              <span className="truncate font-semibold text-[#FAF6F0]">ARGO Network: Operational</span>
            </span>
            <RefreshCw className="w-3.5 h-3.5 text-[#4ECDC4] animate-spin" />
          </div>
        </div>
      )}
    </aside>
  );
};
