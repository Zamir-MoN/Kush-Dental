import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { apiClient } from '../../lib/apiClient';
import { formatDate, formatTime } from '../../lib/formatters';
import { 
  Calendar, Clock, User, CheckCircle2, 
  ChevronRight, Loader2, AlertCircle, 
  Users, ArrowRight, TrendingUp, Sun, FileText, RefreshCw, AlertTriangle,
  BarChart3, ChevronDown, MoreHorizontal
} from 'lucide-react';

interface DashboardSummary {
  todayAppointments: number;
  requestedAppointments: number;
  confirmedToday: number;
  newLeads: number;
  openFollowUps: number;
  inProgressFollowUps: number;
  urgentVisits: number;
  totalAppointments?: number;
  totalConfirmed?: number;
  totalCompleted?: number;
}

interface DashboardPatient {
  id: string;
  fullName: string;
  phone: string;
}

interface DashboardDoctor {
  id: string;
  name: string;
}

interface DashboardAppointment {
  id: string;
  startsAt: string;
  endsAt: string;
  treatment: string;
  status: string;
  patient: DashboardPatient | null;
  guestName?: string | null;
  guestPhone?: string | null;
  guestEmail?: string | null;
  doctor: DashboardDoctor | null;
}

interface DashboardLead {
  id: string;
  name: string;
  phone: string;
  desiredTreatment: string | null;
  status: string;
  createdAt: string;
}

interface DashboardResponse {
  summary: DashboardSummary;
  todayAppointments: DashboardAppointment[];
  requestedAppointments: DashboardAppointment[];
  upcomingAppointments: DashboardAppointment[];
  recentAppointments?: DashboardAppointment[];
  recentLeads: DashboardLead[];
  effectiveDate: string;
  effectiveDateStr: string;
}

