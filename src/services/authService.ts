// src/services/authService.ts
import { APP_CONFIG } from '@constants/theme';
import type { LoginPayload, RegisterPayload, User, AuthTokens } from '@constants/types';
import { LocalDatabase } from './localDatabase';
import secureStorage from './secureStorage';

class AuthService {
  constructor() {
    LocalDatabase.initialize().catch(() => null);
  }

  async login(payload: LoginPayload): Promise<{ user: User; tokens: AuthTokens }> {
    const user = await LocalDatabase.loginUser(payload.email, payload.password);
    const tokens = this.createTokens(user.id);
    await this.storeTokens(tokens);
    await this.storeUser(user);
    return { user, tokens };
  }

  async register(payload: RegisterPayload): Promise<{ user: User; tokens: AuthTokens }> {
    const user = await LocalDatabase.registerUser(payload.name, payload.email, payload.password);
    const tokens = this.createTokens(user.id);
    await this.storeTokens(tokens);
    await this.storeUser(user);
    return { user, tokens };
  }

  async logout(): Promise<void> {
    await this.clearStorage();
  }

  async forgotPassword(email: string): Promise<void> {
    await LocalDatabase.forgotPassword(email);
  }

  async getStoredUser(): Promise<User | null> {
    try {
      const userData = await secureStorage.getItemAsync(APP_CONFIG.userKey);
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  }

  async getStoredToken(): Promise<string | null> {
    try {
      return await secureStorage.getItemAsync(APP_CONFIG.tokenKey);
    } catch {
      return null;
    }
  }

  async updateProfile(updates: Partial<User>): Promise<User> {
    const stored = await this.getStoredUser();
    if (!stored) throw new Error('No authenticated user.');
    const updated = await LocalDatabase.updateProfile(stored.id, updates);
    await this.storeUser(updated);
    return updated;
  }

  async changePassword(password: string): Promise<void> {
    const stored = await this.getStoredUser();
    if (!stored) throw new Error('No authenticated user.');
    await LocalDatabase.changePassword(stored.id, password);
  }

  private createTokens(userId: number): AuthTokens {
    return {
      accessToken: `token-${userId}-${Date.now()}`,
      refreshToken: `refresh-${userId}-${Date.now()}`,
    };
  }

  private async storeTokens(tokens: AuthTokens): Promise<void> {
    await secureStorage.setItemAsync(APP_CONFIG.tokenKey, tokens.accessToken);
    await secureStorage.setItemAsync('refresh_token', tokens.refreshToken);
  }

  private async storeUser(user: User): Promise<void> {
    await secureStorage.setItemAsync(APP_CONFIG.userKey, JSON.stringify(user));
  }

  private async clearStorage(): Promise<void> {
    await secureStorage.deleteItemAsync(APP_CONFIG.tokenKey);
    await secureStorage.deleteItemAsync('refresh_token');
    await secureStorage.deleteItemAsync(APP_CONFIG.userKey);
  }
}

export default new AuthService();
