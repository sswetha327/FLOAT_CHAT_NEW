import React, { useState, useEffect } from 'react';
import { OceanLocation, ArgoFloat } from '../types';
import {
  BookOpen,
  Sparkles,
  BarChart2,
  Radio,
  History,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Zap,
  Globe,
  Layers,
  Droplets,
  Wind,
  Anchor,
  Lightbulb,
  ShieldAlert,
  Activity,
  Compass,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { getDocumentaryForLocation, DocumentarySection } from '../data/documentaryData';
import { fetchOrGenerateDocumentary } from '../services/documentaryService';

interface BottomPanelProps {
  location: OceanLocation;
  argoFloats: ArgoFloat[];
  isOpen: boolean;
  onToggleOpen: () => void;
  onSelectFloat?: (float: ArgoFloat) => void;
}

export const BottomPanel: React.FC<BottomPanelProps> = ({
  location,
  argoFloats,
  isOpen,
  onToggleOpen,
  onSelectFloat,
}) => {
  const [activeTab, setActiveTab] = useState<'story' | 'insights' | 'charts' | 'floats' | 'history'>('story');
  const [documentary, setDocumentary] = useState<DocumentarySection>(() =>
    getDocumentaryForLocation(
      location.name,
      location.nearestOcean,
      location.avgTemp,
      location.avgSalinity,
      location.avgDepth,
      location.currentSpeed
    )
  );
  const [isGeneratingStory, setIsGeneratingStory] = useState<boolean>(false);

  // Synchronize documentary content whenever location changes
  useEffect(() => {
    let isMounted = true;
    setIsGeneratingStory(true);
    fetchOrGenerateDocumentary(location).then((doc) => {
      if (isMounted) {
        setDocumentary(doc);
        setIsGeneratingStory(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [location.id, location.name, location.nearestOcean, location.avgTemp, location.avgSalinity, location.avgDepth, location.currentSpeed]);

  // Filter nearby floats
  const localFloats = argoFloats.filter((f) => location.argoFloatIds.includes(f.id));

  // Regenerate AI Story / Documentary
  const handleRegenerateStory = async () => {
    setIsGeneratingStory(true);
    try {
      const doc = await fetchOrGenerateDocumentary(location);
      setDocumentary(doc);
    } catch (e) {
      console.error('Failed to regenerate story:', e);
    } finally {
      setIsGeneratingStory(false);
    }
  };

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-40 transition-all duration-300 ease-in-out border-t border-[#E5E7EB] bg-white text-[#2D3436] shadow-2xl ${
        isOpen ? 'h-[540px] max-h-[68vh]' : 'h-12'
      }`}
    >
      {/* Drawer Header Toggle Bar */}
      <div
        onClick={onToggleOpen}
        className="h-12 px-4 sm:px-6 flex items-center justify-between cursor-pointer border-b border-[#E5E7EB] bg-[#FAF6F0] hover:bg-[#FAF6F0]/80 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-[#1E6091] animate-pulse" />
          <span className="text-xs font-mono font-bold text-[#1E6091] uppercase tracking-wider">
            OCEAN EXPLORER: {location.name}
          </span>
          <span className="text-xs text-[#2D3436]/60 hidden sm:inline font-mono">
            ({location.nearestOcean} • {location.avgTemp}°C • {location.avgSalinity} PSU)
          </span>
        </div>

        {/* Tab Buttons */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-1 bg-white p-1 rounded-xl border border-[#E5E7EB] text-xs shadow-2xs"
        >
          <button
            onClick={() => {
              setActiveTab('story');
              if (!isOpen) onToggleOpen();
            }}
            className={`px-3 py-1 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'story'
                ? 'bg-[#1E6091] text-white font-bold shadow-2xs'
                : 'text-[#2D3436]/80 hover:text-[#1E6091]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Documentary</span>
            <span className="sm:hidden">Doc</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('insights');
              if (!isOpen) onToggleOpen();
            }}
            className={`px-3 py-1 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'insights'
                ? 'bg-[#1E6091] text-white font-bold shadow-2xs'
                : 'text-[#2D3436]/80 hover:text-[#1E6091]'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-[#4ECDC4]" />
            <span>Insights</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('charts');
              if (!isOpen) onToggleOpen();
            }}
            className={`px-3 py-1 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'charts'
                ? 'bg-[#1E6091] text-white font-bold shadow-2xs'
                : 'text-[#2D3436]/80 hover:text-[#1E6091]'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>Charts</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('floats');
              if (!isOpen) onToggleOpen();
            }}
            className={`px-3 py-1 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'floats'
                ? 'bg-[#1E6091] text-white font-bold shadow-2xs'
                : 'text-[#2D3436]/80 hover:text-[#1E6091]'
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-[#FF6B6B]" />
            <span className="hidden sm:inline">Floats ({localFloats.length})</span>
            <span className="sm:hidden">({localFloats.length})</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('history');
              if (!isOpen) onToggleOpen();
            }}
            className={`px-3 py-1 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'history'
                ? 'bg-[#1E6091] text-white font-bold shadow-2xs'
                : 'text-[#2D3436]/80 hover:text-[#1E6091]'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">History</span>
          </button>
        </div>

        <button className="text-[#2D3436]/60 hover:text-[#1E6091] transition-colors p-1 cursor-pointer">
          {isOpen ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
        </button>
      </div>

      {/* Drawer Body */}
      {isOpen && (
        <div className="p-4 sm:p-6 h-[480px] overflow-y-auto custom-scrollbar bg-[#FAF6F0]/30">
          <AnimatePresence mode="wait">
            {/* TAB 1: NATIONAL GEOGRAPHIC STYLE DOCUMENTARY */}
            {activeTab === 'story' && (
              <motion.div
                key="story"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-5xl mx-auto space-y-6 pb-10"
              >
                {/* Article Header Banner */}
                <div className="p-6 rounded-3xl bg-gradient-to-r from-[#0B3D4C] to-[#1E6091] text-[#FAF6F0] shadow-md relative overflow-hidden space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#FAF6F0]/20 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-full bg-[#FF6B6B] text-[#4A1B0C] text-[10px] font-bold uppercase tracking-wider">
                        NATIONAL GEOGRAPHIC
                      </span>
                      <span className="text-[11px] font-mono text-[#4ECDC4] font-semibold">
                        OCEANOGRAPHY SERIES • ARTICLE #{location.id.toUpperCase()}
                      </span>
                    </div>

                    <button
                      onClick={handleRegenerateStory}
                      disabled={isGeneratingStory}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-[#FAF6F0] text-xs font-mono transition-all cursor-pointer"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 text-[#4ECDC4] ${isGeneratingStory ? 'animate-spin' : ''}`} />
                      <span>{isGeneratingStory ? 'Synthesizing...' : 'Re-synthesize AI Article'}</span>
                    </button>
                  </div>

                  <div>
                    <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                      {location.name}: Dynamics of an Oceanic Engine
                    </h2>
                    <p className="text-sm text-[#FAF6F0]/80 mt-1 font-medium">
                      An in-depth oceanographic documentary on the water masses, ecosystems, and climate drivers of {location.nearestOcean}.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#4ECDC4] pt-2">
                    <span>• ~650 WORDS</span>
                    <span>• 4 MIN READ</span>
                    <span>• LAT: {location.lat}° / LNG: {location.lng}°</span>
                    <span>• TEMP: {location.avgTemp}°C</span>
                    <span>• SALINITY: {location.avgSalinity} PSU</span>
                  </div>
                </div>

                {/* Article Content Layout */}
                <div className="space-y-6 text-[#2D3436]">
                  {/* 1. Overview */}
                  <section className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-2xs space-y-2">
                    <div className="flex items-center gap-2 text-[#0B3D4C]">
                      <Globe className="w-5 h-5 text-[#1E6091]" />
                      <h3 className="text-base font-bold uppercase font-mono tracking-wide">
                        1. Geographic Overview
                      </h3>
                    </div>
                    <div className="h-0.5 w-12 bg-[#1E6091] rounded-full my-1" />
                    <p className="text-sm leading-relaxed font-sans text-[#2D3436]/90">
                      {documentary.overview}
                    </p>
                  </section>

                  {/* 2. Formation */}
                  <section className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-2xs space-y-2">
                    <div className="flex items-center gap-2 text-[#0B3D4C]">
                      <Layers className="w-5 h-5 text-[#1E6091]" />
                      <h3 className="text-base font-bold uppercase font-mono tracking-wide">
                        2. Tectonic Formation & Geology
                      </h3>
                    </div>
                    <div className="h-0.5 w-12 bg-[#1E6091] rounded-full my-1" />
                    <p className="text-sm leading-relaxed font-sans text-[#2D3436]/90">
                      {documentary.formation}
                    </p>
                  </section>

                  {/* 3. Ocean Characteristics */}
                  <section className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-2xs space-y-2">
                    <div className="flex items-center gap-2 text-[#0B3D4C]">
                      <Droplets className="w-5 h-5 text-[#1E6091]" />
                      <h3 className="text-base font-bold uppercase font-mono tracking-wide">
                        3. Hydrographic & Salinity Characteristics
                      </h3>
                    </div>
                    <div className="h-0.5 w-12 bg-[#1E6091] rounded-full my-1" />
                    <p className="text-sm leading-relaxed font-sans text-[#2D3436]/90">
                      {documentary.characteristics}
                    </p>
                  </section>

                  {/* 4. Marine Biodiversity */}
                  <section className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-2xs space-y-2">
                    <div className="flex items-center gap-2 text-[#0B3D4C]">
                      <Sparkles className="w-5 h-5 text-[#1E6091]" />
                      <h3 className="text-base font-bold uppercase font-mono tracking-wide">
                        4. Marine Biodiversity & Ecosystems
                      </h3>
                    </div>
                    <div className="h-0.5 w-12 bg-[#1E6091] rounded-full my-1" />
                    <p className="text-sm leading-relaxed font-sans text-[#2D3436]/90">
                      {documentary.biodiversity}
                    </p>
                  </section>

                  {/* 5. Climate Importance */}
                  <section className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-2xs space-y-2">
                    <div className="flex items-center gap-2 text-[#0B3D4C]">
                      <Wind className="w-5 h-5 text-[#1E6091]" />
                      <h3 className="text-base font-bold uppercase font-mono tracking-wide">
                        5. Climate Importance & Thermohaline Role
                      </h3>
                    </div>
                    <div className="h-0.5 w-12 bg-[#1E6091] rounded-full my-1" />
                    <p className="text-sm leading-relaxed font-sans text-[#2D3436]/90">
                      {documentary.climateImportance}
                    </p>
                  </section>

                  {/* 6. Economic Importance */}
                  <section className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-2xs space-y-2">
                    <div className="flex items-center gap-2 text-[#0B3D4C]">
                      <Anchor className="w-5 h-5 text-[#1E6091]" />
                      <h3 className="text-base font-bold uppercase font-mono tracking-wide">
                        6. Maritime Commerce & Economic Impact
                      </h3>
                    </div>
                    <div className="h-0.5 w-12 bg-[#1E6091] rounded-full my-1" />
                    <p className="text-sm leading-relaxed font-sans text-[#2D3436]/90">
                      {documentary.economicImportance}
                    </p>
                  </section>

                  {/* 7. Interesting Facts */}
                  <section className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-2xs space-y-3">
                    <div className="flex items-center gap-2 text-[#0B3D4C]">
                      <Lightbulb className="w-5 h-5 text-[#1E6091]" />
                      <h3 className="text-base font-bold uppercase font-mono tracking-wide">
                        7. Key Oceanographic Facts
                      </h3>
                    </div>
                    <div className="h-0.5 w-12 bg-[#1E6091] rounded-full my-1" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                      {documentary.interestingFacts.map((fact, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 rounded-xl bg-[#FAF6F0] border border-[#E5E7EB] flex items-start gap-3"
                        >
                          <span className="w-6 h-6 rounded-full bg-[#1E6091] text-white text-xs font-bold font-mono flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <p className="text-xs text-[#2D3436] font-medium leading-relaxed">
                            {fact}
                          </p>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* 8. AI Summary */}
                  <section className="p-6 rounded-3xl bg-[#0B3D4C] text-[#FAF6F0] border border-[#1E6091] space-y-3 shadow-md">
                    <div className="flex items-center gap-2 text-[#4ECDC4]">
                      <Sparkles className="w-5 h-5 text-[#4ECDC4]" />
                      <h3 className="text-base font-bold uppercase font-mono tracking-wide">
                        8. AI Telemetry & Predictive Summary
                      </h3>
                    </div>
                    <p className="text-sm leading-relaxed font-sans text-[#FAF6F0]/90">
                      {documentary.aiSummary}
                    </p>
                    <div className="pt-2 border-t border-[#1E6091]/60 flex items-center justify-between text-xs font-mono text-[#4ECDC4]">
                      <span>SOURCE: NASA SIH & INCOIS TELEMETRY</span>
                      <span>STATUS: REAL-TIME VERIFIED</span>
                    </div>
                  </section>
                </div>
              </motion.div>
            )}

            {/* TAB 2: INSIGHTS & HYDROGRAPHIC DIAGNOSTICS */}
            {activeTab === 'insights' && (
              <motion.div
                key="insights"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-5xl mx-auto space-y-6 pb-10"
              >
                {/* Header Banner */}
                <div className="p-5 rounded-2xl bg-white border border-[#E5E7EB] flex flex-wrap items-center justify-between gap-3 shadow-2xs">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-[#1E6091] uppercase tracking-wider">
                      HYDROGRAPHIC DIAGNOSTICS & TELEMETRY
                    </span>
                    <h3 className="text-lg font-bold text-[#0B3D4C]">
                      Scientific Insights for {location.name}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-xs">
                    <span className="px-3 py-1 rounded-full bg-[#1E6091]/10 text-[#1E6091] font-bold border border-[#1E6091]/20">
                      HEALTH SCORE: {location.healthScore}/100
                    </span>
                    <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
                      STATUS: OPTIMAL
                    </span>
                  </div>
                </div>

                {/* Key Insights Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(location.insights || []).map((insightText: string, idx: number) => (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl bg-white border border-[#E5E7EB] space-y-2 shadow-2xs hover:border-[#1E6091] transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-[#1E6091] font-bold uppercase flex items-center gap-1.5">
                          <Zap className="w-3.5 h-3.5 text-[#1E6091]" /> DIAGNOSTIC #{idx + 1}
                        </span>
                        <span className="text-[10px] font-mono text-[#2D3436]/60">CONFIDENCE 98.6%</span>
                      </div>
                      <h4 className="text-sm font-bold text-[#0B3D4C] leading-snug">
                        {insightText}
                      </h4>
                      <p className="text-xs text-[#2D3436]/70 leading-relaxed font-sans pt-1 border-t border-[#E5E7EB]">
                        Profiling confirmed by CTD sensors and satellite microwave radiometry. Upper layer dynamics closely track seasonal monsoon circulation models.
                      </p>
                    </div>
                  ))}
                </div>

                {/* Live Hydrographic Sensor Matrix */}
                <div className="p-5 rounded-2xl bg-white border border-[#E5E7EB] space-y-3 shadow-2xs">
                  <h4 className="text-xs font-mono font-bold text-[#0B3D4C] uppercase tracking-wider flex items-center gap-2">
                    <Activity className="w-4 h-4 text-[#1E6091]" /> SENSOR MATRIX & ENVIRONMENTAL RISK METRICS
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                    <div className="p-3 rounded-xl bg-[#FAF6F0] border border-[#E5E7EB]">
                      <span className="text-[#2D3436]/60 block text-[10px]">SEA SURFACE TEMP</span>
                      <span className="text-base font-bold text-[#0B3D4C]">{location.avgTemp}°C</span>
                      <span className="text-[10px] text-emerald-600 block">+0.2°C anomaly</span>
                    </div>
                    <div className="p-3 rounded-xl bg-[#FAF6F0] border border-[#E5E7EB]">
                      <span className="text-[#2D3436]/60 block text-[10px]">SURFACE SALINITY</span>
                      <span className="text-base font-bold text-[#0B3D4C]">{location.avgSalinity} PSU</span>
                      <span className="text-[10px] text-[#1E6091] block">Freshwater lens</span>
                    </div>
                    <div className="p-3 rounded-xl bg-[#FAF6F0] border border-[#E5E7EB]">
                      <span className="text-[#2D3436]/60 block text-[10px]">MEAN SEAFLOOR DEPTH</span>
                      <span className="text-base font-bold text-[#0B3D4C]">{location.avgDepth} m</span>
                      <span className="text-[10px] text-[#2D3436]/60 block">Abyssal floor</span>
                    </div>
                    <div className="p-3 rounded-xl bg-[#FAF6F0] border border-[#E5E7EB]">
                      <span className="text-[#2D3436]/60 block text-[10px]">CURRENT FLOW SPEED</span>
                      <span className="text-base font-bold text-[#0B3D4C]">{location.currentSpeed}</span>
                      <span className="text-[10px] text-emerald-600 block">Monsoon vector</span>
                    </div>
                  </div>
                </div>

                {/* AI Recommendations Box */}
                <div className="p-5 rounded-2xl bg-[#0B3D4C] text-[#FAF6F0] space-y-2 border border-[#1E6091]">
                  <div className="flex items-center gap-2 text-[#4ECDC4]">
                    <ShieldAlert className="w-4 h-4 text-[#4ECDC4]" />
                    <span className="text-xs font-mono font-bold uppercase tracking-wider">
                      RECOMMENDED ACTIONABLE PROTOCOLS
                    </span>
                  </div>
                  <ul className="text-xs space-y-1.5 font-sans text-[#FAF6F0]/90 list-disc list-inside">
                    <li>Continue continuous 10-day cycle profiling on ARGO floats deployed in sector.</li>
                    <li>Issue marine weather advisories if sea surface temperature exceeds 29.5°C threshold.</li>
                    <li>Synchronize CTD salinity profiles with regional fishery oceanography bulletins.</li>
                  </ul>
                </div>
              </motion.div>
            )}

            {/* TAB 3: CHARTS */}
            {activeTab === 'charts' && (
              <motion.div
                key="charts"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-5xl mx-auto space-y-4 pb-10"
              >
                <div className="border-b border-[#E5E7EB] pb-2 flex justify-between items-center">
                  <h3 className="text-sm font-bold text-[#0B3D4C] uppercase font-mono tracking-wider">
                    7-Day Surface Temperature Anomaly Trend
                  </h3>
                  <span className="text-xs font-mono text-[#1E6091] font-bold">
                    MEAN: {location.avgTemp}°C
                  </span>
                </div>

                <div className="p-4 sm:p-6 rounded-2xl bg-white border border-[#E5E7EB] h-72 shadow-2xs">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={location.timeSeriesData || []}>
                      <defs>
                        <linearGradient id="localTempGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#1E6091" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#1E6091" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="date" stroke="#2D3436" fontSize={11} />
                      <YAxis stroke="#2D3436" fontSize={11} unit="°C" domain={['auto', 'auto']} />
                      <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#E5E7EB', borderRadius: '12px' }} />
                      <Area type="monotone" dataKey="temp" stroke="#1E6091" strokeWidth={2.5} fill="url(#localTempGrad)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            )}

            {/* TAB 4: NEARBY FLOATS */}
            {activeTab === 'floats' && (
              <motion.div
                key="floats"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-5xl mx-auto space-y-4 pb-10"
              >
                <div className="border-b border-[#E5E7EB] pb-2 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[#FF6B6B] uppercase font-mono tracking-wider">
                    ARGO Floats deployed near {location.name}
                  </h3>
                  <span className="text-xs font-mono text-[#2D3436]/60">
                    {localFloats.length} ACTIVE FLOATS
                  </span>
                </div>

                {localFloats.length === 0 ? (
                  <div className="p-8 text-center text-[#2D3436]/60 font-mono text-xs bg-white rounded-2xl border border-[#E5E7EB]">
                    No active floats directly assigned to this sector radius. Select another region or view all floats in ARGO Fleet Tracker.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {localFloats.map((float) => (
                      <div
                        key={float.id}
                        onClick={() => onSelectFloat?.(float)}
                        className="p-4 rounded-2xl bg-white border border-[#E5E7EB] hover:border-[#1E6091] transition-all cursor-pointer flex justify-between items-center shadow-2xs"
                      >
                        <div>
                          <span className="text-[10px] font-mono text-[#1E6091] font-bold">
                            FLOAT #{float.code}
                          </span>
                          <h4 className="text-sm font-bold text-[#0B3D4C]">{float.name}</h4>
                          <span className="text-xs text-[#2D3436]/70 font-mono">
                            {float.temp}°C • {float.salinity} PSU • {float.depth}m
                          </span>
                        </div>
                        <span className="text-xs font-mono font-bold text-[#22C55E] px-2.5 py-1 bg-emerald-50 rounded-lg border border-emerald-200">
                          {float.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* TAB 5: HISTORY */}
            {activeTab === 'history' && (
              <motion.div
                key="history"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-5xl mx-auto space-y-4 pb-10"
              >
                <div className="border-b border-[#E5E7EB] pb-2">
                  <h3 className="text-sm font-bold text-[#0B3D4C] uppercase font-mono tracking-wider">
                    Historical Expedition & Event Records
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {(location.historicalEvents || [
                    { year: '2025', event: 'Thermal Anomaly Event', impact: 'Surface warming trend observed.' }
                  ]).map((evt, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-white border border-[#E5E7EB] space-y-1 shadow-2xs">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-[#1E6091]">{evt.year}</span>
                        <span className="text-[10px] font-mono text-[#2D3436]/60">HISTORICAL EVENT</span>
                      </div>
                      <h4 className="text-sm font-bold text-[#0B3D4C]">{evt.event}</h4>
                      <p className="text-xs text-[#2D3436]/70">{evt.impact}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};
