import React, { useState } from 'react';
import { UserProfile, OceanReport } from '../types';
import { User, LogOut, Bookmark, FileText, Settings, ShieldCheck, Mail, Check, X, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile | null;
  onSelectSavedReport?: (report: OceanReport) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  user,
  onSelectSavedReport,
}) => {
  const { signInWithGoogle, signInAsGuest, logout, loading, authError } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'bookmarks' | 'reports' | 'settings'>('profile');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  if (!isOpen) return null;

  const handleConfirmLogout = async () => {
    setShowLogoutConfirm(false);
    onClose();
    await logout();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="relative w-full max-w-xl bg-white border border-[#E5E7EB] rounded-2xl shadow-2xl overflow-hidden text-[#2D3436] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#E5E7EB] bg-[#FAF6F0]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1E6091]/10 border border-[#1E6091]/30 flex items-center justify-center text-[#1E6091]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#0B3D4C] tracking-tight">Researcher Profile</h2>
              <p className="text-xs text-[#2D3436]/60">FloatChat Authentication & Oceanographic Settings</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#2D3436]/50 hover:text-[#0B3D4C] hover:bg-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        {!user ? (
          /* Login Form inside Modal */
          <div className="p-6 flex flex-col gap-5">
            <div className="text-center py-2">
              <h3 className="text-xl font-bold text-[#0B3D4C]">
                Explore the Ocean Through AI
              </h3>
              <p className="text-xs text-[#2D3436]/70 mt-1">
                Sign in to save custom ocean reports, bookmark float telemetry, and sync SIH analytics.
              </p>
            </div>

            {authError && (
              <div className="p-3 bg-amber-50 border border-amber-300 text-amber-900 rounded-xl text-xs space-y-2">
                <p>{authError}</p>
                <button
                  onClick={() => signInAsGuest()}
                  className="w-full py-1.5 px-3 rounded-lg bg-amber-600 text-white font-bold text-xs hover:bg-amber-700 transition-colors cursor-pointer"
                >
                  Continue as Guest Researcher
                </button>
              </div>
            )}

            {/* Google Sign-in Button */}
            <button
              onClick={() => signInWithGoogle()}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-[#FAF6F0] text-[#2D3436] font-semibold hover:bg-white border border-[#E5E7EB] transition-all shadow-xs cursor-pointer transform hover:scale-[1.01]"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
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
              <span>{loading ? 'Authenticating...' : 'Continue with Google'}</span>
            </button>

            {/* Guest Access Button */}
            <button
              onClick={() => signInAsGuest()}
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-[#1E6091] text-white font-semibold hover:bg-[#0B3D4C] transition-all text-xs cursor-pointer"
            >
              Continue as Guest Researcher
            </button>

            <p className="text-[11px] text-center text-[#2D3436]/60 font-mono">
              Secure Authentication powered by Google & Local Session
            </p>
          </div>
        ) : (
          /* Authenticated Dashboard Tabs */
          <div className="flex flex-col h-full">
            {/* Top Tabs */}
            <div className="flex border-b border-[#E5E7EB] bg-[#FAF6F0] px-4">
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex items-center gap-1.5 py-3 px-4 border-b-2 text-xs font-medium transition-colors cursor-pointer ${
                  activeTab === 'profile'
                    ? 'border-[#1E6091] text-[#1E6091] font-bold'
                    : 'border-transparent text-[#2D3436]/60 hover:text-[#0B3D4C]'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Profile</span>
              </button>
              <button
                onClick={() => setActiveTab('bookmarks')}
                className={`flex items-center gap-1.5 py-3 px-4 border-b-2 text-xs font-medium transition-colors cursor-pointer ${
                  activeTab === 'bookmarks'
                    ? 'border-[#1E6091] text-[#1E6091] font-bold'
                    : 'border-transparent text-[#2D3436]/60 hover:text-[#0B3D4C]'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>Bookmarks ({user.bookmarks?.length || 0})</span>
              </button>
              <button
                onClick={() => setActiveTab('reports')}
                className={`flex items-center gap-1.5 py-3 px-4 border-b-2 text-xs font-medium transition-colors cursor-pointer ${
                  activeTab === 'reports'
                    ? 'border-[#1E6091] text-[#1E6091] font-bold'
                    : 'border-transparent text-[#2D3436]/60 hover:text-[#0B3D4C]'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Saved Reports ({user.savedReports?.length || 0})</span>
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`flex items-center gap-1.5 py-3 px-4 border-b-2 text-xs font-medium transition-colors cursor-pointer ${
                  activeTab === 'settings'
                    ? 'border-[#1E6091] text-[#1E6091] font-bold'
                    : 'border-transparent text-[#2D3436]/60 hover:text-[#0B3D4C]'
                }`}
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Settings</span>
              </button>
            </div>

            {/* Tab Body */}
            <div className="p-6 flex-1 overflow-y-auto max-h-[380px]">
              {activeTab === 'profile' && (
                <div className="flex flex-col gap-6">
                  <div className="flex items-center gap-4">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-[#1E6091] shadow-lg"
                    />
                    <div>
                      <h3 className="text-lg font-bold text-[#0B3D4C]">{user.name}</h3>
                      <p className="text-xs text-[#1E6091] font-mono">{user.email}</p>
                      <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-[#1E6091]/10 border border-[#1E6091]/30 text-[10px] font-mono text-[#1E6091] font-bold">
                        {user.role}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 bg-[#FAF6F0] p-4 rounded-xl border border-[#E5E7EB] text-xs">
                    <div>
                      <span className="text-[#2D3436]/50 block font-mono">ORGANIZATION</span>
                      <span className="font-semibold text-[#2D3436]">{user.organization}</span>
                    </div>
                    <div>
                      <span className="text-[#2D3436]/50 block font-mono">ACCESS LEVEL</span>
                      <span className="font-semibold text-[#22C55E] flex items-center gap-1">
                        <Check className="w-3 h-3" /> SIH Lead Investigator
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowLogoutConfirm(true)}
                    className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 font-semibold text-xs transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}

              {activeTab === 'bookmarks' && (
                <div className="flex flex-col gap-2">
                  <p className="text-xs text-[#2D3436]/70 mb-2">Saved Ocean Locations & Basins:</p>
                  {!user.bookmarks || user.bookmarks.length === 0 ? (
                    <p className="text-xs text-[#2D3436]/50 italic py-4 text-center">No bookmarked locations yet.</p>
                  ) : (
                    (user.bookmarks || []).map((bId) => (
                      <div
                        key={bId}
                        className="flex items-center justify-between p-3 rounded-xl bg-[#FAF6F0] border border-[#E5E7EB] text-xs text-[#1E6091]"
                      >
                        <span className="font-bold capitalize">{bId.replace(/-/g, ' ')}</span>
                        <span className="text-[10px] text-[#2D3436]/50 font-mono">BOOKMARKED</span>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'reports' && (
                <div className="flex flex-col gap-2">
                  <p className="text-xs text-[#2D3436]/70 mb-2">Exported Assessment Reports:</p>
                  {!user.savedReports || user.savedReports.length === 0 ? (
                    <p className="text-xs text-[#2D3436]/50 italic py-4 text-center">No saved reports available.</p>
                  ) : (
                    (user.savedReports || []).map((rep) => (
                      <div
                        key={rep.id}
                        onClick={() => onSelectSavedReport && onSelectSavedReport(rep)}
                        className="p-3 rounded-xl bg-[#FAF6F0] border border-[#E5E7EB] hover:border-[#1E6091] cursor-pointer transition-all flex items-center justify-between"
                      >
                        <div>
                          <h4 className="text-xs font-bold text-[#0B3D4C]">{rep.locationName} Hydrographic Report</h4>
                          <span className="text-[10px] text-[#2D3436]/50 font-mono">{rep.generatedAt}</span>
                        </div>
                        <span className="px-2 py-1 rounded bg-[#1E6091]/10 text-[#1E6091] text-[10px] font-mono font-bold">
                          VIEW
                        </span>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="flex flex-col gap-4 text-xs">
                  <div className="flex items-center justify-between p-3 bg-[#FAF6F0] rounded-xl border border-[#E5E7EB]">
                    <div>
                      <span className="font-semibold text-[#0B3D4C] block">Theme Mode</span>
                      <span className="text-[#2D3436]/60 text-[10px]">Deep Navy Hydrographic Dark</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-[#1E6091]/10 text-[#1E6091] font-mono text-[10px] font-bold">ACTIVE</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-[#FAF6F0] rounded-xl border border-[#E5E7EB]">
                    <div>
                      <span className="font-semibold text-[#0B3D4C] block">Auto Telemetry Refresh</span>
                      <span className="text-[#2D3436]/60 text-[10px]">Stream live ARGO CTD profiles every 10s</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-[#22C55E] font-mono text-[10px] font-bold">ENABLED</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal overlay */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-2xl text-[#2D3436] space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <div className="p-2 rounded-xl bg-red-100 border border-red-200 shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="text-base font-bold text-[#0B3D4C]">Sign Out Confirmation</h3>
            </div>
            <p className="text-xs text-[#2D3436]/80 leading-relaxed font-sans bg-[#FAF6F0] p-3 rounded-xl border border-[#E5E7EB]">
              Are you sure you want to sign out of FloatChat? Your session will be ended.
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
    </div>
  );
};
