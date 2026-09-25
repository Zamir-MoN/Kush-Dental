import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Users } from '../Users';
import { apiClient } from '../../../lib/apiClient';
import { useAuth } from '../../../context/AuthContext';

vi.mock('../../../lib/apiClient', () => ({
  apiClient: vi.fn(),
}));

vi.mock('../../../context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

describe('Users Directory', () => {
  const mockAuthUser = { id: 'doctor1', email: 'maindoc@test.com', role: 'DOCTOR' };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAuth).mockReturnValue({ user: mockAuthUser } as any);
  });

  const emptyResponse = { total: 0, skip: 0, limit: 50, data: [] };
  
  const mockUsers = [
    { id: 'doctor1', email: 'maindoc@test.com', role: 'DOCTOR', createdAt: '2023-01-01T00:00:00Z', updatedAt: '2023-01-01T00:00:00Z' },
    { id: 'staff1', email: 'staff@test.com', role: 'STAFF', createdAt: '2023-01-02T00:00:00Z', updatedAt: '2023-01-02T00:00:00Z' }
  ];

  describe('Regression / Infinite Scroll', () => {
    it('renders initial loading state and fetches users with skip=0, limit=50', async () => {
      vi.mocked(apiClient).mockReturnValue(new Promise(() => {}));
      render(<MemoryRouter><Users /></MemoryRouter>);
      expect(screen.getAllByText('Users Directory')[0]).toBeInTheDocument();
      expect(apiClient).toHaveBeenCalledWith('/api/v1/users?skip=0&limit=50');
    });

    it('renders users and correct role badges', async () => {
      vi.mocked(apiClient).mockResolvedValue({ total: 2, skip: 0, limit: 50, data: mockUsers });
      render(<MemoryRouter><Users /></MemoryRouter>);
      
      await waitFor(() => {
        expect(screen.getAllByText('maindoc@test.com')[0]).toBeInTheDocument();
        expect(screen.getAllByText('staff@test.com')[0]).toBeInTheDocument();
      });
      
      expect(screen.getAllByText('Doctor')[0]).toBeInTheDocument();
      expect(screen.getAllByText('Staff')[0]).toBeInTheDocument();
      
      const html = document.body.innerHTML;
      expect(html).not.toContain('passwordHash');
      expect(html).not.toContain('token');
    });

    it('shows no users found state', async () => {
      vi.mocked(apiClient).mockResolvedValue(emptyResponse);
      render(<MemoryRouter><Users /></MemoryRouter>);
      await waitFor(() => {
        expect(screen.getAllByText('No users found')[0]).toBeInTheDocument();
      });
    });

    it('shows error state on API failure', async () => {
      vi.mocked(apiClient).mockRejectedValue(new Error('Network Error'));
      render(<MemoryRouter><Users /></MemoryRouter>);
      await waitFor(() => {
        expect(screen.getAllByText('Network Error')[0]).toBeInTheDocument();
      });
    });

    it('handles infinite scroll: fetches next page and appends', async () => {
      const page1 = { total: 100, skip: 0, limit: 50, data: [{ id: '1', email: 'u1@test.com', role: 'DOCTOR', createdAt: '2023-01-01' }] };
      const page2 = { total: 100, skip: 50, limit: 50, data: [{ id: '2', email: 'u2@test.com', role: 'STAFF', createdAt: '2023-01-01' }] };
      
      vi.mocked(apiClient).mockImplementation(async (url) => {
        if (url.includes('skip=50')) return page2;
        return page1;
      });

      render(<MemoryRouter><Users /></MemoryRouter>);
      await waitFor(() => {
        expect(screen.getAllByText('u1@test.com')[0]).toBeInTheDocument();
      });
      
      const listContainer = screen.getByRole('table').parentElement!;
      Object.defineProperty(listContainer, 'scrollHeight', { value: 1000, configurable: true });
      Object.defineProperty(listContainer, 'scrollTop', { value: 500, configurable: true });
      Object.defineProperty(listContainer, 'clientHeight', { value: 500, configurable: true });
      
      fireEvent.scroll(listContainer);
      
      await waitFor(() => {
        expect(apiClient).toHaveBeenCalledWith('/api/v1/users?skip=50&limit=50');
      });
      
      await waitFor(() => {
        expect(screen.getAllByText('u1@test.com')[0]).toBeInTheDocument();
        expect(screen.getAllByText('u2@test.com')[0]).toBeInTheDocument();
      });
    });

    it('prevents duplicate page requests', async () => {
      let resolvePage2: any;
      const page2Promise = new Promise(r => resolvePage2 = r);
      const page1 = { total: 100, skip: 0, limit: 50, data: [{ id: '1', email: 'u1@test.com', role: 'STAFF', createdAt: '2023-01-01' }] };
      
      vi.mocked(apiClient).mockImplementation(async (url) => {
        if (url.includes('skip=50')) return page2Promise;
        return page1;
      });

      render(<MemoryRouter><Users /></MemoryRouter>);
      
      await waitFor(() => expect(screen.getAllByText('u1@test.com')[0]).toBeInTheDocument());
      
      const listContainer = screen.getByRole('table').parentElement!;
      Object.defineProperty(listContainer, 'scrollHeight', { value: 1000, configurable: true });
      Object.defineProperty(listContainer, 'scrollTop', { value: 500, configurable: true });
      Object.defineProperty(listContainer, 'clientHeight', { value: 500, configurable: true });
      
      fireEvent.scroll(listContainer);
      fireEvent.scroll(listContainer);
      
      await waitFor(() => expect(apiClient).toHaveBeenCalledWith('/api/v1/users?skip=50&limit=50'));
      
      const page2Calls = vi.mocked(apiClient).mock.calls.filter(args => (args[0] as string).includes('skip=50'));
      expect(page2Calls.length).toBe(1);
      
      resolvePage2({ total: 100, skip: 50, limit: 50, data: [] });
    });
  });

  describe('Edit User UI', () => {
    it('Edit button renders and opens modal with populated data', async () => {
      vi.mocked(apiClient).mockResolvedValue({ total: 2, skip: 0, limit: 50, data: mockUsers });
      render(<MemoryRouter><Users /></MemoryRouter>);
      
      await waitFor(() => expect(screen.getAllByText('staff@test.com')[0]).toBeInTheDocument());
      
      const editButtons = screen.getAllByText('Edit');
      expect(editButtons.length).toBe(2);
      
      fireEvent.click(editButtons[1]); // Click Edit for staff
      
      await waitFor(() => expect(screen.getByText('Edit User')).toBeInTheDocument());
      expect(screen.getByDisplayValue('staff@test.com')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Staff')).toBeInTheDocument();
      
      // ADMIN is not offered
      const select = screen.getByRole('combobox');
      expect(select).not.toHaveTextContent('Admin');
    });

    it('Valid email and role update sends PATCH with only supported fields', async () => {
      vi.mocked(apiClient).mockImplementation(async (url, options) => {
        if (url.includes('/api/v1/users/staff1') && options?.method === 'PATCH') {
          return { id: 'staff1', email: 'newstaff@test.com', role: 'DOCTOR', createdAt: '2023-01-02T00:00:00Z', updatedAt: '2023-01-03T00:00:00Z' };
        }
        return { total: 2, skip: 0, limit: 50, data: mockUsers };
      });
      render(<MemoryRouter><Users /></MemoryRouter>);
      
      await waitFor(() => expect(screen.getAllByText('staff@test.com')[0]).toBeInTheDocument());
      fireEvent.click(screen.getAllByText('Edit')[1]);
      
      const emailInput = screen.getByLabelText('Email Address');
      fireEvent.change(emailInput, { target: { value: ' newstaff@test.com ' } }); // Tests trim
      
      const roleSelect = screen.getByLabelText('Role');
      fireEvent.change(roleSelect, { target: { value: 'DOCTOR' } });
      
      fireEvent.click(screen.getByText('Save Changes'));
      
      await waitFor(() => {
        expect(apiClient).toHaveBeenCalledWith('/api/v1/users/staff1', expect.objectContaining({
          method: 'PATCH',
          data: { email: 'newstaff@test.com', role: 'DOCTOR' }
        }));
      });
      
      // Check successful update
      await waitFor(() => {
        expect(screen.queryByText('Edit User')).not.toBeInTheDocument(); // modal closed
        expect(screen.getAllByText('newstaff@test.com')[0]).toBeInTheDocument();
      });
    });

    it('Displays saving state during PATCH', async () => {
      let resolvePatch: any;
      const patchPromise = new Promise(r => resolvePatch = r);
      
      vi.mocked(apiClient).mockImplementation(async (_url, options) => {
        if (options?.method === 'PATCH') return patchPromise;
        return { total: 2, skip: 0, limit: 50, data: mockUsers };
      });
      
      render(<MemoryRouter><Users /></MemoryRouter>);
      await waitFor(() => expect(screen.getAllByText('staff@test.com')[0]).toBeInTheDocument());
      fireEvent.click(screen.getAllByText('Edit')[1]);
      
      const emailInput = screen.getByLabelText('Email Address');
      fireEvent.change(emailInput, { target: { value: 'newstaff@test.com' } });
      
      const saveBtn = screen.getByRole('button', { name: /save changes/i });
      fireEvent.click(saveBtn);
      
      await waitFor(() => {
        expect(saveBtn).toBeDisabled();
      });
      
      resolvePatch({ id: 'staff1', email: 'newstaff@test.com', role: 'STAFF' });
    });

    it('Displays useful error on PATCH 409 conflict and keeps modal open', async () => {
      vi.mocked(apiClient).mockImplementation(async (_url, options) => {
        if (options?.method === 'PATCH') throw new Error('Email already in use');
        return { total: 2, skip: 0, limit: 50, data: mockUsers };
      });
      
      render(<MemoryRouter><Users /></MemoryRouter>);
      await waitFor(() => expect(screen.getAllByText('staff@test.com')[0]).toBeInTheDocument());
      fireEvent.click(screen.getAllByText('Edit')[1]);
      
      fireEvent.change(screen.getByLabelText('Email Address'), { target: { value: 'conflict@test.com' } });
      fireEvent.click(screen.getByText('Save Changes'));
      
      await waitFor(() => {
        expect(screen.getByText('Email already in use')).toBeInTheDocument();
        expect(screen.getByText('Edit User')).toBeInTheDocument(); // modal still open
      });
    });

    it('Displays useful error on PATCH 422 unprocessable entity', async () => {
      vi.mocked(apiClient).mockImplementation(async (_url, options) => {
        if (options?.method === 'PATCH') throw new Error('Invalid email format');
        return { total: 2, skip: 0, limit: 50, data: mockUsers };
      });
      
      render(<MemoryRouter><Users /></MemoryRouter>);
      await waitFor(() => expect(screen.getAllByText('staff@test.com')[0]).toBeInTheDocument());
      fireEvent.click(screen.getAllByText('Edit')[1]);
      fireEvent.change(screen.getByLabelText('Email Address'), { target: { value: 'invalid@test.com' } });
      fireEvent.click(screen.getByText('Save Changes'));
      
      await waitFor(() => {
        expect(screen.getByText('Invalid email format')).toBeInTheDocument();
      });
    });
  });

  describe('Self-role protection', () => {
    it('Current Doctor cannot downgrade own role to STAFF but can edit email', async () => {
      vi.mocked(apiClient).mockResolvedValue({ total: 2, skip: 0, limit: 50, data: mockUsers });
      render(<MemoryRouter><Users /></MemoryRouter>);
      
      await waitFor(() => expect(screen.getAllByText('maindoc@test.com')[0]).toBeInTheDocument());
      
      fireEvent.click(screen.getAllByText('Edit')[0]); // Click Edit for self (doctor1)
      
      await waitFor(() => expect(screen.getByText('Edit User')).toBeInTheDocument());
      
      const roleSelect = screen.getByLabelText('Role') as HTMLSelectElement;
      const staffOption = Array.from(roleSelect.options).find(o => o.value === 'STAFF');
      expect(staffOption).toBeDisabled();
      
      expect(screen.getByText('You cannot downgrade your own role to Staff.')).toBeInTheDocument();
      
      // But email is editable
      const emailInput = screen.getByLabelText('Email Address');
      expect(emailInput).not.toBeDisabled();
    });
  });

  describe('Deactivation UI', () => {
    it('Deactivate button renders for other active users', async () => {
      vi.mocked(apiClient).mockResolvedValue({ total: 2, skip: 0, limit: 50, data: mockUsers });
      render(<MemoryRouter><Users /></MemoryRouter>);
      await waitFor(() => expect(screen.getAllByText('staff@test.com')[0]).toBeInTheDocument());
      
      const deactivateButtons = screen.getAllByText('Deactivate');
      expect(deactivateButtons.length).toBe(1); // Only for staff, not for self
    });

    it('Confirmation dialog appears and Cancelling does not call DELETE', async () => {
      vi.mocked(apiClient).mockResolvedValue({ total: 2, skip: 0, limit: 50, data: mockUsers });
      render(<MemoryRouter><Users /></MemoryRouter>);
      await waitFor(() => expect(screen.getAllByText('staff@test.com')[0]).toBeInTheDocument());
      
      fireEvent.click(screen.getByText('Deactivate'));
      
      await waitFor(() => expect(screen.getByText('Deactivate User')).toBeInTheDocument());
      
      fireEvent.click(screen.getByText('Cancel'));
      
      await waitFor(() => expect(screen.queryByText('Deactivate User')).not.toBeInTheDocument());
      
      const deleteCalls = vi.mocked(apiClient).mock.calls.filter(args => args[1]?.method === 'DELETE');
      expect(deleteCalls.length).toBe(0);
    });

    it('Confirming calls DELETE with correct user ID and removes user from list', async () => {
      vi.mocked(apiClient).mockImplementation(async (_url, options) => {
        if (options?.method === 'DELETE') return { success: true };
        return { total: 2, skip: 0, limit: 50, data: mockUsers };
      });
      render(<MemoryRouter><Users /></MemoryRouter>);
      await waitFor(() => expect(screen.getAllByText('staff@test.com')[0]).toBeInTheDocument());
      
      fireEvent.click(screen.getByText('Deactivate'));
      await waitFor(() => expect(screen.getByText('Deactivate User')).toBeInTheDocument());
      
      fireEvent.click(screen.getAllByText('Deactivate')[1]); // The confirm button
      
      await waitFor(() => {
        expect(apiClient).toHaveBeenCalledWith('/api/v1/users/staff1', expect.objectContaining({ method: 'DELETE' }));
        expect(screen.queryByText('Deactivate User')).not.toBeInTheDocument();
        expect(screen.queryByText('staff@test.com')).not.toBeInTheDocument();
        expect(screen.getAllByText('maindoc@test.com')[0]).toBeInTheDocument(); // Still there
      });
    });

    it('Displays loading state during DELETE and handles errors properly', async () => {
      let rejectDelete: any;
      const deletePromise = new Promise((_, rej) => { rejectDelete = rej; });
      
      vi.mocked(apiClient).mockImplementation(async (_url, options) => {
        if (options?.method === 'DELETE') return deletePromise;
        return { total: 2, skip: 0, limit: 50, data: mockUsers };
      });
      
      render(<MemoryRouter><Users /></MemoryRouter>);
      await waitFor(() => expect(screen.getAllByText('staff@test.com')[0]).toBeInTheDocument());
      fireEvent.click(screen.getByText('Deactivate'));
      
      const confirmBtns = screen.getAllByText('Deactivate');
      fireEvent.click(confirmBtns[1]);
      
      await waitFor(() => {
        expect(confirmBtns[1]).toBeDisabled();
      });
      
      // Simulate error
      rejectDelete(new Error('Cannot deactivate user'));
      
      await waitFor(() => {
        expect(screen.getByText('Cannot deactivate user')).toBeInTheDocument();
        expect(screen.getByText('Deactivate User')).toBeInTheDocument(); // modal still open
      });
    });
  });
});
