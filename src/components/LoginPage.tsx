import React from 'react';
import { Waves, Shield, Sparkles, AlertCircle, RefreshCw, Compass, Radio, UserCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const { signInWithGoogle, signInAsGuest, loading, authError, clearError } = useAuth();

  return (
    <div className="relative min-h-screen w-full bg-[#051E28] text-[#FAF6F0] flex items-center justify-center p-4 sm:p-6 overflow-hidden selection:bg-[#4ECDC4] selection:text-[#0B3D4C]">
      {/* Animated Ocean Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Radial Ambient Ocean Glows */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#1E6091]/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#4ECDC4]/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#0B3D4C]/40 rounded-full blur-[120px]" />

        {/* Subtle Wave Line Pattern Overlay */}
        <svg
          className="absolute inset-0 w-full h-full opacity-10"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="waveGrid" width="100" height="40" patternUnits="userSpaceOnUse">
              <path
                d="M 0 20 Q 25 10 50 20 T 100 20"
                fill="none"
                stroke="#4ECDC4"
                strokeWidth="1.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#waveGrid)" />
        </svg>

        {/* Floating Hydrographic Nodes (Particles) */}
        <div className="absolute top-1/4 left-1/6 w-2 h-2 rounded-full bg-[#4ECDC4] animate-ping opacity-75" />
        <div className="absolute top-2/3 right-1/5 w-1.5 h-1.5 rounded-full bg-[#FF6B6B] animate-ping opacity-60" />
        <div className="absolute bottom-1/4 left-1/3 w-2 h-2 rounded-full bg-[#1E6091] animate-pulse" />
      </div>

      {/* Main Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md bg-[#0B3D4C]/80 backdrop-blur-xl border border-[#1E6091]/50 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col items-center text-center space-y-6"
      >
        {/* Brand Header & Logo */}
        <div className="flex flex-col items-center space-y-3">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1E6091] to-[#0B3D4C] border border-[#4ECDC4]/50 flex items-center justify-center text-[#4ECDC4] shadow-lg shadow-[#4ECDC4]/10 transform hover:rotate-3 transition-transform">
              <Waves className="w-9 h-9 text-[#4ECDC4]" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#4ECDC4] border-2 border-[#051E28] flex items-center justify-center text-[#051E28]">
              <Sparkles className="w-3 h-3" />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#FAF6F0]">
                Float<span className="text-[#4ECDC4]">Chat</span>
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-[#4ECDC4]/20 border border-[#4ECDC4]/40 text-[9px] font-mono font-bold text-[#4ECDC4] uppercase tracking-wider">
                NASA • AI
              </span>
            </div>
            <p className="text-sm font-semibold text-[#4ECDC4]">
              Explore the Ocean Through AI
            </p>
          </div>
        </div>

        {/* Hero Illustration / Subtitle Banner */}
        <div className="w-full p-4 rounded-2xl bg-[#051E28]/60 border border-[#1E6091]/40 flex items-center justify-between text-left gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#1E6091]/30 text-[#4ECDC4] shrink-0">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#FAF6F0] block">
                Hydrographic Telemetry Network
              </span>
              <span className="text-[11px] text-[#FAF6F0]/70 font-mono block">
                Real-time ARGO profiling & ocean intelligence
              </span>
            </div>
          </div>
        </div>

        {/* Auth Errors Notice with Instant Guest Fallback */}
        {authError && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="w-full p-4 rounded-2xl bg-amber-950/60 border border-amber-500/50 text-amber-100 text-xs flex flex-col gap-3 text-left shadow-lg"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{authError}</span>
              </div>
              <button
                onClick={clearError}
                className="text-amber-300 hover:text-white font-bold cursor-pointer text-xs underline shrink-0"
              >
                Dismiss
              </button>
            </div>

            <button
              onClick={() => signInAsGuest()}
              className="w-full py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
            >
              <UserCheck className="w-4 h-4" />
              <span>Enter directly as Guest Researcher</span>
            </button>
          </motion.div>
        )}

        {/* Authentication Options */}
        <div className="w-full space-y-3 pt-2">
          {/* Google Sign-In Button */}
          <button
            onClick={() => signInWithGoogle()}
            disabled={loading}
            className="w-full py-3.5 px-5 rounded-2xl bg-white text-[#2D3436] hover:bg-[#FAF6F0] font-bold text-sm transition-all duration-200 shadow-xl flex items-center justify-center gap-3.5 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0 border border-white/80 disabled:opacity-70 disabled:cursor-not-allowed group"
          >
            {loading ? (
              <>
                <RefreshCw className="w-5 h-5 text-[#1E6091] animate-spin" />
                <span>Connecting to Google...</span>
              </>
            ) : (
              <>
                {/* Official Google Multicolor Logo */}
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span className="group-hover:text-[#0B3D4C] transition-colors">
                  Continue with Google
                </span>
              </>
            )}
          </button>

          {/* Divider */}
          <div className="flex items-center my-2 text-[10px] font-mono text-[#FAF6F0]/40">
            <div className="flex-1 border-t border-[#1E6091]/30" />
            <span className="px-3 uppercase">OR DEMO ACCESS</span>
            <div className="flex-1 border-t border-[#1E6091]/30" />
          </div>

          {/* Guest Access Button */}
          <button
            onClick={() => signInAsGuest()}
            disabled={loading}
            className="w-full py-3 px-5 rounded-2xl bg-[#1E6091]/30 hover:bg-[#1E6091]/50 border border-[#4ECDC4]/40 text-[#4ECDC4] font-bold text-xs transition-all duration-200 flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
          >
            <UserCheck className="w-4 h-4 text-[#4ECDC4]" />
            <span>Continue as Guest Researcher</span>
          </button>

          <p className="text-[11px] font-mono text-[#FAF6F0]/60 flex items-center justify-center gap-1.5 pt-1">
            <Shield className="w-3.5 h-3.5 text-[#4ECDC4]" />
            <span>Secure Authentication powered by Google & Local Session</span>
          </p>
        </div>

        {/* Footer Badges */}
        <div className="pt-4 border-t border-[#1E6091]/30 w-full flex items-center justify-between text-[10px] font-mono text-[#FAF6F0]/50">
          <span className="flex items-center gap-1">
            <Compass className="w-3 h-3 text-[#4ECDC4]" /> NASA SIH 2026
          </span>
          <span>AUTONOMOUS ARGO INTEL</span>
        </div>
      </motion.div>
    </div>
  );
};
