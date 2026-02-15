/**
 * Admin Dashboard Page
 * Overview with statistics and quick actions
 */

import React from 'react';
import { Card, Row, Col, Typography, Statistic, Space } from 'antd';
import {
  TeamOutlined,
  CalendarOutlined,
  MedicineBoxOutlined,
  UserOutlined,
  ArrowUpOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../context/AuthContext';
import './AdminDashboard.scss';

const { Title, Text } = Typography;

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { t } = useTranslation();

  // Mock stats - will be replaced with actual API calls
  const stats = [
    {
      title: t('stats.totalDoctors'),
      value: 24,
      icon: <TeamOutlined />,
      color: '#2DC263',
      change: '+12%',
    },
    {
      title: t('stats.appointmentsToday'),
      value: 48,
      icon: <CalendarOutlined />,
      color: '#10b981',
      change: '+8%',
    },
    {
      title: t('stats.activeServices'),
      value: 16,
      icon: <MedicineBoxOutlined />,
      color: '#1ed34d',
      change: '+5%',
    },
    {
      title: t('stats.registeredUsers'),
      value: 1248,
      icon: <UserOutlined />,
      color: '#01a02e',
      change: '+18%',
    },
  ];

  return (
    <div className="admin-dashboard">
      {/* Welcome Section */}
      <div className="admin-dashboard__welcome">
        <div>
          <Title level={2} className="admin-dashboard__title">
            {t('admin.welcomeBack', { name: user?.firstName })}
          </Title>
          <Text type="secondary">
            {t('admin.dashboardSubtitle')}
          </Text>
        </div>
      </div>

      {/* Stats Cards */}
      <Row gutter={[24, 24]} className="admin-dashboard__stats">
        {stats.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card className="stat-card" bordered={false}>
              <Space direction="vertical" size={8} style={{ width: '100%' }}>
                <div
                  className="stat-card__icon"
                  style={{ backgroundColor: `${stat.color}15`, color: stat.color }}
                >
                  {stat.icon}
                </div>
                <Statistic
                  title={stat.title}
                  value={stat.value}
                  valueStyle={{ fontSize: 28, fontWeight: 700 }}
                />
                <Space size={4}>
                  <ArrowUpOutlined style={{ color: '#52c41a' }} />
                  <Text style={{ color: '#52c41a' }}>{stat.change}</Text>
                  <Text type="secondary">{t('stats.fromLastMonth')}</Text>
                </Space>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Quick Actions & Recent Activity */}
      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={16}>
          <Card
            title={t('admin.recentAppointments')}
            className="admin-page__card"
            bordered={false}
          >
            <div className="admin-dashboard__placeholder">
              <Text type="secondary">
                {t('admin.recentAppointmentsPlaceholder')}
              </Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card
            title={t('admin.quickActions')}
            className="admin-page__card"
            bordered={false}
          >
            <Space direction="vertical" size={12} style={{ width: '100%' }}>
              <Card size="small" hoverable>
                <Space>
                  <TeamOutlined style={{ color: '#2DC263' }} />
                  <Text>{t('admin.addNewDoctor')}</Text>
                </Space>
              </Card>
              <Card size="small" hoverable>
                <Space>
                  <MedicineBoxOutlined style={{ color: '#10b981' }} />
                  <Text>{t('admin.addNewService')}</Text>
                </Space>
              </Card>
              <Card size="small" hoverable>
                <Space>
                  <CalendarOutlined style={{ color: '#1ed34d' }} />
                  <Text>{t('admin.viewAllAppointments')}</Text>
                </Space>
              </Card>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;
