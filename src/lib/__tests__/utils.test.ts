import {
  sanitizeInput,
  extractPriceFromString,
  formatPrice,
  applyDiscountToPrice,
  applyDiscountToPriceRange,
  getBaseCatalogNumber,
  getStockStatusConfig,
  getStockStatusDisplay,
  validateEmail,
  validatePrice,
  validateRequired,
  validateLength,
  getUniqueValues,
  groupBy,
  formatDate,
  isExpired,
  formatFileSize,
  validateImageFile,
  saveSession,
  clearSession,
  isSessionValid,
  debounce,
  handleApiError,
  filterProducts,
  searchProducts,
  calculatePriceRange,
  updateCategoryPriceRange
} from '../utils'

describe('Input Sanitization', () => {
  describe('when removing dangerous HTML content', () => {
    it('should remove script tags to prevent XSS attacks', () => {
      // Given: Malicious script input
      const maliciousInput = '<script>alert("xss")</script>'
      
      // When: Input is sanitized
      const result = sanitizeInput(maliciousInput)
      
      // Then: Script tags are removed but content remains
      expect(result).toBe('scriptalert("xss")/script')
    })

    it('should remove HTML angle brackets while preserving content', () => {
      // Given: Input with HTML-like content
      const htmlInput = 'Hello <> World'
      
      // When: Input is sanitized
      const result = sanitizeInput(htmlInput)
      
      // Then: Angle brackets are removed but text remains
      expect(result).toBe('Hello  World')
    })

    it('should preserve safe text without modification', () => {
      // Given: Safe text input
      const safeInput = 'Normal text'
      
      // When: Input is sanitized
      const result = sanitizeInput(safeInput)
      
      // Then: Text remains unchanged
      expect(result).toBe('Normal text')
    })
  })

  describe('when cleaning whitespace', () => {
    it('should trim leading and trailing whitespace', () => {
      // Given: Input with surrounding whitespace
      const paddedInput = '  hello world  '
      
      // When: Input is sanitized
      const result = sanitizeInput(paddedInput)
      
      // Then: Whitespace is trimmed
      expect(result).toBe('hello world')
    })

    it('should normalize complex whitespace patterns', () => {
      // Given: Input with tabs and newlines
      const messyInput = '\t\n  test  \n\t'
      
      // When: Input is sanitized
      const result = sanitizeInput(messyInput)
      
      // Then: All whitespace is normalized
      expect(result).toBe('test')
    })

    it('should return empty string when input is only whitespace', () => {
      // Given: Input that is only whitespace
      const whitespaceInput = '   '
      
      // When: Input is sanitized
      const result = sanitizeInput(whitespaceInput)
      
      // Then: Empty string is returned
      expect(result).toBe('')
    })
  })

  describe('when handling non-string inputs', () => {
    it('should pass through numeric values unchanged', () => {
      // Given: Numeric input
      const numericInput = 123
      
      // When: Input is sanitized
      const result = sanitizeInput(numericInput)
      
      // Then: Number is returned as-is
      expect(result).toBe(123)
    })

    it('should pass through null values unchanged', () => {
      // Given: Null input
      const nullInput = null
      
      // When: Input is sanitized
      const result = sanitizeInput(nullInput)
      
      // Then: Null is returned as-is
      expect(result).toBe(null)
    })

    it('should pass through undefined values unchanged', () => {
      // Given: Undefined input
      const undefinedInput = undefined
      
      // When: Input is sanitized
      const result = sanitizeInput(undefinedInput)
      
      // Then: Undefined is returned as-is
      expect(result).toBe(undefined)
    })
  })

  it('should return empty string for empty input', () => {
    // Given: Empty string input
    const emptyInput = ''
    
    // When: Input is sanitized
    const result = sanitizeInput(emptyInput)
    
    // Then: Empty string is returned
    expect(result).toBe('')
  })
})

