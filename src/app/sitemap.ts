import { MetadataRoute } from 'next';
import productsData from '@/data/products.json';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://thiasil.com';
  
  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/company`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.5,
    },
  ];

  // Category pages - get unique categories from products
  const uniqueCategories = [...new Set(productsData.products.map(p => p.categorySlug))].filter(Boolean);
  const categoryPages = uniqueCategories.map(categorySlug => ({
    url: `${baseUrl}/products/${categorySlug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Individual product pages
  const productPages = productsData.products.map(product => ({
    url: `${baseUrl}/products/${product.categorySlug}/${product.catNo}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  // PDF documents
  const documents = [
    {
      url: `${baseUrl}/catalog.pdf`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.4,
    },
    {
      url: `${baseUrl}/pricelist.pdf`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
  ];

  return [
    ...staticPages,
    ...categoryPages,
    ...productPages,
    ...documents,
  ];
}