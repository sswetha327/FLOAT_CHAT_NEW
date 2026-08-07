import React, { useState, useEffect } from 'react';
import { OceanLocation, OceanReport } from '../types';
import {
  FileText,
  Sparkles,
  Download,
  Check,
  X,
  Loader2,
  ShieldCheck,
  Thermometer,
  Droplets,
  Gauge,
  Radio,
  Printer,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ReportModalProps {
  location: OceanLocation;
  isOpen: boolean;
  onClose: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  location,
  isOpen,
  onClose,
}) => {
  const [report, setReport] = useState<OceanReport | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) return;

    const fetchReport = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/generate-report', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ location }),
        });
        const data = await res.json();
        if (data.report) {
          setReport(data.report);
        }
      } catch (err) {
        console.error('Failed to fetch report:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReport();
  }, [location, isOpen]);

  const handleExportText = () => {
    if (!report) return;
    const textContent = `
=================================================
FLOATCHAT SATELLITE OCEANOGRAPHIC ASSESSMENT REPORT
=================================================
Report ID: ${report.id}
Target Region: ${report.locationName}
Generated Date: ${report.generatedAt}
Classification: NASA / GOOS / ARGO PUBLIC DATASET

1. EXECUTIVE SUMMARY
-------------------------------------------------
${report.summary}

2. HYDROGRAPHIC METRICS
-------------------------------------------------
- Sea Surface Temperature: ${report.metrics.temperature}
- Salinity Level: ${report.metrics.salinity}
- Profiling Pressure: ${report.metrics.pressure}
- Ocean Health Score: ${report.metrics.healthScore} / 100
- Active ARGO Profilers: ${report.metrics.activeFloats}

3. AI SCIENTIFIC INSIGHTS
-------------------------------------------------
${(report.keyInsights || []).map((ins, i) => `${i + 1}. ${ins}`).join('\n')}

4. ENVIRONMENTAL RECOMMENDATIONS
-------------------------------------------------
${(report.recommendations || []).map((rec, i) => `${i + 1}. ${rec}`).join('\n')}

=================================================
FloatChat • Explore the Ocean Through AI
=================================================
    `;

    const blob = new Blob([textContent.trim()], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FloatChat_Report_${location.name.replace(/\s+/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);

    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-3xl rounded-3xl bg-white border border-[#E5E7EB] p-6 shadow-2xl text-[#2D3436] max-h-[85vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-[#1E6091] text-white shadow-md">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-[#1E6091] uppercase tracking-widest block">
                  AI HYDROGRAPHIC ASSESSMENT REPORT
                </span>
                <h2 className="text-xl font-extrabold text-[#0B3D4C]">
                  {location.name} ({location.nearestOcean})
                </h2>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-[#FAF6F0] border border-[#E5E7EB] text-[#2D3436]/60 hover:text-[#0B3D4C] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Content */}
          <div className="flex-1 overflow-y-auto custom-scrollbar my-4 pr-1 space-y-5 text-xs">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 text-[#1E6091] gap-3 font-mono">
                <Loader2 className="w-8 h-8 animate-spin text-[#1E6091]" />
                <span>Synthesizing satellite altimetry & CTD profiles...</span>
              </div>
            ) : report ? (
              <>
                {/* Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                  <div className="p-3 rounded-xl bg-[#FAF6F0] border border-[#E5E7EB] text-center">
                    <span className="text-[10px] text-[#2D3436]/60 font-mono block">Temp</span>
                    <span className="text-sm font-bold text-[#0B3D4C] font-mono">{report.metrics.temperature}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#FAF6F0] border border-[#E5E7EB] text-center">
                    <span className="text-[10px] text-[#2D3436]/60 font-mono block">Salinity</span>
                    <span className="text-sm font-bold text-[#1E6091] font-mono">{report.metrics.salinity}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#FAF6F0] border border-[#E5E7EB] text-center">
                    <span className="text-[10px] text-[#2D3436]/60 font-mono block">Pressure</span>
                    <span className="text-sm font-bold text-[#0B3D4C] font-mono">{report.metrics.pressure}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#FAF6F0] border border-[#E5E7EB] text-center">
                    <span className="text-[10px] text-[#2D3436]/60 font-mono block">Floats</span>
                    <span className="text-sm font-bold text-[#FF6B6B] font-mono">{report.metrics.activeFloats} Active</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#FAF6F0] border border-[#E5E7EB] text-center col-span-2 sm:col-span-1">
                    <span className="text-[10px] text-[#2D3436]/60 font-mono block">Health Score</span>
                    <span className="text-sm font-bold text-[#22C55E] font-mono">{report.metrics.healthScore} / 100</span>
                  </div>
                </div>

                {/* Summary */}
                <div className="p-4 rounded-2xl bg-[#FAF6F0] border border-[#E5E7EB] space-y-1.5">
                  <h4 className="text-xs font-bold text-[#1E6091] font-mono uppercase flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-[#1E6091]" />
                    Executive Summary
                  </h4>
                  <p className="text-[#2D3436] leading-relaxed text-xs">{report.summary}</p>
                </div>

                {/* Key Insights */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-[#0B3D4C] font-mono uppercase">
                    Key AI Scientific Insights
                  </h4>
                  <div className="space-y-2">
                    {(report.keyInsights || []).map((ins, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-xl bg-[#FAF6F0] border border-[#E5E7EB] flex items-start gap-2.5"
                      >
                        <span className="w-5 h-5 rounded-lg bg-[#1E6091]/15 text-[#1E6091] font-mono font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                          0{i + 1}
                        </span>
                        <p className="text-[#2D3436] leading-snug">{ins}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommendations */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-[#22C55E] font-mono uppercase">
                    Environmental & Monitoring Recommendations
                  </h4>
                  <div className="space-y-2">
                    {(report.recommendations || []).map((rec, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-xl bg-[#FAF6F0] border border-[#E5E7EB] flex items-start gap-2.5"
                      >
                        <ShieldCheck className="w-4 h-4 text-[#22C55E] shrink-0 mt-0.5" />
                        <p className="text-[#2D3436] leading-snug">{rec}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : null}
          </div>

          {/* Footer Actions */}
          <div className="border-t border-[#E5E7EB] pt-4 flex items-center justify-between">
            <span className="text-[10px] text-[#2D3436]/60 font-mono">
              FloatChat Hydrographic Intelligence • NASA / ARGO Network
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={handleExportText}
                disabled={!report || isLoading}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FF6B6B] hover:bg-[#ff5252] text-[#4A1B0C] font-bold text-xs transition-all shadow-md disabled:opacity-50 cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-[#4A1B0C]" /> : <Download className="w-4 h-4" />}
                <span>{copied ? 'Downloaded Report!' : 'Export Report (.txt)'}</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
