import React, { useState } from 'react';
import { ArgoFloat, OceanLocation } from '../types';
import { OCEAN_LOCATIONS } from '../data/oceanData';
import { Radio, Search, Battery, MapPin, Clock, Globe } from 'lucide-react';
import { motion } from 'motion/react';

interface ArgoFleetViewProps {
  argoFloats: ArgoFloat[];
  onSelectFloat: (float: ArgoFloat) => void;
  locations?: OceanLocation[];
  onSelectLocation?: (loc: OceanLocation) => void;
}

export const ArgoFleetView: React.FC<ArgoFleetViewProps> = ({
  argoFloats,
  onSelectFloat,
  locations = OCEAN_LOCATIONS,
  onSelectLocation,
}) => {
  const [search, setSearch] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('All');

  const locs = locations && locations.length > 0 ? locations : OCEAN_LOCATIONS;

  const filteredFloats = argoFloats.filter((f) => {
    const matchesSearch =
      f.code.toLowerCase().includes(search.toLowerCase()) ||
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.ocean.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === 'All' || f.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="w-full h-full p-6 overflow-y-auto custom-scrollbar space-y-6 bg-[#F6F8FB] text-slate-800">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-[#F59E0B]" />
            <span className="text-xs font-mono font-bold text-[#F59E0B] uppercase tracking-widest">
              GLOBAL ARGO PROFILER FLEET
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1">
            Autonomous Ocean Robot Network
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            3,900+ global autonomous floats collecting CTD profiles down to 2,000 meters.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {['All', 'Active', 'Profiling', 'Transmitting'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-all cursor-pointer ${
                filterStatus === status
                  ? 'bg-[#F59E0B] text-white font-bold shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Sector & City Quick-Select Fly Camera Grid */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-slate-800 font-mono flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#00B8D9]" />
            Click Any Sector or City to Fly Camera on 3D Globe
          </h3>
          <span className="text-[10px] font-mono text-slate-400 font-semibold">
            Select sector to launch 3D globe camera
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {locs.map((loc) => (
            <button
              key={loc.id}
              onClick={() => {
                if (onSelectLocation) onSelectLocation(loc);
              }}
              className="p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-[#00B8D9] hover:bg-[#00B8D9]/5 transition-all text-left group cursor-pointer"
            >
              <span className="text-[10px] text-[#00B8D9] font-mono block uppercase font-bold">
                {loc.type === 'ocean' ? loc.nearestOcean : loc.type}
              </span>
              <span className="text-xs font-bold text-slate-800 group-hover:text-[#00B8D9] block truncate">
                {loc.name}
              </span>
              <div className="flex items-center justify-between mt-2 text-[10px] text-slate-500 font-mono">
                <span>{loc.avgTemp}°C</span>
                <span className="text-blue-600 font-semibold">{loc.avgSalinity} PSU</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Search Input */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#F59E0B]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter float code, name, ocean..."
            className="w-full bg-white border border-slate-200 focus:border-[#F59E0B] rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 outline-none shadow-2xs"
          />
        </div>
        {search && (
          <button
            onClick={() => setSearch('')}
            className="text-xs text-slate-500 hover:text-slate-800 underline font-mono"
          >
            Clear Filter
          </button>
        )}
      </div>

      {/* Floats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFloats.map((float) => (
          <motion.div
            key={float.id}
            whileHover={{ y: -3 }}
            onClick={() => onSelectFloat(float)}
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-[#F59E0B] shadow-sm hover:shadow-md transition-all cursor-pointer space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-[#F59E0B] text-xs font-mono font-bold">
                #{float.code}
              </span>
              <span className="flex items-center gap-1.5 text-xs font-mono text-[#22C55E] font-semibold">
                <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
                {float.status}
              </span>
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-900">{float.name}</h3>
              <span className="text-xs text-slate-500 font-mono flex items-center gap-1 mt-1">
                <MapPin className="w-3.5 h-3.5 text-[#F59E0B]" />
                {float.ocean} ({float.lat.toFixed(1)}°, {float.lng.toFixed(1)}°)
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] font-mono text-slate-700">
              <div>
                <span className="text-[9px] text-slate-400 block font-semibold">TEMP</span>
                <span className="text-[#00B8D9] font-bold">{float.temp}°C</span>
              </div>
              <div>
                <span className="text-[9px] text-slate-400 block font-semibold">SALINITY</span>
                <span className="text-blue-600 font-bold">{float.salinity}</span>
              </div>
              <div>
                <span className="text-[9px] text-slate-400 block font-semibold">DEPTH</span>
                <span className="text-purple-600 font-bold">{float.depth}m</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pt-1 border-t border-slate-100">
              <span className="flex items-center gap-1">
                <Battery className="w-3.5 h-3.5 text-[#22C55E]" /> Battery: {float.battery}%
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#F59E0B]" /> Surface: {float.lastSurface}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
