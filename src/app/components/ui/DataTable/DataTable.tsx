import React from 'react';
import { DataTableProps } from './types';
import { useDataTable } from './useDataTable';
import TableHeader from './TableHeader';
import TableBody from './TableBody';
import TablePagination from './TablePagination';
import TableSkeleton from './TableSkeleton';

export default function DataTable<T = any>(props: DataTableProps<T>) {
  const {
    columns,
    actions = [],
    loading = false,
    emptyMessage = 'No data available',
    emptyIcon,
    striped = true,
    hover = true,
    compact = false,
    selectable = false,
    pagination,
    className = ''
  } = props;

  const {
    internalSort,
    sortedData,
    selectedRows,
    isAllSelected,
    isIndeterminate,
    handleSort,
    handleRowSelect,
    handleSelectAll,
  } = useDataTable(props);

  const hasActions = actions.length > 0;
  const currentSortBy = props.onSort ? props.sortBy : internalSort.column;
  const currentSortDirection = props.onSort ? props.sortDirection : internalSort.direction;

  // Loading state
  if (loading) {
    return (
      <TableSkeleton
        columns={columns}
        selectable={selectable}
        actions={hasActions}
        className={className}
      />
    );
  }

  return (
    <div className={`data-table ${className}`}>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <TableHeader
            columns={columns}
            selectable={selectable}
            sortBy={currentSortBy}
            sortDirection={currentSortDirection}
            isAllSelected={isAllSelected}
            isIndeterminate={isIndeterminate}
            onSort={handleSort}
            onSelectAll={handleSelectAll}
            actions={hasActions}
          />
          
          <TableBody
            data={sortedData}
            columns={columns}
            actions={actions}
            selectable={selectable}
            selectedRows={selectedRows}
            striped={striped}
            hover={hover}
            compact={compact}
            emptyMessage={emptyMessage}
            emptyIcon={emptyIcon}
            onRowSelect={handleRowSelect}
          />
        </table>
      </div>

      {pagination && (
        <TablePagination
          pagination={pagination}
        />
      )}
    </div>
  );
}