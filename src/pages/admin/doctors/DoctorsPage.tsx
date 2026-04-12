/**
 * Admin Doctors Management Page
 * Full CRUD for doctors — connected to real backend API
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
  Modal,
  Form,
  message,
  Tooltip,
  Select,
  TimePicker,
  Typography,
  Empty,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  ReloadOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import type { Doctor } from '@/pages/appointments/types/appointment.types';
import {
  useAdminDoctors,
  useCreateDoctor,
  useUpdateDoctor,
  useDeleteDoctor,
} from '@/api/query/useAdminQueries';
import './DoctorsPage.scss';

const { Search } = Input;
const { Title } = Typography;
const { Option } = Select;

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const DAY_COLORS: Record<string, string> = {
  Monday: 'blue',
  Tuesday: 'cyan',
  Wednesday: 'green',
  Thursday: 'orange',
  Friday: 'purple',
  Saturday: 'magenta',
  Sunday: 'red',
};

const DoctorsPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [form] = Form.useForm<any>();

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
    form.setFieldsValue({
      name: '',
      specialization: '',
      schedule: [{ day: 'Monday', time: null }],
    });
    setModalOpen(true);
  };

  const openEditModal = (doctor: Doctor) => {
    setEditingDoctor(doctor);

    // Convert weeklySchedule to form-friendly format
    const schedule: ScheduleEntry[] = Object.entries(doctor.weeklySchedule || {}).map(([day, timeRange]) => {
      const [start, end] = timeRange.split('-');
      return {
        day,
        time: [dayjs(start, 'HH:mm'), dayjs(end, 'HH:mm')],
      };
    });

    form.setFieldsValue({
      name: doctor.name,
      specialization: doctor.specialization || '',
      schedule: schedule.length > 0 ? schedule : [{ day: 'Monday', time: null }],
    });

    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      message.success('Doctor deleted successfully');
    } catch (error: any) {
      const msg = error?.response?.data?.message || 'Failed to delete doctor';
      message.error(msg);
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      // Build weeklySchedule from form entries
      const weeklySchedule: Record<string, string> = {};
      for (const entry of values.schedule) {
        if (entry.day && entry.time && entry.time[0] && entry.time[1]) {
          const start = entry.time[0].format('HH:mm');
          const end = entry.time[1].format('HH:mm');
          weeklySchedule[entry.day] = `${start}-${end}`;
        }
      }

      if (Object.keys(weeklySchedule).length === 0) {
        message.error('Please add at least one working day with time range');
        return;
      }

      const payload = {
        name: values.name,
        specialization: values.specialization || undefined,
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
    } catch (error: any) {
      if (error?.response?.data?.message) {
        message.error(error.response.data.message);
      }
      // form validation errors are handled by antd
    }
  };

  const columns: ColumnsType<Doctor> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: 220,
      render: (name: string) => (
        <span style={{ fontWeight: 600, color: '#1a1a2e' }}>{name}</span>
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
      title: 'Weekly Schedule',
      dataIndex: 'weeklySchedule',
      key: 'weeklySchedule',
      width: 350,
      render: (schedule: Record<string, string>) => {
        if (!schedule || Object.keys(schedule).length === 0) {
          return <span style={{ color: '#999' }}>No schedule set</span>;
        }
        return (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {DAYS_OF_WEEK.filter((d) => schedule[d]).map((day) => (
              <Tag
                key={day}
                color={DAY_COLORS[day]}
                icon={<ClockCircleOutlined />}
                style={{ marginBottom: 2 }}
              >
                {day.slice(0, 3)} {schedule[day]}
              </Tag>
            ))}
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
        }}
        onOk={handleSubmit}
        confirmLoading={createMutation.isPending || updateMutation.isPending}
        okText={editingDoctor ? 'Update' : 'Create'}
        width={640}
        destroyOnClose
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
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

          <Form.Item label="Weekly Schedule" required>
            <Form.List name="schedule">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Space
                      key={key}
                      style={{ display: 'flex', marginBottom: 8, alignItems: 'flex-start' }}
                      align="baseline"
                    >
                      <Form.Item
                        {...restField}
                        name={[name, 'day']}
                        rules={[{ required: true, message: 'Select day' }]}
                        style={{ minWidth: 140 }}
                      >
                        <Select placeholder="Day">
                          {DAYS_OF_WEEK.map((day) => (
                            <Option key={day} value={day}>
                              {day}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, 'time']}
                        rules={[{ required: true, message: 'Set time range' }]}
                      >
                        <TimePicker.RangePicker
                          format="HH:mm"
                          minuteStep={30}
                          placeholder={['Start', 'End']}
                        />
                      </Form.Item>
                      {fields.length > 1 && (
                        <Button
                          type="text"
                          danger
                          onClick={() => remove(name)}
                          icon={<DeleteOutlined />}
                        />
                      )}
                    </Space>
                  ))}
                  {fields.length < 7 && (
                    <Button
                      type="dashed"
                      onClick={() => add({ day: undefined, time: null })}
                      block
                      icon={<PlusOutlined />}
                    >
                      Add Working Day
                    </Button>
                  )}
                </>
              )}
            </Form.List>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DoctorsPage;
