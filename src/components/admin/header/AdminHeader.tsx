/**
 * Admin Header Component
 * Minimal top bar for admin panel
 */

import React from 'react';
import { Layout, Typography, Button, theme } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import './AdminHeader.scss';

const { Header } = Layout;
const { Text } = Typography;

interface AdminHeaderProps {
  collapsed: boolean;
  onToggle: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ collapsed, onToggle }) => {
  const { token } = theme.useToken();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admins-otolor/login', { replace: true });
  };

  return (
    <Header
      className="admin-header"
      style={{ background: token.colorBgContainer }}
    >
      <div className="admin-header__left">
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={onToggle}
          className="admin-header__toggle"
        />
        <Text strong className="admin-header__title">
          Otolor Admin
        </Text>
      </div>

      <div className="admin-header__right">
        <Button
          type="text"
          icon={<LogoutOutlined />}
          onClick={handleLogout}
          className="admin-header__logout-btn"
          danger
        >
          Logout
        </Button>
      </div>
    </Header>
  );
};

export default AdminHeader;
