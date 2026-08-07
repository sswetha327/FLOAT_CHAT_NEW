import React from 'react';
import { Waves } from 'lucide-react';

export const LoadingScreen: React.FC = () => {
  return (
    <div className="min-h-screen w-full bg-[#051E28] text-[#FAF6F0] flex flex-col items-center justify-center p-6 space-y-6">
      <div className="relative">
        {/* Glowing pulse aura */}
        <div className="absolute inset-0 rounded-2xl bg-[#4ECDC4]/20 blur-xl animate-pulse" />
        <div className="relative w-20 h-20 rounded-2xl bg-[#0B3D4C] border border-[#4ECDC4]/50 flex items-center justify-center text-[#4ECDC4] shadow-2xl">
          <Waves className="w-10 h-10 animate-bounce" />
        </div>
      </div>

      <div className="text-center space-y-2">
        <h2 className="text-xl font-bold tracking-tight text-[#FAF6F0]">
          Float<span className="text-[#4ECDC4]">Chat</span>
        </h2>
        <p className="text-xs font-mono text-[#4ECDC4] animate-pulse">
          Authenticating Hydrographic Credentials...
        </p>
      </div>

      <div className="w-48 h-1.5 rounded-full bg-[#1E6091]/30 overflow-hidden">
        <div className="w-full h-full bg-gradient-to-r from-[#1E6091] via-[#4ECDC4] to-[#1E6091] animate-pulse" />
      </div>
    </div>
  );
};
