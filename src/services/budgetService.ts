import { LocalDatabase } from './localDatabase';
import type { Budget, CreateBudgetPayload } from '@constants/types';

class BudgetService {
  async getAll(userId: number): Promise<Budget[]> {
    return LocalDatabase.getBudgetsForUser(userId);
  }

  async getById(id: number): Promise<Budget> {
    return LocalDatabase.getBudgetById(id);
  }

  async create(userId: number, payload: CreateBudgetPayload): Promise<Budget> {
    return LocalDatabase.createBudget({ ...payload, userId });
  }

  async update(id: number, payload: Partial<CreateBudgetPayload>): Promise<Budget> {
    return LocalDatabase.updateBudget(id, payload);
  }

  async delete(id: number): Promise<void> {
    return LocalDatabase.deleteBudget(id);
  }
}

export default new BudgetService();
