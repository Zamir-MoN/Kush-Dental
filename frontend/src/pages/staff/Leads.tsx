import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Target, Eye, Trash2, ArrowLeft, CheckCircle, Save, AlertCircle } from 'lucide-react';
import { apiClient } from '../../lib/apiClient';
import { useAuth } from '../../context/AuthContext';
import { formatDateTime } from '../../lib/formatters';

type LeadStatus = 'NEW' | 'CONTACTED' | 'CONVERTED' | 'DISMISSED';
type LeadQualification = 'UNREVIEWED' | 'POSITIVE' | 'NEGATIVE';

interface Lead {
    id: string;
    name: string;
    phone: string;
    email: string | null;
    desiredTreatment: string | null;
    status: LeadStatus;
    notes: string | null;
    leadQualification: LeadQualification;
    negativeReason: string | null;
    createdAt: string;
    updatedAt: string;
    existingPatient?: {
        id: string;
        fullName: string;
        phone: string;
        displayId?: string;
    };
}

const statusColors: Record<LeadStatus, string> = {
    NEW: 'bg-blue-100 text-blue-800',
    CONTACTED: 'bg-amber-100 text-amber-800',
    CONVERTED: 'bg-green-100 text-green-800',
    DISMISSED: 'bg-gray-100 text-gray-800',
};

const qualColors: Record<LeadQualification, string> = {
    UNREVIEWED: 'bg-[#F4F4F5] text-[#000000] border border-zinc-300',
    POSITIVE: 'bg-emerald-100 text-emerald-900 border border-emerald-300',
    NEGATIVE: 'bg-rose-100 text-rose-900 border border-rose-300',
};

