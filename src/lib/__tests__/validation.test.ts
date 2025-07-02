import { sanitizeInput } from '../validation'

describe('Input Validation and Sanitization', () => {
  describe('when sanitizing user input for security', () => {
    it('should remove dangerous HTML tags to prevent XSS attacks', () => {
      // Given: Malicious script input that could execute XSS
      const maliciousScript = '<script>alert("xss")</script>'
      const htmlTags = 'Hello <> World'
      const safeText = 'Normal text'
      
      // When: Input is sanitized
      const result1 = sanitizeInput(maliciousScript)
      const result2 = sanitizeInput(htmlTags)
      const result3 = sanitizeInput(safeText)
      
      // Then: Dangerous tags are removed while preserving content
      expect(result1).toBe('scriptalert("xss")/script')
      expect(result2).toBe('Hello  World')
      expect(result3).toBe('Normal text')
    })

    it('should normalize whitespace to prevent formatting attacks', () => {
      // Given: Input with excessive whitespace padding
      const paddedInput = '  hello world  '
      const complexWhitespace = '\t\n  test  \n\t'
      
      // When: Input is sanitized
      const result1 = sanitizeInput(paddedInput)
      const result2 = sanitizeInput(complexWhitespace)
      
      // Then: Whitespace is normalized appropriately
      expect(result1).toBe('hello world')
      expect(result2).toBe('test')
    })

    it('should handle non-string data types safely', () => {
      // Given: Non-string inputs that should pass through
      const numericInput = 123
      const nullInput = null
      const undefinedInput = undefined
      
      // When: Non-string values are processed
      const result1 = sanitizeInput(numericInput)
      const result2 = sanitizeInput(nullInput)
      const result3 = sanitizeInput(undefinedInput)
      
      // Then: Non-string values are returned unchanged
      expect(result1).toBe(123)
      expect(result2).toBe(null)
      expect(result3).toBe(undefined)
    })

    it('should handle empty and whitespace-only inputs appropriately', () => {
      // Given: Empty and whitespace-only inputs
      const emptyString = ''
      const whitespaceOnly = '   '
      
      // When: Empty inputs are sanitized
      const result1 = sanitizeInput(emptyString)
      const result2 = sanitizeInput(whitespaceOnly)
      
      // Then: Empty results are returned
      expect(result1).toBe('')
      expect(result2).toBe('')
    })

    it('should process complex HTML while preserving safe content', () => {
      // Given: Complex strings with HTML and safe content
      const htmlContent = '<div>Content</div>'
      const emailContent = 'Email: test@example.com'
      const priceContent = 'Price: $50 <tax not included>'
      
      // When: Complex content is sanitized
      const result1 = sanitizeInput(htmlContent)
      const result2 = sanitizeInput(emailContent)
      const result3 = sanitizeInput(priceContent)
      
      // Then: HTML is removed but safe content is preserved
      expect(result1).toBe('divContent/div')
      expect(result2).toBe('Email: test@example.com')
      expect(result3).toBe('Price: $50 tax not included')
    })

    it('should leave completely safe content unchanged', () => {
      // Given: Safe text content without any dangerous elements
      const plainText = 'Just normal text'
      const textWithSymbols = 'Numbers 123 and symbols !@#$%^&*()'
      
      // When: Safe content is sanitized
      const result1 = sanitizeInput(plainText)
      const result2 = sanitizeInput(textWithSymbols)
      
      // Then: Safe content remains exactly the same
      expect(result1).toBe('Just normal text')
      expect(result2).toBe('Numbers 123 and symbols !@#$%^&*()')
    })
  })
})