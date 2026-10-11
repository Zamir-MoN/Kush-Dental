import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { UrgentVisit } from '../UrgentVisit';
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

vi.mock('@marsidev/react-turnstile', () => ({
  Turnstile: ({ onSuccess }: any) => {
    if (onSuccess) {
      setTimeout(() => onSuccess('1x00000000000000000000AA'), 0);
    }
    return null;
  }
}));

describe('UrgentVisit Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders urgent visit form', () => {
    render(
      <MemoryRouter>
        <UrgentVisit />
      </MemoryRouter>
    );

    expect(screen.getByText('Urgent Dental Visit')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /Full Name \*/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /Email Address \*/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /Phone Number \*/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /Problem Description \*/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /When did this start\? \(Optional\)/i })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /Preferred Contact Method \(Optional\)/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Go to Normal Booking/i })).toBeInTheDocument();
  });

  it('submits urgent visit payload to exact endpoint with idempotency', async () => {
    vi.mocked(apiClient).mockResolvedValueOnce({ success: true, message: 'Confirmed' });

    render(
      <MemoryRouter>
        <UrgentVisit />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByRole('textbox', { name: /Full Name \*/i }), { target: { value: 'Urgent Patient' } });
    fireEvent.change(screen.getByRole('textbox', { name: /Email Address \*/i }), { target: { value: 'urgent@example.com' } });
    fireEvent.change(screen.getByRole('textbox', { name: /Phone Number \*/i }), { target: { value: '555-9999' } });
    fireEvent.change(screen.getByRole('textbox', { name: /Problem Description \*/i }), { target: { value: 'Broken tooth hurts a lot.' } });
    fireEvent.change(screen.getByRole('textbox', { name: /When did this start\? \(Optional\)/i }), { target: { value: '2 hours ago' } });
    fireEvent.change(screen.getByRole('combobox', { name: /Preferred Contact Method \(Optional\)/i }), { target: { value: 'Phone Call' } });

    const submitBtn = screen.getByRole('button', { name: /REQUEST URGENT VISIT/i });
    await waitFor(() => expect(submitBtn).not.toBeDisabled());
    fireEvent.submit(submitBtn);

    await waitFor(() => {
      expect(apiClient).toHaveBeenCalledWith('/api/v1/public/urgent-visits', expect.objectContaining({
        method: 'POST',
        data: expect.objectContaining({
          name: 'Urgent Patient',
          email: 'urgent@example.com',
          phone: '555-9999',
          problemDescription: 'Broken tooth hurts a lot.',
          startedWhen: '2 hours ago',
          preferredContactMethod: 'Phone Call'
        }),
        headers: expect.objectContaining({
          'Idempotency-Key': expect.stringMatching(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
        })
      }));
    });

    await waitFor(() => {
      expect(screen.getByText('Urgent Request Received')).toBeInTheDocument();
    });
  });

  it('handles error response properly and keeps form usable', async () => {
    vi.mocked(apiClient).mockRejectedValueOnce({ message: 'Rate limit exceeded' });

    render(
      <MemoryRouter>
        <UrgentVisit />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByRole('textbox', { name: /Full Name \*/i }), { target: { value: 'Error Test' } });
    fireEvent.change(screen.getByRole('textbox', { name: /Email Address \*/i }), { target: { value: 'err@example.com' } });
    fireEvent.change(screen.getByRole('textbox', { name: /Phone Number \*/i }), { target: { value: '555-0000' } });
    fireEvent.change(screen.getByRole('textbox', { name: /Problem Description \*/i }), { target: { value: 'Pain' } });

    const submitBtn = screen.getByRole('button', { name: /REQUEST URGENT VISIT/i });
    await waitFor(() => expect(submitBtn).not.toBeDisabled());
    fireEvent.submit(submitBtn);

    await waitFor(() => {
      expect(screen.getByText('Rate limit exceeded')).toBeInTheDocument();
    });
    
    expect(submitBtn).not.toBeDisabled();
    expect(screen.queryByText('Urgent Request Received')).not.toBeInTheDocument();
  });
});