describe('Price Extraction', () => {
  describe('when extracting prices from formatted strings', () => {
    it('should extract numeric value from currency formatted prices', () => {
      // Given: Currency formatted price strings
      const currencyPrice = '₹100.00'
      const decimalPrice = '₹99.99'
      const prefixedPrice = 'Price: ₹150.50'
      
      // When: Prices are extracted
      const result1 = extractPriceFromString(currencyPrice)
      const result2 = extractPriceFromString(decimalPrice)
      const result3 = extractPriceFromString(prefixedPrice)
      
      // Then: Numeric values are returned
      expect(result1).toBe(100)
      expect(result2).toBe(99.99)
      expect(result3).toBe(150.5)
    })

    it('should extract lowest price from price ranges', () => {
      // Given: Price range strings
      const range1 = '₹100.00 - ₹200.00'
      const range2 = '₹50.00 - ₹300.00'
      
      // When: Prices are extracted from ranges
      const result1 = extractPriceFromString(range1)
      const result2 = extractPriceFromString(range2)
      
      // Then: Lowest price in range is returned
      expect(result1).toBe(100)
      expect(result2).toBe(50)
    })

    it('should pass through numeric values unchanged', () => {
      // Given: Numeric price values
      const integerPrice = 150
      const decimalPrice = 99.99
      
      // When: Numeric prices are processed
      const result1 = extractPriceFromString(integerPrice)
      const result2 = extractPriceFromString(decimalPrice)
      
      // Then: Values are returned unchanged
      expect(result1).toBe(150)
      expect(result2).toBe(99.99)
    })

    it('should return zero for invalid price formats', () => {
      // Given: Invalid price inputs
      const textInput = 'No price here'
      const emptyInput = ''
      const nullInput = null as any
      
      // When: Invalid inputs are processed
      const result1 = extractPriceFromString(textInput)
      const result2 = extractPriceFromString(emptyInput)
      const result3 = extractPriceFromString(nullInput)
      
      // Then: Zero is returned as fallback
      expect(result1).toBe(0)
      expect(result2).toBe(0)
      expect(result3).toBe(0)
    })
  })
})

describe('Price Formatting', () => {
  describe('when formatting prices for display', () => {
    it('should convert numeric values to currency format', () => {
      // Given: Numeric price values
      const wholeNumber = 100
      const decimal = 99.99
      const zero = 0
      
      // When: Values are formatted for display
      const result1 = formatPrice(wholeNumber)
      const result2 = formatPrice(decimal)
      const result3 = formatPrice(zero)
      
      // Then: Currency formatted strings are returned
      expect(result1).toBe('₹100.00')
      expect(result2).toBe('₹99.99')
      expect(result3).toBe('₹0.00')
    })

    it('should preserve already formatted currency strings', () => {
      // Given: Pre-formatted currency strings
      const formatted1 = '₹150.00'
      const formatted2 = '₹99.50'
      
      // When: Formatted strings are processed
      const result1 = formatPrice(formatted1)
      const result2 = formatPrice(formatted2)
      
      // Then: Strings are returned unchanged
      expect(result1).toBe('₹150.00')
      expect(result2).toBe('₹99.50')
    })

    it('should format invalid inputs as zero currency', () => {
      // Given: Invalid price inputs
      const emptyString = ''
      const nullValue = null as any
      const undefinedValue = undefined as any
      
      // When: Invalid inputs are formatted
      const result1 = formatPrice(emptyString)
      const result2 = formatPrice(nullValue)
      const result3 = formatPrice(undefinedValue)
      
      // Then: Zero currency format is returned
      expect(result1).toBe('₹0.00')
      expect(result2).toBe('₹0.00')
      expect(result3).toBe('₹0.00')
    })
  })
})

describe('Discount Calculation', () => {
  describe('when applying percentage discounts to prices', () => {
    it('should calculate discounted price correctly', () => {
      // Given: Original prices and discount percentages
      const price1 = 100
      const price2 = '₹200.00'
      const price3 = '₹50.00'
      
      // When: Discounts are applied
      const result1 = applyDiscountToPrice(price1, 10)
      const result2 = applyDiscountToPrice(price2, 25)
      const result3 = applyDiscountToPrice(price3, 20)
      
      // Then: Prices are reduced by the discount percentage
      expect(result1).toBe('₹90.00')
      expect(result2).toBe('₹150.00')
      expect(result3).toBe('₹40.00')
    })

    it('should return original price when no discount is applied', () => {
      // Given: A price with zero discount
      const originalPrice = 100
      const noDiscount = 0
      
      // When: Zero discount is applied
      const result = applyDiscountToPrice(originalPrice, noDiscount)
      
      // Then: Original price is returned formatted
      expect(result).toBe('₹100.00')
    })

    it('should handle invalid price inputs gracefully', () => {
      // Given: Invalid price input
      const invalidPrice = ''
      const validDiscount = 10
      
      // When: Discount is applied to invalid price
      const result = applyDiscountToPrice(invalidPrice, validDiscount)
      
      // Then: Empty string is returned
      expect(result).toBe('')
    })
  })
})

