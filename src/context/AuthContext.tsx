/**
 * Auth Context Provider
 * Centralized authentication state management
 */

import React, { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import type { User } from '../mocks/uiTypes';

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
  const user = null as User | null;
  const isAuthenticated = false;
  const isInitializing = false;
  const userRole = user?.role?.roleName;
  const isAdmin = userRole === 'admin' || userRole === 'superadmin';
  const isSuperAdmin = userRole === 'superadmin';

  const hasRole = (roles: string[]): boolean => {
    return userRole ? roles.includes(userRole) : false;
  };

  const hasPermission = (permission: string): boolean => {
    if (isSuperAdmin) return true; // Superadmin has all permissions
    const permissions: string[] = [];
    return permissions.includes(permission);
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
