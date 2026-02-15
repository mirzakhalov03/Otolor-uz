/**
 * Auth Service
 * Pure API calls for authentication endpoints
 * Maps directly to backend /api/v1/auth routes
 */

import baseService from '../baseService';
import { tokenManager } from '../axiosInstance';
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  RefreshTokenResponse,
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
    const response = await baseService.post<AuthResponse, LoginRequest>('/auth/login', credentials);
    
    // Store access token on successful login
    if (response.success && response.data?.accessToken) {
      tokenManager.setAccessToken(response.data.accessToken);
    }
    
    return response;
  },

  /**
   * Register new user (public registration - user role only)
   * POST /auth/register
   */
  async register(userData: RegisterRequest) {
    const response = await baseService.post<AuthResponse, RegisterRequest>('/auth/register', userData);
    
    // Store access token on successful registration
    if (response.success && response.data?.accessToken) {
      tokenManager.setAccessToken(response.data.accessToken);
    }
    
    return response;
  },

  /**
   * Refresh access token using refresh token cookie
   * POST /auth/refresh
   */
  async refreshToken() {
    const response = await baseService.post<RefreshTokenResponse>('/auth/refresh');
    
    // Store new access token
    if (response.success && response.data?.accessToken) {
      tokenManager.setAccessToken(response.data.accessToken);
    }
    
    return response;
  },

  /**
   * Logout user (revoke refresh token)
   * POST /auth/logout
   */
  async logout() {
    try {
      await baseService.post('/auth/logout');
    } finally {
      // Always clear local token, even if API call fails
      tokenManager.clearAccessToken();
    }
  },

  /**
   * Logout from all devices
   * POST /auth/logout-all
   */
  async logoutAll() {
    try {
      await baseService.post('/auth/logout-all');
    } finally {
      tokenManager.clearAccessToken();
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
    
    // If password change is successful, clear token (user needs to re-login)
    if (response.success) {
      tokenManager.clearAccessToken();
    }
    
    return response;
  },

  /**
   * Check if user is authenticated (has valid token)
   */
  isAuthenticated() {
    return tokenManager.isAuthenticated();
  },

  /**
   * Get stored access token
   */
  getAccessToken() {
    return tokenManager.getAccessToken();
  },

  /**
   * Clear authentication state
   */
  clearAuth() {
    tokenManager.clearAccessToken();
  },
};

export default authService;
