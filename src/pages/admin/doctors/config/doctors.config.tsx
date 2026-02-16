/**
 * Doctors Page Configuration
 * Table columns and page settings
 */

import { Space, Tag, Avatar, Tooltip, Button, Popconfirm } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  UserOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import type { Doctor } from '../../../../api/types';

interface DoctorColumnActions {
  onView: (doctor: Doctor) => void;
  onEdit: (doctor: Doctor) => void;
  onDelete: (id: string) => void;
}

/**
 * Generate table columns configuration
 */
export const getDoctorColumns = (actions: DoctorColumnActions): ColumnsType<Doctor> => [
  {
    title: 'Doctor',
    dataIndex: 'fullName',
    key: 'doctor',
    width: 250,
    fixed: 'left',
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
    render: (specialization: string) => <Tag color="blue">{specialization}</Tag>,
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
            onClick={() => actions.onView(record)}
            size="small"
          />
        </Tooltip>
        <Tooltip title="Edit">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => actions.onEdit(record)}
            size="small"
          />
        </Tooltip>
        <Tooltip title="Delete">
          <Popconfirm
            title="Delete doctor"
            description="Are you sure you want to delete this doctor?"
            onConfirm={() => actions.onDelete(record._id)}
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

/**
 * Page configuration constants
 */
export const DOCTORS_PAGE_CONFIG = {
  title: 'Doctors Management',
  description: 'Manage doctor profiles, availability, and settings',
  searchPlaceholder: 'Search by name, email, or specialization...',
  createButtonText: 'Add Doctor',
  defaultPageSize: 10,
  pageSizeOptions: [10, 20, 50, 100],
};
