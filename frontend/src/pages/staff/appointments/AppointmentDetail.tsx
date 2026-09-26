import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Edit2, AlertCircle, CheckCircle, Ban, RefreshCw, XCircle } from 'lucide-react';
import { apiClient } from '../../../lib/apiClient';
import { AppointmentForm } from './AppointmentForm';

interface AppointmentDetailProps {
  isDoctor: boolean;
}

export const AppointmentDetail: React.FC<AppointmentDetailProps> = ({ isDoctor }) => {
  const { id } = useParams<{ id: string }>();
  const isNew = id === 'new';

  const [appointment, setAppointment] = useState<any>(null);
  const [loading, setLoading] = useState(!isNew);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(isNew);
  const [statusLoading, setStatusLoading] = useState(false);

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
    fetchAppointment();
  }, [id, isNew]);

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
          <Link to="/staff/appointments" className="p-2.5 bg-[#181A22] rounded-xl shadow-xs border border-[#2A2E3B] text-zinc-300 hover:text-white hover:border-[#DCA51B]/40 transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-zinc-100 tracking-tight">
              {isNew ? 'New Appointment' : 'Appointment Details'}
            </h1>
            {!isNew && (
              <p className="text-xs font-mono text-zinc-400 mt-0.5">
                ID: {appointment.id}
              </p>
            )}
          </div>
        </div>
        
        {!isNew && !isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center px-4 py-2 border border-[#2A2E3B] rounded-xl shadow-xs text-xs font-bold uppercase tracking-wider text-zinc-200 bg-[#181A22] hover:bg-[#20232E] hover:border-[#DCA51B]/50 transition-colors cursor-pointer"
          >
            <Edit2 size={14} className="mr-2 text-[#F5C242]" />
            Edit / Reschedule
          </button>
        )}
      </div>

      {error && !isEditing && (
        <div className="bg-rose-950/40 text-rose-300 p-4 rounded-xl flex items-start border border-rose-500/30 text-sm">
          <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5 text-rose-400" />
          <p>{error}</p>
        </div>
      )}

      {isEditing || isNew ? (
        <AppointmentForm 
          isDoctor={isDoctor}
          appointment={appointment}
          onSuccess={(apt) => {
            if (isNew) return; // Router will handle the redirect
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
            </div>
            
            <div className="flex flex-wrap gap-2.5">
              <button
                onClick={() => handleStatusUpdate('CONFIRMED')}
                disabled={statusLoading || appointment.status === 'CONFIRMED' || appointment.status === 'COMPLETED'}
                className="inline-flex items-center px-3.5 py-2 border border-emerald-500/40 text-xs font-bold uppercase tracking-wider rounded-xl shadow-xs text-emerald-300 bg-emerald-950/40 hover:bg-emerald-900/60 disabled:opacity-40 transition-all cursor-pointer"
              >
                <CheckCircle size={15} className="mr-1.5 text-emerald-400" /> Confirm
              </button>
              
              <button
                onClick={() => handleStatusUpdate('CANCELLED')}
                disabled={statusLoading || appointment.status === 'CANCELLED' || appointment.status === 'COMPLETED'}
                className="inline-flex items-center px-3.5 py-2 border border-rose-500/40 text-xs font-bold uppercase tracking-wider rounded-xl shadow-xs text-rose-300 bg-rose-950/40 hover:bg-rose-900/60 disabled:opacity-40 transition-all cursor-pointer"
              >
                <Ban size={15} className="mr-1.5 text-rose-400" /> Cancel
              </button>
              
              {isDoctor && (
                <>
                  <button
                    onClick={() => handleStatusUpdate('COMPLETED')}
                    disabled={statusLoading || appointment.status === 'COMPLETED'}
                    className="inline-flex items-center px-3.5 py-2 border border-[#2A2E3B] text-xs font-bold uppercase tracking-wider rounded-xl shadow-xs text-zinc-300 bg-[#181A22] hover:bg-[#222530] hover:text-white hover:border-blue-500/40 disabled:opacity-40 transition-all cursor-pointer"
                  >
                    <RefreshCw size={15} className="mr-1.5 text-blue-400" /> Complete
                  </button>
                  <button
                    onClick={() => handleStatusUpdate('NO_SHOW')}
                    disabled={statusLoading || appointment.status === 'NO_SHOW' || appointment.status === 'COMPLETED'}
                    className="inline-flex items-center px-3.5 py-2 border border-[#2A2E3B] text-xs font-bold uppercase tracking-wider rounded-xl shadow-xs text-zinc-300 bg-[#181A22] hover:bg-[#222530] hover:text-white hover:border-amber-500/40 disabled:opacity-40 transition-all cursor-pointer"
                  >
                    <XCircle size={15} className="mr-1.5 text-amber-400" /> No Show
                  </button>
                </>
              )}
            </div>
          </div>

          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-1 p-3.5 rounded-xl bg-[#16181E] border border-[#22252E]">
              <dt className="text-xs font-bold uppercase tracking-wider text-zinc-400">Patient ID</dt>
              <dd className="mt-1 text-sm font-semibold text-zinc-100 font-mono select-all break-all">{appointment.patientId}</dd>
            </div>
            <div className="sm:col-span-1 p-3.5 rounded-xl bg-[#16181E] border border-[#22252E]">
              <dt className="text-xs font-bold uppercase tracking-wider text-zinc-400">Doctor ID</dt>
              <dd className="mt-1 text-sm font-semibold text-zinc-100 font-mono select-all break-all">{appointment.doctorId || 'Unassigned'}</dd>
            </div>
            
            <div className="sm:col-span-2 p-3.5 rounded-xl bg-[#16181E] border border-[#22252E]">
              <dt className="text-xs font-bold uppercase tracking-wider text-zinc-400">Treatment</dt>
              <dd className="mt-1 text-base font-semibold text-white">{appointment.treatment}</dd>
            </div>

            <div className="sm:col-span-1 p-3.5 rounded-xl bg-[#16181E] border border-[#22252E]">
              <dt className="text-xs font-bold uppercase tracking-wider text-zinc-400">Starts At</dt>
              <dd className="mt-1 text-sm font-semibold text-zinc-100">{new Date(appointment.startsAt).toLocaleString()}</dd>
            </div>
            <div className="sm:col-span-1 p-3.5 rounded-xl bg-[#16181E] border border-[#22252E]">
              <dt className="text-xs font-bold uppercase tracking-wider text-zinc-400">Ends At</dt>
              <dd className="mt-1 text-sm font-semibold text-zinc-100">{new Date(appointment.endsAt).toLocaleString()}</dd>
            </div>
            
            <div className="sm:col-span-1 p-3.5 rounded-xl bg-[#16181E] border border-[#22252E]">
              <dt className="text-xs font-bold uppercase tracking-wider text-zinc-400">Created At</dt>
              <dd className="mt-1 text-sm font-medium text-zinc-300">{new Date(appointment.createdAt).toLocaleString()}</dd>
            </div>
            <div className="sm:col-span-1 p-3.5 rounded-xl bg-[#16181E] border border-[#22252E]">
              <dt className="text-xs font-bold uppercase tracking-wider text-zinc-400">Updated At</dt>
              <dd className="mt-1 text-sm font-medium text-zinc-300">{new Date(appointment.updatedAt).toLocaleString()}</dd>
            </div>
          </dl>
        </div>
      )}
    </div>
  );
};
