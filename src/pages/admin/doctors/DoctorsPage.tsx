/**
 * Doctors Management Page
 * Admin page for managing doctors with search and pagination
 */

import React, { useState } from 'react';
import { Space, Button, Tag, Avatar, Popconfirm, message, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  UserOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import DataTable from '../../../components/admin/DataTable';
import { useDoctors, useDeleteDoctor } from '../../../api/query';
import type { Doctor } from '../../../api/types';
import './DoctorsPage.scss';

const DoctorsPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');

  // Fetch doctors with pagination
  const { data, isLoading, refetch } = useDoctors({
    page,
    limit: pageSize,
    search,
  });
  
  console.log(data)

  const deleteMutation = useDeleteDoctor();

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
    // TODO: Open create doctor modal/drawer
    message.info('Create doctor functionality - coming soon!');
  };

  const handleEdit = (doctor: Doctor) => {
    // TODO: Open edit doctor modal/drawer
    message.info(`Edit doctor: ${doctor._id}`);
  };

  const handleView = (doctor: Doctor) => {
    // TODO: Navigate to doctor detail page
    message.info(`View doctor: ${doctor._id}`);
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

  const columns: ColumnsType<Doctor> = [
    {
      title: 'Doctor',
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
      title: 'Specialization',
      dataIndex: 'specialization',
      key: 'specialization',
      width: 180,
      render: (specialization: string) => (
        <Tag color="blue">{specialization}</Tag>
      ),
    },
    {
      title: 'Experience',
      dataIndex: 'experience',
      key: 'experience',
      width: 120,
      render: (experience: number) => `${experience} years`,
    },
    {
      title: 'Fee',
      dataIndex: 'consultationFee',
      key: 'consultationFee',
      width: 120,
      render: (fee: number) => `$${fee}`,
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      width: 100,
      render: (rating: number, record) => (
        <Tooltip title={`${record.totalReviews || 0} reviews`}>
          <span>⭐ {rating ? rating.toFixed(1) : '0.0'}</span>
        </Tooltip>
      ),
    },
    {
      title: 'Qualifications',
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
      title: 'Status',
      key: 'status',
      width: 120,
      render: (_, record) => (
        <Tag
          icon={record.isActive ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
          color={record.isActive ? 'success' : 'default'}
        >
          {record.isActive ? 'Active' : 'Inactive'}
        </Tag>
      ),
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
              title="Delete doctor"
              description="Are you sure you want to delete this doctor?"
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
      <DataTable<Doctor>
        pageTitle="Doctors Management"
        columns={columns}
        dataSource={data?.data || []}
        rowKey="_id"
        loading={isLoading || deleteMutation.isPending}
        meta={data?.meta}
        onSearch={handleSearch}
        onRefresh={handleRefresh}
        onCreate={handleCreate}
        onPageChange={handlePageChange}
        searchPlaceholder="Search by name, email, or specialization..."
        createButtonText="Add Doctor"
      />
    </div>
  );
};

export default DoctorsPage;
