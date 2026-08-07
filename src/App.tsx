import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginPage } from './components/LoginPage';
import { LoadingScreen } from './components/LoadingScreen';
import { Navbar } from './components/Navbar';
import { LeftSidebar } from './components/LeftSidebar';
import { Globe3D } from './components/Globe3D';
import { LocationCard } from './components/LocationCard';
import { BottomPanel } from './components/BottomPanel';
import { ChatAssistant } from './components/ChatAssistant';
import { DashboardView } from './components/DashboardView';
import { ArgoFleetView } from './components/ArgoFleetView';
import { ReportModal } from './components/ReportModal';
import { AuthModal } from './components/AuthModal';
import { FishermanModal } from './components/FishermanModal';
import { ObisModal } from './components/ObisModal';
import { ResearchModal } from './components/ResearchModal';
import { OCEAN_LOCATIONS, ARGO_FLOATS, INITIAL_NOTIFICATIONS } from './data/oceanData';
import { OceanLocation, ArgoFloat, OceanNotification } from './types';
import { AnimatePresence } from 'motion/react';

function ProtectedMainApp() {
  const { user, loading } = useAuth();

  const [locations] = useState<OceanLocation[]>(OCEAN_LOCATIONS);
  const [argoFloats] = useState<ArgoFloat[]>(ARGO_FLOATS);
  const [notifications, setNotifications] = useState<OceanNotification[]>(INITIAL_NOTIFICATIONS);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isFishermanModalOpen, setIsFishermanModalOpen] = useState<boolean>(false);
  const [isObisModalOpen, setIsObisModalOpen] = useState<boolean>(false);
  const [isResearchModalOpen, setIsResearchModalOpen] = useState<boolean>(false);

  // Selected state & Location Card popup state
  const [selectedLocation, setSelectedLocation] = useState<OceanLocation | null>(OCEAN_LOCATIONS[0]);
  const [isLocationCardOpen, setIsLocationCardOpen] = useState<boolean>(false);

  // View state
  const [currentView, setCurrentView] = useState<'globe' | 'dashboard' | 'fleet'>('globe');

  // Overlay Controls
  const [showArgoFloats, setShowArgoFloats] = useState<boolean>(true);
  const [showCurrents, setShowCurrents] = useState<boolean>(true);
  const [showGrid, setShowGrid] = useState<boolean>(true);

  // Panels
  const [isBottomPanelOpen, setIsBottomPanelOpen] = useState<boolean>(false);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);

  // Handlers
  const handleSelectLocation = (loc: OceanLocation) => {
    setSelectedLocation(loc);
    setIsLocationCardOpen(true);
  };

  const handleSelectFloat = (float: ArgoFloat) => {
    const matchedLoc = locations.find((l) => l.argoFloatIds.includes(float.id));
    if (matchedLoc) {
      setSelectedLocation(matchedLoc);
      setIsLocationCardOpen(true);
    }
  };

  const handleSelectNotification = (notif: OceanNotification) => {
    if (notif.locationId) {
      const loc = locations.find((l) => l.id === notif.locationId);
      if (loc) {
        setSelectedLocation(loc);
        setCurrentView('globe');
        setIsBottomPanelOpen(true);
      }
    }
    setNotifications((prev) =>
      prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // 1. Loading State Screen
  if (loading) {
    return <LoadingScreen />;
  }

  // 2. Unauthenticated Protected Route Guard
  if (!user) {
    return <LoginPage />;
  }

  // 3. Authenticated Dashboard & Workspace
  return (
    <div className="w-screen h-screen overflow-hidden bg-[#FAF6F0] font-sans text-[#2D3436] flex flex-col select-none relative">
      {/* Animated Deep Ocean Ambient Background Layer */}
      <div className="absolute inset-0 opacity-20 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] bg-[radial-gradient(circle_at_50%_50%,#0B3D4C_0%,transparent_50%)]" />
        <div className="absolute top-[20%] right-[-5%] w-[60%] h-[60%] bg-[radial-gradient(circle_at_50%_50%,#1E6091_0%,transparent_60%)] opacity-30" />
      </div>

      {/* Top Navigation Bar */}
      <Navbar
        locations={locations}
        argoFloats={argoFloats}
        notifications={notifications}
        selectedLocation={selectedLocation}
        user={user}
        onSelectLocation={handleSelectLocation}
        onSelectFloat={handleSelectFloat}
        onSelectNotification={handleSelectNotification}
        onMarkAllNotificationsRead={handleMarkAllNotificationsRead}
        onOpenReportModal={() => setIsReportModalOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenFishermanModal={() => setIsFishermanModalOpen(true)}
        onOpenObisModal={() => setIsObisModalOpen(true)}
        onOpenResearchModal={() => setIsResearchModalOpen(true)}
      />

      {/* Main Container */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Sidebar */}
        <LeftSidebar
          currentView={currentView}
          onChangeView={setCurrentView}
          locations={locations}
          selectedLocation={selectedLocation}
          onSelectLocation={handleSelectLocation}
          showArgoFloats={showArgoFloats}
          onToggleArgoFloats={() => setShowArgoFloats(!showArgoFloats)}
          showCurrents={showCurrents}
          onToggleCurrents={() => setShowCurrents(!showCurrents)}
          showGrid={showGrid}
          onToggleGrid={() => setShowGrid(!showGrid)}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />

        {/* Center Content View Area */}
        <main className="flex-1 relative overflow-hidden bg-[#FAF6F0]">
          {currentView === 'globe' && (
            <div className="relative w-full h-full p-2 sm:p-4">
              <Globe3D
                locations={locations}
                argoFloats={argoFloats}
                selectedLocation={selectedLocation}
                onSelectLocation={handleSelectLocation}
                onSelectFloat={handleSelectFloat}
                showArgoFloats={showArgoFloats}
                showCurrents={showCurrents}
                showGrid={showGrid}
              />

              {/* Floating Location Info Card Popup */}
              <AnimatePresence>
                {isLocationCardOpen && selectedLocation && (
                  <LocationCard
                    location={selectedLocation}
                    onClose={() => setIsLocationCardOpen(false)}
                    onOpenBottomPanel={() => setIsBottomPanelOpen(true)}
                    onGenerateReport={() => setIsReportModalOpen(true)}
                  />
                )}
              </AnimatePresence>
            </div>
          )}

          {currentView === 'dashboard' && (
            <DashboardView
              locations={locations}
              argoFloats={argoFloats}
              selectedLocation={selectedLocation}
              onSelectLocation={(loc) => {
                setSelectedLocation(loc);
                setCurrentView('globe');
                setIsLocationCardOpen(true);
              }}
            />
          )}

          {currentView === 'fleet' && (
            <ArgoFleetView
              argoFloats={argoFloats}
              locations={locations}
              onSelectFloat={(float) => {
                handleSelectFloat(float);
                setCurrentView('globe');
              }}
              onSelectLocation={(loc) => {
                setSelectedLocation(loc);
                setCurrentView('globe');
                setIsLocationCardOpen(true);
              }}
            />
          )}
        </main>

        {/* Right AI Chat Assistant Panel */}
        <ChatAssistant
          selectedLocation={selectedLocation}
          isOpen={isChatOpen}
          onToggleOpen={() => setIsChatOpen(!isChatOpen)}
        />
      </div>

      {/* Bottom Expandable Ocean Explorer Sheet */}
      {selectedLocation && currentView === 'globe' && (
        <BottomPanel
          location={selectedLocation}
          argoFloats={argoFloats}
          isOpen={isBottomPanelOpen}
          onToggleOpen={() => setIsBottomPanelOpen(!isBottomPanelOpen)}
          onSelectFloat={handleSelectFloat}
        />
      )}

      {/* AI Hydrographic Assessment Report Modal */}
      {selectedLocation && (
        <ReportModal
          location={selectedLocation}
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
        />
      )}

      {/* Researcher Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        user={user}
      />

      {/* INCOIS Fisherman Assistance Modal */}
      <FishermanModal
        isOpen={isFishermanModalOpen}
        onClose={() => setIsFishermanModalOpen(false)}
        selectedLocation={selectedLocation}
        onSelectLocation={handleSelectLocation}
      />

      {/* OBIS Marine Biodiversity Modal */}
      <ObisModal
        isOpen={isObisModalOpen}
        onClose={() => setIsObisModalOpen(false)}
        selectedLocation={selectedLocation}
      />

      {/* Academic Research Paper Finder Modal */}
      <ResearchModal
        isOpen={isResearchModalOpen}
        onClose={() => setIsResearchModalOpen(false)}
        selectedLocation={selectedLocation}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ProtectedMainApp />
    </AuthProvider>
  );
}
