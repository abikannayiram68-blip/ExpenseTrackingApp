// src/constants/index.ts

export const DEFAULT_CATEGORIES = [
  { name: 'Food & Dining', icon: 'food', color: '#FF6B8A', type: 'expense' },
  { name: 'Travel', icon: 'airplane', color: '#0095FF', type: 'expense' },
  { name: 'Shopping', icon: 'shopping', color: '#A78BFA', type: 'expense' },
  { name: 'Bills & Utilities', icon: 'lightning-bolt', color: '#FFAB2E', type: 'expense' },
  { name: 'Medical', icon: 'hospital-box', color: '#00C48C', type: 'expense' },
  { name: 'Entertainment', icon: 'gamepad-variant', color: '#6C63FF', type: 'expense' },
  { name: 'Education', icon: 'school', color: '#00D4AA', type: 'expense' },
  { name: 'Salary', icon: 'cash', color: '#00C48C', type: 'income' },
  { name: 'Freelance', icon: 'laptop', color: '#0095FF', type: 'income' },
  { name: 'Investment', icon: 'chart-line', color: '#6C63FF', type: 'income' },
  { name: 'Other', icon: 'dots-horizontal-circle', color: '#9CA3AF', type: 'both' },
];

export const PAYMENT_METHODS = [
  { label: 'Cash', value: 'cash', icon: 'cash' },
  { label: 'Card', value: 'card', icon: 'credit-card' },
  { label: 'UPI', value: 'upi', icon: 'cellphone-check' },
  { label: 'Bank Transfer', value: 'bank_transfer', icon: 'bank-transfer' },
  { label: 'Other', value: 'other', icon: 'dots-horizontal' },
];

export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export const CURRENCIES = [
  { label: '₹ Indian Rupee', value: 'INR', symbol: '₹' },
  { label: '$ US Dollar', value: 'USD', symbol: '$' },
  { label: '€ Euro', value: 'EUR', symbol: '€' },
  { label: '£ British Pound', value: 'GBP', symbol: '£' },
];

export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refresh',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',

  // User
  PROFILE: '/users/profile',
  UPDATE_PROFILE: '/users/profile',
  CHANGE_PASSWORD: '/users/change-password',

  // Expenses
  EXPENSES: '/expenses',
  EXPENSE_BY_ID: (id: number) => `/expenses/${id}`,

  // Income
  INCOME: '/income',
  INCOME_BY_ID: (id: number) => `/income/${id}`,

  // Categories
  CATEGORIES: '/categories',
  CATEGORY_BY_ID: (id: number) => `/categories/${id}`,

  // Budgets
  BUDGETS: '/budgets',
  BUDGET_BY_ID: (id: number) => `/budgets/${id}`,

  // Analytics
  DASHBOARD: '/analytics/dashboard',
  MONTHLY_STATS: '/analytics/monthly',
  CATEGORY_BREAKDOWN: '/analytics/categories',
};
