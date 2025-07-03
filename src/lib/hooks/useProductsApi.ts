import { useMemo } from 'react';
import { useApiGet, apiCacheUtils } from './useApi';
import { getUniqueValues } from '../utils';

// Types
export interface Product {
  id: string | number;
  name: string;
  category: string;
  categorySlug: string;
  price: string;
  priceRange?: string;
  stockStatus: string;
  quantity?: number;
  packaging?: string;
  features?: string[];
  image?: string;
  catNo?: string;
  capacity?: string;
  dimensions?: Record<string, any>;
}

export interface Category {
  name: string;
  slug: string;
  description?: string;
  dimensionFields?: Array<{ name: string; unit: string }>;
}

export interface ProductsApiData {
  products: Product[];
  categories: Category[];
}

export interface UseProductsApiResult {
  products: Product[];
  categories: Category[];
  packagingOptions: string[];
  isLoading: boolean;
  error: any;
  refetch: () => Promise<ProductsApiData>;
  invalidateCache: () => void;
}

// Constants
const PRODUCTS_CACHE_KEY = 'products_api_data';
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Transform response data
function transformProductsData(data: any): ProductsApiData {
  return {
    products: data.products || [],
    categories: data.categories || []
  };
}

// Main products API hook
export function useProductsApi(): UseProductsApiResult {
  const {
    data,
    isLoading,
    error,
    execute: refetch
  } = useApiGet<ProductsApiData>('/api/products', {
    immediate: true,
    cacheKey: PRODUCTS_CACHE_KEY,
    transform: transformProductsData,
    onError: (error) => {
      console.error('Error loading products:', error);
    }
  });

  // Extract derived data
  const products = useMemo(() => data?.products || [], [data?.products]);
  const categories = useMemo(() => data?.categories || [], [data?.categories]);
  
  // Extract packaging options from products
  const packagingOptions = useMemo(() => {
    if (products.length === 0) return [];
    return getUniqueValues(products, 'packaging').filter(Boolean);
  }, [products]);

  // Invalidate cache
  const invalidateCache = () => {
    apiCacheUtils.invalidate(PRODUCTS_CACHE_KEY);
  };

  return {
    products,
    categories,
    packagingOptions,
    isLoading,
    error,
    refetch,
    invalidateCache
  };
}

// Hook for product statistics
export function useProductStats(products: Product[]) {
  return useMemo(() => {
    const total = products.length;
    const inStock = products.filter(p => p.stockStatus === 'in_stock').length;
    const outOfStock = products.filter(p => p.stockStatus === 'out_of_stock').length;
    const madeToOrder = products.filter(p => p.stockStatus === 'made_to_order').length;
    const limitedStock = products.filter(p => p.stockStatus === 'limited_stock').length;

    // Category statistics
    const categoryStats = products.reduce((acc, product) => {
      acc[product.category] = (acc[product.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Price analysis
    const pricesWithNumbers = products
      .map(p => {
        const match = p.price?.match(/₹(\d+\.?\d*)/);
        return match ? parseFloat(match[1]) : 0;
      })
      .filter(price => price > 0);

    const avgPrice = pricesWithNumbers.length > 0 
      ? pricesWithNumbers.reduce((sum, price) => sum + price, 0) / pricesWithNumbers.length 
      : 0;
    
    const minPrice = pricesWithNumbers.length > 0 ? Math.min(...pricesWithNumbers) : 0;
    const maxPrice = pricesWithNumbers.length > 0 ? Math.max(...pricesWithNumbers) : 0;

    return {
      total,
      inStock,
      outOfStock,
      madeToOrder,
      limitedStock,
      stockPercentage: {
        inStock: total > 0 ? (inStock / total) * 100 : 0,
        outOfStock: total > 0 ? (outOfStock / total) * 100 : 0,
        madeToOrder: total > 0 ? (madeToOrder / total) * 100 : 0,
        limitedStock: total > 0 ? (limitedStock / total) * 100 : 0,
      },
      categories: Object.keys(categoryStats).length,
      categoryStats,
      pricing: {
        average: avgPrice,
        min: minPrice,
        max: maxPrice,
        range: maxPrice - minPrice,
        count: pricesWithNumbers.length
      }
    };
  }, [products]);
}

// Hook for product queries
export function useProductQueries(products: Product[]) {
  // Get products by category
  const getProductsByCategory = (category: string) => {
    return products.filter(product => product.category === category);
  };

  // Get product by ID
  const getProductById = (id: string | number) => {
    return products.find(product => product.id.toString() === id.toString());
  };

  // Get products by stock status
  const getProductsByStockStatus = (status: string) => {
    return products.filter(product => product.stockStatus === status);
  };

  // Get products by packaging
  const getProductsByPackaging = (packaging: string) => {
    return products.filter(product => product.packaging === packaging);
  };

  // Get featured products (products with features)
  const getFeaturedProducts = () => {
    return products.filter(product => product.features && product.features.length > 0);
  };

  // Get products in price range
  const getProductsInPriceRange = (minPrice: number, maxPrice: number) => {
    return products.filter(product => {
      const match = product.price?.match(/₹(\d+\.?\d*)/);
      if (!match) return false;
      const price = parseFloat(match[1]);
      return price >= minPrice && price <= maxPrice;
    });
  };

  // Search products by name or category
  const searchProducts = (searchTerm: string) => {
    const term = searchTerm.toLowerCase();
    return products.filter(product => 
      product.name.toLowerCase().includes(term) ||
      product.category.toLowerCase().includes(term) ||
      product.catNo?.toLowerCase().includes(term) ||
      product.features?.some(feature => feature.toLowerCase().includes(term))
    );
  };

  return {
    getProductsByCategory,
    getProductById,
    getProductsByStockStatus,
    getProductsByPackaging,
    getFeaturedProducts,
    getProductsInPriceRange,
    searchProducts
  };
}

// Stock status options
export const STOCK_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'in_stock', label: 'In Stock' },
  { value: 'out_of_stock', label: 'Out of Stock' },
  { value: 'made_to_order', label: 'Made to Order' },
  { value: 'limited_stock', label: 'Limited Stock' },
] as const;

// Utility to get stock status display info
export function getStockStatusInfo(status: string) {
  const statusMap = {
    in_stock: { label: 'In Stock', color: 'green', priority: 1 },
    limited_stock: { label: 'Limited Stock', color: 'yellow', priority: 2 },
    made_to_order: { label: 'Made to Order', color: 'blue', priority: 3 },
    out_of_stock: { label: 'Out of Stock', color: 'red', priority: 4 },
  } as const;

  return statusMap[status as keyof typeof statusMap] || { 
    label: 'Unknown', 
    color: 'gray', 
    priority: 5 
  };
}