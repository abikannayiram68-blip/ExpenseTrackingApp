import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { useAuth } from '@context/AuthContext';
import budgetService from '@services/budgetService';
import type { Budget, CreateBudgetPayload } from '@constants/types';

interface BudgetContextValue {
  budgets: Budget[];
  isLoading: boolean;
  error: string | null;
  fetchBudgets: () => Promise<void>;
  addBudget: (payload: CreateBudgetPayload) => Promise<void>;
  updateBudget: (id: number, payload: Partial<CreateBudgetPayload>) => Promise<void>;
  deleteBudget: (id: number) => Promise<void>;
  refresh: () => Promise<void>;
}

const BudgetContext = createContext<BudgetContextValue | null>(null);

export const BudgetProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBudgets = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    setError(null);

    try {
      const result = await budgetService.getAll(user.id);
      setBudgets(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load budgets.');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const addBudget = useCallback(async (payload: CreateBudgetPayload) => {
    if (!user) throw new Error('User is required to add budgets.');
    const budget = await budgetService.create(user.id, payload);
    setBudgets((prev) => [budget, ...prev]);
  }, [user]);

  const updateBudget = useCallback(async (id: number, payload: Partial<CreateBudgetPayload>) => {
    const budget = await budgetService.update(id, payload);
    setBudgets((prev) => prev.map((item) => (item.id === id ? budget : item)));
  }, []);

  const deleteBudget = useCallback(async (id: number) => {
    await budgetService.delete(id);
    setBudgets((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const refresh = useCallback(async () => {
    await fetchBudgets();
  }, [fetchBudgets]);

  useEffect(() => {
    void fetchBudgets();
  }, [fetchBudgets]);

  return (
    <BudgetContext.Provider
      value={{ budgets, isLoading, error, fetchBudgets, addBudget, updateBudget, deleteBudget, refresh }}
    >
      {children}
    </BudgetContext.Provider>
  );
};

export const useBudgets = () => {
  const context = useContext(BudgetContext);
  if (!context) throw new Error('useBudgets must be used inside <BudgetProvider>');
  return context;
};
