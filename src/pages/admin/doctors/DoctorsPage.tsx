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
  Grid,
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
import { useTranslation } from 'react-i18next';
import './DoctorsPage.scss';

const { Search } = Input;
const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const response = (error as { response?: { data?: { message?: string } } }).response;
    if (response?.data?.message) return response.data.message;
  }
  return fallback;
};

/**
 * Generate the next 7 days starting from today.
 * Returns objects with date string (YYYY-MM-DD) and day index.
 */
function getNext7Days(): { dateStr: string; dayIndex: number; isSunday: boolean }[] {
  const days: { dateStr: string; dayIndex: number; isSunday: boolean }[] = [];

  for (let i = 0; i < 7; i++) {
    const d = dayjs().add(i, 'day');
    days.push({
      dateStr: d.format('YYYY-MM-DD'),
      dayIndex: d.day(),
      isSunday: d.day() === 0,
    });
  }

  return days;
}

const DoctorsPage: React.FC = () => {
  const { t } = useTranslation();
  const screens = useBreakpoint();
  const isMobile = !screens.md;
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
      message.success(t('adminDoctors.toasts.deleteSuccess'));
    } catch (error: unknown) {
      message.error(getErrorMessage(error, t('adminDoctors.toasts.deleteFailed')));
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
        message.error(t('adminDoctors.toasts.enableOneDay'));
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
        message.success(t('adminDoctors.toasts.updateSuccess'));
      } else {
        await createMutation.mutateAsync(payload as { name: string; weeklySchedule: Record<string, string> });
        message.success(t('adminDoctors.toasts.createSuccess'));
      }

      setModalOpen(false);
      form.resetFields();
      setEditingDoctor(null);
      setAvatarUrl(undefined);
      setSelectedAvatarFile(null);
    } catch (error: unknown) {
      message.error(getErrorMessage(error, t('adminDoctors.toasts.saveFailed')));
    } finally {
      setAvatarUploading(false);
    }
  };

  const uploadProps: UploadProps = {
    maxCount: 1,
    beforeUpload: (file) => {
      const isImage = ['image/jpeg', 'image/png', 'image/webp'].includes(file.type);
      if (!isImage) {
        message.error(t('adminDoctors.toasts.imageTypeError'));
        return Upload.LIST_IGNORE;
      }

      const isLt5Mb = file.size / 1024 / 1024 < 5;
      if (!isLt5Mb) {
        message.error(t('adminDoctors.toasts.imageSizeError'));
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
      title: t('adminDoctors.table.name'),
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
      title: t('adminDoctors.table.specialization'),
      dataIndex: 'specialization',
      key: 'specialization',
      width: 180,
      render: (spec: string | undefined) =>
        spec ? <Tag color="blue">{spec}</Tag> : <Tag color="default">—</Tag>,
    },
    {
      title: t('adminDoctors.table.upcomingAvailability'),
      dataIndex: 'weeklySchedule',
      key: 'weeklySchedule',
      width: 400,
      render: (schedule: Record<string, string>) => {
        if (!schedule || Object.keys(schedule).length === 0) {
          return <span style={{ color: '#999' }}>{t('adminDoctors.table.noSchedule')}</span>;
        }

        // Sort by date and show only future dates
        const today = dayjs().format('YYYY-MM-DD');
        const sortedDates = Object.keys(schedule)
          .filter((d) => d >= today)
          .sort();

        if (sortedDates.length === 0) {
          return <span style={{ color: '#999' }}>{t('adminDoctors.table.noUpcoming')}</span>;
        }

        return (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {sortedDates.map((dateStr) => {
              const d = dayjs(dateStr);
              const dayName = t(`adminDoctors.days.${d.day()}`);
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
      title: t('common.actions'),
      key: 'actions',
      fixed: 'right',
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title={t('common.edit')}>
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => openEditModal(record)}
              size="small"
            />
          </Tooltip>
          <Tooltip title={t('common.delete')}>
            <Popconfirm
              title={t('adminDoctors.actions.deleteTitle')}
              description={t('adminDoctors.actions.deleteDescription')}
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

  const mobileColumns: ColumnsType<Doctor> = [
    {
      title: t('adminDoctors.table.name'),
      key: 'doctorMobile',
      render: (_, record) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Space size="middle">
            <Avatar
              size={44}
              src={record.avatarUrl && record.avatarUrl.trim() ? record.avatarUrl : undefined}
            >
              {record.name?.charAt(0).toUpperCase()}
            </Avatar>
            <div>
              <div style={{ fontWeight: 700, color: '#1a1a2e' }}>{record.name}</div>
              {record.specialization ? (
                <Tag color="blue" style={{ marginTop: 4 }}>{record.specialization}</Tag>
              ) : (
                <Text type="secondary" style={{ fontSize: 12 }}>—</Text>
              )}
            </div>
          </Space>

          <Space size="small">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => openEditModal(record)}
              size="small"
            />
            <Popconfirm
              title={t('adminDoctors.actions.deleteTitle')}
              description={t('adminDoctors.actions.deleteDescription')}
              onConfirm={() => handleDelete(record._id)}
              okText={t('common.yes')}
              cancelText={t('common.no')}
              okButtonProps={{ danger: true }}
            >
              <Button type="text" danger icon={<DeleteOutlined />} size="small" />
            </Popconfirm>
          </Space>
        </div>
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
              {t('adminDoctors.title')}
            </Title>
          </div>
          <div className="doctors-page__header-right">
            <Space size="middle">
              <Search
                placeholder={t('adminDoctors.searchPlaceholder')}
                allowClear
                onSearch={handleSearch}
                style={{ width: 280 }}
                prefix={<SearchOutlined />}
              />
              <Button icon={<ReloadOutlined />} onClick={handleRefresh} loading={isLoading} />
              <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>
                {t('adminDoctors.addButton')}
              </Button>
            </Space>
          </div>
        </div>

        {/* Table */}
        <Table<Doctor>
          columns={isMobile ? mobileColumns : columns}
          dataSource={doctors || []}
          rowKey="_id"
          loading={isLoading || deleteMutation.isPending}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total, range) =>
              t('adminDoctors.pagination.showTotal', {
                from: range[0],
                to: range[1],
                total,
              }),
            pageSizeOptions: ['10', '20', '50'],
          }}
          scroll={isMobile ? undefined : { x: 'max-content' }}
          locale={{
            emptyText: <Empty description={t('adminDoctors.empty')} image={Empty.PRESENTED_IMAGE_SIMPLE} />,
          }}
        />
      </Card>

      {/* Create / Edit Modal */}
      <Modal
        title={editingDoctor ? t('adminDoctors.modal.editTitle') : t('adminDoctors.modal.addTitle')}
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
        okText={editingDoctor ? t('adminDoctors.modal.update') : t('adminDoctors.modal.create')}
        width={640}
        destroyOnClose
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item label={t('adminDoctors.form.avatarLabel')}>
            <Space direction="vertical" size={8} style={{ width: '100%' }}>
              <Space size="middle">
                <Avatar size={56} src={avatarUrl}>
                  {(form.getFieldValue('name') || 'D').charAt(0).toUpperCase()}
                </Avatar>
                <Upload {...uploadProps} fileList={selectedAvatarFileList}>
                  <Button icon={<UploadOutlined />}>{t('adminDoctors.form.selectImage')}</Button>
                </Upload>
              </Space>
              <Text type="secondary" style={{ fontSize: 12 }}>
                {t('adminDoctors.form.avatarHelp')}
              </Text>
            </Space>
          </Form.Item>

          <Form.Item
            name="name"
            label={t('adminDoctors.form.nameLabel')}
            rules={[
              { required: true, message: t('adminDoctors.form.validation.nameRequired') },
              { min: 2, message: t('adminDoctors.form.validation.nameMin') },
              { max: 100, message: t('adminDoctors.form.validation.nameMax') },
            ]}
          >
            <Input placeholder={t('adminDoctors.form.namePlaceholder')} />
          </Form.Item>

          <Form.Item
            name="specialization"
            label={t('adminDoctors.form.specializationLabel')}
            rules={[{ max: 100, message: t('adminDoctors.form.validation.specializationMax') }]}
          >
            <Input placeholder={t('adminDoctors.form.specializationPlaceholder')} />
          </Form.Item>

          {/* Schedule: Next 7 days with checkboxes + time range pickers */}
          <div style={{ marginBottom: 24 }}>
            <Text strong style={{ display: 'block', marginBottom: 12, fontSize: 14 }}>
              {t('adminDoctors.form.availabilityTitle')}
            </Text>
            <Text type="secondary" style={{ display: 'block', marginBottom: 16, fontSize: 12 }}>
              {t('adminDoctors.form.availabilityHint')}
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
                        <span className="schedule-row__day">{t(`adminDoctors.days.${day.dayIndex}`)}</span>
                        <span className="schedule-row__date">{dayjs(day.dateStr).format('MMM DD, YYYY')}</span>
                      </div>
                    </Checkbox>
                    <div className="schedule-row__time">
                      {isEnabled && (
                        <TimePicker.RangePicker
                          format="HH:mm"
                          minuteStep={30}
                          placeholder={[t('adminDoctors.form.timeStart'), t('adminDoctors.form.timeEnd')]}
                          value={timeRange}
                          onChange={(val) => updateTimeRange(day.dateStr, val as [dayjs.Dayjs, dayjs.Dayjs] | null)}
                          size="small"
                          style={{ width: 200 }}
                        />
                      )}
                      {!isEnabled && (
                        <Tag color="default" style={{ fontSize: 12 }}>{t('adminDoctors.form.dayOff')}</Tag>
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
