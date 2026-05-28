import { LocalDatabase } from './localDatabase';
import type { DashboardSummary, MonthlyStats, CategoryBreakdown } from '@constants/types';

class AnalyticsService {
  async getDashboard(userId: number): Promise<DashboardSummary> {
    return LocalDatabase.getDashboardSummary(userId);
  }

  async getMonthlyStats(userId: number, months = 6): Promise<MonthlyStats[]> {
    return LocalDatabase.getMonthlyStats(userId, months);
  }

  async getCategoryBreakdown(userId: number, type: 'expense' | 'income', month?: number, year?: number): Promise<CategoryBreakdown[]> {
    return LocalDatabase.getCategoryBreakdown(userId, type, month, year);
  }
}

export default new AnalyticsService();
