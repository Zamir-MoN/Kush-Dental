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
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAF7F2]">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#162723]/20 border-t-[#DCA51B]"></div>
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
      <div className="flex h-[50vh] flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-bold text-[#162723]">Unauthorized Access</h2>
        <p className="mt-2 text-[#162723]/70">You do not have permission to view this page.</p>
      </div>
    );
  }

  return <>{children}</>;
};
