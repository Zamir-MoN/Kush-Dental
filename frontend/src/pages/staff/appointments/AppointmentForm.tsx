import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { Search, Save, AlertCircle, X } from 'lucide-react';
import { apiClient } from '../../../lib/apiClient';
import { CLINIC_HOURS, formatTime12Hour } from '../../../lib/clinicHours';

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
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const isEdit = !!appointment;
  const prefill = (location.state as any)?.prefill;
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form fields
  const [patientId, setPatientId] = useState(appointment?.patientId || searchParams.get('patientId') || prefill?.patientId || '');
  const [doctorId, setDoctorId] = useState(appointment?.doctorId || prefill?.doctorId || '');
  const [treatment, setTreatment] = useState(appointment?.treatment || prefill?.treatment || '');
  
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

  const [appointmentDate, setAppointmentDate] = useState(() => {
    if (appointment?.startsAt) {
      return new Date(appointment.startsAt).toLocaleDateString('en-CA');
    }
    return new Date().toLocaleDateString('en-CA');
  });
  const [dayAppointments, setDayAppointments] = useState<any[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  useEffect(() => {
    const fetchDayApts = async () => {
      if (!appointmentDate) return;
      try {
        setLoadingSlots(true);
        const start = new Date(`${appointmentDate}T00:00:00`).toISOString();
        const end = new Date(`${appointmentDate}T23:59:59`).toISOString();
        const res = await apiClient<any>(`/api/v1/appointments?startDate=${start}&endDate=${end}&limit=100`);
        setDayAppointments(res?.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingSlots(false);
      }
    };
    fetchDayApts();
  }, [appointmentDate]);

  const getDaySlots = (dateStr: string) => {
    const date = new Date(`${dateStr}T12:00:00`); 
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
    const clinicDay = CLINIC_HOURS.find(d => d.day === dayName);
    if (!clinicDay || clinicDay.isConcierge || !clinicDay.open || !clinicDay.close) return [];
    
    const slots = [];
    let current = new Date(`${dateStr}T${clinicDay.open}:00`);
    const end = new Date(`${dateStr}T${clinicDay.close}:00`);
    
    while (current < end) {
        const slotEnd = new Date(current.getTime() + 30 * 60000);
        slots.push({
            start: new Date(current),
            end: slotEnd,
        });
        current = slotEnd;
    }
    return slots;
  };

  // Lookups
  const [phoneSearch, setPhoneSearch] = useState('');
  const [searchingPatient, setSearchingPatient] = useState(false);
  const [patientLookupResults, setPatientLookupResults] = useState<any[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<any>(appointment?.patient || prefill?.patient || null);
  
  // New Patient Mode
  type PatientMode = 'EXISTING' | 'NEW';
  const [patientMode, setPatientMode] = useState<PatientMode>('EXISTING');
  const [newPatientName, setNewPatientName] = useState('');
  const [newPatientPhone, setNewPatientPhone] = useState('');
  const [newPatientEmail, setNewPatientEmail] = useState('');

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

  useEffect(() => {
    const timer = setTimeout(() => {
      if (phoneSearch.trim().length >= 2) {
        handlePatientSearch(phoneSearch.trim());
      } else {
        setPatientLookupResults([]);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [phoneSearch]);

  const handlePatientSearch = async (query: string) => {
    if (!query) return;
    try {
      setSearchingPatient(true);
      setError(null);
      const res = await apiClient<any>(`/api/v1/patients/search?q=${encodeURIComponent(query)}`);
      const results = res.data || [];
      setPatientLookupResults(results);
      if (results.length === 0) {
         setError('No patient found with that name or phone number.');
      }
    } catch (err: any) {
      setPatientLookupResults([]);
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
        if (patientMode === 'EXISTING') {
          if (!patientId) {
            setError("Please select a patient.");
            setLoading(false);
            return;
          }
          payload.patientId = patientId;
        } else {
          if (!newPatientName.trim() || !newPatientPhone.trim()) {
            setError("Please provide the patient's name and phone number.");
            setLoading(false);
            return;
          }
          payload.patient = {
            fullName: newPatientName.trim(),
            phone: newPatientPhone.trim(),
            email: newPatientEmail.trim() || undefined
          };
        }
        res = await apiClient<any>('/api/v1/appointments', {
          method: 'POST',
          data: payload
        });
      }
      
      if (onSuccess) {
        onSuccess(res);
      } else if (!isEdit) {
        navigate(`/staff/appointments`, { state: { successMsg: 'Appointment booked successfully' } });
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

  const highlightMatch = (text: string, query: string) => {
    if (!query || !text) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="bg-[#DCA51B]/40 text-zinc-900 rounded-sm px-0.5">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-[#E8E2D5] space-y-6">
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl flex items-start border border-red-200 text-sm">
          <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {!isEdit && (
        <div className="border-b border-[#E8E2D5] pb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-600">Patient Details</h3>
            <div className="flex bg-[#FAF7F2] border border-[#E2DACB] rounded-lg p-1">
              <button
                type="button"
                onClick={() => setPatientMode('EXISTING')}
                className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md transition-colors ${
                  patientMode === 'EXISTING' ? 'bg-white shadow-sm text-zinc-900 border border-[#E2DACB]' : 'text-zinc-500 hover:text-zinc-700'
                }`}
              >
                Existing Patient
              </button>
              <button
                type="button"
                onClick={() => setPatientMode('NEW')}
                className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md transition-colors ${
                  patientMode === 'NEW' ? 'bg-white shadow-sm text-zinc-900 border border-[#E2DACB]' : 'text-zinc-500 hover:text-zinc-700'
                }`}
              >
                New Patient
              </button>
            </div>
          </div>
          
          {patientMode === 'EXISTING' ? (
            !selectedPatient ? (
              <div className="flex flex-col gap-3">
                <div className="flex gap-3 items-end">
                  <div className="flex-1">
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1.5">Search Patient (Name or Number)</label>
                    <div className="flex rounded-xl shadow-sm">
                      <input
                        type="text"
                        value={phoneSearch}
                        onChange={(e) => setPhoneSearch(e.target.value)}
                        placeholder="Search by Name or Phone Number"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handlePatientSearch(phoneSearch.trim());
                          }
                        }}
                        className="flex-1 min-w-0 block w-full px-3.5 py-2.5 rounded-none rounded-l-xl bg-[#FAF7F2] border border-[#E2DACB] text-zinc-900 focus:ring-2 focus:ring-[#DCA51B]/30 focus:border-[#DCA51B] text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => handlePatientSearch(phoneSearch.trim())}
                        disabled={searchingPatient || !phoneSearch.trim()}
                        className="inline-flex items-center px-4 py-2.5 border border-l-0 border-[#E2DACB] rounded-r-xl bg-[#FAF7F2] text-sm font-medium text-zinc-600 hover:bg-[#FAF3E0] disabled:opacity-50 transition-colors"
                      >
                        <Search size={16} className={searchingPatient ? 'animate-spin text-[#DCA51B]' : 'text-zinc-500'} />
                      </button>
                    </div>
                  </div>
                </div>

                {patientLookupResults.length > 0 && (
                  <div className="mt-2 border border-[#E8E2D5] rounded-xl shadow-sm overflow-hidden bg-white max-h-48 overflow-y-auto">
                    <ul className="divide-y divide-[#E8E2D5]">
                      {patientLookupResults.map((p) => (
                        <li
                          key={p.id}
                          className="p-3 hover:bg-[#FAF7F2]/60 cursor-pointer flex justify-between items-center transition-colors"
                          onClick={() => {
                            setSelectedPatient(p);
                            setPatientId(p.id);
                            setPatientLookupResults([]);
                          }}
                        >
                          <div>
                            <p className="font-semibold text-zinc-900 text-sm">{highlightMatch(p.fullName, phoneSearch)}</p>
                            <p className="text-xs text-zinc-500">ID: {p.displayId || p.id.split('-')[0]} • {highlightMatch(p.phone, phoneSearch)} • {p.email || 'No email'}</p>
                          </div>
                          <span className="text-[#8C6B14] text-xs font-bold bg-[#FAF3E0] border border-[#DCA51B]/30 px-2.5 py-1 rounded-lg">Select</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-[#FAF7F2] border border-[#E2DACB] p-4 rounded-xl flex justify-between items-center">
                <div>
                  <p className="font-bold text-zinc-900">{selectedPatient.fullName}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">ID: {selectedPatient.displayId || selectedPatient.id.substring(0,8)} • {selectedPatient.phone} • {selectedPatient.email || 'No email'}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPatient(null);
                    setPatientId('');
                  }}
                  className="text-zinc-400 hover:text-red-500 p-1 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            )
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1.5">Full Name *</label>
                <input
                  type="text"
                  required
                  value={newPatientName}
                  onChange={(e) => setNewPatientName(e.target.value)}
                  className="block w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#E2DACB] rounded-xl text-zinc-900 focus:ring-2 focus:ring-[#DCA51B]/30 focus:border-[#DCA51B] text-sm transition-all"
                  placeholder="e.g. Rahul Kumar"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1.5">Phone Number *</label>
                <input
                  type="text"
                  required
                  value={newPatientPhone}
                  onChange={(e) => setNewPatientPhone(e.target.value)}
                  className="block w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#E2DACB] rounded-xl text-zinc-900 focus:ring-2 focus:ring-[#DCA51B]/30 focus:border-[#DCA51B] text-sm transition-all"
                  placeholder="e.g. 9876543210"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1.5">Email Address (Optional)</label>
                <input
                  type="email"
                  value={newPatientEmail}
                  onChange={(e) => setNewPatientEmail(e.target.value)}
                  className="block w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#E2DACB] rounded-xl text-zinc-900 focus:ring-2 focus:ring-[#DCA51B]/30 focus:border-[#DCA51B] text-sm transition-all"
                  placeholder="e.g. rahul@example.com"
                />
              </div>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1.5">Treatment</label>
          <div>
            <input
              type="text"
              required
              value={treatment}
              onChange={(e) => setTreatment(e.target.value)}
              disabled={isEdit && !isDoctor}
              className="block w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#E2DACB] rounded-xl text-zinc-900 focus:ring-2 focus:ring-[#DCA51B]/30 focus:border-[#DCA51B] text-sm disabled:bg-zinc-100 disabled:text-zinc-400 transition-all"
              placeholder={isEdit && !isDoctor ? "Only doctors can modify treatment" : "e.g. Checkup"}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1.5">Doctor</label>
          <div>
            <select
              value={doctorId}
              onChange={(e) => setDoctorId(e.target.value)}
              className="block w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#E2DACB] rounded-xl text-zinc-900 focus:ring-2 focus:ring-[#DCA51B]/30 focus:border-[#DCA51B] text-sm transition-all cursor-pointer"
            >
              <option value="">Unassigned</option>
              {Array.isArray(doctors) && doctors.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="sm:col-span-2 border-t border-[#E8E2D5] pt-6 mt-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <h3 className="text-sm font-bold text-zinc-900">Available Time Slots</h3>
              <p className="text-xs text-zinc-500">Select a time to automatically set the appointment duration.</p>
            </div>
            <div>
              <input
                type="date"
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
                className="block w-full sm:w-auto px-3.5 py-2 bg-[#FAF7F2] border border-[#E2DACB] rounded-xl text-zinc-900 focus:ring-2 focus:ring-[#DCA51B]/30 focus:border-[#DCA51B] text-sm font-medium"
              />
            </div>
          </div>
          
          <div className="mb-6">
            {loadingSlots ? (
              <div className="py-8 text-center text-xs text-zinc-500">Loading available slots...</div>
            ) : getDaySlots(appointmentDate).length === 0 ? (
              <div className="py-8 text-center text-xs text-zinc-500 bg-[#FAF7F2] rounded-xl border border-[#E2DACB]">No slots available for this date (Clinic closed or Concierge only).</div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {getDaySlots(appointmentDate).map((slot, i) => {
                   const overlaps = dayAppointments.filter(apt => {
                      if (['CANCELLED', 'COMPLETED', 'NO_SHOW'].includes(apt.status)) return false;
                      if (isEdit && apt.id === appointment?.id) return false;
                      const aStart = new Date(apt.startsAt);
                      const aEnd = new Date(apt.endsAt);
                      return aStart < slot.end && aEnd > slot.start;
                   });
                   
                   const doctorOverlap = overlaps.find(a => a.doctorId === doctorId);
                   const patientOverlap = patientId ? overlaps.find(a => a.patientId === patientId) : null;
                   const unassignedOverlap = overlaps.find(a => !a.doctorId);
                   
                   let state = 'AVAILABLE';
                   let label = 'AVAILABLE';
                   let sublabel = '';
                   let blockSelect = false;
                   
                   if (doctorOverlap) {
                       if (doctorOverlap.status === 'CONFIRMED') {
                           state = 'BOOKED'; label = 'BOOKED'; blockSelect = true;
                           sublabel = doctorOverlap.patient?.fullName || doctorOverlap.guestName || 'Patient';
                       } else {
                           state = 'PENDING'; label = 'PENDING';
                           sublabel = doctorOverlap.patient?.fullName || doctorOverlap.guestName || 'Request';
                       }
                   } else if (patientOverlap) {
                       state = 'BOOKED'; label = 'BOOKED'; blockSelect = true; sublabel = 'This Patient';
                   } else if (unassignedOverlap) {
                       state = 'PENDING'; label = 'PENDING'; sublabel = unassignedOverlap.guestName || 'Request';
                   }
                   
                   const isSelected = startsAt && new Date(startsAt).getTime() === slot.start.getTime();
                   if (isSelected) {
                       state = 'SELECTED'; label = 'SELECTED';
                   }
                   
                   return (
                      <button 
                         key={i} type="button" disabled={blockSelect}
                         onClick={() => {
                            const currentStart = startsAt ? new Date(startsAt) : null;
                            const currentEnd = endsAt ? new Date(endsAt) : null;
                            let duration = 30 * 60000;
                            if (currentStart && currentEnd && currentEnd > currentStart) {
                               duration = currentEnd.getTime() - currentStart.getTime();
                            }
                            const tzOffset = slot.start.getTimezoneOffset() * 60000;
                            const localStart = new Date(slot.start.getTime() - tzOffset).toISOString().slice(0, 16);
                            setStartsAt(localStart);
                            const newEnd = new Date(slot.start.getTime() + duration);
                            const localEnd = new Date(newEnd.getTime() - tzOffset).toISOString().slice(0, 16);
                            setEndsAt(localEnd);
                         }}
                         className={`p-2 rounded-xl border flex flex-col items-center justify-center text-xs transition-all cursor-pointer ${
                             state === 'AVAILABLE' ? 'border-[#E2DACB] bg-[#FAF7F2] hover:border-[#DCA51B] hover:bg-[#DCA51B]/10 text-zinc-700' :
                             state === 'BOOKED' ? 'border-red-200 bg-red-50 text-red-700 cursor-not-allowed opacity-70' :
                             state === 'PENDING' ? 'border-amber-300 bg-amber-50 text-amber-800 hover:border-amber-400' :
                             state === 'SELECTED' ? 'border-[#DCA51B] bg-[#DCA51B] text-[#141518] font-bold shadow-sm' : ''
                         }`}
                      >
                         <span className="font-bold">{formatTime12Hour(slot.start.toTimeString().slice(0,5))}</span>
                         <span className="text-[9px] uppercase tracking-wider mt-0.5 font-bold">{label}</span>
                         {sublabel && <span className="text-[9px] truncate w-full text-center opacity-80 mt-0.5">{sublabel}</span>}
                      </button>
                   )
                })}
              </div>
            )}
            
            <div className="flex items-center gap-4 mt-4 text-[10px] uppercase tracking-wider font-bold text-zinc-500">
              <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-[#FAF7F2] border border-[#E2DACB]"></span> Available</div>
              <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-amber-50 border border-amber-300"></span> Pending</div>
              <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-red-50 border border-red-200"></span> Booked</div>
              <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-[#DCA51B] border border-[#DCA51B]"></span> Selected</div>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1.5">Custom Start Time</label>
          <div>
            <input
              type="datetime-local"
              required
              value={startsAt}
              onChange={(e) => {
                 setStartsAt(e.target.value);
                 const d = new Date(e.target.value);
                 if (!isNaN(d.getTime())) setAppointmentDate(d.toLocaleDateString('en-CA'));
              }}
              className="block w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#E2DACB] rounded-xl text-zinc-900 focus:ring-2 focus:ring-[#DCA51B]/30 focus:border-[#DCA51B] text-sm transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1.5">Custom End Time</label>
          <div>
            <input
              type="datetime-local"
              required
              value={endsAt}
              onChange={(e) => setEndsAt(e.target.value)}
              className="block w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#E2DACB] rounded-xl text-zinc-900 focus:ring-2 focus:ring-[#DCA51B]/30 focus:border-[#DCA51B] text-sm transition-all"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4 space-x-3 border-t border-[#E8E2D5]">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 border border-[#E2DACB] rounded-xl text-xs font-bold uppercase tracking-wider text-zinc-700 bg-white hover:bg-[#FAF7F2] transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={loading || (!isEdit && patientMode === 'EXISTING' && !patientId) || (!isEdit && patientMode === 'NEW' && (!newPatientName.trim() || !newPatientPhone.trim()))}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-[#E5B22D] via-[#DCA51B] to-[#C49216] text-[#141518] shadow-md hover:shadow-lg transition-all disabled:opacity-50"
        >
          <Save size={16} />
          {loading ? 'Saving...' : 'Save Appointment'}
        </button>
      </div>
    </form>
  );
};
