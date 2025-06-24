import { STOCK_STATUSES, VALIDATION } from './constants';

/**
 * Utility functions for common operations
 */

// Input sanitization
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input.replace(/[<>]/g, '').trim();
};

// Price utilities
export const extractPriceFromString = (priceString) => {
  if (!priceString) return 0;
  
  if (typeof priceString === 'number') return priceString;
  
  // Handle price range string like '₹343.00 - ₹686.00'
  const match = priceString.match(/₹([\d,.]+)/);
  return match ? parseFloat(match[1].replace(/,/g, '')) : 0;
};

export const formatPrice = (price) => {
  if (!price) return '₹0.00';
  
  const numPrice = typeof price === 'string' ? extractPriceFromString(price) : price;
  return `₹${numPrice.toFixed(2)}`;
};

export const applyDiscountToPrice = (price, discountPercent) => {
  if (!price || !discountPercent) return price;
  
  const numPrice = extractPriceFromString(price);
  const discountedPrice = numPrice * (1 - discountPercent / 100);
  return formatPrice(discountedPrice);
};

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

// Catalog number utilities
export const getBaseCatalogNumber = (catNo) => {
  if (!catNo) return '';
  // Handle both "1100 Series" and "1100/50" formats
  return catNo.split(/[\s\/]/)[0];
};

// Stock status utilities
export const getStockStatusConfig = (status) => {
  const statusMap = {
    'in_stock': STOCK_STATUSES.IN_STOCK,
    'out_of_stock': STOCK_STATUSES.OUT_OF_STOCK,
    'made_to_order': STOCK_STATUSES.MADE_TO_ORDER,
    'limited_stock': STOCK_STATUSES.LIMITED_STOCK,
  };
  
  return statusMap[status] || STOCK_STATUSES.IN_STOCK;
};

export const getStockStatusDisplay = (status) => {
  const config = getStockStatusConfig(status);
  return {
    label: config.label,
    className: `${config.bg} ${config.color}`,
  };
};

// Validation utilities
export const validateEmail = (email) => {
  return VALIDATION.EMAIL_REGEX.test(email);
};

export const validatePrice = (price) => {
  return VALIDATION.PRICE_REGEX.test(price);
};

export const validateRequired = (value) => {
  return value && value.trim().length > 0;
};

export const validateLength = (value, maxLength) => {
  return value && value.length <= maxLength;
};

// Array utilities
export const getUniqueValues = (array, key) => {
  return [...new Set(array.map(item => item[key]).filter(Boolean))];
};

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

// Date utilities
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

export const isExpired = (date) => {
  if (!date) return false;
  return new Date(date) < new Date();
};

// File utilities
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

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

// Session utilities
export const getSessionCredentials = () => {
  try {
    const session = localStorage.getItem('adminSession');
    if (!session) return null;
    
    const { username, password } = JSON.parse(session);
    return { username, password };
  } catch (error) {
    console.error('Error parsing session:', error);
    return null;
  }
};

export const saveSession = (username, password) => {
  const session = {
    timestamp: Date.now(),
    username,
    password,
  };
  localStorage.setItem('adminSession', JSON.stringify(session));
};

export const clearSession = () => {
  localStorage.removeItem('adminSession');
};

export const isSessionValid = (session) => {
  if (!session) return false;
  
  const { timestamp } = session;
  const now = Date.now();
  const timeout = 30 * 60 * 1000; // 30 minutes
  
  return now - timestamp < timeout;
};

// Debounce utility
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

// Error handling
export const handleApiError = (error) => {
  console.error('API Error:', error);
  
  if (error.name === 'TypeError' && error.message.includes('fetch')) {
    return 'Network error. Please check your connection.';
  }
  
  return error.message || 'An unexpected error occurred.';
};

// Product filtering utilities
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

// Search utilities
export const searchProducts = (products, searchTerm) => {
  if (!searchTerm) return products;
  
  const term = searchTerm.toLowerCase();
  return products.filter(product => 
    product.name.toLowerCase().includes(term) ||
    product.category.toLowerCase().includes(term) ||
    (product.catalogNo && product.catalogNo.toLowerCase().includes(term))
  );
}; 