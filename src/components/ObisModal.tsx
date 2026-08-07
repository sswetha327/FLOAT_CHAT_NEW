import React, { useState, useEffect } from 'react';
import {
  Fish,
  Globe,
  Search,
  ExternalLink,
  X,
  Sparkles,
  Info,
  ShieldAlert,
  Compass,
  MapPin,
  Layers,
  Database,
  Radio,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getObisSpeciesOccurrences, ObisSpeciesOccurrence } from '../services/obisService';
import { OceanLocation } from '../types';

interface ObisModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLocation: OceanLocation | null;
}

export const ObisModal: React.FC<ObisModalProps> = ({
  isOpen,
  onClose,
  selectedLocation,
}) => {
  const [speciesList, setSpeciesList] = useState<ObisSpeciesOccurrence[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    if (!isOpen) return;

    async function loadObisData() {
      setLoading(true);
      try {
        const lat = selectedLocation?.lat || 15.0;
        const lng = selectedLocation?.lng || 88.0;
        const results = await getObisSpeciesOccurrences(lat, lng, 150);
        setSpeciesList(results);
      } catch (err) {
        console.error('Error fetching OBIS records:', err);
      } finally {
        setLoading(false);
      }
    }

    loadObisData();
  }, [isOpen, selectedLocation]);

  const filteredSpecies = speciesList.filter((s) => {
    const matchesSearch =
      s.scientificName.toLowerCase().includes(searchFilter.toLowerCase()) ||
      (s.vernacularName && s.vernacularName.toLowerCase().includes(searchFilter.toLowerCase())) ||
      s.family.toLowerCase().includes(searchFilter.toLowerCase());

    if (selectedCategory === 'All') return matchesSearch;
    if (selectedCategory === 'Fish') return matchesSearch && (s.class === 'Actinopterygii' || s.class === 'Chondrichthyes');
    if (selectedCategory === 'Mammals') return matchesSearch && s.class === 'Mammalia';
    if (selectedCategory === 'Corals/Cnidaria') return matchesSearch && (s.phylum === 'Cnidaria' || s.class === 'Anthozoa');
    return matchesSearch;
  });

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-4xl bg-[#0B3D4C] border border-[#1E6091] text-[#FAF6F0] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-5 border-b border-[#1E6091]/50 bg-[#072B36] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-[#22C55E]/20 border border-[#22C55E]/40 text-[#22C55E] shadow-inner">
                <Fish className="w-6 h-6 text-[#22C55E]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-black text-white tracking-wide">
                    OBIS Ocean Biodiversity Explorer
                  </h2>
                  <span className="px-2 py-0.5 rounded-full bg-[#22C55E]/20 text-[#22C55E] text-[10px] font-mono font-bold border border-[#22C55E]/30">
                    obis.org API LIVE
                  </span>
                </div>
                <p className="text-xs text-[#FAF6F0]/70 font-mono mt-0.5">
                  Real marine species occurrences & biodiversity records from UNESCO / IOC OBIS
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-[#0B3D4C] hover:bg-red-500/20 text-[#FAF6F0]/70 hover:text-white border border-[#1E6091]/40 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Location Context Banner & Controls */}
          <div className="px-5 py-3 bg-[#0B3D4C] border-b border-[#1E6091]/40 flex flex-wrap items-center justify-between gap-3 text-xs">
            {/* Search Bar */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-3.5 h-3.5 text-[#4ECDC4] absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search species (e.g. Tuna, Blue Whale, Coral)..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full bg-[#072B36] border border-[#1E6091]/40 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-[#FAF6F0]/40 outline-none focus:border-[#4ECDC4]"
              />
            </div>

            {/* Category Filters */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {['All', 'Fish', 'Mammals', 'Corals/Cnidaria'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[#22C55E] text-[#0B3D4C] shadow-xs'
                      : 'bg-[#072B36] text-[#FAF6F0]/70 hover:text-white border border-[#1E6091]/30'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Location Target Bar */}
          {selectedLocation && (
            <div className="px-5 py-2 bg-[#072B36]/60 border-b border-[#1E6091]/30 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2 text-[#4ECDC4]">
                <MapPin className="w-3.5 h-3.5 text-[#4ECDC4]" />
                <span>Sector: <b>{selectedLocation.name}</b> ({selectedLocation.lat.toFixed(2)}°N, {selectedLocation.lng.toFixed(2)}°E)</span>
              </div>
              <span className="text-[11px] text-[#FAF6F0]/60">
                {filteredSpecies.length} OBIS species recorded
              </span>
            </div>
          )}

          {/* Main Species List Area */}
          <div className="p-5 overflow-y-auto custom-scrollbar flex-1 space-y-3">
            {loading ? (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
                <Radio className="w-8 h-8 text-[#22C55E] animate-spin" />
                <p className="text-xs font-mono text-[#FAF6F0]/70">
                  Querying OBIS (Ocean Biodiversity Information System) API...
                </p>
              </div>
            ) : filteredSpecies.length === 0 ? (
              <div className="py-12 text-center text-xs font-mono text-[#FAF6F0]/60">
                No species records matched your search query in this ocean region.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {filteredSpecies.map((species) => (
                  <div
                    key={species.id}
                    className="p-4 rounded-2xl bg-[#072B36] border border-[#1E6091]/40 space-y-2.5 hover:border-[#22C55E] transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2 border-b border-[#1E6091]/30 pb-2">
                      <div>
                        <span className="text-[10px] font-mono text-[#22C55E] font-bold block italic uppercase">
                          {species.genus || species.family}
                        </span>
                        <h4 className="text-sm font-bold text-white italic">
                          {species.scientificName}
                        </h4>
                        {species.vernacularName && (
                          <span className="text-xs text-[#F59E0B] font-medium font-sans block mt-0.5">
                            "{species.vernacularName}"
                          </span>
                        )}
                      </div>

                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold shrink-0 ${
                        species.iucnRedListCategory?.includes('Endangered') || species.iucnRedListCategory?.includes('Critically')
                          ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                          : species.iucnRedListCategory?.includes('Vulnerable')
                          ? 'bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/40'
                          : 'bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/40'
                      }`}>
                        {species.iucnRedListCategory || 'Evaluated'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                      <div className="p-2 bg-[#0B3D4C] rounded-xl border border-[#1E6091]/30">
                        <span className="text-[9px] text-[#FAF6F0]/60 block">CLASS / FAMILY</span>
                        <span className="font-bold text-[#4ECDC4] truncate block">{species.class} • {species.family}</span>
                      </div>
                      <div className="p-2 bg-[#0B3D4C] rounded-xl border border-[#1E6091]/30">
                        <span className="text-[9px] text-[#FAF6F0]/60 block">OBSERVATION DEPTH</span>
                        <span className="font-bold text-[#FAF6F0]">{species.depthMeters ?? 25} meters</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-mono text-[#FAF6F0]/60 pt-1">
                      <span>Node: {species.institutionCode}</span>
                      <span>Dataset: {species.datasetName}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-[#1E6091]/40 bg-[#072B36] flex items-center justify-between text-xs text-[#FAF6F0]/70 font-mono">
            <span className="flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-[#22C55E]" />
              UNESCO / IOC Ocean Biodiversity Information System (OBIS)
            </span>

            <a
              href="https://obis.org"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-[#22C55E] hover:underline font-bold"
            >
              <span>obis.org</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
