// Re-export all constants from separate files for backward compatibility
export { APP_CONFIG, API_ENDPOINTS, UI_CONFIG } from './constants/app';
export { ERROR_MESSAGES, SUCCESS_MESSAGES } from './constants/messages';
export { VALIDATION } from './constants/validation';
export { STOCK_STATUSES } from './constants/stock';
export { ADMIN_CONFIG } from './constants/admin';
export { NAVIGATION } from './constants/navigation';
export { GRADIENTS } from './constants/gradients';

// Re-export types
export type { StockStatus } from './constants/stock';
export type { AdminTab } from './constants/admin';
export type { NavigationItem } from './constants/navigation';