describe('Catalog Number Processing', () => {
  describe('when extracting base catalog numbers', () => {
    it('should extract numeric prefix from series numbers', () => {
      // Given: Catalog numbers with series suffixes
      const seriesNumber = '1100 Series'
      const variantNumber = '1100/50'
      const simpleNumber = 'ABC-001'
      
      // When: Base numbers are extracted
      const result1 = getBaseCatalogNumber(seriesNumber)
      const result2 = getBaseCatalogNumber(variantNumber)
      const result3 = getBaseCatalogNumber(simpleNumber)
      
      // Then: Base catalog numbers are returned
      expect(result1).toBe('1100')
      expect(result2).toBe('1100')
      expect(result3).toBe('ABC-001')
    })

    it('should handle edge cases gracefully', () => {
      // Given: Edge case inputs
      const emptyInput = ''
      const simpleInput = 'ABC'
      
      // When: Base numbers are extracted
      const result1 = getBaseCatalogNumber(emptyInput)
      const result2 = getBaseCatalogNumber(simpleInput)
      
      // Then: Inputs are returned as-is
      expect(result1).toBe('')
      expect(result2).toBe('ABC')
    })
  })
})

describe('Email Validation', () => {
  describe('when validating email addresses', () => {
    it('should accept properly formatted email addresses', () => {
      // Given: Valid email formats
      const basicEmail = 'test@example.com'
      const domainWithSubdomain = 'user.name@domain.co.uk'
      const emailWithLabel = 'test+label@example.org'
      
      // When: Emails are validated
      const result1 = validateEmail(basicEmail)
      const result2 = validateEmail(domainWithSubdomain)
      const result3 = validateEmail(emailWithLabel)
      
      // Then: All should be accepted as valid
      expect(result1).toBe(true)
      expect(result2).toBe(true)
      expect(result3).toBe(true)
    })

    it('should reject malformed email addresses', () => {
      // Given: Invalid email formats
      const missingAtSign = 'invalid-email'
      const missingDomain = 'test@'
      const missingUser = '@example.com'
      const emptyString = ''
      
      // When: Invalid emails are validated
      const result1 = validateEmail(missingAtSign)
      const result2 = validateEmail(missingDomain)
      const result3 = validateEmail(missingUser)
      const result4 = validateEmail(emptyString)
      
      // Then: All should be rejected as invalid
      expect(result1).toBe(false)
      expect(result2).toBe(false)
      expect(result3).toBe(false)
      expect(result4).toBe(false)
    })
  })
})

describe('Required Field Validation', () => {
  describe('when validating required fields', () => {
    it('should accept fields with meaningful content', () => {
      // Given: Strings with actual content
      const textContent = 'hello'
      const mixedContent = 'test 123'
      
      // When: Content is validated as required
      const result1 = validateRequired(textContent)
      const result2 = validateRequired(mixedContent)
      
      // Then: Content should be accepted
      expect(result1).toBe(true)
      expect(result2).toBe(true)
    })

    it('should reject empty or whitespace-only fields', () => {
      // Given: Empty or whitespace-only inputs
      const emptyString = ''
      const spacesOnly = '   '
      const whitespaceChars = '\t\n'
      
      // When: Empty inputs are validated
      const result1 = validateRequired(emptyString)
      const result2 = validateRequired(spacesOnly)
      const result3 = validateRequired(whitespaceChars)
      
      // Then: All should be rejected
      expect(result1).toBe(false)
      expect(result2).toBe(false)
      expect(result3).toBe(false)
    })
  })
})

describe('Date Formatting', () => {
  describe('when formatting dates for display', () => {
    it('should format Date objects into readable strings', () => {
      // Given: A specific date object
      const dateObject = new Date('2024-01-15T10:30:00')
      
      // When: Date is formatted for display
      const result = formatDate(dateObject)
      
      // Then: Formatted string contains expected date components
      expect(result).toContain('Jan')
      expect(result).toContain('15')
      expect(result).toContain('2024')
    })

    it('should format date strings into readable format', () => {
      // Given: A date string
      const dateString = '2024-01-15'
      
      // When: Date string is formatted
      const result = formatDate(dateString)
      
      // Then: Formatted output contains expected components
      expect(result).toContain('Jan')
      expect(result).toContain('15')
      expect(result).toContain('2024')
    })

    it('should return empty string for invalid date inputs', () => {
      // Given: Invalid date inputs
      const emptyString = ''
      const nullValue = null as any
      
      // When: Invalid dates are formatted
      const result1 = formatDate(emptyString)
      const result2 = formatDate(nullValue)
      
      // Then: Empty strings are returned
      expect(result1).toBe('')
      expect(result2).toBe('')
    })
  })
})

