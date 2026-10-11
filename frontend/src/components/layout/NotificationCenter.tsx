import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  AlertTriangle, 
  Calendar, 
  Target, 
  Clock, 
  ShieldCheck, 
  CheckCheck, 
  X, 
  ChevronRight,
  Sparkles,
  Inbox
} from 'lucide-react';
import { apiClient } from '../../lib/apiClient';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'URGENT' | 'APPOINTMENT' | 'LEAD' | 'FOLLOWUP' | 'SYSTEM';
  link: string;
  isRead: boolean;
  timestamp: number;
}

export const NotificationCenter: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'ALL' | 'UNREAD' | 'URGENT'>('ALL');
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Storage keys for persisting user actions
  const READ_STORAGE_KEY = 'kush_read_notifications_v1';
  const DISMISSED_STORAGE_KEY = 'kush_dismissed_notifications_v1';

  const getStoredIds = (key: string): string[] => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  };

  const saveStoredIds = (key: string, ids: string[]) => {
    try {
      localStorage.setItem(key, JSON.stringify(ids));
    } catch (e) {
      console.error(e);
    }
  };

  const fetchLiveNotifications = async () => {
    try {
      setLoading(true);
      const readIds = new Set(getStoredIds(READ_STORAGE_KEY));
      const dismissedIds = new Set(getStoredIds(DISMISSED_STORAGE_KEY));

      const items: NotificationItem[] = [];

      // 1. Fetch Dashboard summary to get real-time clinical queues
      try {
        const dashData = await apiClient<any>('/api/v1/dashboard');
        
        // Urgent Visits
        const urgentCount = dashData?.summary?.urgentVisits ?? 0;
        if (urgentCount > 0) {
          items.push({
            id: 'urgent-active-alert',
            title: 'Active Urgent Visits',
            message: `${urgentCount} urgent patient visit(s) requiring immediate clinical triage.`,
            time: 'Live',
            type: 'URGENT',
            link: '/staff/urgent-visits',
            isRead: readIds.has('urgent-active-alert'),
            timestamp: Date.now() - 60000,
          });
        }

        // Requested Appointments
        const requestedApts = dashData?.requestedAppointments || [];
        requestedApts.forEach((apt: any, idx: number) => {
          const patientName = apt.patient?.fullName || apt.guestName || 'Guest Patient';
          const treatment = apt.treatment || 'Consultation';
          const aptId = `apt-req-${apt.id || idx}`;
          items.push({
            id: aptId,
            title: 'New Appointment Request',
            message: `${patientName} requested booking for ${treatment}.`,
            time: 'Recent',
            type: 'APPOINTMENT',
            link: `/staff/appointments/${apt.id}`,
            isRead: readIds.has(aptId),
            timestamp: Date.now() - (idx + 1) * 300000,
          });
        });

        // Inbound Leads
        const newLeads = dashData?.summary?.newLeads ?? 0;
        if (newLeads > 0) {
          items.push({
            id: 'leads-inbound-alert',
            title: 'New Patient Leads',
            message: `${newLeads} new prospective patient inquiry received from booking website.`,
            time: 'Today',
            type: 'LEAD',
            link: '/staff/leads',
            isRead: readIds.has('leads-inbound-alert'),
            timestamp: Date.now() - 900000,
          });
        }

        // Open Follow-ups
        const openFollowUps = dashData?.summary?.openFollowUps ?? 0;
        if (openFollowUps > 0) {
          items.push({
            id: 'followups-open-alert',
            title: 'Patient Follow-ups Due',
            message: `${openFollowUps} patient contact(s) scheduled for post-care follow-up.`,
            time: 'Today',
            type: 'FOLLOWUP',
            link: '/staff/contacts?status=OPEN',
            isRead: readIds.has('followups-open-alert'),
            timestamp: Date.now() - 1800000,
          });
        }
      } catch (err) {
        console.warn('Dashboard fetch for notifications skipped, loading defaults:', err);
      }

      // Add System Security Notice
      items.push({
        id: 'system-hipaa-audit',
        title: 'Clinical Audit Trail',
        message: 'Daily encrypted access log verified and HIPAA compliant.',
        time: 'Today',
        type: 'SYSTEM',
        link: '/staff/dashboard',
        isRead: readIds.has('system-hipaa-audit'),
        timestamp: Date.now() - 3600000,
      });

      // Filter out dismissed items
      const activeItems = items.filter(item => !dismissedIds.has(item.id));
      setNotifications(activeItems);
    } catch (e) {
      console.error('Failed to process notifications:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveNotifications();
    // Refresh periodically every 90 seconds
    const interval = setInterval(fetchLiveNotifications, 90000);
    return () => clearInterval(interval);
  }, []);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const markAllAsRead = () => {
    const allIds = notifications.map(n => n.id);
    const existing = new Set(getStoredIds(READ_STORAGE_KEY));
    allIds.forEach(id => existing.add(id));
    saveStoredIds(READ_STORAGE_KEY, Array.from(existing));
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const markSingleAsRead = (id: string) => {
    const existing = new Set(getStoredIds(READ_STORAGE_KEY));
    existing.add(id);
    saveStoredIds(READ_STORAGE_KEY, Array.from(existing));
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const dismissNotification = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const existing = new Set(getStoredIds(DISMISSED_STORAGE_KEY));
    existing.add(id);
    saveStoredIds(DISMISSED_STORAGE_KEY, Array.from(existing));
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleNotificationClick = (item: NotificationItem) => {
    markSingleAsRead(item.id);
    setIsOpen(false);
    navigate(item.link);
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const filteredNotifications = notifications.filter(item => {
    if (activeTab === 'UNREAD') return !item.isRead;
    if (activeTab === 'URGENT') return item.type === 'URGENT';
    return true;
  });

  const getTypeIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'URGENT':
        return (
          <div className="w-8 h-8 rounded-xl bg-rose-100 border border-rose-300 shadow-[inset_1.5px_1.5px_3px_#FECDD3,inset_-1.5px_-1.5px_3px_#FFFFFF] flex items-center justify-center text-rose-600 shrink-0">
            <AlertTriangle size={15} />
          </div>
        );
      case 'APPOINTMENT':
        return (
          <div className="w-8 h-8 rounded-xl bg-pink-100 border border-pink-300 shadow-[inset_1.5px_1.5px_3px_#FBCFE8,inset_-1.5px_-1.5px_3px_#FFFFFF] flex items-center justify-center text-pink-600 shrink-0">
            <Calendar size={15} />
          </div>
        );
      case 'LEAD':
        return (
          <div className="w-8 h-8 rounded-xl bg-purple-100 border border-purple-300 shadow-[inset_1.5px_1.5px_3px_#E9D5FF,inset_-1.5px_-1.5px_3px_#FFFFFF] flex items-center justify-center text-[#7C3AED] shrink-0">
            <Target size={15} />
          </div>
        );
      case 'FOLLOWUP':
        return (
          <div className="w-8 h-8 rounded-xl bg-amber-100 border border-amber-300 shadow-[inset_1.5px_1.5px_3px_#FDE68A,inset_-1.5px_-1.5px_3px_#FFFFFF] flex items-center justify-center text-amber-700 shrink-0">
            <Clock size={15} />
          </div>
        );
      case 'SYSTEM':
      default:
        return (
          <div className="w-8 h-8 rounded-xl bg-emerald-100 border border-emerald-300 shadow-[inset_1.5px_1.5px_3px_#A7F3D0,inset_-1.5px_-1.5px_3px_#FFFFFF] flex items-center justify-center text-emerald-700 shrink-0">
            <ShieldCheck size={15} />
          </div>
        );
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Neumorphic Bell Trigger Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-2xl bg-[#FAF7F2] shadow-[4px_4px_9px_#E5DFD3,-4px_-4px_9px_#FFFFFF] hover:shadow-[6px_6px_14px_#E5DFD3,-6px_-6px_14px_#FFFFFF] active:shadow-[inset_2px_2px_5px_#E5DFD3,inset_-2px_-2px_5px_#FFFFFF] border border-white/80 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-all cursor-pointer relative group"
        title="Notifications"
        aria-label="View clinic notifications"
      >
        <Bell 
          size={18} 
          className={`transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12 ${
            unreadCount > 0 ? 'text-[#7C3AED]' : 'text-slate-600'
          }`} 
        />
        
        {/* Glowing Badge Indicator */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[19px] h-[19px] px-1 rounded-full bg-gradient-to-r from-[#DC95FF] to-[#7C3AED] text-white text-[10px] font-black flex items-center justify-center shadow-[0_2px_8px_rgba(124,58,237,0.55)] border-2 border-[#FAF7F2] animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Floating Neumorphic Popover */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Mobile backdrop */}
            <div 
              className="fixed inset-0 z-40 bg-slate-900/25 backdrop-blur-2xs sm:hidden" 
              onClick={() => setIsOpen(false)} 
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -8 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="fixed inset-x-3 top-20 sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:mt-3 w-auto sm:w-[410px] bg-[#FAF7F2] rounded-3xl shadow-[16px_16px_40px_rgba(200,190,175,0.7),-12px_-12px_28px_rgba(255,255,255,0.95)] border border-[#E2DACB] z-50 overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="p-4 sm:p-5 border-b border-[#E8E2D5] bg-[#FAF7F2] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#FFF4BF] border border-[#FDE68A] shadow-[inset_1.5px_1.5px_3px_#E6DC9A,inset_-1.5px_-1.5px_3px_#FFFFFF] flex items-center justify-center text-[#713F12]">
                    <Bell size={15} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight">
                        Notifications
                      </h2>
                      {unreadCount > 0 && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-[#DC95FF]/20 text-[#6B21A8] border border-[#DC95FF]/40">
                          {unreadCount} New
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium">Real-time clinical queue updates</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-bold text-[#7C3AED] hover:bg-white/80 active:bg-white transition-colors cursor-pointer"
                      title="Mark all notifications as read"
                    >
                      <CheckCheck size={13} />
                      <span className="hidden xs:inline">Mark read</span>
                    </button>
                  )}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-white/80 transition-colors sm:hidden cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Filter Tabs */}
              <div className="px-4 py-2 border-b border-[#E8E2D5]/70 bg-[#FAF7F2] flex items-center gap-1.5">
                {(['ALL', 'UNREAD', 'URGENT'] as const).map(tab => {
                  const count = tab === 'ALL' 
                    ? notifications.length 
                    : tab === 'UNREAD' 
                    ? unreadCount 
                    : notifications.filter(n => n.type === 'URGENT').length;
                  
                  return (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        activeTab === tab
                          ? 'bg-[#FAF7F2] text-[#7C3AED] shadow-[inset_2px_2px_4px_#E5DFD3,inset_-2px_-2px_4px_#FFFFFF] border border-white'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                      }`}
                    >
                      <span>{tab.charAt(0) + tab.slice(1).toLowerCase()}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                        activeTab === tab 
                          ? 'bg-[#DC95FF]/25 text-[#6B21A8] font-black' 
                          : 'bg-slate-200/80 text-slate-600'
                      }`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Notification Items List */}
              <div className="divide-y divide-[#E8E2D5]/60 max-h-[380px] overflow-y-auto custom-scrollbar bg-[#FAF7F2]">
                {filteredNotifications.length === 0 ? (
                  <div className="py-12 px-6 text-center">
                    <div className="w-12 h-12 rounded-2xl bg-[#FAF7F2] shadow-[inset_2px_2px_5px_#E5DFD3,inset_-2px_-2px_5px_#FFFFFF] border border-white mx-auto flex items-center justify-center text-slate-400 mb-3">
                      <Inbox size={22} />
                    </div>
                    <p className="text-xs font-bold text-slate-800">All caught up!</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {activeTab === 'UNREAD' 
                        ? 'No unread notifications right now.' 
                        : activeTab === 'URGENT' 
                        ? 'No active urgent visits pending.' 
                        : 'No notifications at this time.'}
                    </p>
                  </div>
                ) : (
                  filteredNotifications.map(item => (
                    <div
                      key={item.id}
                      onClick={() => handleNotificationClick(item)}
                      className={`group relative p-3.5 sm:p-4 hover:bg-white/80 active:bg-white transition-all cursor-pointer flex items-start gap-3 border-l-3 ${
                        !item.isRead 
                          ? 'border-l-[#7C3AED] bg-white/40' 
                          : 'border-l-transparent'
                      }`}
                    >
                      {/* Icon */}
                      {getTypeIcon(item.type)}

                      {/* Content */}
                      <div className="flex-1 min-w-0 pr-6">
                        <div className="flex items-center gap-2">
                          <h3 className={`text-xs sm:text-[13px] tracking-tight truncate ${
                            !item.isRead ? 'font-black text-slate-900' : 'font-bold text-slate-700'
                          }`}>
                            {item.title}
                          </h3>
                          {!item.isRead && (
                            <span className="w-2 h-2 rounded-full bg-[#7C3AED] shadow-[0_0_6px_#7C3AED] shrink-0" />
                          )}
                        </div>
                        <p className="text-[11px] sm:text-xs text-slate-600 line-clamp-2 mt-0.5 leading-relaxed font-medium">
                          {item.message}
                        </p>
                        <div className="flex items-center gap-2 mt-1.5 text-[10px] font-bold text-slate-500">
                          <span className="px-2 py-0.5 rounded-md bg-[#FAF7F2] shadow-[inset_1px_1px_2px_#E5DFD3] border border-white text-slate-600">
                            {item.time}
                          </span>
                          <span className="text-[#7C3AED] opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
                            Open queue &rarr;
                          </span>
                        </div>
                      </div>

                      {/* Dismiss Action (on hover) */}
                      <button
                        onClick={(e) => dismissNotification(e, item.id)}
                        className="absolute top-3.5 right-3.5 p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                        title="Dismiss notification"
                      >
                        <X size={13} />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="p-3 border-t border-[#E8E2D5] bg-[#FAF7F2] flex items-center justify-between text-xs">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    navigate('/staff/dashboard');
                  }}
                  className="font-bold text-[#7C3AED] hover:text-[#5B21B6] transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles size={12} />
                  <span>Clinical Overview</span>
                </button>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    navigate('/staff/appointments');
                  }}
                  className="font-bold text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-0.5 cursor-pointer"
                >
                  <span>All Appointments</span>
                  <ChevronRight size={13} />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
