/**
 * Doctor Query Hooks
 * React Query hooks for doctor management
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { doctorService } from '../services';
import type { CreateDoctorRequest, UpdateDoctorRequest } from '../services';
import type { SearchParams, ApiResponse } from '../types';

// Query keys for cache management
export const doctorKeys = {
  all: ['doctors'] as const,
  lists: () => [...doctorKeys.all, 'list'] as const,
  list: (params?: SearchParams) => [...doctorKeys.lists(), params] as const,
  details: () => [...doctorKeys.all, 'detail'] as const,
  detail: (id: string) => [...doctorKeys.details(), id] as const,
  availability: (id: string, date?: string) => [...doctorKeys.all, 'availability', id, date] as const,
};

/**
 * Hook to get all doctors with pagination
 */
export const useDoctors = (params?: SearchParams) => {
  return useQuery({
    queryKey: doctorKeys.list(params),
    queryFn: async () => {
      const response = await doctorService.getAll(params);
      if (!response.success) {
        throw response;
      }
      return { data: response.data, meta: response.meta };
    },
    staleTime: 30 * 1000, // 30 seconds
  });
};

/**
 * Hook to get a single doctor by ID
 */
export const useDoctor = (id: string, enabled = true) => {
  return useQuery({
    queryKey: doctorKeys.detail(id),
    queryFn: async () => {
      const response = await doctorService.getById(id);
      if (!response.success) {
        throw response;
      }
      return response.data;
    },
    enabled: !!id && enabled,
  });
};

/**
 * Hook to get doctor availability
 */
export const useDoctorAvailability = (id: string, date?: string) => {
  return useQuery({
    queryKey: doctorKeys.availability(id, date),
    queryFn: async () => {
      const response = await doctorService.getAvailability(id, date);
      if (!response.success) {
        throw response;
      }
      return response.data;
    },
    enabled: !!id,
  });
};

/**
 * Hook to create a new doctor
 */
export const useCreateDoctor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateDoctorRequest) => {
      const response = await doctorService.create(data);
      if (!response.success) {
        throw response;
      }
      return response.data;
    },
    onSuccess: () => {
      // Invalidate doctor list cache
      queryClient.invalidateQueries({ queryKey: doctorKeys.lists() });
    },
    onError: (error: ApiResponse) => {
      console.error('Create doctor failed:', error.message);
    },
  });
};

/**
 * Hook to update a doctor
 */
export const useUpdateDoctor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateDoctorRequest }) => {
      const response = await doctorService.update(id, data);
      if (!response.success) {
        throw response;
      }
      return response.data;
    },
    onSuccess: (updatedDoctor) => {
      // Update the specific doctor in cache
      if (updatedDoctor) {
        queryClient.setQueryData(doctorKeys.detail(updatedDoctor._id), updatedDoctor);
      }
      // Invalidate list to refresh
      queryClient.invalidateQueries({ queryKey: doctorKeys.lists() });
    },
    onError: (error: ApiResponse) => {
      console.error('Update doctor failed:', error.message);
    },
  });
};

/**
 * Hook to delete a doctor
 */
export const useDeleteDoctor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await doctorService.delete(id);
      if (!response.success) {
        throw response;
      }
      return id;
    },
    onSuccess: (deletedId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: doctorKeys.detail(deletedId) });
      // Invalidate list
      queryClient.invalidateQueries({ queryKey: doctorKeys.lists() });
    },
    onError: (error: ApiResponse) => {
      console.error('Delete doctor failed:', error.message);
    },
  });
};
