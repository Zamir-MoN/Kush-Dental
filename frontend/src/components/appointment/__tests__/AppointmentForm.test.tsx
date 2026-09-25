import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ContactForm } from '../AppointmentForm';
import { apiClient } from '../../../lib/apiClient';

vi.mock('../../../lib/apiClient', () => ({
  apiClient: vi.fn(),
}));

vi.mock('../../../hooks/useGsap', () => ({
  useScrollReveal: vi.fn(),
}));

describe('ContactForm (Home Inquiry)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders contact form fields without appointment date/time selectors', () => {
    render(
      <MemoryRouter>
        <ContactForm />
      </MemoryRouter>
    );

    // Verify contact form UI elements exist
    expect(screen.getByText("Have Questions? Let's Talk")).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /Full Name/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /Email Address/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /Phone Number/i })).toBeInTheDocument();
    
    // Verify appointment-specific elements DO NOT exist
    expect(screen.queryByText(/Select Date/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Preferred Time/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Desired Treatment/i)).not.toBeInTheDocument();
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
  });

  it('submits inquiry payload and receives success state', async () => {
    vi.mocked(apiClient).mockResolvedValueOnce({ success: true, message: 'Your appointment request has been received.' });

    render(
      <MemoryRouter>
        <ContactForm />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByRole('textbox', { name: /Full Name/i }), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByRole('textbox', { name: /Email Address/i }), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByRole('textbox', { name: /Phone Number/i }), { target: { value: '555-1234' } });
    
    fireEvent.submit(screen.getByRole('button', { name: /SEND INQUIRY/i }));

    await waitFor(() => {
      expect(apiClient).toHaveBeenCalledWith('/api/v1/public/leads', expect.objectContaining({
        method: 'POST',
        data: expect.objectContaining({
          name: 'Test User',
          email: 'test@example.com',
          phone: '555-1234',
        }),
        headers: expect.objectContaining({
          'Idempotency-Key': expect.any(String)
        })
      }));
    });

    // Note: startsAt and endsAt are NOT present in the data object.
    const callArgs = vi.mocked(apiClient).mock.calls[0][1] as any;
    expect(callArgs.data).not.toHaveProperty('startsAt');
    expect(callArgs.data).not.toHaveProperty('endsAt');

    await waitFor(() => {
      expect(screen.getByText('Inquiry Sent')).toBeInTheDocument();
    });
  });
});
