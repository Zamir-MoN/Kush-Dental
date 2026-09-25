import { useState, useEffect, useRef } from 'react';
import type { UIEvent } from 'react';
import { Loader2, Users as UsersIcon, Shield, Mail, Calendar, AlertCircle } from 'lucide-react';
import { apiClient } from '../../lib/apiClient';
import { useAuth } from '../../context/AuthContext';

interface UserResponse {
  id: string;
  email: string;
  role: 'DOCTOR' | 'STAFF' | 'ADMIN';
  createdAt: string;
  updatedAt: string;
}

interface UserListResponse {
  total: number;
  skip: number;
  limit: number;
  data: UserResponse[];
}

export const Users = () => {
  const { user: authUser } = useAuth();
  const [users, setUsers] = useState<UserResponse[]>([]);
  
  // Pagination states
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);
  const PAGE_LIMIT = 50;
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const requestRef = useRef<number>(0);

  // Mutation states
  const [editingUser, setEditingUser] = useState<UserResponse | null>(null);
  const [deactivatingUser, setDeactivatingUser] = useState<UserResponse | null>(null);
  const [editEmail, setEditEmail] = useState('');
  const [editRole, setEditRole] = useState<'DOCTOR' | 'STAFF'>('STAFF');
  const [isSaving, setIsSaving] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  const loadUsers = async (pageIndex: number = 0, isInitialLoad: boolean = true) => {
    const requestId = ++requestRef.current;
    
    if (isInitialLoad) {
      setIsLoading(true);
      setUsers([]);
      setHasMore(true);
      setPage(0);
    } else {
      setIsFetchingNextPage(true);
    }
    
    setError(null);
    
    try {
      const skip = pageIndex * PAGE_LIMIT;
      const url = `/api/v1/users?skip=${skip}&limit=${PAGE_LIMIT}`;
      const results = await apiClient<UserListResponse>(url);
      
      if (requestRef.current !== requestId) return; // Ignore stale request
      
      setUsers(prev => isInitialLoad ? results.data : [...prev, ...results.data]);
      setHasMore(results.total > skip + results.data.length);
      setPage(pageIndex);
    } catch (err: any) {
      if (requestRef.current !== requestId) return; // Ignore stale request
      setError(err.message || 'Failed to load users');
      if (isInitialLoad) setUsers([]);
    } finally {
      if (requestRef.current === requestId) {
        setIsLoading(false);
        setIsFetchingNextPage(false);
      }
    }
  };

  useEffect(() => {
    loadUsers(0, true);
  }, []);

  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    if (target.scrollHeight - target.scrollTop <= target.clientHeight + 50) {
      if (hasMore && !isFetchingNextPage && !isLoading) {
        loadUsers(page + 1, false);
      }
    }
  };

  const openEditModal = (u: UserResponse) => {
    setEditingUser(u);
    setEditEmail(u.email);
    setEditRole(u.role === 'ADMIN' ? 'STAFF' : u.role);
    setModalError(null);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    
    setIsSaving(true);
    setModalError(null);
    try {
      const payload: any = {};
      const trimmedEmail = editEmail.trim();
      
      if (trimmedEmail !== editingUser.email) payload.email = trimmedEmail;
      if (editRole !== editingUser.role) payload.role = editRole;
      
      if (Object.keys(payload).length > 0) {
        const result = await apiClient<UserResponse>(`/api/v1/users/${editingUser.id}`, {
          method: 'PATCH',
          data: payload,
          headers: { 'Content-Type': 'application/json' }
        });
        setUsers(prev => prev.map(u => u.id === editingUser.id ? { ...u, ...result } : u));
      }
      setEditingUser(null);
    } catch (err: any) {
      setModalError(err.message || 'Failed to update user');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeactivate = async () => {
    if (!deactivatingUser) return;
    
    setIsSaving(true);
    setModalError(null);
    try {
      await apiClient(`/api/v1/users/${deactivatingUser.id}`, { method: 'DELETE' });
      setUsers(prev => prev.filter(u => u.id !== deactivatingUser.id));
      setDeactivatingUser(null);
    } catch (err: any) {
      setModalError(err.message || 'Failed to deactivate user');
    } finally {
      setIsSaving(false);
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'DOCTOR':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Doctor</span>;
      case 'STAFF':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Staff</span>;
      case 'ADMIN':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">Admin</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{role}</span>;
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto h-full flex flex-col">
      <div>
        <h1 className="text-2xl font-bold text-[#162723]">Users Directory</h1>
        <p className="text-sm text-gray-500 mt-1">Manage internal clinic staff and doctor accounts.</p>
      </div>
      
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex-1 flex flex-col min-h-0 relative">
        {isLoading && page === 0 ? (
          <div className="flex justify-center items-center py-12 flex-1">
            <Loader2 className="w-8 h-8 animate-spin text-[#162723]" />
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm flex-shrink-0">
            {error}
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-12 flex-1">
            <UsersIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-sm font-medium text-gray-900">No users found</h3>
          </div>
        ) : (
          <div 
            className="overflow-y-auto overflow-x-hidden bg-white shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg max-h-[70vh]"
            onScroll={handleScroll}
            data-lenis-prevent
          >
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">User</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Role</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Created Date</th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 rounded-full bg-[#162723]/10 flex items-center justify-center">
                          <span className="text-[#162723] font-medium uppercase">{user.email.charAt(0)}</span>
                        </div>
                        <div className="ml-4">
                          <div className="font-medium text-gray-900">{user.email}</div>
                          <div className="text-gray-500 flex items-center gap-1 mt-0.5">
                            <Mail className="w-3 h-3" />
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-gray-400" />
                        {getRoleBadge(user.role)}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        Active
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {new Date(user.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => openEditModal(user)}
                          className="text-[#162723] hover:text-[#162723]/80 transition-colors"
                        >
                          Edit
                        </button>
                        {user.id !== authUser?.id && (
                          <button
                            onClick={() => setDeactivatingUser(user)}
                            className="text-red-600 hover:text-red-800 transition-colors"
                          >
                            Deactivate
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {isFetchingNextPage && (
              <div className="py-4 flex justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-[#162723]" />
              </div>
            )}
            
            {!hasMore && users.length > 0 && (
              <div className="py-4 text-center text-sm text-gray-500 border-t border-gray-100 bg-gray-50">
                End of directory
              </div>
            )}
          </div>
        )}
      </div>

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={() => !isSaving && setEditingUser(null)}></div>
            </div>
            <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">&#8203;</span>
            <div className="inline-block transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 sm:align-middle">
              <div>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                  <UsersIcon className="h-6 w-6 text-blue-600" aria-hidden="true" />
                </div>
                <div className="mt-3 text-center sm:mt-5">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">Edit User</h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Update details for {editingUser.email}.
                    </p>
                  </div>
                </div>
              </div>
              
              {modalError && (
                <div className="mt-4 bg-red-50 text-red-600 p-3 rounded-md text-sm flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span>{modalError}</span>
                </div>
              )}

              <form onSubmit={handleSaveEdit} className="mt-5 sm:mt-6 space-y-4 text-left">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#162723] focus:ring-[#162723] sm:text-sm p-2 border"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    disabled={isSaving}
                  />
                </div>
                
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
                  <select
                    id="role"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#162723] focus:ring-[#162723] sm:text-sm p-2 border"
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value as 'DOCTOR' | 'STAFF')}
                    disabled={isSaving}
                  >
                    <option value="DOCTOR" disabled={editingUser.id === authUser?.id && editRole === 'STAFF'}>Doctor</option>
                    <option value="STAFF" disabled={editingUser.id === authUser?.id}>Staff</option>
                  </select>
                  {editingUser.id === authUser?.id && (
                    <p className="mt-1 text-xs text-amber-600">You cannot downgrade your own role to Staff.</p>
                  )}
                </div>

                <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="inline-flex w-full justify-center rounded-md border border-transparent bg-[#162723] px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-[#162723]/90 focus:outline-none focus:ring-2 focus:ring-[#162723] focus:ring-offset-2 sm:col-start-2 sm:text-sm disabled:opacity-50"
                  >
                    {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    disabled={isSaving}
                    className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#162723] focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm"
                    onClick={() => setEditingUser(null)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Deactivate User Modal */}
      {deactivatingUser && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={() => !isSaving && setDeactivatingUser(null)}></div>
            </div>
            <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">&#8203;</span>
            <div className="inline-block transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 sm:align-middle">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                  <AlertCircle className="h-6 w-6 text-red-600" aria-hidden="true" />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">Deactivate User</h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to deactivate the account for <strong>{deactivatingUser.email}</strong>? 
                      They will immediately lose access to the system. This action will log them out of all active sessions.
                    </p>
                  </div>
                </div>
              </div>

              {modalError && (
                <div className="mt-4 bg-red-50 text-red-600 p-3 rounded-md text-sm flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span>{modalError}</span>
                </div>
              )}

              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  disabled={isSaving}
                  className="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                  onClick={handleDeactivate}
                >
                  {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Deactivate'}
                </button>
                <button
                  type="button"
                  disabled={isSaving}
                  className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#162723] focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
                  onClick={() => setDeactivatingUser(null)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
