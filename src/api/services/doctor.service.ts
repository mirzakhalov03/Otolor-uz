/**
 * Doctor Service
 * Pure API calls for doctor management endpoints
 * Maps directly to backend /api/v1/doctors routes
 */

import baseService from '../baseService';
import type { Doctor, SearchParams } from '../types';

export interface CreateDoctorRequest {
  // User account fields (required)
  username: string;
  password: string;
  // Doctor profile fields
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialization: string;
  qualifications?: string[];
  experience?: number;
  bio?: string;
  consultationFee?: number;
  availableDays?: string[];
  workingHours?: {
    start: string;
    end: string;
  };
}

export interface UpdateDoctorRequest {
  // Optional user account fields
  username?: string;
  password?: string;
  // Optional doctor profile fields
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  specialization?: string;
  qualifications?: string[];
  experience?: number;
  bio?: string;
  consultationFee?: number;
  availableDays?: string[];
  workingHours?: {
    start: string;
    end: string;
  };
  isActive?: boolean;
}

export interface UsernameAvailabilityResponse {
  username: string;
  isAvailable: boolean;
}

/**
 * Doctor management API endpoints
 */
export const doctorService = {
  /**
   * Get all doctors with pagination
   * GET /doctors
   */
  async getAll(params?: SearchParams) {
    return baseService.get<Doctor[]>('/doctors', params);
  },

  /**
   * Get doctor by ID
   * GET /doctors/:id
   */
  async getById(id: string) {
    return baseService.get<Doctor>(`/doctors/${id}`);
  },

  /**
   * Get doctor by ID with linked user info
   * GET /doctors/:id/with-user
   */
  async getByIdWithUser(id: string) {
    return baseService.get<Doctor>(`/doctors/${id}/with-user`);
  },

  /**
   * Create new doctor with user account (admin only)
   * POST /doctors
   */
  async create(data: CreateDoctorRequest) {
    return baseService.post<Doctor, CreateDoctorRequest>('/doctors', data);
  },

  /**
   * Update doctor
   * PUT /doctors/:id
   */
  async update(id: string, data: UpdateDoctorRequest) {
    return baseService.put<Doctor, UpdateDoctorRequest>(`/doctors/${id}`, data);
  },

  /**
   * Delete doctor
   * DELETE /doctors/:id
   */
  async delete(id: string) {
    return baseService.delete(`/doctors/${id}`);
  },

  /**
   * Check username availability
   * GET /doctors/check-username?username=xxx
   */
  async checkUsername(username: string) {
    return baseService.get<UsernameAvailabilityResponse>('/doctors/check-username', { username });
  },

  /**
   * Get doctor availability
   * GET /doctors/:id/availability
   */
  async getAvailability(id: string, date?: string) {
    return baseService.get(`/doctors/${id}/availability`, { date });
  },
};

export default doctorService;
