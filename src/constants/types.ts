// src/constants/types.ts

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  currency: string;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// ─── Category ─────────────────────────────────────────────────────────────────

export interface Category {
  id: number;
  name: string;
  icon: string;
  color: string;
  type: 'expense' | 'income' | 'both';
  isDefault: boolean;
  userId?: number;
}

// ─── Expense ──────────────────────────────────────────────────────────────────

export type PaymentMethod = 'cash' | 'card' | 'upi' | 'bank_transfer' | 'other';

export interface Expense {
  id: number;
  userId: number;
  categoryId: number;
  category?: Category;
  amount: number;
  description: string;
  date: string;
  paymentMethod: PaymentMethod;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateExpensePayload {
  categoryId: number;
  amount: number;
  description: string;
  date: string;
  paymentMethod: PaymentMethod;
  notes?: string;
}

// ─── Income ───────────────────────────────────────────────────────────────────

export interface Income {
  id: number;
  userId: number;
  amount: number;
  source: string;
  date: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateIncomePayload {
  amount: number;
  source: string;
  date: string;
  notes?: string;
}

// ─── Budget ───────────────────────────────────────────────────────────────────

export interface Budget {
  id: number;
  userId: number;
  categoryId?: number;
  category?: Category;
  amount: number;
  spent: number;
  month: number;
  year: number;
  alertAt: number; // percentage (e.g. 80 = alert when 80% spent)
  createdAt: string;
}

export interface CreateBudgetPayload {
  categoryId?: number;
  amount: number;
  month: number;
  year: number;
  alertAt?: number;
}

// ─── Analytics ────────────────────────────────────────────────────────────────

export interface MonthlyStats {
  month: string;
  totalIncome: number;
  totalExpense: number;
  savings: number;
}

export interface CategoryBreakdown {
  categoryId: number;
  categoryName: string;
  categoryColor: string;
  total: number;
  percentage: number;
  count: number;
}

export interface DashboardSummary {
  totalBalance: number;
  totalIncome: number;
  totalExpense: number;
  monthlyBudget: number;
  budgetUsed: number;
  recentTransactions: Transaction[];
}

// ─── Transaction (unified view) ───────────────────────────────────────────────

export interface Transaction {
  id: number;
  type: 'expense' | 'income';
  amount: number;
  description: string;
  category?: Category;
  date: string;
  paymentMethod?: PaymentMethod;
}

// ─── API ──────────────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface ApiError {
  message: string;
  code?: string;
  field?: string;
}

// ─── Navigation ───────────────────────────────────────────────────────────────

export type RootStackParamList = {
  Splash: undefined;
  Auth: undefined;
  Main: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export type MainTabParamList = {
  Dashboard: undefined;
  Expenses: undefined;
  Income: undefined;
  Budget: undefined;
  Categories: undefined;
  Profile: undefined;
};

export type ExpenseStackParamList = {
  ExpenseList: undefined;
  AddExpense: { expenseId?: number } | undefined;
  ExpenseDetail: { expenseId: number };
};

export type IncomeStackParamList = {
  IncomeList: undefined;
  AddIncome: { incomeId?: number } | undefined;
};

export type CategoryStackParamList = {
  CategoryList: undefined;
  AddCategory: { categoryId?: number } | undefined;
};

export type BudgetStackParamList = {
  BudgetList: undefined;
  AddBudget: { budgetId?: number } | undefined;
  Analytics: undefined;
};

// ─── UI Helpers ───────────────────────────────────────────────────────────────

export interface SelectOption {
  label: string;
  value: string | number;
  icon?: string;
  color?: string;
}

export type ThemeMode = 'light' | 'dark' | 'system';
