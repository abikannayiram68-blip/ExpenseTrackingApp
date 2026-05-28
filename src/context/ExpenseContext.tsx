// src/context/ExpenseContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useEffect,
} from 'react';
import expenseService from '@services/expenseService';
import { useAuth } from '@context/AuthContext';
import type { Expense, CreateExpensePayload } from '@constants/types';
import type { ExpenseFilters } from '@services/expenseService';

interface ExpenseState {
  expenses: Expense[];
  total: number;
  page: number;
  hasMore: boolean;
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  filters: ExpenseFilters;
}

interface ExpenseContextValue extends ExpenseState {
  fetchExpenses: (reset?: boolean) => Promise<void>;
  loadMore: () => Promise<void>;
  addExpense: (payload: CreateExpensePayload) => Promise<void>;
  updateExpense: (id: number, payload: Partial<CreateExpensePayload>) => Promise<void>;
  deleteExpense: (id: number) => Promise<void>;
  setFilters: (filters: Partial<ExpenseFilters>) => void;
  clearFilters: () => void;
  refresh: () => Promise<void>;
}

const ExpenseContext = createContext<ExpenseContextValue | null>(null);

const INITIAL_FILTERS: ExpenseFilters = { page: 1, limit: 20 };

export const ExpenseProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<ExpenseState>({
    expenses: [],
    total: 0,
    page: 1,
    hasMore: false,
    isLoading: false,
    isRefreshing: false,
    error: null,
    filters: INITIAL_FILTERS,
  });

  const { user } = useAuth();

  const fetchExpenses = useCallback(async (reset = false) => {
    if (!user) return;
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const currentPage = reset ? 1 : state.page;
      const result = await expenseService.getAll(user.id, {
        ...state.filters,
        page: currentPage,
      });

      setState((prev) => ({
        ...prev,
        expenses: reset ? result.data : [...prev.expenses, ...result.data],
        total: result.total,
        page: currentPage + 1,
        hasMore: result.hasMore,
        isLoading: false,
      }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: err instanceof Error ? err.message : 'Failed to load expenses',
      }));
    }
  }, [state.page, state.filters, user]);

  const loadMore = useCallback(async () => {
    if (!state.hasMore || state.isLoading) return;
    await fetchExpenses();
  }, [state.hasMore, state.isLoading, fetchExpenses]);

  const addExpense = useCallback(async (payload: CreateExpensePayload) => {
    if (!user) throw new Error('Login required to add expenses.');
    const newExpense = await expenseService.create(user.id, payload);
    setState((prev) => ({
      ...prev,
      expenses: [newExpense, ...prev.expenses],
      total: prev.total + 1,
    }));
  }, [user]);

  const updateExpense = useCallback(async (id: number, payload: Partial<CreateExpensePayload>) => {
    const updated = await expenseService.update(id, payload);
    setState((prev) => ({
      ...prev,
      expenses: prev.expenses.map((e) => (e.id === id ? updated : e)),
    }));
  }, []);

  const deleteExpense = useCallback(async (id: number) => {
    await expenseService.delete(id);
    setState((prev) => ({
      ...prev,
      expenses: prev.expenses.filter((e) => e.id !== id),
      total: prev.total - 1,
    }));
  }, []);

  const setFilters = useCallback((filters: Partial<ExpenseFilters>) => {
    setState((prev) => ({
      ...prev,
      filters: { ...prev.filters, ...filters },
      page: 1,
      expenses: [],
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setState((prev) => ({ ...prev, filters: INITIAL_FILTERS, page: 1, expenses: [] }));
  }, []);

  const refresh = useCallback(async () => {
    setState((prev) => ({ ...prev, isRefreshing: true }));
    await fetchExpenses(true);
    setState((prev) => ({ ...prev, isRefreshing: false }));
  }, [fetchExpenses]);

  useEffect(() => {
    void fetchExpenses(true);
  }, [fetchExpenses, user]);

  return (
    <ExpenseContext.Provider
      value={{ ...state, fetchExpenses, loadMore, addExpense, updateExpense, deleteExpense, setFilters, clearFilters, refresh }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpenses = () => {
  const ctx = useContext(ExpenseContext);
  if (!ctx) throw new Error('useExpenses must be used inside <ExpenseProvider>');
  return ctx;
};

export default ExpenseContext;
