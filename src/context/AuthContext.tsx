/**
 * Auth Context Provider
 * Simple hardcoded token-based authentication for admin panel
 */

import React, { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';

// Hardcoded credentials
const ADMIN_USERNAME = 'otoloruzadmin';
const ADMIN_PASSWORD = 'qwerty1234';
const ACCESS_TOKEN = 'asdfghjklzxcvbnm0987654321';
const TOKEN_KEY = 'access_token';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => { success: boolean; message: string };
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Check if a valid token exists in localStorage
 */
const checkAuth = (): boolean => {
  try {
    return localStorage.getItem(TOKEN_KEY) === ACCESS_TOKEN;
  } catch {
    return false;
  }
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(checkAuth);

  const login = useCallback((username: string, password: string) => {
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      localStorage.setItem(TOKEN_KEY, ACCESS_TOKEN);
      setIsAuthenticated(true);
      return { success: true, message: 'Login successful' };
    }
    return { success: false, message: 'Invalid username or password' };
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setIsAuthenticated(false);
  }, []);

  const value: AuthContextType = {
    isAuthenticated,
    login,
    logout,
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
