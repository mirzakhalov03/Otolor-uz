/**
 * Auth Context Provider
 * Centralized authentication state management
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { User } from '../api/types';
import { authService } from '../api/services';
import { useCurrentUser } from '../api/query';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
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
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Use React Query to fetch current user
  const { data: user, isLoading, error } = useCurrentUser();

  useEffect(() => {
    // Mark as initialized once initial check is complete
    if (!isLoading) {
      setIsInitialized(true);
    }
  }, [isLoading]);

  // Clear token if fetching user failed (invalid token)
  useEffect(() => {
    if (error && authService.isAuthenticated()) {
      authService.clearAuth();
    }
  }, [error]);

  const isAuthenticated = !!user && authService.isAuthenticated();
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
    isLoading: !isInitialized || isLoading,
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
