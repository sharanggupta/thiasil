// Server Components Export Index
// This file centralizes all server component exports for easy importing

// Data fetching components
export { default as ProductDataFetcher, getProducts, getProductsByCategory, getProduct, getProductVariants, ProductStatsServer } from './ProductDataFetcher';

// Product display components  
export { default as ServerProductList, ServerProductListWithSuspense } from './ServerProductList';

// Metadata and SEO components
export { generateProductMetadata, generateCategoryMetadata, ProductBreadcrumbServer } from './ProductMetadataServer';

// Company information components
export { CompanyStatsServer, ContactInfoServer, CertificationsServer } from './CompanyInfoServer';

// Inline stats components
export { default as ProductStatsInline, CategoryStatsServer } from './ProductStatsInline';

// Server-side utilities
export * from '@/lib/server/data-fetchers';

// Type definitions for server components
export interface ServerComponentProps {
  children?: React.ReactNode;
  className?: string;
}

export interface ProductServerProps extends ServerComponentProps {
  catNo?: string;
  category?: string;
  limit?: number;
}