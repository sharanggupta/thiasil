// Application Constants
export const APP_CONFIG = {
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes
  DEFAULT_PRICE_CHANGE_PERCENT: 10,
};

// Navigation Configuration
export const NAVIGATION = {
  SIDEBAR_NAV: [
    { icon: "🏠", label: "Home", href: "/" },
    { icon: "🧪", label: "Products", href: "/products" },
    { icon: "🏢", label: "About", href: "/company" },
    { icon: "✉️", label: "Contact", href: "/contact" },
  ],
  FOOTER_LINKS: [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/company" },
    { label: "Products", href: "/products" },
    { label: "Contact", href: "/contact" },
    { label: "Privacy Policy", href: "/policy" },
  ],
};

// Stock Status Configuration
export const STOCK_STATUSES = {
  IN_STOCK: { value: 'in_stock', label: 'In Stock', color: 'text-green-400', bg: 'bg-green-500/20' },
  OUT_OF_STOCK: { value: 'out_of_stock', label: 'Out of Stock', color: 'text-red-400', bg: 'bg-red-500/20' },
  MADE_TO_ORDER: { value: 'made_to_order', label: 'Made to Order', color: 'text-blue-400', bg: 'bg-blue-500/20' },
  LIMITED_STOCK: { value: 'limited_stock', label: 'Limited Stock', color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
};

// Admin Configuration
export const ADMIN_CONFIG = {
  TABS: [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'prices', label: 'Price Management', icon: '💰' },
    { id: 'inventory', label: 'Inventory', icon: '📦' },
    { id: 'add-products', label: 'Add Products', icon: '➕' },
    { id: 'backups', label: 'Backups', icon: '💾' },
    { id: 'coupons', label: 'Coupons', icon: '🎫' }
  ],
  DEFAULT_STOCK_STATUS: 'in_stock',
  DEFAULT_QUANTITY: '',
};

// API Endpoints
export const API_ENDPOINTS = {
  PRODUCTS: '/api/products',
  COUPONS: '/api/coupons',
  ADMIN: {
    UPDATE_PRICES: '/api/admin/update-prices',
    UPDATE_INVENTORY: '/api/admin/update-inventory',
    BACKUP_MANAGEMENT: '/api/admin/backup-management',
    ADD_PRODUCTS: '/api/admin/add-products',
  },
  UPLOAD_IMAGE: '/api/upload-image',
  GENERATE_CATALOG: '/api/generate-catalog',
};

// Form Validation
export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 6,
  MAX_PRODUCT_NAME_LENGTH: 100,
  MAX_DESCRIPTION_LENGTH: 500,
  PRICE_REGEX: /^₹?\d+(\.\d{1,2})?$/,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
};

// UI Configuration
export const UI_CONFIG = {
  ANIMATION_DURATION: 300,
  TRANSITION_DURATION: 500,
  MODAL_ANIMATION_DURATION: 700,
  DEBOUNCE_DELAY: 300,
};

// Error Messages
export const ERROR_MESSAGES = {
  LOGIN_FAILED: 'Invalid username or password',
  SESSION_EXPIRED: 'Session expired. Please login again.',
  ACCOUNT_LOCKED: 'Account is temporarily locked. Please try again later.',
  TOO_MANY_ATTEMPTS: 'Too many failed attempts. Account locked for 15 minutes.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  UPLOAD_ERROR: 'Failed to upload image. Please try again.',
  COUPON_INVALID: 'Invalid coupon code',
  COUPON_EXPIRED: 'Coupon has expired',
  COUPON_MAX_USES: 'Coupon usage limit reached',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful!',
  PRICE_UPDATE_SUCCESS: 'Prices updated successfully',
  INVENTORY_UPDATE_SUCCESS: 'Inventory updated successfully',
  BACKUP_CREATED: 'Backup created successfully',
  BACKUP_RESTORED: 'Backup restored successfully',
  BACKUP_DELETED: 'Backup deleted successfully',
  COUPON_CREATED: 'Coupon created successfully',
  COUPON_DELETED: 'Coupon deleted successfully',
  PRODUCT_ADDED: 'Product added successfully',
  CATEGORY_ADDED: 'Category added successfully',
  IMAGE_UPLOADED: 'Image uploaded successfully',
}; 