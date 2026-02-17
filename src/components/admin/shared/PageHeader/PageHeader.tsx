/**
 * PageHeader Component
 * Reusable header for admin pages with title, search, filters, and actions
 */

import React from 'react';
import { Space, Button, Input, Typography } from 'antd';
import { PlusOutlined, SearchOutlined, ReloadOutlined, FilterOutlined } from '@ant-design/icons';
import './PageHeader.scss';

const { Title } = Typography;
const { Search } = Input;

export interface PageHeaderProps {
  title: string;
  description?: string;
  onSearch?: (value: string) => void;
  onRefresh?: () => void;
  onCreate?: () => void;
  onFilter?: () => void;
  searchPlaceholder?: string;
  createButtonText?: string;
  showSearch?: boolean;
  showRefresh?: boolean;
  showCreate?: boolean;
  showFilter?: boolean;
  loading?: boolean;
  extra?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  onSearch,
  onRefresh,
  onCreate,
  onFilter,
  searchPlaceholder = 'Search...',
  createButtonText = 'Create New',
  showSearch = true,
  showRefresh = true,
  showCreate = true,
  showFilter = false,
  loading = false,
  extra,
}) => {
  return (
    <div className="page-header">
      <div className="page-header__top">
        <div className="page-header__title-section">
          <Title level={2} className="page-header__title">
            {title}
          </Title>
          {description && (
            <p className="page-header__description">{description}</p>
          )}
        </div>
        <div className="page-header__actions">
          <Space size="middle">
            {/* Search */}
            {showSearch && onSearch && (
              <Search
                placeholder={searchPlaceholder}
                allowClear
                onSearch={onSearch}
                style={{ width: 280 }}
                prefix={<SearchOutlined />}
                enterButton
              />
            )}

            {/* Filter Button */}
            {showFilter && onFilter && (
              <Button
                icon={<FilterOutlined />}
                onClick={onFilter}
              >
                Filters
              </Button>
            )}

            {/* Refresh Button */}
            {showRefresh && onRefresh && (
              <Button
                icon={<ReloadOutlined />}
                onClick={onRefresh}
                loading={loading}
              />
            )}

            {/* Create Button */}
            {showCreate && onCreate && (
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={onCreate}
              >
                {createButtonText}
              </Button>
            )}

            {/* Extra Actions */}
            {extra}
          </Space>
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
