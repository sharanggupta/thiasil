import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://www.thiasil.com';
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/catalog.pdf'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}