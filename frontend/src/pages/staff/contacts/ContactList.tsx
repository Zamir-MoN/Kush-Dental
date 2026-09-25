import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { apiClient } from '../../../lib/apiClient';
import { Phone, Calendar, User, Search, Filter, Loader2, AlertCircle } from 'lucide-react';

interface ContactResponse {
  id: string;
  status: string;
  nextFollowUpAt: string | null;
  createdAt: string;
  patient: { fullName: string; phone: string } | null;
  lead: { status: string; desiredTreatment: string | null } | null;
  appointment: { status: string; startsAt: string } | null;
}

interface ContactsData {
  total: number;
  skip: number;
  limit: number;
  data: ContactResponse[];
}

export const ContactList = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [data, setData] = useState<ContactsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const q = searchParams.get('q') || '';
  const status = searchParams.get('status') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = 20;

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setIsLoading(true);
        const skip = (page - 1) * limit;
        const query = new URLSearchParams();
        query.append('skip', skip.toString());
        query.append('limit', limit.toString());
        if (q) query.append('q', q);
        if (status) query.append('status', status);

        const res = await apiClient<ContactsData>(`/api/v1/contacts?${query.toString()}`);
        setData(res);
        setError(null);
      } catch (err) {
        setError('Failed to load contacts');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchContacts();
  }, [q, status, page]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchParams(prev => {
      if (e.target.value) prev.set('q', e.target.value);
      else prev.delete('q');
      prev.set('page', '1');
      return prev;
    });
  };

  const handleStatusFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSearchParams(prev => {
      if (e.target.value) prev.set('status', e.target.value);
      else prev.delete('status');
      prev.set('page', '1');
      return prev;
    });
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'OPEN': return 'bg-amber-100 text-amber-800';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800';
      case 'CONTACTED': return 'bg-purple-100 text-purple-800';
      case 'COMPLETED': return 'bg-emerald-100 text-emerald-800';
      case 'NO_RESPONSE': return 'bg-gray-100 text-gray-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 max-w-6xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-zinc-900 tracking-tight">Follow-ups</h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">Manage patient contacts and enquiries</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xs border border-[#E8E2D5] p-3.5 sm:p-4">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="flex-1 relative group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-[#DCA51B] transition-colors" />
            <input
              type="text"
              placeholder="Search by name or phone..."
              className="w-full pl-10 pr-4 py-2 sm:py-2.5 bg-[#FAF7F2] border border-[#E2DACB] rounded-xl text-xs sm:text-sm text-zinc-900 placeholder:text-zinc-400 focus:ring-2 focus:ring-[#DCA51B]/30 focus:border-[#DCA51B] transition-all"
              value={q}
              onChange={handleSearch}
            />
          </div>
          <div className="w-full sm:w-52 relative group">
            <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none group-focus-within:text-[#DCA51B] transition-colors" />
            <select
              className="w-full pl-10 pr-4 py-2 sm:py-2.5 bg-[#FAF7F2] border border-[#E2DACB] rounded-xl text-xs sm:text-sm text-zinc-900 focus:ring-2 focus:ring-[#DCA51B]/30 focus:border-[#DCA51B] appearance-none transition-all cursor-pointer font-medium"
              value={status}
              onChange={handleStatusFilter}
            >
              <option value="">All Statuses</option>
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="CONTACTED">Contacted</option>
              <option value="COMPLETED">Completed</option>
              <option value="NO_RESPONSE">No Response</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="w-8 h-8 animate-spin text-[#DCA51B]" />
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl flex items-center border border-red-200 text-xs sm:text-sm">
          <AlertCircle className="w-5 h-5 mr-2" />
          {error}
        </div>
      ) : data?.data.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-xs border border-[#E8E2D5] p-10 sm:p-12 text-center text-xs sm:text-sm text-zinc-500">
          No follow-ups found matching your criteria.
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-xs border border-[#E8E2D5] overflow-hidden">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="min-w-full divide-y divide-[#E8E2D5]">
              <thead className="bg-[#FAF7F2]">
                <tr>
                  <th className="px-4 sm:px-6 py-3.5 text-left text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Contact</th>
                  <th className="px-4 sm:px-6 py-3.5 text-left text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 sm:px-6 py-3.5 text-left text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Created</th>
                  <th className="px-4 sm:px-6 py-3.5 text-left text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Next Follow-up</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-[#E8E2D5]">
                {data?.data.map((contact) => (
                  <tr 
                    key={contact.id} 
                    className="hover:bg-[#FAF7F2]/60 cursor-pointer transition-colors group"
                    onClick={() => navigate(`/staff/contacts/${contact.id}`)}
                  >
                    <td className="px-4 sm:px-6 py-3.5 sm:py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-9 w-9 sm:h-10 sm:w-10 bg-[#FAF3E0] border border-[#DCA51B]/30 rounded-2xl flex items-center justify-center transition-transform duration-200 group-hover:scale-110 shadow-2xs">
                          <User className="h-4 w-4 sm:h-5 sm:w-5 text-[#8C6B14]" />
                        </div>
                        <div className="ml-3 sm:ml-4">
                          <div className="text-xs sm:text-sm font-semibold text-zinc-900 group-hover:text-[#8C6B14] transition-colors">
                            {contact.patient?.fullName || 'Unknown Patient'}
                          </div>
                          <div className="text-[11px] sm:text-xs text-zinc-500 flex items-center mt-0.5">
                            <Phone className="w-3 h-3 mr-1 text-zinc-400 group-hover:text-[#DCA51B] transition-colors" />
                            {contact.patient?.phone || 'N/A'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-3.5 sm:py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 inline-flex text-[11px] sm:text-xs font-bold uppercase tracking-wider rounded-lg border ${getStatusColor(contact.status)}`}>
                        {contact.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-3.5 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-zinc-600">
                      {new Date(contact.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 sm:px-6 py-3.5 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-zinc-600">
                      {contact.nextFollowUpAt ? (
                        <div className="flex items-center text-[#8C6B14] font-medium">
                          <Calendar className="w-3.5 h-3.5 mr-1.5 text-[#DCA51B] anim-icon-pulse" />
                          {new Date(contact.nextFollowUpAt).toLocaleDateString()}
                        </div>
                      ) : (
                        <span className="text-zinc-400 text-xs">Not set</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination Controls */}
          <div className="bg-[#FAF7F2]/50 px-4 py-3 border-t border-[#E8E2D5] flex items-center justify-between sm:px-6">
            <div className="flex-1 flex items-center justify-between sm:hidden">
              <button
                onClick={() => setSearchParams(prev => { prev.set('page', Math.max(1, page - 1).toString()); return prev; })}
                disabled={page <= 1}
                className="relative inline-flex items-center px-3 py-1.5 border border-[#E2DACB] text-xs font-semibold rounded-lg text-zinc-700 bg-white hover:bg-[#FAF7F2] disabled:opacity-40"
              >
                Previous
              </button>
              <span className="text-xs text-zinc-500 font-medium">Page {page}</span>
              <button
                onClick={() => setSearchParams(prev => { prev.set('page', (page + 1).toString()); return prev; })}
                disabled={!data || page * limit >= data.total}
                className="relative inline-flex items-center px-3 py-1.5 border border-[#E2DACB] text-xs font-semibold rounded-lg text-zinc-700 bg-white hover:bg-[#FAF7F2] disabled:opacity-40"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-zinc-600">
                  Showing <span className="font-semibold text-zinc-900">{(page - 1) * limit + 1}</span> to <span className="font-semibold text-zinc-900">{Math.min(page * limit, data?.total || 0)}</span> of{' '}
                  <span className="font-semibold text-zinc-900">{data?.total}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-xl shadow-sm gap-1" aria-label="Pagination">
                  <button
                    onClick={() => setSearchParams(prev => { prev.set('page', (page - 1).toString()); return prev; })}
                    disabled={page === 1}
                    className="relative inline-flex items-center px-3 py-1.5 rounded-lg border border-[#E2DACB] bg-white text-xs font-semibold text-zinc-700 hover:bg-[#FAF7F2] disabled:opacity-40 transition-colors"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setSearchParams(prev => { prev.set('page', (page + 1).toString()); return prev; })}
                    disabled={!data || page * limit >= data.total}
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
