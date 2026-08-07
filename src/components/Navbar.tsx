import React, { useState, useRef, useEffect } from 'react';
import { OceanLocation, ArgoFloat, OceanNotification, UserProfile } from '../types';
import { NotificationCenter } from './NotificationCenter';
import { Waves, FileText, User, LogOut, Settings, ShieldCheck, Check, AlertTriangle, X, Fish, BookOpen, Globe } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  locations: OceanLocation[];
  argoFloats: ArgoFloat[];
  notifications: OceanNotification[];
  selectedLocation: OceanLocation | null;
  user: UserProfile | null;
  onSelectLocation: (loc: OceanLocation) => void;
  onSelectFloat?: (float: ArgoFloat) => void;
  onSelectNotification: (notif: OceanNotification) => void;
  onMarkAllNotificationsRead: () => void;
  onOpenReportModal: () => void;
  onOpenAuthModal: () => void;
  onOpenFishermanModal?: () => void;
  onOpenObisModal?: () => void;
  onOpenResearchModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  locations,
  argoFloats,
  notifications,
  selectedLocation,
  user,
  onSelectLocation,
  onSelectFloat,
  onSelectNotification,
  onMarkAllNotificationsRead,
  onOpenReportModal,
  onOpenAuthModal,
  onOpenFishermanModal,
  onOpenObisModal,
  onOpenResearchModal,
}) => {
  const { logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleConfirmLogout = async () => {
    setShowLogoutConfirm(false);
    setIsDropdownOpen(false);
    await logout();
  };

  return (
    <>
      <header className="h-16 w-full bg-[#0B3D4C] backdrop-blur-md border-b border-[#1E6091]/40 px-6 flex items-center justify-between z-50 relative shadow-md text-[#FAF6F0]">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#1E6091]/40 rounded-xl flex items-center justify-center border border-[#4ECDC4]/40 text-[#4ECDC4] shadow-sm">
            <Waves className="w-5 h-5 text-[#4ECDC4]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black tracking-tight text-[#FAF6F0]">
                Float<span className="text-[#4ECDC4]">Chat</span>
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-[#4ECDC4]/20 border border-[#4ECDC4]/30 text-[9px] font-mono font-bold text-[#4ECDC4] uppercase tracking-wider">
                NASA • AI
              </span>
            </div>
            <p className="text-[10px] text-[#FAF6F0]/80 font-medium hidden sm:block">
              Autonomous Hydrographic Telemetry & AI Intelligence
            </p>
          </div>
        </div>

        {/* Right Action Icons & Badges */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Fisherman Mode (INCOIS) */}
          {onOpenFishermanModal && (
            <button
              onClick={onOpenFishermanModal}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F59E0B]/20 border border-[#F59E0B]/40 hover:bg-[#F59E0B] text-[#F59E0B] hover:text-[#0B3D4C] text-xs font-bold transition-all cursor-pointer shadow-2xs"
              title="INCOIS Fisherman Assistance & Potential Fishing Zones"
            >
              <Fish className="w-3.5 h-3.5" />
              <span>Fisherman Mode</span>
            </button>
          )}

          {/* OBIS Biodiversity */}
          {onOpenObisModal && (
            <button
              onClick={onOpenObisModal}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#22C55E]/20 border border-[#22C55E]/40 hover:bg-[#22C55E] text-[#22C55E] hover:text-[#0B3D4C] text-xs font-bold transition-all cursor-pointer shadow-2xs"
              title="OBIS Marine Species & Biodiversity Explorer"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>OBIS Species</span>
            </button>
          )}

          {/* Research Literature */}
          {onOpenResearchModal && (
            <button
              onClick={onOpenResearchModal}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#4ECDC4]/20 border border-[#4ECDC4]/40 hover:bg-[#4ECDC4] text-[#4ECDC4] hover:text-[#0B3D4C] text-xs font-bold transition-all cursor-pointer shadow-2xs"
              title="Semantic Scholar & OpenAlex Academic Literature"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Research RAG</span>
            </button>
          )}

          {/* Quick Report Trigger (Primary CTA) */}
          <button
            onClick={onOpenReportModal}
            className="hidden md:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FF6B6B] hover:bg-[#ff5252] text-[#4A1B0C] text-xs font-bold transition-all cursor-pointer shadow-sm"
          >
            <FileText className="w-3.5 h-3.5 text-[#4A1B0C]" />
            <span>AI Report</span>
          </button>

          {/* Notification Bell */}
          <NotificationCenter
            notifications={notifications}
            onSelectNotification={onSelectNotification}
            onMarkAllRead={onMarkAllNotificationsRead}
          />

          {/* Profile Avatar / Auth Login Dropdown Container */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-9 h-9 rounded-full bg-gradient-to-br from-[#1E6091] to-[#4ECDC4] border border-[#4ECDC4] p-0.5 transition-transform hover:scale-105 cursor-pointer shadow-sm overflow-hidden flex items-center justify-center"
              title={user ? `${user.name} Profile` : 'Sign In'}
            >
              {user ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
              ) : (
                <div className="w-full h-full rounded-full bg-[#0B3D4C] flex items-center justify-center text-xs font-bold text-[#4ECDC4]">
                  <User className="w-4 h-4 text-[#4ECDC4]" />
                </div>
              )}
            </button>

            {/* Profile Dropdown */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-3 w-80 bg-white border border-[#E5E7EB] rounded-2xl shadow-2xl overflow-hidden z-50 text-[#2D3436] animate-in fade-in duration-150">
                {/* Header User Summary */}
                <div className="p-4 bg-[#FAF6F0] border-b border-[#E5E7EB] flex items-center gap-3">
                  <img
                    src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                    alt={user?.name || 'User'}
                    className="w-12 h-12 rounded-xl object-cover border-2 border-[#1E6091] shadow-sm"
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-bold text-[#0B3D4C] truncate">{user?.name || 'Ocean Researcher'}</h3>
                    <p className="text-xs text-[#1E6091] font-mono truncate">{user?.email || 'user@floatchat.ai'}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-[#1E6091]/10 border border-[#1E6091]/20 text-[9px] font-mono font-bold text-[#1E6091]">
                      {user?.role || 'Lead Hydrographer'}
                    </span>
                  </div>
                </div>

                {/* Profile Details & Future Settings Placeholders */}
                <div className="p-3 space-y-2 text-xs">
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      onOpenAuthModal();
                    }}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-[#FAF6F0] flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2 text-[#0B3D4C]">
                      <ShieldCheck className="w-4 h-4 text-[#1E6091]" />
                      <span className="font-semibold">Researcher Account & Saved Reports</span>
                    </div>
                  </button>

                  <div className="p-2.5 rounded-xl bg-[#FAF6F0] border border-[#E5E7EB] space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[#2D3436]/70 flex items-center gap-1.5">
                        <Settings className="w-3.5 h-3.5 text-[#1E6091]" /> Theme Settings
                      </span>
                      <span className="font-mono text-[#1E6091] font-bold">Deep Navy (Ocean)</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[#2D3436]/70 flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-600" /> Telemetry Stream
                      </span>
                      <span className="font-mono text-emerald-600 font-bold">Live 10s</span>
                    </div>
                  </div>

                  {/* Logout Trigger */}
                  <button
                    onClick={() => setShowLogoutConfirm(true)}
                    className="w-full mt-2 py-2.5 px-3 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Logout Confirmation Dialog */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-2xl text-[#2D3436] space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <div className="p-2.5 rounded-xl bg-red-100 border border-red-200 shrink-0">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#0B3D4C]">Sign Out Confirmation</h3>
                <p className="text-xs text-[#2D3436]/70">Are you sure you want to log out?</p>
              </div>
            </div>

            <p className="text-xs text-[#2D3436]/80 leading-relaxed font-sans bg-[#FAF6F0] p-3 rounded-xl border border-[#E5E7EB]">
              Logging out will return you to the login portal. Your saved ocean bookmarks and telemetry parameters remain securely synced to your Google account.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 rounded-xl bg-[#FAF6F0] hover:bg-[#E5E7EB] text-[#2D3436] text-xs font-bold transition-colors cursor-pointer border border-[#E5E7EB]"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmLogout}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-sm flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
