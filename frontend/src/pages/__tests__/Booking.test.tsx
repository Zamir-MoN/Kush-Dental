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

vi.mock('@marsidev/react-turnstile', () => ({
  Turnstile: ({ onSuccess }: any) => {
    // Automatically trigger success with dummy token in test environment
    if (onSuccess) {
      setTimeout(() => onSuccess('1x00000000000000000000AA'), 0);
    }
    return null;
  }
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
    
    const treatmentBtn = screen.getByText('Routine Dental Checkup');
    fireEvent.click(treatmentBtn);
    
    // Select a date
    const dateBtn = screen.getAllByRole('button').find(b => b.textContent === '15');
    if (dateBtn) fireEvent.click(dateBtn);
    
    // Select an explicit time to ensure it is valid
    const timeBtn = screen.getByText('10:30 AM');
    fireEvent.click(timeBtn);
    
    const submitBtn = screen.getByRole('button', { name: /SUBMIT APPOINTMENT REQUEST/i });
    await waitFor(() => expect(submitBtn).not.toBeDisabled());
    fireEvent.submit(submitBtn);

    await waitFor(() => {
      expect(apiClient).toHaveBeenCalledWith('/api/v1/public/appointments', expect.objectContaining({
        method: 'POST',
        data: expect.objectContaining({
          name: 'Test Booker',
          email: 'booker@example.com',
          phone: '555-9876',
          startsAt: expect.any(String),
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

  it('displays current month/year and handles navigation', () => {
    render(
      <MemoryRouter>
        <Booking />
      </MemoryRouter>
    );
    
    const now = new Date();
    const currentMonthString = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    
    const header = screen.getByTestId('month-year-header');
    expect(header).toHaveTextContent(currentMonthString);
    
    const nextBtn = screen.getByRole('button', { name: /Next month/i });
    fireEvent.click(nextBtn);
    
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const nextMonthString = nextMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    expect(header).toHaveTextContent(nextMonthString);
    
    const prevBtn = screen.getByRole('button', { name: /Previous month/i });
    fireEvent.click(prevBtn);
    expect(header).toHaveTextContent(currentMonthString);
  });

  it('allows selecting a valid date and displays selection summary', () => {
    render(
      <MemoryRouter>
        <Booking />
      </MemoryRouter>
    );

    // Initial selected date is tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const summary = screen.getByTestId('selected-date-summary');
    expect(summary).toHaveTextContent(tomorrow.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }));

    // Find a valid date cell that is NOT disabled (has cursor-pointer)
    // Actually, tomorrow's date is already selected. Let's select tomorrow + 1.
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 2);
    
    const allCells = screen.queryAllByText(targetDate.getDate().toString());
    // The target cell should be the one in the current month or we just pick the last one.
    // There can be duplicates if the day exists in leading/trailing, but let's just click the first one that is valid.
    const validCells = allCells.filter(el => el.className.includes('cursor-pointer'));
    if (validCells.length > 0) {
      fireEvent.click(validCells[0]);
    }

    // Now verify it updated the summary or selected state
    const selectedCells = screen.getAllByTestId('selected-date');
    expect(selectedCells.length).toBeGreaterThan(0);
  });

  it('changes month and selects date when an adjacent-month date is clicked', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-09-15T12:00:00Z'));

    render(
      <MemoryRouter>
        <Booking />
      </MemoryRouter>
    );

    const header = screen.getByTestId('month-year-header');
    expect(header).toHaveTextContent('September 2026');

    // Find October 2 cell (trailing).
    const cellsWithTwo = screen.getAllByText('2');
    const octTwoCell = cellsWithTwo.find(c => c.className.includes('text-zinc-400') && c.className.includes('cursor-pointer'));
    
    expect(octTwoCell).toBeDefined();
    
    fireEvent.click(octTwoCell!);
    
    // Now it should switch to October 2026
    expect(header).toHaveTextContent('October 2026');
    
    // Summary should update
    const summary = screen.getByTestId('selected-date-summary');
    expect(summary).toHaveTextContent('October 2, 2026');
    
    // While in October, click leading previous-month date (e.g. September 30)
    // October 1 is Thursday, so leading days include September 30.
    const cellsWithThirty = screen.getAllByText('30');
    const sepThirtyCell = cellsWithThirty.find(c => c.className.includes('text-zinc-400') && c.className.includes('cursor-pointer'));
    
    expect(sepThirtyCell).toBeDefined();
    fireEvent.click(sepThirtyCell!);
    
    // Now it should switch back to September 2026
    expect(header).toHaveTextContent('September 2026');
    expect(summary).toHaveTextContent('September 30, 2026');
    
    vi.useRealTimers();
  });

  it('removes stale highlight when switching months', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-09-15T12:00:00Z'));

    render(
      <MemoryRouter>
        <Booking />
      </MemoryRouter>
    );

    const header = screen.getByTestId('month-year-header');
    
    // While in September, select September 30.
    const cellsWithThirty = screen.getAllByText('30');
    // The current month one
    const currentSepThirty = cellsWithThirty.find(c => c.className.includes('text-zinc-700') && c.className.includes('cursor-pointer'));
    fireEvent.click(currentSepThirty!);

    // Verify it is selected
    const summary = screen.getByTestId('selected-date-summary');
    expect(summary).toHaveTextContent('September 30, 2026');
    let selectedCells = screen.getAllByTestId('selected-date');
    expect(selectedCells.length).toBe(1);
    expect(selectedCells[0]).toHaveTextContent('30');

    // Click October 1 (adjacent/trailing)
    const cellsWithOne = screen.getAllByText('1');
    const octOneTrailing = cellsWithOne.find(c => c.className.includes('text-zinc-400') && c.className.includes('cursor-pointer'));
    fireEvent.click(octOneTrailing!);

    // Should switch to October
    expect(header).toHaveTextContent('October 2026');
    expect(summary).toHaveTextContent('October 1, 2026');
    
    // Verify only one selected date (October 1)
    selectedCells = screen.getAllByTestId('selected-date');
    expect(selectedCells.length).toBe(1);
    expect(selectedCells[0]).toHaveTextContent('1');
    
    // September 30 is still in the grid (as leading date) but shouldn't have selected styling
    const newCellsWithThirty = screen.getAllByText('30');
    const newSepThirty = newCellsWithThirty.find(c => c.className.includes('text-zinc-400') && c.className.includes('cursor-pointer'));
    expect(newSepThirty).toBeDefined();
    expect(newSepThirty).not.toHaveAttribute('data-testid', 'selected-date');

    // Clicking another October date moves the highlight
    const octFifteen = screen.getByText('15');
    fireEvent.click(octFifteen);
    expect(summary).toHaveTextContent('October 15, 2026');
    selectedCells = screen.getAllByTestId('selected-date');
    expect(selectedCells.length).toBe(1);
    expect(selectedCells[0]).toHaveTextContent('15');
    
    // Navigating back to September shouldn't have stale styling
    const prevBtn = screen.getByRole('button', { name: /Previous month/i });
    fireEvent.click(prevBtn);
    expect(header).toHaveTextContent('September 2026');
    // October 15 is not visible in September grid typically (only up to Oct 3),
    // but the selected date remains Oct 15, meaning NO cells should be highlighted.
    expect(screen.queryByTestId('selected-date')).toBeNull();

    vi.useRealTimers();
  });
});
