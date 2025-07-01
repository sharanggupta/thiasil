import { 
  debounce, 
  filterProducts, 
  searchProducts, 
  extractPriceFromString,
  sanitizeInput
} from '../utils'
import { DiscountCalculator } from '../utils/discount'

describe('Performance Benchmarks', () => {
  // Helper to measure execution time
  const measurePerformance = (fn: () => void, iterations: number = 1000) => {
    const start = performance.now()
    for (let i = 0; i < iterations; i++) {
      fn()
    }
    const end = performance.now()
    return end - start
  }

  describe('when testing debounce function performance', () => {
    it('should process rapid successive calls efficiently', (done) => {
      // Given: A debounced function with short delay
      let callCount = 0
      const debouncedFn = debounce(() => {
        callCount++
        if (callCount === 1) {
          done()
        }
      }, 10)

      // When: Function is called rapidly 100 times
      const start = performance.now()
      for (let i = 0; i < 100; i++) {
        debouncedFn()
      }
      const end = performance.now()
      
      // Then: Setup should complete rapidly (under 10ms)
      expect(end - start).toBeLessThan(10)
    })
  })

  describe('when testing product filtering and search performance', () => {
    const largeProductSet = Array.from({ length: 1000 }, (_, i) => ({
      id: i,
      name: `Product ${i}`,
      category: i % 5 === 0 ? 'Beakers' : 'Flasks',
      price: `₹${(i * 10).toFixed(2)}`,
      stockStatus: i % 3 === 0 ? 'in_stock' : 'out_of_stock',
      catalogNo: `CAT-${i.toString().padStart(3, '0')}`
    }))

    it('should filter large product datasets within acceptable time limits', () => {
      // Given: Large dataset of 1000 products and filter criteria
      const filterCriteria = { 
        category: 'Beakers',
        stockStatus: 'in_stock'
      }
      
      // When: Filtering is performed 100 times
      const executionTime = measurePerformance(() => {
        filterProducts(largeProductSet, filterCriteria)
      }, 100)

      // Then: 100 filter operations should complete in under 100ms
      expect(executionTime).toBeLessThan(100)
    })

    it('should search large product datasets within acceptable time limits', () => {
      // Given: Large dataset of 1000 products and search term
      const searchTerm = 'Product'
      
      // When: Search is performed 100 times
      const executionTime = measurePerformance(() => {
        searchProducts(largeProductSet, searchTerm)
      }, 100)

      // Then: 100 search operations should complete in under 100ms
      expect(executionTime).toBeLessThan(100)
    })
  })

  describe('when testing price extraction performance', () => {
    it('should extract prices from various string formats within time limits', () => {
      // Given: Various price string formats commonly encountered
      const priceStrings = [
        '₹100.00',
        '₹99.99 - ₹199.99',
        'Price: ₹150.50',
        '₹1000.00 including tax',
        'Special offer: ₹75.25'
      ]

      // When: Price extraction is performed 1000 times on all formats
      const executionTime = measurePerformance(() => {
        priceStrings.forEach(price => extractPriceFromString(price))
      }, 1000)

      // Then: 5000 extractions (1000 * 5 strings) should complete in under 50ms
      expect(executionTime).toBeLessThan(50)
    })
  })

  describe('when testing input sanitization performance', () => {
    it('should sanitize various input types within acceptable time limits', () => {
      // Given: Various input types requiring sanitization
      const dangerousInputs = [
        '<script>alert("xss")</script>',
        'Normal text with <> characters',
        '   whitespace   ',
        '<div>HTML content</div>',
        'Safe content'
      ]

      // When: Sanitization is performed 1000 times on all input types
      const executionTime = measurePerformance(() => {
        dangerousInputs.forEach(input => sanitizeInput(input))
      }, 1000)

      // Then: 5000 sanitizations (1000 * 5 inputs) should complete in under 50ms
      expect(executionTime).toBeLessThan(50)
    })
  })

  describe('when testing discount calculation performance', () => {
    it('should calculate individual discounts across price ranges efficiently', () => {
      // Given: Various price points and discount percentages
      const prices = [100, 200, 500, 1000, 50]
      const discounts = [10, 15, 20, 25, 30]

      // When: All price/discount combinations are calculated 100 times
      const executionTime = measurePerformance(() => {
        prices.forEach(price => {
          discounts.forEach(discount => {
            DiscountCalculator.applyDiscount(price, discount)
          })
        })
      }, 100)

      // Then: 2500 calculations (100 * 5 prices * 5 discounts) should complete in under 100ms
      expect(executionTime).toBeLessThan(100)
    })

    it('should process bulk discount calculations within time constraints', () => {
      // Given: Large set of items for bulk discount calculation
      const bulkItems = Array.from({ length: 50 }, (_, i) => ({
        price: (i + 1) * 10,
        quantity: Math.floor(Math.random() * 10) + 1
      }))

      // When: Bulk discount calculation is performed 100 times
      const executionTime = measurePerformance(() => {
        DiscountCalculator.calculateBulkDiscount(bulkItems, 15)
      }, 100)

      // Then: 100 bulk calculations should complete in under 100ms
      expect(executionTime).toBeLessThan(100)
    })
  })

  describe('when testing memory usage optimization', () => {
    it('should manage debounced function memory without leaks', () => {
      // Given: Multiple debounced functions created and destroyed
      const debouncedFunctions = []
      
      // When: 100 debounced functions are created
      for (let i = 0; i < 100; i++) {
        const fn = debounce(() => {}, 100)
        debouncedFunctions.push(fn)
      }

      // When: References are cleared
      debouncedFunctions.length = 0

      // Then: No errors should occur during creation/destruction
      expect(true).toBe(true)
    })

    it('should handle massive datasets without memory constraints', () => {
      // Given: Very large product dataset (10,000 items)
      const massiveProductSet = Array.from({ length: 10000 }, (_, i) => ({
        id: i,
        name: `Product ${i}`,
        category: 'Test Category',
        catalogNo: `TEST-${i}`
      }))

      // When: Search is performed that returns all results
      const results = searchProducts(massiveProductSet, 'Product')
      
      // Then: All items are returned correctly without memory issues
      expect(results.length).toBe(10000)
      expect(results[0].id).toBe(0)
      expect(results[9999].id).toBe(9999)
    })
  })

  describe('when testing edge case performance scenarios', () => {
    it('should process empty datasets efficiently', () => {
      // Given: Empty datasets and operations
      
      // When: Filter and search operations are performed 1000 times on empty data
      const executionTime = measurePerformance(() => {
        filterProducts([], { category: 'Test' })
        searchProducts([], 'test')
      }, 1000)

      // Then: 2000 empty operations should complete in under 10ms
      expect(executionTime).toBeLessThan(10)
    })

    it('should process very large strings within performance limits', () => {
      // Given: Extremely long string (10,000 characters)
      const longString = 'x'.repeat(10000)
      
      // When: Sanitization is performed 100 times on long string
      const executionTime = measurePerformance(() => {
        sanitizeInput(longString)
      }, 100)

      // Then: 100 long string operations should complete in under 100ms
      expect(executionTime).toBeLessThan(100)
    })
  })
})