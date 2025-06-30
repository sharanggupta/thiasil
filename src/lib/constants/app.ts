// Application Configuration Constants
export const APP_CONFIG = {
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes
  DEFAULT_PRICE_CHANGE_PERCENT: 10,
} as const;

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
} as const;

// UI Configuration
export const UI_CONFIG = {
  ANIMATION_DURATION: 300,
  TRANSITION_DURATION: 500,
  MODAL_ANIMATION_DURATION: 700,
  DEBOUNCE_DELAY: 300,
} as const;