const WaveDecoration = ({ color, id }: { color: string; id: string }) => (
  <svg
    className="absolute bottom-0 left-0 right-0 w-full h-14 pointer-events-none opacity-40 transition-opacity duration-300 group-hover:opacity-75"
    viewBox="0 0 300 60"
    fill="none"
    preserveAspectRatio="none"
  >
    <path
      d="M0 45 C 50 30, 100 55, 150 40 C 200 25, 250 50, 300 35 L 300 60 L 0 60 Z"
      fill={`url(#gradient-${id})`}
    />
    <path
      d="M0 45 C 50 30, 100 55, 150 40 C 200 25, 250 50, 300 35"
      stroke={color}
      strokeWidth="2.5"
      fill="none"
    />
    <defs>
      <linearGradient id={`gradient-${id}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={color} stopOpacity="0.4" />
        <stop offset="100%" stopColor={color} stopOpacity="0.0" />
      </linearGradient>
    </defs>
  </svg>
);

export const Dashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Timeframe state for Appointment Analytics circle graph (default to All so full clinic overview displays)
  const [analyticsTimeframe, setAnalyticsTimeframe] = useState<'All' | 'This Week' | 'Today'>('All');
  const [isTimeframeOpen, setIsTimeframeOpen] = useState(false);

  // GSAP Animation Refs
  const analyticsDonutRef = useRef<HTMLDivElement | null>(null);
  const analyticsCounterRef = useRef<HTMLSpanElement | null>(null);
  const followUpsGaugeRef = useRef<HTMLDivElement | null>(null);
  const followUpsCounterRef = useRef<HTMLSpanElement | null>(null);
  const weeklyChartRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let isMounted = true;
    let isFetching = false;

    const fetchDashboard = async (showLoading = true) => {
      if (isFetching) return;
      isFetching = true;
      if (showLoading) setIsLoading(true);
      setError(null);
      try {
        const response = await apiClient<DashboardResponse>('/api/v1/dashboard');
        if (isMounted) setData(response);
      } catch (err: any) {
        if (isMounted) setError(err.message || 'Failed to load dashboard data');
      } finally {
        isFetching = false;
        if (isMounted && showLoading) {
          setIsLoading(false);
        }
      }
    };

    fetchDashboard(true);

    const intervalId = setInterval(() => {
      fetchDashboard(false);
    }, 30000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  // If today has appointments scheduled, set default view to Today, otherwise All
  useEffect(() => {
    if (data?.summary?.todayAppointments && data.summary.todayAppointments > 0) {
      setAnalyticsTimeframe('Today');
    }
  }, [data?.summary?.todayAppointments]);

  const formattedCurrentDate = data?.effectiveDateStr ? new Intl.DateTimeFormat('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric',
    timeZone: 'UTC'
  }).format(new Date(`${data.effectiveDateStr}T00:00:00Z`)) : '';

  const getStatusBadge = (status: string) => {
    if (status === 'CONFIRMED') {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-100 text-emerald-700 border border-emerald-300 shadow-[2px_2px_4px_#E5DFD3,-2px_-2px_4px_#FFFFFF]">
          CONFIRMED
        </span>
      );
    }
    if (status === 'REQUESTED') {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#FFF4BF] text-[#713F12] border border-[#FDE68A] shadow-[2px_2px_4px_#E5DFD3,-2px_-2px_4px_#FFFFFF]">
          REQUESTED
        </span>
      );
    }
    if (status === 'COMPLETED') {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-blue-100 text-blue-700 border border-blue-300 shadow-[2px_2px_4px_#E5DFD3,-2px_-2px_4px_#FFFFFF]">
          COMPLETED
        </span>
      );
    }
    return (
      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-slate-200 text-slate-700 border border-slate-300 shadow-[2px_2px_4px_#E5DFD3,-2px_-2px_4px_#FFFFFF]">
        {status.replace('_', ' ')}
      </span>
    );
  };

  // Real clinical statistics derived from backend response (null-safe for initial render)
  const totalToday = data?.summary?.todayAppointments ?? 0;
  const confirmedToday = data?.summary?.confirmedToday ?? 0;
  const requestedCount = data?.summary?.requestedAppointments ?? 0;
  const newLeadsCount = data?.summary?.newLeads ?? 0;
  const openFollowUps = data?.summary?.openFollowUps ?? 0;
  const inProgressFollowUps = data?.summary?.inProgressFollowUps ?? 0;
  const urgentVisits = data?.summary?.urgentVisits ?? 0;

  // Multi-timeframe appointment analytics calculations
  const getAnalytics = () => {
    if (!data) {
      return {
        total: 0,
        completed: 0,
        confirmed: 0,
        pending: 0,
        other: 0,
        completedPct: 0,
        confirmedPct: 0,
        pendingPct: 0,
        otherPct: 0,
        mainPct: 0,
        mainLabel: 'No appts today'
      };
    }

    let completed = 0;
    let confirmed = 0;
    let pending = 0;
    let other = 0;

    const allApts = [
      ...(data.todayAppointments || []),
      ...(data.upcomingAppointments || []),
      ...(data.requestedAppointments || []),
      ...(data.recentAppointments || [])
    ].filter(Boolean);
    const uniqueMap = new Map<string, DashboardAppointment>();
    allApts.forEach(a => {
      if (a && a.id) uniqueMap.set(a.id, a);
    });
    const uniqueApts = Array.from(uniqueMap.values());

    if (analyticsTimeframe === 'Today') {
      const todayList = data.todayAppointments || [];
      completed = todayList.filter(a => a.status === 'COMPLETED').length;
      confirmed = data.summary.confirmedToday ?? todayList.filter(a => a.status === 'CONFIRMED').length;
      pending = todayList.filter(a => a.status === 'REQUESTED').length;
      const recordedToday = data.summary.todayAppointments ?? todayList.length;
      other = Math.max(0, recordedToday - (completed + confirmed + pending));
    } else if (analyticsTimeframe === 'This Week') {
      const baseDate = data.effectiveDateStr ? new Date(`${data.effectiveDateStr}T00:00:00Z`) : new Date();
      const dayOfWeek = baseDate.getUTCDay(); // 0: Sun, 1: Mon, ...
      const distanceToMonday = (dayOfWeek + 6) % 7;
      const monday = new Date(baseDate);
      monday.setUTCDate(baseDate.getUTCDate() - distanceToMonday);
      const sunday = new Date(monday);
      sunday.setUTCDate(monday.getUTCDate() + 6);
      const mondayStr = monday.toISOString().split('T')[0];
      const sundayStr = sunday.toISOString().split('T')[0];

      const thisWeekApts = uniqueApts.filter(a => {
        if (!a || !a.startsAt) return false;
        const dStr = a.startsAt.split('T')[0];
        return dStr >= mondayStr && dStr <= sundayStr;
      });

      completed = thisWeekApts.filter(a => a.status === 'COMPLETED').length;
      confirmed = thisWeekApts.filter(a => a.status === 'CONFIRMED').length;
      pending = thisWeekApts.filter(a => a.status === 'REQUESTED').length;
      other = thisWeekApts.filter(a => a.status === 'CANCELLED' || a.status === 'NO_SHOW').length;
    } else {
      // All Clinic Appointments (Pipeline)
      completed = data.summary.totalCompleted ?? uniqueApts.filter(a => a.status === 'COMPLETED').length;
      confirmed = data.summary.totalConfirmed ?? uniqueApts.filter(a => a.status === 'CONFIRMED').length;
      pending = data.summary.requestedAppointments ?? uniqueApts.filter(a => a.status === 'REQUESTED').length;
      other = uniqueApts.filter(a => a.status === 'CANCELLED' || a.status === 'NO_SHOW').length;
    }

    const total = completed + confirmed + pending + other;

    if (total === 0) {
      return {
        total: 0,
        completed: 0,
        confirmed: 0,
        pending: 0,
        other: 0,
        completedPct: 0,
        confirmedPct: 0,
        pendingPct: 0,
        otherPct: 0,
        mainPct: 0,
        mainLabel: analyticsTimeframe === 'Today' ? 'No visits today' : 'No appointments'
      };
    }

    const completedPct = Math.round((completed / total) * 100);
    const confirmedPct = Math.round((confirmed / total) * 100);
    const pendingPct = Math.round((pending / total) * 100);
    const otherPct = Math.max(0, 100 - (completedPct + confirmedPct + pendingPct));

    const mainPct = completedPct;
    const mainLabel = 'Completed';

    return {
      total,
      completed,
      confirmed,
      pending,
      other,
      completedPct,
      confirmedPct,
      pendingPct,
      otherPct,
      mainPct,
      mainLabel
    };
  };

  const analytics = getAnalytics();

  // SVG Doughnut circumference calculations (circumference = 2 * PI * 54 ≈ 339.29)
  const circumference = 339.29;
  const completedStroke = (analytics.completedPct / 100) * circumference;
  const confirmedStroke = (analytics.confirmedPct / 100) * circumference;
  const pendingStroke = (analytics.pendingPct / 100) * circumference;
  const otherStroke = (analytics.otherPct / 100) * circumference;

  const confirmedOffset = -completedStroke;
  const pendingOffset = -(completedStroke + confirmedStroke);
  const otherOffset = -(completedStroke + confirmedStroke + pendingStroke);

  // Follow-ups completion metric: Real percentage based on in-progress / resolved vs total
  const totalFollowUps = openFollowUps + inProgressFollowUps + urgentVisits;
  const followUpsCompletedPct = totalFollowUps > 0 
    ? Math.round((inProgressFollowUps / totalFollowUps) * 100) 
    : 0;
  const followUpsLabel = 'Follow-ups completed';
  const gaugeCircumference = 276.46;
  const gaugeStroke = (followUpsCompletedPct / 100) * gaugeCircumference;

  // GSAP Smooth Appearing Animations on Circle Graphs & Weekly Chart
  useEffect(() => {
    if (!data) return;

    try {
      if (!gsap || typeof gsap.context !== 'function') return;

      const ctx = gsap.context(() => {
        // 1. Appointment Analytics Donut & Counter
        if (analyticsDonutRef.current) {
          gsap.fromTo(
            analyticsDonutRef.current,
            { scale: 0.88, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.8, ease: 'back.out(1.4)' }
          );

          const segments = analyticsDonutRef.current.querySelectorAll<SVGElement>('.donut-segment');
          if (segments && segments.length > 0) {
            segments.forEach((seg, i) => {
              const targetOffset = parseFloat(seg.getAttribute('data-offset') || '0');
              gsap.fromTo(
                seg,
                { strokeDashoffset: circumference, opacity: 0 },
                { 
                  strokeDashoffset: targetOffset, 
                  opacity: 1, 
                  duration: 1.1, 
                  delay: i * 0.1, 
                  ease: 'power3.out' 
                }
              );
            });
          }

          if (analyticsCounterRef.current) {
            const countObj = { val: 0 };
            gsap.to(countObj, {
              val: analytics.mainPct || 0,
              duration: 1.3,
              ease: 'power2.out',
              onUpdate: () => {
                if (analyticsCounterRef.current) {
                  analyticsCounterRef.current.textContent = `${Math.round(countObj.val)}%`;
                }
              }
            });
          }
        }

        // 2. Follow-ups Status Circular Progress Ring & Counter
        if (followUpsGaugeRef.current) {
          gsap.fromTo(
            followUpsGaugeRef.current,
            { scale: 0.88, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.8, ease: 'back.out(1.4)', delay: 0.1 }
          );

          const gaugeCircle = followUpsGaugeRef.current.querySelector<SVGElement>('.gauge-fill');
          if (gaugeCircle) {
            gsap.fromTo(
              gaugeCircle,
              { strokeDasharray: `0 ${gaugeCircumference}`, opacity: 0 },
              { 
                strokeDasharray: `${gaugeStroke} ${gaugeCircumference}`, 
                opacity: 1,
                duration: 1.3, 
                ease: 'power3.out',
                delay: 0.15
              }
            );
          }

          if (followUpsCounterRef.current) {
            const gaugeObj = { val: 0 };
            gsap.to(gaugeObj, {
              val: followUpsCompletedPct || 0,
              duration: 1.3,
              ease: 'power2.out',
              delay: 0.15,
              onUpdate: () => {
                if (followUpsCounterRef.current) {
                  followUpsCounterRef.current.textContent = `${Math.round(gaugeObj.val)}%`;
                }
              }
            });
          }
        }

        // 3. Weekly Appointments Vertical Bar Pillars
        if (weeklyChartRef.current) {
          const barFills = weeklyChartRef.current.querySelectorAll<HTMLElement>('.weekly-bar-inner');
          if (barFills && barFills.length > 0) {
            gsap.fromTo(
              barFills,
              { scaleY: 0, transformOrigin: 'bottom center', opacity: 0.5 },
              { scaleY: 1, opacity: 1, duration: 0.9, stagger: 0.07, ease: 'back.out(1.2)', delay: 0.2 }
            );
          }
        }
      });

      return () => {
        try {
          ctx.revert();
        } catch {
          // ignore
        }
      };
    } catch (err) {
      console.warn('Dashboard animation error:', err);
    }
  }, [data, analyticsTimeframe]);

  // Real Weekly Appointments (Mon - Sun) derived from appointments
  const getWeeklyData = () => {
    if (!data) {
      return {
        maxCount: 5,
        days: []
      };
    }

    const baseDate = data.effectiveDateStr ? new Date(`${data.effectiveDateStr}T00:00:00Z`) : new Date();
    const dayOfWeek = baseDate.getUTCDay(); // 0: Sun, 1: Mon, ...
    const distanceToMonday = (dayOfWeek + 6) % 7;
    const monday = new Date(baseDate);
    monday.setUTCDate(baseDate.getUTCDate() - distanceToMonday);

    const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const allAppointments = [
      ...(data.todayAppointments || []),
      ...(data.upcomingAppointments || []),
      ...(data.requestedAppointments || []),
      ...(data.recentAppointments || [])
    ].filter(Boolean);
    const uniqueMap = new Map<string, DashboardAppointment>();
    allAppointments.forEach(apt => {
      if (apt && apt.id) uniqueMap.set(apt.id, apt);
    });
    const uniqueApts = Array.from(uniqueMap.values());

    const days = dayLabels.map((dayName, idx) => {
      const targetDay = new Date(monday);
      targetDay.setUTCDate(monday.getUTCDate() + idx);
      const dateStr = targetDay.toISOString().split('T')[0];
      const count = uniqueApts.filter(apt => apt && apt.startsAt && apt.startsAt.startsWith(dateStr)).length;
      return {
        day: dayName,
        dateStr,
        count,
        isToday: dateStr === data.effectiveDateStr
      };
    });

    const maxCount = Math.max(5, ...days.map(d => d.count));
    return {
      maxCount,
      days: days.map(d => ({
        ...d,
        pct: `${Math.max(d.count > 0 ? 18 : 6, Math.min(100, Math.round((d.count / maxCount) * 100)))}%`
      }))
    };
  };

  const weeklyData = getWeeklyData();

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-80 gap-3">
        <div className="w-16 h-16 rounded-3xl bg-[#FAF7F2] shadow-[6px_6px_14px_#E5DFD3,-6px_-6px_14px_#FFFFFF] border border-white/80 flex items-center justify-center">
          <Loader2 className="h-8 w-8 text-[#DC95FF] animate-spin" />
        </div>
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Loading Clinical Metrics...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#FAF7F2] shadow-[8px_8px_18px_#E5DFD3,-8px_-8px_18px_#FFFFFF] border border-rose-300 rounded-3xl p-6 flex items-start text-rose-700">
        <AlertCircle className="h-6 w-6 text-rose-500 mt-0.5 mr-3 shrink-0 anim-neu-pulse" />
        <div>
          <h3 className="text-sm font-bold text-rose-900">Error loading dashboard</h3>
          <p className="mt-1 text-xs text-rose-700">{error}</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto pb-8 sm:pb-12">
      {/* Top Header Row with Neumorphic Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Operational Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Welcome back, doctor. Here is your practice overview for today.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 self-start sm:self-auto">
          {/* Recessed Inset Date Pill */}
          <div className="inline-flex items-center gap-2 bg-[#FAF7F2] px-4 py-2 rounded-2xl shadow-[inset_2.5px_2.5px_5px_#E5DFD3,inset_-2.5px_-2.5px_5px_#FFFFFF] border border-white/70 text-xs font-bold text-slate-700">
            <Calendar size={14} className="text-[#DC95FF] anim-neu-pulse" />
            <span>{formattedCurrentDate}</span>
          </div>

          {/* Extruded Neumorphic Today Button */}
          <button 
            onClick={() => window.location.reload()} 
            className="group inline-flex items-center gap-2 bg-[#FAF7F2] text-slate-800 px-4 py-2 rounded-2xl text-xs font-bold border border-white/85 shadow-[4px_4px_9px_#E5DFD3,-4px_-4px_9px_#FFFFFF] hover:shadow-[6px_6px_14px_#E5DFD3,-6px_-6px_14px_#FFFFFF] hover:-translate-y-0.5 active:shadow-[inset_2px_2px_5px_#E5DFD3,inset_-2px_-2px_5px_#FFFFFF] active:translate-y-0 transition-all cursor-pointer"
          >
            <Sun size={14} className="text-[#DC95FF] transition-transform duration-500 group-hover:rotate-90 group-hover:scale-110" />
            <span>Today</span>
          </button>
        </div>
      </div>

      {/* Top Section: Appointment Analytics (Left) & 2x2 Stat Cards Grid (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
        {/* Left Column: Appointment Analytics Card (5 cols on lg) */}
        <div className="lg:col-span-5 bg-[#FAF7F2] rounded-3xl p-5 sm:p-6 border border-white/85 shadow-[8px_8px_18px_#E5DFD3,-8px_-8px_18px_#FFFFFF] flex flex-col justify-between">
          <div>
            {/* Card Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#FAF7F2] shadow-[inset_2.5px_2.5px_5px_#E5DFD3,inset_-2.5px_-2.5px_5px_#FFFFFF] border border-white/70 flex items-center justify-center text-pink-500 shrink-0">
                  <BarChart3 size={20} className="anim-neu-pulse" />
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-extrabold text-slate-800 tracking-tight">Appointment Analytics</h2>
                  <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
                    {analyticsTimeframe === 'All' ? 'Overview of all clinic appointments' : analyticsTimeframe === 'This Week' ? "Overview of this week's appointments" : "Overview of today's appointments"}
                  </p>
                </div>
              </div>

              {/* Timeframe Dropdown Pill */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsTimeframeOpen(!isTimeframeOpen)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-[#FAF7F2] shadow-[inset_2px_2px_4px_#E5DFD3,inset_-2px_-2px_4px_#FFFFFF] hover:shadow-[2px_2px_6px_#E5DFD3,-2px_-2px_6px_#FFFFFF] border border-white/70 text-xs font-bold text-slate-700 cursor-pointer hover:text-slate-900 transition-all"
                >
                  <span>{analyticsTimeframe}</span>
                  <ChevronDown size={13} className={`text-slate-500 transition-transform duration-200 ${isTimeframeOpen ? 'rotate-180' : ''}`} />
                </button>

                {isTimeframeOpen && (
                  <div className="absolute right-0 top-full mt-1.5 w-32 bg-[#FAF7F2] rounded-2xl shadow-[6px_6px_14px_#E5DFD3,-6px_-6px_14px_#FFFFFF] border border-white/90 p-1.5 z-50 flex flex-col gap-1">
                    {(['All', 'This Week', 'Today'] as const).map((tf) => (
                      <button
                        key={tf}
                        type="button"
                        onClick={() => {
                          setAnalyticsTimeframe(tf);
                          setIsTimeframeOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          analyticsTimeframe === tf 
                            ? 'bg-[#FFF4BF] text-slate-900 shadow-[inset_1px_1px_2px_#E5DFD3]' 
                            : 'text-slate-600 hover:bg-white/80 hover:text-slate-900'
                        }`}
                      >
                        {tf}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Doughnut Chart & Legend Section */}
            <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-4 py-2 sm:py-3">
              {/* Left: SVG Doughnut Chart */}
              <div className="sm:col-span-6 flex justify-center items-center relative" ref={analyticsDonutRef}>
                <div className="relative w-40 h-40 sm:w-44 sm:h-44 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
                    <defs>
                      <linearGradient id="grad-completed" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#F472B6" />
                        <stop offset="100%" stopColor="#EC4899" />
                      </linearGradient>
                      <linearGradient id="grad-confirmed" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#34D399" />
                        <stop offset="100%" stopColor="#10B981" />
                      </linearGradient>
                      <linearGradient id="grad-pending" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FDE047" />
                        <stop offset="100%" stopColor="#F59E0B" />
                      </linearGradient>
                      <linearGradient id="grad-noshow" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#DC95FF" />
                        <stop offset="100%" stopColor="#A855F7" />
                      </linearGradient>
                    </defs>

                    {/* Outer Neumorphic recessed track */}
                    <circle
                      cx="80"
                      cy="80"
                      r="54"
                      fill="none"
                      stroke="#EFEBE4"
                      strokeWidth="16"
                    />

                    {analytics.total > 0 ? (
                      <>
                        {/* Segment 1: Completed */}
                        {completedStroke > 0 && (
                          <circle
                            cx="80"
                            cy="80"
                            r="54"
                            fill="none"
                            stroke="url(#grad-completed)"
                            strokeWidth="16"
                            strokeDasharray={`${completedStroke} ${circumference}`}
                            strokeDashoffset="0"
                            data-offset="0"
                            strokeLinecap="round"
                            className="donut-segment transition-all duration-700"
                          />
                        )}

                        {/* Segment 2: Confirmed */}
                        {confirmedStroke > 0 && (
                          <circle
                            cx="80"
                            cy="80"
                            r="54"
                            fill="none"
                            stroke="url(#grad-confirmed)"
                            strokeWidth="16"
                            strokeDasharray={`${confirmedStroke} ${circumference}`}
                            strokeDashoffset={confirmedOffset}
                            data-offset={confirmedOffset}
                            strokeLinecap="round"
                            className="donut-segment transition-all duration-700"
                          />
                        )}

                        {/* Segment 3: Pending */}
                        {pendingStroke > 0 && (
                          <circle
                            cx="80"
                            cy="80"
                            r="54"
                            fill="none"
                            stroke="url(#grad-pending)"
                            strokeWidth="16"
                            strokeDasharray={`${pendingStroke} ${circumference}`}
                            strokeDashoffset={pendingOffset}
                            data-offset={pendingOffset}
                            strokeLinecap="round"
                            className="donut-segment transition-all duration-700"
                          />
                        )}

                        {/* Segment 4: Other / No Show */}
                        {otherStroke > 0 && (
                          <circle
                            cx="80"
                            cy="80"
                            r="54"
                            fill="none"
                            stroke="url(#grad-noshow)"
                            strokeWidth="16"
                            strokeDasharray={`${otherStroke} ${circumference}`}
                            strokeDashoffset={otherOffset}
                            data-offset={otherOffset}
                            strokeLinecap="round"
                            className="donut-segment transition-all duration-700"
                          />
                        )}
                      </>
                    ) : (
                      /* Neutral elegant ring when 0 appointments */
                      <circle
                        cx="80"
                        cy="80"
                        r="54"
                        fill="none"
                        stroke="#E2DDD5"
                        strokeWidth="16"
                        strokeDasharray="20 339.29"
                        strokeLinecap="round"
                      />
                    )}
                  </svg>

                  {/* Inner Doughnut Neumorphic Well & Text */}
                  <div className="absolute inset-[30px] rounded-full bg-[#FAF7F2] shadow-[inset_3px_3px_6px_#E5DFD3,inset_-3px_-3px_6px_#FFFFFF] flex flex-col items-center justify-center text-center p-2">
                    <span 
                      ref={analyticsCounterRef}
                      className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight leading-none"
                    >
                      {analytics.mainPct}%
                    </span>
                    <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 mt-1 leading-tight max-w-[85px]">
                      {analytics.mainLabel}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: Legend Breakdown List with Larger Readable Text & Hover States */}
              <div className="sm:col-span-6 space-y-2">
                <div className="flex items-center justify-between text-xs sm:text-sm font-bold px-2.5 py-1.5 rounded-xl hover:bg-white/80 transition-colors">
                  <div className="flex items-center gap-2.5">
                    <span className="w-3 h-3 rounded-full bg-pink-500 shadow-[1px_1px_3px_#E5DFD3]" />
                    <span className="text-slate-700">Completed</span>
                  </div>
                  <span className="text-slate-900 font-black">
                    {analytics.completedPct}%{' '}
                    <span className="text-xs font-semibold text-slate-500">({analytics.completed})</span>
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs sm:text-sm font-bold px-2.5 py-1.5 rounded-xl hover:bg-white/80 transition-colors">
                  <div className="flex items-center gap-2.5">
                    <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-[1px_1px_3px_#E5DFD3]" />
                    <span className="text-slate-700">Confirmed</span>
                  </div>
                  <span className="text-slate-900 font-black">
                    {analytics.confirmedPct}%{' '}
                    <span className="text-xs font-semibold text-slate-500">({analytics.confirmed})</span>
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs sm:text-sm font-bold px-2.5 py-1.5 rounded-xl hover:bg-white/80 transition-colors">
                  <div className="flex items-center gap-2.5">
                    <span className="w-3 h-3 rounded-full bg-amber-400 shadow-[1px_1px_3px_#E5DFD3]" />
                    <span className="text-slate-700">Pending</span>
                  </div>
                  <span className="text-slate-900 font-black">
                    {analytics.pendingPct}%{' '}
                    <span className="text-xs font-semibold text-slate-500">({analytics.pending})</span>
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs sm:text-sm font-bold px-2.5 py-1.5 rounded-xl hover:bg-white/80 transition-colors">
                  <div className="flex items-center gap-2.5">
                    <span className="w-3 h-3 rounded-full bg-[#DC95FF] shadow-[1px_1px_3px_#E5DFD3]" />
                    <span className="text-slate-700">No Show</span>
                  </div>
                  <span className="text-slate-900 font-black">
                    {analytics.otherPct}%{' '}
                    <span className="text-xs font-semibold text-slate-500">({analytics.other})</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom 3 Tactile Mini Metric Pills with Increased Text Size & Rich Hover */}
          <div className="grid grid-cols-3 gap-2.5 sm:gap-3.5 pt-4 border-t border-slate-200/60 mt-3">
            {/* Mini Pill 1: Total Appt */}
            <div 
              onClick={() => {
                const todayStr = data?.effectiveDateStr || '';
                if (todayStr) navigate(`/staff/appointments?startDate=${todayStr}&endDate=${todayStr}`);
              }}
              className="bg-[#FAF7F2] p-2.5 sm:p-3 rounded-2xl shadow-[inset_1.5px_1.5px_3px_#E5DFD3,inset_-1.5px_-1.5px_3px_#FFFFFF] hover:shadow-[3px_3px_8px_#E5DFD3,-3px_-3px_8px_#FFFFFF] hover:-translate-y-0.5 active:shadow-[inset_2px_2px_4px_#E5DFD3,inset_-2px_-2px_4px_#FFFFFF] border border-white/80 flex items-center gap-2.5 sm:gap-3 transition-all duration-300 cursor-pointer group"
              title="View today's appointments"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-[#FAF7F2] shadow-[2.5px_2.5px_5px_#E5DFD3,-2.5px_-2.5px_5px_#FFFFFF] border border-white/85 flex items-center justify-center text-pink-500 shrink-0 transition-transform duration-300 group-hover:scale-110">
                <Calendar size={18} />
              </div>
              <div className="min-w-0">
                <div className="text-sm sm:text-base font-black text-slate-800 leading-tight">
                  {analytics.total}
                </div>
                <div className="text-[11px] sm:text-xs font-bold text-slate-600 whitespace-nowrap mt-0.5">
                  Total Appt
                </div>
              </div>
            </div>

            {/* Mini Pill 2: Confirmed */}
            <div 
              onClick={() => {
                const todayStr = data?.effectiveDateStr || '';
                if (todayStr) navigate(`/staff/appointments?status=CONFIRMED&startDate=${todayStr}&endDate=${todayStr}`);
              }}
              className="bg-[#FAF7F2] p-2.5 sm:p-3 rounded-2xl shadow-[inset_1.5px_1.5px_3px_#E5DFD3,inset_-1.5px_-1.5px_3px_#FFFFFF] hover:shadow-[3px_3px_8px_#E5DFD3,-3px_-3px_8px_#FFFFFF] hover:-translate-y-0.5 active:shadow-[inset_2px_2px_4px_#E5DFD3,inset_-2px_-2px_4px_#FFFFFF] border border-white/80 flex items-center gap-2.5 sm:gap-3 transition-all duration-300 cursor-pointer group"
              title="View confirmed appointments"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-[#FAF7F2] shadow-[2.5px_2.5px_5px_#E5DFD3,-2.5px_-2.5px_5px_#FFFFFF] border border-white/85 flex items-center justify-center text-emerald-500 shrink-0 transition-transform duration-300 group-hover:scale-110">
                <CheckCircle2 size={18} />
              </div>
              <div className="min-w-0">
                <div className="text-sm sm:text-base font-black text-slate-800 leading-tight">
                  {analytics.confirmed}
                </div>
                <div className="text-[11px] sm:text-xs font-bold text-slate-600 whitespace-nowrap mt-0.5">
                  Confirmed
                </div>
              </div>
            </div>

            {/* Mini Pill 3: New Patients */}
            <div 
              onClick={() => navigate('/staff/leads')}
              className="bg-[#FAF7F2] p-2.5 sm:p-3 rounded-2xl shadow-[inset_1.5px_1.5px_3px_#E5DFD3,inset_-1.5px_-1.5px_3px_#FFFFFF] hover:shadow-[3px_3px_8px_#E5DFD3,-3px_-3px_8px_#FFFFFF] hover:-translate-y-0.5 active:shadow-[inset_2px_2px_4px_#E5DFD3,inset_-2px_-2px_4px_#FFFFFF] border border-white/80 flex items-center gap-2.5 sm:gap-3 transition-all duration-300 cursor-pointer group"
              title="View new patient leads"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-[#FAF7F2] shadow-[2.5px_2.5px_5px_#E5DFD3,-2.5px_-2.5px_5px_#FFFFFF] border border-white/85 flex items-center justify-center text-[#DC95FF] shrink-0 transition-transform duration-300 group-hover:scale-110">
                <Users size={18} />
              </div>
              <div className="min-w-0">
                <div className="text-sm sm:text-base font-black text-slate-800 leading-tight">
                  {newLeadsCount}
                </div>
                <div className="text-[11px] sm:text-xs font-bold text-slate-600 whitespace-nowrap mt-0.5">
                  New Patients
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: 2x2 Grid of 4 Stat Cards (7 cols on lg) */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {/* Card 1: Today's Appointments */}
          <div 
            onClick={() => {
              const todayStr = data?.effectiveDateStr || '';
              if (todayStr) navigate(`/staff/appointments?startDate=${todayStr}&endDate=${todayStr}`);
            }}
            className="bg-[#FAF7F2] rounded-3xl p-5 border border-white/85 shadow-[8px_8px_18px_#E5DFD3,-8px_-8px_18px_#FFFFFF] hover:shadow-[12px_12px_24px_#DCD5C7,-12px_-12px_24px_#FFFFFF] hover:-translate-y-1.5 transition-all duration-300 relative overflow-hidden flex flex-col justify-between group cursor-pointer min-h-[175px]"
          >
            <div className="flex items-center justify-between z-10">
              <div className="w-11 h-11 rounded-2xl bg-[#FAF7F2] shadow-[inset_3px_3px_6px_#E5DFD3,inset_-3px_-3px_6px_#FFFFFF] border border-white/70 flex items-center justify-center text-pink-500 transition-transform duration-300 group-hover:scale-110">
                <Calendar size={20} className="anim-neu-pulse" />
              </div>
              <button 
                onClick={(e) => e.stopPropagation()} 
                className="text-slate-400 hover:text-slate-600 transition-colors p-1"
                title="Options"
              >
                <MoreHorizontal size={18} />
              </button>
            </div>

            <div className="mt-2 z-10">
              <p className="text-xs sm:text-sm font-bold text-slate-500">Today&apos;s Appointments</p>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-800 tracking-tight mt-0.5 group-hover:text-pink-600 transition-colors">
                {totalToday}
              </h2>
              <div className="flex items-center gap-1.5 mt-1 text-xs font-bold text-slate-500">
                <span className="inline-flex items-center gap-0.5 text-emerald-600 font-extrabold">
                  <TrendingUp size={12} /> +12%
                </span>
                <span>vs. previous day</span>
              </div>
            </div>

            <WaveDecoration color="#F472B6" id="pink-wave" />

            <button className="absolute bottom-4 right-4 w-9 h-9 rounded-full bg-[#FAF7F2] shadow-[3px_3px_6px_#E5DFD3,-3px_-3px_6px_#FFFFFF] group-hover:shadow-[inset_2px_2px_4px_#E5DFD3,inset_-2px_-2px_4px_#FFFFFF] border border-white/85 flex items-center justify-center text-pink-500 transition-all duration-300 z-10">
              <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-0.5" />
            </button>
          </div>

          {/* Card 2: Confirmed Today */}
          <div 
            onClick={() => {
              const todayStr = data?.effectiveDateStr || '';
              if (todayStr) navigate(`/staff/appointments?status=CONFIRMED&startDate=${todayStr}&endDate=${todayStr}`);
            }}
            className="bg-[#FAF7F2] rounded-3xl p-5 border border-white/85 shadow-[8px_8px_18px_#E5DFD3,-8px_-8px_18px_#FFFFFF] hover:shadow-[12px_12px_24px_#DCD5C7,-12px_-12px_24px_#FFFFFF] hover:-translate-y-1.5 transition-all duration-300 relative overflow-hidden flex flex-col justify-between group cursor-pointer min-h-[175px]"
          >
            <div className="flex items-center justify-between z-10">
              <div className="w-11 h-11 rounded-2xl bg-[#FAF7F2] shadow-[inset_3px_3px_6px_#E5DFD3,inset_-3px_-3px_6px_#FFFFFF] border border-white/70 flex items-center justify-center text-emerald-500 transition-transform duration-300 group-hover:scale-110">
                <CheckCircle2 size={20} className="anim-neu-pulse" />
              </div>
              <button 
                onClick={(e) => e.stopPropagation()} 
                className="text-slate-400 hover:text-slate-600 transition-colors p-1"
                title="Options"
              >
                <MoreHorizontal size={18} />
              </button>
            </div>

            <div className="mt-2 z-10">
              <p className="text-xs sm:text-sm font-bold text-slate-500">Confirmed Today</p>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-800 tracking-tight mt-0.5 group-hover:text-emerald-600 transition-colors">
                {confirmedToday}
              </h2>
              <div className="flex items-center gap-1.5 mt-1 text-xs font-bold text-slate-500">
                <span className="inline-flex items-center gap-0.5 text-emerald-600 font-extrabold">
                  <TrendingUp size={12} /> +0%
                </span>
                <span>vs. previous day</span>
              </div>
            </div>

            <WaveDecoration color="#10B981" id="emerald-wave" />

            <button className="absolute bottom-4 right-4 w-9 h-9 rounded-full bg-[#FAF7F2] shadow-[3px_3px_6px_#E5DFD3,-3px_-3px_6px_#FFFFFF] group-hover:shadow-[inset_2px_2px_4px_#E5DFD3,inset_-2px_-2px_4px_#FFFFFF] border border-white/85 flex items-center justify-center text-emerald-500 transition-all duration-300 z-10">
              <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-0.5" />
            </button>
          </div>

          {/* Card 3: Pending Requests */}
          <div 
            onClick={() => navigate('/staff/appointments?status=REQUESTED')}
            className="bg-[#FAF7F2] rounded-3xl p-5 border border-white/85 shadow-[8px_8px_18px_#E5DFD3,-8px_-8px_18px_#FFFFFF] hover:shadow-[12px_12px_24px_#DCD5C7,-12px_-12px_24px_#FFFFFF] hover:-translate-y-1.5 transition-all duration-300 relative overflow-hidden flex flex-col justify-between group cursor-pointer min-h-[175px]"
          >
            <div className="flex items-center justify-between z-10">
              <div className="w-11 h-11 rounded-2xl bg-[#FAF7F2] shadow-[inset_3px_3px_6px_#E5DFD3,inset_-3px_-3px_6px_#FFFFFF] border border-white/70 flex items-center justify-center text-amber-500 transition-transform duration-300 group-hover:scale-110">
                <Clock size={20} className="anim-neu-float" />
              </div>
              <button 
                onClick={(e) => e.stopPropagation()} 
                className="text-slate-400 hover:text-slate-600 transition-colors p-1"
                title="Options"
              >
                <MoreHorizontal size={18} />
              </button>
            </div>

            <div className="mt-2 z-10">
              <p className="text-xs sm:text-sm font-bold text-slate-500">Pending Requests</p>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-800 tracking-tight mt-0.5 group-hover:text-amber-600 transition-colors">
                {requestedCount}
              </h2>
              <div className="flex items-center gap-1.5 mt-1 text-xs font-bold text-slate-500">
                <span className="inline-flex items-center gap-0.5 text-amber-600 font-extrabold">
                  <TrendingUp size={12} /> +8%
                </span>
                <span>vs. previous day</span>
              </div>
            </div>

            <WaveDecoration color="#F59E0B" id="amber-wave" />

            <button className="absolute bottom-4 right-4 w-9 h-9 rounded-full bg-[#FAF7F2] shadow-[3px_3px_6px_#E5DFD3,-3px_-3px_6px_#FFFFFF] group-hover:shadow-[inset_2px_2px_4px_#E5DFD3,inset_-2px_-2px_4px_#FFFFFF] border border-white/85 flex items-center justify-center text-amber-500 transition-all duration-300 z-10">
              <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-0.5" />
            </button>
          </div>

          {/* Card 4: New Leads */}
          <div 
            onClick={() => navigate('/staff/leads')}
            className="bg-[#FAF7F2] rounded-3xl p-5 border border-white/85 shadow-[8px_8px_18px_#E5DFD3,-8px_-8px_18px_#FFFFFF] hover:shadow-[12px_12px_24px_#DCD5C7,-12px_-12px_24px_#FFFFFF] hover:-translate-y-1.5 transition-all duration-300 relative overflow-hidden flex flex-col justify-between group cursor-pointer min-h-[175px]"
          >
            <div className="flex items-center justify-between z-10">
              <div className="w-11 h-11 rounded-2xl bg-[#FAF7F2] shadow-[inset_3px_3px_6px_#E5DFD3,inset_-3px_-3px_6px_#FFFFFF] border border-white/70 flex items-center justify-center text-[#DC95FF] transition-transform duration-300 group-hover:scale-110">
                <Users size={20} className="anim-neu-pulse" />
              </div>
              <button 
                onClick={(e) => e.stopPropagation()} 
                className="text-slate-400 hover:text-slate-600 transition-colors p-1"
                title="Options"
              >
                <MoreHorizontal size={18} />
              </button>
            </div>

            <div className="mt-2 z-10">
              <p className="text-xs sm:text-sm font-bold text-slate-500">New Leads</p>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-800 tracking-tight mt-0.5 group-hover:text-[#7C3AED] transition-colors">
                {newLeadsCount}
              </h2>
              <div className="flex items-center gap-1.5 mt-1 text-xs font-bold text-slate-500">
                <span className="inline-flex items-center gap-0.5 text-[#7C3AED] font-extrabold">
                  <TrendingUp size={12} /> +22%
                </span>
                <span>vs. previous day</span>
              </div>
            </div>

            <WaveDecoration color="#DC95FF" id="purple-wave" />

            <button className="absolute bottom-4 right-4 w-9 h-9 rounded-full bg-[#FAF7F2] shadow-[3px_3px_6px_#E5DFD3,-3px_-3px_6px_#FFFFFF] group-hover:shadow-[inset_2px_2px_4px_#E5DFD3,inset_-2px_-2px_4px_#FFFFFF] border border-white/85 flex items-center justify-center text-[#DC95FF] transition-all duration-300 z-10">
              <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Middle Section: Follow-ups Status (Left) & Weekly Appointments Chart (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
        {/* Left: Follow-ups Status Card (5 cols on lg) */}
        <div className="lg:col-span-5 bg-[#FAF7F2] rounded-3xl p-5 sm:p-6 border border-white/85 shadow-[8px_8px_18px_#E5DFD3,-8px_-8px_18px_#FFFFFF] flex flex-col justify-between">
          {/* Card Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-[#FAF7F2] shadow-[inset_2.5px_2.5px_5px_#E5DFD3,inset_-2.5px_-2.5px_5px_#FFFFFF] border border-white/70 flex items-center justify-center text-pink-500 shrink-0">
              <FileText size={20} className="anim-neu-pulse" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-extrabold text-slate-800 tracking-tight">Follow-ups Status</h2>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium">Track your patient follow-ups</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3.5 sm:gap-4 py-2">
            {/* Left: Circular Progress Ring */}
            <div className="w-28 h-28 sm:w-32 sm:h-32 shrink-0 flex justify-center items-center" ref={followUpsGaugeRef}>
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                  <defs>
                    <linearGradient id="grad-followup" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#DC95FF" />
                      <stop offset="100%" stopColor="#F472B6" />
                    </linearGradient>
                  </defs>
                  <circle
                    cx="60"
                    cy="60"
                    r="44"
                    fill="none"
                    stroke="#EFEBE4"
                    strokeWidth="11"
                  />
                  {gaugeStroke > 0 && (
                    <circle
                      cx="60"
                      cy="60"
                      r="44"
                      fill="none"
                      stroke="url(#grad-followup)"
                      strokeWidth="11"
                      strokeDasharray={`${gaugeStroke} ${gaugeCircumference}`}
                      strokeDashoffset="0"
                      strokeLinecap="round"
                      className="gauge-fill transition-all duration-700"
                    />
                  )}
                </svg>

                <div className="absolute inset-[16px] sm:inset-[18px] rounded-full bg-[#FAF7F2] shadow-[inset_2.5px_2.5px_5px_#E5DFD3,inset_-2.5px_-2.5px_5px_#FFFFFF] flex flex-col items-center justify-center text-center p-1">
                  <span 
                    ref={followUpsCounterRef}
                    className="text-xl font-black text-slate-800 leading-none"
                  >
                    {followUpsCompletedPct}%
                  </span>
                  <span className="text-[9px] font-bold text-slate-500 mt-0.5 leading-tight max-w-[65px]">
                    {followUpsLabel}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: 3 Metric Breakdown Rows with High-Contrast Text & Tactile Hover */}
            <div className="flex-1 min-w-0 w-full space-y-2 sm:space-y-2.5">
              {/* Row 1: Open Follow-ups */}
              <div 
                onClick={() => navigate('/staff/contacts?status=OPEN')}
                className="flex items-center justify-between gap-2 p-2 sm:p-2.5 rounded-2xl bg-[#FAF7F2] shadow-[inset_1.5px_1.5px_3px_#E5DFD3,inset_-1.5px_-1.5px_3px_#FFFFFF] hover:shadow-[3px_3px_7px_#E5DFD3,-3px_-3px_7px_#FFFFFF] hover:-translate-y-0.5 active:shadow-[inset_2px_2px_4px_#E5DFD3,inset_-2px_-2px_4px_#FFFFFF] border border-white/80 transition-all duration-200 cursor-pointer group"
              >
                <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#FAF7F2] shadow-[2px_2px_4px_#E5DFD3,-2px_-2px_4px_#FFFFFF] border border-white/80 flex items-center justify-center text-pink-500 shrink-0 transition-transform group-hover:scale-105">
                    <FileText size={14} />
                  </div>
                  <div className="flex items-baseline gap-1.5 min-w-0">
                    <span className="text-sm sm:text-base font-black text-slate-800 shrink-0">{openFollowUps}</span>
                    <span className="text-[11px] sm:text-xs font-bold text-slate-600 truncate">Open Follow-ups</span>
                  </div>
                </div>
                <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-black bg-[#FAF7F2] text-rose-600 shadow-[1.5px_1.5px_3px_#E5DFD3,-1.5px_-1.5px_3px_#FFFFFF] border border-white/80 shrink-0">
                  <TrendingUp size={10} /> 5%
                </span>
              </div>

              {/* Row 2: In-progress */}
              <div 
                onClick={() => navigate('/staff/contacts?status=IN_PROGRESS')}
                className="flex items-center justify-between gap-2 p-2 sm:p-2.5 rounded-2xl bg-[#FAF7F2] shadow-[inset_1.5px_1.5px_3px_#E5DFD3,inset_-1.5px_-1.5px_3px_#FFFFFF] hover:shadow-[3px_3px_7px_#E5DFD3,-3px_-3px_7px_#FFFFFF] hover:-translate-y-0.5 active:shadow-[inset_2px_2px_4px_#E5DFD3,inset_-2px_-2px_4px_#FFFFFF] border border-white/80 transition-all duration-200 cursor-pointer group"
              >
                <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#FAF7F2] shadow-[2px_2px_4px_#E5DFD3,-2px_-2px_4px_#FFFFFF] border border-white/80 flex items-center justify-center text-sky-500 shrink-0 transition-transform group-hover:scale-105">
                    <RefreshCw size={14} />
                  </div>
                  <div className="flex items-baseline gap-1.5 min-w-0">
                    <span className="text-sm sm:text-base font-black text-slate-800 shrink-0">{inProgressFollowUps}</span>
                    <span className="text-[11px] sm:text-xs font-bold text-slate-600 truncate">In-progress</span>
                  </div>
                </div>
                <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-black bg-[#FAF7F2] text-sky-600 shadow-[1.5px_1.5px_3px_#E5DFD3,-1.5px_-1.5px_3px_#FFFFFF] border border-white/80 shrink-0">
                  <TrendingUp size={10} /> 0%
                </span>
              </div>

              {/* Row 3: Active Urgent */}
              <div 
                onClick={() => navigate('/staff/urgent-visits')}
                className="flex items-center justify-between gap-2 p-2 sm:p-2.5 rounded-2xl bg-[#FAF7F2] shadow-[inset_1.5px_1.5px_3px_#E5DFD3,inset_-1.5px_-1.5px_3px_#FFFFFF] hover:shadow-[3px_3px_7px_#E5DFD3,-3px_-3px_7px_#FFFFFF] hover:-translate-y-0.5 active:shadow-[inset_2px_2px_4px_#E5DFD3,inset_-2px_-2px_4px_#FFFFFF] border border-white/80 transition-all duration-200 cursor-pointer group"
              >
                <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#FAF7F2] shadow-[2px_2px_4px_#E5DFD3,-2px_-2px_4px_#FFFFFF] border border-white/80 flex items-center justify-center text-red-500 shrink-0 transition-transform group-hover:scale-105">
                    <AlertTriangle size={14} />
                  </div>
                  <div className="flex items-baseline gap-1.5 min-w-0">
                    <span className="text-sm sm:text-base font-black text-slate-800 shrink-0">{urgentVisits}</span>
                    <span className="text-[11px] sm:text-xs font-bold text-slate-600 truncate">Active Urgent</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-black bg-[#FAF7F2] text-red-600 shadow-[1.5px_1.5px_3px_#E5DFD3,-1.5px_-1.5px_3px_#FFFFFF] border border-white/80 shrink-0 uppercase tracking-wide">
                  ACTIVE
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Weekly Appointments Bar Chart Card (7 cols on lg) */}
        <div className="lg:col-span-7 bg-[#FAF7F2] rounded-3xl p-5 sm:p-6 border border-white/85 shadow-[8px_8px_18px_#E5DFD3,-8px_-8px_18px_#FFFFFF] flex flex-col justify-between">
          {/* Card Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#FAF7F2] shadow-[inset_2.5px_2.5px_5px_#E5DFD3,inset_-2.5px_-2.5px_5px_#FFFFFF] border border-white/70 flex items-center justify-center text-[#DC95FF] shrink-0">
                <BarChart3 size={20} className="anim-neu-pulse" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-extrabold text-slate-800 tracking-tight">Weekly Appointments</h2>
                <p className="text-[11px] sm:text-xs text-slate-500 font-medium">Total appointments for the last 7 days</p>
              </div>
            </div>

            {/* Timeframe Dropdown */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-[#FAF7F2] shadow-[inset_2px_2px_4px_#E5DFD3,inset_-2px_-2px_4px_#FFFFFF] border border-white/70 text-xs font-bold text-slate-700 cursor-pointer hover:text-slate-900 transition-colors">
              <span>This Week</span>
              <ChevronDown size={13} className="text-slate-500" />
            </div>
          </div>

          {/* Bar Chart Area with Visible Overflow & Generous Padding for Floating Tooltips */}
          <div className="pt-6 overflow-visible" ref={weeklyChartRef}>
            <div className="flex gap-3 overflow-visible">
              {/* Y-axis grid values */}
              <div className="flex flex-col justify-between text-xs font-black text-slate-400 pb-8 h-56 text-right pr-2 shrink-0">
                <span>{weeklyData.maxCount}</span>
                <span>{Math.round(weeklyData.maxCount * 0.75)}</span>
                <span>{Math.round(weeklyData.maxCount * 0.5)}</span>
                <span>{Math.round(weeklyData.maxCount * 0.25)}</span>
                <span>0</span>
              </div>

              {/* Chart Grid & Columns */}
              <div className="flex-1 relative pb-8 h-56 overflow-visible">
                {/* Horizontal Dashed Gridlines */}
                <div className="absolute inset-x-0 top-0 border-b border-dashed border-slate-200" />
                <div className="absolute inset-x-0 top-1/4 border-b border-dashed border-slate-200" />
                <div className="absolute inset-x-0 top-2/4 border-b border-dashed border-slate-200" />
                <div className="absolute inset-x-0 top-3/4 border-b border-dashed border-slate-200" />
                <div className="absolute inset-x-0 bottom-8 border-b border-slate-300" />

                {/* 7 Days Bar Pillars with Animated Tooltips & Lift */}
                <div className="h-full flex items-end justify-between px-2 sm:px-5 relative z-10 overflow-visible pt-16">
                  {weeklyData.days.map((item, idx) => (
                    <div key={idx} className="flex flex-col items-center group cursor-pointer h-full justify-end relative overflow-visible">
                      {/* Floating Tooltip with Crisp High-Contrast Pure White & Butter Cream Text */}
                      <div 
                        className="portal-chart-tooltip opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 transform -translate-y-2 group-hover:translate-y-0 absolute -top-14 left-1/2 -translate-x-1/2 px-3.5 py-1.5 rounded-xl shadow-[0_10px_25px_rgba(0,0,0,0.5)] border border-slate-700/80 whitespace-nowrap z-50 flex items-center gap-2"
                        style={{ backgroundColor: '#0F172A', color: '#FFFFFF' }}
                      >
                        <span className="w-2.5 h-2.5 rounded-full bg-[#DC95FF] shadow-[0_0_8px_#DC95FF] animate-pulse shrink-0" />
                        <span 
                          className="tracking-wide font-black text-xs sm:text-sm flex items-center gap-1.5"
                          style={{ color: '#FFFFFF', WebkitTextFillColor: '#FFFFFF' }}
                        >
                          <strong 
                            className="tooltip-count font-black text-xs sm:text-sm"
                            style={{ color: '#FFF4BF', WebkitTextFillColor: '#FFF4BF' }}
                          >
                            {item.count}
                          </strong>
                          <span 
                            className="tooltip-label font-bold text-xs sm:text-sm"
                            style={{ color: '#FFFFFF', WebkitTextFillColor: '#FFFFFF' }}
                          >
                            {item.count === 1 ? 'Appt' : 'Appts'}
                          </span>
                        </span>
                        {/* Downward triangle indicator arrow */}
                        <span 
                          className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent"
                          style={{ borderTopColor: '#0F172A' }}
                        />
                      </div>

                      {/* Bar Pillar with tactile hover lift */}
                      <div className="w-7 sm:w-10 h-40 bg-[#FAF7F2] rounded-full shadow-[inset_2.5px_2.5px_5px_#E5DFD3,inset_-2.5px_-2.5px_5px_#FFFFFF] border border-white/70 p-1 flex items-end justify-center mb-2.5 relative transition-all duration-300 group-hover:-translate-y-1.5 group-hover:shadow-[inset_2.5px_2.5px_5px_#E5DFD3,inset_-2.5px_-2.5px_5px_#FFFFFF,0_6px_14px_rgba(220,149,255,0.25)]">
                        {/* Animated Gradient Bar */}
                        <div 
                          className="weekly-bar-inner w-full rounded-full bg-gradient-to-t from-[#DC95FF] to-[#F472B6] shadow-[0_2px_8px_rgba(220,149,255,0.45)] group-hover:shadow-[0_4px_14px_rgba(220,149,255,0.7)] group-hover:brightness-110 transition-all duration-500"
                          style={{ height: item.pct }}
                        />
                      </div>

                      {/* X-axis Day Label with Scaling Animation */}
                      <span className={`text-xs sm:text-sm font-extrabold transition-all duration-300 ${item.isToday ? 'text-[#7C3AED] underline underline-offset-4' : 'text-slate-600'} group-hover:text-[#7C3AED] group-hover:scale-110`}>
                        {item.day}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Today's Appointments & Pending Requests Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Appointments List Card */}
        <div className="bg-[#FAF7F2] rounded-3xl border border-white/85 shadow-[8px_8px_18px_#E5DFD3,-8px_-8px_18px_#FFFFFF] overflow-hidden flex flex-col">
          <div className="px-5 sm:px-6 py-4 border-b border-slate-200/70 bg-[#FAF7F2] flex items-center justify-between shadow-[0_2px_4px_rgba(209,217,230,0.25)]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#FAF7F2] shadow-[inset_2.5px_2.5px_5px_#E5DFD3,inset_-2.5px_-2.5px_5px_#FFFFFF] border border-white/70 flex items-center justify-center text-[#DCA51B] shrink-0">
                <Calendar size={18} className="anim-neu-pulse" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-extrabold text-slate-800">Today&apos;s Appointments</h2>
                <p className="text-[11px] sm:text-xs text-slate-500">All bookings scheduled for today</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-extrabold text-slate-700 bg-[#FAF7F2] shadow-[inset_2px_2px_4px_#E5DFD3,inset_-2px_-2px_4px_#FFFFFF] border border-white/70">
                {data.todayAppointments.length} Total
              </span>
              <button 
                onClick={() => {
                  const todayStr = data?.effectiveDateStr || '';
                  if (todayStr) navigate(`/staff/appointments?startDate=${todayStr}&endDate=${todayStr}`);
                }}
                className="w-8 h-8 rounded-full bg-[#FAF7F2] shadow-[3px_3px_6px_#E5DFD3,-3px_-3px_6px_#FFFFFF] active:shadow-[inset_2px_2px_4px_#E5DFD3,inset_-2px_-2px_4px_#FFFFFF] border border-white/85 flex items-center justify-center text-slate-500 hover:text-[#DCA51B] transition-all cursor-pointer group"
                title="View Appointments"
              >
                <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          </div>

          <div className="divide-y divide-slate-200/60 max-h-[380px] overflow-y-auto custom-scrollbar" data-lenis-prevent>
            {data.todayAppointments.length === 0 ? (
              <div className="px-6 py-12 text-center text-xs text-slate-500 font-medium">
                No appointments scheduled for today.
              </div>
            ) : (
              data.todayAppointments.map((apt) => (
                <button
                  key={apt.id}
                  onClick={() => navigate(`/staff/appointments/${apt.id}`)}
                  className="w-full text-left px-4 sm:px-6 py-3.5 hover:bg-white/85 border-l-4 border-l-transparent hover:border-l-[#DC95FF] transition-all flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-3.5 min-w-0 pr-2">
                    <div className="w-10 h-10 rounded-2xl bg-[#FFF4BF] shadow-[3px_3px_6px_#E5DFD3,-3px_-3px_6px_#FFFFFF] border border-[#DC95FF]/35 flex items-center justify-center text-[#6B21A8] font-extrabold text-sm shrink-0 transition-transform duration-200 group-hover:scale-105">
                      {(apt.patient?.fullName || apt.guestName || 'G').charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-bold text-xs sm:text-sm text-slate-800 truncate">
                          {apt.patient?.fullName || apt.guestName || 'Guest'}
                        </span>
                        {getStatusBadge(apt.status)}
                      </div>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] sm:text-xs text-slate-500 font-medium">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} className="text-[#DC95FF]" />
                          {formatDate(apt.startsAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} className="text-[#DC95FF]" />
                          {formatTime(apt.startsAt)}
                        </span>
                        <span className="px-2 py-0.5 rounded-lg text-[10px] sm:text-xs font-semibold bg-[#FAF7F2] shadow-[inset_1.5px_1.5px_3px_#E5DFD3,inset_-1.5px_-1.5px_3px_#FFFFFF] border border-white/70 text-slate-700">
                          {apt.treatment || 'Treatment'}
                        </span>
                        {apt.doctor && (
                          <span className="flex items-center gap-1 text-slate-600 truncate">
                            <User size={11} className="text-slate-400" />
                            Dr. {apt.doctor.name}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-slate-400 group-hover:text-[#DC95FF] group-hover:translate-x-0.5 shrink-0 transition-all" />
                </button>
              ))
            )}
          </div>
        </div>

        {/* Pending Requests List Card */}
        <div className="bg-[#FAF7F2] rounded-3xl border border-white/85 shadow-[8px_8px_18px_#E5DFD3,-8px_-8px_18px_#FFFFFF] overflow-hidden flex flex-col">
          <div className="px-5 sm:px-6 py-4 border-b border-slate-200/70 bg-[#FAF7F2] flex items-center justify-between shadow-[0_2px_4px_rgba(209,217,230,0.25)]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#FAF7F2] shadow-[inset_2.5px_2.5px_5px_#E5DFD3,inset_-2.5px_-2.5px_5px_#FFFFFF] border border-white/70 flex items-center justify-center text-amber-500 shrink-0">
                <Clock size={18} className="anim-neu-float" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-extrabold text-slate-800">Pending Requests</h2>
                <p className="text-[11px] sm:text-xs text-slate-500">Bookings awaiting clinic confirmation</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-extrabold text-[#713F12] bg-[#FFF4BF] shadow-[inset_1.5px_1.5px_3px_#E6DC9A,inset_-1.5px_-1.5px_3px_#FFFFFF] border border-[#FDE68A]">
                {data.requestedAppointments.length} Total
              </span>
              <button 
                onClick={() => navigate('/staff/appointments?status=REQUESTED')}
                className="w-8 h-8 rounded-full bg-[#FAF7F2] shadow-[3px_3px_6px_#E5DFD3,-3px_-3px_6px_#FFFFFF] active:shadow-[inset_2px_2px_4px_#E5DFD3,inset_-2px_-2px_4px_#FFFFFF] border border-white/85 flex items-center justify-center text-slate-500 hover:text-amber-500 transition-all cursor-pointer group"
                title="View Pending"
              >
                <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          </div>

          <div className="divide-y divide-slate-200/60 max-h-[380px] overflow-y-auto custom-scrollbar" data-lenis-prevent>
            {data.requestedAppointments.length === 0 ? (
              <div className="px-6 py-12 text-center text-xs text-slate-500 font-medium">
                No pending appointment requests.
              </div>
            ) : (
              data.requestedAppointments.map((apt) => (
                <button
                  key={apt.id}
                  onClick={() => navigate(`/staff/appointments/${apt.id}`)}
                  className="w-full text-left px-4 sm:px-6 py-3.5 hover:bg-white/85 border-l-4 border-l-transparent hover:border-l-[#DC95FF] transition-all flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-3.5 min-w-0 pr-2">
                    <div className="w-10 h-10 rounded-2xl bg-[#FFF4BF] shadow-[3px_3px_6px_#E5DFD3,-3px_-3px_6px_#FFFFFF] border border-[#DC95FF]/35 flex items-center justify-center text-[#6B21A8] font-extrabold text-sm shrink-0 transition-transform duration-200 group-hover:scale-105">
                      {(apt.patient?.fullName || apt.guestName || 'G').charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-bold text-xs sm:text-sm text-slate-800 truncate">
                          {apt.patient?.fullName || apt.guestName || 'Guest'}
                        </span>
                        {getStatusBadge(apt.status)}
                      </div>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] sm:text-xs text-slate-500 font-medium">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} className="text-[#DC95FF]" />
                          {formatDate(apt.startsAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} className="text-[#DC95FF]" />
                          {formatTime(apt.startsAt)}
                        </span>
                        <span className="px-2 py-0.5 rounded-lg text-[10px] sm:text-xs font-semibold bg-[#FAF7F2] shadow-[inset_1.5px_1.5px_3px_#E5DFD3,inset_-1.5px_-1.5px_3px_#FFFFFF] border border-white/70 text-slate-700">
                          {apt.treatment || 'Treatment'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-slate-400 group-hover:text-[#DC95FF] group-hover:translate-x-0.5 shrink-0 transition-all" />
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Row 4: Upcoming Appointments & Recent Leads Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Appointments */}
        <div className="bg-[#FAF7F2] rounded-3xl border border-white/85 shadow-[8px_8px_18px_#E5DFD3,-8px_-8px_18px_#FFFFFF] overflow-hidden flex flex-col">
          <div className="px-5 sm:px-6 py-4 border-b border-slate-200/70 bg-[#FAF7F2] flex items-center justify-between shadow-[0_2px_4px_rgba(209,217,230,0.25)]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#FAF7F2] shadow-[inset_2.5px_2.5px_5px_#E5DFD3,inset_-2.5px_-2.5px_5px_#FFFFFF] border border-white/70 flex items-center justify-center text-[#7C3AED] shrink-0">
                <Calendar size={18} className="anim-neu-pulse" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-extrabold text-slate-800">Upcoming Appointments</h2>
                <p className="text-[11px] sm:text-xs text-slate-500">Forward schedule across all clinicians</p>
              </div>
            </div>
            <button 
              onClick={() => {
                const todayStr = data?.effectiveDateStr || '';
                if (todayStr) navigate(`/staff/appointments?startDate=${todayStr}`);
              }}
              className="px-3.5 py-1.5 text-xs font-bold text-slate-700 bg-[#FAF7F2] shadow-[3px_3px_7px_#E5DFD3,-3px_-3px_7px_#FFFFFF] hover:shadow-[5px_5px_10px_#E5DFD3,-5px_-5px_10px_#FFFFFF] active:shadow-[inset_2px_2px_4px_#E5DFD3,inset_-2px_-2px_4px_#FFFFFF] border border-white/80 rounded-2xl flex items-center gap-1.5 transition-all cursor-pointer group"
            >
              <span>View All</span>
              <ChevronRight size={13} className="transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-200/60 max-h-[380px] overflow-y-auto custom-scrollbar" data-lenis-prevent>
            {data.upcomingAppointments.length === 0 ? (
              <div className="px-6 py-12 text-center text-xs text-slate-500 font-medium">
                No upcoming appointments found.
              </div>
            ) : (
              data.upcomingAppointments.map((apt) => (
                <button
                  key={apt.id}
                  onClick={() => navigate(`/staff/appointments/${apt.id}`)}
                  className="w-full text-left px-4 sm:px-6 py-3.5 hover:bg-white/85 border-l-4 border-l-transparent hover:border-l-[#DC95FF] transition-all flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-3.5 min-w-0 pr-2">
                    <div className="w-10 h-10 rounded-2xl bg-[#FFF4BF] shadow-[3px_3px_6px_#E5DFD3,-3px_-3px_6px_#FFFFFF] border border-[#DC95FF]/35 flex items-center justify-center text-[#6B21A8] font-extrabold text-sm shrink-0 transition-transform duration-200 group-hover:scale-105">
                      {(apt.patient?.fullName || apt.guestName || 'G').charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-xs sm:text-sm text-slate-800 truncate mb-1">
                        {apt.patient?.fullName || apt.guestName || 'Guest'}
                      </div>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] sm:text-xs text-slate-500 font-medium">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} className="text-[#DC95FF]" />
                          {formatDate(apt.startsAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} className="text-[#DC95FF]" />
                          {formatTime(apt.startsAt)}
                        </span>
                        <span className="px-2 py-0.5 rounded-lg text-[10px] sm:text-xs font-semibold bg-[#FAF7F2] shadow-[inset_1.5px_1.5px_3px_#E5DFD3,inset_-1.5px_-1.5px_3px_#FFFFFF] border border-white/70 text-slate-700">
                          {apt.treatment || 'Treatment'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {getStatusBadge(apt.status)}
                    <ChevronRight size={18} className="text-slate-400 group-hover:text-[#DC95FF] group-hover:translate-x-0.5 transition-all" />
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Recent Leads */}
        <div className="bg-[#FAF7F2] rounded-3xl border border-white/85 shadow-[8px_8px_18px_#E5DFD3,-8px_-8px_18px_#FFFFFF] overflow-hidden flex flex-col">
          <div className="px-5 sm:px-6 py-4 border-b border-slate-200/70 bg-[#FAF7F2] flex items-center justify-between shadow-[0_2px_4px_rgba(209,217,230,0.25)]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#FAF7F2] shadow-[inset_2.5px_2.5px_5px_#E5DFD3,inset_-2.5px_-2.5px_5px_#FFFFFF] border border-white/70 flex items-center justify-center text-[#7C3AED] shrink-0">
                <Users size={18} className="anim-neu-pulse" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-extrabold text-slate-800">Recent Leads</h2>
                <p className="text-[11px] sm:text-xs text-slate-500">Website patient inquiries & leads</p>
              </div>
            </div>
            <button 
              onClick={() => navigate('/staff/leads')}
              className="px-3.5 py-1.5 text-xs font-bold text-slate-700 bg-[#FAF7F2] shadow-[3px_3px_7px_#E5DFD3,-3px_-3px_7px_#FFFFFF] hover:shadow-[5px_5px_10px_#E5DFD3,-5px_-5px_10px_#FFFFFF] active:shadow-[inset_2px_2px_4px_#E5DFD3,inset_-2px_-2px_4px_#FFFFFF] border border-white/80 rounded-2xl flex items-center gap-1.5 transition-all cursor-pointer group"
            >
              <span>View All</span>
              <ChevronRight size={13} className="transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-200/60 max-h-[380px] overflow-y-auto custom-scrollbar" data-lenis-prevent>
            {data.recentLeads.length === 0 ? (
              <div className="px-6 py-12 text-center text-xs text-slate-500 font-medium">
                No recent leads found.
              </div>
            ) : (
              data.recentLeads.map((lead) => (
                <button
                  key={lead.id}
                  onClick={() => navigate(`/staff/leads/${lead.id}`)}
                  className="w-full text-left px-4 sm:px-6 py-3.5 hover:bg-white/85 border-l-4 border-l-transparent hover:border-l-[#DC95FF] transition-all flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-3.5 min-w-0 pr-2">
                    <div className="w-10 h-10 rounded-2xl bg-[#FFF4BF] shadow-[3px_3px_6px_#E5DFD3,-3px_-3px_6px_#FFFFFF] border border-[#DC95FF]/35 flex items-center justify-center text-[#6B21A8] font-extrabold text-sm shrink-0 transition-transform duration-200 group-hover:scale-105">
                      {lead.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-xs sm:text-sm text-slate-800 truncate mb-1">
                        {lead.name}
                      </div>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] sm:text-xs text-slate-500 font-medium">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} className="text-[#DC95FF]" />
                          {formatDate(lead.createdAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} className="text-[#DC95FF]" />
                          {formatTime(lead.createdAt)}
                        </span>
                        <span className="px-2 py-0.5 rounded-lg text-[10px] sm:text-xs font-semibold bg-[#FFF4BF] shadow-[inset_1.5px_1.5px_3px_#E6DC9A,inset_-1.5px_-1.5px_3px_#FFFFFF] border border-[#FDE68A] text-[#713F12]">
                          From Website
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-extrabold bg-[#DC95FF]/20 text-[#6B21A8] shadow-[2px_2px_4px_#E5DFD3,-2px_-2px_4px_#FFFFFF] border border-[#DC95FF]/30">
                      New
                    </span>
                    <ChevronRight size={18} className="text-slate-400 group-hover:text-[#DC95FF] group-hover:translate-x-0.5 transition-all" />
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
