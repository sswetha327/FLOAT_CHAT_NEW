import React, { useState, useRef, useEffect } from 'react';
import { OceanLocation, ArgoFloat } from '../types';
import { Search, MapPin, Radio, Zap, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SearchBarProps {
  locations: OceanLocation[];
  argoFloats: ArgoFloat[];
  onSelectLocation: (loc: OceanLocation) => void;
  onSelectFloat?: (float: ArgoFloat) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  locations,
  argoFloats,
  onSelectLocation,
  onSelectFloat,
}) => {
  const [query, setQuery] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter locations & floats
  const filteredLocations = query.trim()
    ? locations.filter(
        (l) =>
          l.name.toLowerCase().includes(query.toLowerCase()) ||
          l.nearestOcean.toLowerCase().includes(query.toLowerCase()) ||
          l.type.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const filteredFloats = query.trim()
    ? argoFloats.filter(
        (f) =>
          f.code.toLowerCase().includes(query.toLowerCase()) ||
          f.name.toLowerCase().includes(query.toLowerCase()) ||
          f.ocean.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const hasResults = filteredLocations.length > 0 || filteredFloats.length > 0;

  return (
    <div ref={searchRef} className="relative w-full">
      <div className="relative flex items-center">
        <Search className="absolute left-3.5 w-4 h-4 text-[#4ECDC4] pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search Ocean Basins, Floats, or Anomalies..."
          className="w-full bg-[#0B3D4C]/40 border border-[#1E6091]/50 focus:border-[#4ECDC4] focus:bg-[#0B3D4C]/70 rounded-full py-2 pl-10 pr-8 text-xs sm:text-sm text-[#FAF6F0] placeholder-[#FAF6F0]/60 outline-none transition-all shadow-inner"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setIsOpen(false);
            }}
            className="absolute right-3 p-0.5 text-[#FAF6F0]/70 hover:text-[#4ECDC4] transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Autocomplete Dropdown */}
      <AnimatePresence>
        {isOpen && query.trim() && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute top-10 left-0 right-0 z-50 rounded-2xl bg-white border border-[#1E6091]/20 p-2 shadow-xl max-h-80 overflow-y-auto custom-scrollbar text-[#2D3436]"
          >
            {!hasResults ? (
              <div className="p-3 text-center text-xs text-[#2D3436]/60 font-mono">
                No matching ocean sectors or floats found.
              </div>
            ) : (
              <div className="space-y-2">
                {/* Locations Section */}
                {filteredLocations.length > 0 && (
                  <div>
                    <span className="text-[10px] font-mono text-[#1E6091] font-bold uppercase tracking-wider px-2 py-1 block">
                      Ocean Regions & Coastal Hubs
                    </span>
                    {filteredLocations.map((loc) => (
                      <div
                        key={loc.id}
                        onClick={() => {
                          onSelectLocation(loc);
                          setQuery('');
                          setIsOpen(false);
                        }}
                        className="px-3 py-2 rounded-xl hover:bg-[#FAF6F0] transition-all cursor-pointer flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="p-1.5 rounded-lg bg-[#1E6091]/10 text-[#1E6091]">
                            <MapPin className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <span className="font-bold text-[#2D3436] block">{loc.name}</span>
                            <span className="text-[10px] text-[#2D3436]/70 font-mono">
                              {loc.nearestOcean} • {loc.avgTemp}°C
                            </span>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FAF6F0] text-[#1E6091] border border-[#1E6091]/20 font-semibold">
                          Fly To
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Floats Section */}
                {filteredFloats.length > 0 && (
                  <div className="border-t border-[#1E6091]/10 pt-1">
                    <span className="text-[10px] font-mono text-[#1E6091] font-bold uppercase tracking-wider px-2 py-1 block">
                      ARGO Profiling Floats
                    </span>
                    {filteredFloats.map((float) => (
                      <div
                        key={float.id}
                        onClick={() => {
                          if (onSelectFloat) onSelectFloat(float);
                          setQuery('');
                          setIsOpen(false);
                        }}
                        className="px-3 py-2 rounded-xl hover:bg-[#FAF6F0] transition-all cursor-pointer flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="p-1.5 rounded-lg bg-[#1E6091]/10 text-[#1E6091]">
                            <Radio className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <span className="font-bold text-[#2D3436] block">#{float.code}</span>
                            <span className="text-[10px] text-[#2D3436]/70 font-mono">
                              {float.name} ({float.ocean})
                            </span>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono text-[#22C55E] font-semibold">
                          {float.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
