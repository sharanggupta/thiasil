import { useProductsApi, useProductStats, useProductQueries } from './useProductsApi';
import { useProductsFilter } from './useProductsFilter';

// Combined hook that provides full products functionality
export function useProducts() {
  // Get products from API
  const {
    products,
    categories,
    packagingOptions,
    isLoading,
    error,
    refetch,
    invalidateCache
  } = useProductsApi();

  // Get filtering capabilities
  const {
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
  } = useProductsFilter(products);

  // Get product statistics
  const productStats = useProductStats(filteredProducts);

  // Get product query functions
  const productQueries = useProductQueries(products);

  return {
    // Data
    products,
    filteredProducts,
    searchResults,
    categories,
    packagingOptions,
    
    // State
    isLoading,
    error,
    filters,
    isFiltered,
    productStats,
    
    // API Actions
    refetch,
    invalidateCache,
    
    // Filter Actions
    updateFilter,
    updateFilters,
    clearFilters,
    clearFilter,
    applyFilters,
    getFilterCount,
    exportFilters,
    importFilters,
    
    // Query Functions
    ...productQueries
  };
}

// Simplified hook for basic product needs
export function useProductsBasic() {
  const { products, categories, isLoading, error, refetch } = useProductsApi();
  
  return {
    products,
    categories,
    isLoading,
    error,
    refetch
  };
}

// Hook for specific category
export function useProductsByCategory(categorySlug: string) {
  const { products, isLoading, error, refetch } = useProductsApi();
  const { getProductsByCategory } = useProductQueries(products);
  
  const categoryProducts = getProductsByCategory(categorySlug);
  const categoryStats = useProductStats(categoryProducts);
  
  return {
    products: categoryProducts,
    stats: categoryStats,
    isLoading,
    error,
    refetch
  };
}

// Hook for search functionality
export function useProductSearch() {
  const { products, isLoading, error } = useProductsApi();
  const { searchProducts } = useProductQueries(products);
  
  return {
    searchProducts,
    allProducts: products,
    isLoading,
    error
  };
}

// Legacy compatibility - matches the old useProducts interface
export function useProductsLegacy() {
  const api = useProductsApi();
  const filter = useProductsFilter(api.products);
  const stats = useProductStats(filter.filteredProducts);
  const queries = useProductQueries(api.products);

  // Stock status options for legacy compatibility
  const stockOptions = [
    { value: '', label: 'All' },
    { value: 'in_stock', label: 'In Stock' },
    { value: 'out_of_stock', label: 'Out of Stock' },
    { value: 'made_to_order', label: 'Made to Order' },
    { value: 'limited_stock', label: 'Limited Stock' },
  ];

  return {
    // Legacy state (exact match)
    products: api.products,
    filteredProducts: filter.filteredProducts,
    categories: api.categories,
    packagingOptions: api.packagingOptions,
    stockOptions,
    filters: filter.filters,
    isLoading: api.isLoading,
    error: api.error,
    productStats: stats,

    // Legacy actions (exact match)
    loadProducts: api.refetch,
    updateFilter: filter.updateFilter,
    clearFilters: filter.clearFilters,
    getProductsByCategory: queries.getProductsByCategory,
    getProductById: queries.getProductById,
    getProductsByStockStatus: queries.getProductsByStockStatus,
  };
}

// Export individual parts for flexibility
export {
  useProductsApi,
  useProductsFilter,
  useProductStats,
  useProductQueries
};