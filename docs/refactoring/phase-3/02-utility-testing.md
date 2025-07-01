# 🔧 Phase 3.2: Utility Function Testing

## 📋 Overview

Comprehensive testing of all utility functions in the `lib/` directory. This step ensures that the foundation functions powering the application are reliable and well-tested.

## 🎯 Goals

- Test all functions in `lib/utils.js/ts`
- Test price calculation logic
- Test image utility functions  
- Test product filtering logic
- Test date formatting functions
- Achieve 90%+ coverage for utility functions

## ⏱️ Estimated Time: 3-4 hours

## 🔧 Prerequisites

- Phase 3.1 (Test Setup) completed
- Jest and testing utilities configured
- Understanding of utility functions in the codebase

---

## 📁 Step 1: Audit Utility Functions

First, let's identify all utility functions that need testing:

```bash
# Find all utility files
find src/lib -name "*.ts" -o -name "*.js" | grep -v test
```

### Common Utility Files to Test:

- `src/lib/utils.ts` - General utility functions
- `src/lib/price.ts` - Price calculation logic (if exists)
- `src/lib/image-utils.ts` - Image processing utilities (if exists) 
- `src/lib/date.ts` - Date formatting utilities (if exists)
- `src/lib/productFilter.ts` - Product filtering logic (if exists)
- `src/lib/validation.ts` - Input validation utilities (if exists)

---

## 🧪 Step 2: Test General Utilities (`lib/utils.ts`)

Create `src/lib/__tests__/utils.test.ts`:

```typescript
import { 
  getBaseCatalogNumber, 
  sanitizeInput,
  formatPrice,
  generateSlug,
  debounce,
  throttle,
  isValidEmail,
  capitalizeWords
} from '@/lib/utils'

describe('lib/utils', () => {
  describe('getBaseCatalogNumber', () => {
    it('extracts base catalog number from variants', () => {
      expect(getBaseCatalogNumber('ABC-001-250')).toBe('ABC-001')
      expect(getBaseCatalogNumber('XYZ-123-500ML')).toBe('XYZ-123')
      expect(getBaseCatalogNumber('DEF-456')).toBe('DEF-456')
    })

    it('handles edge cases', () => {
      expect(getBaseCatalogNumber('')).toBe('')
      expect(getBaseCatalogNumber('ABC')).toBe('ABC')
      expect(getBaseCatalogNumber('ABC-')).toBe('ABC-')
      expect(getBaseCatalogNumber('ABC--123')).toBe('ABC-')
    })

    it('handles null and undefined inputs', () => {
      expect(getBaseCatalogNumber(null as any)).toBe('')
      expect(getBaseCatalogNumber(undefined as any)).toBe('')
    })
  })

  describe('sanitizeInput', () => {
    it('removes dangerous characters', () => {
      expect(sanitizeInput('<script>alert("xss")</script>')).toBe('scriptalert("xss")/script')
      expect(sanitizeInput('Hello <> World')).toBe('Hello  World')
      expect(sanitizeInput('Normal text')).toBe('Normal text')
    })

    it('trims whitespace', () => {
      expect(sanitizeInput('  hello world  ')).toBe('hello world')
      expect(sanitizeInput('\t\n  test  \n\t')).toBe('test')
    })

    it('handles empty inputs', () => {
      expect(sanitizeInput('')).toBe('')
      expect(sanitizeInput('   ')).toBe('')
    })
  })

  describe('formatPrice', () => {
    it('formats numbers to currency', () => {
      expect(formatPrice(100)).toBe('₹100.00')
      expect(formatPrice(99.99)).toBe('₹99.99')
      expect(formatPrice(0)).toBe('₹0.00')
    })

    it('handles string inputs', () => {
      expect(formatPrice('150')).toBe('₹150.00')
      expect(formatPrice('99.5')).toBe('₹99.50')
    })

    it('handles invalid inputs', () => {
      expect(formatPrice('invalid')).toBe('₹0.00')
      expect(formatPrice(null as any)).toBe('₹0.00')
      expect(formatPrice(undefined as any)).toBe('₹0.00')
    })
  })

  describe('generateSlug', () => {
    it('converts text to URL-friendly slug', () => {
      expect(generateSlug('Test Tubes')).toBe('test-tubes')
      expect(generateSlug('Beakers & Flasks')).toBe('beakers-flasks')
      expect(generateSlug('Lab Equipment 101')).toBe('lab-equipment-101')
    })

    it('handles special characters', () => {
      expect(generateSlug('Test @ Home!')).toBe('test-home')
      expect(generateSlug('100% Pure')).toBe('100-pure')
      expect(generateSlug('C++ Programming')).toBe('c-programming')
    })

    it('handles edge cases', () => {
      expect(generateSlug('')).toBe('')
      expect(generateSlug('   ')).toBe('')
      expect(generateSlug('---')).toBe('')
    })
  })

  describe('debounce', () => {
    beforeEach(() => {
      jest.clearAllTimers()
      jest.useFakeTimers()
    })

    afterEach(() => {
      jest.useRealTimers()
    })

    it('delays function execution', () => {
      const mockFn = jest.fn()
      const debouncedFn = debounce(mockFn, 100)

      debouncedFn()
      expect(mockFn).not.toHaveBeenCalled()

      jest.advanceTimersByTime(100)
      expect(mockFn).toHaveBeenCalledTimes(1)
    })

    it('cancels previous calls', () => {
      const mockFn = jest.fn()
      const debouncedFn = debounce(mockFn, 100)

      debouncedFn()
      debouncedFn()
      debouncedFn()

      jest.advanceTimersByTime(100)
      expect(mockFn).toHaveBeenCalledTimes(1)
    })
  })

  describe('throttle', () => {
    beforeEach(() => {
      jest.clearAllTimers()
      jest.useFakeTimers()
    })

    afterEach(() => {
      jest.useRealTimers()
    })

    it('limits function execution rate', () => {
      const mockFn = jest.fn()
      const throttledFn = throttle(mockFn, 100)

      throttledFn()
      throttledFn()
      throttledFn()

      expect(mockFn).toHaveBeenCalledTimes(1)

      jest.advanceTimersByTime(100)
      throttledFn()
      
      expect(mockFn).toHaveBeenCalledTimes(2)
    })
  })

  describe('isValidEmail', () => {
    it('validates correct email formats', () => {
      expect(isValidEmail('test@example.com')).toBe(true)
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true)
      expect(isValidEmail('test+label@example.org')).toBe(true)
    })

    it('rejects invalid email formats', () => {
      expect(isValidEmail('invalid-email')).toBe(false)
      expect(isValidEmail('test@')).toBe(false)
      expect(isValidEmail('@example.com')).toBe(false)
      expect(isValidEmail('')).toBe(false)
    })
  })

  describe('capitalizeWords', () => {
    it('capitalizes first letter of each word', () => {
      expect(capitalizeWords('test tubes')).toBe('Test Tubes')
      expect(capitalizeWords('lab equipment')).toBe('Lab Equipment')
      expect(capitalizeWords('a')).toBe('A')
    })

    it('handles edge cases', () => {
      expect(capitalizeWords('')).toBe('')
      expect(capitalizeWords('  ')).toBe('  ')
      expect(capitalizeWords('TEST')).toBe('Test')
    })
  })
})
```

---

## 💰 Step 3: Test Price Utilities

Create `src/lib/__tests__/price.test.ts`:

```typescript
import { 
  calculateDiscount,
  applyDiscountToPrices,
  extractPriceFromString,
  formatPriceRange,
  calculateTotalWithTax,
  validateCoupon
} from '@/lib/price'
import { mockCoupon } from '@/__tests__/utils/mock-data'

describe('lib/price', () => {
  describe('calculateDiscount', () => {
    it('calculates percentage discount correctly', () => {
      expect(calculateDiscount(100, 10, 'percentage')).toBe(10)
      expect(calculateDiscount(200, 15, 'percentage')).toBe(30)
      expect(calculateDiscount(50, 25, 'percentage')).toBe(12.5)
    })

    it('calculates flat discount correctly', () => {
      expect(calculateDiscount(100, 10, 'flat')).toBe(10)
      expect(calculateDiscount(200, 25, 'flat')).toBe(25)
    })

    it('applies maximum discount limits', () => {
      expect(calculateDiscount(1000, 50, 'percentage', 100)).toBe(100)
      expect(calculateDiscount(500, 20, 'percentage', 50)).toBe(50)
    })

    it('handles edge cases', () => {
      expect(calculateDiscount(0, 10, 'percentage')).toBe(0)
      expect(calculateDiscount(100, 0, 'percentage')).toBe(0)
      expect(calculateDiscount(-100, 10, 'percentage')).toBe(0)
    })
  })

  describe('applyDiscountToPrices', () => {
    it('applies discount to price strings', () => {
      expect(applyDiscountToPrices('₹100.00', 10, 'percentage')).toBe('₹90.00')
      expect(applyDiscountToPrices('₹200.00', 25, 'flat')).toBe('₹175.00')
    })

    it('applies discount to price ranges', () => {
      expect(applyDiscountToPrices('₹100.00 - ₹200.00', 10, 'percentage'))
        .toBe('₹90.00 - ₹180.00')
    })

    it('handles invalid price formats', () => {
      expect(applyDiscountToPrices('Invalid Price', 10, 'percentage'))
        .toBe('Invalid Price')
      expect(applyDiscountToPrices('', 10, 'percentage')).toBe('')
    })
  })

  describe('extractPriceFromString', () => {
    it('extracts price from various formats', () => {
      expect(extractPriceFromString('₹100.00')).toBe(100)
      expect(extractPriceFromString('₹99.99')).toBe(99.99)
      expect(extractPriceFromString('Price: ₹150.50')).toBe(150.50)
    })

    it('handles price ranges', () => {
      expect(extractPriceFromString('₹100.00 - ₹200.00')).toBe(100)
      expect(extractPriceFromString('From ₹50.00')).toBe(50)
    })

    it('handles invalid formats', () => {
      expect(extractPriceFromString('No price here')).toBe(0)
      expect(extractPriceFromString('')).toBe(0)
      expect(extractPriceFromString(null as any)).toBe(0)
    })
  })

  describe('validateCoupon', () => {
    it('validates active coupons', () => {
      const result = validateCoupon(mockCoupon, 150)
      expect(result.isValid).toBe(true)
      expect(result.discount).toBe(15) // 10% of 150
    })

    it('rejects coupons with insufficient order value', () => {
      const result = validateCoupon(mockCoupon, 50)
      expect(result.isValid).toBe(false)
      expect(result.error).toContain('minimum order')
    })

    it('rejects inactive coupons', () => {
      const inactiveCoupon = { ...mockCoupon, isActive: false }
      const result = validateCoupon(inactiveCoupon, 150)
      expect(result.isValid).toBe(false)
      expect(result.error).toContain('inactive')
    })

    it('rejects expired coupons', () => {
      const expiredCoupon = { ...mockCoupon, expiryDate: '2020-01-01' }
      const result = validateCoupon(expiredCoupon, 150)
      expect(result.isValid).toBe(false)
      expect(result.error).toContain('expired')
    })
  })
})
```

---

## 🖼️ Step 4: Test Image Utilities (if applicable)

Create `src/lib/__tests__/image-utils.test.ts`:

```typescript
import { 
  generateImageUrl,
  getImageDimensions,
  validateImageFile,
  compressImage,
  generateThumbnail
} from '@/lib/image-utils'

describe('lib/image-utils', () => {
  describe('generateImageUrl', () => {
    it('generates correct image URLs', () => {
      expect(generateImageUrl('product', 'ABC-001'))
        .toBe('/images/products/ABC-001.jpg')
      expect(generateImageUrl('category', 'beakers'))
        .toBe('/images/categories/beakers.jpg')
    })

    it('handles different image formats', () => {
      expect(generateImageUrl('product', 'ABC-001', 'png'))
        .toBe('/images/products/ABC-001.png')
    })

    it('handles missing parameters', () => {
      expect(generateImageUrl('product', ''))
        .toBe('/images/products/placeholder.jpg')
    })
  })

  describe('validateImageFile', () => {
    it('validates correct image types', () => {
      const validFile = new File([''], 'test.jpg', { type: 'image/jpeg' })
      expect(validateImageFile(validFile)).toEqual({
        isValid: true,
        error: null
      })
    })

    it('rejects invalid file types', () => {
      const invalidFile = new File([''], 'test.txt', { type: 'text/plain' })
      expect(validateImageFile(invalidFile)).toEqual({
        isValid: false,
        error: 'Invalid file type'
      })
    })

    it('rejects oversized files', () => {
      const largeFile = new File(['x'.repeat(10 * 1024 * 1024)], 'large.jpg', { 
        type: 'image/jpeg' 
      })
      expect(validateImageFile(largeFile, 5 * 1024 * 1024)).toEqual({
        isValid: false,
        error: 'File too large'
      })
    })
  })
})
```

