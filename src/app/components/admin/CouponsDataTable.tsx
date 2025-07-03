"use client";
import React from 'react';
import { DataTable } from '@/app/components/ui/DataTable';
import { useDataTable } from '@/app/components/ui/DataTable/useDataTableAdmin';
import type { DataTableColumn, DataTableAction } from '@/app/components/ui/DataTable/types';
import { GlassButton, GlassInput } from "@/app/components/Glassmorphism";

interface Coupon {
  id: string;
  code: string;
  discountPercent: number;
  expiryDate: string;
  isActive: boolean;
  usageCount?: number;
  maxUsage?: number;
  description?: string;
}

interface CouponsDataTableProps {
  coupons: Coupon[];
  onEdit?: (coupon: Coupon) => void;
  onDelete?: (coupon: Coupon) => void;
  onToggleStatus?: (coupon: Coupon) => void;
  loading?: boolean;
}

export default function CouponsDataTable({
  coupons,
  onEdit,
  onDelete,
  onToggleStatus,
  loading = false
}: CouponsDataTableProps) {
  // Custom filter function for coupons
  const filterCoupons = (coupon: Coupon, searchTerm: string): boolean => {
    const term = searchTerm.toLowerCase();
    return (
      coupon.code.toLowerCase().includes(term) ||
      (coupon.description && coupon.description.toLowerCase().includes(term))
    );
  };

  const tableState = useDataTable({
    data: coupons,
    pageSize: 15,
    sortBy: 'code',
    sortDirection: 'asc',
    filterFn: filterCoupons
  });

  // Define table columns
  const columns: DataTableColumn<Coupon>[] = [
    {
      key: 'code',
      label: 'Coupon Code',
      sortable: true,
      render: (value, row) => (
        <div>
          <div className="font-mono font-bold text-white/90 text-lg">{value}</div>
          {row.description && (
            <div className="text-xs text-white/60 mt-1">{row.description}</div>
          )}
        </div>
      )
    },
    {
      key: 'discountPercent',
      label: 'Discount',
      sortable: true,
      align: 'center',
      render: (value) => (
        <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full font-bold">
          {value}%
        </span>
      )
    },
    {
      key: 'expiryDate',
      label: 'Expiry Date',
      sortable: true,
      render: (value) => {
        const date = new Date(value);
        const isExpired = date < new Date();
        return (
          <div className={`text-sm ${isExpired ? 'text-red-300' : 'text-white/80'}`}>
            <div>{date.toLocaleDateString()}</div>
            <div className="text-xs opacity-70">{date.toLocaleTimeString()}</div>
            {isExpired && (
              <div className="text-xs text-red-400 font-medium mt-1">Expired</div>
            )}
          </div>
        );
      }
    },
    {
      key: 'isActive',
      label: 'Status',
      sortable: true,
      align: 'center',
      render: (value, row) => {
        const isExpired = new Date(row.expiryDate) < new Date();
        const effectiveStatus = value && !isExpired;
        
        return (
          <span className={`
            px-2 py-1 rounded-full text-xs font-medium
            ${effectiveStatus 
              ? 'bg-green-500/20 text-green-300' 
              : 'bg-red-500/20 text-red-300'
            }
          `}>
            {effectiveStatus ? 'Active' : (isExpired ? 'Expired' : 'Inactive')}
          </span>
        );
      }
    },
    {
      key: 'usageCount',
      label: 'Usage',
      sortable: true,
      align: 'center',
      render: (value, row) => (
        <div className="text-sm text-white/80">
          <div>{value || 0} used</div>
          {row.maxUsage && (
            <div className="text-xs text-white/60">
              of {row.maxUsage} max
            </div>
          )}
        </div>
      )
    }
  ];

  // Define table actions
  const actions: DataTableAction<Coupon>[] = [
    ...(onToggleStatus ? [{
      label: 'Toggle',
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
          <polyline points="8,12 12,16 16,8" stroke="currentColor" strokeWidth="2"/>
        </svg>
      ),
      onClick: onToggleStatus,
      variant: 'accent' as const,
      disabled: (coupon) => new Date(coupon.expiryDate) < new Date() // Can't activate expired coupons
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
      disabled: (coupon) => coupon.isActive && (coupon.usageCount || 0) > 0 // Can't delete active used coupons
    }] : [])
  ];

  return (
    <div className="space-y-4">
      {/* Search and Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1 max-w-md">
          <GlassInput
            type="text"
            placeholder="Search coupons by code or description..."
            value={tableState.searchTerm}
            onChange={(e) => tableState.onSearch(e.target.value)}
            className="w-full"
          />
        </div>
        
        <div className="flex items-center gap-4 text-sm text-white/70">
          <div className="flex gap-4">
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Active: {coupons.filter(c => c.isActive && new Date(c.expiryDate) >= new Date()).length}
            </span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              Expired: {coupons.filter(c => new Date(c.expiryDate) < new Date()).length}
            </span>
          </div>
          
          <span>
            Showing {tableState.stats.currentPageStart}-{tableState.stats.currentPageEnd} of {tableState.stats.filtered} coupons
          </span>
        </div>
      </div>

      {/* Selection Summary */}
      {tableState.stats.hasSelection && (
        <div className="flex items-center justify-between p-3 bg-purple-500/10 border border-purple-400/20 rounded-lg">
          <span className="text-purple-300">
            {tableState.stats.selectedCount} coupon{tableState.stats.selectedCount !== 1 ? 's' : ''} selected
          </span>
          <div className="flex gap-2">
            <GlassButton
              onClick={() => {
                const selectedCoupons = tableState.getSelectedItems();
                selectedCoupons.forEach(coupon => onToggleStatus && onToggleStatus(coupon));
                tableState.clearSelection();
              }}
              variant="accent"
              size="small"
              disabled={!onToggleStatus}
            >
              Bulk Toggle Status
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
        emptyMessage="No coupons found"
        emptyIcon={
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="currentColor" strokeWidth="2"/>
          </svg>
        }
        striped={true}
        hover={true}
        compact={false}
        className="bg-white/5 border border-white/10 rounded-lg"
      />
    </div>
  );
}