// src/services/api.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { APP_CONFIG } from '@constants/theme';
import { API_ENDPOINTS } from '@constants/index';

// ─── Config ───────────────────────────────────────────────────────────────────

// Update this to your backend URL
const BASE_URL = __DEV__
  ? 'http://192.168.1.1:3000/api/v1'  // Replace with your local IP
  : 'https://api.yourapp.com/api/v1';

// ─── Create Instance ──────────────────────────────────────────────────────────

const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: APP_CONFIG.apiTimeout,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// ─── Request Interceptor ──────────────────────────────────────────────────────

apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await SecureStore.getItemAsync(APP_CONFIG.tokenKey);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      // Silently fail — unauthenticated request will be rejected by server
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// ─── Response Interceptor ─────────────────────────────────────────────────────

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const subscribeTokenRefresh = (cb: (token: string) => void) => {
  refreshSubscribers.push(cb);
};

const onTokenRefreshed = (token: string) => {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
};

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    // Handle 401 and attempt token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            resolve(apiClient(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await SecureStore.getItemAsync('refresh_token');
        const response = await axios.post(`${BASE_URL}${API_ENDPOINTS.REFRESH_TOKEN}`, {
          refreshToken,
        });

        const { accessToken } = response.data.data;
        await SecureStore.setItemAsync(APP_CONFIG.tokenKey, accessToken);

        onTokenRefreshed(accessToken);
        isRefreshing = false;

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }
        return apiClient(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        // Token refresh failed — clear storage and force logout
        await SecureStore.deleteItemAsync(APP_CONFIG.tokenKey);
        await SecureStore.deleteItemAsync('refresh_token');
        // The AuthContext will pick this up on next render
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(normalizeError(error));
  }
);

// ─── Error Normalizer ─────────────────────────────────────────────────────────

export const normalizeError = (error: AxiosError): Error => {
  if (error.response) {
    const data = error.response.data as { message?: string };
    return new Error(data?.message || `Server error: ${error.response.status}`);
  }
  if (error.request) {
    return new Error('Network error. Please check your connection.');
  }
  return new Error(error.message || 'An unexpected error occurred.');
};

export default apiClient;
