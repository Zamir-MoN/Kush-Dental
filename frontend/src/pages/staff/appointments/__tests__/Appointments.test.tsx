import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { Appointments } from '../../Appointments';
import * as apiClientModule from '../../../../lib/apiClient';
import * as authContextModule from '../../../../context/AuthContext';

vi.mock('../../../../lib/apiClient', () => ({
  apiClient: vi.fn(),
}));

vi.mock('../../../../context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

describe('Appointments Portal', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  const renderComponent = (path: string, isDoctor = false) => {
    // @ts-ignore
    authContextModule.useAuth.mockReturnValue({
      user: { role: isDoctor ? 'DOCTOR' : 'STAFF', id: '1' }
    });

    return render(
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="/staff/appointments" element={<Appointments />} />
          <Route path="/staff/appointments/:id" element={<Appointments />} />
        </Routes>
      </MemoryRouter>
    );
  };

  it('renders appointment list API results', async () => {
    // @ts-ignore
    (apiClientModule.apiClient as any).mockResolvedValueOnce([{ id: 'd1', name: 'Dr. Smith' }]); // doctors
    // @ts-ignore
    (apiClientModule.apiClient as any).mockResolvedValueOnce([
      { id: 'a1', patientId: 'p1', treatment: 'Cleaning', status: 'CONFIRMED', startsAt: '2025-01-01T10:00:00Z', endsAt: '2025-01-01T11:00:00Z' }
    ]); // appointments

    renderComponent('/staff/appointments');
    
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText('Cleaning')).toBeInTheDocument();
    });
    expect(screen.getByText('CONFIRMED')).toBeInTheDocument();
  });

  it('submits date filters correctly', async () => {
    // @ts-ignore
    (apiClientModule.apiClient as any).mockResolvedValue([]);
    renderComponent('/staff/appointments');
    
    // Using simple query selectors since there are two date inputs
    const inputs = document.querySelectorAll('input[type="date"]');
    
    fireEvent.change(inputs[0], { target: { value: '2025-01-01' } });
    
    await waitFor(() => {
      expect(apiClientModule.apiClient).toHaveBeenCalledWith(expect.stringContaining('startDate=2025-01-01T00%3A00%3A00.000Z'));
    });
  });

  it('patient phone lookup works and creates appointment', async () => {
    // @ts-ignore
    (apiClientModule.apiClient as any)
      .mockResolvedValueOnce([{ id: 'd1', name: 'Dr. Smith' }]) // doctors
      .mockResolvedValueOnce([{ id: 'p1', fullName: 'John Doe', phone: '555-1234' }]) // patient lookup
      .mockResolvedValueOnce({ id: 'new-apt-id' }); // create apt

    renderComponent('/staff/appointments/new', false);
    
    const phoneInput = screen.getByPlaceholderText('e.g. 555-1234 or Sagar');
    fireEvent.change(phoneInput, { target: { value: '555-1234' } });
    
    const searchBtn = screen.getByRole('button', { name: '' }); // the search icon button
    fireEvent.click(searchBtn);
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    // Fill form
    const startsAt = document.querySelectorAll('input[type="datetime-local"]')[0];
    const endsAt = document.querySelectorAll('input[type="datetime-local"]')[1];
    const treatmentInput = screen.getByPlaceholderText('e.g. Checkup');
    
    fireEvent.change(startsAt, { target: { value: '2025-01-01T10:00' } });
    fireEvent.change(endsAt, { target: { value: '2025-01-01T11:00' } });
    fireEvent.change(treatmentInput, { target: { value: 'Cleaning' } });
    
    const submitBtn = screen.getByText('Save Appointment');
    fireEvent.click(submitBtn);
    
    await waitFor(() => {
      expect(apiClientModule.apiClient).toHaveBeenCalledWith('/api/v1/appointments', expect.objectContaining({
        method: 'POST',
        data: expect.objectContaining({
          patientId: 'p1',
        })
      }));
    });
  });

  it('STAFF cannot edit treatment but DOCTOR can', async () => {
    const mockApt = { id: 'a1', patientId: 'p1', treatment: 'Cleaning', status: 'CONFIRMED', startsAt: '2025-01-01T10:00:00Z', endsAt: '2025-01-01T11:00:00Z' };
    
    // Test STAFF
    // @ts-ignore
    apiClientModule.apiClient.mockResolvedValueOnce(mockApt);
    renderComponent('/staff/appointments/a1', false);
    
    await waitFor(() => {
      expect(screen.getByText('Edit / Reschedule')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Edit / Reschedule'));
    
    const treatmentInput = screen.getByDisplayValue('Cleaning');
    expect(treatmentInput).toBeDisabled();

    // Reset and test DOCTOR
    cleanup();
    vi.resetAllMocks();
    // @ts-ignore
    apiClientModule.apiClient.mockResolvedValueOnce(mockApt);
    renderComponent('/staff/appointments/a1', true);
    
    await waitFor(() => {
      expect(screen.getByText('Edit / Reschedule')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Edit / Reschedule'));
    
    const treatmentInputDoc = screen.getByDisplayValue('Cleaning');
    expect(treatmentInputDoc).not.toBeDisabled();
  });

  it('STAFF cannot render COMPLETED actions, but DOCTOR can', async () => {
    const mockApt = { id: 'a1', patientId: 'p1', treatment: 'Cleaning', status: 'CONFIRMED', startsAt: '2025-01-01T10:00:00Z', endsAt: '2025-01-01T11:00:00Z' };
    
    // @ts-ignore
    apiClientModule.apiClient.mockResolvedValueOnce(mockApt);
    renderComponent('/staff/appointments/a1', false);
    
    await waitFor(() => {
      expect(screen.getByText('Confirm')).toBeInTheDocument();
      expect(screen.queryByText('Complete')).not.toBeInTheDocument();
      expect(screen.queryByText('No Show')).not.toBeInTheDocument();
    });

    cleanup();
    vi.resetAllMocks();
    // @ts-ignore
    apiClientModule.apiClient.mockResolvedValueOnce(mockApt);
    renderComponent('/staff/appointments/a1', true);
    
    await waitFor(() => {
      expect(screen.getByText('Complete')).toBeInTheDocument();
      expect(screen.getByText('No Show')).toBeInTheDocument();
    });
  });

  it('displays 409 overlap error', async () => {
    // @ts-ignore
    (apiClientModule.apiClient as any)
      .mockResolvedValueOnce([{ id: 'd1', name: 'Dr. Smith' }]) 
      .mockResolvedValueOnce([{ id: 'p1', fullName: 'John Doe', phone: '555-1234' }]) 
      .mockRejectedValueOnce({ status: 409 }); 

    renderComponent('/staff/appointments/new', true);
    
    const phoneInput = screen.getByPlaceholderText('e.g. 555-1234 or Sagar');
    fireEvent.change(phoneInput, { target: { value: '555-1234' } });
    fireEvent.click(screen.getByRole('button', { name: '' }));
    
    await waitFor(() => expect(screen.getByText('John Doe')).toBeInTheDocument());

    const startsAt = document.querySelectorAll('input[type="datetime-local"]')[0];
    const endsAt = document.querySelectorAll('input[type="datetime-local"]')[1];
    const treatmentInput = screen.getByPlaceholderText('e.g. Checkup');

    fireEvent.change(startsAt, { target: { value: '2025-01-01T10:00' } });
    fireEvent.change(endsAt, { target: { value: '2025-01-01T11:00' } });
    fireEvent.change(treatmentInput, { target: { value: 'Cleaning' } });
    
    fireEvent.click(screen.getByText('Save Appointment'));
    
    await waitFor(() => {
      expect(screen.getByText(/Time conflict! This appointment overlaps/i)).toBeInTheDocument();
    });
  });
});
