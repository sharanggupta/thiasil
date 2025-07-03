// Stock Status Type Definition
export interface StockStatus {
  value: string;
  label: string;
  color: string;
  bg: string;
}

// Stock Status Configuration
export const STOCK_STATUSES = {
  IN_STOCK: { value: 'in_stock', label: 'In Stock', color: 'text-green-400', bg: 'bg-green-600 border border-white shadow-xs' },
  OUT_OF_STOCK: { value: 'out_of_stock', label: 'Out of Stock', color: 'text-red-400', bg: 'bg-red-600 border border-white shadow-xs' },
  MADE_TO_ORDER: { value: 'made_to_order', label: 'Made to Order', color: 'text-white', bg: 'bg-blue-800 border border-white shadow-sm shadow-blue-900/40' },
  LIMITED_STOCK: { value: 'limited_stock', label: 'Limited Stock', color: 'text-yellow-200', bg: 'bg-yellow-400 border border-white shadow-xs' },
} as const;