import React from 'react';
import { Card, Row, Col, Typography, Space } from 'antd';
import {
  TeamOutlined,
  CalendarOutlined,
  MedicineBoxOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../context/AuthContext';
import './AdminDashboard.scss';

const { Title, Text } = Typography;

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  
  const isDoctor = user?.role?.roleName === 'doctor';
  
  return (
    <div className="admin-dashboard">
      {/* Welcome Section */}
      <div className="admin-dashboard__welcome">
        <div>
          <Title level={2} className="admin-dashboard__title">
            {t('admin.welcomeBack', { name: user?.firstName })}
          </Title>
          <Text type="secondary">
            {isDoctor 
              ? t('admin.doctorDashboardSubtitle', "Here's your schedule for today")
              : t('admin.dashboardSubtitle')
            }
          </Text>
        </div>
      </div>

      {/* Stats Cards */}
      <Row gutter={[24, 24]} className="admin-dashboard__stats">
        
      </Row>

      {/* Doctor's Appointment Schedule */}
      

      {/* Admin: Quick Actions & Recent Activity */}
      {!isDoctor && (
        <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
          <Col xs={24} lg={16}>
            <Card
              title={t('admin.recentAppointments')}
              className="admin-page__card"
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
            >
              <Space style={{ width: '100%', flexDirection: 'column' }} size={12}>
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
      )}
    </div>
  );
};

export default AdminDashboard;
