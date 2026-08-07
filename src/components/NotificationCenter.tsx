import React, { useState } from 'react';
import { OceanNotification } from '../types';
import {
  Bell,
  Flame,
  Radio,
  Thermometer,
  Droplets,
  Zap,
  CheckCircle,
  X,
  CheckCheck,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NotificationCenterProps {
  notifications: OceanNotification[];
  onSelectNotification: (notif: OceanNotification) => void;
  onMarkAllRead: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  onSelectNotification,
  onMarkAllRead,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const getIcon = (type: OceanNotification['type']) => {
    switch (type) {
      case 'heatwave':
        return <Flame className="w-4 h-4 text-[#F59E0B]" />;
      case 'float':
        return <Radio className="w-4 h-4 text-[#1E6091]" />;
      case 'temp':
        return <Thermometer className="w-4 h-4 text-[#EF4444]" />;
      case 'salinity':
        return <Droplets className="w-4 h-4 text-[#1E6091]" />;
      case 'cyclone':
        return <Zap className="w-4 h-4 text-[#7C3AED]" />;
      default:
        return <CheckCircle className="w-4 h-4 text-[#22C55E]" />;
    }
  };

  return (
    <div className="relative">
      {/* Bell Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl bg-[#0B3D4C] hover:bg-[#1E6091]/30 border border-[#1E6091]/50 text-[#FAF6F0] hover:text-[#4ECDC4] transition-all cursor-pointer"
        title="Notification Center"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 px-1.5 py-0.5 rounded-full bg-[#FF6B6B] text-[10px] font-bold text-[#4A1B0C] font-mono shadow-md animate-bounce">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Slide-over Notification Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 top-12 z-50 w-80 sm:w-96 rounded-2xl bg-white border border-[#E5E7EB] p-4 shadow-xl text-[#2D3436]"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3 mb-3">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#1E6091]" />
                <h3 className="text-sm font-bold text-[#0B3D4C] font-mono">
                  Ocean Alert Center
                </h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-[#FF6B6B]/15 border border-[#FF6B6B]/30 text-[10px] text-[#4A1B0C] font-bold font-mono">
                    {unreadCount} unread
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={onMarkAllRead}
                  className="p-1 text-[#2D3436]/50 hover:text-[#1E6091] transition-colors cursor-pointer"
                  title="Mark all as read"
                >
                  <CheckCheck className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 text-[#2D3436]/50 hover:text-[#0B3D4C] transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* List */}
            <div className="space-y-2.5 max-h-80 overflow-y-auto custom-scrollbar pr-1">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => {
                    onSelectNotification(notif);
                    setIsOpen(false);
                  }}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                    notif.read
                      ? 'bg-[#FAF6F0] border-[#E5E7EB] opacity-70 hover:opacity-100'
                      : 'bg-white border-[#E5E7EB] shadow-2xs'
                  }`}
                >
                  <div className="p-2 rounded-lg bg-[#FAF6F0] shrink-0 mt-0.5">
                    {getIcon(notif.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-xs font-bold text-[#0B3D4C] truncate">
                        {notif.title}
                      </h4>
                      <span className="text-[10px] text-[#2D3436]/50 font-mono">
                        {notif.timestamp}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#2D3436]/80 leading-snug">
                      {notif.message}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
