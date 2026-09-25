import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Booking } from '../Booking';
import { apiClient } from '../../lib/apiClient';

class IntersectionObserverMock {
  disconnect() {}
  observe() {}
  takeRecords() { return []; }
  unobserve() {}
}
vi.stubGlobal('IntersectionObserver', IntersectionObserverMock);

vi.mock('../../lib/apiClient', () => ({
  apiClient: vi.fn(),
}));

describe('Booking Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders full appointment booking workflow', () => {
    render(
      <MemoryRouter>
        <Booking />
      </MemoryRouter>
    );

    // Verify booking UI elements exist
    expect(screen.getByText('Select Treatment')).toBeInTheDocument();
    expect(screen.getByText('Select Date')).toBeInTheDocument();
    expect(screen.getByText('Preferred Time')).toBeInTheDocument();
    expect(screen.getByText('Patient Details')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /Full Name/i })).toBeInTheDocument();
  });

  it('submits booking payload with scheduling fields', async () => {
    vi.mocked(apiClient).mockResolvedValueOnce({ success: true, message: 'Confirmed' });

    render(
      <MemoryRouter>
        <Booking />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByRole('textbox', { name: /Full Name/i }), { target: { value: 'Test Booker' } });
    fireEvent.change(screen.getByRole('textbox', { name: /Email Address/i }), { target: { value: 'booker@example.com' } });
    fireEvent.change(screen.getByRole('textbox', { name: /Phone Number/i }), { target: { value: '555-9876' } });
    
    fireEvent.submit(screen.getByRole('button', { name: /CONFIRM APPOINTMENT REQUEST/i }));

    await waitFor(() => {
      expect(apiClient).toHaveBeenCalledWith('/api/v1/public/leads', expect.objectContaining({
        method: 'POST',
        data: expect.objectContaining({
          name: 'Test Booker',
          email: 'booker@example.com',
          phone: '555-9876',
          startsAt: expect.any(String),
          endsAt: expect.any(String),
        }),
        headers: expect.objectContaining({
          'Idempotency-Key': expect.any(String)
        })
      }));
    });

    await waitFor(() => {
      expect(screen.getByText('Appointment Requested')).toBeInTheDocument();
    });
  });
});
