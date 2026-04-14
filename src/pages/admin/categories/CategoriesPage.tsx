import React, { useMemo, useState } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Input,
  Modal,
  Form,
  message,
  Typography,
  Empty,
  Tag,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import type { Category } from '@/api/types/catalog.types';
import { useAdminCategories, useCreateCategory } from '@/api/query/useAdminQueries';
import './CategoriesPage.scss';

const { Search } = Input;
const { Title } = Typography;

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

const CategoriesPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();

  const { data: categories, isLoading, refetch } = useAdminCategories();
  const createMutation = useCreateCategory();

  const filteredData = useMemo(() => {
    const source = categories || [];
    const q = search.trim().toLowerCase();
    if (!q) return source;
    return source.filter((item) =>
      item.name.toLowerCase().includes(q) || (item.slug || '').toLowerCase().includes(q)
    );
  }, [categories, search]);

  const handleRefresh = () => {
    setSearch('');
    refetch();
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await createMutation.mutateAsync({
        name: values.name,
        slug: values.slug || undefined,
      });
      message.success('Category created successfully');
      setModalOpen(false);
      form.resetFields();
    } catch (error) {
      const msg = getErrorMessage(error, 'Failed to create category');
      message.error(msg);
    }
  };

  const columns: ColumnsType<Category> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: 280,
      render: (name: string) => <span className="category-name">{name}</span>,
    },
    {
      title: 'Slug',
      dataIndex: 'slug',
      key: 'slug',
      width: 240,
      render: (slug?: string) => (slug ? <Tag color="geekblue">{slug}</Tag> : <Tag>—</Tag>),
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 200,
      render: (value: string) => dayjs(value).format('MMM DD, YYYY HH:mm'),
    },
  ];

  return (
    <div className="categories-page">
      <Card className="categories-page__card">
        <div className="categories-page__header">
          <div className="categories-page__header-left">
            <Title level={4} style={{ margin: 0 }}>
              Categories Management
            </Title>
          </div>
          <div className="categories-page__header-right">
            <Space size="middle">
              <Search
                placeholder="Search by name or slug..."
                allowClear
                onSearch={setSearch}
                onChange={(e) => setSearch(e.target.value)}
                value={search}
                style={{ width: 280 }}
                prefix={<SearchOutlined />}
              />
              <Button icon={<ReloadOutlined />} onClick={handleRefresh} loading={isLoading} />
              <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalOpen(true)}>
                Add Category
              </Button>
            </Space>
          </div>
        </div>

        <Table<Category>
          columns={columns}
          dataSource={filteredData}
          rowKey="_id"
          loading={isLoading || createMutation.isPending}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} categories`,
            pageSizeOptions: ['10', '20', '50'],
          }}
          locale={{
            emptyText: <Empty description="No categories found" image={Empty.PRESENTED_IMAGE_SIMPLE} />,
          }}
        />
      </Card>

      <Modal
        title="Add New Category"
        open={modalOpen}
        onCancel={() => {
          setModalOpen(false);
          form.resetFields();
        }}
        onOk={handleSubmit}
        confirmLoading={createMutation.isPending}
        okText="Create"
        destroyOnClose
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item
            name="name"
            label="Category Name"
            rules={[
              { required: true, message: 'Category name is required' },
              { min: 2, message: 'Name must be at least 2 characters' },
              { max: 120, message: 'Name cannot exceed 120 characters' },
            ]}
          >
            <Input placeholder="e.g. Surgery" />
          </Form.Item>

          <Form.Item
            name="slug"
            label="Slug"
            rules={[
              { min: 2, message: 'Slug must be at least 2 characters' },
              { max: 150, message: 'Slug cannot exceed 150 characters' },
              {
                pattern: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                message: 'Use lowercase letters, numbers, and hyphens only',
              },
            ]}
          >
            <Input placeholder="e.g. surgery" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CategoriesPage;
