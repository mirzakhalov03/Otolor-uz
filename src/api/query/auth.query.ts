/**
 * Auth Query Hooks
 * React Query hooks for authentication
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services';
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
        throw new Error(response.message);
      }
      return response.data;
    },
    enabled: authService.isAuthenticated(),
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
      return response.data;
    },
    onSuccess: (data) => {
      // Update user cache with login response
      if (data?.user) {
        queryClient.setQueryData(authKeys.me(), data.user);
      }
      
      // Check if user is admin/superadmin and redirect accordingly
      const role = data?.user?.role?.name;
      if (role === 'admin' || role === 'superadmin') {
        navigate('/admins-otolor');
      } else if (role === 'doctor') {
        navigate('/doctor-dashboard');
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
      
      // Validate allowed roles for admin panel access
      const role = response.data?.user?.role?.name;
      const allowedRoles = ['admin', 'superadmin', 'doctor'];
      if (!role || !allowedRoles.includes(role)) {
        authService.clearAuth();
        throw { 
          success: false, 
          status: 403, 
          message: 'Access denied. Admin panel access required.' 
        } as ApiResponse;
      }
      
      return response.data;
    },
    onSuccess: (data) => {
      if (data?.user) {
        queryClient.setQueryData(authKeys.me(), data.user);
      }
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
      return response.data;
    },
    onSuccess: (data) => {
      if (data?.user) {
        queryClient.setQueryData(authKeys.me(), data.user);
      }
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
      navigate('/');
    },
    onError: () => {
      // Even on error, clear local state
      queryClient.removeQueries({ queryKey: authKeys.all });
      navigate('/');
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
      navigate('/admins-otolor/login');
    },
  });
};

/**
 * Hook to check authentication status
 */
export const useIsAuthenticated = (): boolean => {
  return authService.isAuthenticated();
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
