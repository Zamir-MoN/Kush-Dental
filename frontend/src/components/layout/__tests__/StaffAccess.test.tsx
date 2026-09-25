import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { PortalLayout } from '../PortalLayout';
import { ProtectedRoute } from '../ProtectedRoute';

vi.mock('../BrandLogo', () => ({
  BrandLogo: () => <div>BrandLogo</div>
}));

vi.mock('../../../context/AuthContext', () => ({
  useAuth: vi.fn(),
  AuthProvider: ({ children }: any) => <>{children}</>
}));

describe('Staff Access & Navigation', () => {
  const renderWithRole = (role: 'DOCTOR' | 'STAFF', ui: React.ReactNode, initialEntry = '/staff') => {
    vi.mocked(useAuth).mockReturnValue({
      user: { id: '1', email: 'test@kushdental.com', role },
      login: vi.fn(),
      logout: vi.fn(),
      isAuthenticated: true,
      isLoading: false
    });
    
    return render(
      <MemoryRouter initialEntries={[initialEntry]}>
        {ui}
      </MemoryRouter>
    );
  };

  describe('Sidebar Navigation (PortalLayout)', () => {
    it('DOCTOR sees Patients navigation item and Users/Blog', () => {
      renderWithRole('DOCTOR', <PortalLayout />);
      
      expect(screen.getByText('Patients')).toBeInTheDocument();
      expect(screen.getByText('Users')).toBeInTheDocument();
      expect(screen.getByText('Blog')).toBeInTheDocument();
    });

    it('STAFF sees Patients navigation item but NOT Users/Blog', () => {
      renderWithRole('STAFF', <PortalLayout />);
      
      expect(screen.getByText('Patients')).toBeInTheDocument();
      expect(screen.queryByText('Users')).not.toBeInTheDocument();
      expect(screen.queryByText('Blog')).not.toBeInTheDocument();
    });
  });

  describe('Route Protection (ProtectedRoute)', () => {
    const TestRoutes = () => (
      <Routes>
        <Route path="/patients" element={<ProtectedRoute allowedRoles={['DOCTOR', 'STAFF']}><div>Patient Directory Rendered</div></ProtectedRoute>} />
        <Route path="/patients/:id" element={<ProtectedRoute allowedRoles={['DOCTOR']}><div>Patient Detail Rendered</div></ProtectedRoute>} />
        <Route path="/users" element={<ProtectedRoute allowedRoles={['DOCTOR']}><div>Users Rendered</div></ProtectedRoute>} />
        <Route path="/staff/login" element={<div>Unauthorized Access</div>} />
      </Routes>
    );

    it('STAFF can navigate to /patients (Patient Directory renders for STAFF)', () => {
      renderWithRole('STAFF', <TestRoutes />, '/patients');
      expect(screen.getByText('Patient Directory Rendered')).toBeInTheDocument();
    });

    it('DOCTOR can navigate to /patients (Existing Doctor Patient Directory behavior still works)', () => {
      renderWithRole('DOCTOR', <TestRoutes />, '/patients');
      expect(screen.getByText('Patient Directory Rendered')).toBeInTheDocument();
    });

    it('STAFF still cannot access Doctor-only patient detail/history where currently restricted', () => {
      renderWithRole('STAFF', <TestRoutes />, '/patients/123');
      expect(screen.queryByText('Patient Detail Rendered')).not.toBeInTheDocument();
      expect(screen.getByText('Unauthorized Access')).toBeInTheDocument(); // Redirects to login
    });

    it('Users/Blog/etc. remain protected for STAFF according to the existing RBAC rules', () => {
      renderWithRole('STAFF', <TestRoutes />, '/users');
      expect(screen.queryByText('Users Rendered')).not.toBeInTheDocument();
      expect(screen.getByText('Unauthorized Access')).toBeInTheDocument();
    });
    
    it('DOCTOR can access patient detail and users', () => {
      const { unmount } = renderWithRole('DOCTOR', <TestRoutes />, '/patients/123');
      expect(screen.getByText('Patient Detail Rendered')).toBeInTheDocument();
      unmount();
      
      renderWithRole('DOCTOR', <TestRoutes />, '/users');
      expect(screen.getByText('Users Rendered')).toBeInTheDocument();
    });
  });
});
