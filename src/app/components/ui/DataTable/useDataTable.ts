import { useState, useMemo } from 'react';
import { DataTableProps, DataTableState } from './types';

export function useDataTable<T = any>(props: DataTableProps<T>) {
  const {
    data,
    sortBy,
    sortDirection = 'asc',
    onSort,
    selectedRows = new Set(),
    onSelectionChange,
  } = props;

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
      if (aValue > bValue) comparison = 1;
      if (aValue < bValue) comparison = -1;
      
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

  // Selection state helpers
  const isAllSelected = data.length > 0 && selectedRows.size === data.length;
  const isIndeterminate = selectedRows.size > 0 && selectedRows.size < data.length;

  return {
    internalSort,
    sortedData,
    selectedRows,
    isAllSelected,
    isIndeterminate,
    handleSort,
    handleRowSelect,
    handleSelectAll,
  };
}