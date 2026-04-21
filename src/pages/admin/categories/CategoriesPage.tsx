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
  Grid,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import type { Category } from '@/api/types/catalog.types';
import { useAdminCategories, useCreateCategory } from '@/api/query/useAdminQueries';
import { useTranslation } from 'react-i18next';
import './CategoriesPage.scss';

const { Search } = Input;
const { Title } = Typography;
const { useBreakpoint } = Grid;

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
  const { t } = useTranslation();
  const screens = useBreakpoint();
  const isMobile = !screens.md;
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
      message.success(t('adminCategories.toasts.createSuccess'));
      setModalOpen(false);
      form.resetFields();
    } catch (error) {
      const msg = getErrorMessage(error, t('adminCategories.toasts.createFailed'));
      message.error(msg);
    }
  };

  const columns: ColumnsType<Category> = [
    {
      title: t('adminCategories.table.name'),
      dataIndex: 'name',
      key: 'name',
      width: 280,
      render: (name: string) => <span className="category-name">{name}</span>,
    },
    {
      title: t('adminCategories.table.slug'),
      dataIndex: 'slug',
      key: 'slug',
      width: 240,
      render: (slug?: string) => (slug ? <Tag color="geekblue">{slug}</Tag> : <Tag>—</Tag>),
    },
    {
      title: t('adminCategories.table.created'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 200,
      render: (value: string) => dayjs(value).format('MMM DD, YYYY HH:mm'),
    },
  ];

  const mobileColumns: ColumnsType<Category> = [
    {
      title: t('adminCategories.table.name'),
      key: 'categoryMobile',
      render: (_, record) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ fontWeight: 700, color: '#1a1a2e' }}>{record.name}</div>
          <div>
            {record.slug ? <Tag color="geekblue">{record.slug}</Tag> : <Tag>—</Tag>}
          </div>
          <div style={{ fontSize: 12, color: '#8c8c8c' }}>{dayjs(record.createdAt).format('MMM DD, YYYY HH:mm')}</div>
        </div>
      ),
    },
  ];

  return (
    <div className="categories-page">
      <Card className="categories-page__card">
        <div className="categories-page__header">
          <div className="categories-page__header-left">
            <Title level={4} style={{ margin: 0 }}>
              {t('adminCategories.title')}
            </Title>
          </div>
          <div className="categories-page__header-right">
            <Space size="middle">
              <Search
                placeholder={t('adminCategories.searchPlaceholder')}
                allowClear
                onSearch={setSearch}
                onChange={(e) => setSearch(e.target.value)}
                value={search}
                style={{ width: 280 }}
                prefix={<SearchOutlined />}
              />
              <Button icon={<ReloadOutlined />} onClick={handleRefresh} loading={isLoading} />
              <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalOpen(true)}>
                {t('adminCategories.addButton')}
              </Button>
            </Space>
          </div>
        </div>

        <Table<Category>
          columns={isMobile ? mobileColumns : columns}
          dataSource={filteredData}
          rowKey="_id"
          loading={isLoading || createMutation.isPending}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total, range) =>
              t('adminCategories.pagination.showTotal', {
                from: range[0],
                to: range[1],
                total,
              }),
            pageSizeOptions: ['10', '20', '50'],
          }}
          locale={{
            emptyText: <Empty description={t('adminCategories.empty')} image={Empty.PRESENTED_IMAGE_SIMPLE} />,
          }}
        />
      </Card>

      <Modal
        title={t('adminCategories.modal.title')}
        open={modalOpen}
        onCancel={() => {
          setModalOpen(false);
          form.resetFields();
        }}
        onOk={handleSubmit}
        confirmLoading={createMutation.isPending}
        okText={t('adminCategories.modal.create')}
        destroyOnClose
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item
            name="name"
            label={t('adminCategories.form.nameLabel')}
            rules={[
              { required: true, message: t('adminCategories.form.validation.nameRequired') },
              { min: 2, message: t('adminCategories.form.validation.nameMin') },
              { max: 120, message: t('adminCategories.form.validation.nameMax') },
            ]}
          >
            <Input placeholder={t('adminCategories.form.namePlaceholder')} />
          </Form.Item>

          <Form.Item
            name="slug"
            label={t('adminCategories.form.slugLabel')}
            rules={[
              { min: 2, message: t('adminCategories.form.validation.slugMin') },
              { max: 150, message: t('adminCategories.form.validation.slugMax') },
              {
                pattern: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                message: t('adminCategories.form.validation.slugPattern'),
              },
            ]}
          >
            <Input placeholder={t('adminCategories.form.slugPlaceholder')} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CategoriesPage;
