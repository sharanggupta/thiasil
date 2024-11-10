export default function robots() {
const baseUrl = 'https://www.thiasil.com'
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/catalog.pdf'],
    },
    sitemap: baseUrl + '/sitemap.xml',
  }
}