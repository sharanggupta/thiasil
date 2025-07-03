import React from 'react';

export interface DataTableColumn<T = any> {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, row: T, index: number) => React.ReactNode;
  className?: string;
}

export interface DataTableAction<T = any> {
  label: string;
  icon?: React.ReactNode;
  onClick: (row: T, index: number) => void;
  variant?: 'primary' | 'secondary' | 'accent' | 'danger';
  size?: 'small' | 'medium';
  disabled?: (row: T) => boolean;
  show?: (row: T) => boolean;
}

export interface DataTablePagination {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export interface DataTableProps<T = any> {
  data: T[];
  columns: DataTableColumn<T>[];
  actions?: DataTableAction<T>[];
  loading?: boolean;
  emptyMessage?: string;
  emptyIcon?: React.ReactNode;
  striped?: boolean;
  hover?: boolean;
  compact?: boolean;
  selectable?: boolean;
  selectedRows?: Set<number>;
  onSelectionChange?: (selectedIndexes: Set<number>) => void;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (column: string, direction: 'asc' | 'desc') => void;
  pagination?: DataTablePagination;
  className?: string;
}

export interface DataTableState {
  internalSort: {
    column: string;
    direction: 'asc' | 'desc';
  };
  selectedRows: Set<number>;
}

export interface DataTableContextValue<T = any> extends DataTableState {
  data: T[];
  columns: DataTableColumn<T>[];
  actions?: DataTableAction<T>[];
  sortedData: T[];
  isAllSelected: boolean;
  isIndeterminate: boolean;
  handleSort: (column: string) => void;
  handleRowSelect: (index: number, checked: boolean) => void;
  handleSelectAll: (checked: boolean) => void;
}