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
    <div className="space-y-6 max-w-4xl mx-auto h-full flex flex-col">
      <div>
        <h1 className="text-2xl font-bold text-[#162723]">Patient Directory</h1>
        <p className="text-sm text-gray-500 mt-1">Search patients by name or phone number.</p>
      </div>
      
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex-1 flex flex-col min-h-0">
        <div className="relative mb-6 flex-shrink-0">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-[#162723] focus:border-[#162723] sm:text-sm"
            placeholder="Search by name (e.g. Sagar) or phone (e.g. 555-1234)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {isLoading && page === 0 ? (
          <div className="flex justify-center items-center py-12 flex-1">
            <Loader2 className="w-8 h-8 animate-spin text-[#162723]" />
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm flex-shrink-0">
            {error}
          </div>
        ) : hasSearched && patients.length === 0 ? (
          <div className="text-center py-12 flex-1">
            <SearchX className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-sm font-medium text-gray-900">No patients found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search query.
            </p>
          </div>
        ) : (
          <div 
            className="overflow-y-auto overflow-x-hidden bg-white shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg max-h-[60vh]"
            onScroll={handleScroll}
            data-lenis-prevent
          >
            <ul role="list" className="divide-y divide-gray-200">
              {patients.map((patient) => (
                <li key={patient.id}>
                  <button
                    onClick={() => navigate(`/staff/patients/${patient.id}`)}
                    className="block hover:bg-gray-50 w-full text-left transition-colors"
                  >
                    <div className="flex items-center px-4 py-4 sm:px-6">
                      <div className="min-w-0 flex-1 flex items-center">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-[#162723]/10 flex items-center justify-center">
                            <User className="h-5 w-5 text-[#162723]" />
                          </div>
                        </div>
                        <div className="min-w-0 flex-1 px-4 md:grid md:grid-cols-2 md:gap-4">
                          <div>
                            <p className="text-sm font-medium text-[#162723] truncate">{patient.fullName}</p>
                            <p className="mt-2 flex items-center text-sm text-gray-500">
                              <Phone className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                              <span className="truncate">{patient.phone}</span>
                            </p>
                          </div>
                          <div className="hidden md:block">
                            <div>
                              <p className="text-sm text-gray-900">
                                Patient ID
                              </p>
                              <p className="mt-2 flex items-center text-sm text-gray-500 truncate">
                                {patient.id.substring(0, 8)}...
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
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
                <Loader2 className="w-6 h-6 animate-spin text-[#162723]" />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
