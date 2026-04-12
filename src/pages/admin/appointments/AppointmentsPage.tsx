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
import './AppointmentsPage.scss';

const { Search } = Input;
const { Title, Text } = Typography;
const { Option } = Select;

const STATUS_CONFIG: Record<string, { color: string; label: string }> = {
  pending: { color: 'gold', label: 'Pending' },
  seen: { color: 'green', label: 'Seen' },
  missed: { color: 'red', label: 'Missed' },
};

const AppointmentsPage: React.FC = () => {
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
      message.success(`Appointment marked as ${status}`);
    } catch (error: any) {
      const msg = error?.response?.data?.message || 'Failed to update status';
      message.error(msg);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      message.success('Appointment deleted successfully');
    } catch (error: any) {
      const msg = error?.response?.data?.message || 'Failed to delete appointment';
      message.error(msg);
    }
  };

  const columns: ColumnsType<Appointment> = [
    {
      title: 'Order #',
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
      title: 'Patient',
      key: 'patient',
      width: 180,
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 600, color: '#1a1a2e' }}>{record.fullName}</div>
          <Text type="secondary" style={{ fontSize: 12 }}>
            Age: {record.age}
          </Text>
        </div>
      ),
    },
    {
      title: 'Phone',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      width: 150,
      render: (phone: string) => (
        <Text copyable style={{ fontSize: 13 }}>{phone}</Text>
      ),
    },
    {
      title: 'Doctor',
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
      title: 'Date',
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
      title: 'Time',
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
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        const config = STATUS_CONFIG[status] || { color: 'default', label: status };
        return (
          <Badge
            status={status === 'pending' ? 'processing' : status === 'seen' ? 'success' : 'error'}
            text={<Tag color={config.color}>{config.label}</Tag>}
          />
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 160,
      render: (_, record) => (
        <Space size="small">
          {record.status === 'pending' && (
            <>
              <Tooltip title="Mark as Seen">
                <Button
                  type="text"
                  size="small"
                  icon={<CheckCircleOutlined />}
                  onClick={() => handleStatusChange(record._id, 'seen')}
                  style={{ color: '#52c41a' }}
                  loading={statusMutation.isPending}
                />
              </Tooltip>
              <Tooltip title="Mark as Missed">
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
          <Tooltip title="Delete">
            <Popconfirm
              title="Delete appointment"
              description="Are you sure you want to delete this appointment?"
              onConfirm={() => handleDelete(record._id)}
              okText="Yes"
              cancelText="No"
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

  return (
    <div className="appointments-page">
      <Card className="appointments-page__card">
        {/* Header */}
        <div className="appointments-page__header">
          <div className="appointments-page__header-left">
            <Title level={4} style={{ margin: 0 }}>
              Appointments Management
            </Title>
            {pagination && (
              <Text type="secondary" style={{ fontSize: 13 }}>
                {pagination.total} total appointments
              </Text>
            )}
          </div>
          <div className="appointments-page__header-right">
            <Space size="middle" wrap>
              <Search
                placeholder="Search by name, phone, or order #"
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
              <Text type="secondary" style={{ fontSize: 13 }}>Filters:</Text>
            </Space>
            <Select
              placeholder="Status"
              allowClear
              value={statusFilter}
              onChange={(val) => {
                setStatusFilter(val);
                setPage(1);
              }}
              style={{ width: 140 }}
            >
              <Option value="pending">
                <Badge status="processing" text="Pending" />
              </Option>
              <Option value="seen">
                <Badge status="success" text="Seen" />
              </Option>
              <Option value="missed">
                <Badge status="error" text="Missed" />
              </Option>
            </Select>
            <Select
              placeholder="Doctor"
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
              placeholder="Filter by date"
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
          columns={columns}
          dataSource={appointments}
          rowKey="_id"
          loading={isLoading || deleteMutation.isPending || statusMutation.isPending}
          pagination={{
            current: pagination?.page || page,
            pageSize: pagination?.limit || pageSize,
            total: pagination?.total || 0,
            showSizeChanger: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} appointments`,
            pageSizeOptions: ['10', '20', '50', '100'],
            onChange: (newPage, newPageSize) => {
              setPage(newPage);
              setPageSize(newPageSize);
            },
          }}
          scroll={{ x: 'max-content' }}
          locale={{
            emptyText: (
              <Empty
                description="No appointments found"
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
