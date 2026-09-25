import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiClient } from '../../../lib/apiClient';
import { Phone, Calendar, Clock, ArrowLeft, CheckCircle2, FileText, Loader2, AlertCircle, Trash2 } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

interface ContactResponse {
  id: string;
  status: string;
  notes: string | null;
  outcome: string | null;
  nextFollowUpAt: string | null;
  createdAt: string;
  patient: { id: string; fullName: string; phone: string } | null;
  lead: { id: string; status: string; desiredTreatment: string | null } | null;
  appointment: { id: string; status: string; startsAt: string } | null;
}

const ALLOWED_TRANSITIONS: Record<string, string[]> = {
  OPEN: ['OPEN', 'IN_PROGRESS', 'CONTACTED', 'COMPLETED', 'CANCELLED'],
  IN_PROGRESS: ['IN_PROGRESS', 'CONTACTED', 'COMPLETED', 'NO_RESPONSE', 'CANCELLED'],
  CONTACTED: ['CONTACTED', 'COMPLETED', 'NO_RESPONSE', 'IN_PROGRESS'],
  COMPLETED: ['COMPLETED'],
  NO_RESPONSE: ['NO_RESPONSE'],
  CANCELLED: ['CANCELLED'],
};

const TERMINAL_STATES = ['COMPLETED', 'NO_RESPONSE', 'CANCELLED'];

