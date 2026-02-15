/**
 * Clinic Service Query Hooks
 * React Query hooks for clinic services management
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { clinicServiceApi } from '../services';
import type { CreateServiceRequest, UpdateServiceRequest } from '../services';
import type { SearchParams, ApiResponse } from '../types';

// Query keys for cache management
export const serviceKeys = {
  all: ['services'] as const,
  lists: () => [...serviceKeys.all, 'list'] as const,
  list: (params?: SearchParams) => [...serviceKeys.lists(), params] as const,
  details: () => [...serviceKeys.all, 'detail'] as const,
  detail: (id: string) => [...serviceKeys.details(), id] as const,
};

/**
 * Hook to get all clinic services with pagination
 */
export const useClinicServices = (params?: SearchParams) => {
  return useQuery({
    queryKey: serviceKeys.list(params),
    queryFn: async () => {
      const response = await clinicServiceApi.getAll(params);
      if (!response.success) {
        throw response;
      }
      return { data: response.data, meta: response.meta };
    },
    staleTime: 30 * 1000, // 30 seconds
  });
};

/**
 * Hook to get a single service by ID
 */
export const useClinicService = (id: string, enabled = true) => {
  return useQuery({
    queryKey: serviceKeys.detail(id),
    queryFn: async () => {
      const response = await clinicServiceApi.getById(id);
      if (!response.success) {
        throw response;
      }
      return response.data;
    },
    enabled: !!id && enabled,
  });
};

/**
 * Hook to create a new service
 */
export const useCreateClinicService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateServiceRequest) => {
      const response = await clinicServiceApi.create(data);
      if (!response.success) {
        throw response;
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: serviceKeys.lists() });
    },
    onError: (error: ApiResponse) => {
      console.error('Create service failed:', error.message);
    },
  });
};

/**
 * Hook to update a service
 */
export const useUpdateClinicService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateServiceRequest }) => {
      const response = await clinicServiceApi.update(id, data);
      if (!response.success) {
        throw response;
      }
      return response.data;
    },
    onSuccess: (updatedService) => {
      if (updatedService) {
        queryClient.setQueryData(serviceKeys.detail(updatedService._id), updatedService);
      }
      queryClient.invalidateQueries({ queryKey: serviceKeys.lists() });
    },
    onError: (error: ApiResponse) => {
      console.error('Update service failed:', error.message);
    },
  });
};

/**
 * Hook to delete a service
 */
export const useDeleteClinicService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await clinicServiceApi.delete(id);
      if (!response.success) {
        throw response;
      }
      return id;
    },
    onSuccess: (deletedId) => {
      queryClient.removeQueries({ queryKey: serviceKeys.detail(deletedId) });
      queryClient.invalidateQueries({ queryKey: serviceKeys.lists() });
    },
    onError: (error: ApiResponse) => {
      console.error('Delete service failed:', error.message);
    },
  });
};

/**
 * Hook to upload service image
 */
export const useUploadServiceImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, image }: { id: string; image: File }) => {
      const response = await clinicServiceApi.uploadImage(id, image);
      if (!response.success) {
        throw response;
      }
      return response.data;
    },
    onSuccess: (updatedService) => {
      if (updatedService) {
        queryClient.setQueryData(serviceKeys.detail(updatedService._id), updatedService);
      }
      queryClient.invalidateQueries({ queryKey: serviceKeys.lists() });
    },
    onError: (error: ApiResponse) => {
      console.error('Upload service image failed:', error.message);
    },
  });
};
