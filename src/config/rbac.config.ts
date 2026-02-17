/**
 * Role-Based Access Control Configuration
 * Defines routes and permissions for each role
 */

import type { Role } from '../api/types';

/**
 * Menu item configuration for sidebar
 */
export interface MenuItemConfig {
  key: string;
  path: string;
  requiredRoles: Role['name'][];
  requiredPermissions?: string[];
}

/**
 * Role definitions with their allowed menu items
 * This is the single source of truth for RBAC in the frontend
 */
export const ROLE_MENU_ACCESS: Record<Role['name'], string[]> = {
  superadmin: [
    'dashboard',
    'doctors',
    'services',
    'appointments',
    'blogs',
    'users',
    'roles',
    'settings',
  ],
  admin: [
    'dashboard',
    'doctors',
    'services',
    'appointments',
    'blogs',
  ],
  doctor: [
    'dashboard',
    'profile',
    'services',
    'appointments',
    'blogs',
  ],
  user: [
    'dashboard',
    'profile',
  ],
};

/**
 * Menu items configuration
 * Maps menu keys to their paths and role requirements
 */
export const MENU_ITEMS_CONFIG: MenuItemConfig[] = [
  {
    key: 'dashboard',
    path: '/admins-otolor',
    requiredRoles: ['user', 'doctor', 'admin', 'superadmin'],
  },
  {
    key: 'profile',
    path: '/admins-otolor/profile',
    requiredRoles: ['user', 'doctor', 'admin', 'superadmin'],
  },
  {
    key: 'doctors',
    path: '/admins-otolor/doctors',
    requiredRoles: ['admin', 'superadmin'],
    requiredPermissions: ['doctors:read'],
  },
  {
    key: 'services',
    path: '/admins-otolor/services',
    requiredRoles: ['doctor', 'admin', 'superadmin'],
    requiredPermissions: ['services:read'],
  },
  {
    key: 'appointments',
    path: '/admins-otolor/appointments',
    requiredRoles: ['doctor', 'admin', 'superadmin'],
    requiredPermissions: ['appointments:read'],
  },
  {
    key: 'blogs',
    path: '/admins-otolor/blogs',
    requiredRoles: ['doctor', 'admin', 'superadmin'],
  },
  {
    key: 'users',
    path: '/admins-otolor/users',
    requiredRoles: ['superadmin'],
    requiredPermissions: ['users:manage'],
  },
  {
    key: 'roles',
    path: '/admins-otolor/roles',
    requiredRoles: ['superadmin'],
    requiredPermissions: ['users:manage'],
  },
  {
    key: 'settings',
    path: '/admins-otolor/settings',
    requiredRoles: ['superadmin'],
  },
];

/**
 * Route protection configuration
 * Defines which roles can access which routes
 */
export const PROTECTED_ROUTES: Record<string, Role['name'][]> = {
  '/admins-otolor': ['user', 'doctor', 'admin', 'superadmin'],
  '/admins-otolor/profile': ['user', 'doctor', 'admin', 'superadmin'],
  '/admins-otolor/doctors': ['admin', 'superadmin'],
  '/admins-otolor/doctors/create': ['admin', 'superadmin'],
  '/admins-otolor/doctors/:id/edit': ['admin', 'superadmin'],
  '/admins-otolor/services': ['doctor', 'admin', 'superadmin'],
  '/admins-otolor/appointments': ['doctor', 'admin', 'superadmin'],
  '/admins-otolor/blogs': ['doctor', 'admin', 'superadmin'],
  '/admins-otolor/users': ['superadmin'],
  '/admins-otolor/roles': ['superadmin'],
  '/admins-otolor/settings': ['superadmin'],
};

/**
 * Helper function to check if a user has access to a menu item
 * @param menuKey - The menu item key
 * @param userRole - The user's role name
 * @returns boolean - Whether the user has access
 */
export const hasMenuAccess = (menuKey: string, userRole?: Role['name']): boolean => {
  if (!userRole) return false;
  const allowedMenus = ROLE_MENU_ACCESS[userRole] || [];
  return allowedMenus.includes(menuKey);
};

/**
 * Helper function to get all allowed menu items for a role
 * @param userRole - The user's role name
 * @returns string[] - Array of allowed menu keys
 */
export const getAllowedMenuItems = (userRole?: Role['name']): string[] => {
  if (!userRole) return [];
  return ROLE_MENU_ACCESS[userRole] || [];
};

/**
 * Helper function to check if a user can access a route
 * @param routePath - The route path to check
 * @param userRole - The user's role name
 * @returns boolean - Whether the user has access
 */
export const canAccessRoute = (routePath: string, userRole?: Role['name']): boolean => {
  if (!userRole) return false;
  
  // Check exact match first
  if (PROTECTED_ROUTES[routePath]) {
    return PROTECTED_ROUTES[routePath].includes(userRole);
  }
  
  // Check pattern matches (for routes with params)
  for (const [pattern, roles] of Object.entries(PROTECTED_ROUTES)) {
    const regexPattern = pattern.replace(/:[^/]+/g, '[^/]+');
    const regex = new RegExp(`^${regexPattern}$`);
    if (regex.test(routePath)) {
      return roles.includes(userRole);
    }
  }
  
  // Default to allowing access for authenticated users
  return true;
};

/**
 * Get the default redirect path for a role after login
 * @param userRole - The user's role name
 * @returns string - The default redirect path
 */
export const getDefaultRedirectPath = (userRole?: Role['name']): string => {
  if (!userRole) return '/admins-otolor/login';
  return '/admins-otolor'; // Dashboard is accessible to all authenticated users
};
