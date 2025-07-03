import { Suspense } from 'react';
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

// Server component for fetching product data
export async function getProducts(): Promise<Product[]> {
  // Simulate async data fetching for server components
  await new Promise(resolve => setTimeout(resolve, 1));
  return productsData.products;
}

// Server component for fetching filtered products
export async function getProductsByCategory(category: string): Promise<Product[]> {
  await new Promise(resolve => setTimeout(resolve, 1));
  return productsData.products.filter(product => 
    product.categorySlug === category
  );
}

// Server component for fetching a single product
export async function getProduct(catNo: string): Promise<Product | null> {
  await new Promise(resolve => setTimeout(resolve, 1));
  return productsData.products.find(product => 
    product.catNo.toLowerCase() === catNo.toLowerCase()
  ) || null;
}

// Server component for product variants
export async function getProductVariants(categorySlug: string) {
  await new Promise(resolve => setTimeout(resolve, 1));
  return productsData.productVariants?.[categorySlug]?.variants || [];
}

// Server component wrapper for product data
interface ProductDataProps {
  children: (products: Product[]) => React.ReactNode;
}

export default async function ProductDataFetcher({ children }: ProductDataProps) {
  const products = await getProducts();
  return <>{children(products)}</>;
}

// Server component for product stats
export async function ProductStatsServer() {
  const products = await getProducts();
  const totalProducts = products.length;
  const categories = new Set(products.map(p => p.categorySlug)).size;
  
  return (
    <div className="text-sm text-gray-600 mb-4">
      <span>{totalProducts} products across {categories} categories</span>
    </div>
  );
}