/**
 * Admin Doctors Management Page
 * Full CRUD for doctors — connected to real backend API
 * Schedule uses specific dates (next 7 days) instead of recurring weekday names
 */

import React, { useState } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Input,
  Tag,
  Avatar,
  Popconfirm,
  Form,
  message,
  Tooltip,
  Typography,
  Empty,
  Upload,
  Grid,
  InputNumber,
  Switch,
  Steps,
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
  UserOutlined,
  CalendarOutlined,
  CameraOutlined,
  LeftOutlined,
  RightOutlined,
  CheckOutlined,
  StarOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import type { Doctor } from '@/pages/appointments/types/appointment.types';
import { ApiError } from '@/api/errors';
import { uploadImage } from '@/api/services/uploadService';
import { useDoctorSchedule } from './useDoctorSchedule';
import ScheduleEditor from './ScheduleEditor';
import {
  useAdminDoctors,
  useCreateDoctor,
  useUpdateDoctor,
  useDeleteDoctor,
} from '@/api/query/useAdminQueries';
import { ResponsiveFormModal } from '@/components/admin';
import { useTranslation } from 'react-i18next';
import './DoctorsPage.scss';

const { Search } = Input;
const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

const getErrorMessage = (error: unknown, fallback: string): string => {
  return error instanceof ApiError ? error.message : fallback;
};

const DoctorsPage: React.FC = () => {
  const { t } = useTranslation();
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [form] = Form.useForm<any>();
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);
  const [selectedAvatarFile, setSelectedAvatarFile] = useState<File | null>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);

  // Schedule editing state (next-7-days availability) lives in a dedicated hook.
  const schedule = useDoctorSchedule();

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
    schedule.initForCreate();
    setStep(0);
    setModalOpen(true);
  };

  const openEditModal = (doctor: Doctor) => {
    setEditingDoctor(doctor);
    form.setFieldsValue({
      name: doctor.name,
      specialization: doctor.specialization || '',
      experience: doctor.experience,
      isFeatured: doctor.isFeatured ?? false,
    });
    setAvatarUrl(doctor.avatarUrl);
    setSelectedAvatarFile(null);
    schedule.initForEdit(doctor);
    setStep(0);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingDoctor(null);
    form.resetFields();
    setAvatarUrl(undefined);
    setSelectedAvatarFile(null);
    setStep(0);
  };

  // Steps are clickable. Moving forward first validates the profile fields;
  // moving back is always allowed.
  const handleStepChange = async (target: number) => {
    if (target > step) {
      try {
        await form.validateFields(['name', 'specialization', 'experience']);
      } catch {
        return; // inline field errors are shown by AntD
      }
    }
    setStep(target);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      message.success(t('adminDoctors.toasts.deleteSuccess'));
    } catch (error: unknown) {
      message.error(getErrorMessage(error, t('adminDoctors.toasts.deleteFailed')));
    }
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
      const weeklySchedule = schedule.buildWeeklySchedule();

      if (Object.keys(weeklySchedule).length === 0) {
        message.error(t('adminDoctors.toasts.enableOneDay'));
        return;
      }

      const payload = {
        name: values.name,
        specialization: values.specialization || undefined,
        avatarUrl: uploadedAvatarUrl,
        experience: typeof values.experience === 'number' ? values.experience : undefined,
        isFeatured: !!values.isFeatured,
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
          {record.isFeatured && <Tag color="green">{t('adminDoctors.form.featuredLabel')}</Tag>}
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

      {/* Create / Edit Modal — 2-step wizard (Profile → Availability) */}
      <ResponsiveFormModal
        title={editingDoctor ? t('adminDoctors.modal.editTitle') : t('adminDoctors.modal.addTitle')}
        open={modalOpen}
        onCancel={closeModal}
        width={640}
        destroyOnClose
        className="doctor-modal"
        footer={
          <>
            {step === 0 ? (
              <Button onClick={closeModal}>{t('common.cancel')}</Button>
            ) : (
              <Button icon={<LeftOutlined />} onClick={() => setStep(0)}>
                {t('common.back')}
              </Button>
            )}
            {step === 0 ? (
              <Button type="primary" onClick={() => handleStepChange(1)}>
                {t('common.next')}
                <RightOutlined />
              </Button>
            ) : (
              <Button
                type="primary"
                icon={<CheckOutlined />}
                loading={createMutation.isPending || updateMutation.isPending || avatarUploading}
                onClick={handleSubmit}
              >
                {editingDoctor ? t('adminDoctors.modal.update') : t('adminDoctors.modal.create')}
              </Button>
            )}
          </>
        }
      >
        <Steps
          size="small"
          current={step}
          onChange={handleStepChange}
          responsive={false}
          className="doctor-modal__steps"
          items={[
            { title: t('adminDoctors.steps.profile'), icon: <UserOutlined /> },
            { title: t('adminDoctors.steps.availability'), icon: <CalendarOutlined /> },
          ]}
        />

        <Form form={form} layout="vertical">
          {/* Step 1: Profile */}
          <div style={{ display: step === 0 ? 'block' : 'none' }}>
            <Form.Item label={t('adminDoctors.form.avatarLabel')}>
              <div className="doctor-avatar-upload-wrap">
                <Upload {...uploadProps} fileList={selectedAvatarFileList} showUploadList={false}>
                  <div className="doctor-avatar-upload">
                    <Avatar size={72} src={avatarUrl}>
                      {(form.getFieldValue('name') || 'D').charAt(0).toUpperCase()}
                    </Avatar>
                    <span className="doctor-avatar-upload__overlay">
                      <CameraOutlined />
                    </span>
                  </div>
                </Upload>
                <div className="doctor-avatar-upload__meta">
                  <Text strong>
                    {selectedAvatarFile ? selectedAvatarFile.name : t('adminDoctors.form.selectImage')}
                  </Text>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {t('adminDoctors.form.avatarHelp')}
                  </Text>
                </div>
              </div>
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

            <Form.Item
              name="experience"
              label={t('adminDoctors.form.experienceLabel')}
              rules={[
                { type: 'number', min: 0, max: 80, message: t('adminDoctors.form.validation.experienceRange') },
              ]}
            >
              <InputNumber
                min={0}
                max={80}
                style={{ width: '100%' }}
                placeholder={t('adminDoctors.form.experiencePlaceholder')}
              />
            </Form.Item>

            <Form.Item
              name="isFeatured"
              label={
                <Space size={6}>
                  <StarOutlined />
                  {t('adminDoctors.form.featuredLabel')}
                </Space>
              }
              valuePropName="checked"
              tooltip={t('adminDoctors.form.featuredHelp')}
            >
              <Switch />
            </Form.Item>
          </div>

          {/* Step 2: Availability */}
          <div style={{ display: step === 1 ? 'block' : 'none' }}>
            <ScheduleEditor
              days={schedule.next7Days}
              enabledDates={schedule.enabledDates}
              dateTimeRanges={schedule.dateTimeRanges}
              onToggle={schedule.toggleDate}
              onRangeChange={schedule.updateTimeRange}
            />
          </div>
        </Form>
      </ResponsiveFormModal>
    </div>
  );
};

export default DoctorsPage;
