import React from 'react';
import renderer, { act } from 'react-test-renderer';

const mockGetStoredUser = jest.fn(async () => ({ id: 1, name: 'Demo', email: 'demo@expenseapp.com' }));
const mockGetStoredToken = jest.fn(async () => 'token-1');

jest.mock('@services/authService', () => ({
  __esModule: true,
  default: {
    getStoredUser: mockGetStoredUser,
    getStoredToken: mockGetStoredToken,
    login: jest.fn(async () => ({ user: { id: 1, name: 'Demo', email: 'demo@expenseapp.com' }, tokens: { accessToken: 't', refreshToken: 'r' } })),
    register: jest.fn(async () => ({ user: { id: 2, name: 'X', email: 'x@example.com' }, tokens: { accessToken: 't2', refreshToken: 'r2' } })),
    logout: jest.fn(async () => undefined),
    forgotPassword: jest.fn(async () => undefined),
  },
}));

const { AuthProvider, useAuth } = require('@context/AuthContext');

const Consumer = () => {
  const ctx = useAuth();
  // Render minimal information
  return React.createElement('View', null, `auth:${ctx.isAuthenticated},init:${ctx.isInitializing}`);
};

describe('AuthProvider', () => {
  it('initializes from auth service stored values', async () => {
    let tree: any;
    await act(async () => {
      tree = renderer.create(
        React.createElement(AuthProvider, null, React.createElement(Consumer))
      );
    });

    expect(mockGetStoredUser).toHaveBeenCalled();
    expect(mockGetStoredToken).toHaveBeenCalled();
    expect(tree).toBeDefined();
  });
});
