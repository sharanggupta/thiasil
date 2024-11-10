export default function sitemap() {
const baseUrl = 'https://www.thiasil.com'
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    {
      url: baseUrl + '/catalog.pdf',
      lastModified: new Date(),
      changeFrequency: 'yearly',
    }
  ]
}