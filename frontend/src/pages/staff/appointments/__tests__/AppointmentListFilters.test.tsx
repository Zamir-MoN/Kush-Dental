import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AppointmentList } from '../AppointmentList';
import { apiClient } from '../../../../lib/apiClient';

vi.mock('../../../../lib/apiClient', () => ({
  apiClient: vi.fn()
}));

describe('AppointmentList Filters Deep Linking', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  const renderComponent = (initialUrl = '/staff/appointments') => {
    return render(
      <MemoryRouter initialEntries={[initialUrl]}>
        <Routes>
          <Route path="/staff/appointments" element={<AppointmentList isDoctor={false} />} />
        </Routes>
      </MemoryRouter>
    );
  };

  it('initializes default filters from empty URL and makes basic API request', async () => {
    vi.mocked(apiClient).mockImplementation(async (url) => {
      if (url.includes('/doctors')) return [];
      return { data: [], total: 0, skip: 0, limit: 20, effectiveStartDateStr: '2026-10-01', effectiveEndDateStr: '2026-10-01' };
    });
    const { container } = renderComponent('/staff/appointments');
    
    await waitFor(() => {
      expect(apiClient).toHaveBeenCalledWith('/api/v1/appointments/doctors');
      expect(apiClient).toHaveBeenCalledWith(expect.stringContaining('/api/v1/appointments?skip=0&limit=20'));
      // No extra params should be present
      expect(apiClient).not.toHaveBeenCalledWith(expect.stringContaining('status='));
    });

    // Start date and end date should fall back to effective dates from backend
    const inputs = container.querySelectorAll('input[type="date"]');
    expect((inputs[0] as HTMLInputElement).value).toBe('2026-10-01');
    expect((inputs[1] as HTMLInputElement).value).toBe('2026-10-01');
  });

  it('initializes filters from URL query parameters', async () => {
    vi.mocked(apiClient).mockImplementation(async (url) => {
      if (url.includes('/doctors')) return [];
      return { data: [], total: 0, skip: 0, limit: 20 };
    });
    const { container } = renderComponent('/staff/appointments?status=CONFIRMED&startDate=2025-01-01&endDate=2025-01-01');
    
    await waitFor(() => {
      expect(apiClient).toHaveBeenCalledWith(expect.stringContaining('startDate=2025-01-01'));
      expect(apiClient).toHaveBeenCalledWith(expect.stringContaining('endDate=2025-01-01'));
    });
    
    // Status filter is the second select element
    const selects = container.querySelectorAll('select');
    expect(selects[1].value).toBe('CONFIRMED');
    
    // Start date is the first date input
    const inputs = container.querySelectorAll('input[type="date"]');
    expect((inputs[0] as HTMLInputElement).value).toBe('2025-01-01');
  });

  it('updates URL and makes new API request when changing filters', async () => {
    vi.mocked(apiClient).mockImplementation(async (url) => {
      if (url.includes('/doctors')) return [];
      return { data: [], total: 0, skip: 0, limit: 20 };
    });
    const { container } = renderComponent('/staff/appointments');
    
    await waitFor(() => {
      expect(apiClient).toHaveBeenCalledWith(expect.stringContaining('/api/v1/appointments?skip=0&limit=20'));
    });

    vi.mocked(apiClient).mockClear();
    
    const selects = container.querySelectorAll('select');
    fireEvent.change(selects[1], { target: { value: 'REQUESTED' } });
    
    const inputs = container.querySelectorAll('input[type="date"]');
    fireEvent.change(inputs[0], { target: { value: '2025-05-05' } });
    
    await waitFor(() => {
      expect(apiClient).toHaveBeenCalledWith(expect.stringContaining('startDate=2025-05-05'));
    });
  });
});
