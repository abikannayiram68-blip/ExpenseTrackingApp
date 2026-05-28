import { LocalDatabase } from './localDatabase';
import type { Income, CreateIncomePayload, PaginatedResponse } from '@constants/types';

class IncomeService {
  async getAll(userId: number, filters?: { page?: number; limit?: number; startDate?: string; endDate?: string; search?: string }): Promise<PaginatedResponse<Income>> {
    return LocalDatabase.getIncomesForUser(userId, filters);
  }

  async getById(id: number): Promise<Income> {
    return LocalDatabase.getIncomeById(id);
  }

  async create(userId: number, payload: CreateIncomePayload): Promise<Income> {
    return LocalDatabase.createIncome({ ...payload, userId });
  }

  async update(id: number, payload: Partial<CreateIncomePayload>): Promise<Income> {
    return LocalDatabase.updateIncome(id, payload);
  }

  async delete(id: number): Promise<void> {
    return LocalDatabase.deleteIncome(id);
  }
}

export default new IncomeService();