describe('Date Expiration Checking', () => {
  describe('when checking if dates have expired', () => {
    it('should identify past dates as expired and future dates as current', () => {
      // Given: Past and future dates
      const pastDate = new Date('2020-01-01')
      const futureDate = new Date('2030-01-01')
      
      // When: Expiration status is checked
      const pastResult = isExpired(pastDate)
      const futureResult = isExpired(futureDate)
      
      // Then: Past dates are expired, future dates are not
      expect(pastResult).toBe(true)
      expect(futureResult).toBe(false)
    })

    it('should handle date strings correctly', () => {
      // Given: Date strings representing past and future
      const pastDateString = '2020-01-01'
      const futureDateString = '2030-01-01'
      
      // When: Expiration is checked for date strings
      const pastResult = isExpired(pastDateString)
      const futureResult = isExpired(futureDateString)
      
      // Then: Correct expiration status is returned
      expect(pastResult).toBe(true)
      expect(futureResult).toBe(false)
    })

    it('should treat invalid dates as not expired', () => {
      // Given: Invalid date inputs
      const emptyString = ''
      const nullValue = null as any
      
      // When: Expiration is checked for invalid dates
      const result1 = isExpired(emptyString)
      const result2 = isExpired(nullValue)
      
      // Then: False is returned (not expired) for safety
      expect(result1).toBe(false)
      expect(result2).toBe(false)
    })
  })
})

describe('Price Range Discount Application', () => {
  describe('when applying discounts to price ranges', () => {
    it('should apply discount to both minimum and maximum prices', () => {
      // Given: Price ranges and discount percentages
      const range1 = '₹100.00 - ₹200.00'
      const range2 = '₹50.00 - ₹150.00'
      
      // When: Discounts are applied to ranges
      const result1 = applyDiscountToPriceRange(range1, 10)
      const result2 = applyDiscountToPriceRange(range2, 25)
      
      // Then: Both prices in range are discounted
      expect(result1).toBe('₹90.00 - ₹180.00')
      expect(result2).toBe('₹37.50 - ₹112.50')
    })

    it('should handle single prices as simple discount application', () => {
      // Given: Single price string
      const singlePrice = '₹100.00'
      const discount = 10
      
      // When: Discount is applied to single price
      const result = applyDiscountToPriceRange(singlePrice, discount)
      
      // Then: Discounted single price is returned
      expect(result).toBe('₹90.00')
    })

    it('should return original input for invalid price formats', () => {
      // Given: Invalid price format and zero discount
      const invalidPrice = 'Invalid Price'
      const validRange = '₹100.00 - ₹200.00'
      
      // When: Discount is applied to invalid format or zero discount
      const result1 = applyDiscountToPriceRange(invalidPrice, 10)
      const result2 = applyDiscountToPriceRange(validRange, 0)
      
      // Then: Original inputs are returned unchanged
      expect(result1).toBe('Invalid Price')
      expect(result2).toBe('₹100.00 - ₹200.00')
    })
  })
})

describe('Stock Status Configuration', () => {
  describe('when retrieving stock status configurations', () => {
    it('should provide complete configuration for known stock statuses', () => {
      // Given: A known stock status
      const knownStatus = 'in_stock'
      
      // When: Configuration is retrieved
      const config = getStockStatusConfig(knownStatus)
      
      // Then: Complete configuration object is returned
      expect(config).toHaveProperty('label')
      expect(config).toHaveProperty('color')
      expect(config).toHaveProperty('bg')
    })

    it('should provide fallback configuration for unknown statuses', () => {
      // Given: An unknown stock status
      const unknownStatus = 'unknown_status'
      
      // When: Configuration is retrieved for unknown status
      const config = getStockStatusConfig(unknownStatus)
      
      // Then: Default configuration is returned to prevent errors
      expect(config).toHaveProperty('label')
      expect(config).toHaveProperty('color')
      expect(config).toHaveProperty('bg')
    })
  })
})

describe('Stock Status Display Properties', () => {
  describe('when getting display properties for stock status', () => {
    it('should provide formatted display properties for UI rendering', () => {
      // Given: A stock status
      const stockStatus = 'in_stock'
      
      // When: Display properties are retrieved
      const display = getStockStatusDisplay(stockStatus)
      
      // Then: UI-ready properties are returned
      expect(display).toHaveProperty('label')
      expect(display).toHaveProperty('className')
      expect(typeof display.label).toBe('string')
      expect(typeof display.className).toBe('string')
    })
  })
})

