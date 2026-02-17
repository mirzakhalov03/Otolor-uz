/**
 * Admin Sidebar Navigation
 * Reusable sidebar with active state and role-based menu items
 */

import React, { useMemo } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Layout, Menu, Typography } from 'antd';
import type { MenuProps } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  MedicineBoxOutlined,
  CalendarOutlined,
  FileTextOutlined,
  SettingOutlined,
  TeamOutlined,
  ProfileOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../context/AuthContext';
import { hasMenuAccess } from '../../../config/rbac.config';
import './AdminSidebar.scss';

const { Sider } = Layout;
const { Text } = Typography;

interface AdminSidebarProps {
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
}

type MenuItem = Required<MenuProps>['items'][number];

/**
 * Menu item definitions with their icons and labels
 */
interface MenuItemDefinition {
  key: string;
  icon: React.ReactNode;
  labelKey: string;
  path: string;
  dividerBefore?: boolean;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ collapsed, onCollapse }) => {
  const location = useLocation();
  const { t } = useTranslation();
  const { user } = useAuth();
  
  const userRole = user?.role?.name;

  // Get current active menu key based on path
  const getSelectedKey = (): string => {
    const path = location.pathname;
    
    if (path === '/admins-otolor' || path === '/admins-otolor/') {
      return 'dashboard';
    }
    
    if (path.includes('/admins-otolor/profile')) return 'profile';
    if (path.includes('/admins-otolor/doctors')) return 'doctors';
    if (path.includes('/admins-otolor/services')) return 'services';
    if (path.includes('/admins-otolor/appointments')) return 'appointments';
    if (path.includes('/admins-otolor/blogs')) return 'blogs';
    if (path.includes('/admins-otolor/users')) return 'users';
    if (path.includes('/admins-otolor/roles')) return 'roles';
    if (path.includes('/admins-otolor/settings')) return 'settings';
    
    return 'dashboard';
  };

  // All menu item definitions
  const allMenuItems: MenuItemDefinition[] = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      labelKey: 'admin.dashboard',
      path: '/admins-otolor',
    },
    {
      key: 'profile',
      icon: <ProfileOutlined />,
      labelKey: 'admin.profile',
      path: '/admins-otolor/profile',
    },
    {
      key: 'doctors',
      icon: <TeamOutlined />,
      labelKey: 'admin.doctors',
      path: '/admins-otolor/doctors',
    },
    {
      key: 'services',
      icon: <MedicineBoxOutlined />,
      labelKey: 'admin.services',
      path: '/admins-otolor/services',
    },
    {
      key: 'appointments',
      icon: <CalendarOutlined />,
      labelKey: 'admin.appointments',
      path: '/admins-otolor/appointments',
    },
    {
      key: 'blogs',
      icon: <FileTextOutlined />,
      labelKey: 'admin.blogs',
      path: '/admins-otolor/blogs',
    },
    // Admin-only sections (after divider)
    {
      key: 'users',
      icon: <UserOutlined />,
      labelKey: 'admin.users',
      path: '/admins-otolor/users',
      dividerBefore: true,
    },
    {
      key: 'roles',
      icon: <SettingOutlined />,
      labelKey: 'admin.rolesAndPermissions',
      path: '/admins-otolor/roles',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      labelKey: 'admin.settings',
      path: '/admins-otolor/settings',
    },
  ];

  // Filter menu items based on user role
  const menuItems: MenuItem[] = useMemo(() => {
    const items: MenuItem[] = [];
    let needsDivider = false;
    
    for (const item of allMenuItems) {
      // Check if user has access to this menu item
      if (!hasMenuAccess(item.key, userRole)) {
        continue;
      }
      
      // Add divider before admin-only sections
      if (item.dividerBefore && !needsDivider) {
        items.push({ type: 'divider' });
        needsDivider = true;
      }
      
      items.push({
        key: item.key,
        icon: item.icon,
        label: <NavLink to={item.path}>{t(item.labelKey, item.key)}</NavLink>,
      });
    }
    
    return items;
  }, [userRole, t]);

  // User role display name
  const getRoleDisplayName = () => {
    if (!userRole) return '';
    
    const roleDisplayNames: Record<string, string> = {
      superadmin: t('admin.superAdmin', 'Super Admin'),
      admin: t('admin.admin', 'Admin'),
      doctor: t('admin.doctor', 'Doctor'),
      user: t('admin.user', 'User'),
    };
    
    return roleDisplayNames[userRole] || userRole;
  };

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
      width={260}
      className="admin-sidebar"
      theme="dark"
      breakpoint="lg"
    >
      {/* Logo */}
      <div className="admin-sidebar__logo">
        <span className="admin-sidebar__logo-text">
          {collapsed ? 'O' : 'Otolor'}
        </span>
        {!collapsed && (
          <Text className="admin-sidebar__logo-subtitle">{t('auth.loginTitle')}</Text>
        )}
      </div>

      {/* User Info */}
      {!collapsed && user && (
        <div className="admin-sidebar__user">
          <div className="admin-sidebar__user-avatar">
            {user.firstName?.[0]}{user.lastName?.[0]}
          </div>
          <div className="admin-sidebar__user-info">
            <Text strong className="admin-sidebar__user-name">
              {user.firstName} {user.lastName}
            </Text>
            <Text className="admin-sidebar__user-role">
              {getRoleDisplayName()}
            </Text>
          </div>
        </div>
      )}

      {/* Navigation Menu */}
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[getSelectedKey()]}
        items={menuItems}
        className="admin-sidebar__menu"
      />
    </Sider>
  );
};

export default AdminSidebar;
