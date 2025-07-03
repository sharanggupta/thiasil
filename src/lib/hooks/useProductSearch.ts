import { useState, useMemo, useCallback, useEffect } from 'react';
import { Product } from '@/app/components/ui/types';

export interface SearchOptions {
  searchFields: (keyof Product)[];
  caseSensitive: boolean;
  exactMatch: boolean;
  minSearchLength: number;
  debounceMs: number;
}

export const defaultSearchOptions: SearchOptions = {
  searchFields: ['name', 'category', 'catalogNo', 'catNo'],
  caseSensitive: false,
  exactMatch: false,
  minSearchLength: 1,
  debounceMs: 300,
};

export function useProductSearch(
  products: Product[] = [], 
  options: Partial<SearchOptions> = {}
) {
  const searchConfig = useMemo(() => ({ ...defaultSearchOptions, ...options }), [options]);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Debounce search term
  useEffect(() => {
    if (searchTerm.length === 0) {
      setDebouncedSearchTerm('');
      setIsSearching(false);
      return;
    }

    if (searchTerm.length < searchConfig.minSearchLength) {
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setIsSearching(false);
    }, searchConfig.debounceMs);

    return () => clearTimeout(timer);
  }, [searchTerm, searchConfig.minSearchLength, searchConfig.debounceMs]);

  // Search function
  const performSearch = useCallback((
    productsToSearch: Product[], 
    term: string, 
    config: SearchOptions
  ): Product[] => {
    if (!term || term.length < config.minSearchLength) {
      return productsToSearch;
    }

    const searchValue = config.caseSensitive ? term : term.toLowerCase();

    return productsToSearch.filter(product => {
      return config.searchFields.some(field => {
        const fieldValue = product[field];
        if (!fieldValue || typeof fieldValue !== 'string') return false;

        const productValue = config.caseSensitive ? fieldValue : fieldValue.toLowerCase();

        if (config.exactMatch) {
          return productValue === searchValue;
        } else {
          return productValue.includes(searchValue);
        }
      });
    });
  }, []);

  // Memoized search results
  const searchResults = useMemo(() => {
    return performSearch(products, debouncedSearchTerm, searchConfig);
  }, [products, debouncedSearchTerm, searchConfig, performSearch]);

  // Search statistics
  const searchStats = useMemo(() => ({
    totalProducts: products.length,
    resultCount: searchResults.length,
    hasResults: searchResults.length > 0,
    isSearching,
    hasSearchTerm: debouncedSearchTerm.length > 0,
    searchTerm: debouncedSearchTerm,
  }), [products.length, searchResults.length, isSearching, debouncedSearchTerm]);

  // Search suggestions (based on partial matches)
  const searchSuggestions = useMemo(() => {
    if (!searchTerm || searchTerm.length < 2) return [];

    const suggestions = new Set<string>();
    const partialTerm = searchConfig.caseSensitive ? searchTerm : searchTerm.toLowerCase();

    products.forEach(product => {
      searchConfig.searchFields.forEach(field => {
        const fieldValue = product[field];
        if (fieldValue && typeof fieldValue === 'string') {
          const productValue = searchConfig.caseSensitive ? fieldValue : fieldValue.toLowerCase();
          if (productValue.includes(partialTerm) && productValue !== partialTerm) {
            suggestions.add(fieldValue);
          }
        }
      });
    });

    return Array.from(suggestions).slice(0, 10); // Limit to 10 suggestions
  }, [products, searchTerm, searchConfig]);

  // Clear search
  const clearSearch = useCallback(() => {
    setSearchTerm('');
    setDebouncedSearchTerm('');
  }, []);

  // Highlight search term in text
  const highlightSearchTerm = useCallback((text: string): string => {
    if (!debouncedSearchTerm || !text) return text;

    const regex = new RegExp(
      `(${debouncedSearchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`,
      searchConfig.caseSensitive ? 'g' : 'gi'
    );

    return text.replace(regex, '<mark>$1</mark>');
  }, [debouncedSearchTerm, searchConfig.caseSensitive]);

  return {
    // Search state
    searchTerm,
    debouncedSearchTerm,
    isSearching,
    
    // Search results
    searchResults,
    searchSuggestions,
    
    // Search actions
    setSearchTerm,
    clearSearch,
    
    // Search utilities
    highlightSearchTerm,
    performSearch: useCallback((term: string) => performSearch(products, term, searchConfig), [products, searchConfig, performSearch]),
    
    // Search statistics
    searchStats,
  };
}