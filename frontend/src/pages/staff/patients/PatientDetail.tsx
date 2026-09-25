import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, Mail, Calendar, Clock, ChevronRight, Loader2, AlertCircle } from 'lucide-react';
import { apiClient } from '../../../lib/apiClient';

interface Patient {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
}

interface Appointment {
  id: string;
  treatment: string;
  startsAt: string;
  endsAt: string;
  status: string;
  doctorId?: string;
}

export const PatientDetail = () => {
  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(dateString));
  };
  const formatTime = (dateString: string) => {
    return new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).format(new Date(dateString));
  };

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [patient, setPatient] = useState<Patient | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  
  const LIMIT = 5;

  const fetchPatientData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const p = await apiClient<Patient>(`/api/v1/patients/${id}`);
      setPatient(p);
      
      const apts = await apiClient<Appointment[]>(`/api/v1/appointments?patientId=${id}&orderDesc=true&limit=${LIMIT}`);
      setAppointments(apts);
      if (apts.length < LIMIT) {
        setHasMore(false);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load patient details');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchPatientData();
    }
  }, [id]);

  const loadMoreAppointments = async () => {
    if (isLoadingMore || !hasMore) return;
    
    setIsLoadingMore(true);
    try {
      const skip = appointments.length;
      const apts = await apiClient<Appointment[]>(`/api/v1/appointments?patientId=${id}&orderDesc=true&skip=${skip}&limit=${LIMIT}`);
      
      if (apts.length > 0) {
        setAppointments(prev => [...prev, ...apts]);
      }
      if (apts.length < LIMIT) {
        setHasMore(false);
      }
    } catch (err: any) {
      console.error('Failed to load more appointments:', err);
    } finally {
      setIsLoadingMore(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#DCA51B]" />
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="bg-red-50 text-red-700 p-6 rounded-2xl border border-red-200 flex items-start space-x-3">
        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="text-sm font-semibold">Error Loading Patient</h3>
          <p className="mt-1 text-sm">{error || 'Patient not found'}</p>
          <button 
            onClick={() => navigate('/staff/patients')}
            className="mt-4 text-xs font-bold uppercase tracking-wider text-red-700 hover:text-red-800"
          >
            &larr; Back to Patients
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div>
        <button 
          onClick={() => navigate('/staff/patients')}
          className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-zinc-900 mb-2 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Back to Directory
        </button>
      </div>

      <div className="bg-white shadow-sm rounded-2xl overflow-hidden border border-[#E8E2D5]">
        <div className="p-6 sm:p-8 bg-gradient-to-r from-[#FAF3E0]/60 to-transparent">
          <div className="flex items-center space-x-5">
            <div className="h-16 w-16 bg-gradient-to-br from-[#E5B22D] to-[#B8871B] rounded-2xl flex items-center justify-center flex-shrink-0 text-[#141518] text-2xl font-bold shadow-md">
              {patient.fullName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">{patient.fullName}</h1>
              <div className="mt-2 flex flex-col sm:flex-row sm:space-x-6 space-y-2 sm:space-y-0 text-sm text-zinc-500">
                <a href={`tel:${patient.phone}`} className="flex items-center hover:text-[#8C6B14] transition-colors">
                  <Phone className="w-4 h-4 mr-1.5 text-zinc-400" />
                  {patient.phone}
                </a>
                {patient.email && (
                  <a href={`mailto:${patient.email}`} className="flex items-center hover:text-[#8C6B14] transition-colors">
                    <Mail className="w-4 h-4 mr-1.5 text-zinc-400" />
                    {patient.email}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-[#E8E2D5]">
          <dl className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#E8E2D5]">
            <div className="px-6 py-5">
              <dt className="text-xs font-bold uppercase tracking-wider text-zinc-400">Patient ID</dt>
              <dd className="mt-1 text-xs font-mono text-zinc-700 break-all">{patient.id}</dd>
            </div>
            <div className="px-6 py-5">
              <dt className="text-xs font-bold uppercase tracking-wider text-zinc-400">Total Appointments</dt>
              <dd className="mt-1 text-2xl font-bold text-zinc-900">{appointments.length}{hasMore ? '+' : ''}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold text-zinc-900 tracking-tight mb-4">Appointment History</h2>
        
        {appointments.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-[#E8E2D5] p-8 text-center">
            <Calendar className="mx-auto h-12 w-12 text-zinc-300 mb-3" />
            <h3 className="text-sm font-semibold text-zinc-800">No appointments</h3>
            <p className="mt-1 text-sm text-zinc-500">This patient hasn't booked any appointments yet.</p>
          </div>
        ) : (
          <div className="bg-white shadow-sm overflow-hidden rounded-2xl border border-[#E8E2D5]">
            <ul role="list" className="divide-y divide-[#E8E2D5]">
              {appointments.map((apt) => {
                return (
                  <li key={apt.id}>
                    <button
                      onClick={() => navigate(`/staff/appointments/${apt.id}`)}
                      className="block hover:bg-[#FAF7F2]/60 w-full text-left transition-colors"
                    >
                      <div className="px-5 py-4 sm:px-6 flex items-center justify-between">
                        <div className="flex flex-col sm:flex-row sm:items-center w-full min-w-0 pr-4">
                          <div className="flex items-center w-48 flex-shrink-0">
                            <div className="flex-shrink-0 bg-[#FAF3E0] border border-[#DCA51B]/30 p-2 rounded-xl mr-3.5">
                              <Calendar className="h-4 w-4 text-[#8C6B14]" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-zinc-900">
                                {formatDate(apt.startsAt)}
                              </p>
                              <p className="text-xs text-zinc-500 flex items-center mt-0.5">
                                <Clock className="w-3 h-3 mr-1 text-zinc-400" />
                                {formatTime(apt.startsAt)}
                              </p>
                            </div>
                          </div>
                          <div className="mt-2 sm:mt-0 sm:ml-4 flex-1 min-w-0">
                            <p className="text-sm font-semibold text-zinc-900 truncate">
                              {apt.treatment}
                            </p>
                            <div className="mt-1 flex items-center">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-[11px] font-bold uppercase tracking-wider border
                                ${apt.status === 'SCHEDULED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                                  apt.status === 'COMPLETED' ? 'bg-zinc-100 text-zinc-700 border-zinc-200' :
                                  apt.status === 'CANCELLED' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                                  'bg-[#FAF3E0] text-[#8C6B14] border-[#DCA51B]/40'}`}>
                                {apt.status.toLowerCase()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          <ChevronRight className="h-5 w-5 text-zinc-400" />
                        </div>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
            
            {hasMore && (
              <div className="px-4 py-3.5 border-t border-[#E8E2D5] bg-[#FAF7F2]/50 text-center">
                <button
                  onClick={loadMoreAppointments}
                  disabled={isLoadingMore}
                  className="text-xs font-bold uppercase tracking-wider text-[#8C6B14] hover:text-[#B8871B] transition-colors disabled:opacity-50"
                >
                  {isLoadingMore ? 'Loading...' : 'Load more appointments'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
