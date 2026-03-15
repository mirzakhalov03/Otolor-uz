/**
 * Auth Service
 * Pure API calls for authentication endpoints
 * Maps directly to backend /api/v1/auth routes
 */

import baseService from '../baseService';
import { emitAuthLogout } from '../axiosInstance';
import type {
  LoginRequest,
  RegisterRequest,
  User,
  ChangePasswordRequest,
} from '../types';

/**
 * Authentication API endpoints
 */
export const authService = {
  /**
   * Login user with username/email/phone and password
   * POST /auth/login
   */
  async login(credentials: LoginRequest) {
    return baseService.post<unknown, LoginRequest>('/auth/login', credentials);
  },

  /**
   * Register new user (public registration - user role only)
   * POST /auth/register
   */
  async register(userData: RegisterRequest) {
    return baseService.post<unknown, RegisterRequest>('/auth/register', userData);
  },

  /**
   * Refresh access token using refresh token cookie
   * POST /auth/refresh
   */
  async refreshToken() {
    return baseService.post<unknown>('/auth/refresh');
  },

  /**
   * Logout user (revoke refresh token)
   * POST /auth/logout
   */
  async logout() {
    try {
      await baseService.post('/auth/logout');
    } finally {
      // Always clear frontend auth state, even if API call fails
      emitAuthLogout();
    }
  },

  /**
   * Logout from all devices (optional endpoint support)
   * POST /auth/logout-all
   */
  async logoutAll() {
    try {
      await baseService.post('/auth/logout-all');
    } finally {
      emitAuthLogout();
    }
  },

  /**
   * Get current user profile
   * GET /auth/me
   */
  async getMe() {
    return baseService.get<User>('/auth/me');
  },

  /**
   * Change password
   * POST /auth/change-password
   */
  async changePassword(data: ChangePasswordRequest) {
    const response = await baseService.post('/auth/change-password', data);

    // Backend revokes all sessions on password change; clear frontend session state
    if (response.success) {
      emitAuthLogout();
    }

    return response;
  },

  /**
   * Clear authentication state
   */
  clearAuth() {
    emitAuthLogout();
  },
};

export default authService;
