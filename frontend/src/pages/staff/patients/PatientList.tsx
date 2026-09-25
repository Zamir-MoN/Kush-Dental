import { useState, useEffect, useRef } from 'react';
import type { UIEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, SearchX, User, Loader2, Phone } from 'lucide-react';
import { apiClient } from '../../../lib/apiClient';

interface PatientLookupResponse {
  id: string;
  fullName: string;
  phone: string;
}

interface PatientSearchResponse {
  total: number;
  skip: number;
  limit: number;
  data: PatientLookupResponse[];
}

export const PatientList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [patients, setPatients] = useState<PatientLookupResponse[]>([]);
  
  // Pagination states
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);
  const PAGE_LIMIT = 50;
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  
  const navigate = useNavigate();
  const requestRef = useRef<number>(0);
  const isFetchingRef = useRef<boolean>(false);

  const searchPatients = async (query: string, pageIndex: number = 0, isNewQuery: boolean = true) => {
    // Only return if it's 1 character long (wait for at least 2 chars if typing)
    if (query.trim().length === 1) return;
    
    const requestId = ++requestRef.current;
    
    if (isNewQuery) {
      setIsLoading(true);
      setPatients([]);
      setHasMore(true);
      setPage(0);
    } else {
      setIsFetchingNextPage(true);
    }
    
    isFetchingRef.current = true;
    setError(null);
    setHasSearched(true);
    
    try {
      const skip = pageIndex * PAGE_LIMIT;
      const url = `/api/v1/patients/search?q=${encodeURIComponent(query.trim())}&skip=${skip}&limit=${PAGE_LIMIT}`;
      const results = await apiClient<PatientSearchResponse>(url);
      
      if (requestRef.current !== requestId) return; // Ignore stale request
      
      setPatients(prev => isNewQuery ? results.data : [...prev, ...results.data]);
      setHasMore(results.total > skip + results.data.length);
      setPage(pageIndex);
    } catch (err: any) {
      if (requestRef.current !== requestId) return; // Ignore stale request
      setError(err.message || 'Failed to search patients');
      if (isNewQuery) setPatients([]);
    } finally {
      isFetchingRef.current = false;
      if (requestRef.current === requestId) {
        setIsLoading(false);
        setIsFetchingNextPage(false);
      }
    }
  };

  useEffect(() => {
    // Initial fetch of all patients
    searchPatients('', 0, true);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim().length >= 2 || searchQuery.trim().length === 0) {
        searchPatients(searchQuery, 0, true);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    if (target.scrollHeight - target.scrollTop <= target.clientHeight + 50) {
      if (hasMore && !isFetchingNextPage && !isLoading && !isFetchingRef.current) {
        searchPatients(searchQuery, page + 1, false);
      }
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 max-w-4xl mx-auto h-full flex flex-col">
      <div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-zinc-900 tracking-tight">Patient Directory</h1>
        <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">Search patients by name or phone number.</p>
      </div>
      
      <div className="bg-white p-3.5 sm:p-6 md:p-8 rounded-2xl shadow-xs border border-[#E8E2D5] flex-1 flex flex-col min-h-0">
        <div className="relative mb-4 sm:mb-6 flex-shrink-0 group">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-zinc-400 group-focus-within:text-[#DCA51B] transition-colors" aria-hidden="true" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-4 py-2.5 sm:py-3 bg-[#FAF7F2] border border-[#E2DACB] rounded-xl text-xs sm:text-sm text-zinc-900 placeholder:text-zinc-400 focus:ring-2 focus:ring-[#DCA51B]/30 focus:border-[#DCA51B] transition-all"
            placeholder="Search by name (e.g. Sagar) or phone (e.g. 555-1234)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {isLoading && page === 0 ? (
          <div className="flex justify-center items-center py-12 flex-1">
            <Loader2 className="w-8 h-8 animate-spin text-[#DCA51B]" />
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-700 p-3.5 sm:p-4 rounded-xl text-xs sm:text-sm border border-red-200 flex-shrink-0">
            {error}
          </div>
        ) : hasSearched && patients.length === 0 ? (
          <div className="text-center py-12 flex-1">
            <SearchX className="mx-auto h-12 w-12 text-zinc-300 mb-4 anim-icon-pulse" />
            <h3 className="text-sm font-semibold text-zinc-800">No patients found</h3>
            <p className="mt-1 text-xs sm:text-sm text-zinc-500">
              Try adjusting your search query.
            </p>
          </div>
        ) : (
          <div 
            className="overflow-y-auto overflow-x-hidden bg-white border border-[#E8E2D5] rounded-xl max-h-[60vh] custom-scrollbar"
            onScroll={handleScroll}
            data-lenis-prevent
          >
            <ul role="list" className="divide-y divide-[#E8E2D5]">
              {patients.map((patient) => (
                <li key={patient.id}>
                  <button
                    onClick={() => navigate(`/staff/patients/${patient.id}`)}
                    className="block hover:bg-[#FAF7F2]/60 w-full text-left transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center px-3.5 py-3.5 sm:px-6">
                      <div className="min-w-0 flex-1 flex items-center">
                        <div className="flex-shrink-0">
                          <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-2xl bg-[#FAF3E0] border border-[#DCA51B]/30 flex items-center justify-center transition-transform duration-200 group-hover:scale-110 shadow-2xs">
                            <User className="h-4 w-4 sm:h-5 sm:w-5 text-[#8C6B14]" />
                          </div>
                        </div>
                        <div className="min-w-0 flex-1 px-3 sm:px-4 md:grid md:grid-cols-2 md:gap-4">
                          <div>
                            <p className="text-xs sm:text-sm font-semibold text-zinc-900 group-hover:text-[#8C6B14] transition-colors truncate">{patient.fullName}</p>
                            <p className="mt-1 flex items-center text-[11px] sm:text-xs text-zinc-500">
                              <Phone className="flex-shrink-0 mr-1.5 h-3 w-3 sm:h-3.5 sm:w-3.5 text-zinc-400 group-hover:text-[#DCA51B] transition-colors" />
                              <span className="truncate">{patient.phone}</span>
                            </p>
                          </div>
                          <div className="hidden md:block">
                            <div>
                              <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                                Patient ID
                              </p>
                              <p className="mt-0.5 flex items-center text-xs font-mono text-zinc-600 truncate">
                                {patient.id.substring(0, 8)}...
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <svg className="h-5 w-5 text-zinc-400 group-hover:text-[#DCA51B] group-hover:translate-x-0.5 transition-all" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
            {isFetchingNextPage && (
              <div className="py-4 flex justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-[#DCA51B]" />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
