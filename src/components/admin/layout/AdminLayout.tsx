/**
 * Admin Layout Component
 * Main layout wrapper for admin panel with sidebar and header
 */

import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Layout, ConfigProvider, theme, Grid } from 'antd';
import AdminSidebar from '../sidebar/AdminSidebar';
import AdminHeader from '../header/AdminHeader';
import AdminBottomBar from '../bottombar/AdminBottomBar';
import './AdminLayout.scss';

const { Content } = Layout;
const { useBreakpoint } = Grid;

const AdminLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const screens = useBreakpoint();
  const isMobile = !screens.lg;

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
        {!isMobile && <AdminSidebar collapsed={collapsed} onCollapse={setCollapsed} />}
        
        <Layout className="admin-layout__main">
          <AdminHeader
            collapsed={collapsed}
            onToggle={() => setCollapsed(!collapsed)}
          />
          
          <Content className="admin-layout__content">
            <Outlet />
          </Content>
        </Layout>

        {isMobile && <AdminBottomBar />}
      </Layout>
    </ConfigProvider>
  );
};

export default AdminLayout;