describe('Price Format Validation', () => {
  describe('when validating price formats', () => {
    it('should accept properly formatted price values', () => {
      // Given: Valid price formats
      const currencyPrice = '₹100.00'
      const decimalPrice = '₹99.99'
      const zeroPrice = '₹0.00'
      const numericPrice = '100'
      const decimalNumeric = '99.99'
      
      // When: Prices are validated
      const result1 = validatePrice(currencyPrice)
      const result2 = validatePrice(decimalPrice)
      const result3 = validatePrice(zeroPrice)
      const result4 = validatePrice(numericPrice)
      const result5 = validatePrice(decimalNumeric)
      
      // Then: All valid formats are accepted
      expect(result1).toBe(true)
      expect(result2).toBe(true)
      expect(result3).toBe(true)
      expect(result4).toBe(true) // Currency symbol is optional
      expect(result5).toBe(true)
    })

    it('should reject invalid price formats', () => {
      // Given: Invalid price formats
      const tooManyDecimals = '100.123'
      const textValue = 'invalid'
      const emptyString = ''
      const symbolOnly = '₹'
      const multipleDecimals = '100.1.2'
      
      // When: Invalid prices are validated
      const result1 = validatePrice(tooManyDecimals)
      const result2 = validatePrice(textValue)
      const result3 = validatePrice(emptyString)
      const result4 = validatePrice(symbolOnly)
      const result5 = validatePrice(multipleDecimals)
      
      // Then: All invalid formats are rejected
      expect(result1).toBe(false) // Too many decimal places
      expect(result2).toBe(false)
      expect(result3).toBe(false)
      expect(result4).toBe(false) // Just symbol
      expect(result5).toBe(false) // Multiple decimal points
    })
  })
})

describe('String Length Validation', () => {
  describe('when validating string length constraints', () => {
    it('should accept strings within the specified length limit', () => {
      // Given: Strings within acceptable length
      const shortString = 'hello'
      const exactLengthString = 'test'
      
      // When: Length validation is performed
      const result1 = validateLength(shortString, 10)
      const result2 = validateLength(exactLengthString, 5)
      
      // Then: Strings within limit are accepted
      expect(result1).toBe(true)
      expect(result2).toBe(true)
    })

    it('should reject strings exceeding the length limit', () => {
      // Given: String longer than allowed limit
      const longString = 'very long string'
      const limit = 5
      
      // When: Length validation is performed
      const result = validateLength(longString, limit)
      
      // Then: Long string is rejected
      expect(result).toBe(false)
    })

    it('should handle edge cases correctly', () => {
      // Given: Edge case inputs
      const emptyString = ''
      const exactLengthString = 'exact'
      const limit = 5
      
      // When: Edge cases are validated
      const result1 = validateLength(emptyString, limit)
      const result2 = validateLength(exactLengthString, limit)
      
      // Then: Empty string fails, exact length passes
      expect(result1).toBe(false) // Empty string should fail
      expect(result2).toBe(true)
    })
  })
})

describe('Unique Value Extraction', () => {
  describe('when extracting unique values from object arrays', () => {
    const testData = [
      { category: 'A', name: 'Item 1' },
      { category: 'B', name: 'Item 2' },
      { category: 'A', name: 'Item 3' },
      { category: 'C', name: 'Item 4' }
    ]

    it('should extract unique values from specified property', () => {
      // Given: Array with duplicate category values
      
      // When: Unique categories are extracted
      const uniqueCategories = getUniqueValues(testData, 'category')
      
      // Then: Only unique values are returned in order
      expect(uniqueCategories).toEqual(['A', 'B', 'C'])
    })

    it('should filter out falsy values from results', () => {
      // Given: Array with null/falsy values
      const dataWithNull = [...testData, { category: null, name: 'Item 5' }]
      
      // When: Unique values are extracted
      const uniqueCategories = getUniqueValues(dataWithNull, 'category')
      
      // Then: Falsy values are excluded from results
      expect(uniqueCategories).toEqual(['A', 'B', 'C'])
    })
  })
})

describe('Array Grouping', () => {
  describe('when grouping arrays by property values', () => {
    const testData = [
      { category: 'A', name: 'Item 1' },
      { category: 'B', name: 'Item 2' },
      { category: 'A', name: 'Item 3' }
    ]

    it('should organize items into groups by specified key', () => {
      // Given: Array with items having categorizable properties
      
      // When: Items are grouped by category
      const grouped = groupBy(testData, 'category')
      
      // Then: Items are organized into separate category groups
      expect(grouped).toHaveProperty('A')
      expect(grouped).toHaveProperty('B')
      expect(grouped.A).toHaveLength(2)
      expect(grouped.B).toHaveLength(1)
    })

    it('should return empty object for empty input arrays', () => {
      // Given: Empty array
      const emptyArray: any[] = []
      
      // When: Grouping is attempted
      const grouped = groupBy(emptyArray, 'category')
      
      // Then: Empty object is returned
      expect(grouped).toEqual({})
    })
  })
})

