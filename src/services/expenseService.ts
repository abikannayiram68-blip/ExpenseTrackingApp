import { LocalDatabase } from './localDatabase';
import type { Expense, CreateExpensePayload, PaginatedResponse, PaymentMethod } from '@constants/types';

export interface ExpenseFilters {
  page?: number;
  limit?: number;
  categoryId?: number;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
  search?: string;
  paymentMethod?: PaymentMethod;
}

class ExpenseService {
  async getAll(userId: number, filters?: Omit<ExpenseFilters, 'paymentMethod'> & { paymentMethod?: string }): Promise<PaginatedResponse<Expense>> {
    return LocalDatabase.getExpensesForUser(userId, filters as any);
  }

  async getById(id: number): Promise<Expense> {
    return LocalDatabase.getExpenseById(id);
  }

  async create(userId: number, payload: CreateExpensePayload): Promise<Expense> {
    return LocalDatabase.createExpense({ ...payload, userId });
  }

  async update(id: number, payload: Partial<CreateExpensePayload>): Promise<Expense> {
    return LocalDatabase.updateExpense(id, payload);
  }

  async delete(id: number): Promise<void> {
    return LocalDatabase.deleteExpense(id);
  }
}

export default new ExpenseService();
