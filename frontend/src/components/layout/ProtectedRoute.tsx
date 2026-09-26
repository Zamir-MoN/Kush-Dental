import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import type { User } from '../../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: User['role'][];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    const isDark = location.pathname.startsWith('/staff');
    return (
      <div className={`flex min-h-screen items-center justify-center ${isDark ? 'bg-[#0D0E12] text-zinc-100' : 'bg-[#FAF7F2] text-zinc-900'}`}>
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-3 border-[#DCA51B]/20 border-t-[#DCA51B]"></div>
          <span className={`text-xs font-semibold tracking-wider uppercase ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>Verifying session...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    // Redirect to login but save the attempted url
    return <Navigate to="/staff/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Role not allowed, show unauthorized state instead of redirecting
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center p-6 text-center text-zinc-100">
        <h2 className="text-2xl font-bold tracking-tight">Unauthorized Access</h2>
        <p className="mt-2 text-zinc-400 text-sm">You do not have permission to view this section.</p>
      </div>
    );
  }

  return <>{children}</>;
};