describe('File Size Formatting', () => {
  describe('when formatting file sizes for human readability', () => {
    it('should convert bytes to appropriate units', () => {
      // Given: File sizes in bytes
      const zeroBytes = 0
      const kilobytes = 1024
      const megabytes = 1024 * 1024
      const gigabytes = 1024 * 1024 * 1024
      
      // When: Sizes are formatted
      const result1 = formatFileSize(zeroBytes)
      const result2 = formatFileSize(kilobytes)
      const result3 = formatFileSize(megabytes)
      const result4 = formatFileSize(gigabytes)
      
      // Then: Human-readable format is returned
      expect(result1).toBe('0 Bytes')
      expect(result2).toBe('1 KB')
      expect(result3).toBe('1 MB')
      expect(result4).toBe('1 GB')
    })

    it('should handle fractional unit values correctly', () => {
      // Given: File sizes that result in decimal units
      const partialKB = 1536 // 1.5 KB
      const partialMB = 1536 * 1024 // 1.5 MB
      
      // When: Decimal sizes are formatted
      const result1 = formatFileSize(partialKB)
      const result2 = formatFileSize(partialMB)
      
      // Then: Decimal units are displayed appropriately
      expect(result1).toBe('1.5 KB')
      expect(result2).toBe('1.5 MB')
    })
  })
})

describe('Image File Validation', () => {
  describe('when validating uploaded image files', () => {
    it('should accept valid image files', () => {
      // Given: A properly formatted image file
      const validImageFile = new File([''], 'test.jpg', { type: 'image/jpeg' })
      
      // When: File is validated
      const result = validateImageFile(validImageFile)
      
      // Then: File is accepted as valid
      expect(result.valid).toBe(true)
    })

    it('should reject non-image file types', () => {
      // Given: A non-image file
      const textFile = new File([''], 'test.txt', { type: 'text/plain' })
      
      // When: Non-image file is validated
      const result = validateImageFile(textFile)
      
      // Then: File is rejected with appropriate error
      expect(result.valid).toBe(false)
      expect(result.error).toContain('Invalid file type')
    })

    it('should reject files exceeding size limits', () => {
      // Given: An oversized image file (6MB > typical 5MB limit)
      const oversizedFile = new File(['x'.repeat(6 * 1024 * 1024)], 'large.jpg', { 
        type: 'image/jpeg' 
      })
      
      // When: Oversized file is validated
      const result = validateImageFile(oversizedFile)
      
      // Then: File is rejected for size violation
      expect(result.valid).toBe(false)
      expect(result.error).toContain('File size too large')
    })
  })
})

describe('Session Management', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('when saving user sessions', () => {
    it('should persist session data to localStorage', () => {
      // Given: User credentials for session
      const username = 'testuser'
      const password = 'testpass'
      
      // When: Session is saved
      saveSession(username, password)
      
      // Then: Session data is stored in localStorage
      const saved = localStorage.getItem('adminSession')
      expect(saved).toBeTruthy()
      
      const session = JSON.parse(saved!)
      expect(session.username).toBe('testuser')
      expect(session.password).toBe('testpass')
      expect(session.timestamp).toBeTruthy()
    })
  })

  describe('when clearing user sessions', () => {
    it('should remove session data from localStorage', () => {
      // Given: An existing saved session
      saveSession('testuser', 'testpass')
      
      // When: Session is cleared
      clearSession()
      
      // Then: No session data remains in localStorage
      expect(localStorage.getItem('adminSession')).toBeNull()
    })
  })

  describe('when validating session status', () => {
    it('should accept sessions within valid time window', () => {
      // Given: A recent session (10 minutes ago)
      const recentSession = {
        timestamp: Date.now() - 10 * 60 * 1000,
        username: 'test',
        password: 'test'
      }
      
      // When: Session validity is checked
      const result = isSessionValid(recentSession)
      
      // Then: Recent session is considered valid
      expect(result).toBe(true)
    })

    it('should reject sessions beyond expiration time', () => {
      // Given: An old session (40 minutes ago)
      const expiredSession = {
        timestamp: Date.now() - 40 * 60 * 1000,
        username: 'test',
        password: 'test'
      }
      
      // When: Session validity is checked
      const result = isSessionValid(expiredSession)
      
      // Then: Expired session is considered invalid
      expect(result).toBe(false)
    })

    it('should reject null or missing sessions', () => {
      // Given: Null session data
      const nullSession = null
      
      // When: Null session is validated
      const result = isSessionValid(nullSession)
      
      // Then: Null session is considered invalid
      expect(result).toBe(false)
    })
  })
})

