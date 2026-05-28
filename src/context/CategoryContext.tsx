import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { useAuth } from '@context/AuthContext';
import categoryService from '@services/categoryService';
import type { Category } from '@constants/types';

interface CategoryContextValue {
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  fetchCategories: () => Promise<void>;
  addCategory: (category: Omit<Category, 'id' | 'isDefault' | 'userId'>) => Promise<void>;
  updateCategory: (id: number, updates: Partial<Category>) => Promise<void>;
  deleteCategory: (id: number) => Promise<void>;
  refresh: () => Promise<void>;
}

const CategoryContext = createContext<CategoryContextValue | null>(null);

export const CategoryProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    setError(null);

    try {
      const result = await categoryService.getAll(user.id);
      setCategories(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load categories.');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const addCategory = useCallback(async (category: Omit<Category, 'id' | 'isDefault' | 'userId'>) => {
    if (!user) throw new Error('User is required to add categories.');
    const result = await categoryService.create(user.id, category as any);
    setCategories((prev) => [result, ...prev]);
  }, [user]);

  const updateCategory = useCallback(async (id: number, updates: Partial<Category>) => {
    const result = await categoryService.update(id, updates);
    setCategories((prev) => prev.map((item) => (item.id === id ? result : item)));
  }, []);

  const deleteCategory = useCallback(async (id: number) => {
    await categoryService.delete(id);
    setCategories((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const refresh = useCallback(async () => {
    await fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    void fetchCategories();
  }, [fetchCategories]);

  return (
    <CategoryContext.Provider
      value={{ categories, isLoading, error, fetchCategories, addCategory, updateCategory, deleteCategory, refresh }}
    >
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategories = () => {
  const context = useContext(CategoryContext);
  if (!context) throw new Error('useCategories must be used inside <CategoryProvider>');
  return context;
};
