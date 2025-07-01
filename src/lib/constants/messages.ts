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
} as const;

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
} as const;