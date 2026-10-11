import React, { useState, useEffect } from 'react';
import { Link, useParams, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit2, AlertCircle, CheckCircle, Ban, RefreshCw, XCircle, Clock, CheckCircle2 } from 'lucide-react';
import { apiClient } from '../../../lib/apiClient';
import { AppointmentForm } from './AppointmentForm';
import { formatDate, formatTime, formatDateTime } from '../../../lib/formatters';

interface AppointmentDetailProps {
  isDoctor: boolean;
}

export const AppointmentDetail: React.FC<AppointmentDetailProps> = ({ isDoctor }) => {
  const { id } = useParams<{ id: string }>();
  const isNew = id === 'new';
  const location = useLocation();
  const navigate = useNavigate();

  const [appointment, setAppointment] = useState<any>(null);
  const [loading, setLoading] = useState(!isNew);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>((location.state as any)?.successMsg || null);

  useEffect(() => {
    if ((location.state as any)?.successMsg) {
      window.history.replaceState({}, document.title);
    }
  }, [location]);
  const [isEditing, setIsEditing] = useState(isNew);
  const [statusLoading, setStatusLoading] = useState(false);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [isAssigning, setIsAssigning] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  useEffect(() => {
    if (isNew) return;
    const fetchAppointment = async () => {
      try {
        setLoading(true);
        const data = await apiClient<any>(`/api/v1/appointments/${id}`);
        setAppointment(data);
      } catch (err: any) {
        setError(err.details?.detail || err.message || 'Failed to load appointment');
      } finally {
        setLoading(false);
      }
    };
    
    const fetchDoctors = async () => {
      try {
        const data = await apiClient<any[]>('/api/v1/appointments/doctors');
        setDoctors(data);
      } catch (err) {
        console.error('Failed to load doctors');
      }
    };

    fetchAppointment();
    fetchDoctors();
  }, [id, isNew]);

  const handleAssignDoctor = async () => {
    if (!selectedDoctorId) return;
    try {
      setStatusLoading(true);
      setError(null);
      const data = await apiClient<any>(`/api/v1/appointments/${id}`, {
        method: 'PATCH',
        data: { doctorId: selectedDoctorId }
      });
      setAppointment(data);
      setIsAssigning(false);
    } catch (err: any) {
      setError(err.details?.detail || err.message || 'Failed to assign doctor');
    } finally {
      setStatusLoading(false);
    }
  };

  const handleStatusUpdate = async (status: string) => {
    if (!window.confirm(`Are you sure you want to change the status to ${status}?`)) return;
    try {
      setStatusLoading(true);
      setError(null);
      const data = await apiClient<any>(`/api/v1/appointments/${id}/status`, {
        method: 'PATCH',
        data: { status }
      });
      setAppointment(data);
    } catch (err: any) {
      if (err.status === 403) {
        setError('You do not have permission to perform this status transition.');
      } else {
        setError(err.details?.detail || err.message || 'Failed to update status');
      }
    } finally {
      setStatusLoading(false);
    }
  };

  const submitCancel = async () => {
    const reason = cancelReason.trim();
    if (!reason) return;
    try {
      setStatusLoading(true);
      setError(null);
      const data = await apiClient<any>(`/api/v1/appointments/${id}/status`, {
        method: 'PATCH',
        data: { status: 'CANCELLED', cancellationReason: reason }
      });
      setAppointment(data);
      setShowCancelModal(false);
      setCancelReason('');
    } catch (err: any) {
      if (err.status === 403) {
        setError('You do not have permission to perform this status transition.');
      } else {
        setError(err.details?.detail || err.message || 'Failed to cancel appointment');
      }
    } finally {
      setStatusLoading(false);
    }
  };

  const [isAddingNote, setIsAddingNote] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [noteLoading, setNoteLoading] = useState(false);

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    try {
      setNoteLoading(true);
      setError(null);
      const data = await apiClient<any>(`/api/v1/appointments/${id}/notes`, {
        method: 'POST',
        data: { note: newNote.trim() }
      });
      setAppointment((prev: any) => ({
        ...prev,
        notes: [data, ...(prev.notes || [])]
      }));
      setNewNote('');
      setIsAddingNote(false);
      setSuccessMsg('Internal note saved successfully');
    } catch (err: any) {
      setError(err.details?.detail || err.message || 'Failed to add internal note');
    } finally {
      setNoteLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'REQUESTED': return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
      case 'CONFIRMED': return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'CANCELLED': return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
      case 'COMPLETED': return 'bg-zinc-800 text-zinc-300 border-zinc-700';
      case 'NO_SHOW': return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      default: return 'bg-zinc-800 text-zinc-300 border-zinc-700';
    }
  };

  if (loading) return <div className="p-12 text-center text-zinc-400">Loading appointment details...</div>;
  if (!appointment && !isNew) return <div className="p-12 text-center text-rose-400">{error || 'Appointment not found'}</div>;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Link to="/staff/appointments" className="p-2.5 bg-[#EBF0F7] rounded-2xl shadow-[3px_3px_7px_#D1D9E6,-3px_-3px_7px_#FFFFFF] border border-white/80 text-slate-700 hover:text-[#7C3AED] hover:shadow-[5px_5px_12px_#C5D0E0,-5px_-5px_12px_#FFFFFF] transition-all">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
              {isNew ? 'New Appointment' : 'Appointment Details'}
            </h1>
            {!isNew && (
              <p className="text-xs font-mono text-slate-500 mt-0.5">
                ID: {appointment.id}
              </p>
            )}
          </div>
        </div>
        
        {!isNew && !isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center px-4 py-2 border border-white/80 rounded-2xl shadow-[3px_3px_7px_#D1D9E6,-3px_-3px_7px_#FFFFFF] text-xs font-bold uppercase tracking-wider text-slate-700 bg-[#EBF0F7] hover:bg-white hover:text-[#7C3AED] hover:shadow-[5px_5px_12px_#C5D0E0,-5px_-5px_12px_#FFFFFF] transition-all cursor-pointer"
          >
            <Edit2 size={14} className="mr-2 text-[#DC95FF]" />
            Edit / Reschedule
          </button>
        )}
      </div>

      {successMsg && !isEditing && (
        <div className="bg-emerald-950/40 text-emerald-300 p-4 rounded-xl flex items-start border border-emerald-500/30 text-sm mb-4">
          <CheckCircle2 className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5 text-emerald-400" />
          <p>{successMsg}</p>
        </div>
      )}

      {error && !isEditing && (
        <div className="bg-rose-950/40 text-rose-300 p-4 rounded-xl flex items-start border border-rose-500/30 text-sm mb-4">
          <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5 text-rose-400" />
          <p>{error}</p>
        </div>
      )}

      {isEditing || isNew ? (
        <AppointmentForm 
          isDoctor={isDoctor}
          appointment={appointment}
          onSuccess={(apt) => {
            if (isNew) {
               navigate(`/staff/appointments`, { state: { successMsg: 'Appointment booked successfully' } });
               return;
            }
            setAppointment(apt);
            setIsEditing(false);
          }}
          onCancel={!isNew ? () => setIsEditing(false) : undefined}
        />
      ) : (
        <div className="bg-[#13151A] shadow-sm rounded-2xl border border-[#22252E] p-6 sm:p-8 space-y-8">
          <div className="flex flex-col sm:flex-row justify-between gap-6 pb-6 border-b border-[#22252E]">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Status</h2>
              <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border ${getStatusColor(appointment.status)}`}>
                {appointment.status}
              </span>
              {appointment.status === 'CANCELLED' && appointment.cancellationReason && (
                <div className="mt-4 p-3 bg-rose-950/20 border border-rose-500/20 rounded-xl">
                  <h3 className="text-[10px] font-bold uppercase tracking-wider text-rose-500/70 mb-1">Cancellation Reason</h3>
                  <p className="text-sm text-zinc-300">{appointment.cancellationReason}</p>
                </div>
              )}
            </div>
            
            <div className="flex flex-wrap gap-2.5">
              {appointment.status === 'REQUESTED' && (
                <>
                  <button
                    onClick={() => handleStatusUpdate('CONFIRMED')}
                    disabled={statusLoading}
                    className="inline-flex items-center px-4 py-2.5 border border-emerald-400 text-xs font-bold uppercase tracking-wider rounded-xl shadow-[3px_3px_7px_#D1D9E6,-3px_-3px_7px_#FFFFFF] text-emerald-800 bg-[#ECFDF5] hover:bg-[#D1FAE5] hover:shadow-[5px_5px_12px_#C5D0E0,-5px_-5px_12px_#FFFFFF] hover:-translate-y-0.5 active:shadow-[inset_2px_2px_4px_#A7F3D0] disabled:opacity-40 transition-all cursor-pointer"
                  >
                    <CheckCircle size={15} className="mr-1.5 text-emerald-600" /> Confirm
                  </button>
                  <button
                    onClick={() => { setError(null); setShowCancelModal(true); }}
                    disabled={statusLoading}
                    className="inline-flex items-center px-4 py-2.5 border border-rose-400 text-xs font-bold uppercase tracking-wider rounded-xl shadow-[3px_3px_7px_#D1D9E6,-3px_-3px_7px_#FFFFFF] text-rose-800 bg-[#FFF1F2] hover:bg-[#FFE4E6] hover:shadow-[5px_5px_12px_#C5D0E0,-5px_-5px_12px_#FFFFFF] hover:-translate-y-0.5 active:shadow-[inset_2px_2px_4px_#FECDD3] disabled:opacity-40 transition-all cursor-pointer"
                  >
                    <Ban size={15} className="mr-1.5 text-rose-600" /> Cancel
                  </button>
                </>
              )}

              {appointment.status === 'CONFIRMED' && (
                <button
                  onClick={() => navigate('/staff/appointments/new', { state: { prefill: appointment } })}
                  className="inline-flex items-center px-4 py-2.5 border border-[#DC95FF]/60 text-xs font-bold uppercase tracking-wider rounded-xl shadow-[3px_3px_8px_rgba(220,149,255,0.4),-3px_-3px_8px_#FFFFFF] text-[#3B0764] bg-gradient-to-r from-[#DC95FF] to-[#FFF4BF] hover:shadow-[5px_5px_14px_rgba(220,149,255,0.5),-5px_-5px_14px_#FFFFFF] hover:-translate-y-0.5 transition-all cursor-pointer"
                >
                  <Clock size={15} className="mr-1.5 text-[#581C87]" /> Schedule Next Appointment
                </button>
              )}
              
              {isDoctor && appointment.status !== 'COMPLETED' && appointment.status !== 'CANCELLED' && (
                <>
                  <button
                    onClick={() => handleStatusUpdate('COMPLETED')}
                    disabled={statusLoading}
                    className="inline-flex items-center px-4 py-2.5 border border-blue-300 text-xs font-bold uppercase tracking-wider rounded-xl shadow-[3px_3px_7px_#D1D9E6,-3px_-3px_7px_#FFFFFF] text-blue-800 bg-[#EFF6FF] hover:bg-[#DBEAFE] hover:shadow-[5px_5px_12px_#C5D0E0,-5px_-5px_12px_#FFFFFF] disabled:opacity-40 transition-all cursor-pointer"
                  >
                    <RefreshCw size={15} className="mr-1.5 text-blue-600" /> Complete
                  </button>
                  <button
                    onClick={() => handleStatusUpdate('NO_SHOW')}
                    disabled={statusLoading}
                    className="inline-flex items-center px-4 py-2.5 border border-amber-300 text-xs font-bold uppercase tracking-wider rounded-xl shadow-[3px_3px_7px_#D1D9E6,-3px_-3px_7px_#FFFFFF] text-amber-800 bg-[#FFFBEB] hover:bg-[#FEF3C7] hover:shadow-[5px_5px_12px_#C5D0E0,-5px_-5px_12px_#FFFFFF] disabled:opacity-40 transition-all cursor-pointer"
                  >
                    <XCircle size={15} className="mr-1.5 text-amber-600" /> No Show
                  </button>
                </>
              )}
            </div>
          </div>

          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            
            <div className="sm:col-span-2 p-3.5 rounded-xl bg-[#16181E] border border-[#22252E] flex items-center gap-3">
              <div className="bg-[#DCA51B]/10 p-2 rounded-lg">
                <Clock size={20} className="text-[#DCA51B]" />
              </div>
              <div>
                <dt className="text-xs font-bold uppercase tracking-wider text-zinc-400">Requested At</dt>
                <dd className="mt-0.5 text-sm font-semibold text-zinc-100">{formatDateTime(appointment.createdAt)}</dd>
              </div>
            </div>

            <div className="sm:col-span-2 p-4 rounded-xl bg-[#16181E] border border-[#22252E]">
              <dt className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">Appointment</dt>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <div className="text-[10px] uppercase text-zinc-500 font-bold mb-1">Date</div>
                  <dd className="text-sm font-semibold text-zinc-100">{formatDate(appointment.startsAt)}</dd>
                </div>
                <div>
                  <div className="text-[10px] uppercase text-zinc-500 font-bold mb-1">Requested Time</div>
                  <dd className="text-sm font-semibold text-zinc-100">{formatTime(appointment.startsAt)}</dd>
                </div>
                <div>
                  <div className="text-[10px] uppercase text-zinc-500 font-bold mb-1">Treatment</div>
                  <dd className="text-sm font-semibold text-white">{appointment.treatment}</dd>
                </div>
              </div>
            </div>

            {appointment.patientId ? (
              <div className="sm:col-span-1 p-4 rounded-xl bg-[#16181E] border border-[#22252E]">
                <dt className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Patient</dt>
                <dd className="text-sm font-semibold text-zinc-100 mb-1">
                  {appointment.patient?.fullName || 'Unknown'}
                </dd>
                <div className="text-xs font-mono text-zinc-400">
                  ID: {appointment.patient?.displayId || appointment.patientId.substring(0,8)}
                </div>
              </div>
            ) : (
              <div className="sm:col-span-1 p-4 rounded-xl bg-[#2A1D0B] border border-[#DCA51B]/40">
                <dt className="text-xs font-bold uppercase tracking-wider text-[#DCA51B] mb-2">Guest Request (No Patient)</dt>
                <dd className="text-sm font-semibold text-zinc-100 break-words mb-2">
                  {appointment.guestName || 'Unknown'}
                </dd>
                <div className="text-xs text-zinc-300 space-y-1">
                  <div><span className="text-[#DCA51B]/70">Phone:</span> {appointment.guestPhone || 'N/A'}</div>
                  <div><span className="text-[#DCA51B]/70">Email:</span> {appointment.guestEmail || 'N/A'}</div>
                </div>
              </div>
            )}

            <div className="sm:col-span-1 p-4 rounded-xl bg-[#16181E] border border-[#22252E]">
              <div className="flex justify-between items-start mb-2">
                <dt className="text-xs font-bold uppercase tracking-wider text-zinc-400">Doctor</dt>
                {!appointment.doctorId && (
                  <button 
                    onClick={() => setIsAssigning(!isAssigning)}
                    className="text-[10px] uppercase font-bold text-[#DCA51B] hover:text-[#F5C242] transition-colors cursor-pointer"
                  >
                    {isAssigning ? 'Cancel' : 'Assign Doctor'}
                  </button>
                )}
              </div>
              
              <dd className="text-sm font-semibold text-zinc-100">
                {appointment.doctorId ? (
                   doctors.find(d => d.id === appointment.doctorId)?.name || `ID: ${appointment.doctorId.substring(0,8)}`
                ) : (
                  <span className="text-zinc-500 italic">Unassigned</span>
                )}
              </dd>
              
              {isAssigning && !appointment.doctorId && (
                <div className="mt-4 space-y-3">
                  <select
                    value={selectedDoctorId}
                    onChange={(e) => setSelectedDoctorId(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0D0E12] border border-[#2A2E3B] rounded-lg text-sm text-zinc-200 focus:ring-1 focus:ring-[#DCA51B]/50 transition-all cursor-pointer font-medium"
                  >
                    <option value="">Select Doctor</option>
                    {doctors.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                  <button
                    onClick={handleAssignDoctor}
                    disabled={!selectedDoctorId || statusLoading}
                    className="w-full px-3 py-2 bg-[#DCA51B] text-black text-xs font-bold uppercase rounded-lg hover:bg-[#F5C242] disabled:opacity-50 transition-all cursor-pointer"
                  >
                    {statusLoading ? 'Saving...' : 'Save Assignment'}
                  </button>
                </div>
              )}
            </div>
            
          </dl>

          {appointment.status === 'COMPLETED' && (
            <div className="pt-6 border-t border-[#22252E] space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Internal Notes</h3>
              
              <div className="space-y-3">
                {appointment.notes && appointment.notes.length > 0 ? (
                  appointment.notes.map((note: any) => (
                    <div key={note.id} className="p-4 bg-[#0A0B0E] border border-[#22252E] rounded-xl">
                      <div className="flex justify-between items-start mb-2">
                        <div className="text-[10px] uppercase font-bold text-zinc-500">
                          {formatDateTime(note.createdAt)} — {note.author?.email || 'Unknown'} {note.author?.role ? `(${note.author.role})` : ''}
                        </div>
                      </div>
                      <p className="text-sm text-zinc-300 whitespace-pre-wrap">{note.note}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-zinc-500 italic">No internal notes yet.</p>
                )}
              </div>

              {!isAddingNote ? (
                <button
                  onClick={() => setIsAddingNote(true)}
                  className="inline-flex items-center px-4 py-2 border border-[#2A2E3B] rounded-xl shadow-xs text-xs font-bold uppercase tracking-wider text-zinc-200 bg-[#181A22] hover:bg-[#20232E] hover:border-[#DCA51B]/50 transition-colors cursor-pointer"
                >
                  + Add Internal Note
                </button>
              ) : (
                <div className="p-4 bg-[#16181E] border border-[#2A2E3B] rounded-xl space-y-3 mt-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Add Internal Note</h4>
                  <textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Enter internal clinical notes, recommendations, or findings here..."
                    className="w-full bg-[#0D0E12] border border-[#2A2E3B] rounded-xl p-3 text-sm text-white focus:border-[#DCA51B]/50 focus:ring-1 focus:ring-[#DCA51B]/50 outline-none resize-none"
                    rows={4}
                  />
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => { setIsAddingNote(false); setNewNote(''); }}
                      disabled={noteLoading}
                      className="px-4 py-2 rounded-xl text-sm font-bold text-zinc-400 hover:text-white hover:bg-[#181A22] transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddNote}
                      disabled={!newNote.trim() || noteLoading}
                      className="px-4 py-2 rounded-xl text-sm font-bold bg-[#DCA51B] hover:bg-[#F5C242] text-black disabled:opacity-50 transition-colors cursor-pointer"
                    >
                      {noteLoading ? 'Saving...' : 'Save Note'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-[#13151A] border border-[#22252E] rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-2">Cancel Appointment</h3>
            <p className="text-sm text-zinc-400 mb-4">Are you sure you want to cancel this appointment?</p>
            
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
              Cancellation Reason *
            </label>
            <textarea
              value={cancelReason}
              onChange={e => setCancelReason(e.target.value)}
              className="w-full bg-[#181A22] border border-[#2A2E3B] rounded-xl p-3 text-sm text-white mb-2 focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/50 outline-none resize-none"
              rows={3}
              placeholder="e.g. Patient requested cancellation"
            />
            
            {error && (
               <div className="text-rose-400 text-sm mb-4 bg-rose-950/30 p-3 rounded-lg border border-rose-500/30">
                 {error}
               </div>
            )}
            {!error && <div className="mb-4" />}
            
            <div className="flex justify-end gap-3">
              <button
                onClick={() => { setShowCancelModal(false); setCancelReason(''); setError(null); }}
                className="px-4 py-2 rounded-xl text-sm font-bold text-zinc-400 hover:text-white hover:bg-[#181A22] transition-colors cursor-pointer"
                disabled={statusLoading}
              >
                Keep Appointment
              </button>
              <button
                onClick={submitCancel}
                disabled={!cancelReason.trim() || statusLoading}
                className="px-4 py-2 rounded-xl text-sm font-bold bg-rose-600 hover:bg-rose-500 text-white disabled:opacity-50 transition-colors cursor-pointer"
              >
                {statusLoading ? 'Cancelling...' : 'Cancel Appointment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
