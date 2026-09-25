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
      case 'REQUESTED': return 'bg-blue-100 text-blue-800';
      case 'CONFIRMED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      case 'COMPLETED': return 'bg-gray-100 text-gray-800';
      case 'NO_SHOW': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return <div className="p-12 text-center text-gray-500">Loading appointment details...</div>;
  if (!appointment && !isNew) return <div className="p-12 text-center text-red-500">{error || 'Appointment not found'}</div>;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Link to="/staff/appointments" className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors">
            <ArrowLeft size={20} className="text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-[#162723]">
              {isNew ? 'New Appointment' : 'Appointment Details'}
            </h1>
            {!isNew && (
              <p className="text-sm text-gray-500">
                ID: {appointment.id}
              </p>
            )}
          </div>
        </div>
        
        {!isNew && !isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Edit2 size={16} className="mr-2" />
            Edit / Reschedule
          </button>
        )}
      </div>

      {error && !isEditing && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-start">
          <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
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
        <div className="bg-white shadow-sm rounded-xl border border-gray-100 p-6 sm:p-8 space-y-8">
          <div className="flex flex-col sm:flex-row justify-between gap-6 pb-6 border-b border-gray-100">
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-2">Status</h2>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(appointment.status)}`}>
                {appointment.status}
              </span>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleStatusUpdate('CONFIRMED')}
                disabled={statusLoading || appointment.status === 'CONFIRMED' || appointment.status === 'COMPLETED'}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
              >
                <CheckCircle size={16} className="mr-1.5" /> Confirm
              </button>
              
              <button
                onClick={() => handleStatusUpdate('CANCELLED')}
                disabled={statusLoading || appointment.status === 'CANCELLED' || appointment.status === 'COMPLETED'}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 disabled:opacity-50"
              >
                <Ban size={16} className="mr-1.5" /> Cancel
              </button>
              
              {isDoctor && (
                <>
                  <button
                    onClick={() => handleStatusUpdate('COMPLETED')}
                    disabled={statusLoading || appointment.status === 'COMPLETED'}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    <RefreshCw size={16} className="mr-1.5" /> Complete
                  </button>
                  <button
                    onClick={() => handleStatusUpdate('NO_SHOW')}
                    disabled={statusLoading || appointment.status === 'NO_SHOW' || appointment.status === 'COMPLETED'}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    <XCircle size={16} className="mr-1.5" /> No Show
                  </button>
                </>
              )}
            </div>
          </div>

          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Patient ID</dt>
              <dd className="mt-1 text-sm text-gray-900">{appointment.patientId}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Doctor ID</dt>
              <dd className="mt-1 text-sm text-gray-900">{appointment.doctorId || 'Unassigned'}</dd>
            </div>
            
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Treatment</dt>
              <dd className="mt-1 text-sm text-gray-900">{appointment.treatment}</dd>
            </div>

            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Starts At</dt>
              <dd className="mt-1 text-sm text-gray-900">{new Date(appointment.startsAt).toLocaleString()}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Ends At</dt>
              <dd className="mt-1 text-sm text-gray-900">{new Date(appointment.endsAt).toLocaleString()}</dd>
            </div>
            
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Created At</dt>
              <dd className="mt-1 text-sm text-gray-900">{new Date(appointment.createdAt).toLocaleString()}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Updated At</dt>
              <dd className="mt-1 text-sm text-gray-900">{new Date(appointment.updatedAt).toLocaleString()}</dd>
            </div>
          </dl>
        </div>
      )}
    </div>
  );
};
