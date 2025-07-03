import React from 'react';
import SkeletonLoader from '../SkeletonLoader';
import { DataTableColumn } from './types';

interface TableSkeletonProps<T = any> {
  columns: DataTableColumn<T>[];
  rows?: number;
  selectable?: boolean;
  actions?: boolean;
  className?: string;
}

export default function TableSkeleton<T = any>({ 
  columns, 
  rows = 5, 
  selectable = false, 
  actions = false,
  className = ''
}: TableSkeletonProps<T>) {
  return (
    <div className={`data-table ${className}`}>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          {/* Header skeleton */}
          <thead className="bg-white/5 backdrop-blur-sm">
            <tr>
              {selectable && (
                <th className="px-4 py-3 w-12">
                  <SkeletonLoader className="w-4 h-4 rounded" />
                </th>
              )}
              
              {columns.map((column, index) => (
                <th 
                  key={index}
                  className="px-4 py-3"
                  style={{ width: column.width }}
                >
                  <SkeletonLoader className="h-4 w-20" />
                </th>
              ))}
              
              {actions && (
                <th className="px-4 py-3 w-32">
                  <SkeletonLoader className="h-4 w-16 ml-auto" />
                </th>
              )}
            </tr>
          </thead>

          {/* Body skeleton */}
          <tbody className="bg-white/2 divide-y divide-white/10">
            {Array.from({ length: rows }, (_, rowIndex) => (
              <tr key={rowIndex} className="h-16">
                {selectable && (
                  <td className="px-4 py-3 w-12">
                    <SkeletonLoader className="w-4 h-4 rounded" />
                  </td>
                )}
                
                {columns.map((column, colIndex) => (
                  <td 
                    key={colIndex}
                    className="px-4 py-3"
                    style={{ width: column.width }}
                  >
                    <SkeletonLoader 
                      className={`h-4 ${
                        colIndex % 3 === 0 ? 'w-24' : 
                        colIndex % 3 === 1 ? 'w-32' : 'w-20'
                      }`}
                    />
                  </td>
                ))}
                
                {actions && (
                  <td className="px-4 py-3 w-32">
                    <div className="flex items-center justify-end space-x-2">
                      <SkeletonLoader className="w-16 h-6 rounded" />
                      <SkeletonLoader className="w-16 h-6 rounded" />
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination skeleton */}
      <div className="flex items-center justify-between p-4 bg-white/5 backdrop-blur-sm">
        <SkeletonLoader className="h-4 w-40" />
        <div className="flex items-center space-x-2">
          <SkeletonLoader className="h-8 w-20 rounded" />
          <SkeletonLoader className="h-8 w-8 rounded" />
          <SkeletonLoader className="h-8 w-8 rounded" />
          <SkeletonLoader className="h-8 w-8 rounded" />
          <SkeletonLoader className="h-8 w-20 rounded" />
        </div>
      </div>
    </div>
  );
}