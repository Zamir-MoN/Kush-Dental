import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { BrowserRouter } from 'react-router-dom';
import { ContactList } from '../ContactList';
import { AuthProvider } from '../../../../context/AuthContext';
import { vi, describe, it, expect, beforeEach } from 'vitest';

vi.mock('../../../../lib/apiClient', () => ({
  apiClient: vi.fn(),
  setAccessToken: vi.fn()
}));

import { apiClient } from '../../../../lib/apiClient';

describe('ContactList Component', () => {
  const mockContacts = {
    total: 1,
    skip: 0,
    limit: 20,
    data: [
      {
        id: '123',
        status: 'OPEN',
        createdAt: '2026-09-22T00:00:00Z',
        nextFollowUpAt: '2026-09-23T00:00:00Z',
        patient: { fullName: 'John Doe', phone: '1234567890' },
        lead: null,
        appointment: null
      }
    ]
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders contacts successfully', async () => {
    (apiClient as any).mockResolvedValueOnce(mockContacts);

    render(
      <BrowserRouter>
        <AuthProvider>
          <ContactList />
        </AuthProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('OPEN')).toBeInTheDocument();
    });
  });

  it('displays empty state when no contacts', async () => {
    (apiClient as any).mockResolvedValueOnce({ total: 0, skip: 0, limit: 20, data: [] });

    render(
      <BrowserRouter>
        <AuthProvider>
          <ContactList />
        </AuthProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/No follow-ups found/i)).toBeInTheDocument();
    });
  });
});