describe('API Error Handling', () => {
  let consoleSpy: jest.SpyInstance

  beforeEach(() => {
    // Suppress console.error during these tests
    consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleSpy.mockRestore()
  })

  describe('when processing API errors for user display', () => {
    it('should provide user-friendly messages for network errors', () => {
      // Given: A network connectivity error
      const networkError = new TypeError('Failed to fetch')
      
      // When: Error is processed for user display
      const message = handleApiError(networkError)
      
      // Then: User-friendly network error message is returned
      expect(message).toContain('Network error')
      expect(consoleSpy).toHaveBeenCalledWith('API Error:', networkError)
    })

    it('should return the original error message for general errors', () => {
      // Given: A general error with descriptive message
      const genericError = new Error('Something went wrong')
      
      // When: Error is processed
      const message = handleApiError(genericError)
      
      // Then: Original error message is preserved and logged
      expect(message).toBe('Something went wrong')
      expect(consoleSpy).toHaveBeenCalledWith('API Error:', genericError)
    })

    it('should provide fallback message for errors without descriptions', () => {
      // Given: An error without a descriptive message
      const errorWithoutMessage = new Error()
      errorWithoutMessage.message = ''
      
      // When: Error is processed
      const message = handleApiError(errorWithoutMessage)
      
      // Then: Generic fallback message is provided
      expect(message).toBe('An unexpected error occurred.')
      expect(consoleSpy).toHaveBeenCalledWith('API Error:', errorWithoutMessage)
    })
  })
})

describe('Product Filtering', () => {
  describe('when filtering product collections', () => {
    const mockProducts = [
      {
        id: 1,
        category: 'Beakers',
        stockStatus: 'in_stock',
        packaging: 'Individual',
        price: '₹100.00'
      },
      {
        id: 2,
        category: 'Flasks',
        stockStatus: 'out_of_stock',
        packaging: 'Bulk',
        price: '₹200.00'
      }
    ]

    it('should filter products by category selection', () => {
      // Given: Products from multiple categories
      const categoryFilter = { category: 'Beakers' }
      
      // When: Products are filtered by category
      const filtered = filterProducts(mockProducts, categoryFilter)
      
      // Then: Only products from selected category are returned
      expect(filtered).toHaveLength(1)
      expect(filtered[0].category).toBe('Beakers')
    })

    it('should filter products by price range', () => {
      // Given: Products with different prices
      const priceFilter = { minPrice: '150', maxPrice: '250' }
      
      // When: Products are filtered by price range
      const filtered = filterProducts(mockProducts, priceFilter)
      
      // Then: Only products within price range are returned
      expect(filtered).toHaveLength(1)
      expect(filtered[0].price).toBe('₹200.00')
    })

    it('should apply multiple filter criteria simultaneously', () => {
      // Given: Multiple filter criteria
      const combinedFilter = {
        category: 'Beakers',
        stockStatus: 'in_stock'
      }
      
      // When: Multiple filters are applied
      const filtered = filterProducts(mockProducts, combinedFilter)
      
      // Then: Products matching all criteria are returned
      expect(filtered).toHaveLength(1)
    })

    it('should return empty results when no products match criteria', () => {
      // Given: Filter criteria with no matching products
      const nonMatchingFilter = { category: 'NonExistent' }
      
      // When: Filter is applied
      const filtered = filterProducts(mockProducts, nonMatchingFilter)
      
      // Then: Empty result set is returned
      expect(filtered).toHaveLength(0)
    })
  })
})

describe('Product Search', () => {
  describe('when searching through product collections', () => {
    const mockProducts = [
      {
        name: 'Glass Beaker',
        category: 'Beakers',
        catalogNo: 'GB001'
      },
      {
        name: 'Plastic Flask',
        category: 'Flasks',
        catalogNo: 'PF002'
      }
    ]

    it('should find products by name keyword', () => {
      // Given: A search term matching product name
      const searchTerm = 'glass'
      
      // When: Products are searched by name
      const results = searchProducts(mockProducts, searchTerm)
      
      // Then: Matching product is found
      expect(results).toHaveLength(1)
      expect(results[0].name).toBe('Glass Beaker')
    })

    it('should find products by category keyword', () => {
      // Given: A search term matching category
      const searchTerm = 'flask'
      
      // When: Products are searched by category
      const results = searchProducts(mockProducts, searchTerm)
      
      // Then: Products in matching category are found
      expect(results).toHaveLength(1)
      expect(results[0].category).toBe('Flasks')
    })

    it('should find products by catalog number', () => {
      // Given: A search term matching catalog number
      const searchTerm = 'GB001'
      
      // When: Products are searched by catalog number
      const results = searchProducts(mockProducts, searchTerm)
      
      // Then: Product with matching catalog number is found
      expect(results).toHaveLength(1)
      expect(results[0].catalogNo).toBe('GB001')
    })

    it('should return all products when search term is empty', () => {
      // Given: Empty search term
      const emptySearch = ''
      
      // When: Search is performed with empty term
      const results = searchProducts(mockProducts, emptySearch)
      
      // Then: All products are returned
      expect(results).toHaveLength(2)
    })

    it('should return no results when search term matches nothing', () => {
      // Given: Search term that matches no products
      const nonMatchingTerm = 'nonexistent'
      
      // When: Search is performed
      const results = searchProducts(mockProducts, nonMatchingTerm)
      
      // Then: Empty result set is returned
      expect(results).toHaveLength(0)
    })
  })
})

