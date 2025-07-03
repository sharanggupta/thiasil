import { Suspense } from 'react';
import ProductCard from '@/app/components/ui/ProductCard';
import { getProducts, getProductsByCategory } from './ProductDataFetcher';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';

interface ServerProductListProps {
  category?: string;
  limit?: number;
  className?: string;
}

// Server component for rendering product list
export default async function ServerProductList({ 
  category, 
  limit, 
  className = '' 
}: ServerProductListProps) {
  const products = category 
    ? await getProductsByCategory(category)
    : await getProducts();
    
  const displayProducts = limit ? products.slice(0, limit) : products;

  if (displayProducts.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <p className="text-gray-500">No products found</p>
      </div>
    );
  }

  return (
    <div className={`grid gap-6 ${className}`}>
      {displayProducts.map((product) => (
        <ProductCard 
          key={product.catNo} 
          product={product} 
        />
      ))}
    </div>
  );
}

// Server component wrapper with Suspense
export function ServerProductListWithSuspense(props: ServerProductListProps) {
  return (
    <Suspense fallback={
      <div className="grid gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <LoadingSpinner size="medium" />
          </div>
        ))}
      </div>
    }>
      <ServerProductList {...props} />
    </Suspense>
  );
}