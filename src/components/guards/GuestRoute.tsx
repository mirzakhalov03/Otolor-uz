/**
 * Guest Route Component
 * Prevents authenticated users from accessing login/register pages
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Spin } from 'antd';

interface GuestRouteProps {
  children: React.ReactNode;
  /**
   * Redirect path when already authenticated
   */
  redirectTo?: string;
}

export const GuestRoute: React.FC<GuestRouteProps> = ({
  children,
  redirectTo = '/admins-otolor',
}) => {
  const { isAuthenticated, isLoading, isAdmin } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          background: '#f0f2f5',
        }}
      >
        <Spin size="large" tip="Loading..." />
      </div>
    );
  }

  // Already authenticated - redirect
  if (isAuthenticated && isAdmin) {
    // Get the intended destination from location state
    const from = (location.state as { from?: Location })?.from?.pathname || redirectTo;
    return <Navigate to={from} replace />;
  }

  // Not authenticated - render children (login form)
  return <>{children}</>;
};

export default GuestRoute;
