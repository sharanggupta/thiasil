import {
  sanitizeInput,
  extractPriceFromString,
  formatPrice,
  applyDiscountToPrice,
  getBaseCatalogNumber,
  validateEmail,
  validateRequired,
  formatDate,
  isExpired,
  debounce
} from '../utils'

describe('lib/utils', () => {
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

    it('handles non-string inputs', () => {
      expect(sanitizeInput(123)).toBe(123)
      expect(sanitizeInput(null)).toBe(null)
      expect(sanitizeInput(undefined)).toBe(undefined)
    })

    it('handles empty inputs', () => {
      expect(sanitizeInput('')).toBe('')
      expect(sanitizeInput('   ')).toBe('')
    })
  })

  describe('extractPriceFromString', () => {
    it('extracts price from various formats', () => {
      expect(extractPriceFromString('₹100.00')).toBe(100)
      expect(extractPriceFromString('₹99.99')).toBe(99.99)
      expect(extractPriceFromString('Price: ₹150.50')).toBe(150.5)
    })

    it('handles price ranges', () => {
      expect(extractPriceFromString('₹100.00 - ₹200.00')).toBe(100)
      expect(extractPriceFromString('₹50.00 - ₹300.00')).toBe(50)
    })

    it('handles numeric inputs', () => {
      expect(extractPriceFromString(150)).toBe(150)
      expect(extractPriceFromString(99.99)).toBe(99.99)
    })

    it('handles invalid formats', () => {
      expect(extractPriceFromString('No price here')).toBe(0)
      expect(extractPriceFromString('')).toBe(0)
      expect(extractPriceFromString(null as any)).toBe(0)
    })
  })

  describe('formatPrice', () => {
    it('formats numbers to currency', () => {
      expect(formatPrice(100)).toBe('₹100.00')
      expect(formatPrice(99.99)).toBe('₹99.99')
      expect(formatPrice(0)).toBe('₹0.00')
    })

    it('handles string inputs', () => {
      expect(formatPrice('₹150.00')).toBe('₹150.00')
      expect(formatPrice('₹99.50')).toBe('₹99.50')
    })

    it('handles invalid inputs', () => {
      expect(formatPrice('')).toBe('₹0.00')
      expect(formatPrice(null as any)).toBe('₹0.00')
      expect(formatPrice(undefined as any)).toBe('₹0.00')
    })
  })

  describe('applyDiscountToPrice', () => {
    it('applies percentage discount correctly', () => {
      expect(applyDiscountToPrice(100, 10)).toBe('₹90.00')
      expect(applyDiscountToPrice('₹200.00', 25)).toBe('₹150.00')
      expect(applyDiscountToPrice('₹50.00', 20)).toBe('₹40.00')
    })

    it('handles zero discount', () => {
      expect(applyDiscountToPrice(100, 0)).toBe('₹100.00')
    })

    it('handles invalid inputs', () => {
      expect(applyDiscountToPrice('', 10)).toBe('')
      expect(applyDiscountToPrice(100, 0)).toBe('₹100.00')
    })
  })

  describe('getBaseCatalogNumber', () => {
    it('extracts base catalog number correctly', () => {
      expect(getBaseCatalogNumber('1100 Series')).toBe('1100')
      expect(getBaseCatalogNumber('1100/50')).toBe('1100')
      expect(getBaseCatalogNumber('ABC-001')).toBe('ABC-001')
    })

    it('handles edge cases', () => {
      expect(getBaseCatalogNumber('')).toBe('')
      expect(getBaseCatalogNumber('ABC')).toBe('ABC')
    })
  })

  describe('validateEmail', () => {
    it('validates correct email formats', () => {
      expect(validateEmail('test@example.com')).toBe(true)
      expect(validateEmail('user.name@domain.co.uk')).toBe(true)
      expect(validateEmail('test+label@example.org')).toBe(true)
    })

    it('rejects invalid email formats', () => {
      expect(validateEmail('invalid-email')).toBe(false)
      expect(validateEmail('test@')).toBe(false)
      expect(validateEmail('@example.com')).toBe(false)
      expect(validateEmail('')).toBe(false)
    })
  })

  describe('validateRequired', () => {
    it('validates non-empty strings', () => {
      expect(validateRequired('hello')).toBe(true)
      expect(validateRequired('test 123')).toBe(true)
    })

    it('rejects empty or whitespace-only strings', () => {
      expect(validateRequired('')).toBe(false)
      expect(validateRequired('   ')).toBe(false)
      expect(validateRequired('\t\n')).toBe(false)
    })
  })

  describe('formatDate', () => {
    it('formats dates correctly', () => {
      const date = new Date('2024-01-15T10:30:00')
      const formatted = formatDate(date)
      expect(formatted).toContain('Jan')
      expect(formatted).toContain('15')
      expect(formatted).toContain('2024')
    })

    it('handles string dates', () => {
      const formatted = formatDate('2024-01-15')
      expect(formatted).toContain('Jan')
      expect(formatted).toContain('15')
      expect(formatted).toContain('2024')
    })

    it('handles invalid dates', () => {
      expect(formatDate('')).toBe('')
      expect(formatDate(null as any)).toBe('')
    })
  })

  describe('isExpired', () => {
    it('correctly identifies expired dates', () => {
      const pastDate = new Date('2020-01-01')
      const futureDate = new Date('2030-01-01')
      
      expect(isExpired(pastDate)).toBe(true)
      expect(isExpired(futureDate)).toBe(false)
    })

    it('handles date strings', () => {
      expect(isExpired('2020-01-01')).toBe(true)
      expect(isExpired('2030-01-01')).toBe(false)
    })

    it('handles invalid dates', () => {
      expect(isExpired('')).toBe(false)
      expect(isExpired(null as any)).toBe(false)
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
})