import { getProduct, getProductsByCategory } from './ProductDataFetcher';
import type { Metadata } from 'next';

// Server component for generating dynamic metadata
export async function generateProductMetadata(catNo: string): Promise<Metadata> {
  const product = await getProduct(catNo);
  
  if (!product) {
    return {
      title: 'Product Not Found - Thiasil',
      description: 'The requested product could not be found.'
    };
  }

  return {
    title: `${product.name} - Thiasil Laboratory Glassware`,
    description: product.description || `High-quality ${product.name} laboratory glassware from Thiasil.`,
    keywords: [
      'laboratory glassware',
      'scientific equipment',
      product.name,
      product.categorySlug,
      'Thiasil'
    ].join(', '),
    openGraph: {
      title: `${product.name} - Thiasil`,
      description: product.description || `High-quality ${product.name} laboratory glassware`,
      images: product.image ? [product.image] : [],
      type: 'website'
    }
  };
}

// Server component for category metadata
export async function generateCategoryMetadata(category: string): Promise<Metadata> {
  const products = await getProductsByCategory(category);
  const productCount = products.length;
  
  return {
    title: `${category.charAt(0).toUpperCase() + category.slice(1)} - Thiasil Laboratory Glassware`,
    description: `Browse our collection of ${productCount} high-quality ${category} laboratory glassware products.`,
    keywords: [
      'laboratory glassware',
      'scientific equipment',
      category,
      'Thiasil'
    ].join(', ')
  };
}

// Server component for breadcrumb data
export async function ProductBreadcrumbServer({ catNo }: { catNo: string }) {
  const product = await getProduct(catNo);
  
  if (!product) return null;

  const breadcrumbItems = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Products' },
    { href: `/products/${product.categorySlug}`, label: product.categorySlug },
    { label: product.name }
  ];

  return (
    <nav className="text-sm text-gray-600 mb-4">
      {breadcrumbItems.map((item, index) => (
        <span key={index}>
          {item.href ? (
            <a href={item.href} className="hover:text-blue-600">
              {item.label}
            </a>
          ) : (
            <span className="text-gray-800 font-medium">{item.label}</span>
          )}
          {index < breadcrumbItems.length - 1 && (
            <span className="mx-2 text-gray-400">/</span>
          )}
        </span>
      ))}
    </nav>
  );
}