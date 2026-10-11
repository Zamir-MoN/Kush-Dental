import { describe, it, expect } from 'vitest';
import { formatTime12Hour, CLINIC_HOURS } from './clinicHours';

describe('clinicHours', () => {
  describe('formatTime12Hour', () => {
    it('converts 08:00 to 8:00 AM', () => {
      expect(formatTime12Hour('08:00')).toBe('8:00 AM');
    });

    it('converts 19:00 to 7:00 PM', () => {
      expect(formatTime12Hour('19:00')).toBe('7:00 PM');
    });

    it('converts 18:00 to 6:00 PM', () => {
      expect(formatTime12Hour('18:00')).toBe('6:00 PM');
    });

    it('converts 09:00 to 9:00 AM', () => {
      expect(formatTime12Hour('09:00')).toBe('9:00 AM');
    });

    it('converts 16:00 to 4:00 PM', () => {
      expect(formatTime12Hour('16:00')).toBe('4:00 PM');
    });

    it('converts 12:00 to 12:00 PM', () => {
      expect(formatTime12Hour('12:00')).toBe('12:00 PM');
    });

    it('converts 00:00 to 12:00 AM', () => {
      expect(formatTime12Hour('00:00')).toBe('12:00 AM');
    });
  });

  describe('CLINIC_HOURS data', () => {
    it('contains exactly 7 days', () => {
      expect(CLINIC_HOURS.length).toBe(7);
    });

    it('has Sunday as BY CONCIERGE', () => {
      const sunday = CLINIC_HOURS.find(d => d.day === 'Sunday');
      expect(sunday).toBeDefined();
      expect(sunday?.isConcierge).toBe(true);
    });
  });
});
