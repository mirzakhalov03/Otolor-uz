/**
 * User Query Hooks
 * React Query hooks for user management (admin only)
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { userService } from '../services';
import type { CreateUserRequest, UpdateUserRequest, UserFilters } from '../services';
import type { ApiResponse } from '../types';

// Query keys for cache management
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (params?: UserFilters) => [...userKeys.lists(), params] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
};

/**
 * Hook to get all users with filters (admin only)
 */
export const useUsers = (params?: UserFilters) => {
  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: async () => {
      const response = await userService.getAll(params);
      if (!response.success) {
        throw response;
      }
      return { data: response.data, meta: response.meta };
    },
    staleTime: 30 * 1000,
  });
};

/**
 * Hook to get a single user by ID
 */
export const useUser = (id: string, enabled = true) => {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: async () => {
      const response = await userService.getById(id);
      if (!response.success) {
        throw response;
      }
      return response.data;
    },
    enabled: !!id && enabled,
  });
};

/**
 * Hook to create a new user (admin only)
 */
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateUserRequest) => {
      const response = await userService.create(data);
      if (!response.success) {
        throw response;
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
    onError: (error: ApiResponse) => {
      console.error('Create user failed:', error.message);
    },
  });
};

/**
 * Hook to update a user
 */
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateUserRequest }) => {
      const response = await userService.update(id, data);
      if (!response.success) {
        throw response;
      }
      return response.data;
    },
    onSuccess: (updatedUser) => {
      if (updatedUser) {
        queryClient.setQueryData(userKeys.detail(updatedUser._id), updatedUser);
      }
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
    onError: (error: ApiResponse) => {
      console.error('Update user failed:', error.message);
    },
  });
};

/**
 * Hook to delete a user
 */
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await userService.delete(id);
      if (!response.success) {
        throw response;
      }
      return id;
    },
    onSuccess: (deletedId) => {
      queryClient.removeQueries({ queryKey: userKeys.detail(deletedId) });
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
    onError: (error: ApiResponse) => {
      console.error('Delete user failed:', error.message);
    },
  });
};

/**
 * Hook to activate a user
 */
export const useActivateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await userService.activate(id);
      if (!response.success) {
        throw response;
      }
      return response.data;
    },
    onSuccess: (updatedUser) => {
      if (updatedUser) {
        queryClient.setQueryData(userKeys.detail(updatedUser._id), updatedUser);
      }
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
    onError: (error: ApiResponse) => {
      console.error('Activate user failed:', error.message);
    },
  });
};

/**
 * Hook to deactivate a user
 */
export const useDeactivateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await userService.deactivate(id);
      if (!response.success) {
        throw response;
      }
      return response.data;
    },
    onSuccess: (updatedUser) => {
      if (updatedUser) {
        queryClient.setQueryData(userKeys.detail(updatedUser._id), updatedUser);
      }
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
    onError: (error: ApiResponse) => {
      console.error('Deactivate user failed:', error.message);
    },
  });
};

/**
 * Hook to upload user profile image
 */
export const useUploadProfileImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, image }: { id: string; image: File }) => {
      const response = await userService.uploadProfileImage(id, image);
      if (!response.success) {
        throw response;
      }
      return response.data;
    },
    onSuccess: (updatedUser) => {
      if (updatedUser) {
        queryClient.setQueryData(userKeys.detail(updatedUser._id), updatedUser);
      }
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
    onError: (error: ApiResponse) => {
      console.error('Upload profile image failed:', error.message);
    },
  });
};
