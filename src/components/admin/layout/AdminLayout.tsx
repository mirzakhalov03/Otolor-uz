/**
 * Admin Layout Component
 * Main layout wrapper for admin panel with sidebar and header
 */

import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Layout, ConfigProvider, theme } from 'antd';
import AdminSidebar from '../sidebar/AdminSidebar';
import AdminHeader from '../header/AdminHeader';
import './AdminLayout.scss';

const { Content } = Layout;

const AdminLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: '#2DC263',
          borderRadius: 8,
        },
      }}
    >
      <Layout className="admin-layout">
        <AdminSidebar collapsed={collapsed} onCollapse={setCollapsed} />
        
        <Layout className="admin-layout__main">
          <AdminHeader
            collapsed={collapsed}
            onToggle={() => setCollapsed(!collapsed)}
          />
          
          <Content className="admin-layout__content">
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default AdminLayout;
