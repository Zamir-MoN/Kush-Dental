import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ContactList } from '../ContactList';
import { apiClient } from '../../../../lib/apiClient';

vi.mock('../../../../lib/apiClient', () => ({
  apiClient: vi.fn()
}));

const mockData = {
  total: 0,
  skip: 0,
  limit: 20,
  data: []
};

describe('ContactList Filters Deep Linking', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  const renderComponent = (initialUrl = '/staff/contacts') => {
    return render(
      <MemoryRouter initialEntries={[initialUrl]}>
        <Routes>
          <Route path="/staff/contacts" element={<ContactList />} />
        </Routes>
      </MemoryRouter>
    );
  };

  it('initializes default filters from empty URL and makes basic API request', async () => {
    vi.mocked(apiClient).mockResolvedValue(mockData);
    renderComponent('/staff/contacts');
    
    await waitFor(() => {
      expect(apiClient).toHaveBeenCalledWith('/api/v1/contacts?skip=0&limit=20');
      expect(apiClient).not.toHaveBeenCalledWith(expect.stringContaining('status='));
    });
  });

  it('initializes filters from URL query parameters', async () => {
    vi.mocked(apiClient).mockResolvedValue(mockData);
    renderComponent('/staff/contacts?status=OPEN');
    
    await waitFor(() => {
      expect(apiClient).toHaveBeenCalledWith('/api/v1/contacts?skip=0&limit=20&status=OPEN');
    });
    
    const statusSelect = screen.getByRole('combobox') as HTMLSelectElement;
    expect(statusSelect.value).toBe('OPEN');
  });

  it('updates URL and makes new API request when changing filters', async () => {
    vi.mocked(apiClient).mockResolvedValue(mockData);
    renderComponent('/staff/contacts');
    
    await waitFor(() => {
      expect(apiClient).toHaveBeenCalledWith('/api/v1/contacts?skip=0&limit=20');
    });

    vi.mocked(apiClient).mockClear();
    
    const statusSelect = screen.getByRole('combobox') as HTMLSelectElement;
    fireEvent.change(statusSelect, { target: { value: 'IN_PROGRESS' } });
    
    await waitFor(() => {
      expect(apiClient).toHaveBeenCalledWith(expect.stringContaining('status=IN_PROGRESS'));
    });
  });
});
