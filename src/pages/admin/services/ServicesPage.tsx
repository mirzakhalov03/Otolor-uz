import React, { useMemo, useState } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Input,
  Popconfirm,
  Modal,
  Form,
  message,
  Tooltip,
  Typography,
  Empty,
  Select,
  InputNumber,
  Tag,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import type { Category, Service } from '@/api/types/catalog.types';
import {
  useAdminCategories,
  useAdminServices,
  useCreateService,
  useUpdateService,
  useDeleteService,
} from '@/api/query/useAdminQueries';
import './ServicesPage.scss';

const { Search } = Input;
const { Title, Text } = Typography;

interface ServiceFormValues {
  title: string;
  description?: string;
  price?: number;
  category: string;
}

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (
    typeof error === 'object' &&
    error !== null &&
    'response' in error
  ) {
    const response = (error as { response?: { data?: { message?: string } } }).response;
    if (response?.data?.message) return response.data.message;
  }
  return fallback;
};

const ServicesPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>(undefined);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [form] = Form.useForm<ServiceFormValues>();

  const { data: categories, isLoading: categoriesLoading } = useAdminCategories();
  const { data: services, isLoading, refetch } = useAdminServices(categoryFilter);

  const createMutation = useCreateService();
  const updateMutation = useUpdateService();
  const deleteMutation = useDeleteService();

  const filteredData = useMemo(() => {
    const source = services || [];
    const q = search.trim().toLowerCase();
    if (!q) return source;
    return source.filter((item) => {
      const categoryName = item.category?.name || '';
      return (
        item.title.toLowerCase().includes(q) ||
        (item.description || '').toLowerCase().includes(q) ||
        categoryName.toLowerCase().includes(q)
      );
    });
  }, [services, search]);

  const categoryOptions = useMemo(
    () =>
      (categories || []).map((item: Category) => ({
        value: item._id,
        label: item.name,
      })),
    [categories]
  );

  const handleRefresh = () => {
    setSearch('');
    refetch();
  };

  const openCreateModal = () => {
    setEditingService(null);
    form.resetFields();
    setModalOpen(true);
  };

  const openEditModal = (record: Service) => {
    setEditingService(record);
    form.setFieldsValue({
      title: record.title,
      description: record.description,
      price: record.price,
      category: record.category?._id,
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      message.success('Service deleted successfully');
    } catch (error) {
      message.error(getErrorMessage(error, 'Failed to delete service'));
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        title: values.title,
        description: values.description || undefined,
        price: values.price,
        category: values.category,
      };

      if (editingService) {
        await updateMutation.mutateAsync({ id: editingService._id, data: payload });
        message.success('Service updated successfully');
      } else {
        await createMutation.mutateAsync(payload);
        message.success('Service created successfully');
      }

      setModalOpen(false);
      setEditingService(null);
      form.resetFields();
    } catch (error) {
      message.error(getErrorMessage(error, 'Failed to save service'));
    }
  };

  const columns: ColumnsType<Service> = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      width: 220,
      render: (title: string) => <span className="service-title">{title}</span>,
    },
    {
      title: 'Category',
      key: 'category',
      width: 180,
      render: (_, record) => <Tag color="blue">{record.category?.name || '—'}</Tag>,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      render: (value?: string) => value || <Text type="secondary">—</Text>,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      width: 140,
      render: (price?: number) => (typeof price === 'number' ? `${price.toLocaleString()} UZS` : '—'),
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      render: (value: string) => dayjs(value).format('MMM DD, YYYY'),
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
              title="Delete service"
              description="Are you sure? This cannot be undone."
              onConfirm={() => handleDelete(record._id)}
              okText="Yes"
              cancelText="No"
              okButtonProps={{ danger: true }}
            >
              <Button type="text" danger icon={<DeleteOutlined />} size="small" />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="services-page">
      <Card className="services-page__card">
        <div className="services-page__header">
          <div className="services-page__header-left">
            <Title level={4} style={{ margin: 0 }}>
              Services Management
            </Title>
          </div>
          <div className="services-page__header-right">
            <Space size="middle" wrap>
              <Select
                allowClear
                placeholder="Filter by category"
                style={{ width: 220 }}
                value={categoryFilter}
                onChange={(value) => setCategoryFilter(value)}
                options={categoryOptions}
                loading={categoriesLoading}
              />
              <Search
                placeholder="Search title, description, category..."
                allowClear
                onSearch={setSearch}
                onChange={(e) => setSearch(e.target.value)}
                value={search}
                style={{ width: 300 }}
                prefix={<SearchOutlined />}
              />
              <Button icon={<ReloadOutlined />} onClick={handleRefresh} loading={isLoading} />
              <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>
                Add Service
              </Button>
            </Space>
          </div>
        </div>

        <Table<Service>
          columns={columns}
          dataSource={filteredData}
          rowKey="_id"
          loading={isLoading || createMutation.isPending || updateMutation.isPending || deleteMutation.isPending}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} services`,
            pageSizeOptions: ['10', '20', '50'],
          }}
          scroll={{ x: 1100 }}
          locale={{
            emptyText: <Empty description="No services found" image={Empty.PRESENTED_IMAGE_SIMPLE} />,
          }}
        />
      </Card>

      <Modal
        title={editingService ? 'Edit Service' : 'Add New Service'}
        open={modalOpen}
        onCancel={() => {
          setModalOpen(false);
          setEditingService(null);
          form.resetFields();
        }}
        onOk={handleSubmit}
        confirmLoading={createMutation.isPending || updateMutation.isPending}
        okText={editingService ? 'Update' : 'Create'}
        width={640}
        destroyOnClose
      >
        <Form<ServiceFormValues> form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item
            name="title"
            label="Service Title"
            rules={[
              { required: true, message: 'Service title is required' },
              { min: 2, message: 'Title must be at least 2 characters' },
              { max: 150, message: 'Title cannot exceed 150 characters' },
            ]}
          >
            <Input placeholder="e.g. Teeth Whitening" />
          </Form.Item>

          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true, message: 'Category is required' }]}
          >
            <Select
              placeholder="Select category"
              options={categoryOptions}
              loading={categoriesLoading}
            />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ max: 2000, message: 'Description cannot exceed 2000 characters' }]}
          >
            <Input.TextArea rows={4} placeholder="Optional description" />
          </Form.Item>

          <Form.Item
            name="price"
            label="Price (UZS)"
            rules={[{ type: 'number', min: 0, message: 'Price must be non-negative' }]}
          >
            <InputNumber min={0} precision={0} style={{ width: '100%' }} placeholder="Optional price" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ServicesPage;
