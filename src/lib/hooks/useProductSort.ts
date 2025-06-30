import { useState, useMemo, useCallback } from 'react';
import { Product } from './useProductFilters';

export type SortDirection = 'asc' | 'desc';
export type SortField = keyof Product | 'price_numeric' | 'name_alpha' | 'category_alpha';

export interface SortConfig {
  field: SortField;
  direction: SortDirection;
}

export interface SortOption {
  value: string;
  label: string;
  field: SortField;
  direction: SortDirection;
}

export const defaultSortOptions: SortOption[] = [
  { value: 'name_asc', label: 'Name (A-Z)', field: 'name_alpha', direction: 'asc' },
  { value: 'name_desc', label: 'Name (Z-A)', field: 'name_alpha', direction: 'desc' },
  { value: 'price_asc', label: 'Price (Low to High)', field: 'price_numeric', direction: 'asc' },
  { value: 'price_desc', label: 'Price (High to Low)', field: 'price_numeric', direction: 'desc' },
  { value: 'category_asc', label: 'Category (A-Z)', field: 'category_alpha', direction: 'asc' },
  { value: 'category_desc', label: 'Category (Z-A)', field: 'category_alpha', direction: 'desc' },
];

const defaultSortConfig: SortConfig = {
  field: 'name_alpha',
  direction: 'asc',
};

// Helper function to extract numeric price from price string
const extractPriceFromString = (priceString: string): number => {
  if (!priceString) return 0;
  const match = priceString.match(/₹?(\d+(?:\.\d+)?)/);
  return match ? parseFloat(match[1]) : 0;
};

// Get comparable value for sorting
const getComparableValue = (product: Product, field: SortField): any => {
  switch (field) {
    case 'price_numeric':
      return extractPriceFromString(product.price);
    case 'name_alpha':
      return product.name?.toLowerCase() || '';
    case 'category_alpha':
      return product.category?.toLowerCase() || '';
    default:
      const value = product[field as keyof Product];
      return typeof value === 'string' ? value.toLowerCase() : value || '';
  }
};

// Compare function for sorting
const compareValues = (a: any, b: any, direction: SortDirection): number => {
  let result = 0;
  
  if (typeof a === 'number' && typeof b === 'number') {
    result = a - b;
  } else {
    result = String(a).localeCompare(String(b));
  }
  
  return direction === 'desc' ? -result : result;
};

export function useProductSort(
  products: Product[] = [],
  initialSort: Partial<SortConfig> = {},
  customSortOptions: SortOption[] = []
) {
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    ...defaultSortConfig,
    ...initialSort,
  });

  const allSortOptions = [...defaultSortOptions, ...customSortOptions];

  // Memoized sorted products
  const sortedProducts = useMemo(() => {
    if (!products.length) return products;

    return [...products].sort((a, b) => {
      const aValue = getComparableValue(a, sortConfig.field);
      const bValue = getComparableValue(b, sortConfig.field);
      return compareValues(aValue, bValue, sortConfig.direction);
    });
  }, [products, sortConfig]);

  // Update sort configuration
  const updateSort = useCallback((field: SortField, direction?: SortDirection) => {
    setSortConfig(prev => ({
      field,
      direction: direction || (prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'),
    }));
  }, []);

  // Set sort by option value
  const setSortOption = useCallback((optionValue: string) => {
    const option = allSortOptions.find(opt => opt.value === optionValue);
    if (option) {
      setSortConfig({
        field: option.field,
        direction: option.direction,
      });
    }
  }, [allSortOptions]);

  // Toggle sort direction for current field
  const toggleSortDirection = useCallback(() => {
    setSortConfig(prev => ({
      ...prev,
      direction: prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  }, []);

  // Reset to default sort
  const resetSort = useCallback(() => {
    setSortConfig(defaultSortConfig);
  }, []);

  // Get current sort option
  const currentSortOption = useMemo(() => {
    return allSortOptions.find(option => 
      option.field === sortConfig.field && option.direction === sortConfig.direction
    );
  }, [allSortOptions, sortConfig]);

  // Sort statistics
  const sortStats = useMemo(() => ({
    totalProducts: products.length,
    isDefaultSort: JSON.stringify(sortConfig) === JSON.stringify(defaultSortConfig),
    currentField: sortConfig.field,
    currentDirection: sortConfig.direction,
  }), [products.length, sortConfig]);

  // Get sort indicator for UI (arrows, etc.)
  const getSortIndicator = useCallback((field: SortField): string => {
    if (sortConfig.field !== field) return '';
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  }, [sortConfig]);

  // Check if a field is currently being sorted
  const isSortedBy = useCallback((field: SortField): boolean => {
    return sortConfig.field === field;
  }, [sortConfig.field]);

  return {
    // Sorted data
    sortedProducts,
    
    // Sort configuration
    sortConfig,
    currentSortOption,
    
    // Sort actions
    updateSort,
    setSortOption,
    toggleSortDirection,
    resetSort,
    
    // Sort options
    sortOptions: allSortOptions,
    
    // Sort utilities
    getSortIndicator,
    isSortedBy,
    
    // Sort statistics
    sortStats,
    
    // Advanced sorting
    sortBy: useCallback((customSortFn: (a: Product, b: Product) => number) => {
      return [...products].sort(customSortFn);
    }, [products]),
  };
}