---

## 🔍 Step 5: Test Product Filtering Logic

Create `src/lib/__tests__/product-filter.test.ts`:

```typescript
import { 
  filterProductsByCategory,
  filterProductsByPrice,
  filterProductsByStock,
  searchProducts,
  sortProducts
} from '@/lib/product-filter'
import { mockProducts } from '@/__tests__/utils/mock-data'

describe('lib/product-filter', () => {
  describe('filterProductsByCategory', () => {
    it('filters products by category', () => {
      const beakers = filterProductsByCategory(mockProducts, 'Beakers')
      expect(beakers).toHaveLength(1)
      expect(beakers[0].category).toBe('Beakers')
    })

    it('returns all products for empty category', () => {
      const all = filterProductsByCategory(mockProducts, '')
      expect(all).toHaveLength(mockProducts.length)
    })
  })

  describe('filterProductsByPrice', () => {
    it('filters by minimum price', () => {
      const filtered = filterProductsByPrice(mockProducts, 100, null)
      expect(filtered.every(p => extractPriceFromString(p.price) >= 100)).toBe(true)
    })

    it('filters by maximum price', () => {
      const filtered = filterProductsByPrice(mockProducts, null, 200)
      expect(filtered.every(p => extractPriceFromString(p.price) <= 200)).toBe(true)
    })

    it('filters by price range', () => {
      const filtered = filterProductsByPrice(mockProducts, 100, 200)
      expect(filtered.every(p => {
        const price = extractPriceFromString(p.price)
        return price >= 100 && price <= 200
      })).toBe(true)
    })
  })

  describe('filterProductsByStock', () => {
    it('filters in-stock products', () => {
      const inStock = filterProductsByStock(mockProducts, 'in_stock')
      expect(inStock.every(p => p.stockStatus === 'in_stock')).toBe(true)
    })

    it('filters out-of-stock products', () => {
      const outOfStock = filterProductsByStock(mockProducts, 'out_of_stock')
      expect(outOfStock.every(p => p.stockStatus === 'out_of_stock')).toBe(true)
    })
  })

  describe('searchProducts', () => {
    it('searches by product name', () => {
      const results = searchProducts(mockProducts, 'beaker')
      expect(results.some(p => p.name.toLowerCase().includes('beaker'))).toBe(true)
    })

    it('searches by catalog number', () => {
      const results = searchProducts(mockProducts, 'TB001')
      expect(results.some(p => p.catNo === 'TB001')).toBe(true)
    })

    it('returns empty array for no matches', () => {
      const results = searchProducts(mockProducts, 'nonexistent')
      expect(results).toHaveLength(0)
    })

    it('handles empty search term', () => {
      const results = searchProducts(mockProducts, '')
      expect(results).toHaveLength(mockProducts.length)
    })
  })

  describe('sortProducts', () => {
    it('sorts by name alphabetically', () => {
      const sorted = sortProducts(mockProducts, 'name', 'asc')
      expect(sorted[0].name <= sorted[1].name).toBe(true)
    })

    it('sorts by price numerically', () => {
      const sorted = sortProducts(mockProducts, 'price', 'asc')
      const price1 = extractPriceFromString(sorted[0].price)
      const price2 = extractPriceFromString(sorted[1].price)
      expect(price1 <= price2).toBe(true)
    })

    it('sorts in descending order', () => {
      const sorted = sortProducts(mockProducts, 'name', 'desc')
      expect(sorted[0].name >= sorted[1].name).toBe(true)
    })
  })
})
```

---

## 📅 Step 6: Test Date Utilities (if applicable)

Create `src/lib/__tests__/date.test.ts`:

```typescript
import { 
  formatDate,
  isDateExpired,
  addDaysToDate,
  getDateRange,
  formatTimestamp
} from '@/lib/date'

describe('lib/date', () => {
  describe('formatDate', () => {
    it('formats dates correctly', () => {
      const date = new Date('2024-01-15')
      expect(formatDate(date, 'YYYY-MM-DD')).toBe('2024-01-15')
      expect(formatDate(date, 'DD/MM/YYYY')).toBe('15/01/2024')
    })

    it('handles invalid dates', () => {
      expect(formatDate(new Date('invalid'), 'YYYY-MM-DD')).toBe('')
      expect(formatDate(null as any, 'YYYY-MM-DD')).toBe('')
    })
  })

  describe('isDateExpired', () => {
    it('correctly identifies expired dates', () => {
      const expired = new Date('2020-01-01')
      const future = new Date('2030-01-01')
      
      expect(isDateExpired(expired)).toBe(true)
      expect(isDateExpired(future)).toBe(false)
    })

    it('handles date strings', () => {
      expect(isDateExpired('2020-01-01')).toBe(true)
      expect(isDateExpired('2030-01-01')).toBe(false)
    })
  })

  describe('addDaysToDate', () => {
    it('adds days correctly', () => {
      const date = new Date('2024-01-01')
      const result = addDaysToDate(date, 7)
      expect(result.getDate()).toBe(8)
    })

    it('handles negative days', () => {
      const date = new Date('2024-01-08')
      const result = addDaysToDate(date, -7)
      expect(result.getDate()).toBe(1)
    })
  })
})
```

---

## ✅ Step 7: Run All Utility Tests

### Execute Tests

```bash
# Run all utility tests
npm test -- src/lib/__tests__

# Run with coverage
npm run test:coverage -- src/lib/__tests__

# Run in watch mode during development
npm run test:watch -- src/lib/__tests__
```

### Check Coverage

Aim for **90%+ coverage** on utility functions:

```bash
npm run test:coverage
```

Open `coverage/lcov-report/index.html` to see detailed coverage report.

---

## 🔧 Step 8: Performance Testing (Optional)

For performance-critical utilities, add performance tests:

```typescript
describe('Performance Tests', () => {
  it('debounce performs well with many calls', () => {
    const mockFn = jest.fn()
    const debouncedFn = debounce(mockFn, 100)
    
    const start = performance.now()
    for (let i = 0; i < 1000; i++) {
      debouncedFn()
    }
    const end = performance.now()
    
    expect(end - start).toBeLessThan(50) // Should complete in under 50ms
  })

  it('search performs well with large datasets', () => {
    const largeDataset = Array(10000).fill(mockProduct).map((p, i) => ({
      ...p,
      id: `product-${i}`,
      name: `Product ${i}`
    }))
    
    const start = performance.now()
    const results = searchProducts(largeDataset, 'Product 5000')
    const end = performance.now()
    
    expect(results).toHaveLength(1)
    expect(end - start).toBeLessThan(100) // Should complete in under 100ms
  })
})
```

---

## ✅ Verification Checklist

- [ ] All utility functions in `lib/utils` tested
- [ ] Price calculation functions tested with edge cases
- [ ] Image utility functions tested (if applicable)
- [ ] Product filtering logic comprehensively tested
- [ ] Date formatting functions tested (if applicable)
- [ ] 90%+ test coverage achieved for utility functions
- [ ] Performance tests added for critical functions
- [ ] All tests passing consistently

---

## 🚀 Next Steps

After completing utility testing:

1. **Move to Step 3:** [Component Testing](./03-component-testing.md)
2. **Begin testing core UI components**
3. **Apply testing patterns learned from utilities**

---

## 📝 Best Practices

### Test Organization
- One test file per utility file
- Group related tests with `describe` blocks
- Use descriptive test names that explain the behavior

### Edge Case Testing
- Always test with empty/null/undefined inputs
- Test boundary conditions (min/max values)
- Test invalid inputs and error conditions

### Performance Considerations
- Mock external dependencies
- Use fake timers for time-based functions
- Keep tests fast and focused

### Maintenance
- Update tests when utility functions change
- Remove tests for deprecated functions
- Keep test data fresh and realistic