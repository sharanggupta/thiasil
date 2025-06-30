import { STOCK_STATUSES, VALIDATION } from './constants';

/**
 * Utility functions for common operations
 */

/**
 * Sanitizes user input by removing potentially dangerous characters
 * @param {string|any} input - The input to sanitize
 * @returns {string|any} Sanitized input string or original value if not string
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input.replace(/[<>]/g, '').trim();
};

/**
 * Extracts numeric price value from a price string
 * @param {string|number} priceString - Price string like '₹343.00' or '₹343.00 - ₹686.00'
 * @returns {number} Extracted price value or 0 if invalid
 */
export const extractPriceFromString = (priceString) => {
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
export const formatPrice = (price) => {
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
export const applyDiscountToPrice = (price, discountPercent) => {
  if (!price || !discountPercent) return price;
  
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
export const applyDiscountToPriceRange = (priceRange, discountPercent) => {
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
export const getBaseCatalogNumber = (catNo) => {
  if (!catNo) return '';
  // Handle both "1100 Series" and "1100/50" formats
  return catNo.split(/[\s\/]/)[0];
};

/**
 * Gets the configuration object for a stock status
 * @param {string} status - Stock status ('in_stock', 'out_of_stock', etc.)
 * @returns {Object} Stock status configuration with label, color, and bg properties
 */
export const getStockStatusConfig = (status) => {
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
export const getStockStatusDisplay = (status) => {
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
export const validateEmail = (email) => {
  return VALIDATION.EMAIL_REGEX.test(email);
};

/**
 * Validates a price string format
 * @param {string} price - Price string to validate
 * @returns {boolean} True if price format is valid
 */
export const validatePrice = (price) => {
  return VALIDATION.PRICE_REGEX.test(price);
};

/**
 * Validates that a value is required (not empty)
 * @param {string} value - Value to validate
 * @returns {boolean} True if value is not empty
 */
export const validateRequired = (value) => {
  return value && value.trim().length > 0;
};

/**
 * Validates that a value does not exceed maximum length
 * @param {string} value - Value to validate
 * @param {number} maxLength - Maximum allowed length
 * @returns {boolean} True if value is within length limit
 */
export const validateLength = (value, maxLength) => {
  return value && value.length <= maxLength;
};

/**
 * Gets unique values from an array of objects by a specific key
 * @param {Array<Object>} array - Array of objects
 * @param {string} key - Key to extract unique values from
 * @returns {Array} Array of unique values
 */
export const getUniqueValues = (array, key) => {
  return [...new Set(array.map(item => item[key]).filter(Boolean))];
};

/**
 * Groups an array of objects by a specific key
 * @param {Array<Object>} array - Array of objects to group
 * @param {string} key - Key to group by
 * @returns {Object} Object with grouped items
 */
export const groupBy = (array, key) => {
  return array.reduce((groups, item) => {
    const group = item[key];
    if (!groups[group]) {
      groups[group] = [];
    }
    groups[group].push(item);
    return groups;
  }, {});
};

/**
 * Formats a date into a readable string
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date string
 */
export const formatDate = (date) => {
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
export const isExpired = (date) => {
  if (!date) return false;
  return new Date(date) < new Date();
};

/**
 * Formats file size in bytes to human readable format
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size like '1.5 MB'
 */
export const formatFileSize = (bytes) => {
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
export const validateImageFile = (file) => {
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
export const saveSession = (username, password) => {
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
export const clearSession = () => {
  localStorage.removeItem('adminSession');
};

/**
 * Checks if a session is still valid (not expired)
 * @param {Object} session - Session object with timestamp
 * @returns {boolean} True if session is valid
 */
export const isSessionValid = (session) => {
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
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

/**
 * Handles API errors and returns user-friendly messages
 * @param {Error} error - Error object from API call
 * @returns {string} User-friendly error message
 */
export const handleApiError = (error) => {
  console.error('API Error:', error);
  
  if (error.name === 'TypeError' && error.message.includes('fetch')) {
    return 'Network error. Please check your connection.';
  }
  
  return error.message || 'An unexpected error occurred.';
};

/**
 * Filters products based on various criteria
 * @param {Array<Object>} products - Array of product objects
 * @param {Object} filters - Filter criteria object
 * @returns {Array<Object>} Filtered products array
 */
export const filterProducts = (products, filters) => {
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
export const searchProducts = (products, searchTerm) => {
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
export const calculatePriceRange = (variants) => {
  if (!variants || variants.length === 0) {
    return '₹0.00 - ₹0.00';
  }

  // Extract all valid prices from variants
  const prices = variants
    .map(variant => extractPriceFromString(variant.price))
    .filter(price => price > 0);

  if (prices.length === 0) {
    return '₹0.00 - ₹0.00';
  }

  // Find min and max prices
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  // Format as price range
  if (minPrice === maxPrice) {
    return formatPrice(minPrice);
  } else {
    return `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`;
  }
};

/**
 * Updates the price range for a category based on its variants
 * @param {Object} productsData - Products data object containing products and variants
 * @param {string} categorySlug - Category slug to update
 */
export const updateCategoryPriceRange = (productsData, categorySlug) => {
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