const mockSecureStorage = {
  getItemAsync: jest.fn(async () => 'test-token'),
  setItemAsync: jest.fn(async () => undefined),
  deleteItemAsync: jest.fn(async () => undefined),
};

jest.mock('@services/secureStorage', () => ({
  __esModule: true,
  default: mockSecureStorage,
}));

const { default: apiClient, normalizeError } = require('@services/api');

describe('api module', () => {
  it('attaches authorization header from secure storage in requests', async () => {
    const handler = apiClient.interceptors.request.handlers[0].fulfilled;
    const config = { headers: {} };
    const result = await handler(config);

    expect(result.headers.Authorization).toBe('Bearer test-token');
  });

  it('normalizes response error messages', () => {
    const axiosError = {
      response: { data: { message: 'Server failure' }, status: 500 },
      config: {},
      name: 'AxiosError',
      message: 'Error',
      toJSON: () => ({}),
    };

    expect(normalizeError(axiosError)).toEqual(new Error('Server failure'));
  });

  it('normalizes network errors', () => {
    const axiosError = {
      request: {},
      config: {},
      name: 'AxiosError',
      message: 'Network error',
      toJSON: () => ({}),
    };

    expect(normalizeError(axiosError)).toEqual(
      new Error('Network error. Please check your connection.')
    );
  });
});

export {};
