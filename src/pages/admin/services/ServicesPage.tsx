/**
 * Services Management Page
 * Admin page for managing clinic services with search and pagination
 */

import React, { useState } from 'react';
import { Space, Button, Tag, Popconfirm, message, Tooltip, Image } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  FileImageOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import DataTable from '../../../components/admin/DataTable';
import { useClinicServices, useDeleteClinicService } from '../../../api/query';
import type { ClinicService } from '../../../api/types';
import './ServicesPage.scss';

const ServicesPage: React.FC = () => {
  const { i18n } = useTranslation();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');

  // Fetch services with pagination
  const { data, isLoading, refetch } = useClinicServices({
    page,
    limit: pageSize,
    search,
  });

  const deleteMutation = useDeleteClinicService();

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1); // Reset to first page on search
  };

  const handleRefresh = () => {
    setSearch('');
    setPage(1);
    refetch();
  };

  const handleCreate = () => {
    // TODO: Open create service modal/drawer
    message.info('Create service functionality - coming soon!');
  };

  const handleEdit = (service: ClinicService) => {
    // TODO: Open edit service modal/drawer
    message.info(`Edit service: ${service._id}`);
  };

  const handleView = (service: ClinicService) => {
    // TODO: Navigate to service detail page
    message.info(`View service: ${service._id}`);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      message.success('Service deleted successfully');
      refetch();
    } catch (error) {
      message.error('Failed to delete service');
    }
  };

  const handlePageChange = (newPage: number, newPageSize: number) => {
    setPage(newPage);
    setPageSize(newPageSize);
  };

  // Get localized name based on current language
  const getLocalizedName = (service: ClinicService) => {
    const lang = i18n.language as 'uz' | 'ru' | 'en';
    return service.name[lang] || service.name.en || 'N/A';
  };

  // Get localized description
  const getLocalizedDescription = (service: ClinicService) => {
    const lang = i18n.language as 'uz' | 'ru' | 'en';
    return service.description[lang] || service.description.en || 'N/A';
  };

  const columns: ColumnsType<ClinicService> = [
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      width: 80,
      render: (image: ClinicService['image']) => (
        <div className="service-image">
          {image?.url ? (
            <Image
              src={image.url}
              alt="Service"
              width={50}
              height={50}
              style={{ objectFit: 'cover', borderRadius: 4 }}
              placeholder={
                <div className="image-placeholder">
                  <FileImageOutlined />
                </div>
              }
            />
          ) : (
            <div className="image-placeholder">
              <FileImageOutlined />
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Service Name',
      key: 'name',
      width: 250,
      render: (_, record) => (
        <div>
          <div className="service-name">{getLocalizedName(record)}</div>
          <div className="service-description-short">
            {getLocalizedDescription(record).substring(0, 60)}
            {getLocalizedDescription(record).length > 60 ? '...' : ''}
          </div>
        </div>
      ),
    },
    {
      title: 'All Languages',
      key: 'allNames',
      width: 300,
      render: (_, record) => (
        <Space orientation="vertical" size={2}>
          <div className="lang-item">
            <Tag color="blue">UZ</Tag>
            <span>{record.name.uz}</span>
          </div>
          <div className="lang-item">
            <Tag color="green">RU</Tag>
            <span>{record.name.ru}</span>
          </div>
          <div className="lang-item">
            <Tag color="purple">EN</Tag>
            <span>{record.name.en}</span>
          </div>
        </Space>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      width: 150,
      render: (category: string) => (
        <Tag color="cyan">{category}</Tag>
      ),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      width: 120,
      render: (price: number) => (
        <span className="service-price">${price}</span>
      ),
      sorter: true,
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      key: 'duration',
      width: 120,
      render: (duration: number) => `${duration} min`,
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 100,
      render: (isActive: boolean) => (
        <Tag
          icon={isActive ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
          color={isActive ? 'success' : 'default'}
        >
          {isActive ? 'Active' : 'Inactive'}
        </Tag>
      ),
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="View">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => handleView(record)}
              size="small"
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
              size="small"
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Popconfirm
              title="Delete service"
              description="Are you sure you want to delete this service?"
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
    <div className="services-page">
      <DataTable<ClinicService>
        pageTitle="Services Management"
        columns={columns}
        dataSource={data?.data || []}
        rowKey="_id"
        loading={isLoading || deleteMutation.isPending}
        meta={data?.meta}
        onSearch={handleSearch}
        onRefresh={handleRefresh}
        onCreate={handleCreate}
        onPageChange={handlePageChange}
        searchPlaceholder="Search by name or category..."
        createButtonText="Add Service"
      />
    </div>
  );
};

export default ServicesPage;
