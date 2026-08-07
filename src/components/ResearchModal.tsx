import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Search,
  ExternalLink,
  X,
  Sparkles,
  FileText,
  UserCheck,
  Calendar,
  Bookmark,
  Award,
  Radio,
  Share2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { searchOceanResearchPapers, AcademicPaper } from '../services/researchService';
import { OceanLocation } from '../types';

interface ResearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLocation: OceanLocation | null;
}

export const ResearchModal: React.FC<ResearchModalProps> = ({
  isOpen,
  onClose,
  selectedLocation,
}) => {
  const [query, setQuery] = useState<string>('ARGO float oceanography temperature salinity');
  const [papers, setPapers] = useState<AcademicPaper[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [savedPaperIds, setSavedPaperIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!isOpen) return;

    const initialSearch = selectedLocation
      ? `${selectedLocation.name} oceanography ARGO float salinity`
      : 'ARGO float oceanography temperature salinity';

    setQuery(initialSearch);
    handleSearch(initialSearch);
  }, [isOpen, selectedLocation]);

  const handleSearch = async (searchQuery?: string) => {
    const q = searchQuery || query;
    if (!q.trim()) return;

    setLoading(true);
    try {
      const results = await searchOceanResearchPapers(q);
      setPapers(results);
    } catch (err) {
      console.error('Error searching research papers:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleSavePaper = (paperId: string) => {
    setSavedPaperIds((prev) => {
      const updated = new Set(prev);
      if (updated.has(paperId)) {
        updated.delete(paperId);
      } else {
        updated.add(paperId);
      }
      return updated;
    });
  };

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
              <div className="p-3 rounded-2xl bg-[#4ECDC4]/20 border border-[#4ECDC4]/40 text-[#4ECDC4] shadow-inner">
                <BookOpen className="w-6 h-6 text-[#4ECDC4]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-black text-white tracking-wide">
                    AI Research Literature & RAG Paper Finder
                  </h2>
                  <span className="px-2 py-0.5 rounded-full bg-[#4ECDC4]/20 text-[#4ECDC4] text-[10px] font-mono font-bold border border-[#4ECDC4]/30">
                    Semantic Scholar & OpenAlex LIVE
                  </span>
                </div>
                <p className="text-xs text-[#FAF6F0]/70 font-mono mt-0.5">
                  Peer-reviewed oceanographic papers, ARGO profiling studies, and climate manuals
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

          {/* Search Controls */}
          <div className="p-4 bg-[#0B3D4C] border-b border-[#1E6091]/40">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSearch();
              }}
              className="flex items-center gap-2"
            >
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[#4ECDC4] absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search research papers (e.g., Bay of Bengal Monsoon, Thermocline, BGC ARGO)..."
                  className="w-full bg-[#072B36] border border-[#1E6091]/40 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-[#FAF6F0]/40 outline-none focus:border-[#4ECDC4]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 rounded-xl bg-[#1E6091] hover:bg-[#4ECDC4] text-white hover:text-[#0B3D4C] text-xs font-mono font-bold transition-all cursor-pointer shadow-xs border border-[#1E6091]"
              >
                Search Papers
              </button>
            </form>

            {/* Quick Topic Chips */}
            <div className="flex items-center gap-1.5 flex-wrap mt-3 text-xs">
              <span className="text-[10px] font-mono text-[#4ECDC4] font-bold uppercase mr-1">
                QUICK TOPICS:
              </span>
              {[
                'ARGO Float Profiles',
                'Bay of Bengal Monsoon',
                'Marine Heatwaves',
                'Biogeochemical Carbon',
                'AMOC Overturning',
              ].map((topic) => (
                <button
                  key={topic}
                  onClick={() => {
                    setQuery(topic);
                    handleSearch(topic);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-[#072B36] hover:bg-[#1E6091]/40 text-[#FAF6F0]/80 hover:text-white border border-[#1E6091]/30 text-[11px] font-mono transition-all cursor-pointer"
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>

          {/* Paper List Area */}
          <div className="p-5 overflow-y-auto custom-scrollbar flex-1 space-y-4">
            {loading ? (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
                <Radio className="w-8 h-8 text-[#4ECDC4] animate-spin" />
                <p className="text-xs font-mono text-[#FAF6F0]/70">
                  Querying Semantic Scholar & OpenAlex Academic Repositories...
                </p>
              </div>
            ) : papers.length === 0 ? (
              <div className="py-12 text-center text-xs font-mono text-[#FAF6F0]/60">
                No research papers found for "{query}". Try a broader term.
              </div>
            ) : (
              <div className="space-y-3.5">
                {papers.map((paper) => {
                  const isSaved = savedPaperIds.has(paper.id);
                  return (
                    <div
                      key={paper.id}
                      className="p-4 rounded-2xl bg-[#072B36] border border-[#1E6091]/40 space-y-2.5 hover:border-[#4ECDC4] transition-colors"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="px-2 py-0.5 rounded-full bg-[#1E6091]/30 border border-[#1E6091]/50 text-[#4ECDC4] text-[10px] font-mono font-bold">
                              {paper.source}
                            </span>
                            <span className="text-[10px] font-mono text-[#F59E0B] font-bold">
                              Published {paper.year} • {paper.citationCount} Citations
                            </span>
                          </div>

                          <h3 className="text-sm sm:text-base font-bold text-white leading-snug">
                            {paper.title}
                          </h3>
                        </div>

                        <button
                          onClick={() => toggleSavePaper(paper.id)}
                          className={`p-2 rounded-xl transition-all cursor-pointer ${
                            isSaved
                              ? 'bg-[#F59E0B] text-[#0B3D4C]'
                              : 'bg-[#0B3D4C] text-[#FAF6F0]/60 hover:text-white border border-[#1E6091]/40'
                          }`}
                          title={isSaved ? 'Saved to bookmarks' : 'Save paper'}
                        >
                          <Bookmark className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-[#4ECDC4] font-mono">
                        <UserCheck className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{paper.authors.join(', ')}</span>
                      </div>

                      <p className="text-xs text-[#FAF6F0]/80 leading-relaxed font-sans line-clamp-3">
                        {paper.abstract}
                      </p>

                      <div className="flex items-center justify-between text-xs font-mono pt-2 border-t border-[#1E6091]/30">
                        <span className="text-[#FAF6F0]/60 italic truncate max-w-[60%]">
                          {paper.journalOrVenue}
                        </span>

                        {paper.url && (
                          <a
                            href={paper.url}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-1 text-[#4ECDC4] hover:underline font-bold"
                          >
                            <span>Read Full Paper</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-[#1E6091]/40 bg-[#072B36] flex items-center justify-between text-xs text-[#FAF6F0]/70 font-mono">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#4ECDC4]" />
              RAG Knowledge Base powered by Semantic Scholar & ARGO Repository
            </span>

            <span className="text-[#4ECDC4] font-bold">
              {savedPaperIds.size} Papers Bookmarked
            </span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
