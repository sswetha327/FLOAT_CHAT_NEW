import React, { useState } from 'react';
import {
  X,
  Thermometer,
  Droplets,
  Gauge,
  Radio,
  Wind,
  ShieldCheck,
  TrendingUp,
  Clock,
  Sparkles,
  Download,
  Share2,
  Check,
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

export interface MetricDetailData {
  id: string;
  title: string;
  subtitle: string;
  unit: string;
  currentValue: string;
  changeRate: string;
  iconType: 'temp' | 'salinity' | 'pressure' | 'floats' | 'currents' | 'health';
  color: string;
  aiExplanation: string;
  timeSeriesData: Record<string, { label: string; value: number; predicted?: number }[]>;
  metricsGrid: { label: string; value: string; note: string }[];
}

interface MetricDetailModalProps {
  metric: MetricDetailData | null;
  onClose: () => void;
}

export const MetricDetailModal: React.FC<MetricDetailModalProps> = ({
  metric,
  onClose,
}) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('Past Week');
  const [copied, setCopied] = useState<boolean>(false);

  if (!metric) return null;

  const currentChartData = metric.timeSeriesData[selectedTimeframe] || metric.timeSeriesData['Past Week'];

  const getIcon = () => {
    switch (metric.iconType) {
      case 'temp':
        return <Thermometer className="w-6 h-6 text-[#1E6091]" />;
      case 'salinity':
        return <Droplets className="w-6 h-6 text-[#1E6091]" />;
      case 'pressure':
        return <Gauge className="w-6 h-6 text-[#7C3AED]" />;
      case 'floats':
        return <Radio className="w-6 h-6 text-[#F59E0B]" />;
      case 'currents':
        return <Wind className="w-6 h-6 text-[#22C55E]" />;
      case 'health':
        return <ShieldCheck className="w-6 h-6 text-[#22C55E]" />;
      default:
        return <Thermometer className="w-6 h-6 text-[#1E6091]" />;
    }
  };

  const handleExportCSV = () => {
    let csvContent = `Label,Value,Unit\n`;
    currentChartData.forEach((row) => {
      csvContent += `"${row.label}",${row.value},"${metric.unit}"\n`;
    });
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${metric.id}_${selectedTimeframe.toLowerCase().replace(/ /g, '_')}_data.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto custom-scrollbar rounded-3xl bg-white border border-[#E5E7EB] shadow-2xl p-6 text-[#2D3436] space-y-6"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-[#FAF6F0] hover:bg-slate-200 text-[#2D3436]/60 hover:text-[#0B3D4C] transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pr-10">
            <div className="flex items-center gap-3">
              <div className="p-3.5 rounded-2xl bg-[#FAF6F0] border border-[#E5E7EB] shadow-2xs">
                {getIcon()}
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-[#1E6091] uppercase tracking-widest block">
                  DETAILED HYDROGRAPHIC ANALYSIS
                </span>
                <h2 className="text-2xl font-black text-[#0B3D4C]">{metric.title}</h2>
                <p className="text-xs text-[#2D3436]/70">{metric.subtitle}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-3xl font-black text-[#0B3D4C] font-mono block">
                  {metric.currentValue}
                </span>
                <span className="text-xs text-[#22C55E] font-mono font-bold flex items-center justify-end gap-1">
                  <TrendingUp className="w-3.5 h-3.5" /> {metric.changeRate}
                </span>
              </div>
            </div>
          </div>

          {/* Timeframe Selector Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-2 rounded-2xl bg-[#FAF6F0] border border-[#E5E7EB]">
            <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar">
              {['Current', 'Past 24 Hours', 'Past Week', 'Past Month', 'Past Year', 'Future Prediction'].map((tf) => (
                <button
                  key={tf}
                  onClick={() => setSelectedTimeframe(tf)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer whitespace-nowrap ${
                    selectedTimeframe === tf
                      ? 'bg-[#1E6091] text-white font-bold shadow-xs'
                      : 'text-[#2D3436]/70 hover:text-[#1E6091] hover:bg-white'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-[#E5E7EB] text-[#2D3436] text-xs font-mono font-medium transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-[#1E6091]" /> Export CSV
              </button>
              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-[#E5E7EB] text-[#2D3436] text-xs font-mono font-medium transition-all cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#22C55E]" /> : <Share2 className="w-3.5 h-3.5 text-[#1E6091]" />}
                {copied ? 'Copied' : 'Share'}
              </button>
            </div>
          </div>

          {/* Interactive Recharts Graph */}
          <div className="p-5 rounded-2xl bg-[#FAF6F0] border border-[#E5E7EB] shadow-sm space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-[#2D3436]/60">
              <span className="flex items-center gap-1.5 text-[#0B3D4C] font-bold">
                <Clock className="w-4 h-4 text-[#1E6091]" /> Time Horizon: {selectedTimeframe}
              </span>
              <span>Unit: {metric.unit}</span>
            </div>

            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={currentChartData}>
                  <defs>
                    <linearGradient id="metricGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={metric.color === '#00B8D9' ? '#1E6091' : metric.color} stopOpacity={0.4} />
                      <stop offset="95%" stopColor={metric.color === '#00B8D9' ? '#1E6091' : metric.color} stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} unit={metric.unit} domain={['auto', 'auto']} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderColor: '#cbd5e1',
                      borderRadius: '12px',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                      color: '#0f172a',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke={metric.color === '#00B8D9' ? '#1E6091' : metric.color}
                    strokeWidth={2.5}
                    fill="url(#metricGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Metrics Key Takeaway Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {(metric.metricsGrid || []).map((mg, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-[#FAF6F0] border border-[#E5E7EB]">
                <span className="text-[10px] font-mono text-[#2D3436]/60 block uppercase font-semibold">{mg.label}</span>
                <span className="text-base font-bold text-[#0B3D4C] font-mono mt-0.5 block">{mg.value}</span>
                <span className="text-[10px] text-[#1E6091] font-mono block mt-1">{mg.note}</span>
              </div>
            ))}
          </div>

          {/* AI Explanation Box */}
          <div className="p-4 rounded-2xl bg-[#1E6091]/10 border border-[#1E6091]/30 space-y-2">
            <div className="flex items-center gap-2 text-[#0B3D4C] font-bold text-xs">
              <Sparkles className="w-4 h-4 text-[#1E6091]" />
              <span>AI Oceanographic Interpretation</span>
            </div>
            <p className="text-xs text-[#2D3436] leading-relaxed">
              {metric.aiExplanation}
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
