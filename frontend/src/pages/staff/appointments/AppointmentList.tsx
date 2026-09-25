import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Eye, AlertCircle, Plus } from 'lucide-react';
import { apiClient } from '../../../lib/apiClient';

interface AppointmentListProps {
  isDoctor: boolean;
}

export const AppointmentList: React.FC<AppointmentListProps> = () => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [skip, setSkip] = useState(0);
  const limit = 20;

  // Filters
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

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

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const query = new URLSearchParams({
        skip: skip.toString(),
        limit: limit.toString(),
      });
      
      if (startDate) {
        // Convert to UTC ISO string if it's a valid date
        const start = new Date(startDate);
        if (!isNaN(start.getTime())) {
          query.append('startDate', start.toISOString());
        }
      }
      
      if (endDate) {
        const end = new Date(endDate);
        if (!isNaN(end.getTime())) {
          // Push to end of day
          end.setHours(23, 59, 59, 999);
          query.append('endDate', end.toISOString());
        }
      }
      
      if (doctorId) {
        query.append('doctorId', doctorId);
      }

      const data = await apiClient<any[]>(`/api/v1/appointments?${query.toString()}`);
      setAppointments(data);
    } catch (err: any) {
      setError(err.details?.detail || err.message || 'Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [skip, startDate, endDate, doctorId]);

  const filteredAppointments = statusFilter === 'ALL'
    ? appointments
    : appointments.filter(a => a.status === statusFilter);

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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight">Appointments</h1>
          <p className="text-sm text-zinc-500 mt-1">Manage patient bookings and schedule</p>
        </div>
        
        <Link
          to="/staff/appointments/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-[#E5B22D] via-[#DCA51B] to-[#C49216] text-[#141518] shadow-md hover:shadow-lg transition-all"
        >
          <Plus size={16} />
          New Appointment
        </Link>
      </div>

      <div className="bg-white p-5 rounded-2xl shadow-sm border border-[#E8E2D5] space-y-4 sm:space-y-0 sm:flex sm:gap-4 sm:items-end">
        <div className="flex-1">
          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1.5">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#E2DACB] rounded-xl text-sm text-zinc-900 focus:ring-2 focus:ring-[#DCA51B]/30 focus:border-[#DCA51B] transition-all"
          />
        </div>
        <div className="flex-1">
          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1.5">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#E2DACB] rounded-xl text-sm text-zinc-900 focus:ring-2 focus:ring-[#DCA51B]/30 focus:border-[#DCA51B] transition-all"
          />
        </div>
        <div className="flex-1">
          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1.5">Doctor Filter</label>
          <select
            value={doctorId}
            onChange={(e) => setDoctorId(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#E2DACB] rounded-xl text-sm text-zinc-900 focus:ring-2 focus:ring-[#DCA51B]/30 focus:border-[#DCA51B] transition-all cursor-pointer"
          >
            <option value="">All Doctors</option>
            {doctors.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1.5">Status Filter</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#E2DACB] rounded-xl text-sm text-zinc-900 focus:ring-2 focus:ring-[#DCA51B]/30 focus:border-[#DCA51B] transition-all cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="REQUESTED">Requested</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="COMPLETED">Completed</option>
            <option value="NO_SHOW">No Show</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl flex items-start border border-red-200 text-sm">
          <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {loading && appointments.length === 0 ? (
        <div className="p-12 text-center text-zinc-500">Loading appointments...</div>
      ) : appointments.length === 0 && !error ? (
        <div className="bg-white rounded-2xl shadow-sm border border-[#E8E2D5] p-12 text-center">
          <Calendar size={48} className="mx-auto text-zinc-300 mb-4" />
          <h3 className="text-lg font-semibold text-zinc-900 mb-1">No appointments found</h3>
          <p className="text-sm text-zinc-500">Adjust your filters or create a new appointment.</p>
        </div>
      ) : (
        <div className="bg-white shadow-sm rounded-2xl border border-[#E8E2D5] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[#E8E2D5]">
              <thead className="bg-[#FAF7F2]">
                <tr>
                  <th className="px-6 py-3.5 text-left text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Date & Time</th>
                  <th className="px-6 py-3.5 text-left text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Patient & Doctor</th>
                  <th className="px-6 py-3.5 text-left text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Treatment</th>
                  <th className="px-6 py-3.5 text-left text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3.5 text-right text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-[#E8E2D5]">
                {filteredAppointments.map((apt) => {
                  const start = new Date(apt.startsAt);
                  const end = new Date(apt.endsAt);
                  return (
                    <tr key={apt.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-zinc-900">
                          {start.toLocaleDateString()}
                        </div>
                        <div className="text-xs text-zinc-500 flex items-center mt-0.5">
                          <Clock size={12} className="mr-1 text-zinc-400" />
                          {start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-zinc-900">Patient: <span className="font-mono text-xs text-zinc-600">{apt.patientId.substring(0, 8)}...</span></div>
                        <div className="text-xs text-zinc-500 mt-0.5">Doctor: {apt.doctorId ? <span className="text-[#8C6B14] font-medium">{apt.doctorId.substring(0, 8)}...</span> : 'Unassigned'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-zinc-900">{apt.treatment}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-bold uppercase tracking-wider border ${getStatusColor(apt.status)}`}>
                          {apt.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link to={`/staff/appointments/${apt.id}`} className="text-[#8C6B14] hover:text-[#B8871B] transition-colors p-1.5 inline-block" title="View/Edit">
                          <Eye size={18} />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
                {filteredAppointments.length === 0 && appointments.length > 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-zinc-500 text-sm">
                      No appointments match the current status filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div className="bg-[#FAF7F2]/50 px-4 py-3 flex items-center justify-between border-t border-[#E8E2D5] sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setSkip(Math.max(0, skip - limit))}
                disabled={skip === 0}
                className="relative inline-flex items-center px-3 py-1.5 border border-[#E2DACB] text-xs font-semibold rounded-lg text-zinc-700 bg-white hover:bg-[#FAF7F2] disabled:opacity-40"
              >
                Previous
              </button>
              <button
                onClick={() => setSkip(skip + limit)}
                disabled={appointments.length < limit}
                className="ml-3 relative inline-flex items-center px-3 py-1.5 border border-[#E2DACB] text-xs font-semibold rounded-lg text-zinc-700 bg-white hover:bg-[#FAF7F2] disabled:opacity-40"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-zinc-600">
                  Showing <span className="font-semibold text-zinc-900">{appointments.length > 0 ? skip + 1 : 0}</span> to <span className="font-semibold text-zinc-900">{skip + appointments.length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-xl shadow-sm gap-1" aria-label="Pagination">
                  <button
                    onClick={() => setSkip(Math.max(0, skip - limit))}
                    disabled={skip === 0}
                    className="relative inline-flex items-center px-3 py-1.5 rounded-lg border border-[#E2DACB] bg-white text-xs font-semibold text-zinc-700 hover:bg-[#FAF7F2] disabled:opacity-40 transition-colors"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setSkip(skip + limit)}
                    disabled={appointments.length < limit}
                    className="relative inline-flex items-center px-3 py-1.5 rounded-lg border border-[#E2DACB] bg-white text-xs font-semibold text-zinc-700 hover:bg-[#FAF7F2] disabled:opacity-40 transition-colors"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
