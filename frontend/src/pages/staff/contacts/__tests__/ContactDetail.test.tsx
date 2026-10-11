import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { BrowserRouter } from 'react-router-dom';
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
    useParams: () => ({ id: '123' }),
    useNavigate: () => vi.fn()
  };
});

import { apiClient } from '../../../../lib/apiClient';

describe('ContactDetail Component', () => {
  const mockContact = {
    id: '123',
    status: 'OPEN',
    notes: 'Test note',
    outcome: '',
    nextFollowUpAt: '2026-09-23T00:00:00Z',
    createdAt: '2026-09-22T00:00:00Z',
    patient: { id: 'p1', fullName: 'John Doe', phone: '1234567890' },
    lead: { id: 'l1', status: 'NEW', desiredTreatment: 'Teeth Whitening' },
    appointment: null
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders contact detail successfully', async () => {
    (apiClient as any).mockResolvedValueOnce(mockContact);

    render(
      <BrowserRouter>
        <AuthProvider>
          <ContactDetail />
        </AuthProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Test note')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Open')).toBeInTheDocument();
    });
  });

  it('handles save successfully', async () => {
    (apiClient as any).mockResolvedValueOnce(mockContact); // GET
    (apiClient as any).mockResolvedValueOnce({ ...mockContact, status: 'IN_PROGRESS' }); // PATCH

    render(
      <BrowserRouter>
        <AuthProvider>
          <ContactDetail />
        </AuthProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Save Follow-up'));

    await waitFor(() => {
      expect(apiClient).toHaveBeenCalledTimes(2);
      expect(screen.getByText('Follow-up updated successfully.')).toBeInTheDocument();
    });
  });
});

  it('renders urgent lead-only contact with convert button', async () => {
    const mockLeadOnly = {
      id: '123',
      status: 'OPEN',
      notes: null,
      outcome: null,
      nextFollowUpAt: null,
      createdAt: '2026-09-22T00:00:00Z',
      priority: 'URGENT',
      source: 'URGENT_VISIT',
      patient: null,
      lead: { id: 'l1', name: 'Urgent Bob', phone: '9999999999', status: 'NEW', desiredTreatment: 'Pain' },
      appointment: null
    };

    (apiClient as any).mockResolvedValueOnce(mockLeadOnly);
    
    render(
      <BrowserRouter>
        <AuthProvider>
          <ContactDetail isUrgentQueue={true} />
        </AuthProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Urgent Bob')).toBeInTheDocument();
      expect(screen.getByText('9999999999')).toBeInTheDocument();
      expect(screen.getByText('Convert Lead to Patient')).toBeInTheDocument();
      expect(screen.queryByText('Create Appointment')).not.toBeInTheDocument();
    });
  });

  it('handles lead conversion successfully', async () => {
    const mockLeadOnly = {
      id: '123',
      status: 'OPEN',
      notes: null,
      outcome: null,
      nextFollowUpAt: null,
      createdAt: '2026-09-22T00:00:00Z',
      priority: 'URGENT',
      source: 'URGENT_VISIT',
      patient: null,
      lead: { id: 'l1', name: 'Urgent Bob', phone: '9999999999', status: 'NEW', desiredTreatment: 'Pain' },
      appointment: null
    };

    const mockConverted = {
      ...mockLeadOnly,
      patient: { id: 'p1', fullName: 'Urgent Bob', phone: '9999999999' }
    };

    (apiClient as any)
      .mockResolvedValueOnce(mockLeadOnly) // initial load
      .mockResolvedValueOnce({}) // convert post
      .mockResolvedValueOnce(mockConverted); // refetch

    render(
      <BrowserRouter>
        <AuthProvider>
          <ContactDetail isUrgentQueue={true} />
        </AuthProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Convert Lead to Patient')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Convert Lead to Patient'));

    await waitFor(() => {
      expect(apiClient).toHaveBeenCalledWith('/api/v1/leads/l1/convert', { method: 'POST' });
      expect(screen.getByText('Lead successfully converted to Patient.')).toBeInTheDocument();
      expect(screen.queryByText('Convert Lead to Patient')).not.toBeInTheDocument();
      expect(screen.getByText('Create Appointment')).toBeInTheDocument();
    });
  });
