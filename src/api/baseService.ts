/**
 * Base Service
 * Centralized HTTP method wrappers with typed generics
 * All API calls should go through these methods
 */

import axiosInstance from './axiosInstance';
import type { ApiResponse, PaginationParams } from './types';
import type { AxiosRequestConfig } from 'axios';

/**
 * Build query string from params object
 */
const buildQueryString = (params?: Record<string, unknown>): string => {
  if (!params) return '';

  const queryParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      queryParams.append(key, String(value));
    }
  });

  const queryString = queryParams.toString();
  return queryString ? `?${queryString}` : '';
};

/**
 * Base Service with typed HTTP methods
 */
export const baseService = {
  /**
   * GET request
   * @param endpoint - API endpoint (without base URL)
   * @param params - Query parameters
   * @param config - Additional axios config
   */
  async get<T>(
    endpoint: string,
    params?: PaginationParams & Record<string, unknown>,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const queryString = buildQueryString(params);
    const response = await axiosInstance.get<ApiResponse<T>>(`${endpoint}${queryString}`, config);
    return response.data;
  },

  /**
   * POST request
   * @param endpoint - API endpoint (without base URL)
   * @param data - Request body
   * @param config - Additional axios config
   */
  async post<T, D = unknown>(
    endpoint: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await axiosInstance.post<ApiResponse<T>>(endpoint, data, config);
    return response.data;
  },

  /**
   * PUT request
   * @param endpoint - API endpoint (without base URL)
   * @param data - Request body
   * @param config - Additional axios config
   */
  async put<T, D = unknown>(
    endpoint: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await axiosInstance.put<ApiResponse<T>>(endpoint, data, config);
    return response.data;
  },

  /**
   * PATCH request
   * @param endpoint - API endpoint (without base URL)
   * @param data - Request body
   * @param config - Additional axios config
   */
  async patch<T, D = unknown>(
    endpoint: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await axiosInstance.patch<ApiResponse<T>>(endpoint, data, config);
    return response.data;
  },

  /**
   * DELETE request
   * @param endpoint - API endpoint (without base URL)
   * @param config - Additional axios config
   */
  async delete<T>(
    endpoint: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await axiosInstance.delete<ApiResponse<T>>(endpoint, config);
    return response.data;
  },

  /**
   * POST request with FormData (for file uploads)
   * @param endpoint - API endpoint (without base URL)
   * @param formData - FormData object
   * @param config - Additional axios config
   */
  async postFormData<T>(
    endpoint: string,
    formData: FormData,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await axiosInstance.post<ApiResponse<T>>(endpoint, formData, {
      ...config,
      headers: {
        ...config?.headers,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * PATCH request with FormData (for file uploads)
   * @param endpoint - API endpoint (without base URL)
   * @param formData - FormData object
   * @param config - Additional axios config
   */
  async patchFormData<T>(
    endpoint: string,
    formData: FormData,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await axiosInstance.patch<ApiResponse<T>>(endpoint, formData, {
      ...config,
      headers: {
        ...config?.headers,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

export default baseService;
