const mockSecureStorage = {
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
};

const mockLocalDatabase = {
  initialize: jest.fn(async () => undefined),
  loginUser: jest.fn(),
  registerUser: jest.fn(),
  forgotPassword: jest.fn(),
};

jest.mock('@services/secureStorage', () => ({
  __esModule: true,
  default: mockSecureStorage,
}));

jest.mock('@services/localDatabase', () => ({
  __esModule: true,
  LocalDatabase: mockLocalDatabase,
}));

const AuthService = require('@services/authService').default;
const { APP_CONFIG } = require('@constants/theme');

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('logs in a user and stores tokens and user data', async () => {
    const user = {
      id: 42,
      name: 'Alice',
      email: 'alice@example.com',
      currency: 'INR',
      createdAt: new Date().toISOString(),
    };
    mockLocalDatabase.loginUser.mockResolvedValueOnce(user);

    const result = await AuthService.login({ email: 'alice@example.com', password: 'Password1' });

    expect(result.user).toEqual(user);
    expect(result.tokens.accessToken).toContain('token-42-');
    expect(mockSecureStorage.setItemAsync).toHaveBeenCalledWith(APP_CONFIG.tokenKey, expect.any(String));
    expect(mockSecureStorage.setItemAsync).toHaveBeenCalledWith('refresh_token', expect.any(String));
    expect(mockSecureStorage.setItemAsync).toHaveBeenCalledWith(APP_CONFIG.userKey, JSON.stringify(user));
  });

  it('registers a user and persists credentials', async () => {
    const user = {
      id: 99,
      name: 'Bob',
      email: 'bob@example.com',
      currency: 'INR',
      createdAt: new Date().toISOString(),
    };
    mockLocalDatabase.registerUser.mockResolvedValueOnce(user);

    const result = await AuthService.register({ name: 'Bob', email: 'bob@example.com', password: 'Password1' });

    expect(result.user).toEqual(user);
    expect(mockSecureStorage.setItemAsync).toHaveBeenCalledWith(APP_CONFIG.tokenKey, expect.any(String));
    expect(mockSecureStorage.setItemAsync).toHaveBeenCalledWith('refresh_token', expect.any(String));
    expect(mockSecureStorage.setItemAsync).toHaveBeenCalledWith(APP_CONFIG.userKey, JSON.stringify(user));
  });

  it('logs out by clearing secure storage', async () => {
    await AuthService.logout();

    expect(mockSecureStorage.deleteItemAsync).toHaveBeenCalledWith(APP_CONFIG.tokenKey);
    expect(mockSecureStorage.deleteItemAsync).toHaveBeenCalledWith('refresh_token');
    expect(mockSecureStorage.deleteItemAsync).toHaveBeenCalledWith(APP_CONFIG.userKey);
  });

  it('forwards forgot password calls to LocalDatabase', async () => {
    mockLocalDatabase.forgotPassword.mockResolvedValueOnce(undefined);
    await AuthService.forgotPassword('alice@example.com');
    expect(mockLocalDatabase.forgotPassword).toHaveBeenCalledWith('alice@example.com');
  });

  it('retrieves stored user data from secure storage', async () => {
    const user = { id: 1, name: 'Demo', email: 'demo@expenseapp.com', currency: 'INR', createdAt: new Date().toISOString() };
    mockSecureStorage.getItemAsync.mockResolvedValueOnce(JSON.stringify(user));

    const stored = await AuthService.getStoredUser();
    expect(stored).toEqual(user);
  });
});

export {};
