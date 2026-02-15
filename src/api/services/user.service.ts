/**
 * User Service
 * Pure API calls for user management endpoints (admin only)
 * Maps directly to backend /api/v1/users routes
 */

import baseService from '../baseService';
import type { User, SearchParams } from '../types';

export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  username?: string;
  phone?: string;
  role: string; // Role ID
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  username?: string;
  phone?: string;
  role?: string;
  isActive?: boolean;
}

export interface UserFilters extends SearchParams {
  role?: string;
  isActive?: boolean;
}

/**
 * User management API endpoints (admin only)
 */
export const userService = {
  /**
   * Get all users with filters
   * GET /users
   */
  async getAll(params?: UserFilters) {
    return baseService.get<User[]>('/users', params);
  },

  /**
   * Get user by ID
   * GET /users/:id
   */
  async getById(id: string) {
    return baseService.get<User>(`/users/${id}`);
  },

  /**
   * Create new user (admin only)
   * POST /users
   */
  async create(data: CreateUserRequest) {
    return baseService.post<User, CreateUserRequest>('/users', data);
  },

  /**
   * Update user
   * PATCH /users/:id
   */
  async update(id: string, data: UpdateUserRequest) {
    return baseService.patch<User, UpdateUserRequest>(`/users/${id}`, data);
  },

  /**
   * Delete user
   * DELETE /users/:id
   */
  async delete(id: string) {
    return baseService.delete(`/users/${id}`);
  },

  /**
   * Activate user
   * PATCH /users/:id/activate
   */
  async activate(id: string) {
    return baseService.patch<User>(`/users/${id}/activate`);
  },

  /**
   * Deactivate user
   * PATCH /users/:id/deactivate
   */
  async deactivate(id: string) {
    return baseService.patch<User>(`/users/${id}/deactivate`);
  },

  /**
   * Upload user profile image
   * PATCH /users/:id/profile-image
   */
  async uploadProfileImage(id: string, image: File) {
    const formData = new FormData();
    formData.append('profileImage', image);
    return baseService.patchFormData<User>(`/users/${id}/profile-image`, formData);
  },
};

export default userService;
