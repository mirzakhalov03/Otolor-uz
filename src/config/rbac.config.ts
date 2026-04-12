/**
 * RBAC Configuration (Simplified)
 * No role-based access — just a helper for the simplified admin panel
 */

/**
 * Always returns true — all menu items are accessible to authenticated admins.
 */
export const hasMenuAccess = (_menuKey: string, _userRole?: string): boolean => {
  return true;
};
