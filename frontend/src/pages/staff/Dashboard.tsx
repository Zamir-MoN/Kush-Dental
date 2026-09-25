import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../lib/apiClient';
import { 
  Calendar, Clock, User, Phone, CheckCircle2, 
  HelpCircle, ChevronRight, Loader2, AlertCircle, FileText
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

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      REQUESTED: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      CONFIRMED: 'bg-blue-100 text-blue-800 border-blue-200',
      COMPLETED: 'bg-green-100 text-green-800 border-green-200',
      CANCELLED: 'bg-red-100 text-red-800 border-red-200',
      NO_SHOW: 'bg-gray-100 text-gray-800 border-gray-200',
      NEW: 'bg-purple-100 text-purple-800 border-purple-200',
      CONTACTED: 'bg-blue-100 text-blue-800 border-blue-200',
      CONVERTED: 'bg-green-100 text-green-800 border-green-200',
      DISMISSED: 'bg-gray-100 text-gray-800 border-gray-200'
    };

    const style = styles[status] || 'bg-gray-100 text-gray-800 border-gray-200';
    return (
      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${style}`}>
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

  const AppointmentList = ({ appointments, title, emptyMsg }: { appointments: DashboardAppointment[], title: string, emptyMsg: string }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full">
      <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50">
        <h2 className="text-lg font-semibold text-[#162723]">{title}</h2>
      </div>
      <div className="flex-1 overflow-auto">
        {appointments.length === 0 ? (
          <div className="px-5 py-8 text-center">
            <p className="text-sm text-gray-500">{emptyMsg}</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {appointments.map(apt => (
              <li key={apt.id}>
                <button
                  onClick={() => navigate(`/staff/appointments/${apt.id}`)}
                  className="w-full text-left px-5 py-4 hover:bg-gray-50 transition-colors flex items-center justify-between group"
                >
                  <div className="min-w-0 pr-4">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {apt.patient.fullName}
                      </p>
                      {getStatusBadge(apt.status)}
                    </div>
                    <div className="flex items-center text-xs text-gray-500 gap-3">
                      <span className="flex items-center">
                        <Calendar className="w-3.5 h-3.5 mr-1" />
                        {formatDate(apt.startsAt)}
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-3.5 h-3.5 mr-1" />
                        {formatTime(apt.startsAt)}
                      </span>
                    </div>
                    <div className="mt-1.5 flex items-center text-xs text-gray-600">
                      <span className="font-medium bg-gray-100 px-2 py-0.5 rounded text-gray-600 truncate max-w-[150px] sm:max-w-[200px]">
                        {apt.treatment}
                      </span>
                      {apt.doctor && (
                        <span className="ml-2 flex items-center text-gray-500 truncate">
                          <User className="w-3 h-3 mr-1" />
                          Dr. {apt.doctor.name}
                        </span>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-[#DCA51B] flex-shrink-0 transition-colors" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#162723]">Operational Dashboard</h1>
          <p className="text-sm text-[#162723]/70 mt-1">
            Welcome back. Here is your overview for today.
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">Today's Appointments</h3>
            <div className="p-2 bg-blue-50 rounded-lg">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-[#162723] mt-2">{data.summary.todayAppointments}</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">Confirmed Today</h3>
            <div className="p-2 bg-green-50 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-[#162723] mt-2">{data.summary.confirmedToday}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">Pending Requests</h3>
            <div className="p-2 bg-yellow-50 rounded-lg">
              <HelpCircle className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-[#162723] mt-2">{data.summary.requestedAppointments}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">New Leads</h3>
            <div className="p-2 bg-purple-50 rounded-lg">
              <User className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-[#162723] mt-2">{data.summary.newLeads}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Open Follow-ups</p>
            <h3 className="text-2xl font-bold text-[#162723]">{data.summary.openFollowUps}</h3>
          </div>
          <div className="h-12 w-12 bg-amber-50 rounded-full flex items-center justify-center text-amber-600">
            <AlertCircle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">In-Progress Follow-ups</p>
            <h3 className="text-2xl font-bold text-[#162723]">{data.summary.inProgressFollowUps}</h3>
          </div>
          <div className="h-12 w-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
            <Loader2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        
        {/* Today's Appointments */}
        <div className="lg:col-span-1 h-[400px]">
          <AppointmentList 
            title="Today's Appointments" 
            appointments={data.todayAppointments} 
            emptyMsg="No appointments scheduled for today." 
          />
        </div>

        {/* Pending Requests */}
        <div className="lg:col-span-1 h-[400px]">
          <AppointmentList 
            title="Pending Requests" 
            appointments={data.requestedAppointments} 
            emptyMsg="No pending appointment requests." 
          />
        </div>

        {/* Upcoming Appointments */}
        <div className="lg:col-span-1 h-[400px]">
          <AppointmentList 
            title="Upcoming Appointments" 
            appointments={data.upcomingAppointments} 
            emptyMsg="No upcoming appointments found." 
          />
        </div>

        {/* Recent Leads */}
        <div className="lg:col-span-1 h-[400px]">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full">
            <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-lg font-semibold text-[#162723]">Recent Leads</h2>
            </div>
            <div className="flex-1 overflow-auto">
              {data.recentLeads.length === 0 ? (
                <div className="px-5 py-8 text-center">
                  <p className="text-sm text-gray-500">No recent leads found.</p>
                </div>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {data.recentLeads.map(lead => (
                    <li key={lead.id}>
                      <button
                        onClick={() => navigate(`/staff/leads/${lead.id}`)}
                        className="w-full text-left px-5 py-4 hover:bg-gray-50 transition-colors flex items-center justify-between group"
                      >
                        <div className="min-w-0 pr-4">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {lead.name}
                            </p>
                            {getStatusBadge(lead.status)}
                          </div>
                          <div className="flex items-center text-xs text-gray-500 gap-3">
                            <span className="flex items-center">
                              <Calendar className="w-3.5 h-3.5 mr-1" />
                              {formatDate(lead.createdAt)}
                            </span>
                            <span className="flex items-center">
                              <Phone className="w-3.5 h-3.5 mr-1" />
                              {lead.phone}
                            </span>
                          </div>
                          {lead.desiredTreatment && (
                            <div className="mt-1.5 flex items-center text-xs text-gray-600">
                              <FileText className="w-3.5 h-3.5 mr-1" />
                              <span className="truncate max-w-[200px]">
                                {lead.desiredTreatment}
                              </span>
                            </div>
                          )}
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-[#DCA51B] flex-shrink-0 transition-colors" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
