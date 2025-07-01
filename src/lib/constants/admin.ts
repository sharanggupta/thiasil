// Admin Tab Type Definition
export interface AdminTab {
  id: string;
  label: string;
  icon: string;
}

// Admin Configuration
export const ADMIN_CONFIG = {
  TABS: [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'prices', label: 'Price Management', icon: '💰' },
    { id: 'inventory', label: 'Inventory', icon: '📦' },
    { id: 'add-products', label: 'Add Products', icon: '➕' },
    { id: 'backups', label: 'Backups', icon: '💾' },
    { id: 'coupons', label: 'Coupons', icon: '🎫' }
  ] as AdminTab[],
  DEFAULT_STOCK_STATUS: 'in_stock',
  DEFAULT_QUANTITY: '',
} as const;