export const ContactDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [contact, setContact] = useState<ContactResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const { user } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);

  // Form State
  const [status, setStatus] = useState('');
  const [notes, setNotes] = useState('');
  const [outcome, setOutcome] = useState('');
  const [nextFollowUpAt, setNextFollowUpAt] = useState('');

  useEffect(() => {
    const fetchContact = async () => {
      try {
        setIsLoading(true);
        const res = await apiClient<ContactResponse>(`/api/v1/contacts/${id}`);
        setContact(res);
        setStatus(res.status);
        setNotes(res.notes || '');
        setOutcome(res.outcome || '');
        if (res.nextFollowUpAt) {
          const date = new Date(res.nextFollowUpAt);
          date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
          setNextFollowUpAt(date.toISOString().slice(0, 16));
        }
      } catch (err) {
        setError('Failed to load contact details.');
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchContact();
  }, [id]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);
      setSuccessMsg(null);
      
      const trimmedOutcome = outcome.trim();
      
      // Validation for terminal state outcome
      if (status !== contact?.status && TERMINAL_STATES.includes(status) && !trimmedOutcome) {
        setError('Outcome is required when moving to a terminal state.');
        setIsSaving(false);
        return;
      }

      // 1. Status update if changed
      if (status !== contact?.status) {
        await apiClient(`/api/v1/contacts/${id}/status`, {
          method: 'PATCH',
          body: JSON.stringify({ status, outcome: trimmedOutcome || null })
        });
      }
      
      // 2. Generic update
      const updateData = {
        notes: notes.trim() || null,
        outcome: trimmedOutcome || null,
        nextFollowUpAt: nextFollowUpAt ? new Date(nextFollowUpAt).toISOString() : null
      };

      const res = await apiClient<ContactResponse>(`/api/v1/contacts/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(updateData),
      });

      setContact(res);
      setStatus(res.status);
      if (!res.nextFollowUpAt) setNextFollowUpAt('');
      
      setSuccessMsg('Follow-up updated successfully.');
    } catch (err: any) {
      setError(err.message || 'Failed to update follow-up');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to soft-delete this follow-up?')) {
      return;
    }
    try {
      setIsDeleting(true);
      await apiClient(`/api/v1/contacts/${id}`, { method: 'DELETE' });
      navigate('/staff/contacts');
    } catch (err: any) {
      setError(err.message || 'Failed to delete follow-up');
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-[#162723]" />
      </div>
    );
  }

  if (error && !contact) {
    return (
      <div className="bg-red-50 text-red-600 p-6 rounded-xl flex items-start">
        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 mr-3" />
        <div>
          <h3 className="text-sm font-medium">Error Loading Follow-up</h3>
          <p className="mt-1 text-sm">{error}</p>
          <button onClick={() => navigate('/staff/contacts')} className="mt-4 text-sm font-medium text-red-700 hover:text-red-800">
            ← Back to Contacts
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <button
        onClick={() => navigate('/staff/contacts')}
        className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to List
      </button>

      {successMsg && (
        <div className="bg-green-50 text-green-700 p-4 rounded-lg flex items-center shadow-sm">
          <CheckCircle2 className="w-5 h-5 mr-2" />
          {successMsg}
        </div>
      )}

      {error && contact && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center shadow-sm">
          <AlertCircle className="w-5 h-5 mr-2" />
          {error}
        </div>
      )}

      <div className="bg-white shadow rounded-xl border border-gray-100 overflow-hidden">
        {/* Header section with patient info */}
        <div className="p-6 bg-gradient-to-r from-[#162723]/5 to-transparent border-b border-gray-100">
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 bg-[#162723] rounded-full flex items-center justify-center text-white text-xl font-bold shadow-sm">
              {contact?.patient?.fullName.charAt(0) || 'U'}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#162723]">
                {contact?.patient?.fullName || 'Unknown Patient'}
              </h1>
              <div className="mt-2 flex space-x-6 text-sm text-gray-600">
                <a href={`tel:${contact?.patient?.phone}`} className="flex items-center hover:text-[#162723] transition-colors">
                  <Phone className="w-4 h-4 mr-2" />
                  {contact?.patient?.phone || 'N/A'}
                </a>
              </div>
            </div>
          </div>
          {user?.role === 'DOCTOR' && (
            <div className="mt-4 sm:mt-0 sm:ml-auto self-start">
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex items-center px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
              >
                {isDeleting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Trash2 className="w-4 h-4 mr-2" />}
                Delete Follow-up
              </button>
            </div>
          )}
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column: Form Controls */}
            <div className="space-y-5">
              <h3 className="text-lg font-semibold text-[#162723] border-b pb-2">Follow-up Details</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  disabled={contact ? TERMINAL_STATES.includes(contact.status) : false}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#162723] focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
                >
                  {contact && ALLOWED_TRANSITIONS[contact.status]?.includes('OPEN') && <option value="OPEN">Open</option>}
                  {contact && ALLOWED_TRANSITIONS[contact.status]?.includes('IN_PROGRESS') && <option value="IN_PROGRESS">In Progress</option>}
                  {contact && ALLOWED_TRANSITIONS[contact.status]?.includes('CONTACTED') && <option value="CONTACTED">Contacted</option>}
                  {contact && ALLOWED_TRANSITIONS[contact.status]?.includes('COMPLETED') && <option value="COMPLETED">Completed</option>}
                  {contact && ALLOWED_TRANSITIONS[contact.status]?.includes('NO_RESPONSE') && <option value="NO_RESPONSE">No Response</option>}
                  {contact && ALLOWED_TRANSITIONS[contact.status]?.includes('CANCELLED') && <option value="CANCELLED">Cancelled</option>}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Next Follow-up At</label>
                <input
                  type="datetime-local"
                  value={nextFollowUpAt}
                  onChange={(e) => setNextFollowUpAt(e.target.value)}
                  disabled={TERMINAL_STATES.includes(status)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#162723] focus:border-transparent disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Internal Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#162723] focus:border-transparent"
                  placeholder="Notes from call or message..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Outcome</label>
                <textarea
                  value={outcome}
                  onChange={(e) => setOutcome(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#162723] focus:border-transparent"
                  placeholder="Final resolution..."
                />
              </div>

              <div className="pt-2">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="w-full sm:w-auto bg-[#162723] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[#162723]/90 transition-colors disabled:opacity-50 flex items-center justify-center"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Save Follow-up
                </button>
              </div>
            </div>

            {/* Right Column: References */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-[#162723] border-b pb-2">Related Information</h3>
              
              {contact?.lead && (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <h4 className="text-sm font-bold text-gray-700 mb-2 flex items-center">
                    <FileText className="w-4 h-4 mr-2" /> Initial Lead Enquiry
                  </h4>
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Status</dt>
                      <dd className="font-medium text-gray-900">{contact.lead.status}</dd>
                    </div>
                    {contact.lead.desiredTreatment && (
                      <div className="flex justify-between">
                        <dt className="text-gray-500">Treatment</dt>
                        <dd className="font-medium text-gray-900">{contact.lead.desiredTreatment}</dd>
                      </div>
                    )}
                  </dl>
                </div>
              )}

              {contact?.appointment && (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <h4 className="text-sm font-bold text-gray-700 mb-2 flex items-center">
                    <Calendar className="w-4 h-4 mr-2" /> Related Appointment
                  </h4>
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Status</dt>
                      <dd className="font-medium text-gray-900">{contact.appointment.status}</dd>
                    </div>
                    <div className="flex justify-between items-center">
                      <dt className="text-gray-500">Scheduled For</dt>
                      <dd className="font-medium text-[#162723] flex items-center bg-white px-2 py-1 rounded shadow-sm">
                        <Clock className="w-3 h-3 mr-1" />
                        {new Date(contact.appointment.startsAt).toLocaleString(undefined, {
                          month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                        })}
                      </dd>
                    </div>
                  </dl>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
