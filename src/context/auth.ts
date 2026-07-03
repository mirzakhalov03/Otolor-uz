/**
 * Auth context object + `useAuth` hook.
 * Kept separate from AuthContext.tsx (which exports only the <AuthProvider>
 * component) so React Fast Refresh works on the provider file.
 */

import { createContext, useContext } from 'react';

export interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
