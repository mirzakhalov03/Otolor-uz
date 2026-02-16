/**
 * Services List Component
 * Main page for displaying and managing services
 */

import React, { useState } from 'react';
import { message } from 'antd';
import { useTranslation } from 'react-i18next';
import { PageHeader, DataTable } from '../../../../components/admin/shared';
import { useClinicServices, useDeleteClinicService } from '../../../../api/query';
import type { ClinicService } from '../../../../api/types';
import { getServiceColumns, SERVICES_PAGE_CONFIG } from '../config/services.config';
import './ServicesList.scss';

const ServicesList: React.FC = () => {
  const { i18n } = useTranslation();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(SERVICES_PAGE_CONFIG.defaultPageSize);
  const [search, setSearch] = useState('');

  // Fetch services
  const { data, isLoading, refetch } = useClinicServices({
    page,
    limit: pageSize,
    search,
  });

  const deleteMutation = useDeleteClinicService();

  // Get localized name
  const getLocalizedName = (service: ClinicService) => {
    const lang = i18n.language as 'uz' | 'ru' | 'en';
    return service.name[lang] || service.name.en || 'N/A';
  };

  // Get localized description
  const getLocalizedDescription = (service: ClinicService) => {
    const lang = i18n.language as 'uz' | 'ru' | 'en';
    return service.description[lang] || service.description.en || 'N/A';
  };

  // Handlers
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
    // TODO: Navigate to create page or open modal
    message.info('Create service functionality - coming soon!');
  };

  const handleView = (service: ClinicService) => {
    // TODO: Navigate to service detail page
    message.info(`View service: ${service._id}`);
  };

  const handleEdit = (service: ClinicService) => {
    // TODO: Navigate to edit page or open modal
    message.info(`Edit service: ${service._id}`);
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

  // Generate columns with action handlers
  const columns = getServiceColumns({
    onView: handleView,
    onEdit: handleEdit,
    onDelete: handleDelete,
    getLocalizedName,
    getLocalizedDescription,
  });

  return (
    <div className="services-list-page">
      <PageHeader
        title={SERVICES_PAGE_CONFIG.title}
        description={SERVICES_PAGE_CONFIG.description}
        onSearch={handleSearch}
        onRefresh={handleRefresh}
        onCreate={handleCreate}
        searchPlaceholder={SERVICES_PAGE_CONFIG.searchPlaceholder}
        createButtonText={SERVICES_PAGE_CONFIG.createButtonText}
        loading={isLoading || deleteMutation.isPending}
      />

      <DataTable<ClinicService>
        columns={columns}
        dataSource={data?.data || []}
        rowKey="_id"
        loading={isLoading || deleteMutation.isPending}
        meta={data?.meta}
        onPageChange={handlePageChange}
        showSearch={false}
        showRefresh={false}
        showCreate={false}
      />
    </div>
  );
};

export default ServicesList;
