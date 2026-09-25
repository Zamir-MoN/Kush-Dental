import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Save, AlertCircle, X } from 'lucide-react';
import { apiClient } from '../../../lib/apiClient';

interface AppointmentFormProps {
  isDoctor: boolean;
  appointment?: any; // If provided, we are in Edit mode
  onSuccess?: (apt: any) => void;
  onCancel?: () => void;
}

export const AppointmentForm: React.FC<AppointmentFormProps> = ({
  isDoctor,
  appointment,
  onSuccess,
  onCancel
}) => {
  const navigate = useNavigate();
  const isEdit = !!appointment;
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form fields
  const [patientId, setPatientId] = useState(appointment?.patientId || '');
  const [doctorId, setDoctorId] = useState(appointment?.doctorId || '');
  const [treatment, setTreatment] = useState(appointment?.treatment || '');
  
  // Format for datetime-local
  const formatForInput = (isoString?: string) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return '';
    
    const tzOffset = date.getTimezoneOffset() * 60000; 
    const localISOTime = new Date(date.getTime() - tzOffset).toISOString().slice(0, 16);
    return localISOTime;
  };

  const [startsAt, setStartsAt] = useState(formatForInput(appointment?.startsAt));
  const [endsAt, setEndsAt] = useState(formatForInput(appointment?.endsAt));

  // Lookups
  const [phoneSearch, setPhoneSearch] = useState('');
  const [searchingPatient, setSearchingPatient] = useState(false);
  const [patientLookupResults, setPatientLookupResults] = useState<any[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  
  const [doctors, setDoctors] = useState<any[]>([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const data = await apiClient<any[]>('/api/v1/appointments/doctors');
        setDoctors(data);
      } catch (err) {
        console.error('Failed to load doctors');
      }
    };
    fetchDoctors();
  }, []);

  const handlePatientSearch = async () => {
    if (!phoneSearch.trim()) return;
    try {
      setSearchingPatient(true);
      setError(null);
      const data = await apiClient<any[]>(`/api/v1/patients/search?q=${encodeURIComponent(phoneSearch)}`);
      if (data.length === 0) {
        setPatientLookupResults([]);
        setSelectedPatient(null);
        setError('No patient found with that name or phone number.');
      } else if (data.length === 1) {
        setPatientLookupResults([]);
        setSelectedPatient(data[0]);
        setPatientId(data[0].id);
      } else {
        setPatientLookupResults(data);
        setSelectedPatient(null);
      }
    } catch (err: any) {
      setPatientLookupResults([]);
      setSelectedPatient(null);
      setError('Error searching for patient.');
    } finally {
      setSearchingPatient(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startsAt || !endsAt) {
      setError("Please provide start and end times.");
      return;
    }
    
    const startIso = new Date(startsAt).toISOString();
    const endIso = new Date(endsAt).toISOString();
    
    if (new Date(startIso) >= new Date(endIso)) {
      setError("End time must be after start time.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const payload: any = {
        startsAt: startIso,
        endsAt: endIso,
        doctorId: doctorId || null,
      };

      if (!isEdit || isDoctor) {
        payload.treatment = treatment;
      }
      
      let res;
      if (isEdit) {
        res = await apiClient<any>(`/api/v1/appointments/${appointment.id}`, {
          method: 'PATCH',
          data: payload
        });
      } else {
        payload.patientId = patientId;
        res = await apiClient<any>('/api/v1/appointments', {
          method: 'POST',
          data: payload
        });
      }
      
      if (onSuccess) {
        onSuccess(res);
      } else if (!isEdit) {
        navigate(`/staff/appointments/${res.id}`);
      }
    } catch (err: any) {
      if (err.status === 409) {
        setError('Time conflict! This appointment overlaps with an existing booking for this doctor or patient.');
      } else if (err.status === 422) {
        setError('Invalid data provided. Please check the fields.');
      } else {
        setError(err.details?.detail || err.message || 'Failed to save appointment');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-start">
          <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {!isEdit && (
        <div className="border-b border-gray-100 pb-6">
          <h3 className="text-sm font-medium text-gray-900 mb-4">Patient Details</h3>
          
          {!selectedPatient ? (
            <div className="flex flex-col gap-3">
              <div className="flex gap-3 items-end">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700">Search Patient</label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <input
                      type="text"
                      value={phoneSearch}
                      onChange={(e) => setPhoneSearch(e.target.value)}
                      placeholder="e.g. 555-1234 or Sagar"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handlePatientSearch();
                        }
                      }}
                      className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-l-md border border-gray-300 focus:ring-[#162723] focus:border-[#162723] sm:text-sm"
                    />
                    <button
                      type="button"
                      onClick={handlePatientSearch}
                      disabled={searchingPatient || !phoneSearch.trim()}
                      className="inline-flex items-center px-4 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                    >
                      <Search size={16} className={searchingPatient ? 'animate-spin' : ''} />
                    </button>
                  </div>
                </div>
              </div>

              {patientLookupResults.length > 0 && (
                <div className="mt-2 border border-gray-200 rounded-md shadow-sm overflow-hidden bg-white max-h-48 overflow-y-auto">
                  <ul className="divide-y divide-gray-200">
                    {patientLookupResults.map((p) => (
                      <li
                        key={p.id}
                        className="p-3 hover:bg-gray-50 cursor-pointer flex justify-between items-center"
                        onClick={() => {
                          setSelectedPatient(p);
                          setPatientId(p.id);
                          setPatientLookupResults([]);
                        }}
                      >
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{p.fullName}</p>
                          <p className="text-xs text-gray-500">{p.phone} • {p.email || 'No email'}</p>
                        </div>
                        <span className="text-[#162723] text-xs font-medium bg-[#162723]/10 px-2 py-1 rounded">Select</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-gray-50 p-4 rounded-lg flex justify-between items-center">
              <div>
                <p className="font-medium text-gray-900">{selectedPatient.fullName}</p>
                <p className="text-sm text-gray-500">{selectedPatient.phone} • {selectedPatient.email || 'No email'}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedPatient(null);
                  setPatientId('');
                }}
                className="text-gray-400 hover:text-red-500"
              >
                <X size={20} />
              </button>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Treatment</label>
          <div className="mt-1">
            <input
              type="text"
              required
              value={treatment}
              onChange={(e) => setTreatment(e.target.value)}
              disabled={isEdit && !isDoctor}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#162723] focus:border-[#162723] sm:text-sm disabled:bg-gray-100 disabled:text-gray-500"
              placeholder={isEdit && !isDoctor ? "Only doctors can modify treatment" : "e.g. Checkup"}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Doctor</label>
          <div className="mt-1">
            <select
              value={doctorId}
              onChange={(e) => setDoctorId(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#162723] focus:border-[#162723] sm:text-sm"
            >
              <option value="">Unassigned</option>
              {(doctors || []).map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="hidden sm:block"></div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Start Time</label>
          <div className="mt-1">
            <input
              type="datetime-local"
              required
              value={startsAt}
              onChange={(e) => setStartsAt(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#162723] focus:border-[#162723] sm:text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">End Time</label>
          <div className="mt-1">
            <input
              type="datetime-local"
              required
              value={endsAt}
              onChange={(e) => setEndsAt(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#162723] focus:border-[#162723] sm:text-sm"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4 space-x-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={loading || (!isEdit && !patientId)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#162723] hover:bg-[#1a302b] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#162723] disabled:opacity-50"
        >
          <Save size={18} className="mr-2" />
          {loading ? 'Saving...' : 'Save Appointment'}
        </button>
      </div>
    </form>
  );
};
