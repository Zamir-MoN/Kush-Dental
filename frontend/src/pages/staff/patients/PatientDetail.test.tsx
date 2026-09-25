import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { PatientDetail } from './PatientDetail';
import { apiClient } from '../../../lib/apiClient';

vi.mock('../../../lib/apiClient', () => ({
  apiClient: vi.fn(),
}));

describe('PatientDetail', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = () => {
    render(
      <MemoryRouter initialEntries={['/patients/123']}>
        <Routes>
          <Route path="/patients/:id" element={<PatientDetail />} />
        </Routes>
      </MemoryRouter>
    );
  };

  it('loads patient details and appointment history', async () => {
    const mockPatient = { id: '123', fullName: 'John Doe', phone: '+1234567890', email: 'john@example.com' };
    const mockAppointments = [
      { id: 'a1', treatment: 'Checkup', startsAt: '2023-10-10T10:00:00Z', endsAt: '2023-10-10T11:00:00Z', status: 'COMPLETED' },
      { id: 'a2', treatment: 'Cleaning', startsAt: '2023-09-10T10:00:00Z', endsAt: '2023-09-10T11:00:00Z', status: 'COMPLETED' },
    ];

    vi.mocked(apiClient).mockImplementation(async (url) => {
      if (url.includes('/patients/123')) return mockPatient;
      if (url.includes('/appointments?patientId=123')) return mockAppointments;
      return [];
    });

    renderComponent();

    // Wait for the name to appear
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    expect(screen.getByText('+1234567890')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    
    // Check appointments rendered
    expect(screen.getByText('Checkup')).toBeInTheDocument();
    expect(screen.getByText('Cleaning')).toBeInTheDocument();
  });

  it('handles error state if patient not found', async () => {
    vi.mocked(apiClient).mockRejectedValue(new Error('Patient not found'));

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Error Loading Patient')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Patient not found')).toBeInTheDocument();
  });
});
