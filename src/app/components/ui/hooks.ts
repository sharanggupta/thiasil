/**
 * Custom hooks for ProductCard component
 */

import { useCallback, useMemo } from 'react';
import { getProductImageInfo } from '@/lib/image-utils';
import { 
  formatProductDimensions, 
  isValidProduct, 
  getProductDisplayName, 
  PRODUCT_CARD_CONFIG 
} from './productUtils';
import { Product, ProductCardProps } from './types';

/**
 * Hook for managing product data with safe fallbacks
 * @param product - Raw product data
 * @returns Processed product data with safe defaults
 */
export function useProductData(product: Product) {
  return useMemo(() => ({
    catNo: product.catNo || PRODUCT_CARD_CONFIG.FALLBACK_VALUES.UNAVAILABLE_CATNO,
    name: product.name || '',
    stockStatus: product.stockStatus || PRODUCT_CARD_CONFIG.FALLBACK_VALUES.UNKNOWN_STATUS,
    capacity: product.capacity || '',
    packaging: product.packaging || '',
    categorySlug: product.categorySlug || '',
    category: product.category || '',
    dimensions: product.dimensions || {},
    ...product
  }), [product]);
}

/**
 * Hook for managing product display information
 * @param product - Product data
 * @returns Display information including image, name, and dimensions
 */
export function useProductDisplay(product: Product) {
  return useMemo(() => {
    const { url: imageUrl, hasImage } = getProductImageInfo(product);
    const displayName = getProductDisplayName(product);
    const formattedDimensions = formatProductDimensions(product.dimensions);
    
    return {
      imageUrl,
      hasImage,
      displayName,
      formattedDimensions
    };
  }, [product]);
}

/**
 * Hook for managing ProductCard event handlers with error handling
 * @param onCardClick - Card click handler
 * @param buttonOnClick - Button click handler
 * @returns Memoized event handlers with error boundaries
 */
export function useProductCardHandlers(
  onCardClick?: (() => void) | null,
  buttonOnClick?: (() => void) | null
) {
  const handleCardClick = useCallback(() => {
    try {
      onCardClick?.();
    } catch (error) {
      console.error('Error in ProductCard click handler:', error);
    }
  }, [onCardClick]);

  const handleButtonClick = useCallback(() => {
    try {
      buttonOnClick?.();
    } catch (error) {
      console.error('Error in ProductCard button click handler:', error);
    }
  }, [buttonOnClick]);

  return {
    handleCardClick,
    handleButtonClick
  };
}

/**
 * Hook for managing product card state and derived values
 * @param props - ProductCard props
 * @returns Processed state and handlers for the component
 */
export function useProductCard(props: ProductCardProps) {
  const { 
    product, 
    onCardClick, 
    buttonOnClick,
    ...restProps 
  } = props;

  // Validate product data
  const isValid = useMemo(() => isValidProduct(product), [product]);
  
  // Process product data
  const safeProduct = useProductData(product);
  const displayInfo = useProductDisplay(product);
  const { handleCardClick, handleButtonClick } = useProductCardHandlers(onCardClick, buttonOnClick);
  
  // Derived state
  const isOutOfStock = useMemo(() => 
    safeProduct.stockStatus !== 'in_stock', 
    [safeProduct.stockStatus]
  );

  return {
    isValid,
    safeProduct,
    displayInfo,
    isOutOfStock,
    handleCardClick,
    handleButtonClick,
    restProps
  };
}