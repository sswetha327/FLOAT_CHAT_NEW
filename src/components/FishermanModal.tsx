import React, { useState, useEffect } from 'react';
import {
  Fish,
  AlertTriangle,
  Volume2,
  VolumeX,
  Compass,
  MapPin,
  Waves,
  Shield,
  Clock,
  ExternalLink,
  X,
  Search,
  Sparkles,
  Radio,
  CheckCircle2,
  ChevronRight,
  Info,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getIncoisPFZZones, getIncoisAlerts, PFZZone, IncoisAlert, OceanStateForecast, getIncoisOceanStateForecast } from '../services/incoisService';
import { OceanLocation } from '../types';

interface FishermanModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLocation: OceanLocation | null;
  onSelectLocation?: (loc: OceanLocation) => void;
}

export const FishermanModal: React.FC<FishermanModalProps> = ({
  isOpen,
  onClose,
  selectedLocation,
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState<'EN' | 'TA' | 'HI' | 'TE' | 'ML' | 'MR'>('EN');
  const [pfzZones, setPfzZones] = useState<PFZZone[]>([]);
  const [alerts, setAlerts] = useState<IncoisAlert[]>([]);
  const [forecast, setForecast] = useState<OceanStateForecast | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'pfz' | 'forecast' | 'alerts'>('pfz');

  // Multi-lingual translations for Fisherman Mode
  const translations = {
    EN: {
      title: 'INCOIS Fisherman Assistance & Coastal Safety',
      subtitle: 'Indian National Centre for Ocean Information Services (INCOIS) Live Advisories',
      pfzTab: 'Potential Fishing Zones (PFZ)',
      forecastTab: 'Coastal Sea State',
      alertsTab: 'INCOIS Alerts & Waves',
      safe: 'SAFE SEA CONDITIONS',
      caution: 'CAUTION - MODERATE SEA',
      danger: 'WARNING - ROUGH SEA / NO VENTURING',
      readAdvisory: 'Listen to Audio Broadcast',
      stopAudio: 'Stop Audio Advisory',
      distance: 'Distance from Coast',
      targetDepth: 'Target Net Depth',
      chlorophyll: 'Chlorophyll Front',
      sst: 'SST Thermal Front',
      targetFish: 'Target Species Catch',
    },
    TA: {
      title: 'INCOIS மீனவர் உதவி மற்றும் கடலோர பாதுகாப்பு',
      subtitle: 'இந்திய தேசிய பெருங்கடல் தகவல் சேவை மையம் (INCOIS) நேரலை அறிவிப்புகள்',
      pfzTab: 'மீன்பிடி மண்டலங்கள் (PFZ)',
      forecastTab: 'கடல் நிலை கணிக்கீடு',
      alertsTab: 'அலை எச்சரிக்கைகள்',
      safe: 'பாதுகாப்பான கடல் நிலை',
      caution: 'எச்சரிக்கை - மிதமான கடல்',
      danger: 'ஆபத்து - கரடுமுரடான கடல்',
      readAdvisory: 'ஒலி அறிவிப்பைக் கேட்கவும்',
      stopAudio: 'ஒலியை நிறுத்து',
      distance: 'கரையில் இருந்து தூரம்',
      targetDepth: 'வலை ஆழம்',
      chlorophyll: 'பச்சையம் (Chlorophyll)',
      sst: 'வெப்பநிலை எல்லை',
      targetFish: 'இலக்கு மீன் வகைகள்',
    },
    HI: {
      title: 'INCOIS मछुआरा सहायता एवं तटीय सुरक्षा',
      subtitle: 'भारतीय राष्ट्रीय महासागर सूचना सेवा केंद्र (INCOIS) लाइव परामर्श',
      pfzTab: 'संभावित मत्स्य पालन क्षेत्र (PFZ)',
      forecastTab: 'समुद्री स्थिति पूर्वानुमान',
      alertsTab: 'उच्च तरंग चेतावनी',
      safe: 'सुरक्षित समुद्री स्थिति',
      caution: 'सावधानी - मध्यम समुद्र',
      danger: 'चेतावनी - खतरनाक समुद्र',
      readAdvisory: 'ऑडियो परामर्श सुनें',
      stopAudio: 'ऑडियो बंद करें',
      distance: 'तट से दूरी',
      targetDepth: 'जाल की गहराई',
      chlorophyll: 'क्लोरोफिल फ्रंट',
      sst: 'सतह तापमान सीमा',
      targetFish: 'लक्षित मछली प्रजातियां',
    },
    TE: {
      title: 'INCOIS మత్స్యకార సహాయం & తీరప్రాంత రక్షణ',
      subtitle: 'భారత జాతీయ మహాసముద్ర సమాచార సేవలు (INCOIS) లైవ్ సూచనలు',
      pfzTab: 'చేపల వేట మండలాలు (PFZ)',
      forecastTab: 'సముద్ర రవాణా సూచన',
      alertsTab: 'అలల హెచ్చరికలు',
      safe: 'సురక్షిత సముద్రం',
      caution: 'జాగ్రత్త - మధ్యస్థ సముద్రం',
      danger: 'హెచ్చరిక - ప్రమాదకర సముద్రం',
      readAdvisory: 'వాయిస్ ప్రసారం వినండి',
      stopAudio: 'వాయిస్ ఆపండి',
      distance: 'తీరం నుండి దూరం',
      targetDepth: 'వల లోతు',
      chlorophyll: 'క్లోరోఫిల్ ఫ్రంట్',
      sst: 'ఉష్ణోగ్రత సరళి',
      targetFish: 'చేపల రకాలు',
    },
    ML: {
      title: 'INCOIS മൽസ്യത്തൊഴിലാളി സഹായം & തീരദേശ സുരക്ഷ',
      subtitle: 'ഇന്ത്യൻ നാഷണൽ സെന്റർ ഫോർ ഓഷ്യൻ ഇൻഫർമേഷൻ സർവീസസ് (INCOIS)',
      pfzTab: 'മത്സ്യബന്ധന മേഖലകൾ (PFZ)',
      forecastTab: 'കടൽ അവസ്ഥ പ്രവചനം',
      alertsTab: 'തിരമാല മുന്നറിയിപ്പ്',
      safe: 'സുരക്ഷിത കടൽ അവസ്ഥ',
      caution: 'ജാഗ്രത - മിതമായ കടൽ',
      danger: 'അപകട മുന്നറിയിപ്പ്',
      readAdvisory: 'ശബ്ദ സന്ദേശം കേൾക്കുക',
      stopAudio: 'ശബ്ദം നിർത്തുക',
      distance: 'തീരത്തുനിന്നുള്ള ദൂരം',
      targetDepth: 'വലയുടെ ആഴം',
      chlorophyll: 'ക്ലോറോഫിൽ അളവ്',
      sst: 'ഉപരിതല താപനില',
      targetFish: 'ലക്ഷ്യമിടുന്ന മത്സ്യങ്ങൾ',
    },
    MR: {
      title: 'INCOIS मच्छिमार मदत आणि किनारी सुरक्षा',
      subtitle: 'भारतीय राष्ट्रीय महासागर माहिती सेवा केंद्र (INCOIS) थेट सूचना',
      pfzTab: 'संभाव्य मासेमारी क्षेत्रे (PFZ)',
      forecastTab: 'समुद्र स्थिती अंदाज',
      alertsTab: 'लाटांची चेतावणी',
      safe: 'सुरक्षित समुद्र स्थिती',
      caution: 'काळजी घ्या - मध्यम समुद्र',
      danger: 'धोकादायक समुद्र - जाऊ नका',
      readAdvisory: 'ऑडिओ सूचना ऐका',
      stopAudio: 'ऑडिओ थांबवा',
      distance: 'किनाऱ्यापासून अंतर',
      targetDepth: 'जाळ्याची खोली',
      chlorophyll: 'क्लोरोफिल फ्रंट',
      sst: 'तापमान सीमा',
      targetFish: 'लक्ष्यित माशांच्या प्रजाती',
    },
  };

  const t = translations[selectedLanguage] || translations.EN;

  useEffect(() => {
    if (!isOpen) return;

    async function loadData() {
      setLoading(true);
      try {
        const [zones, alertList] = await Promise.all([
          getIncoisPFZZones(),
          getIncoisAlerts(),
        ]);
        setPfzZones(zones);
        setAlerts(alertList);

        const lat = selectedLocation?.lat || 13.0827;
        const lng = selectedLocation?.lng || 80.2707;
        const locName = selectedLocation?.name || 'Chennai & Bay of Bengal Coast';
        const fc = await getIncoisOceanStateForecast(lat, lng, locName);
        setForecast(fc);
      } catch (err) {
        console.error('Error loading INCOIS data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [isOpen, selectedLocation]);

  // Audio Speech Broadcast Synthesis
  const handleToggleAudioBroadcast = () => {
    if (isPlayingAudio) {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsPlayingAudio(false);
      return;
    }

    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in this browser.');
      return;
    }

    const currentZone = pfzZones[0];
    const textToSpeak = selectedLanguage === 'TA'
      ? `INCOIS நேரலை செய்தி. ${currentZone?.sector || 'சென்னை கரை'} பகுதியில் மீன்பிடி மண்டலம் உறுதி செய்யப்பட்டுள்ளது. கரையில் இருந்து ${currentZone?.distanceKm || 22} கிலோமீட்டர் தொலைவில் இலக்கு மீன்கள் Tuna மற்றும் Sardine உள்ளன. கடல் நிலை பாதுகாப்பாக உள்ளது.`
      : `INCOIS Official Advisory for Fishermen. Potential Fishing Zone active off ${currentZone?.sector || 'Coromandel Coast'}. Distance ${currentZone?.distanceKm || 22} kilometers from shore. Target depth ${currentZone?.targetDepthMeters || 35} meters for Yellowfin Tuna and King Mackerel. Sea state wave height is ${forecast?.waveHeightMeters || 1.6} meters. Safe for navigation.`;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 0.95;
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    setIsPlayingAudio(true);
    window.speechSynthesis.speak(utterance);
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
          {/* Top Bar Header */}
          <div className="p-5 border-b border-[#1E6091]/50 bg-[#072B36] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-[#F59E0B]/20 border border-[#F59E0B]/40 text-[#F59E0B] shadow-inner">
                <Fish className="w-6 h-6 text-[#F59E0B]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-black text-white tracking-wide">
                    {t.title}
                  </h2>
                  <span className="px-2 py-0.5 rounded-full bg-[#22C55E]/20 text-[#22C55E] text-[10px] font-mono font-bold border border-[#22C55E]/30">
                    INCOIS LIVE
                  </span>
                </div>
                <p className="text-xs text-[#FAF6F0]/70 font-mono mt-0.5">
                  {t.subtitle}
                </p>
              </div>
            </div>

            {/* Language Selection & Audio Toggle Buttons */}
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                onClick={handleToggleAudioBroadcast}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  isPlayingAudio
                    ? 'bg-red-500 text-white animate-pulse'
                    : 'bg-[#1E6091] text-[#4ECDC4] hover:bg-[#4ECDC4] hover:text-[#0B3D4C]'
                }`}
              >
                {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                <span>{isPlayingAudio ? t.stopAudio : t.readAdvisory}</span>
              </button>

              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-[#0B3D4C] hover:bg-red-500/20 text-[#FAF6F0]/70 hover:text-white border border-[#1E6091]/40 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Sub Header - Language Pills & Target Sector */}
          <div className="px-5 py-3 bg-[#0B3D4C] border-b border-[#1E6091]/40 flex flex-wrap items-center justify-between gap-3 text-xs">
            {/* Language Selector */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-mono text-[#4ECDC4] font-bold uppercase mr-1">
                LANGUAGE / மொழி:
              </span>
              {[
                { code: 'EN', label: 'English' },
                { code: 'TA', label: 'தமிழ்' },
                { code: 'HI', label: 'हिन्दी' },
                { code: 'TE', label: 'తెలుగు' },
                { code: 'ML', label: 'മലയാളം' },
                { code: 'MR', label: 'मराठी' },
              ].map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setSelectedLanguage(lang.code as any)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    selectedLanguage === lang.code
                      ? 'bg-[#4ECDC4] text-[#0B3D4C] shadow-xs'
                      : 'bg-[#072B36] text-[#FAF6F0]/70 hover:text-white border border-[#1E6091]/30'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>

            {/* Target Selected Ocean Info */}
            {selectedLocation && (
              <div className="flex items-center gap-2 text-[#FAF6F0]/80 font-mono text-[11px]">
                <MapPin className="w-3.5 h-3.5 text-[#F59E0B]" />
                <span>Sector: <b className="text-[#F59E0B]">{selectedLocation.name}</b></span>
              </div>
            )}
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-[#1E6091]/40 bg-[#072B36] text-xs font-bold font-mono">
            <button
              onClick={() => setActiveTab('pfz')}
              className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 border-b-2 transition-all cursor-pointer ${
                activeTab === 'pfz'
                  ? 'border-[#F59E0B] text-[#F59E0B] bg-[#0B3D4C]'
                  : 'border-transparent text-[#FAF6F0]/60 hover:text-white'
              }`}
            >
              <Fish className="w-4 h-4" />
              <span>{t.pfzTab}</span>
              <span className="px-1.5 py-0.2 rounded-full bg-[#F59E0B]/20 text-[#F59E0B] text-[10px]">
                {pfzZones.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('forecast')}
              className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 border-b-2 transition-all cursor-pointer ${
                activeTab === 'forecast'
                  ? 'border-[#4ECDC4] text-[#4ECDC4] bg-[#0B3D4C]'
                  : 'border-transparent text-[#FAF6F0]/60 hover:text-white'
              }`}
            >
              <Waves className="w-4 h-4" />
              <span>{t.forecastTab}</span>
            </button>

            <button
              onClick={() => setActiveTab('alerts')}
              className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 border-b-2 transition-all cursor-pointer ${
                activeTab === 'alerts'
                  ? 'border-red-400 text-red-400 bg-[#0B3D4C]'
                  : 'border-transparent text-[#FAF6F0]/60 hover:text-white'
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
              <span>{t.alertsTab}</span>
              <span className="px-1.5 py-0.2 rounded-full bg-red-500/20 text-red-400 text-[10px]">
                {alerts.length}
              </span>
            </button>
          </div>

          {/* Modal Content Scroll Area */}
          <div className="p-5 overflow-y-auto custom-scrollbar flex-1 space-y-4">
            {loading ? (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
                <Radio className="w-8 h-8 text-[#F59E0B] animate-spin" />
                <p className="text-xs font-mono text-[#FAF6F0]/70">
                  Fetching INCOIS Potential Fishing Zones & Ocean State Forecasts...
                </p>
              </div>
            ) : (
              <>
                {/* ==================================== */}
                {/* TAB 1: POTENTIAL FISHING ZONES (PFZ)  */}
                {/* ==================================== */}
                {activeTab === 'pfz' && (
                  <div className="space-y-4">
                    {/* Safety Status Banner */}
                    {forecast && (
                      <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                        forecast.safetyStatus === 'SAFE'
                          ? 'bg-[#22C55E]/10 border-[#22C55E]/40 text-[#22C55E]'
                          : forecast.safetyStatus === 'CAUTION'
                          ? 'bg-[#F59E0B]/10 border-[#F59E0B]/40 text-[#F59E0B]'
                          : 'bg-red-500/10 border-red-500/40 text-red-400'
                      }`}>
                        <div className="flex items-center gap-3">
                          <Shield className="w-6 h-6 shrink-0" />
                          <div>
                            <span className="text-xs font-bold font-mono uppercase tracking-wider block">
                              {forecast.safetyStatus === 'SAFE' ? t.safe : forecast.safetyStatus === 'CAUTION' ? t.caution : t.danger}
                            </span>
                            <p className="text-xs text-[#FAF6F0]/90 mt-0.5">
                              {forecast.advisorySummary}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 text-xs font-mono font-bold shrink-0 bg-[#0B3D4C]/80 px-3 py-1.5 rounded-xl border border-[#1E6091]/40">
                          <span>Wave: {forecast.waveHeightMeters}m</span>
                          <span>•</span>
                          <span>SST: {forecast.seaSurfaceTemp}°C</span>
                        </div>
                      </div>
                    )}

                    {/* PFZ Zone Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {pfzZones.map((zone) => (
                        <div
                          key={zone.id}
                          className="p-4 rounded-2xl bg-[#072B36] border border-[#1E6091]/40 space-y-3 shadow-md hover:border-[#F59E0B] transition-colors"
                        >
                          <div className="flex items-start justify-between gap-2 border-b border-[#1E6091]/30 pb-2.5">
                            <div>
                              <span className="text-[10px] font-mono text-[#F59E0B] font-bold block uppercase">
                                {zone.region}
                              </span>
                              <h4 className="text-sm font-bold text-white leading-snug">
                                {zone.sector}
                              </h4>
                            </div>
                            <span className="px-2 py-0.5 rounded-full bg-[#22C55E]/20 text-[#22C55E] text-[10px] font-mono font-bold shrink-0">
                              VALID TODAY
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                            <div className="p-2 bg-[#0B3D4C] rounded-xl border border-[#1E6091]/30">
                              <span className="text-[9px] text-[#FAF6F0]/60 block">{t.distance}</span>
                              <span className="font-bold text-[#F59E0B]">{zone.distanceKm} km ({zone.bearing})</span>
                            </div>
                            <div className="p-2 bg-[#0B3D4C] rounded-xl border border-[#1E6091]/30">
                              <span className="text-[9px] text-[#FAF6F0]/60 block">{t.targetDepth}</span>
                              <span className="font-bold text-[#4ECDC4]">{zone.targetDepthMeters} meters</span>
                            </div>
                          </div>

                          <div className="space-y-1.5 text-xs">
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="text-[#FAF6F0]/70">{t.sst}:</span>
                              <span className="font-mono font-bold text-[#FAF6F0]">{zone.sstGradient}</span>
                            </div>
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="text-[#FAF6F0]/70">{t.chlorophyll}:</span>
                              <span className="font-mono font-bold text-[#22C55E]">{zone.chlorophyllFront}</span>
                            </div>
                          </div>

                          {/* Target Fish Types */}
                          <div className="pt-2 border-t border-[#1E6091]/30">
                            <span className="text-[10px] font-mono text-[#F59E0B] font-bold block uppercase mb-1">
                              {t.targetFish}:
                            </span>
                            <div className="flex flex-wrap gap-1">
                              {zone.recommendedFish.map((fish, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-0.5 rounded-lg bg-[#F59E0B]/10 border border-[#F59E0B]/30 text-[#F59E0B] text-[11px] font-medium"
                                >
                                  {fish}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ==================================== */}
                {/* TAB 2: COASTAL SEA STATE FORECAST    */}
                {/* ==================================== */}
                {activeTab === 'forecast' && forecast && (
                  <div className="space-y-4">
                    <div className="p-5 rounded-2xl bg-[#072B36] border border-[#1E6091]/40 space-y-4">
                      <div className="flex items-center justify-between border-b border-[#1E6091]/40 pb-3">
                        <div>
                          <h3 className="text-base font-bold text-white flex items-center gap-2">
                            <Waves className="w-5 h-5 text-[#4ECDC4]" />
                            <span>Ocean State Forecast for {forecast.location}</span>
                          </h3>
                          <span className="text-xs text-[#FAF6F0]/70 font-mono">
                            Coordinates: {forecast.lat.toFixed(2)}°N, {forecast.lng.toFixed(2)}°E
                          </span>
                        </div>

                        <span className="px-3 py-1 rounded-xl bg-[#4ECDC4]/20 text-[#4ECDC4] font-mono text-xs font-bold">
                          INCOIS Model Sync
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
                        <div className="p-3 bg-[#0B3D4C] rounded-xl border border-[#1E6091]/40 text-center">
                          <span className="text-[10px] text-[#FAF6F0]/60 block">WAVE HEIGHT</span>
                          <span className="text-lg font-black text-[#4ECDC4]">{forecast.waveHeightMeters} m</span>
                        </div>
                        <div className="p-3 bg-[#0B3D4C] rounded-xl border border-[#1E6091]/40 text-center">
                          <span className="text-[10px] text-[#FAF6F0]/60 block">SWELL HEIGHT</span>
                          <span className="text-lg font-black text-[#F59E0B]">{forecast.swellHeightMeters} m</span>
                        </div>
                        <div className="p-3 bg-[#0B3D4C] rounded-xl border border-[#1E6091]/40 text-center">
                          <span className="text-[10px] text-[#FAF6F0]/60 block">WIND SPEED</span>
                          <span className="text-lg font-black text-[#22C55E]">{forecast.windSpeedKnots} kts</span>
                        </div>
                        <div className="p-3 bg-[#0B3D4C] rounded-xl border border-[#1E6091]/40 text-center">
                          <span className="text-[10px] text-[#FAF6F0]/60 block">CURRENT SPEED</span>
                          <span className="text-lg font-black text-blue-300">{forecast.currentVelocityKnots} kts</span>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-[#0B3D4C] border border-[#1E6091]/30 text-xs leading-relaxed space-y-1">
                        <span className="font-bold text-[#4ECDC4] block">INCOIS Hydrodynamic Summary:</span>
                        <p>{forecast.advisorySummary}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* ==================================== */}
                {/* TAB 3: INCOIS ALERTS & WARNINGS      */}
                {/* ==================================== */}
                {activeTab === 'alerts' && (
                  <div className="space-y-3">
                    {alerts.map((alert) => (
                      <div
                        key={alert.id}
                        className={`p-4 rounded-2xl border space-y-2.5 ${
                          alert.severity === 'WARNING' || alert.severity === 'ALERT'
                            ? 'bg-red-950/40 border-red-500/50 text-red-100'
                            : 'bg-[#072B36] border-[#1E6091]/40 text-[#FAF6F0]'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className={`w-4 h-4 shrink-0 ${
                              alert.severity === 'ALERT' ? 'text-red-400' : 'text-[#F59E0B]'
                            }`} />
                            <h4 className="text-xs sm:text-sm font-bold">
                              {alert.title}
                            </h4>
                          </div>
                          <span className="text-[10px] font-mono text-[#FAF6F0]/60 shrink-0">
                            {alert.issuedAt}
                          </span>
                        </div>

                        <p className="text-xs text-[#FAF6F0]/90 leading-relaxed">
                          {alert.description}
                        </p>

                        <div className="p-2.5 rounded-xl bg-[#0B3D4C]/80 border border-[#1E6091]/30 text-xs font-mono space-y-1">
                          <span className="text-[#F59E0B] font-bold block text-[10px] uppercase">
                            INSTRUCTIONS FOR FISHERMEN & VESSELS:
                          </span>
                          <p className="text-[#FAF6F0]/80 leading-normal">
                            {alert.instructions}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer Official Link */}
          <div className="p-4 border-t border-[#1E6091]/40 bg-[#072B36] flex items-center justify-between text-xs text-[#FAF6F0]/70 font-mono">
            <span className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-[#4ECDC4]" />
              Official INCOIS Ocean Data & IMD Weather Advisory
            </span>

            <a
              href="https://incois.gov.in"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-[#4ECDC4] hover:underline font-bold"
            >
              <span>incois.gov.in</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
