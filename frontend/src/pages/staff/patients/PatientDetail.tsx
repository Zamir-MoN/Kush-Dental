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
        <Loader2 className="w-8 h-8 animate-spin text-[#162723]" />
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="bg-red-50 text-red-600 p-6 rounded-xl flex items-start space-x-3">
        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="text-sm font-medium">Error Loading Patient</h3>
          <p className="mt-1 text-sm">{error || 'Patient not found'}</p>
          <button 
            onClick={() => navigate('/staff/patients')}
            className="mt-4 text-sm font-medium text-red-700 hover:text-red-800"
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
          className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Directory
        </button>
      </div>

      <div className="bg-white shadow rounded-xl overflow-hidden border border-gray-100">
        <div className="p-6 sm:p-8 bg-gradient-to-r from-[#162723]/5 to-transparent">
          <div className="flex items-center space-x-5">
            <div className="h-16 w-16 bg-[#162723] rounded-full flex items-center justify-center flex-shrink-0 text-white text-2xl font-semibold shadow-sm">
              {patient.fullName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#162723]">{patient.fullName}</h1>
              <div className="mt-2 flex flex-col sm:flex-row sm:space-x-6 space-y-2 sm:space-y-0 text-sm text-gray-600">
                <a href={`tel:${patient.phone}`} className="flex items-center hover:text-[#162723] transition-colors">
                  <Phone className="w-4 h-4 mr-2 opacity-70" />
                  {patient.phone}
                </a>
                {patient.email && (
                  <a href={`mailto:${patient.email}`} className="flex items-center hover:text-[#162723] transition-colors">
                    <Mail className="w-4 h-4 mr-2 opacity-70" />
                    {patient.email}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200">
          <dl className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-200">
            <div className="px-6 py-5">
              <dt className="text-sm font-medium text-gray-500">Patient ID</dt>
              <dd className="mt-1 text-sm text-gray-900 break-all">{patient.id}</dd>
            </div>
            <div className="px-6 py-5">
              <dt className="text-sm font-medium text-gray-500">Total Appointments</dt>
              <dd className="mt-1 text-2xl font-semibold text-[#162723]">{appointments.length}{hasMore ? '+' : ''}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold text-[#162723] mb-4">Appointment History</h2>
        
        {appointments.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
            <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-3" />
            <h3 className="text-sm font-medium text-gray-900">No appointments</h3>
            <p className="mt-1 text-sm text-gray-500">This patient hasn't booked any appointments yet.</p>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-xl border border-gray-100">
            <ul role="list" className="divide-y divide-gray-200">
              {appointments.map((apt) => {
                return (
                  <li key={apt.id}>
                    <button
                      onClick={() => navigate(`/staff/appointments/${apt.id}`)}
                      className="block hover:bg-gray-50 w-full text-left transition-colors"
                    >
                      <div className="px-4 py-4 sm:px-6 flex items-center justify-between">
                        <div className="flex flex-col sm:flex-row sm:items-center w-full min-w-0 pr-4">
                          <div className="flex items-center w-48 flex-shrink-0">
                            <div className="flex-shrink-0 bg-blue-50 p-2 rounded-lg mr-4">
                              <Calendar className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {formatDate(apt.startsAt)}
                              </p>
                              <p className="text-xs text-gray-500 flex items-center mt-1">
                                <Clock className="w-3 h-3 mr-1" />
                                {formatTime(apt.startsAt)}
                              </p>
                            </div>
                          </div>
                          <div className="mt-2 sm:mt-0 sm:ml-4 flex-1 min-w-0">
                            <p className="text-sm font-semibold text-[#162723] truncate">
                              {apt.treatment}
                            </p>
                            <div className="mt-1 flex items-center">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                                ${apt.status === 'SCHEDULED' ? 'bg-green-100 text-green-800' : 
                                  apt.status === 'COMPLETED' ? 'bg-gray-100 text-gray-800' :
                                  apt.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                                  'bg-yellow-100 text-yellow-800'}`}>
                                {apt.status.toLowerCase()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          <ChevronRight className="h-5 w-5 text-gray-400" />
                        </div>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
            
            {hasMore && (
              <div className="px-4 py-4 sm:px-6 border-t border-gray-200 text-center">
                <button
                  onClick={loadMoreAppointments}
                  disabled={isLoadingMore}
                  className="text-sm font-medium text-[#162723] hover:text-[#213f38] transition-colors disabled:opacity-50"
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
