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
  Grid,
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
import { useTranslation } from 'react-i18next';
import './ServicesPage.scss';

const { Search } = Input;
const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

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
  const { t } = useTranslation();
  const screens = useBreakpoint();
  const isMobile = !screens.md;
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
      message.success(t('adminServices.toasts.deleteSuccess'));
    } catch (error) {
      message.error(getErrorMessage(error, t('adminServices.toasts.deleteFailed')));
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
        message.success(t('adminServices.toasts.updateSuccess'));
      } else {
        await createMutation.mutateAsync(payload);
        message.success(t('adminServices.toasts.createSuccess'));
      }

      setModalOpen(false);
      setEditingService(null);
      form.resetFields();
    } catch (error) {
      message.error(getErrorMessage(error, t('adminServices.toasts.saveFailed')));
    }
  };

  const columns: ColumnsType<Service> = [
    {
      title: t('adminServices.table.title'),
      dataIndex: 'title',
      key: 'title',
      width: 220,
      render: (title: string) => <span className="service-title">{title}</span>,
    },
    {
      title: t('adminServices.table.category'),
      key: 'category',
      width: 180,
      render: (_, record) => <Tag color="blue">{record.category?.name || '—'}</Tag>,
    },
    {
      title: t('adminServices.table.description'),
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      render: (value?: string) => value || <Text type="secondary">—</Text>,
    },
    {
      title: t('adminServices.table.price'),
      dataIndex: 'price',
      key: 'price',
      width: 140,
      render: (price?: number) => (typeof price === 'number' ? `${price.toLocaleString()} ${t('adminServices.currency')}` : '—'),
    },
    {
      title: t('adminServices.table.created'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      render: (value: string) => dayjs(value).format('MMM DD, YYYY'),
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
              title={t('adminServices.actions.deleteTitle')}
              description={t('adminServices.actions.deleteDescription')}
              onConfirm={() => handleDelete(record._id)}
              okText={t('common.yes')}
              cancelText={t('common.no')}
              okButtonProps={{ danger: true }}
            >
              <Button type="text" danger icon={<DeleteOutlined />} size="small" />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  const mobileColumns: ColumnsType<Service> = [
    {
      title: t('adminServices.table.title'),
      key: 'serviceMobile',
      render: (_, record) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ fontWeight: 700, color: '#1a1a2e' }}>{record.title}</div>
          <div>
            <Tag color="blue">{record.category?.name || '—'}</Tag>
          </div>
          <div style={{ fontSize: 12, color: '#666' }}>
            {typeof record.price === 'number' ? `${record.price.toLocaleString()} ${t('adminServices.currency')}` : '—'}
          </div>
          <Space size="small">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => openEditModal(record)}
              size="small"
            />
            <Popconfirm
              title={t('adminServices.actions.deleteTitle')}
              description={t('adminServices.actions.deleteDescription')}
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
    <div className="services-page">
      <Card className="services-page__card">
        <div className="services-page__header">
          <div className="services-page__header-left">
            <Title level={4} style={{ margin: 0 }}>
              {t('adminServices.title')}
            </Title>
          </div>
          <div className="services-page__header-right">
            <Space size="middle" wrap>
              <Select
                allowClear
                placeholder={t('adminServices.filterByCategory')}
                style={{ width: 220 }}
                value={categoryFilter}
                onChange={(value) => setCategoryFilter(value)}
                options={categoryOptions}
                loading={categoriesLoading}
              />
              <Search
                placeholder={t('adminServices.searchPlaceholder')}
                allowClear
                onSearch={setSearch}
                onChange={(e) => setSearch(e.target.value)}
                value={search}
                style={{ width: 300 }}
                prefix={<SearchOutlined />}
              />
              <Button icon={<ReloadOutlined />} onClick={handleRefresh} loading={isLoading} />
              <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>
                {t('adminServices.addButton')}
              </Button>
            </Space>
          </div>
        </div>

        <Table<Service>
          columns={isMobile ? mobileColumns : columns}
          dataSource={filteredData}
          rowKey="_id"
          loading={isLoading || createMutation.isPending || updateMutation.isPending || deleteMutation.isPending}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total, range) =>
              t('adminServices.pagination.showTotal', {
                from: range[0],
                to: range[1],
                total,
              }),
            pageSizeOptions: ['10', '20', '50'],
          }}
          scroll={isMobile ? undefined : { x: 1100 }}
          locale={{
            emptyText: <Empty description={t('adminServices.empty')} image={Empty.PRESENTED_IMAGE_SIMPLE} />,
          }}
        />
      </Card>

      <Modal
        title={editingService ? t('adminServices.modal.editTitle') : t('adminServices.modal.addTitle')}
        open={modalOpen}
        onCancel={() => {
          setModalOpen(false);
          setEditingService(null);
          form.resetFields();
        }}
        onOk={handleSubmit}
        confirmLoading={createMutation.isPending || updateMutation.isPending}
        okText={editingService ? t('adminServices.modal.update') : t('adminServices.modal.create')}
        width={640}
        destroyOnClose
      >
        <Form<ServiceFormValues> form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item
            name="title"
            label={t('adminServices.form.titleLabel')}
            rules={[
              { required: true, message: t('adminServices.form.validation.titleRequired') },
              { min: 2, message: t('adminServices.form.validation.titleMin') },
              { max: 150, message: t('adminServices.form.validation.titleMax') },
            ]}
          >
            <Input placeholder={t('adminServices.form.titlePlaceholder')} />
          </Form.Item>

          <Form.Item
            name="category"
            label={t('adminServices.form.categoryLabel')}
            rules={[{ required: true, message: t('adminServices.form.validation.categoryRequired') }]}
          >
            <Select
              placeholder={t('adminServices.form.categoryPlaceholder')}
              options={categoryOptions}
              loading={categoriesLoading}
            />
          </Form.Item>

          <Form.Item
            name="description"
            label={t('adminServices.form.descriptionLabel')}
            rules={[{ max: 2000, message: t('adminServices.form.validation.descriptionMax') }]}
          >
            <Input.TextArea rows={4} placeholder={t('adminServices.form.descriptionPlaceholder')} />
          </Form.Item>

          <Form.Item
            name="price"
            label={t('adminServices.form.priceLabel')}
            rules={[{ type: 'number', min: 0, message: t('adminServices.form.validation.priceMin') }]}
          >
            <InputNumber min={0} precision={0} style={{ width: '100%' }} placeholder={t('adminServices.form.pricePlaceholder')} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ServicesPage;
