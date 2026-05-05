import { describe, it, expect } from 'vitest';
import { formatDate, formatDateRange, tripDays, formatCost } from '../src/lib/format';

describe('format helpers', () => {
  describe('tripDays', () => {
    it('counts a single-day trip as 1', () => {
      expect(tripDays('2026-05-10', '2026-05-10')).toBe(1);
    });

    it('counts a 3-day weekend correctly', () => {
      expect(tripDays('2026-05-10', '2026-05-12')).toBe(3);
    });

    it('handles a full week', () => {
      expect(tripDays('2026-05-10', '2026-05-16')).toBe(7);
    });
  });

  describe('formatDate', () => {
    it('formats an ISO date in Hungarian', () => {
      const out = formatDate('2026-05-10');
      expect(out).toMatch(/2026/);
      expect(out).toMatch(/10/);
    });
  });

  describe('formatDateRange', () => {
    it('uses compact form when start and end are in the same month', () => {
      const out = formatDateRange('2026-05-10', '2026-05-12');
      expect(out).toContain('–');
      expect(out).toContain('2026');
    });

    it('shows both months when range spans two months', () => {
      const out = formatDateRange('2026-05-30', '2026-06-02');
      expect(out).toContain('–');
    });
  });

  describe('formatCost', () => {
    it('returns empty string for null/undefined', () => {
      expect(formatCost(null)).toBe('');
      expect(formatCost(undefined)).toBe('');
    });

    it('formats a number as HUF currency', () => {
      const out = formatCost(1500);
      expect(out).toMatch(/1\s?500/);
      expect(out).toMatch(/Ft/i);
    });
  });
});
