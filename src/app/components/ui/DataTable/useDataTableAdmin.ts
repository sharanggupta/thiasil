"use client";
import { useState, useMemo } from 'react';

// Comprehensive useDataTable hook for admin components
interface UseDataTableOptions<T> {
  data: T[];
  pageSize?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  filterFn?: (item: T, searchTerm: string) => boolean;
}

interface DataTablePagination {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

interface DataTableStats {
  total: number;
  filtered: number;
  currentPageStart: number;
  currentPageEnd: number;
  totalPages: number;
  selectedCount: number;
  hasSelection: boolean;
  isAllSelected: boolean;
}

export function useDataTable<T = any>(options: UseDataTableOptions<T>) {
  const {
    data: allData = [],
    pageSize: initialPageSize = 10,
    sortBy: initialSortBy = '',
    sortDirection: initialSortDirection = 'asc',
    filterFn
  } = options;

  // State management
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [sortBy, setSortBy] = useState(initialSortBy);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(initialSortDirection);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());

  // Filter data based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm || !filterFn) return allData;
    return allData.filter(item => filterFn(item, searchTerm));
  }, [allData, searchTerm, filterFn]);

  // Sort filtered data
  const sortedData = useMemo(() => {
    if (!sortBy) return filteredData;
    
    return [...filteredData].sort((a, b) => {
      const aValue = (a as any)[sortBy];
      const bValue = (b as any)[sortBy];
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortBy, sortDirection]);

  // Paginate sorted data
  const data = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return sortedData.slice(startIndex, endIndex);
  }, [sortedData, page, pageSize]);

  // Calculate statistics
  const stats: DataTableStats = useMemo(() => {
    const total = allData.length;
    const filtered = filteredData.length;
    const totalPages = Math.ceil(filtered / pageSize);
    const currentPageStart = filtered === 0 ? 0 : (page - 1) * pageSize + 1;
    const currentPageEnd = Math.min(page * pageSize, filtered);
    const selectedCount = selectedRows.size;
    const hasSelection = selectedCount > 0;
    const isAllSelected = selectedCount === data.length && data.length > 0;

    return {
      total,
      filtered,
      currentPageStart,
      currentPageEnd,
      totalPages,
      selectedCount,
      hasSelection,
      isAllSelected
    };
  }, [allData.length, filteredData.length, page, pageSize, selectedRows.size, data.length]);

  // Pagination object
  const pagination: DataTablePagination = {
    page,
    pageSize,
    total: filteredData.length,
    onPageChange: (newPage: number) => {
      setPage(Math.max(1, Math.min(newPage, stats.totalPages)));
    },
    onPageSizeChange: (newPageSize: number) => {
      setPageSize(newPageSize);
      setPage(1); // Reset to first page when page size changes
    }
  };

  // Event handlers
  const onSort = (column: string, direction: 'asc' | 'desc') => {
    setSortBy(column);
    setSortDirection(direction);
  };

  const onSearch = (term: string) => {
    setSearchTerm(term);
    setPage(1); // Reset to first page when searching
    setSelectedRows(new Set()); // Clear selection when searching
  };

  const onSelectionChange = (selection: Set<number>) => {
    setSelectedRows(selection);
  };

  const clearSelection = () => {
    setSelectedRows(new Set());
  };

  const getSelectedItems = (): T[] => {
    return Array.from(selectedRows).map(index => data[index]).filter(Boolean);
  };

  const refresh = () => {
    setPage(1);
    setSearchTerm('');
    setSelectedRows(new Set());
  };

  return {
    // Data
    data,
    allData,
    filteredData,
    
    // Pagination
    pagination,
    
    // Sorting
    sortBy,
    sortDirection,
    onSort,
    
    // Search
    searchTerm,
    onSearch,
    
    // Selection
    selectedRows,
    onSelectionChange,
    clearSelection,
    getSelectedItems,
    
    // Statistics
    stats,
    
    // Actions
    refresh
  };
}