import {
  formatCurrency,
  formatDate,
  isToday,
  isThisMonth,
  getDateRange,
  validateEmail,
  validatePassword,
  validateAmount,
  calculateBudgetPercentage,
  getBudgetStatus,
  getInitials,
  groupByDate,
} from '../utils';

describe('utils module', () => {
  describe('formatCurrency', () => {
    it('formats values in INR without decimals', () => {
      expect(formatCurrency(1500)).toBe('₹1,500');
    });

    it('formats large values in compact mode using K', () => {
      expect(formatCurrency(25000, 'INR', true)).toBe('₹25.0K');
    });

    it('formats lakhs in compact mode using L', () => {
      expect(formatCurrency(250000, 'INR', true)).toBe('₹2.5L');
    });
  });

  describe('formatDate and date helpers', () => {
    it('formats a date string using the default format', () => {
      expect(formatDate('2026-06-01')).toBe('01 Jun 2026');
    });

    it('detects today and current month correctly', () => {
      const now = new Date();
      expect(isToday(now)).toBe(true);
      expect(isThisMonth(now)).toBe(true);
    });

    it('returns a valid date range for month and year', () => {
      const range = getDateRange('month');
      expect(range.startDate).toMatch(/\d{4}-\d{2}-\d{2}/);
      expect(range.endDate).toMatch(/\d{4}-\d{2}-\d{2}/);
    });
  });

  describe('validation helpers', () => {
    it('returns true for a valid email', () => {
      expect(validateEmail('alice@example.com')).toBe(true);
    });

    it('returns false for an invalid email', () => {
      expect(validateEmail('alice@com')).toBe(false);
    });

    it('returns null for a strong valid password', () => {
      expect(validatePassword('StrongPass1')).toBeNull();
    });

    it('returns an error message when password is too short', () => {
      expect(validatePassword('S1a')).toBe('Password must be at least 8 characters');
    });

    it('validates positive amount values correctly', () => {
      expect(validateAmount('100')).toBe(true);
      expect(validateAmount('0')).toBe(false);
      expect(validateAmount('-5')).toBe(false);
      expect(validateAmount('NaN')).toBe(false);
    });
  });

  describe('budget calculations', () => {
    it('calculates percentage and returns safe status below 70', () => {
      expect(calculateBudgetPercentage(50, 200)).toBe(25);
      expect(getBudgetStatus(25)).toBe('safe');
    });

    it('returns warning when percentage is between 70 and 89', () => {
      expect(getBudgetStatus(75)).toBe('warning');
    });

    it('returns danger when percentage is 90 or above', () => {
      expect(getBudgetStatus(95)).toBe('danger');
    });
  });

  describe('getInitials', () => {
    it('returns initials for a two-word name', () => {
      expect(getInitials('John Doe')).toBe('JD');
    });

    it('returns a single initial for a single-word name', () => {
      expect(getInitials('Madonna')).toBe('M');
    });
  });

  describe('groupByDate', () => {
    it('groups items by date string keys', () => {
      const items = [
        { date: '2026-06-01', value: 1 },
        { date: '2026-06-01', value: 2 },
        { date: '2026-06-02', value: 3 },
      ];
      const grouped = groupByDate(items);

      expect(Object.keys(grouped)).toContain('2026-06-01');
      expect(grouped['2026-06-01']).toHaveLength(2);
      expect(grouped['2026-06-02'][0].value).toBe(3);
    });
  });
});
