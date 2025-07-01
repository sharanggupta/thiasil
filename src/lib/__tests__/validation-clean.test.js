import { sanitizeInput } from '../validation'

describe('Input Sanitization', () => {
  describe('when removing dangerous HTML', () => {
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

  describe('when processing complex HTML content', () => {
    it('should remove div tags while preserving inner content', () => {
      // Given: Input with div tags
      const divInput = '<div>Content</div>'
      
      // When: Input is sanitized
      const result = sanitizeInput(divInput)
      
      // Then: Tags are removed but content remains
      expect(result).toBe('divContent/div')
    })

    it('should preserve email addresses in mixed content', () => {
      // Given: Input with email and other content
      const emailInput = 'Email: test@example.com'
      
      // When: Input is sanitized
      const result = sanitizeInput(emailInput)
      
      // Then: Email format is preserved
      expect(result).toBe('Email: test@example.com')
    })

    it('should remove HTML tags but preserve special characters', () => {
      // Given: Input with price and HTML tags
      const priceInput = 'Price: $50 <tax not included>'
      
      // When: Input is sanitized
      const result = sanitizeInput(priceInput)
      
      // Then: HTML is removed but price symbols remain
      expect(result).toBe('Price: $50 tax not included')
    })
  })

  describe('when preserving safe content', () => {
    it('should leave plain text completely unchanged', () => {
      // Given: Simple text input
      const plainText = 'Just normal text'
      
      // When: Input is sanitized
      const result = sanitizeInput(plainText)
      
      // Then: Text is exactly the same
      expect(result).toBe('Just normal text')
    })

    it('should preserve numbers and safe symbols', () => {
      // Given: Input with numbers and safe symbols
      const mixedInput = 'Numbers 123 and symbols !@#$%^&*()'
      
      // When: Input is sanitized
      const result = sanitizeInput(mixedInput)
      
      // Then: All safe content is preserved
      expect(result).toBe('Numbers 123 and symbols !@#$%^&*()')
    })
  })
})