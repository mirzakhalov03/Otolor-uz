/**
 * Guest Route Component
 * Prevents authenticated admins from accessing the login page
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface GuestRouteProps {
  children: React.ReactNode;
}

export const GuestRoute: React.FC<GuestRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (isAuthenticated) {
    const from = (location.state as { from?: Location })?.from?.pathname || '/admins-otolor';
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
};

export default GuestRoute;
