/**
 * Admin Sidebar Navigation
 * Simplified sidebar with only Doctors and Appointments tabs
 */

import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Layout, Menu, Button, Typography } from 'antd';
import type { MenuProps } from 'antd';
import {
  TeamOutlined,
  CalendarOutlined,
  AppstoreOutlined,
  TagsOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
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
  const navigate = useNavigate();
  const { logout } = useAuth();

  const getSelectedKey = (): string => {
    const path = location.pathname;
    if (path.includes('/admins-otolor/appointments')) return 'appointments';
    if (path.includes('/admins-otolor/categories')) return 'categories';
    if (path.includes('/admins-otolor/services')) return 'services';
    if (path.includes('/admins-otolor/doctors')) return 'doctors';
    // Default to doctors
    return 'doctors';
  };

  const handleLogout = () => {
    logout();
    navigate('/admins-otolor/login', { replace: true });
  };

  const menuItems: MenuItem[] = [
    {
      key: 'doctors',
      icon: <TeamOutlined />,
      label: <NavLink to="/admins-otolor/doctors">Doctors</NavLink>,
    },
    {
      key: 'appointments',
      icon: <CalendarOutlined />,
      label: <NavLink to="/admins-otolor/appointments">Appointments</NavLink>,
    },
    {
      key: 'categories',
      icon: <AppstoreOutlined />,
      label: <NavLink to="/admins-otolor/categories">Categories</NavLink>,
    },
    {
      key: 'services',
      icon: <TagsOutlined />,
      label: <NavLink to="/admins-otolor/services">Services</NavLink>,
    },
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
          <Text className="admin-sidebar__logo-subtitle">Admin Panel</Text>
        )}
      </div>

      {/* Navigation Menu */}
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[getSelectedKey()]}
        items={menuItems}
        className="admin-sidebar__menu"
      />

      {/* Logout Button */}
      <div className="admin-sidebar__logout">
        <Button
          type="text"
          icon={<LogoutOutlined />}
          onClick={handleLogout}
          block
          className="admin-sidebar__logout-btn"
        >
          {!collapsed && 'Logout'}
        </Button>
      </div>
    </Sider>
  );
};

export default AdminSidebar;
