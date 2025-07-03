import { fetchAllProducts, fetchProductStats } from '@/lib/server/data-fetchers';

// Server component for inline product statistics
export default async function ProductStatsInline() {
  const stats = await fetchProductStats();
  
  return (
    <div className="text-sm text-gray-600 mb-4 bg-white/5 rounded-lg p-3">
      <span className="font-medium">
        {stats.totalProducts} products across {stats.categoriesCount} categories
      </span>
      <span className="text-gray-500 ml-2">
        • Updated {new Date(stats.lastUpdated).toLocaleDateString()}
      </span>
    </div>
  );
}

// Server component for category-specific stats
export async function CategoryStatsServer({ category }: { category: string }) {
  const products = await fetchAllProducts();
  const categoryProducts = products.filter(p => p.categorySlug === category);
  
  return (
    <div className="text-sm text-white/80 mb-4">
      <span className="font-medium">
        {categoryProducts.length} products in {category}
      </span>
    </div>
  );
}