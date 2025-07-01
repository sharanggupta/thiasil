import { getProductImageInfo } from '../image-utils'

describe('Product Image Information Utility', () => {
  describe('when determining product image availability', () => {
    it('should extract catalog number from series string and generate image URL', () => {
      // Given: A catalog number with series suffix
      const catalogNumber = '1170 Series'
      
      // When: Image information is requested
      const result = getProductImageInfo(catalogNumber)
      
      // Then: Numeric part is extracted and WebP URL is generated
      expect(result.url).toBe('/images/products/1170.webp')
      expect(result.hasImage).toBe(true)
    })

    it('should extract numeric portion from complex catalog patterns', () => {
      // Given: A catalog number with prefix, number, and suffix
      const complexCatalogNumber = 'ABC-1200-XYZ'
      
      // When: Image information is requested
      const result = getProductImageInfo(complexCatalogNumber)
      
      // Then: Numeric portion is extracted for image path
      expect(result.url).toBe('/images/products/1200.webp')
      expect(result.hasImage).toBe(true)
    })

    it('should concatenate all numeric parts for multi-segment catalog numbers', () => {
      // Given: A catalog number with multiple numeric segments
      const multiNumericCatalog = '1100/50 Series'
      
      // When: Image information is requested
      const result = getProductImageInfo(multiNumericCatalog)
      
      // Then: All numeric parts are combined for image filename
      expect(result.url).toBe('/images/products/110050.webp')
      expect(result.hasImage).toBe(true)
    })

    it('should extract catalog number from product objects', () => {
      // Given: A product object with catalog number property
      const product = { catNo: '1500 Flask', name: 'Test Product' }
      
      // When: Image information is requested for the product
      const result = getProductImageInfo(product)
      
      // Then: Catalog number is extracted and image URL is generated
      expect(result.url).toBe('/images/products/1500.webp')
      expect(result.hasImage).toBe(true)
    })

    it('should use explicit image property when available on product', () => {
      // Given: A product with custom image path specified
      const productWithCustomImage = { 
        catNo: '1500 Flask', 
        image: '/custom-images/special-product.jpg',
        name: 'Test Product' 
      }
      
      // When: Image information is requested
      const result = getProductImageInfo(productWithCustomImage)
      
      // Then: Custom image path takes precedence over generated path
      expect(result.url).toBe('/custom-images/special-product.jpg')
      expect(result.hasImage).toBe(true)
    })

    it('should use fallback image when primary source is unavailable', () => {
      // Given: Empty catalog input with fallback image provided
      const emptyCatalog = ''
      const fallbackImagePath = '/fallback-image.jpg'
      
      // When: Image information is requested with fallback
      const result = getProductImageInfo(emptyCatalog, fallbackImagePath)
      
      // Then: Fallback image is used
      expect(result.url).toBe('/fallback-image.jpg')
      expect(result.hasImage).toBe(true)
    })

    it('should prioritize product image over fallback option', () => {
      // Given: Product with image and fallback provided
      const productWithImage = { image: '/product-image.jpg' }
      const fallbackImagePath = '/fallback-image.jpg'
      
      // When: Image information is requested
      const result = getProductImageInfo(productWithImage, fallbackImagePath)
      
      // Then: Product image takes priority over fallback
      expect(result.url).toBe('/product-image.jpg')
      expect(result.hasImage).toBe(true)
    })

    it('should indicate no image available when catalog and fallback are empty', () => {
      // Given: Empty catalog input with no fallback
      const emptyCatalog = ''
      
      // When: Image information is requested
      const result = getProductImageInfo(emptyCatalog)
      
      // Then: No image is available
      expect(result.url).toBe(null)
      expect(result.hasImage).toBe(false)
    })

    it('should indicate no image available for non-numeric catalog numbers', () => {
      // Given: Catalog number containing only text without numbers
      const textOnlyCatalog = 'ABC-Series'
      
      // When: Image information is requested
      const result = getProductImageInfo(textOnlyCatalog)
      
      // Then: No image can be generated without numeric identifier
      expect(result.url).toBe(null)
      expect(result.hasImage).toBe(false)
    })

    it('should handle null and undefined inputs gracefully', () => {
      // Given: Null and undefined inputs
      
      // When: Image information is requested for invalid inputs
      const nullResult = getProductImageInfo(null)
      const undefinedResult = getProductImageInfo(undefined)
      
      // Then: No image is indicated for invalid inputs
      expect(nullResult.hasImage).toBe(false)
      expect(undefinedResult.hasImage).toBe(false)
    })

    it('should handle empty product objects without errors', () => {
      // Given: Empty product object
      const emptyProduct = {}
      
      // When: Image information is requested
      const result = getProductImageInfo(emptyProduct)
      
      // Then: No image is available from empty object
      expect(result.url).toBe(null)
      expect(result.hasImage).toBe(false)
    })

    it('should handle product objects missing catalog number property', () => {
      // Given: Product object without catalog number
      const productWithoutCatalog = { name: 'Test Product', price: '100' }
      
      // When: Image information is requested
      const result = getProductImageInfo(productWithoutCatalog)
      
      // Then: No image can be determined without catalog number
      expect(result.url).toBe(null)
      expect(result.hasImage).toBe(false)
    })

    it('should generate WebP image path for simple numeric catalog numbers', () => {
      // Given: Simple numeric catalog number
      const simpleCatalog = '1000'
      
      // When: Image information is requested
      const result = getProductImageInfo(simpleCatalog)
      
      // Then: WebP image path is constructed correctly
      expect(result.url).toBe('/images/products/1000.webp')
      expect(result.hasImage).toBe(true)
    })

    it('should handle various complex catalog number patterns consistently', () => {
      // Given: Various complex catalog patterns used in laboratory equipment
      const catalogPatterns = [
        { input: 'GL-1234-50ML', expected: '/images/products/123450.webp' },
        { input: 'FLASK-500-BOROSILICATE', expected: '/images/products/500.webp' },
        { input: 'BK100/25', expected: '/images/products/10025.webp' }
      ]

      catalogPatterns.forEach(({ input, expected }) => {
        // When: Image information is requested for each pattern
        const result = getProductImageInfo(input)
        
        // Then: Numeric extraction and URL generation works consistently
        expect(result.url).toBe(expected)
        expect(result.hasImage).toBe(true)
      })
    })
  })
})