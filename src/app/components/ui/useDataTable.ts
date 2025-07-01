import { useState, useMemo, useCallback } from 'react';

export interface UseDataTableOptions<T> {
  data: T[];
  pageSize?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  filterFn?: (item: T, searchTerm: string) => boolean;
}

export function useDataTable<T>({
  data,
  pageSize = 10,
  sortBy = '',
  sortDirection = 'asc',
  filterFn
}: UseDataTableOptions<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(pageSize);
  const [sortConfig, setSortConfig] = useState({
    column: sortBy,
    direction: sortDirection as 'asc' | 'desc'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());

  // Filter data based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm || !filterFn) return data;
    return data.filter(item => filterFn(item, searchTerm));
  }, [data, searchTerm, filterFn]);

  // Sort filtered data
  const sortedData = useMemo(() => {
    if (!sortConfig.column) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.column as keyof T];
      const bValue = b[sortConfig.column as keyof T];

      let comparison = 0;
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        comparison = aValue.localeCompare(bValue);
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        comparison = aValue - bValue;
      } else if (aValue instanceof Date && bValue instanceof Date) {
        comparison = aValue.getTime() - bValue.getTime();
      } else {
        comparison = String(aValue).localeCompare(String(bValue));
      }

      return sortConfig.direction === 'desc' ? -comparison : comparison;
    });
  }, [filteredData, sortConfig]);

  // Paginate sorted data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * currentPageSize;
    const endIndex = startIndex + currentPageSize;
    return sortedData.slice(startIndex, endIndex);
  }, [sortedData, currentPage, currentPageSize]);

  // Handle sorting
  const handleSort = useCallback((column: string, direction: 'asc' | 'desc') => {
    setSortConfig({ column, direction });
    setCurrentPage(1); // Reset to first page when sorting
  }, []);

  // Handle page change
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  // Handle page size change
  const handlePageSizeChange = useCallback((newPageSize: number) => {
    setCurrentPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page
  }, []);

  // Handle search
  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page when searching
  }, []);

  // Handle selection
  const handleSelectionChange = useCallback((newSelection: Set<number>) => {
    setSelectedRows(newSelection);
  }, []);

  // Clear selection
  const clearSelection = useCallback(() => {
    setSelectedRows(new Set());
  }, []);

  // Get selected items
  const getSelectedItems = useCallback(() => {
    return Array.from(selectedRows).map(index => sortedData[index]).filter(Boolean);
  }, [selectedRows, sortedData]);

  // Statistics
  const stats = useMemo(() => ({
    total: data.length,
    filtered: filteredData.length,
    currentPageStart: (currentPage - 1) * currentPageSize + 1,
    currentPageEnd: Math.min(currentPage * currentPageSize, filteredData.length),
    totalPages: Math.ceil(filteredData.length / currentPageSize),
    selectedCount: selectedRows.size,
    hasSelection: selectedRows.size > 0,
    isAllSelected: selectedRows.size === paginatedData.length && paginatedData.length > 0
  }), [data.length, filteredData.length, currentPage, currentPageSize, selectedRows.size, paginatedData.length]);

  return {
    // Data
    data: paginatedData,
    allData: sortedData,
    filteredData,
    
    // Pagination
    pagination: {
      page: currentPage,
      pageSize: currentPageSize,
      total: filteredData.length,
      onPageChange: handlePageChange,
      onPageSizeChange: handlePageSizeChange
    },
    
    // Sorting
    sortBy: sortConfig.column,
    sortDirection: sortConfig.direction,
    onSort: handleSort,
    
    // Search
    searchTerm,
    onSearch: handleSearch,
    
    // Selection
    selectedRows,
    onSelectionChange: handleSelectionChange,
    clearSelection,
    getSelectedItems,
    
    // Statistics
    stats,
    
    // Actions
    refresh: () => {
      setCurrentPage(1);
      setSearchTerm('');
      setSortConfig({ column: sortBy, direction: sortDirection });
      setSelectedRows(new Set());
    }
  };
}