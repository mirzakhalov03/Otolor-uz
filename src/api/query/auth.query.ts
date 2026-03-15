/**
 * Auth Query Hooks
 * React Query hooks for authentication
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services';
import { emitAuthLogin } from '../axiosInstance';
import type { LoginRequest, RegisterRequest, ChangePasswordRequest, ApiResponse } from '../types';

// Query keys for cache management
export const authKeys = {
  all: ['auth'] as const,
  me: () => [...authKeys.all, 'me'] as const,
};

/**
 * Hook to get current user profile
 * Automatically fetches user data if authenticated
 */
export const useCurrentUser = () => {
  return useQuery({
    queryKey: authKeys.me(),
    queryFn: async () => {
      const response = await authService.getMe();
      if (!response.success) {
        throw response;
      }
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  });
};

/**
 * Hook for login mutation
 */
export const useLogin = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (credentials: LoginRequest) => {
      const response = await authService.login(credentials);
      if (!response.success) {
        throw response;
      }

      const meResponse = await authService.getMe();
      if (!meResponse.success || !meResponse.data) {
        throw meResponse;
      }

      return meResponse.data;
    },
    onSuccess: (user) => {
      queryClient.setQueryData(authKeys.me(), user);
      emitAuthLogin(user);
      
      // Check if user is admin/superadmin and redirect accordingly
      const role = user?.role?.name;
      if (role === 'admin' || role === 'superadmin' || role === 'doctor') {
        navigate('/admins-otolor');
      } else {
        navigate('/');
      }
    },
    onError: (error: ApiResponse) => {
      console.error('Login failed:', error.message);
    },
  });
};

/**
 * Hook for admin-specific login (stays on admin dashboard)
 * Allows admin, superadmin, and doctor roles
 */
export const useAdminLogin = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (credentials: LoginRequest) => {
      const response = await authService.login(credentials);
      if (!response.success) {
        throw response;
      }

      const meResponse = await authService.getMe();
      if (!meResponse.success || !meResponse.data) {
        throw meResponse;
      }
      
      // Validate allowed roles for admin panel access
      const role = meResponse.data.role?.name;
      const allowedRoles = ['admin', 'superadmin', 'doctor'];
      if (!role || !allowedRoles.includes(role)) {
        await authService.logout();
        throw { 
          success: false, 
          status: 403, 
          message: 'Access denied. Admin panel access required.' 
        } as ApiResponse;
      }
      
      return meResponse.data;
    },
    onSuccess: (user) => {
      queryClient.setQueryData(authKeys.me(), user);
      emitAuthLogin(user);
      navigate('/admins-otolor');
    },
    onError: (error: ApiResponse) => {
      console.error('Admin login failed:', error.message);
    },
  });
};

/**
 * Hook for registration mutation
 */
export const useRegister = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (userData: RegisterRequest) => {
      const response = await authService.register(userData);
      if (!response.success) {
        throw response;
      }

      const meResponse = await authService.getMe();
      if (!meResponse.success || !meResponse.data) {
        throw meResponse;
      }

      return meResponse.data;
    },
    onSuccess: (user) => {
      queryClient.setQueryData(authKeys.me(), user);
      emitAuthLogin(user);
      navigate('/');
    },
    onError: (error: ApiResponse) => {
      console.error('Registration failed:', error.message);
    },
  });
};

/**
 * Hook for logout mutation
 */
export const useLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      // Clear all auth-related cache
      queryClient.removeQueries({ queryKey: authKeys.all });
      queryClient.clear();
      navigate('/admins-otolor/login');
    },
    onError: () => {
      // Even on error, clear local state
      queryClient.removeQueries({ queryKey: authKeys.all });
      queryClient.clear();
      navigate('/admins-otolor/login');
    },
  });
};

/**
 * Hook for logout from all devices
 */
export const useLogoutAll = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: () => authService.logoutAll(),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: authKeys.all });
      queryClient.clear();
      navigate('/admins-otolor/login');
    },
  });
};

/**
 * Hook for changing password
 */
export const useChangePassword = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (data: ChangePasswordRequest) => {
      const response = await authService.changePassword(data);
      if (!response.success) {
        throw response;
      }
      return response;
    },
    onSuccess: () => {
      // Clear cache as user needs to re-login
      queryClient.removeQueries({ queryKey: authKeys.all });
      queryClient.clear();
      navigate('/admins-otolor/login');
    },
  });
};

/**
 * Hook to check authentication status
 */
export const useIsAuthenticated = (): boolean => {
  const { data: user } = useCurrentUser();
  return !!user;
};

/**
 * Hook to check if user has admin privileges
 */
export const useIsAdmin = (): boolean => {
  const { data: user } = useCurrentUser();
  const role = user?.role?.name;
  return role === 'admin' || role === 'superadmin';
};

/**
 * Hook to check if user has specific role
 */
export const useHasRole = (roles: string[]): boolean => {
  const { data: user } = useCurrentUser();
  const userRole = user?.role?.name;
  return userRole ? roles.includes(userRole) : false;
};

/**
 * Helper to get permission checker
 */
export const usePermissions = () => {
  const { data: user } = useCurrentUser();
  
  return {
    hasPermission: (permission: string): boolean => {
      if (!user?.role?.permissions) return false;
      // Superadmin has all permissions
      if (user.role.name === 'superadmin') return true;
      return user.role.permissions.includes(permission);
    },
    permissions: user?.role?.permissions ?? [],
    role: user?.role?.name,
  };
};
