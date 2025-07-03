import { STOCK_STATUSES, VALIDATION } from './constants';

// Type definitions
export interface StockStatusConfig {
  label: string;
  color: string;
  bg: string;
}

export interface StockStatusDisplay {
  label: string;
  className: string;
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export interface SessionData {
  timestamp: number;
  username: string;
  password: string;
}

export interface ProductVariant {
  price: string | number;
  [key: string]: any;
}

export interface ProductsData {
  products: Array<{
    categorySlug: string;
    priceRange: string;
    [key: string]: any;
  }>;
  productVariants?: {
    [categorySlug: string]: {
      variants: ProductVariant[];
    };
  };
}

export interface ProductFilters {
  category?: string;
  stockStatus?: string;
  packaging?: string;
  minPrice?: string;
  maxPrice?: string;
}

/**
 * Utility functions for common operations
 */

// Deprecated sanitizeInput function removed - use input-sanitization.ts instead

/**
 * Extracts numeric price value from a price string
 * @param {string|number} priceString - Price string like '₹343.00' or '₹343.00 - ₹686.00'
 * @returns {number} Extracted price value or 0 if invalid
 */
export const extractPriceFromString = (priceString: string | number): number => {
  if (!priceString) return 0;
  
  if (typeof priceString === 'number') return priceString;
  
  // Handle price range string like '₹343.00 - ₹686.00'
  const match = priceString.match(/₹([\d,.]+)/);
  return match ? parseFloat(match[1].replace(/,/g, '')) : 0;
};

/**
 * Formats a numeric price value to currency string
 * @param {number|string} price - Price value to format
 * @returns {string} Formatted price string like '₹123.45'
 */
export const formatPrice = (price: number | string): string => {
  if (!price) return '₹0.00';
  
  const numPrice = typeof price === 'string' ? extractPriceFromString(price) : price;
  return `₹${numPrice.toFixed(2)}`;
};

/**
 * Applies a percentage discount to a price
 * @param {string|number} price - Original price
 * @param {number} discountPercent - Discount percentage (e.g., 10 for 10%)
 * @returns {string} Discounted price as formatted string
 */
export const applyDiscountToPrice = (price: string | number, discountPercent: number): string => {
  if (!price || !discountPercent) return typeof price === 'string' ? price : formatPrice(price);
  
  const numPrice = extractPriceFromString(price);
  const discountedPrice = numPrice * (1 - discountPercent / 100);
  return formatPrice(discountedPrice);
};

/**
 * Applies a percentage discount to a price range string
 * @param {string} priceRange - Price range like '₹100.00 - ₹200.00'
 * @param {number} discountPercent - Discount percentage (e.g., 10 for 10%)
 * @returns {string} Discounted price range string
 */
export const applyDiscountToPriceRange = (priceRange: string, discountPercent: number): string => {
  if (!priceRange || !discountPercent) return priceRange;
  
  // Extract numbers from price range (e.g., "₹294.00 - ₹0.98" -> [294.00, 0.98])
  const numbers = priceRange.match(/₹(\d+\.?\d*)/g);
  if (!numbers || numbers.length === 0) return priceRange;
  
  const discountedPrices = numbers.map(price => {
    const numPrice = parseFloat(price.replace('₹', ''));
    const discountedPrice = numPrice * (1 - discountPercent / 100);
    return `₹${discountedPrice.toFixed(2)}`;
  });
  
  return discountedPrices.join(' - ');
};

/**
 * Extracts the base catalog number from a catalog string
 * @param {string} catNo - Catalog number like '1100 Series' or '1100/50'
 * @returns {string} Base catalog number like '1100'
 */
export const getBaseCatalogNumber = (catNo: string): string => {
  if (!catNo) return '';
  // Handle both "1100 Series" and "1100/50" formats
  return catNo.split(/[\s\/]/)[0];
};

/**
 * Gets the configuration object for a stock status
 * @param {string} status - Stock status ('in_stock', 'out_of_stock', etc.)
 * @returns {Object} Stock status configuration with label, color, and bg properties
 */
export const getStockStatusConfig = (status: string): StockStatusConfig => {
  const statusMap = {
    'in_stock': STOCK_STATUSES.IN_STOCK,
    'out_of_stock': STOCK_STATUSES.OUT_OF_STOCK,
    'made_to_order': STOCK_STATUSES.MADE_TO_ORDER,
    'limited_stock': STOCK_STATUSES.LIMITED_STOCK,
  };
  
  return statusMap[status] || STOCK_STATUSES.IN_STOCK;
};

/**
 * Gets display properties for a stock status
 * @param {string} status - Stock status ('in_stock', 'out_of_stock', etc.)
 * @returns {Object} Display object with label and className properties
 */
export const getStockStatusDisplay = (status: string): StockStatusDisplay => {
  const config = getStockStatusConfig(status);
  return {
    label: config.label,
    className: `${config.bg} ${config.color}`,
  };
};

/**
 * Validates an email address format
 * @param {string} email - Email address to validate
 * @returns {boolean} True if email format is valid
 */
export const validateEmail = (email: string): boolean => {
  return VALIDATION.EMAIL_REGEX.test(email);
};

/**
 * Validates a price string format
 * @param {string} price - Price string to validate
 * @returns {boolean} True if price format is valid
 */
export const validatePrice = (price: string): boolean => {
  return VALIDATION.PRICE_REGEX.test(price);
};

/**
 * Validates that a value is required (not empty)
 * @param {string} value - Value to validate
 * @returns {boolean} True if value is not empty
 */
export const validateRequired = (value: string): boolean => {
  return Boolean(value && value.trim().length > 0);
};

/**
 * Validates that a value does not exceed maximum length
 * @param {string} value - Value to validate
 * @param {number} maxLength - Maximum allowed length
 * @returns {boolean} True if value is within length limit
 */
export const validateLength = (value: string, maxLength: number): boolean => {
  return Boolean(value && value.length <= maxLength);
};

/**
 * Gets unique values from an array of objects by a specific key
 * @param {Array<Object>} array - Array of objects
 * @param {string} key - Key to extract unique values from
 * @returns {Array} Array of unique values
 */
export const getUniqueValues = <T>(array: T[], key: keyof T): any[] => {
  return [...new Set(array.map(item => item[key]).filter(Boolean))];
};

/**
 * Groups an array of objects by a specific key
 * @param {Array<Object>} array - Array of objects to group
 * @param {string} key - Key to group by
 * @returns {Object} Object with grouped items
 */
export const groupBy = <T>(array: T[], key: keyof T): Record<string, T[]> => {
  return array.reduce((groups, item) => {
    const group = String(item[key]);
    if (!groups[group]) {
      groups[group] = [];
    }
    groups[group].push(item);
    return groups;
  }, {} as Record<string, T[]>);
};

/**
 * Formats a date into a readable string
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date string
 */
export const formatDate = (date: Date | string): string => {
  if (!date) return '';
  
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Checks if a date has expired (is in the past)
 * @param {Date|string} date - Date to check
 * @returns {boolean} True if date is expired
 */
export const isExpired = (date: Date | string): boolean => {
  if (!date) return false;
  return new Date(date) < new Date();
};

/**
 * Formats file size in bytes to human readable format
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size like '1.5 MB'
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Validates an image file for type and size constraints
 * @param {File} file - File object to validate
 * @returns {Object} Validation result with valid boolean and error message
 */
export const validateImageFile = (file: File): ValidationResult => {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB
  
  if (!validTypes.includes(file.type)) {
    return { valid: false, error: 'Invalid file type. Please upload a JPEG, PNG, or WebP image.' };
  }
  
  if (file.size > maxSize) {
    return { valid: false, error: 'File size too large. Please upload an image smaller than 5MB.' };
  }
  
  return { valid: true };
};

/**
 * Saves user session data to localStorage
 * @param {string} username - Username to save
 * @param {string} password - Password to save
 */
export const saveSession = (username: string, password: string): void => {
  const session = {
    timestamp: Date.now(),
    username,
    password,
  };
  localStorage.setItem('adminSession', JSON.stringify(session));
};

/**
 * Clears user session data from localStorage
 */
export const clearSession = (): void => {
  localStorage.removeItem('adminSession');
};

/**
 * Checks if a session is still valid (not expired)
 * @param {Object} session - Session object with timestamp
 * @returns {boolean} True if session is valid
 */
export const isSessionValid = (session: SessionData | null): boolean => {
  if (!session) return false;
  
  const { timestamp } = session;
  const now = Date.now();
  const timeout = 30 * 60 * 1000; // 30 minutes
  
  return now - timestamp < timeout;
};

/**
 * Creates a debounced function that delays execution
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = <T extends (...args: any[]) => any>(func: T, delay: number): (...args: Parameters<T>) => void => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

// Constants for error handling
const ERROR_MESSAGES = {
  NETWORK: 'Network error. Please check your connection.',
  DEFAULT: 'An unexpected error occurred.',
} as const;

// Helper functions for error classification
function isNetworkError(error: Error): boolean {
  return error.name === 'TypeError' && error.message.includes('fetch');
}

function getErrorMessage(error: Error): string {
  if (isNetworkError(error)) {
    return ERROR_MESSAGES.NETWORK;
  }
  
  return error.message || ERROR_MESSAGES.DEFAULT;
}

/**
 * Handles API errors and returns user-friendly messages
 * @param error - Error object from API call
 * @returns User-friendly error message
 */
export const handleApiError = (error: Error): string => {
  console.error('API Error:', error);
  return getErrorMessage(error);
};

/**
 * Filters products based on various criteria
 * @param {Array<Object>} products - Array of product objects
 * @param {Object} filters - Filter criteria object
 * @returns {Array<Object>} Filtered products array
 */
export const filterProducts = (products: any[], filters: ProductFilters): any[] => {
  return products.filter((product) => {
    // Category filter
    if (filters.category && product.category !== filters.category) return false;
    
    // Stock status filter
    if (filters.stockStatus && product.stockStatus !== filters.stockStatus) return false;
    
    // Packaging filter
    if (filters.packaging && product.packaging !== filters.packaging) return false;
    
    // Price range filter
    const price = extractPriceFromString(product.price);
    if (filters.minPrice && price < parseFloat(filters.minPrice)) return false;
    if (filters.maxPrice && price > parseFloat(filters.maxPrice)) return false;
    
    return true;
  });
};

/**
 * Searches products by name, category, or catalog number
 * @param {Array<Object>} products - Array of product objects
 * @param {string} searchTerm - Search term to match
 * @returns {Array<Object>} Filtered products array
 */
export const searchProducts = (products: any[], searchTerm: string): any[] => {
  if (!searchTerm) return products;
  
  const term = searchTerm.toLowerCase();
  return products.filter(product => 
    product.name.toLowerCase().includes(term) ||
    product.category.toLowerCase().includes(term) ||
    (product.catalogNo && product.catalogNo.toLowerCase().includes(term))
  );
};

/**
 * Calculates price range from an array of product variants
 * @param {Array<Object>} variants - Array of variant objects with price property
 * @returns {string} Formatted price range string
 */
// Constants for price calculations
const PRICE_CONSTANTS = {
  DEFAULT_RANGE: '₹0.00 - ₹0.00',
  MINIMUM_VALID_PRICE: 0,
} as const;

// Helper functions for price range calculation
function hasValidVariants(variants: ProductVariant[]): boolean {
  return variants && variants.length > 0;
}

function extractValidPrices(variants: ProductVariant[]): number[] {
  return variants
    .map(variant => extractPriceFromString(variant.price))
    .filter(price => price > PRICE_CONSTANTS.MINIMUM_VALID_PRICE);
}

function hasValidPrices(prices: number[]): boolean {
  return prices.length > 0;
}

function calculateMinMaxPrices(prices: number[]): { min: number; max: number } {
  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
  };
}

function formatPriceRange(minPrice: number, maxPrice: number): string {
  if (minPrice === maxPrice) {
    return formatPrice(minPrice);
  }
  return `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`;
}

export const calculatePriceRange = (variants: ProductVariant[]): string => {
  if (!hasValidVariants(variants)) {
    return PRICE_CONSTANTS.DEFAULT_RANGE;
  }

  const validPrices = extractValidPrices(variants);
  
  if (!hasValidPrices(validPrices)) {
    return PRICE_CONSTANTS.DEFAULT_RANGE;
  }

  const { min, max } = calculateMinMaxPrices(validPrices);
  return formatPriceRange(min, max);
};

/**
 * Updates the price range for a category based on its variants
 * @param {Object} productsData - Products data object containing products and variants
 * @param {string} categorySlug - Category slug to update
 */
export const updateCategoryPriceRange = (productsData: ProductsData, categorySlug: string): void => {
  const categoryVariants = productsData.productVariants?.[categorySlug]?.variants;
  if (!categoryVariants) return;

  // Calculate new price range
  const newPriceRange = calculatePriceRange(categoryVariants);

  // Find and update the main product entry
  const mainProductIndex = productsData.products.findIndex(
    product => product.categorySlug === categorySlug
  );

  if (mainProductIndex !== -1) {
    productsData.products[mainProductIndex].priceRange = newPriceRange;
  }
}; 