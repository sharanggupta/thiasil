"use client";
import React, { useState, useMemo } from 'react';
import { GlassButton } from "@/app/components/Glassmorphism";
import LoadingSpinner from './LoadingSpinner';
import SkeletonLoader from './SkeletonLoader';

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
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (pageSize: number) => void;
  };
  className?: string;
}

export default function DataTable<T = any>({
  data,
  columns,
  actions = [],
  loading = false,
  emptyMessage = 'No data available',
  emptyIcon,
  striped = true,
  hover = true,
  compact = false,
  selectable = false,
  selectedRows = new Set(),
  onSelectionChange,
  sortBy,
  sortDirection = 'asc',
  onSort,
  pagination,
  className = ''
}: DataTableProps<T>) {
  const [internalSort, setInternalSort] = useState<{
    column: string;
    direction: 'asc' | 'desc';
  }>({ column: sortBy || '', direction: sortDirection });

  // Handle sorting
  const handleSort = (column: string) => {
    const newDirection = 
      internalSort.column === column && internalSort.direction === 'asc' 
        ? 'desc' 
        : 'asc';
    
    setInternalSort({ column, direction: newDirection });
    
    if (onSort) {
      onSort(column, newDirection);
    }
  };

  // Sort data internally if no external sorting
  const sortedData = useMemo(() => {
    if (onSort || !internalSort.column) return data;
    
    return [...data].sort((a, b) => {
      const aValue = a[internalSort.column];
      const bValue = b[internalSort.column];
      
      let comparison = 0;
      if (aValue < bValue) comparison = -1;
      if (aValue > bValue) comparison = 1;
      
      return internalSort.direction === 'desc' ? -comparison : comparison;
    });
  }, [data, internalSort, onSort]);

  // Handle row selection
  const handleRowSelect = (index: number, checked: boolean) => {
    if (!onSelectionChange) return;
    
    const newSelection = new Set(selectedRows);
    if (checked) {
      newSelection.add(index);
    } else {
      newSelection.delete(index);
    }
    onSelectionChange(newSelection);
  };

  // Handle select all
  const handleSelectAll = (checked: boolean) => {
    if (!onSelectionChange) return;
    
    if (checked) {
      const allIndexes = new Set(data.map((_, index) => index));
      onSelectionChange(allIndexes);
    } else {
      onSelectionChange(new Set());
    }
  };

  const isAllSelected = selectedRows.size === data.length && data.length > 0;
  const isSomeSelected = selectedRows.size > 0 && selectedRows.size < data.length;

  // Get cell value
  const getCellValue = (row: T, column: DataTableColumn<T>, index: number) => {
    if (column.render) {
      return column.render(row[column.key], row, index);
    }
    return row[column.key];
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className={`data-table ${className}`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                {selectable && <th className="w-12 p-3"><SkeletonLoader width="1rem" height="1rem" /></th>}
                {columns.map((column) => (
                  <th key={column.key} className="p-3 text-left">
                    <SkeletonLoader width="80%" height="1rem" />
                  </th>
                ))}
                {actions.length > 0 && <th className="p-3"><SkeletonLoader width="60%" height="1rem" /></th>}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 5 }).map((_, index) => (
                <tr key={index} className="border-b border-white/5">
                  {selectable && <td className="p-3"><SkeletonLoader width="1rem" height="1rem" /></td>}
                  {columns.map((column) => (
                    <td key={column.key} className="p-3">
                      <SkeletonLoader width="90%" height="1rem" />
                    </td>
                  ))}
                  {actions.length > 0 && (
                    <td className="p-3">
                      <div className="flex gap-2">
                        <SkeletonLoader width="2rem" height="1.5rem" className="rounded" />
                        <SkeletonLoader width="2rem" height="1.5rem" className="rounded" />
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className={`data-table ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full bg-white/5 border border-white/10 rounded-lg overflow-hidden">
          {/* Table Header */}
          <thead className="bg-white/10 border-b border-white/10">
            <tr>
              {/* Selection Header */}
              {selectable && (
                <th className="w-12 p-3">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = isSomeSelected;
                    }}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500"
                  />
                </th>
              )}
              
              {/* Column Headers */}
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`
                    p-3 text-white/90 font-medium
                    ${column.align === 'center' ? 'text-center' : column.align === 'right' ? 'text-right' : 'text-left'}
                    ${column.sortable ? 'cursor-pointer hover:bg-white/5 transition-colors' : ''}
                    ${compact ? 'py-2' : ''}
                  `}
                  style={{ width: column.width }}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center gap-2">
                    <span>{column.label}</span>
                    {column.sortable && (
                      <span className="text-white/60">
                        {internalSort.column === column.key ? (
                          internalSort.direction === 'asc' ? '↑' : '↓'
                        ) : (
                          '↕'
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
              
              {/* Actions Header */}
              {actions.length > 0 && (
                <th className={`p-3 text-center text-white/90 font-medium ${compact ? 'py-2' : ''}`}>
                  Actions
                </th>
              )}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {sortedData.length === 0 ? (
              <tr>
                <td 
                  colSpan={columns.length + (selectable ? 1 : 0) + (actions.length > 0 ? 1 : 0)}
                  className="p-12 text-center text-white/60"
                >
                  <div className="flex flex-col items-center gap-4">
                    {emptyIcon && <div className="text-4xl">{emptyIcon}</div>}
                    <p className="text-lg">{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            ) : (
              sortedData.map((row, index) => (
                <tr
                  key={index}
                  className={`
                    border-b border-white/5 last:border-b-0
                    ${striped && index % 2 === 1 ? 'bg-white/2' : ''}
                    ${hover ? 'hover:bg-white/5 transition-colors' : ''}
                    ${selectedRows.has(index) ? 'bg-blue-500/10' : ''}
                  `}
                >
                  {/* Selection Cell */}
                  {selectable && (
                    <td className={`p-3 ${compact ? 'py-2' : ''}`}>
                      <input
                        type="checkbox"
                        checked={selectedRows.has(index)}
                        onChange={(e) => handleRowSelect(index, e.target.checked)}
                        className="w-4 h-4 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500"
                      />
                    </td>
                  )}
                  
                  {/* Data Cells */}
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={`
                        p-3 text-white/80
                        ${column.align === 'center' ? 'text-center' : column.align === 'right' ? 'text-right' : 'text-left'}
                        ${compact ? 'py-2' : ''}
                        ${column.className || ''}
                      `}
                    >
                      {getCellValue(row, column, index)}
                    </td>
                  ))}
                  
                  {/* Actions Cell */}
                  {actions.length > 0 && (
                    <td className={`p-3 ${compact ? 'py-2' : ''}`}>
                      <div className="flex gap-2 justify-center">
                        {actions.map((action, actionIndex) => {
                          const shouldShow = action.show ? action.show(row) : true;
                          const isDisabled = action.disabled ? action.disabled(row) : false;
                          
                          if (!shouldShow) return null;
                          
                          return (
                            <GlassButton
                              key={actionIndex}
                              onClick={() => action.onClick(row, index)}
                              variant={action.variant || 'secondary'}
                              size={action.size || 'small'}
                              disabled={isDisabled}
                              className="flex items-center gap-1"
                            >
                              {action.icon && action.icon}
                              <span>{action.label}</span>
                            </GlassButton>
                          );
                        })}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="flex items-center justify-between mt-4 p-4 bg-white/5 border border-white/10 rounded-lg">
          <div className="flex items-center gap-2 text-white/70 text-sm">
            <span>Show</span>
            <select
              value={pagination.pageSize}
              onChange={(e) => pagination.onPageSizeChange(Number(e.target.value))}
              className="px-2 py-1 bg-white/10 border border-white/20 rounded text-white focus:outline-none focus:border-blue-500"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span>of {pagination.total} entries</span>
          </div>
          
          <div className="flex items-center gap-2">
            <GlassButton
              onClick={() => pagination.onPageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              variant="secondary"
              size="small"
            >
              Previous
            </GlassButton>
            
            <span className="px-3 py-1 text-white/80 text-sm">
              Page {pagination.page} of {Math.ceil(pagination.total / pagination.pageSize)}
            </span>
            
            <GlassButton
              onClick={() => pagination.onPageChange(pagination.page + 1)}
              disabled={pagination.page >= Math.ceil(pagination.total / pagination.pageSize)}
              variant="secondary"
              size="small"
            >
              Next
            </GlassButton>
          </div>
        </div>
      )}
    </div>
  );
}