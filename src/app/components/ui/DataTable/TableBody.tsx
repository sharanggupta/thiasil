import React from 'react';
import { GlassButton } from '@/app/components/Glassmorphism';
import { DataTableColumn, DataTableAction } from './types';

interface TableBodyProps<T = any> {
  data: T[];
  columns: DataTableColumn<T>[];
  actions?: DataTableAction<T>[];
  selectable?: boolean;
  selectedRows?: Set<number>;
  striped?: boolean;
  hover?: boolean;
  compact?: boolean;
  emptyMessage?: string;
  emptyIcon?: React.ReactNode;
  onRowSelect?: (index: number, checked: boolean) => void;
}

export default function TableBody<T = any>({
  data,
  columns,
  actions = [],
  selectable = false,
  selectedRows = new Set(),
  striped = true,
  hover = true,
  compact = false,
  emptyMessage = 'No data available',
  emptyIcon,
  onRowSelect,
}: TableBodyProps<T>) {
  const handleRowSelectChange = (index: number, checked: boolean) => {
    onRowSelect?.(index, checked);
  };

  const getCellValue = (row: T, column: DataTableColumn<T>, index: number) => {
    if (column.render) {
      return column.render(row[column.key as keyof T], row, index);
    }
    return String(row[column.key as keyof T] || '');
  };

  const getRowActions = (row: T, index: number) => {
    return actions.filter(action => {
      if (action.show && !action.show(row)) return false;
      return true;
    });
  };

  // Empty state
  if (data.length === 0) {
    return (
      <tbody>
        <tr>
          <td 
            colSpan={columns.length + (selectable ? 1 : 0) + (actions.length > 0 ? 1 : 0)}
            className="px-4 py-12 text-center text-white/60"
          >
            <div className="flex flex-col items-center space-y-4">
              {emptyIcon && (
                <div className="text-4xl text-white/40">
                  {emptyIcon}
                </div>
              )}
              <p className="text-lg font-medium">{emptyMessage}</p>
            </div>
          </td>
        </tr>
      </tbody>
    );
  }

  return (
    <tbody className="bg-white/2 divide-y divide-white/10">
      {data.map((row, index) => {
        const isSelected = selectedRows.has(index);
        const rowActions = getRowActions(row, index);
        
        return (
          <tr
            key={index}
            className={`
              ${striped && index % 2 === 0 ? 'bg-white/3' : ''}
              ${hover ? 'hover:bg-white/5' : ''}
              ${isSelected ? 'bg-blue-500/20' : ''}
              ${compact ? 'h-12' : 'h-16'}
              transition-colors duration-150
            `}
          >
            {selectable && (
              <td className="px-4 py-3 w-12">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-white/20 bg-white/10 text-blue-500 focus:ring-blue-500 focus:ring-offset-0"
                    checked={isSelected}
                    onChange={(e) => handleRowSelectChange(index, e.target.checked)}
                  />
                </div>
              </td>
            )}
            
            {columns.map((column) => (
              <td
                key={column.key}
                className={`px-4 py-3 text-sm text-white ${
                  column.align === 'center' ? 'text-center' : 
                  column.align === 'right' ? 'text-right' : 'text-left'
                } ${column.className || ''}`}
                style={{ width: column.width }}
              >
                {getCellValue(row, column, index)}
              </td>
            ))}
            
            {actions.length > 0 && (
              <td className="px-4 py-3 text-right text-sm">
                <div className="flex items-center justify-end space-x-2">
                  {rowActions.map((action, actionIndex) => {
                    const isDisabled = action.disabled ? action.disabled(row) : false;
                    
                    return (
                      <GlassButton
                        key={actionIndex}
                        onClick={() => !isDisabled && action.onClick(row, index)}
                        variant={action.variant || 'secondary'}
                        size={action.size || 'small'}
                        disabled={isDisabled}
                        className="min-w-0"
                      >
                        <div className="flex items-center space-x-1">
                          {action.icon && (
                            <span className="text-sm">{action.icon}</span>
                          )}
                          <span>{action.label}</span>
                        </div>
                      </GlassButton>
                    );
                  })}
                </div>
              </td>
            )}
          </tr>
        );
      })}
    </tbody>
  );
}