describe('Price Range Calculation', () => {
  describe('when calculating price ranges from product variants', () => {
    it('should create range from minimum to maximum variant prices', () => {
      // Given: Multiple product variants with different prices
      const variants = [
        { price: '₹100.00' },
        { price: '₹200.00' },
        { price: '₹150.00' }
      ]
      
      // When: Price range is calculated
      const range = calculatePriceRange(variants)
      
      // Then: Range shows minimum to maximum price
      expect(range).toBe('₹100.00 - ₹200.00')
    })

    it('should return single price when only one variant exists', () => {
      // Given: Single product variant
      const singleVariant = [{ price: '₹100.00' }]
      
      // When: Price range is calculated
      const range = calculatePriceRange(singleVariant)
      
      // Then: Single price is returned without range
      expect(range).toBe('₹100.00')
    })

    it('should provide default range for empty variant arrays', () => {
      // Given: No product variants
      const emptyVariants: any[] = []
      
      // When: Price range is calculated
      const range = calculatePriceRange(emptyVariants)
      
      // Then: Default zero range is returned
      expect(range).toBe('₹0.00 - ₹0.00')
    })

    it('should ignore variants with invalid price formats', () => {
      // Given: Variants with mix of valid and invalid prices
      const mixedVariants = [
        { price: '₹100.00' },
        { price: 'invalid' },
        { price: '₹200.00' }
      ]
      
      // When: Price range is calculated
      const range = calculatePriceRange(mixedVariants)
      
      // Then: Range is based only on valid prices
      expect(range).toBe('₹100.00 - ₹200.00')
    })
  })
})

describe('Category Price Range Updates', () => {
  describe('when updating category price ranges from variants', () => {
    it('should recalculate and update price range for existing categories', () => {
      // Given: Category with outdated price range
      const productsData = {
        products: [
          { categorySlug: 'beakers', priceRange: '₹0.00 - ₹0.00' }
        ],
        productVariants: {
          beakers: {
            variants: [
              { price: '₹100.00' },
              { price: '₹200.00' }
            ]
          }
        }
      }

      // When: Price range is updated from current variants
      updateCategoryPriceRange(productsData, 'beakers')
      
      // Then: Category price range reflects current variant prices
      expect(productsData.products[0].priceRange).toBe('₹100.00 - ₹200.00')
    })

    it('should handle requests for non-existent categories gracefully', () => {
      // Given: Empty products data
      const emptyProductsData = {
        products: [],
        productVariants: {}
      }

      // When: Update is attempted for non-existent category
      // Then: Operation should not throw an error
      expect(() => updateCategoryPriceRange(emptyProductsData, 'nonexistent')).not.toThrow()
    })
  })
})

describe('Function Debouncing', () => {
  beforeEach(() => {
    jest.clearAllTimers()
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  describe('when debouncing frequent function calls', () => {
    it('should delay function execution until after specified timeout', () => {
      // Given: A function with debounce applied
      const mockFunction = jest.fn()
      const debouncedFunction = debounce(mockFunction, 100)

      // When: Function is called immediately
      debouncedFunction()
      
      // Then: Function is not executed immediately
      expect(mockFunction).not.toHaveBeenCalled()

      // When: Timeout period elapses
      jest.advanceTimersByTime(100)
      
      // Then: Function is executed once
      expect(mockFunction).toHaveBeenCalledTimes(1)
    })

    it('should cancel previous calls when new calls are made within timeout', () => {
      // Given: A debounced function
      const mockFunction = jest.fn()
      const debouncedFunction = debounce(mockFunction, 100)

      // When: Function is called multiple times rapidly
      debouncedFunction()
      debouncedFunction()
      debouncedFunction()

      // Then: After timeout, function executes only once
      jest.advanceTimersByTime(100)
      expect(mockFunction).toHaveBeenCalledTimes(1)
    })

    it('should preserve function arguments from the last call', () => {
      // Given: A debounced function
      const mockFunction = jest.fn()
      const debouncedFunction = debounce(mockFunction, 100)

      // When: Function is called with specific arguments
      debouncedFunction('arg1', 'arg2')
      jest.advanceTimersByTime(100)
      
      // Then: Arguments are passed correctly to the original function
      expect(mockFunction).toHaveBeenCalledWith('arg1', 'arg2')
    })
  })
})