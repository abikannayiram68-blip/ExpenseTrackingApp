const mockStorage: Record<string, string> = {};

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(async (key: string) => mockStorage[key] ?? null),
    setItem: jest.fn(async (key: string, value: string) => {
      mockStorage[key] = value;
    }),
    removeItem: jest.fn(async (key: string) => {
      delete mockStorage[key];
    }),
  },
}));

const { LocalDatabase } = require('@services/localDatabase');

describe('LocalDatabase', () => {
  beforeEach(async () => {
    Object.keys(mockStorage).forEach((key) => delete mockStorage[key]);
  });

  it('initializes default demo user and categories', async () => {
    await LocalDatabase.initialize();
    const users = JSON.parse(mockStorage.LD_USERS ?? '[]');
    expect(users).toHaveLength(1);
    expect(users[0].email).toBe('demo@expenseapp.com');
  });

  it('logs in default user with valid credentials', async () => {
    const user = await LocalDatabase.loginUser('demo@expenseapp.com', 'demo123');
    expect(user.email).toBe('demo@expenseapp.com');
    expect(user.name).toBe('Demo User');
  });

  it('throws when login credentials are invalid', async () => {
    await expect(LocalDatabase.loginUser('demo@expenseapp.com', 'wrongpass')).rejects.toThrow(
      'Invalid email or password.'
    );
  });

  it('registers a new user and rejects duplicate email', async () => {
    const user = await LocalDatabase.registerUser('Alice', 'alice@example.com', 'Password1');
    expect(user.email).toBe('alice@example.com');
    expect(user.name).toBe('Alice');

    await expect(
      LocalDatabase.registerUser('Alice', 'alice@example.com', 'Password1')
    ).rejects.toThrow('User already exists with this email.');
  });

  it('throws when forgot password is requested for unknown email', async () => {
    await expect(LocalDatabase.forgotPassword('unknown@example.com')).rejects.toThrow(
      'No account found for this email.'
    );
  });

  it('creates an expense and returns it for the user', async () => {
    const user = await LocalDatabase.loginUser('demo@expenseapp.com', 'demo123');
    const expense = await LocalDatabase.createExpense({
      userId: user.id,
      amount: 120,
      categoryId: undefined,
      date: '2026-06-01',
      description: 'Test expense',
      paymentMethod: 'cash',
    });

    const page = await LocalDatabase.getExpensesForUser(user.id);
    expect(page.data[0]).toMatchObject({
      amount: 120,
      description: 'Test expense',
      userId: user.id,
    });
    expect(page.total).toBe(1);
  });

  it('creates a budget and retrieves it for the current user', async () => {
    const user = await LocalDatabase.loginUser('demo@expenseapp.com', 'demo123');
    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();

    const budget = await LocalDatabase.createBudget({
      userId: user.id,
      categoryId: undefined,
      amount: 1000,
      month,
      year,
      alertAt: 80,
    });

    const budgets = await LocalDatabase.getBudgetsForUser(user.id);
    expect(budgets).toHaveLength(1);
    expect(budgets[0]).toMatchObject({ amount: 1000, userId: user.id });
    expect(budgets[0].spent).toBe(0);
    expect(budget.id).toBeDefined();
  });
});

export {};
