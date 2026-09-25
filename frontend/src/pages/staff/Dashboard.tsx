import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../lib/apiClient';
import { 
  Calendar, Clock, User, CheckCircle2, 
  ChevronRight, Loader2, AlertCircle, 
  Users, ArrowRight, TrendingUp, Sun, FileText, RefreshCw
} from 'lucide-react';

interface DashboardSummary {
  todayAppointments: number;
  requestedAppointments: number;
  confirmedToday: number;
  newLeads: number;
  openFollowUps: number;
  inProgressFollowUps: number;
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
  patient: DashboardPatient;
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
}

const WaveDecoration = ({ color, id }: { color: string; id: string }) => (
  <svg
    className="absolute bottom-0 left-0 right-0 w-full h-12 pointer-events-none opacity-40"
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
        <stop offset="0%" stopColor={color} stopOpacity="0.45" />
        <stop offset="100%" stopColor={color} stopOpacity="0.0" />
      </linearGradient>
    </defs>
  </svg>
);

const SparklineBars = ({ color }: { color: 'rose' | 'blue' }) => {
  const heights = [30, 50, 65, 45, 80, 60, 95, 75, 40, 20];
  const bgClass = color === 'rose' ? 'bg-rose-300/70' : 'bg-blue-300/70';
  return (
    <div className="flex items-end gap-1.5 h-8 shrink-0">
      {heights.map((h, i) => (
        <span
          key={i}
          className={`w-1.5 rounded-full ${bgClass}`}
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
    const fetchDashboard = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await apiClient<DashboardResponse>('/api/v1/dashboard');
        setData(response);
      } catch (err: any) {
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(dateString));
  };
  
  const formatTime = (dateString: string) => {
    return new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).format(new Date(dateString));
  };

  const formattedCurrentDate = new Intl.DateTimeFormat('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  }).format(new Date());

  const getStatusBadge = (status: string) => {
    if (status === 'CONFIRMED') {
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-600 border border-blue-200">
          CONFIRMED
        </span>
      );
    }
    if (status === 'REQUESTED') {
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#FAF3E0] text-[#8C6B14] border border-[#DCA51B]/40">
          REQUESTED
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-zinc-100 text-zinc-700 border border-zinc-200">
        {status.replace('_', ' ')}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 text-[#DCA51B] animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start">
        <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
        <div>
          <h3 className="text-sm font-medium text-red-800">Error loading dashboard</h3>
          <p className="mt-1 text-sm text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-4 sm:space-y-6 max-w-7xl mx-auto pb-8 sm:pb-10">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-zinc-900 tracking-tight">Operational Dashboard</h1>
          <p className="text-xs sm:text-sm text-zinc-500 font-medium mt-0.5">
            Welcome back. Here is your overview for today.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <div className="inline-flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-[#E8E2D5] text-xs font-semibold text-zinc-700 shadow-2xs">
            <Calendar size={13} className="text-[#8C6B14] anim-icon-pulse" />
            <span>{formattedCurrentDate}</span>
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="group inline-flex items-center gap-1.5 bg-[#141518] hover:bg-zinc-800 text-white px-3.5 py-1.5 rounded-xl text-xs font-semibold shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            <Sun size={13} className="text-[#DCA51B] transition-transform duration-500 group-hover:rotate-90 group-hover:scale-110" />
            <span>Today</span>
          </button>
        </div>
      </div>

      {/* Row 1: 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {/* Card 1: Today's Appointments */}
        <div 
          onClick={() => navigate('/staff/appointments')}
          className="bg-white rounded-3xl p-4 sm:p-5 border border-[#E8E2D5] shadow-xs relative overflow-hidden flex flex-col justify-between hover:shadow-md hover:border-[#DCA51B]/50 transition-all duration-300 group cursor-pointer"
        >
          <div className="flex items-center justify-between z-10">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#FAF3E0] border border-[#DCA51B]/30 flex items-center justify-center text-[#8C6B14] shadow-2xs transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1">
              <Calendar size={22} className="text-[#DCA51B]" />
            </div>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
              <TrendingUp size={12} className="animate-pulse" /> +12%
            </span>
          </div>
          <div className="mt-3 sm:mt-4 z-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 group-hover:text-[#8C6B14] transition-colors">{data.summary.todayAppointments}</h2>
            <p className="text-xs font-medium text-zinc-500 mt-0.5">Today&apos;s Appointments</p>
          </div>
          <WaveDecoration color="#F59E0B" id="amber" />
          <button className="absolute bottom-4 right-4 w-7 h-7 rounded-full bg-white border border-[#E8E2D5] flex items-center justify-center text-zinc-400 group-hover:text-white group-hover:bg-[#141518] group-hover:border-[#141518] transition-all duration-300 shadow-2xs z-10">
            <ArrowRight size={13} className="transition-transform duration-300 group-hover:translate-x-0.5" />
          </button>
        </div>

        {/* Card 2: Confirmed Today */}
        <div 
          onClick={() => navigate('/staff/appointments')}
          className="bg-white rounded-3xl p-4 sm:p-5 border border-[#E8E2D5] shadow-xs relative overflow-hidden flex flex-col justify-between hover:shadow-md hover:border-emerald-300 transition-all duration-300 group cursor-pointer"
        >
          <div className="flex items-center justify-between z-10">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-2xs transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1">
              <CheckCircle2 size={22} />
            </div>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
              <TrendingUp size={12} className="animate-pulse" /> +0%
            </span>
          </div>
          <div className="mt-3 sm:mt-4 z-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 group-hover:text-emerald-700 transition-colors">{data.summary.confirmedToday}</h2>
            <p className="text-xs font-medium text-zinc-500 mt-0.5">Confirmed Today</p>
          </div>
          <WaveDecoration color="#10B981" id="emerald" />
          <button className="absolute bottom-4 right-4 w-7 h-7 rounded-full bg-white border border-[#E8E2D5] flex items-center justify-center text-zinc-400 group-hover:text-white group-hover:bg-[#141518] group-hover:border-[#141518] transition-all duration-300 shadow-2xs z-10">
            <ArrowRight size={13} className="transition-transform duration-300 group-hover:translate-x-0.5" />
          </button>
        </div>

        {/* Card 3: Pending Requests */}
        <div 
          onClick={() => navigate('/staff/appointments')}
          className="bg-white rounded-3xl p-4 sm:p-5 border border-[#E8E2D5] shadow-xs relative overflow-hidden flex flex-col justify-between hover:shadow-md hover:border-orange-300 transition-all duration-300 group cursor-pointer"
        >
          <div className="flex items-center justify-between z-10">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600 shadow-2xs transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1">
              <Clock size={22} className="anim-icon-float" />
            </div>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-50 text-orange-600 border border-orange-200">
              <TrendingUp size={12} className="animate-pulse" /> +8%
            </span>
          </div>
          <div className="mt-3 sm:mt-4 z-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 group-hover:text-orange-700 transition-colors">{data.summary.requestedAppointments}</h2>
            <p className="text-xs font-medium text-zinc-500 mt-0.5">Pending Requests</p>
          </div>
          <WaveDecoration color="#F97316" id="orange" />
          <button className="absolute bottom-4 right-4 w-7 h-7 rounded-full bg-white border border-[#E8E2D5] flex items-center justify-center text-zinc-400 group-hover:text-white group-hover:bg-[#141518] group-hover:border-[#141518] transition-all duration-300 shadow-2xs z-10">
            <ArrowRight size={13} className="transition-transform duration-300 group-hover:translate-x-0.5" />
          </button>
        </div>

        {/* Card 4: New Leads */}
        <div 
          onClick={() => navigate('/staff/leads')}
          className="bg-white rounded-3xl p-4 sm:p-5 border border-[#E8E2D5] shadow-xs relative overflow-hidden flex flex-col justify-between hover:shadow-md hover:border-purple-300 transition-all duration-300 group cursor-pointer"
        >
          <div className="flex items-center justify-between z-10">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600 shadow-2xs transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1">
              <Users size={22} />
            </div>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-50 text-purple-600 border border-purple-200">
              <TrendingUp size={12} className="animate-pulse" /> +22%
            </span>
          </div>
          <div className="mt-3 sm:mt-4 z-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 group-hover:text-purple-700 transition-colors">{data.summary.newLeads}</h2>
            <p className="text-xs font-medium text-zinc-500 mt-0.5">New Leads</p>
          </div>
          <WaveDecoration color="#8B5CF6" id="purple" />
          <button className="absolute bottom-4 right-4 w-7 h-7 rounded-full bg-white border border-[#E8E2D5] flex items-center justify-center text-zinc-400 group-hover:text-white group-hover:bg-[#141518] group-hover:border-[#141518] transition-all duration-300 shadow-2xs z-10">
            <ArrowRight size={13} className="transition-transform duration-300 group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>

      {/* Row 2: 2 Wide Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
        {/* Open Follow-ups */}
        <div 
          onClick={() => navigate('/staff/contacts')}
          className="bg-white rounded-3xl p-4 sm:p-5 border border-[#E8E2D5] shadow-xs flex items-center justify-between hover:shadow-md hover:border-rose-300 transition-all duration-300 group cursor-pointer"
        >
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-500 shadow-2xs shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-0.5">
              <FileText size={22} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 group-hover:text-rose-600 transition-colors">{data.summary.openFollowUps}</h2>
                <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold bg-rose-50 text-rose-600 border border-rose-200">
                  <TrendingUp size={11} className="animate-pulse" /> +5%
                </span>
              </div>
              <p className="text-xs font-medium text-zinc-500 mt-0.5 truncate">Open Follow-ups</p>
            </div>
          </div>
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            <SparklineBars color="rose" />
            <button className="w-7 h-7 rounded-full bg-white border border-[#E8E2D5] flex items-center justify-center text-zinc-400 group-hover:text-white group-hover:bg-[#141518] group-hover:border-[#141518] transition-all duration-300 shadow-2xs">
              <ArrowRight size={13} className="transition-transform duration-300 group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>

        {/* In-Progress Follow-ups */}
        <div 
          onClick={() => navigate('/staff/contacts')}
          className="bg-white rounded-3xl p-4 sm:p-5 border border-[#E8E2D5] shadow-xs flex items-center justify-between hover:shadow-md hover:border-blue-300 transition-all duration-300 group cursor-pointer"
        >
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-500 shadow-2xs shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-0.5">
              <RefreshCw size={22} className="group-hover:rotate-180 transition-transform duration-700" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 group-hover:text-blue-600 transition-colors">{data.summary.inProgressFollowUps}</h2>
                <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold bg-blue-50 text-blue-600 border border-blue-200">
                  <TrendingUp size={11} className="animate-pulse" /> 0%
                </span>
              </div>
              <p className="text-xs font-medium text-zinc-500 mt-0.5 truncate">In-Progress Follow-ups</p>
            </div>
          </div>
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            <SparklineBars color="blue" />
            <button className="w-7 h-7 rounded-full bg-white border border-[#E8E2D5] flex items-center justify-center text-zinc-400 group-hover:text-white group-hover:bg-[#141518] group-hover:border-[#141518] transition-all duration-300 shadow-2xs">
              <ArrowRight size={13} className="transition-transform duration-300 group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Row 3: Today's Appointments & Pending Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Today's Appointments List Card */}
        <div className="bg-white rounded-3xl border border-[#E8E2D5] shadow-xs overflow-hidden flex flex-col">
          <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-[#E8E2D5] bg-[#FAF7F2]/40 flex items-center justify-between">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-[#FAF3E0] border border-[#DCA51B]/30 flex items-center justify-center text-[#8C6B14] shadow-2xs shrink-0 transition-transform duration-300 hover:scale-110">
                <Calendar size={18} className="text-[#DCA51B] anim-icon-pulse" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-zinc-900">Today&apos;s Appointments</h2>
                <p className="text-[11px] sm:text-xs text-zinc-400">All appointments scheduled for today</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold text-zinc-700 bg-white border border-[#E8E2D5] shadow-2xs">
                {data.todayAppointments.length} Total
              </span>
              <button 
                onClick={() => navigate('/staff/appointments')}
                className="w-7 h-7 rounded-full bg-white border border-[#E8E2D5] flex items-center justify-center text-zinc-400 hover:text-zinc-900 hover:border-zinc-400 transition-all shadow-2xs cursor-pointer group"
                title="View Appointments"
              >
                <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          </div>

          <div className="divide-y divide-[#E8E2D5]/70 max-h-[380px] overflow-y-auto custom-scrollbar">
            {data.todayAppointments.length === 0 ? (
              <div className="px-4 sm:px-6 py-10 sm:py-12 text-center text-xs text-zinc-400 font-medium">
                No appointments scheduled for today.
              </div>
            ) : (
              data.todayAppointments.map((apt) => (
                <button
                  key={apt.id}
                  onClick={() => navigate(`/staff/appointments/${apt.id}`)}
                  className="w-full text-left px-3.5 sm:px-6 py-3 sm:py-4 hover:bg-[#FAF7F2]/50 transition-colors flex items-center justify-between group cursor-pointer border-l-4 border-l-[#DCA51B]"
                >
                  <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0 pr-2">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-[#FAF3E0] border border-[#DCA51B]/40 flex items-center justify-center text-[#8C6B14] font-bold text-xs sm:text-sm shrink-0 shadow-2xs transition-transform duration-200 group-hover:scale-105">
                      {apt.patient.fullName.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1">
                        <span className="font-bold text-xs sm:text-sm text-zinc-900 truncate">
                          {apt.patient.fullName}
                        </span>
                        {getStatusBadge(apt.status)}
                      </div>
                      <div className="flex flex-wrap items-center gap-x-2.5 sm:gap-x-3 gap-y-1 text-[11px] sm:text-xs text-zinc-500 font-medium">
                        <span className="flex items-center gap-1">
                          <Calendar size={11} className="text-[#8C6B14]" />
                          {formatDate(apt.startsAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={11} className="text-[#8C6B14]" />
                          {formatTime(apt.startsAt)}
                        </span>
                        <span className="px-1.5 sm:px-2 py-0.5 rounded-lg text-[10px] sm:text-xs font-semibold bg-[#FAF7F2] text-zinc-700 border border-[#E8E2D5]">
                          {apt.treatment || 'Treatment'}
                        </span>
                        {apt.doctor && (
                          <span className="flex items-center gap-1 text-zinc-500 truncate">
                            <User size={10} className="text-zinc-400" />
                            Dr. {apt.doctor.name}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-zinc-300 group-hover:text-[#DCA51B] group-hover:translate-x-0.5 shrink-0 transition-all" />
                </button>
              ))
            )}
          </div>
        </div>

        {/* Pending Requests List Card */}
        <div className="bg-white rounded-3xl border border-[#E8E2D5] shadow-xs overflow-hidden flex flex-col">
          <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-[#E8E2D5] bg-[#FAF7F2]/40 flex items-center justify-between">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600 shadow-2xs shrink-0 transition-transform duration-300 hover:scale-110">
                <Clock size={18} className="anim-icon-float" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-zinc-900">Pending Requests</h2>
                <p className="text-[11px] sm:text-xs text-zinc-400">Requests awaiting action</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold text-zinc-700 bg-white border border-[#E8E2D5] shadow-2xs">
                {data.requestedAppointments.length} Total
              </span>
              <button 
                onClick={() => navigate('/staff/appointments')}
                className="w-7 h-7 rounded-full bg-white border border-[#E8E2D5] flex items-center justify-center text-zinc-400 hover:text-zinc-900 hover:border-zinc-400 transition-all shadow-2xs cursor-pointer group"
                title="View Pending"
              >
                <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          </div>

          <div className="divide-y divide-[#E8E2D5]/70 max-h-[380px] overflow-y-auto custom-scrollbar">
            {data.requestedAppointments.length === 0 ? (
              <div className="px-4 sm:px-6 py-10 sm:py-12 text-center text-xs text-zinc-400 font-medium">
                No pending appointment requests.
              </div>
            ) : (
              data.requestedAppointments.map((apt) => (
                <button
                  key={apt.id}
                  onClick={() => navigate(`/staff/appointments/${apt.id}`)}
                  className="w-full text-left px-3.5 sm:px-6 py-3 sm:py-4 hover:bg-[#FAF7F2]/50 transition-colors flex items-center justify-between group cursor-pointer border-l-4 border-l-amber-400"
                >
                  <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0 pr-2">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-[#FAF3E0] border border-[#DCA51B]/40 flex items-center justify-center text-[#8C6B14] font-bold text-xs sm:text-sm shrink-0 shadow-2xs transition-transform duration-200 group-hover:scale-105">
                      {apt.patient.fullName.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1">
                        <span className="font-bold text-xs sm:text-sm text-zinc-900 truncate">
                          {apt.patient.fullName}
                        </span>
                        {getStatusBadge(apt.status)}
                      </div>
                      <div className="flex flex-wrap items-center gap-x-2.5 sm:gap-x-3 gap-y-1 text-[11px] sm:text-xs text-zinc-500 font-medium">
                        <span className="flex items-center gap-1">
                          <Calendar size={11} className="text-[#8C6B14]" />
                          {formatDate(apt.startsAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={11} className="text-[#8C6B14]" />
                          {formatTime(apt.startsAt)}
                        </span>
                        <span className="px-1.5 sm:px-2 py-0.5 rounded-lg text-[10px] sm:text-xs font-semibold bg-[#FAF7F2] text-zinc-700 border border-[#E8E2D5]">
                          {apt.treatment || 'Treatment'}
                        </span>
                        {apt.doctor && (
                          <span className="flex items-center gap-1 text-zinc-500 truncate">
                            <User size={10} className="text-zinc-400" />
                            Dr. {apt.doctor.name}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-zinc-300 group-hover:text-[#DCA51B] group-hover:translate-x-0.5 shrink-0 transition-all" />
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Row 4: Upcoming Appointments & Recent Leads */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Upcoming Appointments */}
        <div className="bg-white rounded-3xl border border-[#E8E2D5] shadow-xs overflow-hidden flex flex-col">
          <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-[#E8E2D5] bg-[#FAF7F2]/40 flex items-center justify-between">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-[#FAF3E0] border border-[#DCA51B]/30 flex items-center justify-center text-[#8C6B14] shadow-2xs shrink-0 transition-transform duration-300 hover:scale-110">
                <Calendar size={18} className="text-[#DCA51B] anim-icon-pulse" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-zinc-900">Upcoming Appointments</h2>
                <p className="text-[11px] sm:text-xs text-zinc-400">Your next scheduled appointments</p>
              </div>
            </div>
            <button 
              onClick={() => navigate('/staff/appointments')}
              className="px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-xs font-semibold text-zinc-700 bg-white hover:bg-[#FAF7F2] border border-[#E8E2D5] rounded-xl flex items-center gap-1 transition-all shadow-2xs cursor-pointer group"
            >
              <span>View All</span>
              <ChevronRight size={12} className="transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>

          <div className="divide-y divide-[#E8E2D5]/70 max-h-[380px] overflow-y-auto custom-scrollbar">
            {data.upcomingAppointments.length === 0 ? (
              <div className="px-4 sm:px-6 py-10 sm:py-12 text-center text-xs text-zinc-400 font-medium">
                No upcoming appointments found.
              </div>
            ) : (
              data.upcomingAppointments.map((apt) => (
                <button
                  key={apt.id}
                  onClick={() => navigate(`/staff/appointments/${apt.id}`)}
                  className="w-full text-left px-3.5 sm:px-6 py-3 sm:py-4 hover:bg-[#FAF7F2]/50 transition-colors flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0 pr-2">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-[#FAF3E0] border border-[#DCA51B]/40 flex items-center justify-center text-[#8C6B14] font-bold text-xs sm:text-sm shrink-0 shadow-2xs transition-transform duration-200 group-hover:scale-105">
                      {apt.patient.fullName.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-xs sm:text-sm text-zinc-900 truncate mb-1">
                        {apt.patient.fullName}
                      </div>
                      <div className="flex flex-wrap items-center gap-x-2.5 sm:gap-x-3 gap-y-1 text-[11px] sm:text-xs text-zinc-500 font-medium">
                        <span className="flex items-center gap-1">
                          <Calendar size={11} className="text-[#8C6B14]" />
                          {formatDate(apt.startsAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={11} className="text-[#8C6B14]" />
                          {formatTime(apt.startsAt)}
                        </span>
                        <span className="px-1.5 sm:px-2 py-0.5 rounded-lg text-[10px] sm:text-xs font-semibold bg-[#FAF7F2] text-zinc-700 border border-[#E8E2D5]">
                          {apt.treatment || 'Treatment'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                    {getStatusBadge(apt.status)}
                    <ChevronRight size={16} className="text-zinc-300 group-hover:text-[#DCA51B] group-hover:translate-x-0.5 transition-all" />
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Recent Leads */}
        <div className="bg-white rounded-3xl border border-[#E8E2D5] shadow-xs overflow-hidden flex flex-col">
          <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-[#E8E2D5] bg-[#FAF7F2]/40 flex items-center justify-between">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600 shadow-2xs shrink-0 transition-transform duration-300 hover:scale-110">
                <Users size={18} className="anim-icon-pulse" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-zinc-900">Recent Leads</h2>
                <p className="text-[11px] sm:text-xs text-zinc-400">Latest leads added to the system</p>
              </div>
            </div>
            <button 
              onClick={() => navigate('/staff/leads')}
              className="px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-xs font-semibold text-zinc-700 bg-white hover:bg-[#FAF7F2] border border-[#E8E2D5] rounded-xl flex items-center gap-1 transition-all shadow-2xs cursor-pointer group"
            >
              <span>View All</span>
              <ChevronRight size={12} className="transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>

          <div className="divide-y divide-[#E8E2D5]/70 max-h-[380px] overflow-y-auto custom-scrollbar">
            {data.recentLeads.length === 0 ? (
              <div className="px-4 sm:px-6 py-10 sm:py-12 text-center text-xs text-zinc-400 font-medium">
                No recent leads found.
              </div>
            ) : (
              data.recentLeads.map((lead) => (
                <button
                  key={lead.id}
                  onClick={() => navigate(`/staff/leads/${lead.id}`)}
                  className="w-full text-left px-3.5 sm:px-6 py-3 sm:py-4 hover:bg-[#FAF7F2]/50 transition-colors flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0 pr-2">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-[#FAF3E0] border border-[#DCA51B]/40 flex items-center justify-center text-[#8C6B14] font-bold text-xs sm:text-sm shrink-0 shadow-2xs transition-transform duration-200 group-hover:scale-105">
                      {lead.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-xs sm:text-sm text-zinc-900 truncate mb-1">
                        {lead.name}
                      </div>
                      <div className="flex flex-wrap items-center gap-x-2.5 sm:gap-x-3 gap-y-1 text-[11px] sm:text-xs text-zinc-500 font-medium">
                        <span className="flex items-center gap-1">
                          <Calendar size={11} className="text-[#8C6B14]" />
                          {formatDate(lead.createdAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={11} className="text-[#8C6B14]" />
                          {formatTime(lead.createdAt)}
                        </span>
                        <span className="px-1.5 sm:px-2 py-0.5 rounded-lg text-[10px] sm:text-xs font-semibold bg-[#FAF3E0] text-[#8C6B14] border border-[#DCA51B]/30">
                          From Website
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                    <span className="px-2 sm:px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
                      New
                    </span>
                    <ChevronRight size={16} className="text-zinc-300 group-hover:text-[#DCA51B] group-hover:translate-x-0.5 transition-all" />
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
