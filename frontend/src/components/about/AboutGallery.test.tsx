import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AboutGallery } from './AboutGallery';


// Mock the GSAP hooks to prevent errors in test environment
vi.mock('../../hooks/useGsap', () => ({
  useScrollReveal: vi.fn(),
  useGsapFade: vi.fn(),
  useGsapStagger: vi.fn()
}));

// Mock IntersectionObserver
const mockIntersectionObserver = vi.fn();
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null
});
window.IntersectionObserver = mockIntersectionObserver;

describe('AboutGallery component', () => {
  it('horizontal selector renders all items', () => {
    render(<AboutGallery />);
    const categories = ['View All', 'Treatment Suites', 'Patient Lounge', 'Digital 3D Labs', 'Sterilization'];
    
    // Check if all category buttons render
    categories.forEach(category => {
      expect(screen.getByText(category)).toBeInTheDocument();
    });
  });

  it('scroll container has sufficient content width/padding layout classes', () => {
    const { container } = render(<AboutGallery />);
    // The wrapper of the filter pills should have overflow-x-auto
    const scrollContainer = container.querySelector('.overflow-x-auto');
    expect(scrollContainer).toBeInTheDocument();
    expect(scrollContainer).toHaveClass('w-full', 'overflow-x-auto');

    // The inner track should use safe-center layout without clipping
    const innerTrack = scrollContainer?.querySelector('.w-max');
    expect(innerTrack).toBeInTheDocument();
    expect(innerTrack).toHaveClass('w-max', 'inline-flex');
  });

  it('existing tab selection behavior still works', async () => {
    const { waitFor } = await import('@testing-library/react');
    render(<AboutGallery />);
    
    // Select Patient Lounge
    const btn = screen.getByRole('button', { name: /Patient Lounge/i });
    fireEvent.click(btn);
    
    // Filtered gallery should only show Serene Patient Lounge
    await waitFor(() => {
      expect(screen.getByText('Serene Patient Lounge')).toBeInTheDocument();
      // Treatment suites should be hidden
      expect(screen.queryByText('Private Operatory Suite')).not.toBeInTheDocument();
    });
  });
});
