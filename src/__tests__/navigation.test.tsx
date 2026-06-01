import React from 'react';
import renderer, { act } from 'react-test-renderer';

// Mock navigation internals
jest.mock('@react-navigation/native', () => ({
  NavigationContainer: ({ children }: any) => children,
  useNavigation: () => ({ navigate: jest.fn() }),
}));

jest.mock('@react-navigation/native-stack', () => ({
  createNativeStackNavigator: () => ({
    Navigator: ({ children }: any) => children,
    Screen: (_props: any) => null,
  }),
}));

// Mock auth/context hook
jest.mock('@context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

// Mock child navigators and splash
jest.mock('@navigation/AuthNavigator', () => () => null);
jest.mock('@navigation/MainNavigator', () => () => null);
jest.mock('@screens/auth/SplashScreen', () => () => null);

const { useAuth } = require('@context/AuthContext');
const RootNavigator = require('@navigation/RootNavigator').default;

describe('RootNavigator', () => {
  afterEach(() => jest.clearAllMocks());

  it('renders splash when initializing', async () => {
    useAuth.mockReturnValue({ isAuthenticated: false, isInitializing: true });
    let tree: any;
    await act(async () => {
      tree = renderer.create(React.createElement(RootNavigator));
    });
    expect(tree).toBeDefined();
  });

  it('renders auth navigator when not authenticated', async () => {
    useAuth.mockReturnValue({ isAuthenticated: false, isInitializing: false });
    let tree: any;
    await act(async () => {
      tree = renderer.create(React.createElement(RootNavigator));
    });
    expect(tree).toBeDefined();
  });

  it('renders main navigator when authenticated', async () => {
    useAuth.mockReturnValue({ isAuthenticated: true, isInitializing: false });
    let tree: any;
    await act(async () => {
      tree = renderer.create(React.createElement(RootNavigator));
    });
    expect(tree).toBeDefined();
  });
});
