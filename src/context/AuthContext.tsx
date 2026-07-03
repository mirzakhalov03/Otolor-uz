/**
 * Auth Context Provider
 * Real JWT auth against POST /api/auth/login. Token stored in localStorage['access_token'].
 */

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginRequest } from '@/api/services/authService';
import { setUnauthorizedHandler } from '@/api/authEvents';
import { ApiError } from '@/api/errors';

const TOKEN_KEY = 'access_token';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

/** A token existing is treated as "logged in". A stale token is caught by the 401 interceptor. */
const hasToken = (): boolean => {
  try {
    return !!localStorage.getItem(TOKEN_KEY);
  } catch {
    return false;
  }
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(hasToken);
  const navigate = useNavigate();

  const login = useCallback(async (username: string, password: string) => {
    try {
      const { token } = await loginRequest(username, password);
      localStorage.setItem(TOKEN_KEY, token);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      const message = error instanceof ApiError ? error.message : undefined;
      return { success: false, message };
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setIsAuthenticated(false);
  }, []);

  // Bridge: the axios 401 interceptor calls this to log out + redirect.
  useEffect(() => {
    setUnauthorizedHandler(() => {
      setIsAuthenticated(false);
      navigate('/admins-otolor/login', { replace: true });
    });
    return () => setUnauthorizedHandler(null);
  }, [navigate]);

  const value: AuthContextType = { isAuthenticated, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
