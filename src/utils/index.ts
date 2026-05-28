// src/utils/index.ts
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

// ─── Currency ─────────────────────────────────────────────────────────────────

export const formatCurrency = (
  amount: number,
  currency = 'INR',
  compact = false
): string => {
  if (compact && Math.abs(amount) >= 100000) {
    return `₹${(amount / 100000).toFixed(1)}L`;
  }
  if (compact && Math.abs(amount) >= 1000) {
    return `₹${(amount / 1000).toFixed(1)}K`;
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// ─── Date ─────────────────────────────────────────────────────────────────────

export const formatDate = (date: string | Date, format = 'DD MMM YYYY'): string =>
  dayjs(date).format(format);

export const formatRelativeDate = (date: string | Date): string => dayjs(date).fromNow();

export const isToday = (date: string | Date): boolean =>
  dayjs(date).isSame(dayjs(), 'day');

export const isThisMonth = (date: string | Date): boolean =>
  dayjs(date).isSame(dayjs(), 'month');

export const getDateRange = (period: 'week' | 'month' | 'year') => {
  const now = dayjs();
  return {
    startDate: now.startOf(period).format('YYYY-MM-DD'),
    endDate: now.endOf(period).format('YYYY-MM-DD'),
  };
};

// ─── Validation ───────────────────────────────────────────────────────────────

export const validateEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

export const validatePassword = (password: string): string | null => {
  if (password.length < 8) return 'Password must be at least 8 characters';
  if (!/[A-Z]/.test(password)) return 'Must contain an uppercase letter';
  if (!/[0-9]/.test(password)) return 'Must contain a number';
  return null;
};

export const validateAmount = (value: string): boolean => {
  const num = parseFloat(value);
  return !isNaN(num) && num > 0 && num < 10_000_000;
};

// ─── Misc ─────────────────────────────────────────────────────────────────────

export const getInitials = (name: string): string =>
  name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');

export const groupByDate = <T extends { date: string }>(items: T[]): Record<string, T[]> =>
  items.reduce((groups, item) => {
    const key = dayjs(item.date).format('YYYY-MM-DD');
    return { ...groups, [key]: [...(groups[key] ?? []), item] };
  }, {} as Record<string, T[]>);

export const calculateBudgetPercentage = (spent: number, total: number): number => {
  if (total <= 0) return 0;
  return Math.min(Math.round((spent / total) * 100), 100);
};

export const getBudgetStatus = (percentage: number): 'safe' | 'warning' | 'danger' => {
  if (percentage >= 90) return 'danger';
  if (percentage >= 70) return 'warning';
  return 'safe';
};
