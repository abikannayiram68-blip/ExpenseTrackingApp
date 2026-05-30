import AsyncStorage from '@react-native-async-storage/async-storage';
import { DEFAULT_CATEGORIES, MONTHS } from '@constants/index';
import { Colors } from '@constants/theme';
import type {
  Category,
  Expense,
  Income,
  Budget,
  User,
  CreateExpensePayload,
  CreateIncomePayload,
  CreateBudgetPayload,
  MonthlyStats,
  CategoryBreakdown,
  DashboardSummary,
  PaymentMethod,
  Transaction,
} from '@constants/types';

const STORAGE_KEYS = {
  users: 'LD_USERS',
  categories: 'LD_CATEGORIES',
  expenses: 'LD_EXPENSES',
  incomes: 'LD_INCOMES',
  budgets: 'LD_BUDGETS',
};

type StoredUser = User & { password: string };

type PaginatedResult<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
};

const parseJSON = <T>(value: string | null, fallback: T): T => {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
};

const generateId = () => Math.floor(Date.now() + Math.random() * 1000);

const formatDate = (date: string | Date) => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toISOString().slice(0, 10);
};

const getStorage = async <T>(key: string, fallback: T): Promise<T> => {
  const raw = await AsyncStorage.getItem(key);
  return parseJSON(raw, fallback);
};

const setStorage = async <T>(key: string, value: T) => {
  await AsyncStorage.setItem(key, JSON.stringify(value));
};

const ensureDefaults = async () => {
  const categories = await getStorage<Category[]>(STORAGE_KEYS.categories, []);
  if (categories.length === 0) {
    await setStorage(
      STORAGE_KEYS.categories,
      DEFAULT_CATEGORIES.map((category, index) => ({
        ...category,
        id: generateId() + index,
        isDefault: true,
      }))
    );
  }

  const users = await getStorage<StoredUser[]>(STORAGE_KEYS.users, []);
  if (users.length === 0) {
    await setStorage(STORAGE_KEYS.users, [
      {
        id: generateId(),
        name: 'Demo User',
        email: 'demo@expenseapp.com',
        password: 'demo123',
        currency: 'INR',
        createdAt: new Date().toISOString(),
      },
    ]);
  }
};

const getUsers = async () => getStorage<StoredUser[]>(STORAGE_KEYS.users, []);
const getCategories = async () => getStorage<Category[]>(STORAGE_KEYS.categories, []);
const getExpenses = async () => getStorage<Expense[]>(STORAGE_KEYS.expenses, []);
const getIncomes = async () => getStorage<Income[]>(STORAGE_KEYS.incomes, []);
const getBudgets = async () => getStorage<Budget[]>(STORAGE_KEYS.budgets, []);

const saveUsers = async (users: StoredUser[]) => setStorage(STORAGE_KEYS.users, users);
const saveCategories = async (categories: Category[]) => setStorage(STORAGE_KEYS.categories, categories);
const saveExpenses = async (expenses: Expense[]) => setStorage(STORAGE_KEYS.expenses, expenses);
const saveIncomes = async (incomes: Income[]) => setStorage(STORAGE_KEYS.incomes, incomes);
const saveBudgets = async (budgets: Budget[]) => setStorage(STORAGE_KEYS.budgets, budgets);

const filterByUser = <T extends { userId: number }>(items: T[], userId: number) => items.filter((item) => item.userId === userId);

const buildPagination = <T>(items: T[], page = 1, limit = 20): PaginatedResult<T> => {
  const offset = (page - 1) * limit;
  const data = items.slice(offset, offset + limit);
  return {
    data,
    total: items.length,
    page,
    limit,
    hasMore: offset + limit < items.length,
  };
};

const getCategoryName = async (categoryId?: number) => {
  if (!categoryId) return 'Other';
  const categories = await getCategories();
  const category = categories.find((item) => item.id === categoryId);
  return category?.name ?? 'Other';
};

const buildTransaction = async (item: Expense | Income): Promise<Transaction> => {
  if ('categoryId' in item) {
    return {
      id: item.id,
      type: 'expense',
      amount: item.amount,
      description: item.description,
      category: await getCategories().then((categories) => categories.find((cat) => cat.id === item.categoryId)),
      date: item.date,
      paymentMethod: item.paymentMethod,
    };
  }

  return {
    id: item.id,
    type: 'income',
    amount: item.amount,
    description: item.source,
    category: undefined,
    date: item.date,
  };
};

const calculateBudgetSpent = async (budget: Budget, expenses: Expense[]) => {
  const filtered = expenses.filter((expense) => {
    const expenseDate = new Date(expense.date);
    const matchesMonth = expenseDate.getMonth() + 1 === budget.month;
    const matchesYear = expenseDate.getFullYear() === budget.year;
    const matchesCategory = budget.categoryId ? expense.categoryId === budget.categoryId : true;
    return matchesMonth && matchesYear && matchesCategory;
  });
  return filtered.reduce((sum, item) => sum + item.amount, 0);
};

