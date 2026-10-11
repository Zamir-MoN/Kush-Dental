import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ContactList } from '../ContactList';
import { ContactDetail } from '../ContactDetail';
import { AuthProvider } from '../../../../context/AuthContext';
import { vi, describe, it, expect, beforeEach } from 'vitest';

vi.mock('../../../../lib/apiClient', () => ({
  apiClient: vi.fn(),
  setAccessToken: vi.fn()
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual as any,
    useNavigate: () => vi.fn(),
  };
});

import { apiClient } from '../../../../lib/apiClient';

describe('Urgent Visits Queue Frontend', () => {
  const mockUrgentContacts = {
    total: 1,
    skip: 0,
    limit: 20,
    data: [
      {
        id: '123',
        status: 'OPEN',
        createdAt: '2026-09-22T00:00:00Z',
        nextFollowUpAt: '2026-09-23T00:00:00Z',
        priority: 'URGENT',
        source: 'URGENT_VISIT',
        patient: { id: 'p1', fullName: 'Urgent Doe', phone: '1234567890' },
        lead: null,
        appointment: null
      }
    ]
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders urgent contacts and applies correct API parameters', async () => {
    (apiClient as any).mockResolvedValueOnce(mockUrgentContacts);

    render(
      <MemoryRouter>
        <AuthProvider>
          <ContactList isUrgentQueue={true} />
        </AuthProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      // It should call apiClient with the right parameters
      expect(apiClient).toHaveBeenCalledWith(
        expect.stringContaining('priority=URGENT&status=OPEN&status=IN_PROGRESS&priority_sort=true')
      );
      
      // It should render the Urgent Visit indicator
      expect(screen.getByText('Urgent Visits')).toBeInTheDocument();
      expect(screen.getByText('Urgent Doe')).toBeInTheDocument();
      expect(screen.getByText('Urgent')).toBeInTheDocument();
    });
  });

  it('renders urgent contact detail view and displays Create Appointment CTA', async () => {
    (apiClient as any).mockResolvedValueOnce(mockUrgentContacts.data[0]);

    render(
      <MemoryRouter initialEntries={['/staff/urgent-visits/123']}>
        <AuthProvider>
          <Routes>
            <Route path="/staff/urgent-visits/:id" element={<ContactDetail isUrgentQueue={true} />} />
          </Routes>
        </AuthProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Urgent Priority')).toBeInTheDocument();
      expect(screen.getByText('Source: Urgent Visit Request')).toBeInTheDocument();
      expect(screen.getByText('Create Appointment')).toBeInTheDocument();
    });
  });
  
  it('displays empty state for urgent visits', async () => {
    (apiClient as any).mockResolvedValueOnce({ total: 0, skip: 0, limit: 20, data: [] });

    render(
      <MemoryRouter>
        <AuthProvider>
          <ContactList isUrgentQueue={true} />
        </AuthProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/No active urgent visits found/i)).toBeInTheDocument();
    });
  });
});
