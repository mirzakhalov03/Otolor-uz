import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getDoctors, getDoctor, createDoctor, updateDoctor, deleteDoctor } from '@/api/services/doctorService';
import {
  getAdminAppointments,
  updateAppointmentStatus,
  deleteAppointment,
} from '@/api/services/adminService';
import type { AdminAppointmentParams } from '@/api/services/adminService';
import { getCategories, createCategory } from '@/api/services/categoryService';
import {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} from '@/api/services/serviceService';
import type {
  CreateCategoryPayload,
  CreateServicePayload,
  UpdateServicePayload,
} from '@/api/types/catalog.types';

// ========================================
// DOCTOR HOOKS (Admin)
// ========================================

/**
 * Fetch all doctors for admin panel.
 */
export const useAdminDoctors = (search?: string) => {
  return useQuery({
    queryKey: ['admin', 'doctors', search],
    queryFn: () => getDoctors(search),
  });
};

/**
 * Fetch a single doctor by ID.
 */
export const useAdminDoctor = (id: string | null) => {
  return useQuery({
    queryKey: ['admin', 'doctors', id],
    queryFn: () => getDoctor(id!),
    enabled: !!id,
  });
};

/**
 * Create a new doctor.
 */
export const useCreateDoctor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { name: string; specialization?: string; avatarUrl?: string; weeklySchedule: Record<string, string> }) =>
      createDoctor(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'doctors'] });
    },
  });
};

/**
 * Update an existing doctor.
 */
export const useUpdateDoctor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { name?: string; specialization?: string; avatarUrl?: string; weeklySchedule?: Record<string, string> } }) =>
      updateDoctor(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'doctors'] });
    },
  });
};

/**
 * Delete a doctor.
 */
export const useDeleteDoctor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteDoctor(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'doctors'] });
    },
  });
};

// ========================================
// APPOINTMENT HOOKS (Admin)
// ========================================

/**
 * Fetch appointments with filters and pagination.
 */
export const useAdminAppointments = (params: AdminAppointmentParams = {}) => {
  return useQuery({
    queryKey: ['admin', 'appointments', params],
    queryFn: () => getAdminAppointments(params),
  });
};

/**
 * Update appointment status (pending → seen | missed).
 */
export const useUpdateAppointmentStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'seen' | 'missed' }) =>
      updateAppointmentStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'appointments'] });
    },
  });
};

/**
 * Delete an appointment.
 */
export const useDeleteAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteAppointment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'appointments'] });
    },
  });
};

// ========================================
// CATEGORY HOOKS (Admin)
// ========================================

export const useAdminCategories = () => {
  return useQuery({
    queryKey: ['admin', 'categories'],
    queryFn: () => getCategories(),
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateCategoryPayload) => createCategory(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] });
    },
  });
};

// ========================================
// SERVICE HOOKS (Admin)
// ========================================

export const useAdminServices = (categoryId?: string) => {
  return useQuery({
    queryKey: ['admin', 'services', categoryId],
    queryFn: () => getServices(categoryId),
  });
};

export const useAdminService = (id: string | null) => {
  return useQuery({
    queryKey: ['admin', 'services', id],
    queryFn: () => getServiceById(id!),
    enabled: !!id,
  });
};

export const useCreateService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateServicePayload) => createService(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'services'] });
    },
  });
};

export const useUpdateService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateServicePayload }) =>
      updateService(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'services'] });
    },
  });
};

export const useDeleteService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'services'] });
    },
  });
};