export const LocalDatabase = {
  initialize: async () => {
    await ensureDefaults();
  },

  loginUser: async (email: string, password: string): Promise<User> => {
    await ensureDefaults();
    const users = await getUsers();
    const user = users.find((item) => item.email.toLowerCase() === email.toLowerCase());
    if (!user || user.password !== password) {
      throw new Error('Invalid email or password.');
    }
    const { password: _, ...publicUser } = user;
    return publicUser;
  },

  registerUser: async (name: string, email: string, password: string): Promise<User> => {
    await ensureDefaults();
    const users = await getUsers();
    if (users.some((item) => item.email.toLowerCase() === email.toLowerCase())) {
      throw new Error('User already exists with this email.');
    }
    const newUser: StoredUser = {
      id: generateId(),
      name,
      email,
      password,
      currency: 'INR',
      createdAt: new Date().toISOString(),
    };
    await saveUsers([...users, newUser]);
    const { password: _, ...publicUser } = newUser;
    return publicUser;
  },

  forgotPassword: async (email: string) => {
    await ensureDefaults();
    const users = await getUsers();
    const user = users.find((item) => item.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      throw new Error('No account found for this email.');
    }
  },

  updateProfile: async (userId: number, updates: Partial<User>): Promise<User> => {
    await ensureDefaults();
    const users = await getUsers();
    const userIndex = users.findIndex((item) => item.id === userId);
    if (userIndex === -1) throw new Error('User not found.');
    const updated = { ...users[userIndex], ...updates };
    users[userIndex] = updated;
    await saveUsers(users);
    const { password: _, ...publicUser } = updated;
    return publicUser;
  },

  changePassword: async (userId: number, password: string): Promise<void> => {
    await ensureDefaults();
    const users = await getUsers();
    const userIndex = users.findIndex((item) => item.id === userId);
    if (userIndex === -1) throw new Error('User not found.');
    users[userIndex].password = password;
    await saveUsers(users);
  },

  getCategoriesForUser: async (userId: number): Promise<Category[]> => {
    await ensureDefaults();
    const categories = await getCategories();
    return categories
      .filter((category) => category.isDefault || category.userId === userId)
      .sort((a, b) => (a.isDefault === b.isDefault ? a.name.localeCompare(b.name) : a.isDefault ? -1 : 1));
  },

  createCategory: async (userId: number, category: Omit<Category, 'id' | 'isDefault'>): Promise<Category> => {
    await ensureDefaults();
    const categories = await getCategories();
    const newCategory: Category = {
      ...category,
      id: generateId(),
      isDefault: false,
      userId,
    } as Category;
    await saveCategories([...categories, newCategory]);
    return newCategory;
  },

  updateCategory: async (id: number, updates: Partial<Category>): Promise<Category> => {
    await ensureDefaults();
    const categories = await getCategories();
    const index = categories.findIndex((item) => item.id === id);
    if (index === -1) throw new Error('Category not found.');
    const updated = { ...categories[index], ...updates };
    categories[index] = updated;
    await saveCategories(categories);
    return updated;
  },

  deleteCategory: async (id: number): Promise<void> => {
    await ensureDefaults();
    const categories = await getCategories();
    await saveCategories(categories.filter((item) => item.id !== id));
  },

  getExpensesForUser: async (userId: number, filters?: { page?: number; limit?: number; categoryId?: number; startDate?: string; endDate?: string; minAmount?: number; maxAmount?: number; search?: string; paymentMethod?: PaymentMethod; }): Promise<PaginatedResult<Expense>> => {
    await ensureDefaults();
    const allExpenses = filterByUser(await getExpenses(), userId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    let filtered = allExpenses;

    if (filters) {
      const { startDate, endDate } = filters;
      if (filters.categoryId) filtered = filtered.filter((item) => item.categoryId === filters.categoryId);
      if (filters.paymentMethod) filtered = filtered.filter((item) => item.paymentMethod === filters.paymentMethod);
      if (filters.search) {
        const search = filters.search.toLowerCase();
        filtered = filtered.filter((item) => item.description.toLowerCase().includes(search) || item.notes?.toLowerCase().includes(search));
      }
      if (startDate) filtered = filtered.filter((item) => new Date(item.date) >= new Date(startDate));
      if (endDate) filtered = filtered.filter((item) => new Date(item.date) <= new Date(endDate));
      if (filters.maxAmount !== undefined) filtered = filtered.filter((item) => item.amount <= filters.maxAmount!);
    }

    return buildPagination(filtered, filters?.page ?? 1, filters?.limit ?? 20);
  },

  getExpenseById: async (id: number): Promise<Expense> => {
    await ensureDefaults();
    const expenses = await getExpenses();
    const expense = expenses.find((item) => item.id === id);
    if (!expense) throw new Error('Expense not found');
    return expense;
  },

  createExpense: async (payload: CreateExpensePayload & { userId: number }): Promise<Expense> => {
    await ensureDefaults();
    const expenses = await getExpenses();
    const newExpense: Expense = {
      id: generateId(),
      ...payload,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await saveExpenses([newExpense, ...expenses]);
    return newExpense;
  },

  updateExpense: async (id: number, payload: Partial<CreateExpensePayload>): Promise<Expense> => {
    await ensureDefaults();
    const expenses = await getExpenses();
    const index = expenses.findIndex((item) => item.id === id);
    if (index === -1) throw new Error('Expense not found');
    const updated = { ...expenses[index], ...payload, updatedAt: new Date().toISOString() };
    expenses[index] = updated;
    await saveExpenses(expenses);
    return updated;
  },

  deleteExpense: async (id: number): Promise<void> => {
    await ensureDefaults();
    const expenses = await getExpenses();
    await saveExpenses(expenses.filter((item) => item.id !== id));
  },

  getIncomesForUser: async (userId: number, filters?: { page?: number; limit?: number; startDate?: string; endDate?: string; search?: string; }): Promise<PaginatedResult<Income>> => {
    await ensureDefaults();
    const allIncomes = filterByUser(await getIncomes(), userId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    let filtered = allIncomes;

    if (filters) {
      const startDate = filters.startDate ? new Date(filters.startDate) : undefined;
      const endDate = filters.endDate ? new Date(filters.endDate) : undefined;
      if (filters.search) {
        const search = filters.search.toLowerCase();
        filtered = filtered.filter((item) => item.source.toLowerCase().includes(search) || item.notes?.toLowerCase().includes(search));
      }
      if (startDate) filtered = filtered.filter((item) => new Date(item.date) >= startDate);
      if (endDate) filtered = filtered.filter((item) => new Date(item.date) <= endDate);
    }

    return buildPagination(filtered, filters?.page ?? 1, filters?.limit ?? 20);
  },

  getIncomeById: async (id: number): Promise<Income> => {
    await ensureDefaults();
    const incomes = await getIncomes();
    const income = incomes.find((item) => item.id === id);
    if (!income) throw new Error('Income not found');
    return income;
  },

  createIncome: async (payload: CreateIncomePayload & { userId: number }): Promise<Income> => {
    await ensureDefaults();
    const incomes = await getIncomes();
    const newIncome: Income = {
      id: generateId(),
      ...payload,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await saveIncomes([newIncome, ...incomes]);
    return newIncome;
  },

  updateIncome: async (id: number, payload: Partial<CreateIncomePayload>): Promise<Income> => {
    await ensureDefaults();
    const incomes = await getIncomes();
    const index = incomes.findIndex((item) => item.id === id);
    if (index === -1) throw new Error('Income not found');
    const updated = { ...incomes[index], ...payload, updatedAt: new Date().toISOString() };
    incomes[index] = updated;
    await saveIncomes(incomes);
    return updated;
  },

  deleteIncome: async (id: number): Promise<void> => {
    await ensureDefaults();
    const incomes = await getIncomes();
    await saveIncomes(incomes.filter((item) => item.id !== id));
  },

  getBudgetsForUser: async (userId: number): Promise<Budget[]> => {
    await ensureDefaults();
    const budgets = filterByUser(await getBudgets(), userId);
    const expenses = filterByUser(await getExpenses(), userId);
    const enriched = await Promise.all(
      budgets.map(async (budget) => ({
        ...budget,
        spent: await calculateBudgetSpent(budget, expenses),
      }))
    );
    return enriched.sort((a, b) => a.year === b.year ? a.month - b.month : a.year - b.year);
  },

  getBudgetById: async (id: number): Promise<Budget> => {
    await ensureDefaults();
    const budgets = await getBudgets();
    const budget = budgets.find((item) => item.id === id);
    if (!budget) throw new Error('Budget not found');
    const expenses = filterByUser(await getExpenses(), budget.userId);
    return { ...budget, spent: await calculateBudgetSpent(budget, expenses) };
  },

  createBudget: async (payload: CreateBudgetPayload & { userId: number }): Promise<Budget> => {
    await ensureDefaults();
    const budgets = await getBudgets();
    const newBudget: Budget = {
      id: generateId(),
      userId: payload.userId,
      categoryId: payload.categoryId,
      amount: payload.amount,
      month: payload.month,
      year: payload.year,
      alertAt: payload.alertAt ?? 80,
      spent: 0,
      createdAt: new Date().toISOString(),
    };
    await saveBudgets([newBudget, ...budgets]);
    return newBudget;
  },

  updateBudget: async (id: number, payload: Partial<CreateBudgetPayload>): Promise<Budget> => {
    await ensureDefaults();
    const budgets = await getBudgets();
    const index = budgets.findIndex((item) => item.id === id);
    if (index === -1) throw new Error('Budget not found');
    const updated = { ...budgets[index], ...payload } as Budget;
    budgets[index] = updated;
    await saveBudgets(budgets);
    return updated;
  },

  deleteBudget: async (id: number): Promise<void> => {
    await ensureDefaults();
    const budgets = await getBudgets();
    await saveBudgets(budgets.filter((item) => item.id !== id));
  },

  getDashboardSummary: async (userId: number): Promise<DashboardSummary> => {
    await ensureDefaults();
    const expenses = filterByUser(await getExpenses(), userId);
    const incomes = filterByUser(await getIncomes(), userId);
    const budgets = filterByUser(await getBudgets(), userId);
    const monthlyBudgets = budgets.filter((budget) => {
      const today = new Date();
      return budget.month === today.getMonth() + 1 && budget.year === today.getFullYear();
    });
    const totalExpense = expenses.reduce((sum, item) => sum + item.amount, 0);
    const totalIncome = incomes.reduce((sum, item) => sum + item.amount, 0);
    const monthlyBudget = monthlyBudgets.reduce((sum, item) => sum + item.amount, 0);
    const budgetUsed = monthlyBudget ? Math.round((totalExpense / monthlyBudget) * 100) : 0;
    const recentExpenses = expenses
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 3);
    const recentIncomes = incomes
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 2);

    const recentTransactions: Transaction[] = [
      ...(await Promise.all(recentExpenses.map(buildTransaction))),
      ...(await Promise.all(recentIncomes.map(buildTransaction))),
    ]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);

    return {
      totalBalance: totalIncome - totalExpense,
      totalIncome,
      totalExpense,
      monthlyBudget,
      budgetUsed,
      recentTransactions,
    };
  },

  getMonthlyStats: async (userId: number, months = 6): Promise<MonthlyStats[]> => {
    await ensureDefaults();
    const incomes = filterByUser(await getIncomes(), userId);
    const expenses = filterByUser(await getExpenses(), userId);

    const stats = Array.from({ length: months }, (_, index) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (months - 1 - index));
      const month = date.getMonth();
      const year = date.getFullYear();

      const monthlyIncome = incomes
        .filter((item) => new Date(item.date).getMonth() === month && new Date(item.date).getFullYear() === year)
        .reduce((sum, item) => sum + item.amount, 0);
      const monthlyExpense = expenses
        .filter((item) => new Date(item.date).getMonth() === month && new Date(item.date).getFullYear() === year)
        .reduce((sum, item) => sum + item.amount, 0);
      const savings = monthlyIncome - monthlyExpense;

      return {
        month: MONTHS[month],
        totalIncome: monthlyIncome,
        totalExpense: monthlyExpense,
        savings,
      };
    });

    return stats;
  },

  getCategoryBreakdown: async (userId: number, type: 'expense' | 'income', month?: number, year?: number): Promise<CategoryBreakdown[]> => {
    await ensureDefaults();
    const categories = await getCategories();
    const incomes = filterByUser(await getIncomes(), userId);
    const expenses = filterByUser(await getExpenses(), userId);
    const monthFilter = month ?? new Date().getMonth() + 1;
    const yearFilter = year ?? new Date().getFullYear();

    const items = type === 'expense' ? expenses : incomes;
    const filtered = items.filter((item) => {
      const itemDate = new Date(item.date);
      return itemDate.getMonth() + 1 === monthFilter && itemDate.getFullYear() === yearFilter;
    });

    const totals: Record<string, number> = {};
    const counts: Record<string, number> = {};

    for (const item of filtered) {
      const expenseItem = item as Expense;
      const key = type === 'expense' ? String(expenseItem.categoryId ?? 0) : String(item.id);
      totals[key] = (totals[key] ?? 0) + item.amount;
      counts[key] = (counts[key] ?? 0) + 1;
    }

    const entries = Object.entries(totals).map(([key, total]) => {
      const categoryId = Number(key);
      const category = categories.find((cat) => cat.id === categoryId);
      return {
        categoryId,
        categoryName: category?.name ?? (type === 'expense' ? 'Other' : 'Income'),
        categoryColor: category?.color ?? Colors.income,
        total,
        percentage: 0,
        count: counts[key] ?? 0,
      };
    });

    const totalSum = entries.reduce((sum, entry) => sum + entry.total, 0);
    return entries.map((entry) => ({
      ...entry,
      percentage: totalSum ? Math.round((entry.total / totalSum) * 100) : 0,
    }));
  },
};