const LeadList: React.FC = () => {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [skip, setSkip] = useState(0);
    const limit = 20;

    // Current-page filtering state
    const [statusFilter, setStatusFilter] = useState<LeadStatus | 'ALL'>('ALL');
    const [qualFilter, setQualFilter] = useState<LeadQualification | 'ALL'>('ALL');

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

    const filteredLeads = leads.filter(l =>
        (statusFilter === 'ALL' || l.status === statusFilter) &&
        (qualFilter === 'ALL' || l.leadQualification === qualFilter)
    );

    if (loading && leads.length === 0) {
        return <div className="p-8 text-center text-gray-500">Loading leads...</div>;
    }

    return (
        <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-zinc-900 tracking-tight">Leads</h1>
                    <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">Manage incoming patient inquiries</p>
                </div>

                <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 w-full sm:w-auto">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-zinc-500 uppercase tracking-wide">Status:</span>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as any)}
                            className="bg-[#FAF7F2] border border-[#E2DACB] rounded-xl text-xs sm:text-sm font-semibold text-zinc-800 px-3 py-2 outline-none focus:ring-1 focus:ring-[#DCA51B] focus:border-[#DCA51B] cursor-pointer"
                        >
                            <option value="ALL">All</option>
                            <option value="NEW">New</option>
                            <option value="CONTACTED">Contacted</option>
                            <option value="CONVERTED">Converted</option>
                            <option value="DISMISSED">Dismissed</option>
                        </select>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-zinc-500 uppercase tracking-wide">Qual:</span>
                        <select
                            value={qualFilter}
                            onChange={(e) => setQualFilter(e.target.value as any)}
                            className="bg-[#FAF7F2] border border-[#E2DACB] rounded-xl text-xs sm:text-sm font-semibold text-zinc-800 px-3 py-2 outline-none focus:ring-1 focus:ring-[#DCA51B] focus:border-[#DCA51B] cursor-pointer"
                        >
                            <option value="ALL">All</option>
                            <option value="UNREVIEWED">Unreviewed</option>
                            <option value="POSITIVE">Positive</option>
                            <option value="NEGATIVE">Negative</option>
                        </select>
                    </div>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 text-red-700 p-4 rounded-xl flex items-start border border-red-200 text-xs sm:text-sm">
                    <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                    <p>{error}</p>
                </div>
            )}

            {leads.length === 0 && !error ? (
                <div className="bg-white rounded-2xl shadow-xs border border-[#E8E2D5] p-10 sm:p-12 text-center">
                    <Target size={48} className="mx-auto text-zinc-300 mb-4 anim-icon-pulse" />
                    <h3 className="text-base sm:text-lg font-bold text-zinc-900 mb-1">No leads found</h3>
                    <p className="text-xs sm:text-sm text-zinc-500">New leads from the booking form will appear here.</p>
                </div>
            ) : (
                <div className="bg-white shadow-xs rounded-2xl border border-[#E8E2D5] overflow-hidden">
                    {/* Mobile Card Stack (Phone Screens < md) */}
                    <div className="md:hidden divide-y divide-[#E8E2D5]">
                        {filteredLeads.map((lead) => (
                            <div key={lead.id} className="p-3.5 sm:p-4 bg-white hover:bg-[#FAF7F2]/60 active:bg-[#FAF7F2] transition-colors space-y-2.5">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="min-w-0">
                                        <div className="text-sm font-bold text-zinc-900 truncate">{lead.name}</div>
                                        <div className="text-[11px] text-zinc-500 font-medium mt-0.5">
                                            {new Date(lead.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-1.5 shrink-0 justify-end">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${statusColors[lead.status]}`}>
                                            {lead.status}
                                        </span>
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${qualColors[lead.leadQualification || 'UNREVIEWED']}`}>
                                            {lead.leadQualification || 'UNREVIEWED'}
                                        </span>
                                    </div>
                                </div>

                                <div className="text-xs text-zinc-700 font-medium">
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-zinc-500">Treatment:</span>
                                        <span className="font-semibold text-zinc-900">{lead.desiredTreatment || 'General Dental'}</span>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-3 mt-1.5 text-[11px] text-zinc-600">
                                        <a href={`tel:${lead.phone}`} className="text-[#8C6B14] font-bold hover:underline inline-flex items-center gap-1">
                                            <span>📞</span>
                                            <span>{lead.phone}</span>
                                        </a>
                                        {lead.email && <span className="truncate text-zinc-500">✉️ {lead.email}</span>}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                                    <Link 
                                        to={`/staff/leads/${lead.id}`} 
                                        className="text-xs font-bold text-[#8C6B14] hover:text-[#B8871B] inline-flex items-center gap-1.5 py-1 px-3 rounded-lg bg-[#FAF7F2] border border-[#E8E2D5]"
                                    >
                                        <Eye size={14} />
                                        <span>View Details</span>
                                    </Link>
                                    {isDoctor && (
                                        <button 
                                            onClick={() => handleDelete(lead.id)} 
                                            className="text-xs font-bold text-rose-600 hover:text-rose-800 inline-flex items-center gap-1 py-1 px-2.5 rounded-lg bg-rose-50 border border-rose-200 cursor-pointer"
                                        >
                                            <Trash2 size={14} />
                                            <span>Delete</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                        {filteredLeads.length === 0 && leads.length > 0 && (
                            <div className="p-6 text-center text-gray-500 text-xs">
                                No leads match the current filter.
                            </div>
                        )}
                    </div>

                    {/* Desktop Table (Screens >= md) */}
                    <div className="hidden md:block overflow-x-auto custom-scrollbar">
                        <table className="min-w-full divide-y divide-[#E8E2D5]">
                            <thead className="bg-[#FAF7F2]">
                                <tr>
                                    <th className="px-4 sm:px-6 py-3.5 text-left text-[11px] sm:text-xs font-bold text-zinc-600 uppercase tracking-wider">Name</th>
                                    <th className="px-4 sm:px-6 py-3.5 text-left text-[11px] sm:text-xs font-bold text-zinc-600 uppercase tracking-wider">Contact</th>
                                    <th className="px-4 sm:px-6 py-3.5 text-left text-[11px] sm:text-xs font-bold text-zinc-600 uppercase tracking-wider">Treatment</th>
                                    <th className="px-4 sm:px-6 py-3.5 text-left text-[11px] sm:text-xs font-bold text-zinc-600 uppercase tracking-wider">Status</th>
                                    <th className="px-4 sm:px-6 py-3.5 text-left text-[11px] sm:text-xs font-bold text-zinc-600 uppercase tracking-wider">Qual</th>
                                    <th className="px-4 sm:px-6 py-3.5 text-left text-[11px] sm:text-xs font-bold text-zinc-600 uppercase tracking-wider">Date</th>
                                    <th className="px-4 sm:px-6 py-3.5 text-right text-[11px] sm:text-xs font-bold text-zinc-600 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-[#E8E2D5]">
                                {filteredLeads.map((lead) => (
                                    <tr key={lead.id} className="hover:bg-[#FAF7F2]/60 transition-colors group">
                                        <td className="px-4 sm:px-6 py-3.5 sm:py-4 whitespace-nowrap">
                                            <div className="text-xs sm:text-sm font-semibold text-zinc-900">{lead.name}</div>
                                        </td>
                                        <td className="px-4 sm:px-6 py-3.5 sm:py-4 whitespace-nowrap">
                                            <div className="text-xs sm:text-sm text-zinc-800">{lead.phone}</div>
                                            <div className="text-[11px] sm:text-xs text-zinc-500">{lead.email || '-'}</div>
                                        </td>
                                        <td className="px-4 sm:px-6 py-3.5 sm:py-4 whitespace-nowrap">
                                            <div className="text-xs sm:text-sm text-zinc-800">{lead.desiredTreatment || '-'}</div>
                                        </td>
                                        <td className="px-4 sm:px-6 py-3.5 sm:py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] sm:text-xs font-bold ${statusColors[lead.status]}`}>
                                                {lead.status}
                                            </span>
                                        </td>
                                        <td className="px-4 sm:px-6 py-3.5 sm:py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] sm:text-xs font-bold ${qualColors[lead.leadQualification || 'UNREVIEWED']}`}>
                                                {lead.leadQualification || 'UNREVIEWED'}
                                            </span>
                                        </td>
                                        <td className="px-4 sm:px-6 py-3.5 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-zinc-500">
                                            {new Date(lead.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 sm:px-6 py-3.5 sm:py-4 whitespace-nowrap text-right text-sm font-medium space-x-2 sm:space-x-3">
                                            <Link to={`/staff/leads/${lead.id}`} className="text-[#8C6B14] hover:text-[#B8871B] inline-block transition-transform hover:scale-125" title="View/Edit">
                                                <Eye size={17} />
                                            </Link>
                                            {isDoctor && (
                                                <button onClick={() => handleDelete(lead.id)} className="text-rose-600 hover:text-rose-800 inline-block transition-transform hover:scale-125 hover:rotate-6 cursor-pointer" title="Delete">
                                                    <Trash2 size={17} />
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

    const [showNegModal, setShowNegModal] = useState(false);
    const [negReasonInput, setNegReasonInput] = useState('');


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

    const handleQualify = async (qual: LeadQualification, reason: string | null = null) => {
        try {
            setSaving(true);
            setError(null);
            setSuccessMsg(null);
            const data = await apiClient<Lead>(`/api/v1/leads/${id}`, {
                method: 'PATCH',
                data: {
                    leadQualification: qual,
                    negativeReason: reason,
                }
            });
            setLead(data);
            setSuccessMsg(`Lead marked as ${qual}`);
            setShowNegModal(false);
            setNegReasonInput('');
            setTimeout(() => setSuccessMsg(null), 3000);
        } catch (err: any) {
            if (err.status === 403) {
                setError('You do not have permission to perform this action.');
            } else {
                setError(err.details?.detail || err.message || `Failed to mark lead as ${qual}`);
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
            const endpoint = `/api/v1/leads/${id}/convert`;
            const data = await apiClient<Lead>(endpoint, { method: 'POST' });
            setLead(data);
            setFormData(prev => ({ ...prev, status: 'CONVERTED' }));
            setSuccessMsg('Lead successfully converted to Patient!');
        } catch (err: any) {
            if (err.status === 409) {
                const detail = err.details?.detail;
                if (detail && detail.code === "PATIENT_ALREADY_EXISTS") {
                    const existing = detail.existingPatient;
                    setError(
                        <div className="space-y-1">
                            <p className="font-bold text-zinc-900">Patient already exists</p>
                            <p>Name: <span className="font-semibold">{existing.fullName}</span></p>
                            <p>Phone: <span className="font-semibold">{existing.phone}</span></p>
                            <p>Patient ID: <span className="font-semibold">{existing.displayId || existing.id}</span></p>
                            <div className="pt-2">
                                <Link to={`/staff/patients/${existing.id}`} className="text-[#8C6B14] hover:text-[#B8871B] underline font-bold" target="_blank" rel="noopener noreferrer">
                                    View Existing Patient
                                </Link>
                            </div>
                        </div> as any
                    );
                } else {
                    setError('Failed to create patient due to database conflict.');
                }
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
        <div className="space-y-4 sm:space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                <Link to="/staff/leads" className="p-2 sm:p-2.5 bg-white rounded-xl border border-[#E8E2D5] shadow-xs hover:bg-[#FAF7F2] transition-all hover:scale-105 active:scale-95 group">
                    <ArrowLeft size={18} className="text-zinc-700 transition-transform group-hover:-translate-x-0.5" />
                </Link>
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">Lead Details</h1>
                    <p className="text-xs sm:text-sm text-zinc-500">Created: {formatDateTime(lead.createdAt)}</p>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 text-red-700 p-3.5 sm:p-4 rounded-xl flex items-start border border-red-200 text-xs sm:text-sm">
                    <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                    <p>{error}</p>
                </div>
            )}

            {successMsg && (
                <div className="bg-emerald-50 text-emerald-700 p-3.5 sm:p-4 rounded-xl flex items-center border border-emerald-200 text-xs sm:text-sm">
                    <CheckCircle className="w-5 h-5 mr-2 text-emerald-600 animate-bounce" />
                    <p>{successMsg}</p>
                </div>
            )}

            <form onSubmit={handleSave} className="bg-white shadow-xs rounded-2xl border border-[#E8E2D5] p-4 sm:p-8 space-y-5 sm:space-y-6">

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-4 border-b border-[#E8E2D5]">
                    <div>
                        <label className="block text-xs font-bold text-zinc-600 uppercase tracking-wide mb-1">Status</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            disabled={lead.status === 'CONVERTED'}
                            className={`rounded-xl border border-[#E2DACB] bg-[#FAF7F2] px-3 py-2 text-xs sm:text-sm font-semibold text-zinc-900 focus:ring-1 focus:ring-[#DCA51B] focus:border-[#DCA51B] ${lead.status === 'CONVERTED' ? 'bg-zinc-100 cursor-not-allowed text-zinc-500' : 'cursor-pointer'
                                }`}
                        >
                            <option value="NEW">New</option>
                            <option value="CONTACTED">Contacted</option>
                            <option value="CONVERTED">Converted</option>
                            <option value="DISMISSED">Dismissed</option>
                        </select>
                    </div>

                    {lead.status !== 'CONVERTED' && !lead.existingPatient && (
                        <button
                            type="button"
                            onClick={() => handleConvert()}
                            disabled={converting || saving}
                            className="group inline-flex items-center justify-center px-4 py-2 sm:py-2.5 border border-transparent shadow-xs text-xs sm:text-sm font-bold rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 transition-all active:scale-95 cursor-pointer"
                        >
                            <CheckCircle size={16} className="mr-2 transition-transform duration-300 group-hover:scale-125" />
                            {converting ? 'Converting...' : 'Convert to Patient'}
                        </button>
                    )}
                </div>

                {lead.existingPatient && lead.status !== 'CONVERTED' && (
                    <div className="bg-[#FAF7F2] p-4 sm:p-6 rounded-xl border border-[#DCA51B] mb-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex flex-col space-y-1">
                            <div className="flex items-center gap-2 text-[#DCA51B] font-bold">
                                <CheckCircle size={18} />
                                <span className="uppercase tracking-wide text-xs">ALREADY A PATIENT</span>
                            </div>
                            <p className="text-zinc-900 font-bold text-lg">{lead.existingPatient.fullName}</p>
                            <p className="text-zinc-500 text-sm">{lead.existingPatient.phone}</p>
                            <p className="text-zinc-600 text-sm font-semibold">Patient ID: <span className="text-zinc-900">{lead.existingPatient.displayId || lead.existingPatient.id}</span></p>
                        </div>
                        <Link 
                            to={`/staff/patients/${lead.existingPatient.id}`} 
                            className="inline-flex items-center px-4 py-2 border border-[#DCA51B] text-[#DCA51B] bg-white hover:bg-[#FAF7F2] text-sm font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap shadow-sm"
                        >
                            <Eye size={16} className="mr-2" />
                            VIEW PATIENT
                        </Link>
                    </div>
                )}

                {/* Qualification Section */}
                <div className="bg-[#FAF7F2] p-4 sm:p-6 rounded-xl border border-[#E8E2D5] mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h3 className="text-sm font-bold text-zinc-900 mb-1">Qualification</h3>
                            <p className="text-xs text-zinc-500">Current: <span className={`font-bold px-2 py-0.5 rounded-md ${qualColors[lead.leadQualification || 'UNREVIEWED']}`}>{lead.leadQualification || 'UNREVIEWED'}</span></p>
                            {lead.leadQualification === 'NEGATIVE' && lead.negativeReason && (
                                <div className="mt-2 text-xs text-red-700 bg-red-50 p-2 rounded-md border border-red-100">
                                    <span className="font-bold">Reason:</span> {lead.negativeReason}
                                </div>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => handleQualify('POSITIVE')}
                                className="px-3 py-1.5 bg-green-100 text-green-700 hover:bg-green-200 border border-green-200 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                            >
                                Mark Positive
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowNegModal(true)}
                                className="px-3 py-1.5 bg-red-100 text-red-700 hover:bg-red-200 border border-red-200 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                            >
                                Mark Negative
                            </button>
                            {lead.leadQualification !== 'UNREVIEWED' && (
                                <button
                                    type="button"
                                    onClick={() => handleQualify('UNREVIEWED')}
                                    className="px-3 py-1.5 bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                                >
                                    Reset
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-y-4 sm:gap-y-6 gap-x-4 sm:grid-cols-2">
                    <div>
                        <label className="block text-xs font-bold text-zinc-600 uppercase tracking-wide mb-1">Full Name</label>
                        <div className="mt-1">
                            <input
                                type="text"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                className="block w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#E2DACB] rounded-xl text-zinc-900 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#DCA51B] focus:border-[#DCA51B]"
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
                                className="block w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#E2DACB] rounded-xl text-zinc-900 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#DCA51B] focus:border-[#DCA51B]"
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
                                className="block w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#E2DACB] rounded-xl text-zinc-900 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#DCA51B] focus:border-[#DCA51B]"
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
                                className="block w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#E2DACB] rounded-xl text-zinc-900 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#DCA51B] focus:border-[#DCA51B]"
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
                                className="block w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#E2DACB] rounded-xl text-zinc-900 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#DCA51B] focus:border-[#DCA51B]"
                                placeholder="Add notes about this lead..."
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-[#E8E2D5]">
                    <button
                        type="submit"
                        disabled={saving || converting}
                        className="group inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-[#E5B22D] via-[#DCA51B] to-[#C49216] hover:brightness-105 text-[#141518] font-bold rounded-xl shadow-xs focus:outline-none disabled:opacity-50 transition-all active:scale-95 cursor-pointer"
                    >
                        <Save size={16} className="mr-2 transition-transform duration-300 group-hover:scale-125" />
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>

            {showNegModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
                        <h3 className="text-lg font-bold text-zinc-900 mb-2">Mark Lead as Negative</h3>
                        <p className="text-sm text-zinc-500 mb-4">Please provide a reason why this lead is unlikely to convert. This is required for analytics.</p>
                        <textarea
                            className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E2DACB] rounded-xl text-sm outline-none focus:ring-1 focus:ring-[#DCA51B] mb-4"
                            rows={3}
                            placeholder="e.g. Too expensive, out of service area..."
                            value={negReasonInput}
                            onChange={e => setNegReasonInput(e.target.value)}
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setShowNegModal(false)}
                                className="px-4 py-2 text-sm font-bold text-zinc-600 bg-gray-100 hover:bg-gray-200 rounded-xl cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                disabled={!negReasonInput.trim()}
                                onClick={() => handleQualify('NEGATIVE', negReasonInput.trim())}
                                className="px-4 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl disabled:opacity-50 cursor-pointer"
                            >
                                Confirm Negative
                            </button>
                        </div>
                    </div>
                </div>
            )}
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
