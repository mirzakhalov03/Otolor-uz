import React from 'react';
import { Button } from 'antd';
import {
  TeamOutlined,
  CalendarOutlined,
  AppstoreOutlined,
  TagsOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../context/AuthContext';
import './AdminBottomBar.scss';

const AdminBottomBar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { logout } = useAuth();

  const getSelectedKey = (): string => {
    const path = location.pathname;
    if (path.includes('/admins-otolor/appointments')) return 'appointments';
    if (path.includes('/admins-otolor/categories')) return 'categories';
    if (path.includes('/admins-otolor/services')) return 'services';
    if (path.includes('/admins-otolor/doctors')) return 'doctors';
    return 'doctors';
  };

  const activeKey = getSelectedKey();

  const tabs = [
    { key: 'doctors', icon: <TeamOutlined />, label: t('admin.doctors'), path: '/admins-otolor/doctors' },
    { key: 'appointments', icon: <CalendarOutlined />, label: t('admin.appointments'), path: '/admins-otolor/appointments' },
    { key: 'categories', icon: <AppstoreOutlined />, label: t('admin.categories'), path: '/admins-otolor/categories' },
    { key: 'services', icon: <TagsOutlined />, label: t('admin.services'), path: '/admins-otolor/services' },
  ] as const;

  const handleLogout = () => {
    logout();
    navigate('/admins-otolor/login', { replace: true });
  };

  return (
    <div className="admin-bottom-bar" role="navigation" aria-label="Admin mobile navigation">
      <div className="admin-bottom-bar__tabs">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            className={`admin-bottom-bar__tab ${activeKey === tab.key ? 'admin-bottom-bar__tab--active' : ''}`}
            onClick={() => navigate(tab.path)}
          >
            <span className="admin-bottom-bar__tab-icon">{tab.icon}</span>
            <span className="admin-bottom-bar__tab-label">{tab.label}</span>
          </button>
        ))}
      </div>
      <Button
        type="text"
        icon={<LogoutOutlined />}
        onClick={handleLogout}
        className="admin-bottom-bar__logout"
      >
        {t('auth.logout')}
      </Button>
    </div>
  );
};

export default AdminBottomBar;
