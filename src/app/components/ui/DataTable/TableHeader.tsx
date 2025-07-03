import React from 'react';
import { DataTableColumn } from './types';

interface TableHeaderProps<T = any> {
  columns: DataTableColumn<T>[];
  selectable?: boolean;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  isAllSelected?: boolean;
  isIndeterminate?: boolean;
  onSort?: (column: string) => void;
  onSelectAll?: (checked: boolean) => void;
  actions?: boolean;
}

export default function TableHeader<T = any>({
  columns,
  selectable = false,
  sortBy,
  sortDirection = 'asc',
  isAllSelected = false,
  isIndeterminate = false,
  onSort,
  onSelectAll,
  actions = false,
}: TableHeaderProps<T>) {
  const handleSelectAllChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSelectAll?.(e.target.checked);
  };

  const handleSortClick = (column: DataTableColumn<T>) => {
    if (column.sortable && onSort) {
      onSort(column.key);
    }
  };

  const getSortIcon = (column: DataTableColumn<T>) => {
    if (!column.sortable) return null;
    
    if (sortBy === column.key) {
      return sortDirection === 'asc' ? '↑' : '↓';
    }
    return '↕';
  };

  return (
    <thead className="bg-white/5 backdrop-blur-sm">
      <tr>
        {selectable && (
          <th className="px-4 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider w-12">
            <div className="flex items-center">
              <input
                type="checkbox"
                className="rounded border-white/20 bg-white/10 text-blue-500 focus:ring-blue-500 focus:ring-offset-0"
                checked={isAllSelected}
                ref={(input) => {
                  if (input) input.indeterminate = isIndeterminate;
                }}
                onChange={handleSelectAllChange}
              />
            </div>
          </th>
        )}
        
        {columns.map((column) => (
          <th
            key={column.key}
            className={`px-4 py-3 text-xs font-medium text-white/80 uppercase tracking-wider ${
              column.align === 'center' ? 'text-center' : 
              column.align === 'right' ? 'text-right' : 'text-left'
            } ${column.sortable ? 'cursor-pointer hover:text-white' : ''} ${
              column.className || ''
            }`}
            style={{ width: column.width }}
            onClick={() => handleSortClick(column)}
          >
            <div className={`flex items-center ${
              column.align === 'center' ? 'justify-center' : 
              column.align === 'right' ? 'justify-end' : 'justify-start'
            }`}>
              <span>{column.label}</span>
              {column.sortable && (
                <span className="ml-1 text-white/60">{getSortIcon(column)}</span>
              )}
            </div>
          </th>
        ))}
        
        {actions && (
          <th className="px-4 py-3 text-right text-xs font-medium text-white/80 uppercase tracking-wider">
            Actions
          </th>
        )}
      </tr>
    </thead>
  );
}