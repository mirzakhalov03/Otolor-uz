/**
 * Services Management Page
 * Admin page for managing clinic services with search, pagination, and CRUD
 */

import React, { useState } from 'react';
import { Space, Button, Tag, Popconfirm, message, Tooltip, Image, Drawer } from 'antd';
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
import { ServiceForm } from '../../../components/admin';
import { 
  useClinicServices, 
  useDeleteClinicService, 
  useCreateClinicService,
  useUpdateClinicService,
  useClinicService,
} from '../../../api/query';
import type { ClinicService } from '../../../api/types';
import type { CreateServiceRequest, UpdateServiceRequest } from '../../../api/services/clinicService.service';
import './ServicesPage.scss';

type DrawerMode = 'create' | 'edit' | 'view' | null;

const ServicesPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  
  // Drawer state
  const [drawerMode, setDrawerMode] = useState<DrawerMode>(null);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);

  // Fetch services with pagination
  const { data, isLoading, refetch } = useClinicServices({
    page,
    limit: pageSize,
    search,
  });

  // Fetch selected service for editing
  const { data: selectedService, isLoading: isLoadingService } = useClinicService(
    selectedServiceId || '',
    !!selectedServiceId && drawerMode === 'edit'
  );

  // Mutations
  const deleteMutation = useDeleteClinicService();
  const createMutation = useCreateClinicService();
  const updateMutation = useUpdateClinicService();

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleRefresh = () => {
    setSearch('');
    setPage(1);
    refetch();
  };

  const handleCreate = () => {
    setSelectedServiceId(null);
    setDrawerMode('create');
  };

  const handleEdit = (service: ClinicService) => {
    setSelectedServiceId(service._id);
    setDrawerMode('edit');
  };

  const handleView = (service: ClinicService) => {
    setSelectedServiceId(service._id);
    setDrawerMode('view');
  };

  const handleCloseDrawer = () => {
    setDrawerMode(null);
    setSelectedServiceId(null);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      message.success(t('admin.services.deleteSuccess', 'Service deleted successfully'));
      refetch();
    } catch {
      message.error(t('admin.services.deleteError', 'Failed to delete service'));
    }
  };

  const handleCreateSubmit = async (values: CreateServiceRequest | UpdateServiceRequest) => {
    try {
      await createMutation.mutateAsync(values as CreateServiceRequest);
      message.success(t('admin.services.createSuccess', 'Service created successfully'));
      handleCloseDrawer();
      refetch();
    } catch (error) {
      const err = error as { message?: string };
      message.error(err?.message || t('admin.services.createError', 'Failed to create service'));
    }
  };

  const handleEditSubmit = async (values: CreateServiceRequest | UpdateServiceRequest) => {
    if (!selectedServiceId) return;
    try {
      await updateMutation.mutateAsync({ 
        id: selectedServiceId, 
        data: values as UpdateServiceRequest 
      });
      message.success(t('admin.services.updateSuccess', 'Service updated successfully'));
      handleCloseDrawer();
      refetch();
    } catch (error) {
      const err = error as { message?: string };
      message.error(err?.message || t('admin.services.updateError', 'Failed to update service'));
    }
  };

  const handlePageChange = (newPage: number, newPageSize: number) => {
    setPage(newPage);
    setPageSize(newPageSize);
  };

  // Get localized name based on current language
  const getLocalizedName = (service: ClinicService) => {
    const lang = i18n.language as 'uz' | 'ru' | 'en';
    return service.name?.[lang] || service.name?.en || 'N/A';
  };

  // Get localized description
  const getLocalizedDescription = (service: ClinicService) => {
    const lang = i18n.language as 'uz' | 'ru' | 'en';
    return service.description?.[lang] || service.description?.en || 'N/A';
  };

  // Get drawer title
  const getDrawerTitle = () => {
    switch (drawerMode) {
      case 'create':
        return t('admin.services.addService', 'Add Service');
      case 'edit':
        return t('admin.services.editService', 'Edit Service');
      case 'view':
        return t('admin.services.viewService', 'View Service');
      default:
        return '';
    }
  };

  const columns: ColumnsType<ClinicService> = [
    {
      title: t('admin.services.image', 'Image'),
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
      title: t('admin.services.serviceName', 'Service Name'),
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
      title: t('admin.services.allLanguages', 'All Languages'),
      key: 'allNames',
      width: 300,
      render: (_, record) => (
        <Space direction="vertical" size={2}>
          <div className="lang-item">
            <Tag color="blue">UZ</Tag>
            <span>{record.name?.uz || '-'}</span>
          </div>
          <div className="lang-item">
            <Tag color="green">RU</Tag>
            <span>{record.name?.ru || '-'}</span>
          </div>
          <div className="lang-item">
            <Tag color="purple">EN</Tag>
            <span>{record.name?.en || '-'}</span>
          </div>
        </Space>
      ),
    },
    {
      title: t('admin.services.category', 'Category'),
      dataIndex: 'category',
      key: 'category',
      width: 150,
      render: (category: string) => (
        <Tag color="cyan">{category}</Tag>
      ),
    },
    {
      title: t('admin.services.price', 'Price'),
      dataIndex: 'price',
      key: 'price',
      width: 120,
      render: (price: number) => (
        <span className="service-price">{price?.toLocaleString()} UZS</span>
      ),
      sorter: true,
    },
    {
      title: t('admin.services.duration', 'Duration'),
      dataIndex: 'duration',
      key: 'duration',
      width: 120,
      render: (duration: number) => `${duration} ${t('common.minutes', 'min')}`,
    },
    {
      title: t('common.status', 'Status'),
      dataIndex: 'isActive',
      key: 'isActive',
      width: 100,
      render: (isActive: boolean) => (
        <Tag
          icon={isActive ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
          color={isActive ? 'success' : 'default'}
        >
          {isActive ? t('common.active', 'Active') : t('common.inactive', 'Inactive')}
        </Tag>
      ),
    },
    {
      title: t('common.created', 'Created'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: t('common.actions', 'Actions'),
      key: 'actions',
      fixed: 'right',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title={t('common.view', 'View')}>
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => handleView(record)}
              size="small"
            />
          </Tooltip>
          <Tooltip title={t('common.edit', 'Edit')}>
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
              size="small"
            />
          </Tooltip>
          <Tooltip title={t('common.delete', 'Delete')}>
            <Popconfirm
              title={t('admin.services.deleteTitle', 'Delete service')}
              description={t('admin.services.deleteConfirm', 'Are you sure you want to delete this service?')}
              onConfirm={() => handleDelete(record._id)}
              okText={t('common.yes', 'Yes')}
              cancelText={t('common.no', 'No')}
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
        pageTitle={t('admin.services.pageTitle', 'Services Management')}
        columns={columns}
        dataSource={data?.data || []}
        rowKey="_id"
        loading={isLoading || deleteMutation.isPending}
        meta={data?.meta}
        onSearch={handleSearch}
        onRefresh={handleRefresh}
        onCreate={handleCreate}
        onPageChange={handlePageChange}
        searchPlaceholder={t('admin.services.searchPlaceholder', 'Search by name or category...')}
        createButtonText={t('admin.services.addService', 'Add Service')}
      />

      {/* Create/Edit Drawer */}
      <Drawer
        title={getDrawerTitle()}
        open={drawerMode !== null}
        onClose={handleCloseDrawer}
        width={720}
        destroyOnClose
        footer={null}
      >
        {drawerMode === 'create' && (
          <ServiceForm
            isEditMode={false}
            onSubmit={handleCreateSubmit}
            onCancel={handleCloseDrawer}
            isLoading={createMutation.isPending}
          />
        )}
        
        {drawerMode === 'edit' && (
          isLoadingService ? (
            <div style={{ textAlign: 'center', padding: 40 }}>
              {t('common.loading', 'Loading...')}
            </div>
          ) : (
            <ServiceForm
              isEditMode={true}
              initialData={selectedService}
              onSubmit={handleEditSubmit}
              onCancel={handleCloseDrawer}
              isLoading={updateMutation.isPending}
            />
          )
        )}

        {drawerMode === 'view' && selectedService && (
          <div className="service-view">
            <h3>{getLocalizedName(selectedService)}</h3>
            <p>{getLocalizedDescription(selectedService)}</p>
            <div style={{ marginTop: 16 }}>
              <Tag color="cyan">{selectedService.category}</Tag>
              <Tag color="green">{selectedService.price?.toLocaleString()} UZS</Tag>
              <Tag>{selectedService.duration} min</Tag>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default ServicesPage;
