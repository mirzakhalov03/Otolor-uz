/**
 * Admin Header Component
 * Top navigation bar for admin panel
 */

import React from 'react';
import { Layout, Typography, Dropdown, Avatar, Space, Button, theme, message } from 'antd';
import type { MenuProps } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  BellOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../context/AuthContext';
import { useLogout } from '../../../api/query';
import LanguageSelector from '../../languageSelector/LanguageSelector';
import './AdminHeader.scss';

const { Header } = Layout;
const { Text } = Typography;

interface AdminHeaderProps {
  collapsed: boolean;
  onToggle: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ collapsed, onToggle }) => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const logoutMutation = useLogout();
  const { token } = theme.useToken();

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      message.success(t('auth.logoutSuccess'));
    } catch {
      // Error handled in mutation
    }
  };

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: t('admin.profile'),
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: t('admin.settings'),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: t('auth.logout'),
      danger: true,
      onClick: handleLogout,
    },
  ];

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
      </div>

      <div className="admin-header__right">
        {/* Language Selector */}
        <LanguageSelector />

        {/* Notifications */}
        <Button
          type="text"
          icon={<BellOutlined />}
          className="admin-header__notification"
        />

        {/* User Dropdown */}
        <Dropdown
          menu={{ items: userMenuItems }}
          trigger={['click']}
          placement="bottomRight"
        >
          <Space className="admin-header__user" size="small">
            <Avatar
              style={{ backgroundColor: '#2DC263' }}
              icon={<UserOutlined />}
              size="small"
            >
              {user?.firstName?.[0]}
            </Avatar>
            <Text className="admin-header__username">
              {user?.firstName} {user?.lastName}
            </Text>
          </Space>
        </Dropdown>
      </div>
    </Header>
  );
};

export default AdminHeader;
