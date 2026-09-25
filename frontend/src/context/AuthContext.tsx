import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import apiClient, { setAccessToken, refreshSession } from '../lib/apiClient';

/**
 * AUTHENTICATION POLICY
 * 1. Authentication is ONLY for internal clinic users (STAFF, DOCTOR).
 * 2. There is NO patient/public-user login system (patients book directly).
 * 3. Protected staff portal access allows only STAFF and DOCTOR.
 * 4. ADMIN is currently unsupported.
 */
export interface User {
  id: string;
  email: string;
  role: 'DOCTOR' | 'STAFF';
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (credentials: any) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const initAuth = useCallback(async () => {
    try {
      // First try to refresh token (will pick up HttpOnly cookie if present)
      const data: any = await refreshSession();
      if (data && data.access_token) {
        setAccessToken(data.access_token);
        setUser(data.user);
      }
    } catch (e) {
      // Not logged in or expired
      setUser(null);
      setAccessToken(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  const login = async (credentials: any) => {
    const data: any = await apiClient('/api/v1/auth/login', {
      method: 'POST',
      data: credentials,
      skipAuth: true
    });
    setAccessToken(data.access_token);
    setUser(data.user);
  };

  const logout = async () => {
    try {
      await apiClient('/api/v1/auth/logout', { method: 'POST' });
    } catch (e) {
      // Ignore errors on logout
    } finally {
      setAccessToken(null);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      login,
      logout,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
