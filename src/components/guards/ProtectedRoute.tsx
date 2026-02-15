/**
 * Protected Route Component
 * Route guard for authenticated routes with role-based access control
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Spin } from 'antd';

interface ProtectedRouteProps {
  children: React.ReactNode;
  /**
   * Required roles to access the route
   * If not provided, only authentication is required
   */
  requiredRoles?: string[];
  /**
   * Required permissions to access the route
   */
  requiredPermissions?: string[];
  /**
   * Redirect path when not authenticated
   */
  loginPath?: string;
  /**
   * Redirect path when not authorized (wrong role/permission)
   */
  unauthorizedPath?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRoles,
  requiredPermissions,
  loginPath = '/admins-otolor/login',
  unauthorizedPath = '/unauthorized',
}) => {
  const { isAuthenticated, isLoading, hasRole, hasPermission } = useAuth();
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

  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  // Check role requirements
  if (requiredRoles && requiredRoles.length > 0) {
    if (!hasRole(requiredRoles)) {
      return <Navigate to={unauthorizedPath} replace />;
    }
  }

  // Check permission requirements
  if (requiredPermissions && requiredPermissions.length > 0) {
    const hasAllPermissions = requiredPermissions.every((permission) =>
      hasPermission(permission)
    );
    if (!hasAllPermissions) {
      return <Navigate to={unauthorizedPath} replace />;
    }
  }

  // Authorized - render children
  return <>{children}</>;
};

/**
 * Admin-only protected route
 * Convenience wrapper for admin/superadmin routes
 */
export const AdminRoute: React.FC<Omit<ProtectedRouteProps, 'requiredRoles'>> = ({
  children,
  ...props
}) => {
  return (
    <ProtectedRoute requiredRoles={['admin', 'superadmin']} {...props}>
      {children}
    </ProtectedRoute>
  );
};

/**
 * Superadmin-only protected route
 */
export const SuperAdminRoute: React.FC<Omit<ProtectedRouteProps, 'requiredRoles'>> = ({
  children,
  ...props
}) => {
  return (
    <ProtectedRoute requiredRoles={['superadmin']} {...props}>
      {children}
    </ProtectedRoute>
  );
};

export default ProtectedRoute;
