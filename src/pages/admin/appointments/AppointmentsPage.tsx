/**
 * Admin Appointments Management Page
 * View, filter, and manage all booked appointments
 */

import React, { useState } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Input,
  Tag,
  Popconfirm,
  Select,
  DatePicker,
  message,
  Tooltip,
  Typography,
  Empty,
  Badge,
  Grid,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  DeleteOutlined,
  SearchOutlined,
  ReloadOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  FilterOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import {
  useAdminAppointments,
  useUpdateAppointmentStatus,
  useDeleteAppointment,
  useAdminDoctors,
} from '@/api/query/useAdminQueries';
import type { Appointment } from '@/pages/appointments/types/appointment.types';
import { useTranslation } from 'react-i18next';
import './AppointmentsPage.scss';

const { Search } = Input;
const { Title, Text } = Typography;
const { Option } = Select;
const { useBreakpoint } = Grid;

const AppointmentsPage: React.FC = () => {
  const { t } = useTranslation();
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  // Filter state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [doctorFilter, setDoctorFilter] = useState<string | undefined>(undefined);
  const [dateFilter, setDateFilter] = useState<string | undefined>(undefined);

  // Queries
  const { data: appointmentsData, isLoading, refetch } = useAdminAppointments({
    page,
    limit: pageSize,
    search: search || undefined,
    status: statusFilter as 'pending' | 'seen' | 'missed' | undefined,
    doctorId: doctorFilter,
    date: dateFilter,
  });

  const { data: doctors } = useAdminDoctors();

  // Mutations
  const statusMutation = useUpdateAppointmentStatus();
  const deleteMutation = useDeleteAppointment();

  const appointments = appointmentsData?.data || [];
  const pagination = appointmentsData?.pagination;

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleRefresh = () => {
    setSearch('');
    setStatusFilter(undefined);
    setDoctorFilter(undefined);
    setDateFilter(undefined);
    setPage(1);
    refetch();
  };

  const handleStatusChange = async (id: string, status: 'seen' | 'missed') => {
    try {
      await statusMutation.mutateAsync({ id, status });
      message.success(
        t('adminAppointments.toasts.statusUpdated', {
          status: t(`adminAppointments.status.${status}`),
        })
      );
    } catch (error: any) {
      const msg = error?.response?.data?.message || t('adminAppointments.toasts.updateStatusFailed');
      message.error(msg);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      message.success(t('adminAppointments.toasts.deleteSuccess'));
    } catch (error: any) {
      const msg = error?.response?.data?.message || t('adminAppointments.toasts.deleteFailed');
      message.error(msg);
    }
  };

  const statusConfig: Record<string, { color: string; label: string }> = {
    pending: { color: 'gold', label: t('adminAppointments.status.pending') },
    seen: { color: 'green', label: t('adminAppointments.status.seen') },
    missed: { color: 'red', label: t('adminAppointments.status.missed') },
  };

  const columns: ColumnsType<Appointment> = [
    {
      title: t('adminAppointments.table.orderNumber'),
      dataIndex: 'orderNumber',
      key: 'orderNumber',
      width: 100,
      render: (order: string) => (
        <Tag color="geekblue" style={{ fontWeight: 600, fontSize: 13 }}>
          {order}
        </Tag>
      ),
    },
    {
      title: t('adminAppointments.table.patient'),
      key: 'patient',
      width: 180,
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 600, color: '#1a1a2e' }}>{record.fullName}</div>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {t('adminAppointments.table.age')}: {record.age}
          </Text>
        </div>
      ),
    },
    {
      title: t('adminAppointments.table.phone'),
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      width: 150,
      render: (phone: string) => (
        <Text copyable style={{ fontSize: 13 }}>{phone}</Text>
      ),
    },
    {
      title: t('adminAppointments.table.doctor'),
      key: 'doctor',
      width: 200,
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>{record.doctorId?.name || '—'}</div>
          {record.doctorId?.specialization && (
            <Tag color="blue" style={{ fontSize: 11, marginTop: 2 }}>
              {record.doctorId.specialization}
            </Tag>
          )}
        </div>
      ),
    },
    {
      title: t('adminAppointments.table.date'),
      dataIndex: 'preferredDate',
      key: 'preferredDate',
      width: 120,
      render: (date: string) => (
        <span style={{ fontWeight: 500 }}>
          {dayjs(date).format('MMM DD, YYYY')}
        </span>
      ),
    },
    {
      title: t('adminAppointments.table.time'),
      dataIndex: 'preferredTime',
      key: 'preferredTime',
      width: 80,
      render: (time: string) => (
        <Tag color="default" style={{ fontWeight: 500 }}>
          {time}
        </Tag>
      ),
    },
    {
      title: t('adminAppointments.table.status'),
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        const config = statusConfig[status] || { color: 'default', label: status };
        return (
          <Badge
            status={status === 'pending' ? 'processing' : status === 'seen' ? 'success' : 'error'}
            text={<Tag color={config.color}>{config.label}</Tag>}
          />
        );
      },
    },
    {
      title: t('common.actions'),
      key: 'actions',
      fixed: 'right',
      width: 160,
      render: (_, record) => (
        <Space size="small">
          {record.status === 'pending' && (
            <>
              <Tooltip title={t('adminAppointments.actions.markAsSeen')}>
                <Button
                  type="text"
                  size="small"
                  icon={<CheckCircleOutlined />}
                  onClick={() => handleStatusChange(record._id, 'seen')}
                  style={{ color: '#52c41a' }}
                  loading={statusMutation.isPending}
                />
              </Tooltip>
              <Tooltip title={t('adminAppointments.actions.markAsMissed')}>
                <Button
                  type="text"
                  size="small"
                  icon={<CloseCircleOutlined />}
                  onClick={() => handleStatusChange(record._id, 'missed')}
                  style={{ color: '#ff4d4f' }}
                  loading={statusMutation.isPending}
                />
              </Tooltip>
            </>
          )}
          <Tooltip title={t('common.delete')}>
            <Popconfirm
              title={t('adminAppointments.actions.deleteTitle')}
              description={t('adminAppointments.actions.deleteDescription')}
              onConfirm={() => handleDelete(record._id)}
              okText={t('common.yes')}
              cancelText={t('common.no')}
              okButtonProps={{ danger: true }}
            >
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                size="small"
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  const mobileColumns: ColumnsType<Appointment> = [
    {
      title: t('adminAppointments.table.patient'),
      key: 'patientMobile',
      render: (_, record) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ fontWeight: 700, color: '#1a1a2e' }}>{record.fullName}</div>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {t('adminAppointments.table.phone')}: {record.phoneNumber}
          </Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {dayjs(record.preferredDate).format('MMM DD, YYYY')} - {record.preferredTime}
          </Text>
          <Tag color="geekblue" style={{ width: 'fit-content' }}>
            {record.orderNumber}
          </Tag>
          <Space size="small" wrap>
            {record.status === 'pending' && (
              <>
                <Button
                  type="text"
                  size="small"
                  icon={<CheckCircleOutlined />}
                  onClick={() => handleStatusChange(record._id, 'seen')}
                  style={{ color: '#52c41a' }}
                />
                <Button
                  type="text"
                  size="small"
                  icon={<CloseCircleOutlined />}
                  onClick={() => handleStatusChange(record._id, 'missed')}
                  style={{ color: '#ff4d4f' }}
                />
              </>
            )}
            <Popconfirm
              title={t('adminAppointments.actions.deleteTitle')}
              description={t('adminAppointments.actions.deleteDescription')}
              onConfirm={() => handleDelete(record._id)}
              okText={t('common.yes')}
              cancelText={t('common.no')}
              okButtonProps={{ danger: true }}
            >
              <Button type="text" danger size="small" icon={<DeleteOutlined />} />
            </Popconfirm>
          </Space>
        </div>
      ),
    },
    {
      title: t('adminAppointments.table.status'),
      dataIndex: 'status',
      key: 'statusMobile',
      width: 110,
      render: (status: string) => {
        const config = statusConfig[status] || { color: 'default', label: status };
        return <Tag color={config.color}>{config.label}</Tag>;
      },
    },
  ];

  return (
    <div className="appointments-page">
      <Card className="appointments-page__card">
        {/* Header */}
        <div className="appointments-page__header">
          <div className="appointments-page__header-left">
            <Title level={4} style={{ margin: 0 }}>
              {t('adminAppointments.title')}
            </Title>
            {pagination && (
              <Text type="secondary" style={{ fontSize: 13 }}>
                {t('adminAppointments.totalCount', { count: pagination.total })}
              </Text>
            )}
          </div>
          <div className="appointments-page__header-right">
            <Space size="middle" wrap>
              <Search
                placeholder={t('adminAppointments.searchPlaceholder')}
                allowClear
                onSearch={handleSearch}
                style={{ width: 260 }}
                prefix={<SearchOutlined />}
              />
              <Button icon={<ReloadOutlined />} onClick={handleRefresh} loading={isLoading} />
            </Space>
          </div>
        </div>

        {/* Filters */}
        <div className="appointments-page__filters">
          <Space size="middle" wrap>
            <Space size="small">
              <FilterOutlined style={{ color: '#999' }} />
              <Text type="secondary" style={{ fontSize: 13 }}>{t('common.filter')}:</Text>
            </Space>
            <Select
              placeholder={t('adminAppointments.filters.status')}
              allowClear
              value={statusFilter}
              onChange={(val) => {
                setStatusFilter(val);
                setPage(1);
              }}
              style={{ width: 140 }}
            >
              <Option value="pending">
                <Badge status="processing" text={t('adminAppointments.status.pending')} />
              </Option>
              <Option value="seen">
                <Badge status="success" text={t('adminAppointments.status.seen')} />
              </Option>
              <Option value="missed">
                <Badge status="error" text={t('adminAppointments.status.missed')} />
              </Option>
            </Select>
            <Select
              placeholder={t('adminAppointments.filters.doctor')}
              allowClear
              value={doctorFilter}
              onChange={(val) => {
                setDoctorFilter(val);
                setPage(1);
              }}
              style={{ width: 200 }}
              showSearch
              optionFilterProp="label"
              options={(doctors || []).map((d) => ({
                value: d._id,
                label: d.name,
              }))}
            />
            <DatePicker
              placeholder={t('adminAppointments.filters.date')}
              format="YYYY-MM-DD"
              allowClear
              value={dateFilter ? dayjs(dateFilter) : null}
              onChange={(date) => {
                setDateFilter(date ? date.format('YYYY-MM-DD') : undefined);
                setPage(1);
              }}
            />
          </Space>
        </div>

        {/* Table */}
        <Table<Appointment>
          columns={isMobile ? mobileColumns : columns}
          dataSource={appointments}
          rowKey="_id"
          loading={isLoading || deleteMutation.isPending || statusMutation.isPending}
          pagination={{
            current: pagination?.page || page,
            pageSize: pagination?.limit || pageSize,
            total: pagination?.total || 0,
            showSizeChanger: true,
            showTotal: (total, range) =>
              t('adminAppointments.pagination.showTotal', {
                from: range[0],
                to: range[1],
                total,
              }),
            pageSizeOptions: ['10', '20', '50', '100'],
            onChange: (newPage, newPageSize) => {
              setPage(newPage);
              setPageSize(newPageSize);
            },
          }}
          scroll={isMobile ? undefined : { x: 'max-content' }}
          locale={{
            emptyText: (
              <Empty
                  description={t('adminAppointments.empty')}
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            ),
          }}
        />
      </Card>
    </div>
  );
};

export default AppointmentsPage;
