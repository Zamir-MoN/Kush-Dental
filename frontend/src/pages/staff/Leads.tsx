import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Target, Eye, Trash2, ArrowLeft, CheckCircle, Save, AlertCircle } from 'lucide-react';
import { apiClient } from '../../lib/apiClient';
import { useAuth } from '../../context/AuthContext';

type LeadStatus = 'NEW' | 'CONTACTED' | 'CONVERTED' | 'DISMISSED';

interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  desiredTreatment: string | null;
  status: LeadStatus;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

const statusColors: Record<LeadStatus, string> = {
  NEW: 'bg-blue-100 text-blue-800',
  CONTACTED: 'bg-amber-100 text-amber-800',
  CONVERTED: 'bg-green-100 text-green-800',
  DISMISSED: 'bg-gray-100 text-gray-800',
};

const LeadList: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [skip, setSkip] = useState(0);
  const limit = 20;

  // Current-page filtering state
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'ALL'>('ALL');

  const { user } = useAuth();
  const isDoctor = user?.role === 'DOCTOR';

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const data = await apiClient<Lead[]>(`/api/v1/leads?skip=${skip}&limit=${limit}`, { method: 'GET' });
      setLeads(data);
      setError(null);
    } catch (err: any) {
      setError(err.details?.detail || err.message || 'Failed to load leads');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [skip]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this lead?')) return;
    try {
      await apiClient(`/api/v1/leads/${id}`, { method: 'DELETE' });
      setLeads(leads.filter(l => l.id !== id));
    } catch (err: any) {
      alert(err.details?.detail || err.message || 'Failed to delete lead');
    }
  };

  const filteredLeads = statusFilter === 'ALL' 
    ? leads 
    : leads.filter(l => l.status === statusFilter);

  if (loading && leads.length === 0) {
    return <div className="p-8 text-center text-gray-500">Loading leads...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Leads</h1>
          <p className="text-sm text-zinc-500 mt-0.5">Manage incoming patient inquiries</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold text-zinc-500 uppercase tracking-wide">Filter:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-[#FAF7F2] border border-[#E2DACB] rounded-xl text-sm font-semibold text-zinc-800 px-3 py-2 outline-none focus:ring-1 focus:ring-[#DCA51B] focus:border-[#DCA51B] cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="NEW">New</option>
            <option value="CONTACTED">Contacted</option>
            <option value="CONVERTED">Converted</option>
            <option value="DISMISSED">Dismissed</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-start">
          <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {leads.length === 0 && !error ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <Target size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No leads found</h3>
          <p className="text-gray-500">New leads from the booking form will appear here.</p>
        </div>
      ) : (
        <div className="bg-white shadow-xs rounded-2xl border border-[#E8E2D5] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[#E8E2D5]">
              <thead className="bg-[#FAF7F2]">
                <tr>
                  <th className="px-6 py-3.5 text-left text-xs font-bold text-zinc-600 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3.5 text-left text-xs font-bold text-zinc-600 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3.5 text-left text-xs font-bold text-zinc-600 uppercase tracking-wider">Treatment</th>
                  <th className="px-6 py-3.5 text-left text-xs font-bold text-zinc-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3.5 text-left text-xs font-bold text-zinc-600 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3.5 text-right text-xs font-bold text-zinc-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-[#E8E2D5]">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{lead.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{lead.phone}</div>
                      <div className="text-xs text-gray-500">{lead.email || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{lead.desiredTreatment || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[lead.status]}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                      <Link to={`/staff/leads/${lead.id}`} className="text-blue-600 hover:text-blue-900 inline-block" title="View/Edit">
                        <Eye size={18} />
                      </Link>
                      {isDoctor && (
                        <button onClick={() => handleDelete(lead.id)} className="text-red-600 hover:text-red-900" title="Delete">
                          <Trash2 size={18} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {filteredLeads.length === 0 && leads.length > 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      No leads match the current filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setSkip(Math.max(0, skip - limit))}
                disabled={skip === 0}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setSkip(skip + limit)}
                disabled={leads.length < limit}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{leads.length > 0 ? skip + 1 : 0}</span> to <span className="font-medium">{skip + leads.length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => setSkip(Math.max(0, skip - limit))}
                    disabled={skip === 0}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setSkip(skip + limit)}
                    disabled={leads.length < limit}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
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

const LeadDetail: React.FC<{ id: string }> = ({ id }) => {
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [converting, setConverting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);


  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    desiredTreatment: '',
    status: 'NEW' as LeadStatus,
    notes: '',
  });

  useEffect(() => {
    const fetchLead = async () => {
      try {
        setLoading(true);
        const data = await apiClient<Lead>(`/api/v1/leads/${id}`, { method: 'GET' });
        setLead(data);
        setFormData({
          name: data.name,
          phone: data.phone,
          email: data.email || '',
          desiredTreatment: data.desiredTreatment || '',
          status: data.status,
          notes: data.notes || '',
        });
      } catch (err: any) {
        setError(err.details?.detail || err.message || 'Failed to load lead details');
      } finally {
        setLoading(false);
      }
    };
    fetchLead();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);
      setSuccessMsg(null);
      const data = await apiClient<Lead>(`/api/v1/leads/${id}`, {
        method: 'PATCH',
        data: {
          name: formData.name,
          phone: formData.phone,
          email: formData.email || null,
          desiredTreatment: formData.desiredTreatment || null,
          status: formData.status,
          notes: formData.notes || null,
        }
      });
      setLead(data);
      setSuccessMsg('Lead updated successfully');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      if (err.status === 403) {
        setError('You do not have permission to perform this action.');
      } else if (err.status === 422) {
        setError('Invalid data provided. Please check the fields.');
      } else {
        setError(err.details?.detail || err.message || 'Failed to update lead');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleConvert = async () => {
    if (!window.confirm('Are you sure you want to convert this lead into a Patient?')) return;
    try {
      setConverting(true);
      setError(null);
      setSuccessMsg(null);
      const data = await apiClient<Lead>(`/api/v1/leads/${id}/convert`, { method: 'POST' });
      setLead(data);
      setFormData(prev => ({ ...prev, status: 'CONVERTED' }));
      setSuccessMsg('Lead successfully converted to Patient!');
    } catch (err: any) {
      if (err.status === 409) {
        setError('A patient with this phone number already exists.');
      } else if (err.status === 403) {
        setError('You do not have permission to perform this action.');
      } else {
        setError(err.details?.detail || err.message || 'Failed to convert lead');
      }
    } finally {
      setConverting(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading lead details...</div>;
  if (!lead) return <div className="p-8 text-center text-red-500">{error || 'Lead not found'}</div>;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center space-x-4 mb-6">
        <Link to="/staff/leads" className="p-2 bg-white rounded-xl border border-[#E8E2D5] shadow-xs hover:bg-[#FAF7F2] transition-colors">
          <ArrowLeft size={18} className="text-zinc-700" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Lead Details</h1>
          <p className="text-sm text-zinc-500">Created: {new Date(lead.createdAt).toLocaleString()}</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl flex items-start border border-red-200">
          <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {successMsg && (
        <div className="bg-emerald-50 text-emerald-700 p-4 rounded-xl flex items-center border border-emerald-200">
          <CheckCircle className="w-5 h-5 mr-2 text-emerald-600" />
          <p>{successMsg}</p>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white shadow-xs rounded-2xl border border-[#E8E2D5] p-6 sm:p-8 space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E2D5]">
          <div>
            <label className="block text-xs font-bold text-zinc-600 uppercase tracking-wide mb-1">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              disabled={lead.status === 'CONVERTED'}
              className={`rounded-xl border border-[#E2DACB] bg-[#FAF7F2] px-3 py-2 text-sm font-semibold text-zinc-900 focus:ring-1 focus:ring-[#DCA51B] focus:border-[#DCA51B] ${
                lead.status === 'CONVERTED' ? 'bg-zinc-100 cursor-not-allowed text-zinc-500' : ''
              }`}
            >
              <option value="NEW">New</option>
              <option value="CONTACTED">Contacted</option>
              <option value="CONVERTED">Converted</option>
              <option value="DISMISSED">Dismissed</option>
            </select>
          </div>
          
          {lead.status !== 'CONVERTED' && (
            <button
              type="button"
              onClick={handleConvert}
              disabled={converting || saving}
              className="inline-flex items-center px-4 py-2.5 border border-transparent shadow-xs text-sm font-bold rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 cursor-pointer"
            >
              <CheckCircle size={16} className="mr-2" />
              {converting ? 'Converting...' : 'Convert to Patient'}
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-bold text-zinc-600 uppercase tracking-wide mb-1">Full Name</label>
            <div className="mt-1">
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="block w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#E2DACB] rounded-xl text-zinc-900 text-sm focus:outline-none focus:ring-1 focus:ring-[#DCA51B] focus:border-[#DCA51B]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-600 uppercase tracking-wide mb-1">Phone</label>
            <div className="mt-1">
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                className="block w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#E2DACB] rounded-xl text-zinc-900 text-sm focus:outline-none focus:ring-1 focus:ring-[#DCA51B] focus:border-[#DCA51B]"
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-zinc-600 uppercase tracking-wide mb-1">Email Address</label>
            <div className="mt-1">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="block w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#E2DACB] rounded-xl text-zinc-900 text-sm focus:outline-none focus:ring-1 focus:ring-[#DCA51B] focus:border-[#DCA51B]"
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-zinc-600 uppercase tracking-wide mb-1">Desired Treatment</label>
            <div className="mt-1">
              <input
                type="text"
                name="desiredTreatment"
                value={formData.desiredTreatment}
                onChange={handleChange}
                className="block w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#E2DACB] rounded-xl text-zinc-900 text-sm focus:outline-none focus:ring-1 focus:ring-[#DCA51B] focus:border-[#DCA51B]"
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-zinc-600 uppercase tracking-wide mb-1">Internal Notes</label>
            <div className="mt-1">
              <textarea
                name="notes"
                rows={4}
                value={formData.notes}
                onChange={handleChange}
                className="block w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#E2DACB] rounded-xl text-zinc-900 text-sm focus:outline-none focus:ring-1 focus:ring-[#DCA51B] focus:border-[#DCA51B]"
                placeholder="Add notes about this lead..."
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-[#E8E2D5]">
          <button
            type="submit"
            disabled={saving || converting}
            className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-[#E5B22D] via-[#DCA51B] to-[#C49216] hover:brightness-105 text-[#141518] font-bold rounded-xl shadow-xs focus:outline-none disabled:opacity-50 cursor-pointer"
          >
            <Save size={16} className="mr-2" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export const Leads = () => {
  const { id } = useParams<{ id?: string }>();
  
  if (id) {
    return <LeadDetail id={id} />;
  }
  
  return <LeadList />;
};
