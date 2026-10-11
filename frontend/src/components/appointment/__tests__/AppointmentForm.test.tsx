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

vi.mock('@marsidev/react-turnstile', () => ({
  Turnstile: ({ onSuccess }: any) => {
    // Automatically trigger success with dummy token in test environment
    if (onSuccess) {
      Promise.resolve().then(() => onSuccess('1x00000000000000000000AA'));
    }
    return null;
  }
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
    
    const submitBtn = screen.getByRole('button', { name: /SEND INQUIRY/i });
    await waitFor(() => expect(submitBtn).not.toBeDisabled());
    
    fireEvent.submit(submitBtn);

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

  it('keeps success state indefinitely after successful submission', async () => {
    vi.mocked(apiClient).mockResolvedValueOnce({ success: true, message: 'Your appointment request has been received.' });

    const { rerender } = render(
      <MemoryRouter>
        <ContactForm />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByRole('textbox', { name: /Full Name/i }), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByRole('textbox', { name: /Email Address/i }), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByRole('textbox', { name: /Phone Number/i }), { target: { value: '555-1234' } });
    
    const submitBtn = screen.getByRole('button', { name: /SEND INQUIRY/i });
    await waitFor(() => expect(submitBtn).not.toBeDisabled());
    
    fireEvent.submit(submitBtn);

    // Wait for the async apiClient call and state update
    await waitFor(() => {
      expect(screen.getByText('Inquiry Sent')).toBeInTheDocument();
    });

    vi.useFakeTimers();
    
    // Advance time by 10 minutes (600000ms)
    vi.advanceTimersByTime(600000);
    
    // The success message should still be there, and the form should NOT be there
    expect(screen.getByText('Inquiry Sent')).toBeInTheDocument();
    expect(screen.queryByRole('textbox', { name: /Full Name/i })).not.toBeInTheDocument();

    // Rerender to ensure React reconciliation doesn't reset it
    rerender(
      <MemoryRouter>
        <ContactForm />
      </MemoryRouter>
    );

    expect(screen.getByText('Inquiry Sent')).toBeInTheDocument();
    
    vi.useRealTimers();
  });

  it('leaves form visible and shows error on failed submission', async () => {
    vi.mocked(apiClient).mockRejectedValueOnce(new Error('Network error or server unreachable'));

    render(
      <MemoryRouter>
        <ContactForm />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByRole('textbox', { name: /Full Name/i }), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByRole('textbox', { name: /Email Address/i }), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByRole('textbox', { name: /Phone Number/i }), { target: { value: '555-1234' } });
    
    const submitBtn = screen.getByRole('button', { name: /SEND INQUIRY/i });
    await waitFor(() => expect(submitBtn).not.toBeDisabled());
    
    fireEvent.submit(submitBtn);

    await waitFor(() => {
      expect(screen.getByText('Network error or server unreachable')).toBeInTheDocument();
    });

    // Form should still be fully visible and editable
    expect(screen.getByRole('textbox', { name: /Full Name/i })).toBeInTheDocument();
    expect(screen.queryByText('Inquiry Sent')).not.toBeInTheDocument();
  });
});
