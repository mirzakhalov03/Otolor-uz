/**
 * Doctors List Component
 * Main page for displaying and managing doctors
 */

import React, { useState } from 'react';
import { message } from 'antd';
import { PageHeader, DataTable } from '../../../../components/admin/shared';
import { useDoctors, useDeleteDoctor } from '../../../../api/query';
import type { Doctor } from '../../../../api/types';
import { getDoctorColumns, DOCTORS_PAGE_CONFIG } from '../config/doctors.config';
import './DoctorsList.scss';

const DoctorsList: React.FC = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DOCTORS_PAGE_CONFIG.defaultPageSize);
  const [search, setSearch] = useState('');

  // Fetch doctors
  const { data, isLoading, refetch } = useDoctors({
    page,
    limit: pageSize,
    search,
  });

  const deleteMutation = useDeleteDoctor();

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
    message.info('Create doctor functionality - coming soon!');
  };

  const handleView = (doctor: Doctor) => {
    // TODO: Navigate to doctor detail page
    message.info(`View doctor: ${doctor._id}`);
  };

  const handleEdit = (doctor: Doctor) => {
    // TODO: Navigate to edit page or open modal
    message.info(`Edit doctor: ${doctor._id}`);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      message.success('Doctor deleted successfully');
      refetch();
    } catch (error) {
      message.error('Failed to delete doctor');
    }
  };

  const handlePageChange = (newPage: number, newPageSize: number) => {
    setPage(newPage);
    setPageSize(newPageSize);
  };

  // Generate columns with action handlers
  const columns = getDoctorColumns({
    onView: handleView,
    onEdit: handleEdit,
    onDelete: handleDelete,
  });

  return (
    <div className="doctors-list-page">
      <PageHeader
        title={DOCTORS_PAGE_CONFIG.title}
        description={DOCTORS_PAGE_CONFIG.description}
        onSearch={handleSearch}
        onRefresh={handleRefresh}
        onCreate={handleCreate}
        searchPlaceholder={DOCTORS_PAGE_CONFIG.searchPlaceholder}
        createButtonText={DOCTORS_PAGE_CONFIG.createButtonText}
        loading={isLoading || deleteMutation.isPending}
      />

      <DataTable<Doctor>
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

export default DoctorsList;
