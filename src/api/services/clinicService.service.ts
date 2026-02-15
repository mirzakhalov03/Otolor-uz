/**
 * Clinic Service API
 * Pure API calls for clinic services management endpoints
 * Maps directly to backend /api/v1/services routes
 */

import baseService from '../baseService';
import type { ClinicService, SearchParams } from '../types';

export interface CreateServiceRequest {
  name: {
    uz: string;
    ru: string;
    en: string;
  };
  description: {
    uz: string;
    ru: string;
    en: string;
  };
  category: string;
  price: number;
  duration: number;
}

export interface UpdateServiceRequest {
  name?: {
    uz?: string;
    ru?: string;
    en?: string;
  };
  description?: {
    uz?: string;
    ru?: string;
    en?: string;
  };
  category?: string;
  price?: number;
  duration?: number;
  isActive?: boolean;
}

/**
 * Clinic services management API endpoints
 */
export const clinicServiceApi = {
  /**
   * Get all services with pagination
   * GET /services
   */
  async getAll(params?: SearchParams) {
    return baseService.get<ClinicService[]>('/services', params);
  },

  /**
   * Get service by ID
   * GET /services/:id
   */
  async getById(id: string) {
    return baseService.get<ClinicService>(`/services/${id}`);
  },

  /**
   * Create new service (admin only)
   * POST /services
   */
  async create(data: CreateServiceRequest) {
    return baseService.post<ClinicService, CreateServiceRequest>('/services', data);
  },

  /**
   * Update service
   * PATCH /services/:id
   */
  async update(id: string, data: UpdateServiceRequest) {
    return baseService.patch<ClinicService, UpdateServiceRequest>(`/services/${id}`, data);
  },

  /**
   * Delete service
   * DELETE /services/:id
   */
  async delete(id: string) {
    return baseService.delete(`/services/${id}`);
  },

  /**
   * Upload service image
   * PATCH /services/:id/image
   */
  async uploadImage(id: string, image: File) {
    const formData = new FormData();
    formData.append('image', image);
    return baseService.patchFormData<ClinicService>(`/services/${id}/image`, formData);
  },
};

export default clinicServiceApi;
