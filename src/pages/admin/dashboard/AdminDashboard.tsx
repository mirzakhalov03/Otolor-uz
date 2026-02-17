/**
 * Admin Dashboard Page
 * Overview with statistics and quick actions
 * For doctors: shows their appointment schedule
 */

import React from 'react';
import { Card, Row, Col, Typography, Statistic, Space, Table, Tag, Empty, Spin, Button } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  TeamOutlined,
  CalendarOutlined,
  MedicineBoxOutlined,
  UserOutlined,
  ArrowUpOutlined,
  ClockCircleOutlined,
  PhoneOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../context/AuthContext';
import { useDoctorTodayQueue, useDoctorBookings } from '../../../api/query';
import type { Appointment } from '../../../api/types';
import './AdminDashboard.scss';

const { Title, Text } = Typography;

// Appointment status colors
const statusColors: Record<string, string> = {
  booked: 'blue',
  confirmed: 'green',
  completed: 'cyan',
  cancelled: 'red',
  'no-show': 'orange',
};

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  
  const isDoctor = user?.role?.name === 'doctor';
  
  // Fetch doctor's queue if user is a doctor
  const { 
    data: todayQueue, 
    isLoading: isLoadingQueue,
    refetch: refetchQueue,
  } = useDoctorTodayQueue(isDoctor);

  // Fetch upcoming appointments for doctor
  const {
    data: upcomingAppointments,
    isLoading: isLoadingAppointments,
  } = useDoctorBookings(
    { status: 'confirmed', limit: 10 },
    isDoctor
  );

  // Mock stats - will be replaced with actual API calls
  const stats = isDoctor ? [
    {
      title: t('stats.todayAppointments', "Today's Appointments"),
      value: (todayQueue as Appointment[] | undefined)?.length || 0,
      icon: <CalendarOutlined />,
      color: '#2DC263',
    },
    {
      title: t('stats.upcomingAppointments', 'Upcoming'),
      value: upcomingAppointments?.data?.length || 0,
      icon: <ClockCircleOutlined />,
      color: '#10b981',
    },
    {
      title: t('stats.completedToday', 'Completed Today'),
      value: (todayQueue as Appointment[] | undefined)?.filter(a => a.status === 'completed').length || 0,
      icon: <MedicineBoxOutlined />,
      color: '#1ed34d',
    },
    {
      title: t('stats.totalPatients', 'Total Patients'),
      value: 156,
      icon: <UserOutlined />,
      color: '#01a02e',
      change: '+5%',
    },
  ] : [
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

  // Table columns for doctor's appointments
  const appointmentColumns: ColumnsType<Appointment> = [
    {
      title: '#',
      dataIndex: 'queueNumber',
      key: 'queueNumber',
      width: 60,
      render: (queueNumber: number) => (
        <Tag color="blue" style={{ margin: 0 }}>#{queueNumber || '-'}</Tag>
      ),
    },
    {
      title: t('appointments.patient', 'Patient'),
      dataIndex: 'patient',
      key: 'patient',
      render: (patient: Appointment['patient']) => {
        if (typeof patient === 'object' && patient) {
          return (
            <div>
              <Text strong>{patient.fullName || `${patient.firstName} ${patient.lastName}`}</Text>
              {patient.phone && (
                <div>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    <PhoneOutlined /> {patient.phone}
                  </Text>
                </div>
              )}
            </div>
          );
        }
        return '-';
      },
    },
    {
      title: t('appointments.time', 'Time'),
      key: 'time',
      width: 120,
      render: (_, record) => (
        <Text>
          {record.startTime} - {record.endTime}
        </Text>
      ),
    },
    {
      title: t('appointments.status', 'Status'),
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={statusColors[status] || 'default'}>
          {status?.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: t('appointments.notes', 'Notes'),
      dataIndex: 'notes',
      key: 'notes',
      ellipsis: true,
      render: (notes: string) => notes || '-',
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
            {isDoctor 
              ? t('admin.doctorDashboardSubtitle', "Here's your schedule for today")
              : t('admin.dashboardSubtitle')
            }
          </Text>
        </div>
      </div>

      {/* Stats Cards */}
      <Row gutter={[24, 24]} className="admin-dashboard__stats">
        {stats.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card className="stat-card">
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
                />
                {stat.change && (
                  <Space size={4}>
                    <ArrowUpOutlined style={{ color: '#52c41a' }} />
                    <Text style={{ color: '#52c41a' }}>{stat.change}</Text>
                    <Text type="secondary">{t('stats.fromLastMonth')}</Text>
                  </Space>
                )}
              </Space>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Doctor's Appointment Schedule */}
      {isDoctor && (
        <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
          <Col xs={24}>
            <Card
              title={
                <Space>
                  <CalendarOutlined />
                  {t('admin.todaySchedule', "Today's Schedule")}
                </Space>
              }
              extra={
                <Button 
                  icon={<ReloadOutlined />} 
                  onClick={() => refetchQueue()}
                  loading={isLoadingQueue}
                >
                  {t('common.refresh', 'Refresh')}
                </Button>
              }
              className="admin-dashboard__schedule-card"
            >
              {isLoadingQueue ? (
                <div style={{ textAlign: 'center', padding: 40 }}>
                  <Spin size="large" />
                </div>
              ) : (todayQueue as Appointment[] | undefined)?.length ? (
                <Table
                  columns={appointmentColumns}
                  dataSource={todayQueue as Appointment[]}
                  rowKey="_id"
                  pagination={false}
                  size="middle"
                />
              ) : (
                <Empty 
                  description={t('admin.noAppointmentsToday', 'No appointments scheduled for today')}
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              )}
            </Card>
          </Col>

          {/* Upcoming Appointments */}
          <Col xs={24}>
            <Card
              title={
                <Space>
                  <ClockCircleOutlined />
                  {t('admin.upcomingAppointments', 'Upcoming Appointments')}
                </Space>
              }
              className="admin-dashboard__upcoming-card"
            >
              {isLoadingAppointments ? (
                <div style={{ textAlign: 'center', padding: 40 }}>
                  <Spin size="large" />
                </div>
              ) : upcomingAppointments?.data?.length ? (
                <Table
                  columns={[
                    ...appointmentColumns.slice(1, 2), // Patient only
                    {
                      title: t('appointments.date', 'Date'),
                      dataIndex: 'appointmentDate',
                      key: 'date',
                      width: 120,
                      render: (date: string) => new Date(date).toLocaleDateString(),
                    },
                    appointmentColumns[2], // Time
                    appointmentColumns[4], // Notes
                  ]}
                  dataSource={upcomingAppointments.data}
                  rowKey="_id"
                  pagination={false}
                  size="middle"
                />
              ) : (
                <Empty 
                  description={t('admin.noUpcomingAppointments', 'No upcoming appointments')}
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              )}
            </Card>
          </Col>
        </Row>
      )}

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
      )}
    </div>
  );
};

export default AdminDashboard;
