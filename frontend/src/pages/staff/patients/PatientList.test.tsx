import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { PatientList } from './PatientList';
import { apiClient } from '../../../lib/apiClient';

vi.mock('../../../lib/apiClient', () => ({
  apiClient: vi.fn(),
}));

describe('PatientList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const emptyResponse = { total: 0, skip: 0, limit: 50, data: [] };

  it('renders search input and performs initial fetch', async () => {
    vi.mocked(apiClient).mockResolvedValueOnce(emptyResponse);

    render(
      <MemoryRouter>
        <PatientList />
      </MemoryRouter>
    );
    expect(screen.getByPlaceholderText(/search by name/i)).toBeInTheDocument();
    
    await waitFor(() => {
      expect(apiClient).toHaveBeenCalledWith('/api/v1/patients/search?q=&skip=0&limit=50');
    });
  });

  it('searches for patients and renders results', async () => {
    const mockPatients = [
      { id: '1', fullName: 'John Doe', phone: '+15551234' },
      { id: '2', fullName: 'Jane Smith', phone: '+15559876' }
    ];
    vi.mocked(apiClient).mockImplementation(async (url) => {
      if (url.includes('q=John')) return { total: 2, skip: 0, limit: 50, data: mockPatients };
      return emptyResponse;
    });

    render(
      <MemoryRouter>
        <PatientList />
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText(/search by name/i);
    fireEvent.change(input, { target: { value: 'John' } });

    await waitFor(() => {
      expect(apiClient).toHaveBeenCalledWith('/api/v1/patients/search?q=John&skip=0&limit=50');
    });

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });
  });

  it('shows no results state when search returns empty', async () => {
    vi.mocked(apiClient).mockImplementation(async () => emptyResponse);

    render(
      <MemoryRouter>
        <PatientList />
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText(/search by name/i);
    fireEvent.change(input, { target: { value: 'NonExistent' } });

    await waitFor(() => {
      expect(apiClient).toHaveBeenCalledWith('/api/v1/patients/search?q=NonExistent&skip=0&limit=50');
    });

    await waitFor(() => {
      expect(screen.getByText('No patients found')).toBeInTheDocument();
    });
  });

  it('fetches next page on scroll if hasMore', async () => {
    const page1 = { total: 100, skip: 0, limit: 50, data: [{ id: '1', fullName: 'Patient 1', phone: '123' }] };
    const page2 = { total: 100, skip: 50, limit: 50, data: [{ id: '2', fullName: 'Patient 2', phone: '456' }] };
    
    vi.mocked(apiClient).mockImplementation(async (url) => {
      if (url.includes('skip=50')) return page2;
      return page1;
    });

    render(
      <MemoryRouter>
        <PatientList />
      </MemoryRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText('Patient 1')).toBeInTheDocument();
    });

    const listContainer = screen.getByRole('list').parentElement;
    
    // Simulate scroll to bottom
    if (listContainer) {
      Object.defineProperty(listContainer, 'scrollHeight', { configurable: true, value: 1050 });
      Object.defineProperty(listContainer, 'scrollTop', { configurable: true, value: 1000 });
      Object.defineProperty(listContainer, 'clientHeight', { configurable: true, value: 50 });
      import('react').then(({ act }) => {
        act(() => {
          fireEvent.scroll(listContainer);
        });
      });
    }

    await waitFor(() => {
      expect(apiClient).toHaveBeenCalledWith('/api/v1/patients/search?q=&skip=50&limit=50');
      expect(screen.getByText('Patient 1')).toBeInTheDocument(); // still there
      expect(screen.getByText('Patient 2')).toBeInTheDocument(); // appended
    });
  });

  it('prevents duplicate scroll requests while fetching', async () => {
    const page1 = { total: 100, skip: 0, limit: 50, data: [{ id: '1', fullName: 'Patient 1', phone: '123' }] };
    
    // Resolve page1 immediately, but keep page2 unresolved
    let resolvePage2: (val: any) => void;
    const page2Promise = new Promise(resolve => { resolvePage2 = resolve; });
    
    vi.mocked(apiClient).mockImplementation((url: string) => {
      if (url.includes('skip=50')) return page2Promise;
      return Promise.resolve(page1);
    });

    render(
      <MemoryRouter>
        <PatientList />
      </MemoryRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText('Patient 1')).toBeInTheDocument();
    });

    const listContainer = screen.getByRole('list').parentElement;
    
    // Scroll to bottom multiple times
    if (listContainer) {
      Object.defineProperty(listContainer, 'scrollHeight', { configurable: true, value: 1050 });
      Object.defineProperty(listContainer, 'scrollTop', { configurable: true, value: 1000 });
      Object.defineProperty(listContainer, 'clientHeight', { configurable: true, value: 50 });
      fireEvent.scroll(listContainer);
      fireEvent.scroll(listContainer);
      fireEvent.scroll(listContainer);
    }

    await waitFor(() => {
      // apiClient should have been called twice total (1 initial + 1 for page 2)
      expect(apiClient).toHaveBeenCalledTimes(2);
      expect(apiClient).toHaveBeenLastCalledWith('/api/v1/patients/search?q=&skip=50&limit=50');
    });
    
    // Resolve promise to clean up
    resolvePage2!({ total: 100, skip: 50, limit: 50, data: [] });
  });

  it('stops fetching when hasMore is false', async () => {
    const page1 = { total: 2, skip: 0, limit: 50, data: [{ id: '1', fullName: 'P1', phone: '1' }, { id: '2', fullName: 'P2', phone: '2' }] };
    vi.mocked(apiClient).mockResolvedValue(page1);

    render(
      <MemoryRouter>
        <PatientList />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('P1')).toBeInTheDocument();
      expect(screen.getByText('P2')).toBeInTheDocument();
    });
    
    // Reset call count to observe scroll behavior
    vi.mocked(apiClient).mockClear();

    const listContainer = screen.getByRole('list').parentElement;
    
    if (listContainer) {
      Object.defineProperty(listContainer, 'scrollHeight', { configurable: true, value: 1050 });
      Object.defineProperty(listContainer, 'scrollTop', { configurable: true, value: 1000 });
      Object.defineProperty(listContainer, 'clientHeight', { configurable: true, value: 50 });
      import('react').then(({ act }) => {
        act(() => {
          fireEvent.scroll(listContainer);
        });
      });
    }

    // Wait a bit to ensure no API call is made
    await new Promise(r => setTimeout(r, 100));
    expect(apiClient).not.toHaveBeenCalled();
  });

  it('resets pagination and clears old results on query change', async () => {
    const page1Query1 = { total: 1, skip: 0, limit: 50, data: [{ id: '1', fullName: 'Q1 Patient', phone: '962' }] };
    const page1Query2 = { total: 1, skip: 0, limit: 50, data: [{ id: '2', fullName: 'Q2 Patient', phone: '9625' }] };
    
    vi.mocked(apiClient).mockImplementation(async (url: string) => {
      if (url.includes('q=96255')) return emptyResponse;
      if (url.includes('q=9625')) return page1Query2;
      if (url.includes('q=962')) return page1Query1;
      return emptyResponse;
    });

    render(
      <MemoryRouter>
        <PatientList />
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText(/search by name/i);
    
    // Query 1
    fireEvent.change(input, { target: { value: '962' } });
    await waitFor(() => expect(screen.getByText('Q1 Patient')).toBeInTheDocument());

    // Query 2
    fireEvent.change(input, { target: { value: '9625' } });
    await waitFor(() => {
      expect(screen.queryByText('Q1 Patient')).not.toBeInTheDocument();
      expect(screen.getByText('Q2 Patient')).toBeInTheDocument();
      expect(apiClient).toHaveBeenCalledWith('/api/v1/patients/search?q=9625&skip=0&limit=50');
    });

    // Query 3
    fireEvent.change(input, { target: { value: '96255' } });
    await waitFor(() => {
      expect(screen.queryByText('Q2 Patient')).not.toBeInTheDocument();
      expect(screen.getByText('No patients found')).toBeInTheDocument();
    });
  });

  it('ignores stale responses using request ID protection', async () => {
    let resolveQ1: (val: any) => void;
    let resolveQ2: (val: any) => void;
    
    const promiseQ1 = new Promise(resolve => { resolveQ1 = resolve; });
    const promiseQ2 = new Promise(resolve => { resolveQ2 = resolve; });
    
    vi.mocked(apiClient).mockImplementation((url: string) => {
      if (url.includes('q=9625')) return promiseQ2;
      if (url.includes('q=962')) return promiseQ1;
      return Promise.resolve(emptyResponse);
    });

    render(
      <MemoryRouter>
        <PatientList />
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText(/search by name/i);
    
    // 1. Search 962
    fireEvent.change(input, { target: { value: '962' } });
    // 3. Change query to 9625 before 962 resolves
    fireEvent.change(input, { target: { value: '9625' } });
    
    // 4. Resolve the 9625 request first
    resolveQ2!({ total: 1, skip: 0, limit: 50, data: [{ id: '2', fullName: 'Q2 Patient', phone: '9625' }] });
    
    // 5. Verify 9625 patient appears
    await waitFor(() => {
      expect(screen.getByText('Q2 Patient')).toBeInTheDocument();
    });
    
    // 6. Resolve the old 962 request afterward
    resolveQ1!({ total: 1, skip: 0, limit: 50, data: [{ id: '1', fullName: 'Q1 Patient', phone: '962' }] });
    
    // 7. Verify the old 962 result DOES NOT overwrite the 9625 result
    await new Promise(r => setTimeout(r, 100)); // Wait to ensure state doesn't change
    expect(screen.queryByText('Q1 Patient')).not.toBeInTheDocument();
    expect(screen.getByText('Q2 Patient')).toBeInTheDocument();
  });

  it('displays loading state while fetching next page', async () => {
    const page1 = { total: 100, skip: 0, limit: 50, data: [{ id: '1', fullName: 'Patient 1', phone: '123' }] };
    
    let resolvePage2: (val: any) => void;
    const page2Promise = new Promise(resolve => { resolvePage2 = resolve; });
    
    vi.mocked(apiClient).mockImplementation((url: string) => {
      if (url.includes('skip=50')) return page2Promise;
      return Promise.resolve(page1);
    });

    render(
      <MemoryRouter>
        <PatientList />
      </MemoryRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText('Patient 1')).toBeInTheDocument();
    });

    // Verify spinner is not there initially
    let spinner = document.querySelector('.animate-spin');
    expect(spinner).not.toBeInTheDocument();

    const listContainer = screen.getByRole('list').parentElement;
    
    if (listContainer) {
      Object.defineProperty(listContainer, 'scrollHeight', { configurable: true, value: 1050 });
      Object.defineProperty(listContainer, 'scrollTop', { configurable: true, value: 1000 });
      Object.defineProperty(listContainer, 'clientHeight', { configurable: true, value: 50 });
      import('react').then(({ act }) => {
        act(() => {
          fireEvent.scroll(listContainer);
        });
      });
    }

    // Verify spinner appears and page 1 is still visible
    await waitFor(() => {
      spinner = document.querySelector('.animate-spin');
      expect(spinner).toBeInTheDocument();
      expect(screen.getByText('Patient 1')).toBeInTheDocument();
    });

    // Resolve page 2
    resolvePage2!({ total: 100, skip: 50, limit: 50, data: [{ id: '2', fullName: 'Patient 2', phone: '456' }] });

    // Verify spinner disappears and page 2 appends
    await waitFor(() => {
      expect(document.querySelector('.animate-spin')).not.toBeInTheDocument();
      expect(screen.getByText('Patient 1')).toBeInTheDocument();
      expect(screen.getByText('Patient 2')).toBeInTheDocument();
    });
  });
});
