import React from 'react';
import { OceanLocation } from '../types';
import { Thermometer, Droplets, Gauge, Radio, Wind, Sparkles, FileText, ChevronRight, X } from 'lucide-react';
import { motion } from 'motion/react';

interface LocationCardProps {
  location: OceanLocation;
  onClose: () => void;
  onOpenBottomPanel: () => void;
  onGenerateReport: () => void;
}

export const LocationCard: React.FC<LocationCardProps> = ({
  location,
  onClose,
  onOpenBottomPanel,
  onGenerateReport,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -80, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: -80, scale: 0.95 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="absolute top-6 left-6 z-30 w-80 sm:w-88 rounded-2xl bg-white border border-[#E5E7EB] p-5 shadow-xl text-[#2D3436] max-h-[85vh] overflow-y-auto custom-scrollbar"
    >
      {/* Header with Close X Button */}
      <div className="flex items-start justify-between border-b border-[#E5E7EB] pb-3 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded-full bg-[#1E6091]/10 border border-[#1E6091]/30 text-[10px] font-mono text-[#1E6091] uppercase tracking-widest font-bold">
              {location.type}
            </span>
            <span className="text-xs text-[#2D3436]/70 font-medium">{location.nearestOcean}</span>
          </div>
          <h2 className="text-xl font-bold text-[#0B3D4C] tracking-tight">
            {location.name}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right">
            <span className="text-[10px] text-[#2D3436]/50 block font-mono uppercase font-semibold">Updated</span>
            <span className="text-xs text-[#1E6091] font-mono font-semibold">{location.lastUpdated}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#2D3436]/50 hover:text-[#0B3D4C] hover:bg-[#FAF6F0] transition-colors cursor-pointer"
            title="Close Location Popup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="p-2.5 rounded-xl bg-[#FAF6F0] border border-[#E5E7EB] flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[#1E6091]/10 text-[#1E6091]">
            <Thermometer className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-[#2D3436]/60 block font-mono font-semibold">Avg Temp</span>
            <span className="text-base font-bold text-[#0B3D4C]">{location.avgTemp}°C</span>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-[#FAF6F0] border border-[#E5E7EB] flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[#4ECDC4]/15 text-[#1E6091]">
            <Droplets className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-[#2D3436]/60 block font-mono font-semibold">Avg Salinity</span>
            <span className="text-base font-bold text-[#0B3D4C]">{location.avgSalinity} PSU</span>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-[#FAF6F0] border border-[#E5E7EB] flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[#1E6091]/10 text-[#1E6091]">
            <Gauge className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-[#2D3436]/60 block font-mono font-semibold">Avg Depth</span>
            <span className="text-base font-bold text-[#0B3D4C]">{location.avgDepth} m</span>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-[#FAF6F0] border border-[#E5E7EB] flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[#FF6B6B]/15 text-[#FF6B6B]">
            <Radio className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-[#2D3436]/60 block font-mono font-semibold">ARGO Floats</span>
            <span className="text-base font-bold text-[#FF6B6B]">
              {location.argoFloatIds.length} Active
            </span>
          </div>
        </div>
      </div>

      {/* Ocean Current Speed */}
      <div className="p-2.5 rounded-xl bg-[#FAF6F0] border border-[#E5E7EB] flex items-center justify-between mb-4 text-xs">
        <div className="flex items-center gap-2 text-[#2D3436]">
          <Wind className="w-4 h-4 text-[#1E6091]" />
          <span>Ocean Current Velocity:</span>
        </div>
        <span className="font-mono font-semibold text-[#1E6091]">{location.currentSpeed}</span>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={onOpenBottomPanel}
          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#FF6B6B] hover:bg-[#ff5252] text-[#4A1B0C] font-bold text-xs shadow-xs transition-all cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Explorer Story</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={onGenerateReport}
          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#1E6091] hover:bg-[#1E6091]/90 text-white font-medium text-xs transition-all cursor-pointer"
        >
          <FileText className="w-3.5 h-3.5 text-[#4ECDC4]" />
          <span>AI Report</span>
        </button>
      </div>
    </motion.div>
  );
};
