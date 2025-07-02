import { useMemo } from 'react';
import { useProductFilters, ProductFilters } from './useProductFilters';
import { Product } from '@/app/components/ui/types';
import { useProductSearch, SearchOptions } from './useProductSearch';
import { useProductSort, SortConfig, SortOption } from './useProductSort';

export interface ProductManagerOptions {
  initialFilters?: Partial<ProductFilters>;
  initialSort?: Partial<SortConfig>;
  searchOptions?: Partial<SearchOptions>;
  customSortOptions?: SortOption[];
  enableSearch?: boolean;
  enableFilters?: boolean;
  enableSort?: boolean;
}

export function useProductManager(
  products: Product[] = [],
  options: ProductManagerOptions = {}
) {
  const {
    initialFilters = {},
    initialSort = {},
    searchOptions = {},
    customSortOptions = [],
    enableSearch = true,
    enableFilters = true,
    enableSort = true,
  } = options;

  // Initialize hooks
  const filterHook = useProductFilters(products);
  const searchHook = useProductSearch(products, searchOptions);
  const sortHook = useProductSort(products, initialSort, customSortOptions);

  // Apply initial filters if provided
  if (Object.keys(initialFilters).length > 0) {
    filterHook.updateFilters(initialFilters);
  }

  // Process products through the pipeline: search → filter → sort  
  const processedProducts = useMemo(() => {
    // For filters and sorting, we'll use the already processed results from the hooks
    // since they handle the processing internally
    if (enableFilters && !enableSearch && !enableSort) {
      return filterHook.filteredProducts;
    }
    
    if (enableSearch && !enableFilters && !enableSort) {
      return searchHook.searchResults;
    }
    
    if (enableSort && !enableFilters && !enableSearch) {
      return sortHook.sortedProducts;
    }
    
    // For combined functionality, we need to manually process
    let result = products;
    
    // Step 1: Apply search first if enabled
    if (enableSearch && searchHook.debouncedSearchTerm) {
      result = searchHook.performSearch(searchHook.debouncedSearchTerm);
    }
    
    // Step 2: Apply filters to the result
    if (enableFilters && filterHook.filterStats.isFiltered) {
      // Use the filter function with current result
      const filterProducts = (products: Product[], filters: ProductFilters): Product[] => {
        return products.filter((product) => {
          if (filters.category && product.category !== filters.category) return false;
          if (filters.stockStatus && product.stockStatus !== filters.stockStatus) return false;
          if (filters.packaging && product.packaging !== filters.packaging) return false;
          
          const extractPriceFromString = (priceString: string): number => {
            if (!priceString) return 0;
            const match = priceString.match(/₹?(\d+(?:\.\d+)?)/);
            return match ? parseFloat(match[1]) : 0;
          };
          
          const price = extractPriceFromString(product.price);
          if (filters.minPrice && price < parseFloat(filters.minPrice)) return false;
          if (filters.maxPrice && price > parseFloat(filters.maxPrice)) return false;
          
          return true;
        });
      };
      
      result = filterProducts(result, filterHook.filters);
    }
    
    // Step 3: Apply sorting to the result
    if (enableSort) {
      // For sorting, we'll manually sort since we can't use the hook on dynamic data
      result = [...result].sort((a, b) => {
        const getSortValue = (product: Product, field: string): any => {
          switch (field) {
            case 'price_numeric':
              const match = product.price.match(/₹?(\d+(?:\.\d+)?)/);
              return match ? parseFloat(match[1]) : 0;
            case 'name_alpha':
              return product.name?.toLowerCase() || '';
            case 'category_alpha':
              return product.category?.toLowerCase() || '';
            default:
              const value = product[field as keyof Product];
              return typeof value === 'string' ? value.toLowerCase() : value || '';
          }
        };
        
        const aValue = getSortValue(a, sortHook.sortConfig.field as string);
        const bValue = getSortValue(b, sortHook.sortConfig.field as string);
        
        let compareResult = 0;
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          compareResult = aValue - bValue;
        } else {
          compareResult = String(aValue).localeCompare(String(bValue));
        }
        
        return sortHook.sortConfig.direction === 'desc' ? -compareResult : compareResult;
      });
    }
    
    return result;
  }, [
    products,
    enableSearch,
    enableFilters,
    enableSort,
    searchHook.searchResults,
    searchHook.debouncedSearchTerm,
    searchHook.performSearch,
    filterHook.filteredProducts,
    filterHook.filters,
    filterHook.filterStats.isFiltered,
    sortHook.sortedProducts,
    sortHook.sortConfig,
  ]);

  // Combined statistics
  const stats = useMemo(() => ({
    original: products.length,
    afterSearch: enableSearch ? searchHook.searchStats.resultCount : products.length,
    afterFiltering: enableFilters ? filterHook.filterStats.filteredCount : products.length,
    final: processedProducts.length,
    hasResults: processedProducts.length > 0,
    isSearchActive: enableSearch && searchHook.searchStats.hasSearchTerm,
    isFilterActive: enableFilters && filterHook.filterStats.isFiltered,
    isSortActive: enableSort && !sortHook.sortStats.isDefaultSort,
  }), [
    products.length,
    processedProducts.length,
    enableSearch,
    enableFilters,
    enableSort,
    searchHook.searchStats,
    filterHook.filterStats,
    sortHook.sortStats,
  ]);

  // Reset all functionality
  const resetAll = () => {
    if (enableSearch) searchHook.clearSearch();
    if (enableFilters) filterHook.clearFilters();
    if (enableSort) sortHook.resetSort();
  };

  // Export combined interface
  return {
    // Processed data
    products: processedProducts,
    originalProducts: products,
    
    // Search functionality (if enabled)
    ...(enableSearch && {
      search: {
        ...searchHook,
      },
    }),
    
    // Filter functionality (if enabled)
    ...(enableFilters && {
      filters: {
        ...filterHook,
      },
    }),
    
    // Sort functionality (if enabled)
    ...(enableSort && {
      sort: {
        ...sortHook,
      },
    }),
    
    // Combined statistics
    stats,
    
    // Global actions
    resetAll,
    
    // Quick actions
    quickActions: {
      searchBy: enableSearch ? searchHook.setSearchTerm : undefined,
      filterBy: enableFilters ? filterHook.updateFilter : undefined,
      sortBy: enableSort ? sortHook.updateSort : undefined,
    },
    
    // Configuration
    config: {
      enableSearch,
      enableFilters,
      enableSort,
    },
  };
}

// Convenience hooks for specific use cases
export function useProductSearch_Only(products: Product[], searchOptions?: Partial<SearchOptions>) {
  return useProductManager(products, {
    enableFilters: false,
    enableSort: false,
    searchOptions,
  });
}

export function useProductFilters_Only(products: Product[], initialFilters?: Partial<ProductFilters>) {
  return useProductManager(products, {
    enableSearch: false,
    enableSort: false,
    initialFilters,
  });
}

export function useProductSort_Only(products: Product[], initialSort?: Partial<SortConfig>) {
  return useProductManager(products, {
    enableSearch: false,
    enableFilters: false,
    initialSort,
  });
}