/**
 * Services Page Configuration
 * Table columns and page settings
 */

import { Space, Tag, Image, Button, Popconfirm, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  FileImageOutlined,
} from '@ant-design/icons';
import type { ClinicService } from '../../../../api/types';

interface ServiceColumnActions {
  onView: (service: ClinicService) => void;
  onEdit: (service: ClinicService) => void;
  onDelete: (id: string) => void;
  getLocalizedName: (service: ClinicService) => string;
  getLocalizedDescription: (service: ClinicService) => string;
}

/**
 * Generate table columns configuration
 */
export const getServiceColumns = (actions: ServiceColumnActions): ColumnsType<ClinicService> => [
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
        <div className="service-name">{actions.getLocalizedName(record)}</div>
        <div className="service-description-short">
          {actions.getLocalizedDescription(record).substring(0, 60)}
          {actions.getLocalizedDescription(record).length > 60 ? '...' : ''}
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
    render: (category: string) => <Tag color="cyan">{category}</Tag>,
  },
  {
    title: 'Price',
    dataIndex: 'price',
    key: 'price',
    width: 120,
    render: (price: number) => <span className="service-price">${price}</span>,
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
            title="Delete service"
            description="Are you sure you want to delete this service?"
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
export const SERVICES_PAGE_CONFIG = {
  title: 'Services Management',
  description: 'Manage clinic services, pricing, and availability',
  searchPlaceholder: 'Search by name or category...',
  createButtonText: 'Add Service',
  defaultPageSize: 10,
  pageSizeOptions: [10, 20, 50, 100],
};
