import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Dashboard } from '../Dashboard';
import { apiClient } from '../../../lib/apiClient';
import { AuthProvider } from '../../../context/AuthContext';

vi.mock('../../../lib/apiClient', () => ({
  apiClient: vi.fn(),
  setAccessToken: vi.fn()
}));

const mockDashboardData = {
  summary: {
    todayAppointments: 5,
    requestedAppointments: 2,
    confirmedToday: 3,
    newLeads: 4
  },
  todayAppointments: [
    {
      id: 'apt1',
      startsAt: '2025-01-01T10:00:00Z',
      endsAt: '2025-01-01T11:00:00Z',
      treatment: 'Cleaning',
      status: 'CONFIRMED',
      patient: { id: 'p1', fullName: 'John Doe', phone: '+111' },
      doctor: { id: 'd1', name: 'Smith' }
    }
  ],
  requestedAppointments: [
    {
      id: 'apt2',
      startsAt: '2025-01-02T10:00:00Z',
      endsAt: '2025-01-02T11:00:00Z',
      treatment: 'Checkup',
      status: 'REQUESTED',
      patient: { id: 'p2', fullName: 'Jane Doe', phone: '+222' },
      doctor: null
    }
  ],
  upcomingAppointments: [],
  recentLeads: [
    {
      id: 'lead1',
      name: 'Bob',
      phone: '333',
      desiredTreatment: 'Whitening',
      status: 'NEW',
      createdAt: '2025-01-01T09:00:00Z'
    }
  ]
};

describe('Dashboard', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  const renderComponent = () => {
    return render(
      <MemoryRouter>
        <AuthProvider>
          <Dashboard />
        </AuthProvider>
      </MemoryRouter>
    );
  };

  it('renders loading state initially', () => {
    vi.mocked(apiClient).mockImplementation(() => new Promise(() => {})); // Never resolves
    renderComponent();
    expect(document.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('renders error state on API failure', async () => {
    vi.mocked(apiClient).mockRejectedValue(new Error('API Failure'));
    renderComponent();
    await waitFor(() => {
      expect(screen.getByText('Error loading dashboard')).toBeInTheDocument();
      expect(screen.getByText('API Failure')).toBeInTheDocument();
    });
  });

  it('renders summary counts correctly', async () => {
    vi.mocked(apiClient).mockResolvedValueOnce(mockDashboardData);
    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByText('Operational Dashboard')).toBeInTheDocument();
    });

    expect(screen.getByText('5')).toBeInTheDocument(); // Today
    expect(screen.getByText('3')).toBeInTheDocument(); // Confirmed Today
    expect(screen.getByText('2')).toBeInTheDocument(); // Requests
    expect(screen.getByText('4')).toBeInTheDocument(); // Leads
  });

  it('renders today appointments', async () => {
    vi.mocked(apiClient).mockResolvedValueOnce(mockDashboardData);
    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Cleaning')).toBeInTheDocument();
      expect(screen.getByText('CONFIRMED')).toBeInTheDocument();
      expect(screen.getByText('Dr. Smith')).toBeInTheDocument();
    });
  });

  it('renders requested appointments', async () => {
    vi.mocked(apiClient).mockResolvedValueOnce(mockDashboardData);
    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByText('Jane Doe')).toBeInTheDocument();
      expect(screen.getByText('Checkup')).toBeInTheDocument();
      expect(screen.getByText('REQUESTED')).toBeInTheDocument();
    });
  });

  it('renders empty upcoming appointments state', async () => {
    vi.mocked(apiClient).mockResolvedValueOnce(mockDashboardData);
    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByText('No upcoming appointments found.')).toBeInTheDocument();
    });
  });

  it('renders recent leads', async () => {
    vi.mocked(apiClient).mockResolvedValueOnce(mockDashboardData);
    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByText('Bob')).toBeInTheDocument();
      expect(screen.getByText('Whitening')).toBeInTheDocument();
      expect(screen.getByText('NEW')).toBeInTheDocument();
    });
  });
});
