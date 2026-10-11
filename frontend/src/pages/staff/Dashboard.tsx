import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../lib/apiClient';
import { formatDate, formatTime } from '../../lib/formatters';
import { 
  Calendar, Clock, User, CheckCircle2, 
  ChevronRight, Loader2, AlertCircle, 
  Users, ArrowRight, TrendingUp, Sun, FileText, RefreshCw, AlertTriangle
} from 'lucide-react';

interface DashboardSummary {
  todayAppointments: number;
  requestedAppointments: number;
  confirmedToday: number;
  newLeads: number;
  openFollowUps: number;
  inProgressFollowUps: number;
  urgentVisits: number;
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

const SparklineBars = ({ color }: { color: 'rose' | 'blue' | 'amber' }) => {
  const heights = [30, 50, 65, 45, 80, 60, 95, 75, 40, 25];
  const bgClass = color === 'rose' 
    ? 'bg-rose-500' 
    : color === 'amber' 
    ? 'bg-amber-500' 
    : 'bg-sky-500';

  return (
    <div className="flex items-end gap-1.5 h-8 shrink-0 p-1.5 rounded-xl bg-[#EBF0F7] shadow-[inset_1.5px_1.5px_3px_#D1D9E6,inset_-1.5px_-1.5px_3px_#FFFFFF]">
      {heights.map((h, i) => (
        <span
          key={i}
          className={`w-1 rounded-full ${bgClass} opacity-80 transition-all duration-300 group-hover:opacity-100`}
          style={{ height: `${h}%` }}
        />
      ))}
    </div>
  );
};

export const Dashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-100 text-emerald-700 border border-emerald-300 shadow-[2px_2px_4px_#D1D9E6,-2px_-2px_4px_#FFFFFF]">
          CONFIRMED
        </span>
      );
    }
    if (status === 'REQUESTED') {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#FFF4BF] text-[#713F12] border border-[#FDE68A] shadow-[2px_2px_4px_#D1D9E6,-2px_-2px_4px_#FFFFFF]">
          REQUESTED
        </span>
      );
    }
    if (status === 'COMPLETED') {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-blue-100 text-blue-700 border border-blue-300 shadow-[2px_2px_4px_#D1D9E6,-2px_-2px_4px_#FFFFFF]">
          COMPLETED
        </span>
      );
    }
    return (
      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-slate-200 text-slate-700 border border-slate-300 shadow-[2px_2px_4px_#D1D9E6,-2px_-2px_4px_#FFFFFF]">
        {status.replace('_', ' ')}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-80 gap-3">
        <div className="w-16 h-16 rounded-3xl bg-[#EBF0F7] shadow-[6px_6px_14px_#D1D9E6,-6px_-6px_14px_#FFFFFF] border border-white/80 flex items-center justify-center">
          <Loader2 className="h-8 w-8 text-[#DC95FF] animate-spin" />
        </div>
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Loading Clinical Metrics...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#EBF0F7] shadow-[8px_8px_18px_#D1D9E6,-8px_-8px_18px_#FFFFFF] border border-rose-300 rounded-3xl p-6 flex items-start text-rose-700">
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
          <div className="inline-flex items-center gap-2 bg-[#EBF0F7] px-4 py-2 rounded-2xl shadow-[inset_2.5px_2.5px_5px_#D1D9E6,inset_-2.5px_-2.5px_5px_#FFFFFF] border border-white/70 text-xs font-bold text-slate-700">
            <Calendar size={14} className="text-[#DC95FF] anim-neu-pulse" />
            <span>{formattedCurrentDate}</span>
          </div>

          {/* Extruded Neumorphic Today Button */}
          <button 
            onClick={() => window.location.reload()} 
            className="group inline-flex items-center gap-2 bg-[#EBF0F7] text-slate-800 px-4 py-2 rounded-2xl text-xs font-bold border border-white/85 shadow-[4px_4px_9px_#D1D9E6,-4px_-4px_9px_#FFFFFF] hover:shadow-[6px_6px_14px_#D1D9E6,-6px_-6px_14px_#FFFFFF] hover:-translate-y-0.5 active:shadow-[inset_2px_2px_5px_#D1D9E6,inset_-2px_-2px_5px_#FFFFFF] active:translate-y-0 transition-all cursor-pointer"
          >
            <Sun size={14} className="text-[#DC95FF] transition-transform duration-500 group-hover:rotate-90 group-hover:scale-110" />
            <span>Today</span>
          </button>
        </div>
      </div>

      {/* Row 1: 4 Tactile Neumorphic Metric Cards (DashOn Style) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Card 1: Today's Appointments */}
        <div 
          onClick={() => {
            const todayStr = data?.effectiveDateStr || '';
            if (todayStr) navigate(`/staff/appointments?startDate=${todayStr}&endDate=${todayStr}`);
          }}
          className="bg-[#EBF0F7] rounded-3xl p-5 border border-white/85 shadow-[8px_8px_18px_#D1D9E6,-8px_-8px_18px_#FFFFFF] hover:shadow-[12px_12px_24px_#C5D0E0,-12px_-12px_24px_#FFFFFF] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden flex flex-col justify-between group cursor-pointer min-h-[170px]"
        >
          <div className="flex items-center justify-between z-10">
            <div className="w-12 h-12 rounded-2xl bg-[#EBF0F7] shadow-[inset_3px_3px_6px_#D1D9E6,inset_-3px_-3px_6px_#FFFFFF] border border-white/70 flex items-center justify-center text-[#7C3AED] transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-0.5">
              <Calendar size={22} className="anim-neu-pulse" />
            </div>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold bg-[#EBF0F7] text-emerald-600 shadow-[2.5px_2.5px_5px_#D1D9E6,-2.5px_-2.5px_5px_#FFFFFF] border border-white/80">
              <TrendingUp size={12} className="animate-pulse" /> +12%
            </span>
          </div>

          <div className="mt-4 z-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 group-hover:text-[#7C3AED] transition-colors tracking-tight">
              {data.summary.todayAppointments}
            </h2>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">
              Today&apos;s Appointments
            </p>
          </div>

          <WaveDecoration color="#DC95FF" id="purple-card1" />

          {/* Tactile Circular Button */}
          <button className="absolute bottom-4 right-4 w-8 h-8 rounded-full bg-[#EBF0F7] shadow-[3px_3px_6px_#D1D9E6,-3px_-3px_6px_#FFFFFF] group-hover:shadow-[inset_2px_2px_4px_#D1D9E6,inset_-2px_-2px_4px_#FFFFFF] border border-white/85 flex items-center justify-center text-slate-400 group-hover:text-[#DC95FF] transition-all duration-300 z-10">
            <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5" />
          </button>
        </div>

        {/* Card 2: Confirmed Today */}
        <div 
          onClick={() => {
            const todayStr = data?.effectiveDateStr || '';
            if (todayStr) navigate(`/staff/appointments?status=CONFIRMED&startDate=${todayStr}&endDate=${todayStr}`);
          }}
          className="bg-[#EBF0F7] rounded-3xl p-5 border border-white/85 shadow-[8px_8px_18px_#D1D9E6,-8px_-8px_18px_#FFFFFF] hover:shadow-[12px_12px_24px_#C5D0E0,-12px_-12px_24px_#FFFFFF] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden flex flex-col justify-between group cursor-pointer min-h-[170px]"
        >
          <div className="flex items-center justify-between z-10">
            <div className="w-12 h-12 rounded-2xl bg-[#EBF0F7] shadow-[inset_3px_3px_6px_#D1D9E6,inset_-3px_-3px_6px_#FFFFFF] border border-white/70 flex items-center justify-center text-emerald-500 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-0.5">
              <CheckCircle2 size={22} className="anim-neu-pulse" />
            </div>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold bg-[#EBF0F7] text-emerald-600 shadow-[2.5px_2.5px_5px_#D1D9E6,-2.5px_-2.5px_5px_#FFFFFF] border border-white/80">
              <TrendingUp size={12} className="animate-pulse" /> +0%
            </span>
          </div>

          <div className="mt-4 z-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 group-hover:text-emerald-600 transition-colors tracking-tight">
              {data.summary.confirmedToday}
            </h2>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">
              Confirmed Today
            </p>
          </div>

          <WaveDecoration color="#10B981" id="emerald" />

          <button className="absolute bottom-4 right-4 w-8 h-8 rounded-full bg-[#EBF0F7] shadow-[3px_3px_6px_#D1D9E6,-3px_-3px_6px_#FFFFFF] group-hover:shadow-[inset_2px_2px_4px_#D1D9E6,inset_-2px_-2px_4px_#FFFFFF] border border-white/85 flex items-center justify-center text-slate-400 group-hover:text-emerald-500 transition-all duration-300 z-10">
            <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5" />
          </button>
        </div>

        {/* Card 3: Pending Requests */}
        <div 
          onClick={() => navigate('/staff/appointments?status=REQUESTED')}
          className="bg-[#EBF0F7] rounded-3xl p-5 border border-white/85 shadow-[8px_8px_18px_#D1D9E6,-8px_-8px_18px_#FFFFFF] hover:shadow-[12px_12px_24px_#C5D0E0,-12px_-12px_24px_#FFFFFF] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden flex flex-col justify-between group cursor-pointer min-h-[170px]"
        >
          <div className="flex items-center justify-between z-10">
            <div className="w-12 h-12 rounded-2xl bg-[#EBF0F7] shadow-[inset_3px_3px_6px_#D1D9E6,inset_-3px_-3px_6px_#FFFFFF] border border-white/70 flex items-center justify-center text-amber-500 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-0.5">
              <Clock size={22} className="anim-neu-float" />
            </div>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold bg-[#EBF0F7] text-amber-600 shadow-[2.5px_2.5px_5px_#D1D9E6,-2.5px_-2.5px_5px_#FFFFFF] border border-white/80">
              <TrendingUp size={12} className="animate-pulse" /> +8%
            </span>
          </div>

          <div className="mt-4 z-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 group-hover:text-amber-600 transition-colors tracking-tight">
              {data.summary.requestedAppointments}
            </h2>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">
              Pending Requests
            </p>
          </div>

          <WaveDecoration color="#FDE68A" id="butter-yellow" />

          <button className="absolute bottom-4 right-4 w-8 h-8 rounded-full bg-[#EBF0F7] shadow-[3px_3px_6px_#D1D9E6,-3px_-3px_6px_#FFFFFF] group-hover:shadow-[inset_2px_2px_4px_#D1D9E6,inset_-2px_-2px_4px_#FFFFFF] border border-white/85 flex items-center justify-center text-slate-400 group-hover:text-amber-500 transition-all duration-300 z-10">
            <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5" />
          </button>
        </div>

        {/* Card 4: New Leads */}
        <div 
          onClick={() => navigate('/staff/leads')}
          className="bg-[#EBF0F7] rounded-3xl p-5 border border-white/85 shadow-[8px_8px_18px_#D1D9E6,-8px_-8px_18px_#FFFFFF] hover:shadow-[12px_12px_24px_#C5D0E0,-12px_-12px_24px_#FFFFFF] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden flex flex-col justify-between group cursor-pointer min-h-[170px]"
        >
          <div className="flex items-center justify-between z-10">
            <div className="w-12 h-12 rounded-2xl bg-[#EBF0F7] shadow-[inset_3px_3px_6px_#D1D9E6,inset_-3px_-3px_6px_#FFFFFF] border border-white/70 flex items-center justify-center text-[#7C3AED] transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-0.5">
              <Users size={22} className="anim-neu-pulse" />
            </div>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold bg-[#EBF0F7] text-[#7C3AED] shadow-[2.5px_2.5px_5px_#D1D9E6,-2.5px_-2.5px_5px_#FFFFFF] border border-white/80">
              <TrendingUp size={12} className="animate-pulse" /> +22%
            </span>
          </div>

          <div className="mt-4 z-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 group-hover:text-[#7C3AED] transition-colors tracking-tight">
              {data.summary.newLeads}
            </h2>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">
              New Leads
            </p>
          </div>

          <WaveDecoration color="#DC95FF" id="purple-leads" />

          <button className="absolute bottom-4 right-4 w-8 h-8 rounded-full bg-[#EBF0F7] shadow-[3px_3px_6px_#D1D9E6,-3px_-3px_6px_#FFFFFF] group-hover:shadow-[inset_2px_2px_4px_#D1D9E6,inset_-2px_-2px_4px_#FFFFFF] border border-white/85 flex items-center justify-center text-slate-400 group-hover:text-[#DC95FF] transition-all duration-300 z-10">
            <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>

      {/* Row 2: 3 Wide Tactile Cards with Sparklines */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Open Follow-ups */}
        <div 
          onClick={() => navigate('/staff/contacts?status=OPEN')}
          className="bg-[#EBF0F7] rounded-3xl p-5 border border-white/85 shadow-[8px_8px_18px_#D1D9E6,-8px_-8px_18px_#FFFFFF] hover:shadow-[12px_12px_24px_#C5D0E0,-12px_-12px_24px_#FFFFFF] hover:-translate-y-1 transition-all duration-300 flex items-center justify-between group cursor-pointer"
        >
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-[#EBF0F7] shadow-[inset_3px_3px_6px_#D1D9E6,inset_-3px_-3px_6px_#FFFFFF] border border-white/70 flex items-center justify-center text-rose-500 shrink-0 transition-transform duration-300 group-hover:scale-110">
              <FileText size={22} className="anim-neu-pulse" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-3xl font-extrabold text-slate-800 group-hover:text-rose-600 transition-colors">
                  {data.summary.openFollowUps}
                </h2>
                <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-[#EBF0F7] text-rose-600 shadow-[2px_2px_4px_#D1D9E6,-2px_-2px_4px_#FFFFFF] border border-white/70">
                  <TrendingUp size={11} /> +5%
                </span>
              </div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-0.5 truncate">
                Open Follow-ups
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <SparklineBars color="rose" />
            <button className="w-8 h-8 rounded-full bg-[#EBF0F7] shadow-[3px_3px_6px_#D1D9E6,-3px_-3px_6px_#FFFFFF] group-hover:shadow-[inset_2px_2px_4px_#D1D9E6,inset_-2px_-2px_4px_#FFFFFF] border border-white/85 flex items-center justify-center text-slate-400 group-hover:text-rose-500 transition-all">
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>

        {/* In-Progress Follow-ups */}
        <div 
          onClick={() => navigate('/staff/contacts?status=IN_PROGRESS')}
          className="bg-[#EBF0F7] rounded-3xl p-5 border border-white/85 shadow-[8px_8px_18px_#D1D9E6,-8px_-8px_18px_#FFFFFF] hover:shadow-[12px_12px_24px_#C5D0E0,-12px_-12px_24px_#FFFFFF] hover:-translate-y-1 transition-all duration-300 flex items-center justify-between group cursor-pointer"
        >
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-[#EBF0F7] shadow-[inset_3px_3px_6px_#D1D9E6,inset_-3px_-3px_6px_#FFFFFF] border border-white/70 flex items-center justify-center text-sky-500 shrink-0 transition-transform duration-300 group-hover:scale-110">
              <RefreshCw size={22} className="group-hover:rotate-180 transition-transform duration-700" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-3xl font-extrabold text-slate-800 group-hover:text-sky-600 transition-colors">
                  {data.summary.inProgressFollowUps}
                </h2>
                <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-[#EBF0F7] text-sky-600 shadow-[2px_2px_4px_#D1D9E6,-2px_-2px_4px_#FFFFFF] border border-white/70">
                  <TrendingUp size={11} /> 0%
                </span>
              </div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-0.5 truncate">
                In-Progress Follow-ups
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <SparklineBars color="blue" />
            <button className="w-8 h-8 rounded-full bg-[#EBF0F7] shadow-[3px_3px_6px_#D1D9E6,-3px_-3px_6px_#FFFFFF] group-hover:shadow-[inset_2px_2px_4px_#D1D9E6,inset_-2px_-2px_4px_#FFFFFF] border border-white/85 flex items-center justify-center text-slate-400 group-hover:text-sky-500 transition-all">
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>

        {/* Urgent Visits */}
        <div 
          onClick={() => navigate('/staff/urgent-visits')}
          className="bg-[#EBF0F7] rounded-3xl p-5 border border-white/85 shadow-[8px_8px_18px_#D1D9E6,-8px_-8px_18px_#FFFFFF] hover:shadow-[12px_12px_24px_#C5D0E0,-12px_-12px_24px_#FFFFFF] hover:-translate-y-1 transition-all duration-300 flex items-center justify-between group cursor-pointer sm:col-span-2 lg:col-span-1"
        >
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-[#EBF0F7] shadow-[inset_3px_3px_6px_#D1D9E6,inset_-3px_-3px_6px_#FFFFFF] border border-white/70 flex items-center justify-center text-red-500 shrink-0 transition-transform duration-300 group-hover:scale-110">
              <AlertTriangle size={22} className="anim-neu-wiggle text-red-500" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-3xl font-extrabold text-slate-800 group-hover:text-red-600 transition-colors">
                  {data.summary.urgentVisits}
                </h2>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#EBF0F7] text-red-600 shadow-[2px_2px_4px_#D1D9E6,-2px_-2px_4px_#FFFFFF] border border-white/70 uppercase">
                  Active
                </span>
              </div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-0.5 truncate">
                Active Urgent Queue
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <SparklineBars color="rose" />
            <button className="w-8 h-8 rounded-full bg-[#EBF0F7] shadow-[3px_3px_6px_#D1D9E6,-3px_-3px_6px_#FFFFFF] group-hover:shadow-[inset_2px_2px_4px_#D1D9E6,inset_-2px_-2px_4px_#FFFFFF] border border-white/85 flex items-center justify-center text-slate-400 group-hover:text-red-500 transition-all">
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Row 3: Today's Appointments & Pending Requests Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Appointments List Card */}
        <div className="bg-[#EBF0F7] rounded-3xl border border-white/85 shadow-[8px_8px_18px_#D1D9E6,-8px_-8px_18px_#FFFFFF] overflow-hidden flex flex-col">
          <div className="px-5 sm:px-6 py-4 border-b border-slate-200/70 bg-[#EBF0F7] flex items-center justify-between shadow-[0_2px_4px_rgba(209,217,230,0.25)]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#EBF0F7] shadow-[inset_2.5px_2.5px_5px_#D1D9E6,inset_-2.5px_-2.5px_5px_#FFFFFF] border border-white/70 flex items-center justify-center text-[#DCA51B] shrink-0">
                <Calendar size={18} className="anim-neu-pulse" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-extrabold text-slate-800">Today&apos;s Appointments</h2>
                <p className="text-[11px] sm:text-xs text-slate-500">All bookings scheduled for today</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-extrabold text-slate-700 bg-[#EBF0F7] shadow-[inset_2px_2px_4px_#D1D9E6,inset_-2px_-2px_4px_#FFFFFF] border border-white/70">
                {data.todayAppointments.length} Total
              </span>
              <button 
                onClick={() => {
                  const todayStr = data?.effectiveDateStr || '';
                  if (todayStr) navigate(`/staff/appointments?startDate=${todayStr}&endDate=${todayStr}`);
                }}
                className="w-8 h-8 rounded-full bg-[#EBF0F7] shadow-[3px_3px_6px_#D1D9E6,-3px_-3px_6px_#FFFFFF] active:shadow-[inset_2px_2px_4px_#D1D9E6,inset_-2px_-2px_4px_#FFFFFF] border border-white/85 flex items-center justify-center text-slate-500 hover:text-[#DCA51B] transition-all cursor-pointer group"
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
                    <div className="w-10 h-10 rounded-2xl bg-[#FFF4BF] shadow-[3px_3px_6px_#D1D9E6,-3px_-3px_6px_#FFFFFF] border border-[#DC95FF]/35 flex items-center justify-center text-[#6B21A8] font-extrabold text-sm shrink-0 transition-transform duration-200 group-hover:scale-105">
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
                        <span className="px-2 py-0.5 rounded-lg text-[10px] sm:text-xs font-semibold bg-[#EBF0F7] shadow-[inset_1.5px_1.5px_3px_#D1D9E6,inset_-1.5px_-1.5px_3px_#FFFFFF] border border-white/70 text-slate-700">
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
        <div className="bg-[#EBF0F7] rounded-3xl border border-white/85 shadow-[8px_8px_18px_#D1D9E6,-8px_-8px_18px_#FFFFFF] overflow-hidden flex flex-col">
          <div className="px-5 sm:px-6 py-4 border-b border-slate-200/70 bg-[#EBF0F7] flex items-center justify-between shadow-[0_2px_4px_rgba(209,217,230,0.25)]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#EBF0F7] shadow-[inset_2.5px_2.5px_5px_#D1D9E6,inset_-2.5px_-2.5px_5px_#FFFFFF] border border-white/70 flex items-center justify-center text-amber-500 shrink-0">
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
                className="w-8 h-8 rounded-full bg-[#EBF0F7] shadow-[3px_3px_6px_#D1D9E6,-3px_-3px_6px_#FFFFFF] active:shadow-[inset_2px_2px_4px_#D1D9E6,inset_-2px_-2px_4px_#FFFFFF] border border-white/85 flex items-center justify-center text-slate-500 hover:text-amber-500 transition-all cursor-pointer group"
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
                    <div className="w-10 h-10 rounded-2xl bg-[#FFF4BF] shadow-[3px_3px_6px_#D1D9E6,-3px_-3px_6px_#FFFFFF] border border-[#DC95FF]/35 flex items-center justify-center text-[#6B21A8] font-extrabold text-sm shrink-0 transition-transform duration-200 group-hover:scale-105">
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
                        <span className="px-2 py-0.5 rounded-lg text-[10px] sm:text-xs font-semibold bg-[#EBF0F7] shadow-[inset_1.5px_1.5px_3px_#D1D9E6,inset_-1.5px_-1.5px_3px_#FFFFFF] border border-white/70 text-slate-700">
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
        <div className="bg-[#EBF0F7] rounded-3xl border border-white/85 shadow-[8px_8px_18px_#D1D9E6,-8px_-8px_18px_#FFFFFF] overflow-hidden flex flex-col">
          <div className="px-5 sm:px-6 py-4 border-b border-slate-200/70 bg-[#EBF0F7] flex items-center justify-between shadow-[0_2px_4px_rgba(209,217,230,0.25)]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#EBF0F7] shadow-[inset_2.5px_2.5px_5px_#D1D9E6,inset_-2.5px_-2.5px_5px_#FFFFFF] border border-white/70 flex items-center justify-center text-[#7C3AED] shrink-0">
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
              className="px-3.5 py-1.5 text-xs font-bold text-slate-700 bg-[#EBF0F7] shadow-[3px_3px_7px_#D1D9E6,-3px_-3px_7px_#FFFFFF] hover:shadow-[5px_5px_10px_#D1D9E6,-5px_-5px_10px_#FFFFFF] active:shadow-[inset_2px_2px_4px_#D1D9E6,inset_-2px_-2px_4px_#FFFFFF] border border-white/80 rounded-2xl flex items-center gap-1.5 transition-all cursor-pointer group"
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
                    <div className="w-10 h-10 rounded-2xl bg-[#FFF4BF] shadow-[3px_3px_6px_#D1D9E6,-3px_-3px_6px_#FFFFFF] border border-[#DC95FF]/35 flex items-center justify-center text-[#6B21A8] font-extrabold text-sm shrink-0 transition-transform duration-200 group-hover:scale-105">
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
                        <span className="px-2 py-0.5 rounded-lg text-[10px] sm:text-xs font-semibold bg-[#EBF0F7] shadow-[inset_1.5px_1.5px_3px_#D1D9E6,inset_-1.5px_-1.5px_3px_#FFFFFF] border border-white/70 text-slate-700">
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
        <div className="bg-[#EBF0F7] rounded-3xl border border-white/85 shadow-[8px_8px_18px_#D1D9E6,-8px_-8px_18px_#FFFFFF] overflow-hidden flex flex-col">
          <div className="px-5 sm:px-6 py-4 border-b border-slate-200/70 bg-[#EBF0F7] flex items-center justify-between shadow-[0_2px_4px_rgba(209,217,230,0.25)]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#EBF0F7] shadow-[inset_2.5px_2.5px_5px_#D1D9E6,inset_-2.5px_-2.5px_5px_#FFFFFF] border border-white/70 flex items-center justify-center text-[#7C3AED] shrink-0">
                <Users size={18} className="anim-neu-pulse" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-extrabold text-slate-800">Recent Leads</h2>
                <p className="text-[11px] sm:text-xs text-slate-500">Website patient inquiries & leads</p>
              </div>
            </div>
            <button 
              onClick={() => navigate('/staff/leads')}
              className="px-3.5 py-1.5 text-xs font-bold text-slate-700 bg-[#EBF0F7] shadow-[3px_3px_7px_#D1D9E6,-3px_-3px_7px_#FFFFFF] hover:shadow-[5px_5px_10px_#D1D9E6,-5px_-5px_10px_#FFFFFF] active:shadow-[inset_2px_2px_4px_#D1D9E6,inset_-2px_-2px_4px_#FFFFFF] border border-white/80 rounded-2xl flex items-center gap-1.5 transition-all cursor-pointer group"
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
                    <div className="w-10 h-10 rounded-2xl bg-[#FFF4BF] shadow-[3px_3px_6px_#D1D9E6,-3px_-3px_6px_#FFFFFF] border border-[#DC95FF]/35 flex items-center justify-center text-[#6B21A8] font-extrabold text-sm shrink-0 transition-transform duration-200 group-hover:scale-105">
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
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-extrabold bg-[#DC95FF]/20 text-[#6B21A8] shadow-[2px_2px_4px_#D1D9E6,-2px_-2px_4px_#FFFFFF] border border-[#DC95FF]/30">
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
