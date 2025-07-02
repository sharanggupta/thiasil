import { useState, useMemo, useCallback } from 'react';
import { Product } from '@/app/components/ui/types';

export interface ProductFilters {
  category: string;
  stockStatus: string;
  packaging: string;
  minPrice: string;
  maxPrice: string;
  searchTerm: string;
}

export const defaultFilters: ProductFilters = {
  category: '',
  stockStatus: '',
  packaging: '',
  minPrice: '',
  maxPrice: '',
  searchTerm: '',
};

// Helper function to extract numeric price from price string
const extractPriceFromString = (priceString: string): number => {
  if (!priceString) return 0;
  const match = priceString.match(/₹?(\d+(?:\.\d+)?)/);
  return match ? parseFloat(match[1]) : 0;
};

// Core filtering function
const filterProducts = (products: Product[], filters: ProductFilters): Product[] => {
  return products.filter((product) => {
    // Category filter
    if (filters.category && product.category !== filters.category) {
      return false;
    }
    
    // Stock status filter
    if (filters.stockStatus && product.stockStatus !== filters.stockStatus) {
      return false;
    }
    
    // Packaging filter
    if (filters.packaging && product.packaging !== filters.packaging) {
      return false;
    }
    
    // Price range filters
    const price = extractPriceFromString(product.price);
    if (filters.minPrice && price < parseFloat(filters.minPrice)) {
      return false;
    }
    if (filters.maxPrice && price > parseFloat(filters.maxPrice)) {
      return false;
    }
    
    return true;
  });
};

// Core search function
const searchProducts = (products: Product[], searchTerm: string): Product[] => {
  if (!searchTerm) return products;
  
  const term = searchTerm.toLowerCase();
  return products.filter(product => 
    product.name.toLowerCase().includes(term) ||
    product.category.toLowerCase().includes(term) ||
    (product.catalogNo && product.catalogNo.toLowerCase().includes(term)) ||
    (product.catNo && product.catNo.toLowerCase().includes(term))
  );
};

// Get unique values for filter options
const getUniqueValues = (products: Product[], key: keyof Product): string[] => {
  const values = products
    .map(product => product[key])
    .filter((value): value is string => Boolean(value && typeof value === 'string'));
  return Array.from(new Set(values)).sort();
};

export function useProductFilters(products: Product[] = []) {
  const [filters, setFilters] = useState<ProductFilters>(defaultFilters);

  // Memoized filtered products for performance
  const filteredProducts = useMemo(() => {
    let result = products;
    
    // Apply search first
    if (filters.searchTerm) {
      result = searchProducts(result, filters.searchTerm);
    }
    
    // Then apply filters
    result = filterProducts(result, filters);
    
    return result;
  }, [products, filters]);

  // Update individual filter
  const updateFilter = useCallback(<K extends keyof ProductFilters>(
    key: K, 
    value: ProductFilters[K]
  ) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  // Update multiple filters at once
  const updateFilters = useCallback((newFilters: Partial<ProductFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  // Reset specific filter
  const resetFilter = useCallback(<K extends keyof ProductFilters>(key: K) => {
    setFilters(prev => ({ ...prev, [key]: defaultFilters[key] }));
  }, []);

  // Get filter options from available products
  const filterOptions = useMemo(() => ({
    categories: getUniqueValues(products, 'category'),
    stockStatuses: getUniqueValues(products, 'stockStatus'),
    packagingOptions: getUniqueValues(products, 'packaging'),
  }), [products]);

  // Filter statistics
  const filterStats = useMemo(() => ({
    totalProducts: products.length,
    filteredCount: filteredProducts.length,
    isFiltered: JSON.stringify(filters) !== JSON.stringify(defaultFilters),
    hasResults: filteredProducts.length > 0,
  }), [products.length, filteredProducts.length, filters]);

  return {
    // Filtered data
    filteredProducts,
    
    // Filter state
    filters,
    
    // Filter actions
    updateFilter,
    updateFilters,
    clearFilters,
    resetFilter,
    
    // Filter options
    filterOptions,
    
    // Statistics
    filterStats,
    
    // Utility functions (exposed for advanced usage)
    searchProducts: useCallback((searchTerm: string) => searchProducts(products, searchTerm), [products]),
    filterProducts: useCallback((customFilters: ProductFilters) => filterProducts(products, customFilters), [products]),
  };
}