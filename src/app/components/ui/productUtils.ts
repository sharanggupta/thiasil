/**
 * Utility functions for product card operations
 */

import { ProductDimensions, Product } from './types';

/**
 * Formats product dimensions into a readable string
 * @param dimensions - Object containing dimension properties
 * @returns Formatted dimension string or empty string if no valid dimensions
 */
export function formatProductDimensions(dimensions?: ProductDimensions): string {
  try {
    if (!dimensions || typeof dimensions !== 'object') {
      return '';
    }

    const validEntries = Object.entries(dimensions)
      .filter(([, value]) => isValidDimensionValue(value));

    if (validEntries.length === 0) {
      return '';
    }

    const formattedDimensions = validEntries
      .map(([key, value]) => `${getShortDimensionKey(key)}: ${value}`)
      .join('mm, ');

    return `${formattedDimensions}mm`;
  } catch (error) {
    console.error('Error formatting product dimensions:', error);
    return '';
  }
}

/**
 * Checks if a dimension value is valid for display
 * @param value - The dimension value to validate
 * @returns True if the value should be displayed
 */
function isValidDimensionValue(value: any): boolean {
  return value && 
         value !== 'N/A' && 
         value.toString().trim() !== '';
}

/**
 * Gets the short form of a dimension key
 * @param key - The dimension key (e.g., 'length', 'width')
 * @returns Short form of the key (e.g., 'L', 'W')
 */
function getShortDimensionKey(key: string): string {
  const keyMap: Record<string, string> = {
    length: 'L',
    width: 'W', 
    height: 'H',
    diameter: 'D'
  };
  
  return keyMap[key] || key.charAt(0).toUpperCase();
}

/**
 * Validates if a product object has required properties
 * @param product - Product object to validate
 * @returns True if product has minimum required properties
 */
export function isValidProduct(product: any): product is Product {
  return product && 
         typeof product === 'object' &&
         (product.name || product.catNo || product.catalogNo || product.id);
}

/**
 * Safely gets a product display name
 * @param product - Product object
 * @returns Product name or catalog number as fallback
 */
/**
 * Configuration constants for product card display
 */
export const PRODUCT_CARD_CONFIG = {
  FALLBACK_VALUES: {
    UNKNOWN_PRODUCT: 'Unknown Product',
    UNAVAILABLE_CATNO: 'N/A',
    UNKNOWN_STATUS: 'unknown',
    DEFAULT_CATEGORY: 'uncategorized'
  },
  EXCLUDED_VALUES: {
    CAPACITY: ['N/A', 'Custom'] as readonly string[],
    PACKAGING: ['N/A', '1 piece'] as readonly string[],
    DIMENSION: ['N/A', ''] as readonly string[]
  },
  BUTTON_DEFAULTS: {
    TEXT: 'Details',
    UNAVAILABLE_TEXT: 'Unavailable'
  }
} as const;

/**
 * Checks if a product capacity should be displayed
 * @param capacity - Product capacity value
 * @returns True if capacity should be shown
 */
export function shouldShowCapacity(capacity?: string): boolean {
  return Boolean(capacity && !PRODUCT_CARD_CONFIG.EXCLUDED_VALUES.CAPACITY.includes(capacity));
}

/**
 * Checks if a product packaging should be displayed
 * @param packaging - Product packaging value
 * @returns True if packaging should be shown
 */
export function shouldShowPackaging(packaging?: string): boolean {
  return Boolean(packaging && !PRODUCT_CARD_CONFIG.EXCLUDED_VALUES.PACKAGING.includes(packaging));
}

/**
 * Gets the appropriate button text based on stock status
 * @param isOutOfStock - Whether the product is out of stock
 * @param customText - Custom button text override
 * @returns Button text to display
 */
export function getButtonText(isOutOfStock: boolean, customText?: string | null): string {
  if (isOutOfStock) {
    return PRODUCT_CARD_CONFIG.BUTTON_DEFAULTS.UNAVAILABLE_TEXT;
  }
  return customText || PRODUCT_CARD_CONFIG.BUTTON_DEFAULTS.TEXT;
}

export function getProductDisplayName(product: Product): string {
  try {
    if (!isValidProduct(product)) {
      return PRODUCT_CARD_CONFIG.FALLBACK_VALUES.UNKNOWN_PRODUCT;
    }
    
    return product.name || product.catNo || product.catalogNo || `Product-${product.id}` || PRODUCT_CARD_CONFIG.FALLBACK_VALUES.UNKNOWN_PRODUCT;
  } catch (error) {
    console.error('Error getting product display name:', error);
    return PRODUCT_CARD_CONFIG.FALLBACK_VALUES.UNKNOWN_PRODUCT;
  }
}