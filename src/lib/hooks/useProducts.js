import { useCallback, useEffect, useMemo, useState } from 'react';
import { getUniqueValues } from '../array';
import { API_ENDPOINTS } from '../constants';
import { filterProducts, searchProducts } from '../productFilter';

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [packagingOptions, setPackagingOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Filter state
  const [filters, setFilters] = useState({
    category: '',
    stockStatus: '',
    packaging: '',
    minPrice: '',
    maxPrice: '',
    searchTerm: '',
  });

  // Load products on mount
  useEffect(() => {
    loadProducts();
  }, []);

  // Extract categories and packaging options when products change
  useEffect(() => {
    if (products.length > 0) {
      const uniqueCategories = getUniqueValues(products, 'category');
      const uniquePackaging = getUniqueValues(products, 'packaging');
      
      setCategories(uniqueCategories);
      setPackagingOptions(uniquePackaging);
    }
  }, [products]);

  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(API_ENDPOINTS.PRODUCTS);
      
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Error loading products:', error);
      setError('Failed to load products. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Filtered products
  const filteredProducts = useMemo(() => {
    let result = products;

    // Apply search filter
    if (filters.searchTerm) {
      result = searchProducts(result, filters.searchTerm);
    }

    // Apply other filters
    result = filterProducts(result, filters);

    return result;
  }, [products, filters]);

  // Stock status options
  const stockOptions = useMemo(() => [
    { value: '', label: 'All' },
    { value: 'in_stock', label: 'In Stock' },
    { value: 'out_of_stock', label: 'Out of Stock' },
    { value: 'made_to_order', label: 'Made to Order' },
    { value: 'limited_stock', label: 'Limited Stock' },
  ], []);

  // Update filters
  const updateFilter = useCallback((key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setFilters({
      category: '',
      stockStatus: '',
      packaging: '',
      minPrice: '',
      maxPrice: '',
      searchTerm: '',
    });
  }, []);

  // Get products by category
  const getProductsByCategory = useCallback((category) => {
    return products.filter(product => product.category === category);
  }, [products]);

  // Get product by ID
  const getProductById = useCallback((id) => {
    return products.find(product => product.id === id);
  }, [products]);

  // Get products by stock status
  const getProductsByStockStatus = useCallback((status) => {
    return products.filter(product => product.stockStatus === status);
  }, [products]);

  // Get product statistics
  const getProductStats = useMemo(() => {
    const total = products.length;
    const inStock = products.filter(p => p.stockStatus === 'in_stock').length;
    const outOfStock = products.filter(p => p.stockStatus === 'out_of_stock').length;
    const madeToOrder = products.filter(p => p.stockStatus === 'made_to_order').length;
    const limitedStock = products.filter(p => p.stockStatus === 'limited_stock').length;

    return {
      total,
      inStock,
      outOfStock,
      madeToOrder,
      limitedStock,
      categories: categories.length,
    };
  }, [products, categories]);

  return {
    // State
    products,
    filteredProducts,
    categories,
    packagingOptions,
    stockOptions,
    filters,
    isLoading,
    error,
    productStats: getProductStats,

    // Actions
    loadProducts,
    updateFilter,
    clearFilters,
    getProductsByCategory,
    getProductById,
    getProductsByStockStatus,
  };
}; 