/**
 * Protected Route Component
 * Simple route guard — checks if admin is authenticated via token
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Admin protected route — redirects to login if not authenticated
 */
export const AdminRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/admins-otolor/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;
