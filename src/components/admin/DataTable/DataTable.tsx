/**
 * Reusable DataTable Component for Admin Pages
 * Features: Search, Pagination, Loading, Actions
 */

import React, { useState } from 'react';
import { Table, Input, Space, Button, Card } from 'antd';
import type { TableProps, PaginationProps } from 'antd';
import { SearchOutlined, ReloadOutlined, PlusOutlined } from '@ant-design/icons';
import type { PaginationMeta } from '../../../api/types';
import './DataTable.scss';

const { Search } = Input;

export interface DataTableProps<T> extends Omit<TableProps<T>, 'pagination' | 'title'> {
  // Custom props
  onSearch?: (value: string) => void;
  onRefresh?: () => void;
  onCreate?: () => void;
  searchPlaceholder?: string;
  createButtonText?: string;
  showSearch?: boolean;
  showRefresh?: boolean;
  showCreate?: boolean;
  pageTitle?: React.ReactNode;
  meta?: PaginationMeta;
  onPageChange?: (page: number, pageSize: number) => void;
}

function DataTable<T extends Record<string, any>>({
  onSearch,
  onRefresh,
  onCreate,
  searchPlaceholder = 'Search...',
  createButtonText = 'Create New',
  showSearch = true,
  showRefresh = true,
  showCreate = true,
  pageTitle,
  meta,
  onPageChange,
  loading,
  ...tableProps
}: DataTableProps<T>) {
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = (value: string) => {
    setSearchValue(value);
    onSearch?.(value);
  };

  const handleRefresh = () => {
    setSearchValue('');
    onRefresh?.();
  };

  // Convert meta to Ant Design pagination format
  const paginationConfig: PaginationProps | false = meta
    ? {
        current: meta.pagination.currentPage,
        pageSize: meta.pagination.perPage,
        total: meta.pagination.totalItems,
        showSizeChanger: true,
        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
        pageSizeOptions: ['10', '20', '50', '100'],
        onChange: (page, pageSize) => {
          onPageChange?.(page, pageSize);
        },
      }
    : false;

  return (
    <Card className="data-table-container">
      {/* Header Section */}
      <div className="data-table-header">
        <div className="data-table-header__left">
          {pageTitle && <h2 className="data-table-title">{pageTitle}</h2>}
        </div>
        <div className="data-table-header__right">
          <Space size="middle">
            {/* Search Input */}
            {showSearch && onSearch && (
              <Search
                placeholder={searchPlaceholder}
                allowClear
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onSearch={handleSearch}
                style={{ width: 250 }}
                prefix={<SearchOutlined />}
              />
            )}

            {/* Refresh Button */}
            {showRefresh && onRefresh && (
              <Button
                icon={<ReloadOutlined />}
                onClick={handleRefresh}
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
          </Space>
        </div>
      </div>

      {/* Table */}
      <Table<T>
        {...tableProps}
        loading={loading}
        pagination={paginationConfig}
        scroll={{ x: 'max-content' }}
        bordered
      />
    </Card>
  );
}

export default DataTable;
