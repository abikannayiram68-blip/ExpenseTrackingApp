import React from 'react';
import renderer, { act } from 'react-test-renderer';

// Mocks
jest.mock('@react-navigation/native', () => ({ useNavigation: () => ({ navigate: jest.fn() }) }));

const mockLogin = jest.fn(async () => undefined);
jest.mock('@context/AuthContext', () => ({ useAuth: () => ({ login: mockLogin, error: null, isLoading: false, clearError: jest.fn() }) }));

jest.mock('@components/common/AppInput', () => {
  const React = require('react');
  return (props: any) => React.createElement('AppInput', props);
});

jest.mock('@components/common/AppButton', () => {
  const React = require('react');
  return (props: any) => React.createElement('AppButton', props);
});

jest.mock('react-native-toast-message', () => ({ show: jest.fn() }));

const LoginScreen = require('@screens/auth/LoginScreen').default;

describe('LoginScreen', () => {
  afterEach(() => jest.clearAllMocks());

  it('renders and calls login when button pressed', async () => {
    let tree: any;
    await act(async () => {
      tree = renderer.create(React.createElement(LoginScreen));
    });

    const root = tree.root;
    const button = root.findAllByType('AppButton')[0];
    expect(button).toBeDefined();

    await act(async () => {
      await button.props.onPress();
    });

    expect(mockLogin).toHaveBeenCalled();
  });
});
