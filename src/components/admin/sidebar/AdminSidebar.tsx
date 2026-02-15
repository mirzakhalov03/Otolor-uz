/**
 * Admin Sidebar Navigation
 * Reusable sidebar with active state and scalable sections
 */

import React from 'react';
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
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../context/AuthContext';
import './AdminSidebar.scss';

const { Sider } = Layout;
const { Text } = Typography;

interface AdminSidebarProps {
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
}

type MenuItem = Required<MenuProps>['items'][number];

const AdminSidebar: React.FC<AdminSidebarProps> = ({ collapsed, onCollapse }) => {
  const location = useLocation();
  const { t } = useTranslation();
  const { user, isSuperAdmin } = useAuth();

  // Get current active menu key based on path
  const getSelectedKey = (): string => {
    const path = location.pathname;
    
    if (path === '/admins-otolor' || path === '/admins-otolor/') {
      return 'dashboard';
    }
    
    if (path.includes('/admins-otolor/doctors')) return 'doctors';
    if (path.includes('/admins-otolor/services')) return 'services';
    if (path.includes('/admins-otolor/appointments')) return 'appointments';
    if (path.includes('/admins-otolor/blogs')) return 'blogs';
    if (path.includes('/admins-otolor/users')) return 'users';
    if (path.includes('/admins-otolor/roles')) return 'roles';
    if (path.includes('/admins-otolor/settings')) return 'settings';
    
    return 'dashboard';
  };

  // Navigation items
  const menuItems: MenuItem[] = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: <NavLink to="/admins-otolor">{t('admin.dashboard')}</NavLink>,
    },
    {
      key: 'doctors',
      icon: <TeamOutlined />,
      label: <NavLink to="/admins-otolor/doctors">{t('admin.doctors')}</NavLink>,
    },
    {
      key: 'services',
      icon: <MedicineBoxOutlined />,
      label: <NavLink to="/admins-otolor/services">{t('admin.services')}</NavLink>,
    },
    {
      key: 'appointments',
      icon: <CalendarOutlined />,
      label: <NavLink to="/admins-otolor/appointments">{t('admin.appointments')}</NavLink>,
    },
    {
      key: 'blogs',
      icon: <FileTextOutlined />,
      label: <NavLink to="/admins-otolor/blogs">{t('admin.blogs')}</NavLink>,
    },
    // Divider
    { type: 'divider' },
    // Admin-only sections
    ...(isSuperAdmin
      ? [
          {
            key: 'users',
            icon: <UserOutlined />,
            label: <NavLink to="/admins-otolor/users">{t('admin.users')}</NavLink>,
          },
          {
            key: 'roles',
            icon: <SettingOutlined />,
            label: <NavLink to="/admins-otolor/roles">{t('admin.rolesAndPermissions')}</NavLink>,
          },
        ]
      : []),
  ];

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
              {user.role?.name === 'superadmin' ? t('admin.superAdmin') : t('admin.admin')}
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
