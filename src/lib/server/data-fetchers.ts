// Server-side data fetching utilities
// These functions run only on the server and can access databases, APIs, etc.

import productsData from '@/data/products.json';

// Product type definition
interface Product {
  id: number;
  name: string;
  category: string;
  categorySlug: string;
  catNo: string;
  description?: string;
  image?: string;
  features?: string[];
}

// Cache for server-side data
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getCachedData<T>(key: string): T | null {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data as T;
  }
  return null;
}

function setCachedData<T>(key: string, data: T): void {
  cache.set(key, { data, timestamp: Date.now() });
}

// Server-side product data fetchers
export async function fetchAllProducts(): Promise<Product[]> {
  const cacheKey = 'all-products';
  const cached = getCachedData<Product[]>(cacheKey);
  if (cached) return cached;

  // Simulate async database/API call
  await new Promise(resolve => setTimeout(resolve, 10));
  
  const products = productsData.products as Product[];
  setCachedData(cacheKey, products);
  return products;
}

export async function fetchProductByCategory(category: string): Promise<Product[]> {
  const cacheKey = `products-category-${category}`;
  const cached = getCachedData<Product[]>(cacheKey);
  if (cached) return cached;

  const allProducts = await fetchAllProducts();
  const filtered = allProducts.filter(product => 
    product.categorySlug === category
  );
  
  setCachedData(cacheKey, filtered);
  return filtered;
}

export async function fetchProductByCatNo(catNo: string): Promise<Product | null> {
  const cacheKey = `product-${catNo.toLowerCase()}`;
  const cached = getCachedData<Product | null>(cacheKey);
  if (cached !== null) return cached;

  const allProducts = await fetchAllProducts();
  const product = allProducts.find(p => 
    p.catNo.toLowerCase() === catNo.toLowerCase()
  ) || null;
  
  setCachedData(cacheKey, product);
  return product;
}

export async function fetchProductVariants(categorySlug: string) {
  const cacheKey = `variants-${categorySlug}`;
  const cached = getCachedData<any[]>(cacheKey);
  if (cached) return cached;

  // Simulate async call
  await new Promise(resolve => setTimeout(resolve, 5));
  
  const variants = productsData.productVariants?.[categorySlug]?.variants || [];
  setCachedData(cacheKey, variants);
  return variants;
}

// Server-side analytics and stats
export async function fetchProductStats() {
  const cacheKey = 'product-stats';
  const cached = getCachedData<any>(cacheKey);
  if (cached) return cached;

  const products = await fetchAllProducts();
  const stats = {
    totalProducts: products.length,
    categoriesCount: new Set(products.map(p => p.categorySlug)).size,
    lastUpdated: new Date().toISOString()
  };
  
  setCachedData(cacheKey, stats);
  return stats;
}

// Server-side search functionality
export async function searchProducts(query: string): Promise<Product[]> {
  if (!query || query.trim().length === 0) return [];
  
  const cacheKey = `search-${query.toLowerCase()}`;
  const cached = getCachedData<Product[]>(cacheKey);
  if (cached) return cached;

  const allProducts = await fetchAllProducts();
  const searchTerms = query.toLowerCase().split(' ');
  
  const results = allProducts.filter(product => {
    const searchableText = [
      product.name,
      product.description,
      product.catNo,
      product.categorySlug
    ].join(' ').toLowerCase();
    
    return searchTerms.every(term => searchableText.includes(term));
  });
  
  setCachedData(cacheKey, results);
  return results;
}