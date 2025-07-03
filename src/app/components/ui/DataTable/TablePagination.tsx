import React from 'react';
import { GlassButton } from '@/app/components/Glassmorphism';
import { DataTablePagination } from './types';

interface TablePaginationProps {
  pagination: DataTablePagination;
  className?: string;
}

export default function TablePagination({ pagination, className = '' }: TablePaginationProps) {
  const { page, pageSize, total, onPageChange, onPageSizeChange } = pagination;
  
  const totalPages = Math.ceil(total / pageSize);
  const startItem = (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, total);
  
  const pageSizeOptions = [10, 25, 50, 100];
  
  const getVisiblePages = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 7;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      
      if (page > 4) {
        pages.push('...');
      }
      
      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (page < totalPages - 3) {
        pages.push('...');
      }
      
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPageSize = parseInt(e.target.value);
    onPageSizeChange(newPageSize);
    
    // Adjust current page if necessary
    const newTotalPages = Math.ceil(total / newPageSize);
    if (page > newTotalPages) {
      onPageChange(newTotalPages);
    }
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className={`flex items-center justify-between p-4 bg-white/5 backdrop-blur-sm ${className}`}>
      {/* Results info */}
      <div className="flex items-center text-sm text-white/70">
        <span>
          Showing {startItem} to {endItem} of {total} results
        </span>
        
        {/* Page size selector */}
        <div className="ml-6 flex items-center space-x-2">
          <label htmlFor="pageSize" className="text-sm">
            Show:
          </label>
          <select
            id="pageSize"
            value={pageSize}
            onChange={handlePageSizeChange}
            className="bg-white/10 border border-white/20 rounded px-2 py-1 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size} className="bg-gray-800">
                {size}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Pagination controls */}
      <div className="flex items-center space-x-1">
        {/* Previous button */}
        <GlassButton
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          size="small"
          variant="secondary"
          className="px-3 py-1"
        >
          Previous
        </GlassButton>

        {/* Page numbers */}
        <div className="flex items-center space-x-1 mx-2">
          {getVisiblePages().map((pageNum, index) => {
            if (pageNum === '...') {
              return (
                <span key={index} className="px-2 py-1 text-white/50">
                  ...
                </span>
              );
            }

            const pageNumber = pageNum as number;
            const isActive = pageNumber === page;

            return (
              <button
                key={pageNumber}
                onClick={() => onPageChange(pageNumber)}
                className={`
                  px-3 py-1 text-sm rounded transition-colors duration-150
                  ${isActive 
                    ? 'bg-blue-500 text-white font-medium' 
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                  }
                `}
              >
                {pageNumber}
              </button>
            );
          })}
        </div>

        {/* Next button */}
        <GlassButton
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          size="small"
          variant="secondary"
          className="px-3 py-1"
        >
          Next
        </GlassButton>
      </div>
    </div>
  );
}