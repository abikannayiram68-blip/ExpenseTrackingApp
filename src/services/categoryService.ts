import { LocalDatabase } from './localDatabase';
import type { Category } from '@constants/types';

class CategoryService {
  async getAll(userId: number): Promise<Category[]> {
    return LocalDatabase.getCategoriesForUser(userId);
  }

  async create(userId: number, category: Omit<Category, 'id' | 'isDefault'>): Promise<Category> {
    return LocalDatabase.createCategory(userId, category);
  }

  async update(id: number, updates: Partial<Category>): Promise<Category> {
    return LocalDatabase.updateCategory(id, updates);
  }

  async delete(id: number): Promise<void> {
    return LocalDatabase.deleteCategory(id);
  }
}

export default new CategoryService();
