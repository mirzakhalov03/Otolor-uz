/**
 * Admin Doctors Management Page
 * Full CRUD for doctors — connected to real backend API
 * Schedule uses specific dates (next 7 days) instead of recurring weekday names
 */

import React, { useState, useMemo } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Input,
  Tag,
  Avatar,
  Popconfirm,
  Modal,
  Form,
  message,
  Tooltip,
  Checkbox,
  TimePicker,
  Typography,
  Empty,
  Upload,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { UploadFile, UploadProps } from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  ReloadOutlined,
  ClockCircleOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import type { Doctor } from '@/pages/appointments/types/appointment.types';
import { uploadImage } from '@/api/services/uploadService';
import {
  useAdminDoctors,
  useCreateDoctor,
  useUpdateDoctor,
  useDeleteDoctor,
} from '@/api/query/useAdminQueries';
import './DoctorsPage.scss';

const { Search } = Input;
const { Title, Text } = Typography;

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const response = (error as { response?: { data?: { message?: string } } }).response;
    if (response?.data?.message) return response.data.message;
  }
  return fallback;
};

/**
 * Generate the next 7 days starting from today.
 * Returns objects with date string (YYYY-MM-DD), display label, and day name.
 */
function getNext7Days(): { dateStr: string; label: string; dayName: string; isSunday: boolean }[] {
  const days: { dateStr: string; label: string; dayName: string; isSunday: boolean }[] = [];
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  for (let i = 0; i < 7; i++) {
    const d = dayjs().add(i, 'day');
    const dayName = dayNames[d.day()];
    days.push({
      dateStr: d.format('YYYY-MM-DD'),
      label: `${dayName}, ${d.format('MMM DD')}`,
      dayName,
      isSunday: d.day() === 0,
    });
  }

  return days;
}

const DoctorsPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [form] = Form.useForm<any>();
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);
  const [selectedAvatarFile, setSelectedAvatarFile] = useState<File | null>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);

  // Track which dates are enabled (checked) in the modal
  const [enabledDates, setEnabledDates] = useState<Set<string>>(new Set());
  // Track time ranges per date
  const [dateTimeRanges, setDateTimeRanges] = useState<Record<string, [dayjs.Dayjs, dayjs.Dayjs] | null>>({});

  const next7Days = useMemo(() => getNext7Days(), []);

  // Queries & mutations
  const { data: doctors, isLoading, refetch } = useAdminDoctors(search || undefined);
  const createMutation = useCreateDoctor();
  const updateMutation = useUpdateDoctor();
  const deleteMutation = useDeleteDoctor();

  const handleSearch = (value: string) => {
    setSearch(value);
  };

  const handleRefresh = () => {
    setSearch('');
    refetch();
  };

  const openCreateModal = () => {
    setEditingDoctor(null);
    form.resetFields();
    setAvatarUrl(undefined);
    setSelectedAvatarFile(null);

    // Default: all days enabled except Sundays
    const defaultEnabled = new Set<string>();
    const defaultTimes: Record<string, [dayjs.Dayjs, dayjs.Dayjs] | null> = {};
    for (const day of next7Days) {
      if (!day.isSunday) {
        defaultEnabled.add(day.dateStr);
        defaultTimes[day.dateStr] = [dayjs('09:00', 'HH:mm'), dayjs('17:00', 'HH:mm')];
      } else {
        defaultTimes[day.dateStr] = null;
      }
    }
    setEnabledDates(defaultEnabled);
    setDateTimeRanges(defaultTimes);
    setModalOpen(true);
  };

  const openEditModal = (doctor: Doctor) => {
    setEditingDoctor(doctor);
    form.setFieldsValue({
      name: doctor.name,
      specialization: doctor.specialization || '',
    });
    setAvatarUrl(doctor.avatarUrl);
    setSelectedAvatarFile(null);

    // Populate enabled dates and time ranges from existing schedule
    const enabled = new Set<string>();
    const times: Record<string, [dayjs.Dayjs, dayjs.Dayjs] | null> = {};

    for (const day of next7Days) {
      const timeRange = doctor.weeklySchedule?.[day.dateStr];
      if (timeRange) {
        enabled.add(day.dateStr);
        const [start, end] = timeRange.split('-');
        times[day.dateStr] = [dayjs(start, 'HH:mm'), dayjs(end, 'HH:mm')];
      } else {
        times[day.dateStr] = day.isSunday ? null : [dayjs('09:00', 'HH:mm'), dayjs('17:00', 'HH:mm')];
      }
    }

    setEnabledDates(enabled);
    setDateTimeRanges(times);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      message.success('Doctor deleted successfully');
    } catch (error: unknown) {
      message.error(getErrorMessage(error, 'Failed to delete doctor'));
    }
  };

  const toggleDate = (dateStr: string) => {
    setEnabledDates((prev) => {
      const next = new Set(prev);
      if (next.has(dateStr)) {
        next.delete(dateStr);
      } else {
        next.add(dateStr);
        // Set default time if none
        if (!dateTimeRanges[dateStr]) {
          setDateTimeRanges((prev) => ({
            ...prev,
            [dateStr]: [dayjs('09:00', 'HH:mm'), dayjs('17:00', 'HH:mm')],
          }));
        }
      }
      return next;
    });
  };

  const updateTimeRange = (dateStr: string, range: [dayjs.Dayjs, dayjs.Dayjs] | null) => {
    setDateTimeRanges((prev) => ({ ...prev, [dateStr]: range }));
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      let uploadedAvatarUrl = avatarUrl;

      if (selectedAvatarFile) {
        setAvatarUploading(true);
        uploadedAvatarUrl = await uploadImage(selectedAvatarFile);
      }

      // Build weeklySchedule from enabled dates + time ranges
      const weeklySchedule: Record<string, string> = {};
      for (const dateStr of enabledDates) {
        const range = dateTimeRanges[dateStr];
        if (range && range[0] && range[1]) {
          weeklySchedule[dateStr] = `${range[0].format('HH:mm')}-${range[1].format('HH:mm')}`;
        }
      }

      if (Object.keys(weeklySchedule).length === 0) {
        message.error('Please enable at least one day with a time range');
        return;
      }

      const payload = {
        name: values.name,
        specialization: values.specialization || undefined,
        avatarUrl: uploadedAvatarUrl,
        weeklySchedule,
      };

      if (editingDoctor) {
        await updateMutation.mutateAsync({ id: editingDoctor._id, data: payload });
        message.success('Doctor updated successfully');
      } else {
        await createMutation.mutateAsync(payload as { name: string; weeklySchedule: Record<string, string> });
        message.success('Doctor created successfully');
      }

      setModalOpen(false);
      form.resetFields();
      setEditingDoctor(null);
      setAvatarUrl(undefined);
      setSelectedAvatarFile(null);
    } catch (error: unknown) {
      message.error(getErrorMessage(error, 'Failed to save doctor'));
    } finally {
      setAvatarUploading(false);
    }
  };

  const uploadProps: UploadProps = {
    maxCount: 1,
    beforeUpload: (file) => {
      const isImage = ['image/jpeg', 'image/png', 'image/webp'].includes(file.type);
      if (!isImage) {
        message.error('Only JPG, PNG, and WEBP images are allowed');
        return Upload.LIST_IGNORE;
      }

      const isLt5Mb = file.size / 1024 / 1024 < 5;
      if (!isLt5Mb) {
        message.error('Image must be smaller than 5MB');
        return Upload.LIST_IGNORE;
      }

      setSelectedAvatarFile(file as File);
      return false;
    },
    onRemove: () => {
      setSelectedAvatarFile(null);
      return true;
    },
  };

  const selectedAvatarFileList: UploadFile[] = selectedAvatarFile
    ? [
        {
          uid: '-1',
          name: selectedAvatarFile.name,
          status: 'done',
        },
      ]
    : [];

  const columns: ColumnsType<Doctor> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: 300,
      render: (name: string, record) => (
        <Space size="middle">
          <Avatar
            size={44}
            src={record.avatarUrl && record.avatarUrl.trim() ? record.avatarUrl : undefined}
          >
            {name?.charAt(0).toUpperCase()}
          </Avatar>
          <span style={{ fontWeight: 600, color: '#1a1a2e' }}>{name}</span>
        </Space>
      ),
    },
    {
      title: 'Specialization',
      dataIndex: 'specialization',
      key: 'specialization',
      width: 180,
      render: (spec: string | undefined) =>
        spec ? <Tag color="blue">{spec}</Tag> : <Tag color="default">—</Tag>,
    },
    {
      title: 'Upcoming Availability',
      dataIndex: 'weeklySchedule',
      key: 'weeklySchedule',
      width: 400,
      render: (schedule: Record<string, string>) => {
        if (!schedule || Object.keys(schedule).length === 0) {
          return <span style={{ color: '#999' }}>No schedule set</span>;
        }

        // Sort by date and show only future dates
        const today = dayjs().format('YYYY-MM-DD');
        const sortedDates = Object.keys(schedule)
          .filter((d) => d >= today)
          .sort();

        if (sortedDates.length === 0) {
          return <span style={{ color: '#999' }}>No upcoming availability</span>;
        }

        return (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {sortedDates.map((dateStr) => {
              const d = dayjs(dateStr);
              const dayName = d.format('ddd');
              const dateLabel = d.format('MMM DD');
              return (
                <Tag
                  key={dateStr}
                  color="green"
                  icon={<ClockCircleOutlined />}
                  style={{ marginBottom: 2 }}
                >
                  {dayName} {dateLabel}: {schedule[dateStr]}
                </Tag>
              );
            })}
          </div>
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => openEditModal(record)}
              size="small"
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Popconfirm
              title="Delete doctor"
              description="Are you sure? This cannot be undone."
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
    <div className="doctors-page">
      <Card className="doctors-page__card">
        {/* Header */}
        <div className="doctors-page__header">
          <div className="doctors-page__header-left">
            <Title level={4} style={{ margin: 0 }}>
              Doctors Management
            </Title>
          </div>
          <div className="doctors-page__header-right">
            <Space size="middle">
              <Search
                placeholder="Search by name or specialization..."
                allowClear
                onSearch={handleSearch}
                style={{ width: 280 }}
                prefix={<SearchOutlined />}
              />
              <Button icon={<ReloadOutlined />} onClick={handleRefresh} loading={isLoading} />
              <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>
                Add Doctor
              </Button>
            </Space>
          </div>
        </div>

        {/* Table */}
        <Table<Doctor>
          columns={columns}
          dataSource={doctors || []}
          rowKey="_id"
          loading={isLoading || deleteMutation.isPending}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} doctors`,
            pageSizeOptions: ['10', '20', '50'],
          }}
          scroll={{ x: 'max-content' }}
          locale={{
            emptyText: <Empty description="No doctors found" image={Empty.PRESENTED_IMAGE_SIMPLE} />,
          }}
        />
      </Card>

      {/* Create / Edit Modal */}
      <Modal
        title={editingDoctor ? 'Edit Doctor' : 'Add New Doctor'}
        open={modalOpen}
        onCancel={() => {
          setModalOpen(false);
          setEditingDoctor(null);
          form.resetFields();
          setAvatarUrl(undefined);
          setSelectedAvatarFile(null);
        }}
        onOk={handleSubmit}
        confirmLoading={createMutation.isPending || updateMutation.isPending || avatarUploading}
        okText={editingDoctor ? 'Update' : 'Create'}
        width={640}
        destroyOnClose
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item label="Doctor Avatar">
            <Space direction="vertical" size={8} style={{ width: '100%' }}>
              <Space size="middle">
                <Avatar size={56} src={avatarUrl}>
                  {(form.getFieldValue('name') || 'D').charAt(0).toUpperCase()}
                </Avatar>
                <Upload {...uploadProps} fileList={selectedAvatarFileList}>
                  <Button icon={<UploadOutlined />}>Select Image</Button>
                </Upload>
              </Space>
              <Text type="secondary" style={{ fontSize: 12 }}>
                Upload JPEG, PNG, or WEBP image (max 5MB). Image is uploaded to S3 on save.
              </Text>
            </Space>
          </Form.Item>

          <Form.Item
            name="name"
            label="Doctor Name"
            rules={[
              { required: true, message: 'Doctor name is required' },
              { min: 2, message: 'Name must be at least 2 characters' },
              { max: 100, message: 'Name cannot exceed 100 characters' },
            ]}
          >
            <Input placeholder="e.g. Dr. Sardor Karimov" />
          </Form.Item>

          <Form.Item
            name="specialization"
            label="Specialization"
            rules={[{ max: 100, message: 'Specialization cannot exceed 100 characters' }]}
          >
            <Input placeholder="e.g. Stomatolog, Ortodont" />
          </Form.Item>

          {/* Schedule: Next 7 days with checkboxes + time range pickers */}
          <div style={{ marginBottom: 24 }}>
            <Text strong style={{ display: 'block', marginBottom: 12, fontSize: 14 }}>
              Availability — Next 7 Days
            </Text>
            <Text type="secondary" style={{ display: 'block', marginBottom: 16, fontSize: 12 }}>
              Check the days this doctor will be available. Sundays are off by default.
            </Text>
            <div className="schedule-grid">
              {next7Days.map((day) => {
                const isEnabled = enabledDates.has(day.dateStr);
                const timeRange = dateTimeRanges[day.dateStr];
                return (
                  <div
                    key={day.dateStr}
                    className={`schedule-row ${isEnabled ? 'schedule-row--active' : ''} ${day.isSunday ? 'schedule-row--sunday' : ''}`}
                  >
                    <Checkbox
                      checked={isEnabled}
                      onChange={() => toggleDate(day.dateStr)}
                      className="schedule-row__checkbox"
                    >
                      <div className="schedule-row__label">
                        <span className="schedule-row__day">{day.dayName}</span>
                        <span className="schedule-row__date">{dayjs(day.dateStr).format('MMM DD, YYYY')}</span>
                      </div>
                    </Checkbox>
                    <div className="schedule-row__time">
                      {isEnabled && (
                        <TimePicker.RangePicker
                          format="HH:mm"
                          minuteStep={30}
                          placeholder={['Start', 'End']}
                          value={timeRange}
                          onChange={(val) => updateTimeRange(day.dateStr, val as [dayjs.Dayjs, dayjs.Dayjs] | null)}
                          size="small"
                          style={{ width: 200 }}
                        />
                      )}
                      {!isEnabled && (
                        <Tag color="default" style={{ fontSize: 12 }}>Day off</Tag>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default DoctorsPage;
