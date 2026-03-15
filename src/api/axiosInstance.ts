/**
 * Axios Instance Configuration
 * Centralized HTTP client with interceptors for cookie-based auth and error normalization
 */

import axios from 'axios';
import type { AxiosError, InternalAxiosRequestConfig } from 'axios';
import type { ApiResponse } from './types';

// Get base URL from environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';

export const AUTH_LOGOUT_EVENT = 'auth:logout';
export const AUTH_LOGIN_EVENT = 'auth:login';

export const emitAuthLogout = (): void => {
  window.dispatchEvent(new Event(AUTH_LOGOUT_EVENT));
};

export const emitAuthLogin = <T = unknown>(user?: T): void => {
  window.dispatchEvent(new CustomEvent(AUTH_LOGIN_EVENT, { detail: { user } }));
};

// Create axios instance
export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Required for HTTP-only refresh token cookie
});

// Flag to prevent multiple refresh attempts
let isRefreshing = false;
let failedQueue: Array<{
  resolve: () => void;
  reject: (error: Error) => void;
}> = [];

const processQueue = (error: Error | null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve();
    }
  });
  failedQueue = [];
};

const shouldSkipRefresh = (url?: string): boolean => {
  if (!url) return false;

  return (
    url.includes('/auth/login') ||
    url.includes('/auth/register') ||
    url.includes('/auth/refresh') ||
    url.includes('/auth/logout')
  );
};

/**
 * Request Interceptor
 * - Sends credentials via cookies only
 */
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => config,
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * - Handles 401 errors with automatic token refresh
 * - Normalizes error responses
 */
axiosInstance.interceptors.response.use(
  (response) => {
    // Return the data directly for successful responses
    return response;
  },
  async (error: AxiosError<ApiResponse>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    const normalizedError: ApiResponse = {
      success: false,
      status: error.response?.status || 500,
      message: error.response?.data?.message || error.message || 'An unexpected error occurred',
      errors: error.response?.data?.errors,
    };

    // Handle 401 Unauthorized
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !shouldSkipRefresh(originalRequest.url)
    ) {
      // Prevent retry loop
      if (isRefreshing) {
        return new Promise<void>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => axiosInstance(originalRequest))
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Attempt to refresh cookies
        const response = await axios.post<ApiResponse>(
          `${API_BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        if (response.data.success) {
          processQueue(null);
          return axiosInstance(originalRequest);
        } else {
          throw new Error('Failed to refresh token');
        }
      } catch (refreshError) {
        processQueue(refreshError as Error);
        emitAuthLogout();
        
        // Redirect to admin login
        if (window.location.pathname.startsWith('/admins-otolor')) {
          window.location.href = '/admins-otolor/login';
        }

        return Promise.reject(normalizedError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(normalizedError);
  }
);

export default axiosInstance;
