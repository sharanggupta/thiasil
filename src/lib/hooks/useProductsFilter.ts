import { useState, useCallback, useMemo } from 'react';
import { Product } from './useProductsApi';
import { filterProducts, searchProducts } from '../productFilter';

// Types
export interface ProductFilters {
  category: string;
  stockStatus: string;
  packaging: string;
  minPrice: string;
  maxPrice: string;
  searchTerm: string;
  features?: string[];
  sortBy?: 'name' | 'price' | 'category' | 'stockStatus';
  sortOrder?: 'asc' | 'desc';
}

export interface UseProductsFilterResult {
  filters: ProductFilters;
  filteredProducts: Product[];
  searchResults: Product[];
  isFiltered: boolean;
  updateFilter: (key: keyof ProductFilters, value: any) => void;
  updateFilters: (updates: Partial<ProductFilters>) => void;
  clearFilters: () => void;
  clearFilter: (key: keyof ProductFilters) => void;
  applyFilters: (products: Product[]) => Product[];
  getFilterCount: () => number;
  exportFilters: () => string;
  importFilters: (filtersString: string) => void;
}

// Default filters
const DEFAULT_FILTERS: ProductFilters = {
  category: '',
  stockStatus: '',
  packaging: '',
  minPrice: '',
  maxPrice: '',
  searchTerm: '',
  features: [],
  sortBy: 'name',
  sortOrder: 'asc'
};

// Advanced filtering functions
function applyAdvancedFilters(products: Product[], filters: ProductFilters): Product[] {
  let result = [...products];

  // Apply search filter first (most selective)
  if (filters.searchTerm) {
    result = searchProducts(result, filters.searchTerm);
  }

  // Apply basic filters
  result = filterProducts(result, filters);

  // Apply feature filters
  if (filters.features && filters.features.length > 0) {
    result = result.filter(product => {
      if (!product.features) return false;
      return filters.features!.some(feature => 
        product.features!.some(productFeature => 
          productFeature.toLowerCase().includes(feature.toLowerCase())
        )
      );
    });
  }

  // Apply sorting
  if (filters.sortBy) {
    result.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (filters.sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'price':
          aValue = extractPriceNumber(a.price);
          bValue = extractPriceNumber(b.price);
          break;
        case 'category':
          aValue = a.category.toLowerCase();
          bValue = b.category.toLowerCase();
          break;
        case 'stockStatus':
          aValue = getStockPriority(a.stockStatus);
          bValue = getStockPriority(b.stockStatus);
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return filters.sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return filters.sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }

  return result;
}

// Helper functions
function extractPriceNumber(price: string): number {
  const match = price?.match(/₹?(\d+\.?\d*)/);
  return match ? parseFloat(match[1]) : 0;
}

function getStockPriority(status: string): number {
  const priorities = {
    'in_stock': 1,
    'limited_stock': 2,
    'made_to_order': 3,
    'out_of_stock': 4
  };
  return priorities[status as keyof typeof priorities] || 5;
}

// Main hook
export function useProductsFilter(products: Product[] = []): UseProductsFilterResult {
  const [filters, setFilters] = useState<ProductFilters>(DEFAULT_FILTERS);

  // Apply filters to products
  const filteredProducts = useMemo(() => {
    return applyAdvancedFilters(products, filters);
  }, [products, filters]);

  // Search results (just search, no other filters)
  const searchResults = useMemo(() => {
    if (!filters.searchTerm) return products;
    return searchProducts(products, filters.searchTerm);
  }, [products, filters.searchTerm]);

  // Check if any filters are active
  const isFiltered = useMemo(() => {
    return Object.entries(filters).some(([key, value]) => {
      if (key === 'sortBy' || key === 'sortOrder') return false;
      if (Array.isArray(value)) return value.length > 0;
      return value !== '' && value !== DEFAULT_FILTERS[key as keyof ProductFilters];
    });
  }, [filters]);

  // Update single filter
  const updateFilter = useCallback((key: keyof ProductFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  // Update multiple filters
  const updateFilters = useCallback((updates: Partial<ProductFilters>) => {
    setFilters(prev => ({
      ...prev,
      ...updates
    }));
  }, []);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  // Clear single filter
  const clearFilter = useCallback((key: keyof ProductFilters) => {
    setFilters(prev => ({
      ...prev,
      [key]: Array.isArray(DEFAULT_FILTERS[key]) ? [] : DEFAULT_FILTERS[key]
    }));
  }, []);

  // Apply filters to external product array
  const applyFilters = useCallback((externalProducts: Product[]) => {
    return applyAdvancedFilters(externalProducts, filters);
  }, [filters]);

  // Get count of active filters
  const getFilterCount = useCallback(() => {
    return Object.entries(filters).filter(([key, value]) => {
      if (key === 'sortBy' || key === 'sortOrder') return false;
      if (Array.isArray(value)) return value.length > 0;
      return value !== '' && value !== DEFAULT_FILTERS[key as keyof ProductFilters];
    }).length;
  }, [filters]);

  // Export filters as string
  const exportFilters = useCallback(() => {
    return JSON.stringify(filters);
  }, [filters]);

  // Import filters from string
  const importFilters = useCallback((filtersString: string) => {
    try {
      const importedFilters = JSON.parse(filtersString);
      setFilters({
        ...DEFAULT_FILTERS,
        ...importedFilters
      });
    } catch (error) {
      console.error('Failed to import filters:', error);
    }
  }, []);

  return {
    filters,
    filteredProducts,
    searchResults,
    isFiltered,
    updateFilter,
    updateFilters,
    clearFilters,
    clearFilter,
    applyFilters,
    getFilterCount,
    exportFilters,
    importFilters
  };
}

// Filter presets
export const FILTER_PRESETS = {
  inStock: {
    name: 'In Stock Only',
    filters: { stockStatus: 'in_stock' }
  },
  outOfStock: {
    name: 'Out of Stock',
    filters: { stockStatus: 'out_of_stock' }
  },
  lowStock: {
    name: 'Low Stock',
    filters: { stockStatus: 'limited_stock' }
  },
  priceAscending: {
    name: 'Price: Low to High',
    filters: { sortBy: 'price' as const, sortOrder: 'asc' as const }
  },
  priceDescending: {
    name: 'Price: High to Low',
    filters: { sortBy: 'price' as const, sortOrder: 'desc' as const }
  },
  nameAscending: {
    name: 'Name: A to Z',
    filters: { sortBy: 'name' as const, sortOrder: 'asc' as const }
  },
  nameDescending: {
    name: 'Name: Z to A',
    filters: { sortBy: 'name' as const, sortOrder: 'desc' as const }
  }
} as const;

// Hook for filter presets
export function useFilterPresets() {
  const applyPreset = useCallback((presetKey: keyof typeof FILTER_PRESETS, updateFilters: (updates: Partial<ProductFilters>) => void) => {
    const preset = FILTER_PRESETS[presetKey];
    if (preset) {
      updateFilters(preset.filters);
    }
  }, []);

  return {
    presets: FILTER_PRESETS,
    applyPreset
  };
}