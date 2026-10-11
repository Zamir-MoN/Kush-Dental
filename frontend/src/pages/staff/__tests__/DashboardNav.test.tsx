import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Dashboard } from '../Dashboard';
import { apiClient } from '../../../lib/apiClient';
import { AuthProvider } from '../../../context/AuthContext';

vi.mock('../../../lib/apiClient', () => ({
  apiClient: vi.fn(),
  setAccessToken: vi.fn()
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockDashboardData = {
  summary: {
    todayAppointments: 5,
    requestedAppointments: 2,
    confirmedToday: 3,
    newLeads: 4,
    openFollowUps: 10,
    inProgressFollowUps: 5
  },
  todayAppointments: [],
  requestedAppointments: [],
  upcomingAppointments: [],
  recentLeads: []
};

describe('Dashboard Navigation Deep Links', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mockNavigate.mockClear();
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

  it('navigates to appointments with correct filters for Confirmed Today', async () => {
    vi.mocked(apiClient).mockResolvedValueOnce(mockDashboardData);
    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByText('Operational Dashboard')).toBeInTheDocument();
    });

    // Find Confirmed Today card by its title text
    const confirmedCard = screen.getByText('Confirmed Today').closest('.group');
    fireEvent.click(confirmedCard!);

    const d = new Date();
    const todayStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    expect(mockNavigate).toHaveBeenCalledWith(`/staff/appointments?status=CONFIRMED&startDate=${todayStr}&endDate=${todayStr}`);
  });

  it('navigates to appointments with correct filters for Pending Requests', async () => {
    vi.mocked(apiClient).mockResolvedValueOnce(mockDashboardData);
    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByText('Operational Dashboard')).toBeInTheDocument();
    });

    const pendingCard = screen.getByText('Pending Requests', { selector: 'p' }).closest('.group');
    fireEvent.click(pendingCard!);

    expect(mockNavigate).toHaveBeenCalledWith(`/staff/appointments?status=REQUESTED`);
  });

  it('navigates to contacts with correct filters for Open Follow-ups', async () => {
    vi.mocked(apiClient).mockResolvedValueOnce(mockDashboardData);
    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByText('Operational Dashboard')).toBeInTheDocument();
    });

    const openCard = screen.getByText('Open Follow-ups').closest('.group');
    fireEvent.click(openCard!);

    expect(mockNavigate).toHaveBeenCalledWith('/staff/contacts?status=OPEN');
  });

  it('navigates to contacts with correct filters for In-Progress Follow-ups', async () => {
    vi.mocked(apiClient).mockResolvedValueOnce(mockDashboardData);
    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByText('Operational Dashboard')).toBeInTheDocument();
    });

    const inProgressCard = screen.getByText('In-Progress Follow-ups').closest('.group');
    fireEvent.click(inProgressCard!);

    expect(mockNavigate).toHaveBeenCalledWith('/staff/contacts?status=IN_PROGRESS');
  });
});
