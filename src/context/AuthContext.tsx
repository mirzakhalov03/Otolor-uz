/**
 * Auth Context Provider
 * Centralized authentication state management
 */

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { User } from '../api/types';
import type { ApiResponse } from '../api/types';
import { authService } from '../api/services';
import { authKeys } from '../api/query';
import { AUTH_LOGIN_EVENT, AUTH_LOGOUT_EVENT } from '../api/axiosInstance';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  hasRole: (roles: string[]) => boolean;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  const clearAuthState = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
    queryClient.removeQueries({ queryKey: authKeys.me() });
  }, [queryClient]);

  const bootstrapSession = useCallback(async () => {
    setIsInitializing(true);

    try {
      const meResponse = await authService.getMe();

      if (meResponse.success && meResponse.data) {
        setUser(meResponse.data);
        setIsAuthenticated(true);
        queryClient.setQueryData(authKeys.me(), meResponse.data);
        return;
      }

      throw meResponse;
    } catch (error) {
      const apiError = error as ApiResponse;

      // Session bootstrap fallback: try refresh once on initial 401
      if (apiError?.status === 401) {
        try {
          const refreshResponse = await authService.refreshToken();
          if (refreshResponse.success) {
            const retryMeResponse = await authService.getMe();
            if (retryMeResponse.success && retryMeResponse.data) {
              setUser(retryMeResponse.data);
              setIsAuthenticated(true);
              queryClient.setQueryData(authKeys.me(), retryMeResponse.data);
              return;
            }
          }
        } catch {
          // Refresh failed: fall through to logged-out state
        }
      }

      clearAuthState();
    } finally {
      setIsInitializing(false);
    }
  }, [clearAuthState, queryClient]);

  useEffect(() => {
    void bootstrapSession();
  }, [bootstrapSession]);

  useEffect(() => {
    const handleLogout = () => {
      clearAuthState();
      setIsInitializing(false);
    };

    const handleLogin = (event: Event) => {
      const customEvent = event as CustomEvent<{ user?: User }>;
      const loggedInUser = customEvent.detail?.user;

      if (loggedInUser) {
        setUser(loggedInUser);
        queryClient.setQueryData(authKeys.me(), loggedInUser);
      }

      setIsAuthenticated(true);
      setIsInitializing(false);
    };

    window.addEventListener(AUTH_LOGOUT_EVENT, handleLogout);
    window.addEventListener(AUTH_LOGIN_EVENT, handleLogin as EventListener);

    return () => {
      window.removeEventListener(AUTH_LOGOUT_EVENT, handleLogout);
      window.removeEventListener(AUTH_LOGIN_EVENT, handleLogin as EventListener);
    };
  }, [clearAuthState, queryClient]);

  const userRole = user?.role?.name;
  const isAdmin = userRole === 'admin' || userRole === 'superadmin';
  const isSuperAdmin = userRole === 'superadmin';

  const hasRole = (roles: string[]): boolean => {
    return userRole ? roles.includes(userRole) : false;
  };

  const hasPermission = (permission: string): boolean => {
    if (!user?.role?.permissions) return false;
    if (isSuperAdmin) return true; // Superadmin has all permissions
    return user.role.permissions.includes(permission);
  };

  const value: AuthContextType = {
    user: user ?? null,
    isAuthenticated,
    isInitializing,
    isLoading: isInitializing,
    isAdmin,
    isSuperAdmin,
    hasRole,
    hasPermission,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook to access auth context
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
