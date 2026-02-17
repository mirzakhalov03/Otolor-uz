/**
 * Doctors Management Page
 * Admin page for managing doctors with search and pagination
 */

import React, { useState } from 'react';
import { Space, Button, Tag, Avatar, Popconfirm, message, Tooltip, Drawer } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  UserOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import DataTable from '../../../components/admin/DataTable';
import { DoctorForm } from '../../../components/admin';
import { useDoctors, useDeleteDoctor, useCreateDoctor, useUpdateDoctor, useDoctorWithUser } from '../../../api/query';
import type { Doctor, ApiResponse } from '../../../api/types';
import type { CreateDoctorRequest, UpdateDoctorRequest } from '../../../api/services/doctor.service';
import './DoctorsPage.scss';

type DrawerMode = 'create' | 'edit' | 'view' | null;

const DoctorsPage: React.FC = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  
  // Drawer state
  const [drawerMode, setDrawerMode] = useState<DrawerMode>(null);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);

  // Fetch doctors with pagination
  const { data, isLoading, refetch } = useDoctors({
    page,
    limit: pageSize,
    search,
  });

  // Fetch selected doctor with user info for edit
  const { data: selectedDoctor, isLoading: isLoadingDoctor } = useDoctorWithUser(
    selectedDoctorId || '',
    !!selectedDoctorId && (drawerMode === 'edit' || drawerMode === 'view')
  );

  // Mutations
  const deleteMutation = useDeleteDoctor();
  const createMutation = useCreateDoctor();
  const updateMutation = useUpdateDoctor();

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
    setSelectedDoctorId(null);
    setDrawerMode('create');
  };

  const handleEdit = (doctor: Doctor) => {
    setSelectedDoctorId(doctor._id);
    setDrawerMode('edit');
  };

  const handleView = (doctor: Doctor) => {
    setSelectedDoctorId(doctor._id);
    setDrawerMode('view');
  };

  const handleCloseDrawer = () => {
    setDrawerMode(null);
    setSelectedDoctorId(null);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      message.success(t('admin.doctors.deleteSuccess', 'Doctor deleted successfully'));
      refetch();
    } catch (error) {
      const apiError = error as ApiResponse;
      message.error(apiError.message || t('admin.doctors.deleteError', 'Failed to delete doctor'));
    }
  };

  const handleCreateSubmit = async (values: CreateDoctorRequest | UpdateDoctorRequest) => {
    try {
      await createMutation.mutateAsync(values as CreateDoctorRequest);
      message.success(t('admin.doctors.createSuccess', 'Doctor created successfully'));
      handleCloseDrawer();
      refetch();
    } catch (error) {
      const apiError = error as ApiResponse;
      message.error(apiError.message || t('admin.doctors.createError', 'Failed to create doctor'));
      throw error; // Re-throw to keep form in submitting state
    }
  };

  const handleUpdateSubmit = async (values: CreateDoctorRequest | UpdateDoctorRequest) => {
    if (!selectedDoctorId) return;
    
    try {
      await updateMutation.mutateAsync({ 
        id: selectedDoctorId, 
        data: values as UpdateDoctorRequest 
      });
      message.success(t('admin.doctors.updateSuccess', 'Doctor updated successfully'));
      handleCloseDrawer();
      refetch();
    } catch (error) {
      const apiError = error as ApiResponse;
      message.error(apiError.message || t('admin.doctors.updateError', 'Failed to update doctor'));
      throw error;
    }
  };

  const handlePageChange = (newPage: number, newPageSize: number) => {
    setPage(newPage);
    setPageSize(newPageSize);
  };

  const columns: ColumnsType<Doctor> = [
    {
      title: t('admin.doctors.columns.doctor', 'Doctor'),
      dataIndex: 'fullName',
      key: 'doctor',
      width: 250,
      render: (_, record) => {
        return (
          <Space>
            <Avatar
              src={record.profileImage?.url}
              icon={!record.profileImage?.url && <UserOutlined />}
              size={40}
            />
            <div>
              <div className="doctor-name">
                {record.fullName || `${record.firstName} ${record.lastName}`}
              </div>
              <div className="doctor-email">{record.email}</div>
            </div>
          </Space>
        );
      },
    },
    {
      title: t('admin.doctors.columns.specialization', 'Specialization'),
      dataIndex: 'specialization',
      key: 'specialization',
      width: 180,
      render: (specialization: string) => (
        <Tag color="blue">{specialization}</Tag>
      ),
    },
    {
      title: t('admin.doctors.columns.experience', 'Experience'),
      dataIndex: 'experience',
      key: 'experience',
      width: 120,
      render: (experience: number) => `${experience} ${t('admin.doctors.years', 'years')}`,
    },
    {
      title: t('admin.doctors.columns.fee', 'Fee'),
      dataIndex: 'consultationFee',
      key: 'consultationFee',
      width: 120,
      render: (fee: number) => `$${fee || 0}`,
    },
    {
      title: t('admin.doctors.columns.qualifications', 'Qualifications'),
      dataIndex: 'qualifications',
      key: 'qualifications',
      width: 150,
      render: (qualifications: string[]) => (
        <Space size={[0, 4]} wrap>
          {qualifications?.slice(0, 2).map((qual) => (
            <Tag key={qual} color="geekblue">
              {qual}
            </Tag>
          )) || <Tag>N/A</Tag>}
          {qualifications && qualifications.length > 2 && <Tag>+{qualifications.length - 2}</Tag>}
        </Space>
      ),
    },
    {
      title: t('admin.doctors.columns.status', 'Status'),
      key: 'status',
      width: 120,
      render: (_, record) => (
        <Tag
          icon={record.isActive ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
          color={record.isActive ? 'success' : 'default'}
        >
          {record.isActive ? t('admin.doctors.active', 'Active') : t('admin.doctors.inactive', 'Inactive')}
        </Tag>
      ),
    },
    {
      title: t('admin.doctors.columns.actions', 'Actions'),
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
              title={t('admin.doctors.deleteTitle', 'Delete doctor')}
              description={t('admin.doctors.deleteDescription', 'Are you sure you want to delete this doctor?')}
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

  // Get drawer title based on mode
  const getDrawerTitle = () => {
    switch (drawerMode) {
      case 'create':
        return t('admin.doctors.createDoctor', 'Create Doctor');
      case 'edit':
        return t('admin.doctors.editDoctor', 'Edit Doctor');
      case 'view':
        return t('admin.doctors.viewDoctor', 'View Doctor');
      default:
        return '';
    }
  };

  return (
    <div className="doctors-page">
      <DataTable<Doctor>
        pageTitle={t('admin.doctors.pageTitle', 'Doctors Management')}
        columns={columns}
        dataSource={data?.data || []}
        rowKey="_id"
        loading={isLoading || deleteMutation.isPending}
        meta={data?.meta}
        onSearch={handleSearch}
        onRefresh={handleRefresh}
        onCreate={handleCreate}
        onPageChange={handlePageChange}
        searchPlaceholder={t('admin.doctors.searchPlaceholder', 'Search by name, email, or specialization...')}
        createButtonText={t('admin.doctors.addDoctor', 'Add Doctor')}
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
          <DoctorForm
            isEditMode={false}
            onSubmit={handleCreateSubmit}
            onCancel={handleCloseDrawer}
            isSubmitting={createMutation.isPending}
          />
        )}
        {(drawerMode === 'edit' || drawerMode === 'view') && (
          <DoctorForm
            initialData={selectedDoctor}
            isEditMode={drawerMode === 'edit'}
            isLoading={isLoadingDoctor}
            onSubmit={handleUpdateSubmit}
            onCancel={handleCloseDrawer}
            isSubmitting={updateMutation.isPending}
          />
        )}
      </Drawer>
    </div>
  );
};

export default DoctorsPage;
