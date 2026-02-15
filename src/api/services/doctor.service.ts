/**
 * Doctor Service
 * Pure API calls for doctor management endpoints
 * Maps directly to backend /api/v1/doctors routes
 */

import baseService from '../baseService';
import type { Doctor, SearchParams } from '../types';

export interface CreateDoctorRequest {
  userId?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  phone?: string;
  specialization: string;
  experience: number;
  education: string[];
  bio?: string;
  languages?: string[];
  consultationFee: number;
}

export interface UpdateDoctorRequest {
  specialization?: string;
  experience?: number;
  education?: string[];
  bio?: string;
  languages?: string[];
  consultationFee?: number;
  isAvailable?: boolean;
  isActive?: boolean;
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
   * Create new doctor (admin only)
   * POST /doctors
   */
  async create(data: CreateDoctorRequest) {
    return baseService.post<Doctor, CreateDoctorRequest>('/doctors', data);
  },

  /**
   * Update doctor
   * PATCH /doctors/:id
   */
  async update(id: string, data: UpdateDoctorRequest) {
    return baseService.patch<Doctor, UpdateDoctorRequest>(`/doctors/${id}`, data);
  },

  /**
   * Delete doctor
   * DELETE /doctors/:id
   */
  async delete(id: string) {
    return baseService.delete(`/doctors/${id}`);
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
