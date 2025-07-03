"use client";
import React from 'react';
import { DataTable } from '@/app/components/ui/DataTable';
import { useDataTable } from '@/app/components/ui/DataTable/useDataTableAdmin';
import type { DataTableColumn, DataTableAction } from '@/app/components/ui/DataTable/types';
import { GlassButton, GlassInput } from "@/app/components/Glassmorphism";
import StockStatusBadge from '@/app/components/common/StockStatusBadge';

interface Product {
  id: string | number;
  name: string;
  category: string;
  price: string;
  stockStatus: string;
  quantity?: number;
  catNo?: string;
  packaging?: string;
  features?: string[];
}

interface ProductsDataTableProps {
  products: Product[];
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
  onView?: (product: Product) => void;
  loading?: boolean;
}

export default function ProductsDataTable({
  products,
  onEdit,
  onDelete,
  onView,
  loading = false
}: ProductsDataTableProps) {
  // Custom filter function for products
  const filterProducts = (product: Product, searchTerm: string): boolean => {
    const term = searchTerm.toLowerCase();
    return (
      product.name.toLowerCase().includes(term) ||
      product.category.toLowerCase().includes(term) ||
      (product.catNo && product.catNo.toLowerCase().includes(term)) ||
      (product.packaging && product.packaging.toLowerCase().includes(term))
    );
  };

  const tableState = useDataTable({
    data: products,
    pageSize: 10,
    sortBy: 'name',
    sortDirection: 'asc',
    filterFn: filterProducts
  });

  // Define table columns
  const columns: DataTableColumn<Product>[] = [
    {
      key: 'name',
      label: 'Product Name',
      sortable: true,
      render: (value, row) => (
        <div>
          <div className="font-medium text-white/90">{value}</div>
          {row.catNo && (
            <div className="text-xs text-white/60">CAT: {row.catNo}</div>
          )}
        </div>
      )
    },
    {
      key: 'category',
      label: 'Category',
      sortable: true,
      render: (value) => (
        <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs">
          {value}
        </span>
      )
    },
    {
      key: 'price',
      label: 'Price',
      sortable: true,
      align: 'right',
      render: (value) => (
        <span className="font-mono font-medium text-green-300">{value}</span>
      )
    },
    {
      key: 'stockStatus',
      label: 'Stock Status',
      sortable: true,
      align: 'center',
      render: (value) => <StockStatusBadge status={value} />
    },
    {
      key: 'quantity',
      label: 'Quantity',
      sortable: true,
      align: 'right',
      render: (value) => (
        <span className="text-white/80">
          {value !== undefined && value !== null ? value : '-'}
        </span>
      )
    },
    {
      key: 'packaging',
      label: 'Packaging',
      sortable: true,
      render: (value) => (
        <span className="text-white/70 text-sm">
          {value || '-'}
        </span>
      )
    }
  ];

  // Define table actions
  const actions: DataTableAction<Product>[] = [
    ...(onView ? [{
      label: 'View',
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2"/>
          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
        </svg>
      ),
      onClick: onView,
      variant: 'secondary' as const
    }] : []),
    ...(onEdit ? [{
      label: 'Edit',
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2"/>
          <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2"/>
        </svg>
      ),
      onClick: onEdit,
      variant: 'primary' as const
    }] : []),
    ...(onDelete ? [{
      label: 'Delete',
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <polyline points="3,6 5,6 21,6" stroke="currentColor" strokeWidth="2"/>
          <path d="m19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="2"/>
        </svg>
      ),
      onClick: onDelete,
      variant: 'danger' as const,
      disabled: (product) => product.stockStatus === 'in_stock' // Example business rule
    }] : [])
  ];

  return (
    <div className="space-y-4">
      {/* Search and Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1 max-w-md">
          <GlassInput
            type="text"
            placeholder="Search products by name, category, or catalog number..."
            value={tableState.searchTerm}
            onChange={(e) => tableState.onSearch(e.target.value)}
            className="w-full"
          />
        </div>
        
        <div className="flex items-center gap-2 text-sm text-white/70">
          <span>
            Showing {tableState.stats.currentPageStart}-{tableState.stats.currentPageEnd} of {tableState.stats.filtered} products
          </span>
          {tableState.stats.total !== tableState.stats.filtered && (
            <span className="text-blue-300">
              (filtered from {tableState.stats.total} total)
            </span>
          )}
        </div>
      </div>

      {/* Selection Summary */}
      {tableState.stats.hasSelection && (
        <div className="flex items-center justify-between p-3 bg-blue-500/10 border border-blue-400/20 rounded-lg">
          <span className="text-blue-300">
            {tableState.stats.selectedCount} product{tableState.stats.selectedCount !== 1 ? 's' : ''} selected
          </span>
          <div className="flex gap-2">
            <GlassButton
              onClick={() => {
                const selectedProducts = tableState.getSelectedItems();
                // Bulk action implementation would go here
              }}
              variant="primary"
              size="small"
            >
              Bulk Edit
            </GlassButton>
            <GlassButton
              onClick={tableState.clearSelection}
              variant="secondary"
              size="small"
            >
              Clear Selection
            </GlassButton>
          </div>
        </div>
      )}

      {/* Data Table */}
      <DataTable
        data={tableState.data}
        columns={columns}
        actions={actions}
        loading={loading}
        selectable={true}
        selectedRows={tableState.selectedRows}
        onSelectionChange={tableState.onSelectionChange}
        sortBy={tableState.sortBy}
        sortDirection={tableState.sortDirection}
        onSort={tableState.onSort}
        pagination={tableState.pagination}
        emptyMessage="No products found"
        emptyIcon={
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
            <line x1="8" y1="21" x2="16" y2="21" stroke="currentColor" strokeWidth="2"/>
            <line x1="12" y1="17" x2="12" y2="21" stroke="currentColor" strokeWidth="2"/>
          </svg>
        }
        striped={true}
        hover={true}
        className="bg-white/5 border border-white/10 rounded-lg"
      />
    </div>
  );
}