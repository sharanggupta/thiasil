import { 
  PriceExtractor, 
  DiscountCalculator, 
  discountUtils,
  DiscountCalculationResult,
  PriceRange,
  DiscountedPriceRange
} from '../discount'

// Mock the coupon type for testing
const mockCoupon = {
  id: 'TEST10',
  code: 'TEST10',
  discountPercent: 10,
  minOrderValue: 100,
  expiryDate: '2025-12-31',
  isActive: true
}

describe('Discount Calculation System', () => {
  describe('Price Extraction Utilities', () => {
    describe('when extracting single prices from strings', () => {
      it('should extract numeric values from standard currency format', () => {
        // Given: Standard currency formatted prices
        const standardPrice = '₹100.00'
        const decimalPrice = '₹99.99'
        const fractionalPrice = '₹0.50'
        
        // When: Prices are extracted
        const result1 = PriceExtractor.extractSinglePrice(standardPrice)
        const result2 = PriceExtractor.extractSinglePrice(decimalPrice)
        const result3 = PriceExtractor.extractSinglePrice(fractionalPrice)
        
        // Then: Numeric values are correctly extracted
        expect(result1).toBe(100)
        expect(result2).toBe(99.99)
        expect(result3).toBe(0.5)
      })

      it('should extract prices from descriptive text containing currency values', () => {
        // Given: Text strings containing price information
        const labeledPrice = 'Price: ₹150.75'
        const embeddedPrice = 'Total cost ₹200.00 including tax'
        
        // When: Prices are extracted from text
        const result1 = PriceExtractor.extractSinglePrice(labeledPrice)
        const result2 = PriceExtractor.extractSinglePrice(embeddedPrice)
        
        // Then: Numeric prices are found and extracted
        expect(result1).toBe(150.75)
        expect(result2).toBe(200)
      })

      it('should return zero for text without valid price information', () => {
        // Given: Text without extractable price data
        const noPriceText = 'No price here'
        const emptyString = ''
        const symbolOnly = '₹'
        
        // When: Price extraction is attempted
        const result1 = PriceExtractor.extractSinglePrice(noPriceText)
        const result2 = PriceExtractor.extractSinglePrice(emptyString)
        const result3 = PriceExtractor.extractSinglePrice(symbolOnly)
        
        // Then: Zero is returned as fallback
        expect(result1).toBe(0)
        expect(result2).toBe(0)
        expect(result3).toBe(0)
      })

      it('should handle decimal precision variations correctly', () => {
        // Given: Prices with different decimal place patterns
        const wholeNumber = '₹123'
        const oneDecimal = '₹123.40'
        const twoDecimals = '₹123.45'
        
        // When: Prices with varying precision are extracted
        const result1 = PriceExtractor.extractSinglePrice(wholeNumber)
        const result2 = PriceExtractor.extractSinglePrice(oneDecimal)
        const result3 = PriceExtractor.extractSinglePrice(twoDecimals)
        
        // Then: Precision is preserved appropriately
        expect(result1).toBe(123)
        expect(result2).toBe(123.4)
        expect(result3).toBe(123.45)
      })
    })

    describe('when extracting price ranges from strings', () => {
      it('should parse standard price range format into min/max structure', () => {
        // Given: Standard price range string
        const priceRangeString = '₹100.00 - ₹200.00'
        
        // When: Price range is extracted
        const range = PriceExtractor.extractPriceRange(priceRangeString)
        
        // Then: Min/max structure with currency is returned
        expect(range).toEqual({
          min: 100,
          max: 200,
          currency: '₹'
        })
      })

      it('should handle various separator formats consistently', () => {
        // Given: Price ranges with different separators
        const rangePatterns = [
          '₹100.00 - ₹200.00',
          '₹100.00 to ₹200.00',
          '₹100.00 – ₹200.00',
          '₹100.00 — ₹200.00'
        ]
        
        rangePatterns.forEach(pattern => {
          // When: Each pattern is processed
          const range = PriceExtractor.extractPriceRange(pattern)
          
          // Then: Same min/max values are extracted regardless of separator
          expect(range?.min).toBe(100)
          expect(range?.max).toBe(200)
        })
      })

      it('should convert single prices into equal min/max ranges', () => {
        // Given: Single price string
        const singlePrice = '₹150.00'
        
        // When: Range extraction is performed
        const range = PriceExtractor.extractPriceRange(singlePrice)
        
        // Then: Min and max are equal for single prices
        expect(range).toEqual({
          min: 150,
          max: 150,
          currency: '₹'
        })
      })

      it('should correctly order unordered price pairs', () => {
        // Given: Price range with higher price first
        const unorderedRange = '₹300.00 - ₹100.00'
        
        // When: Range is extracted
        const range = PriceExtractor.extractPriceRange(unorderedRange)
        
        // Then: Min and max are correctly assigned regardless of input order
        expect(range?.min).toBe(100)
        expect(range?.max).toBe(300)
      })

      it('should return null for strings without extractable price data', () => {
        // Given: Strings without valid price information
        const noPriceText = 'No prices here'
        const emptyString = ''
        
        // When: Range extraction is attempted
        const result1 = PriceExtractor.extractPriceRange(noPriceText)
        const result2 = PriceExtractor.extractPriceRange(emptyString)
        
        // Then: Null is returned for invalid inputs
        expect(result1).toBeNull()
        expect(result2).toBeNull()
      })

      it('should find minimum and maximum from multiple comma-separated prices', () => {
        // Given: String with multiple comma-separated prices
        const multiplePrices = '₹50.00, ₹100.00, ₹75.00'
        
        // When: Range is extracted from multiple prices
        const range = PriceExtractor.extractPriceRange(multiplePrices)
        
        // Then: Lowest and highest prices become min/max
        expect(range?.min).toBe(50)
        expect(range?.max).toBe(100)
      })
    })

    describe('when formatting prices for display', () => {
      it('should format numeric values with default currency symbol', () => {
        // Given: Numeric price values
        const wholePrice = 100
        const decimalPrice = 99.9
        const zeroPrice = 0
        
        // When: Prices are formatted with default currency
        const result1 = PriceExtractor.formatPrice(wholePrice)
        const result2 = PriceExtractor.formatPrice(decimalPrice)
        const result3 = PriceExtractor.formatPrice(zeroPrice)
        
        // Then: Properly formatted currency strings are returned
        expect(result1).toBe('₹100.00')
        expect(result2).toBe('₹99.90')
        expect(result3).toBe('₹0.00')
      })

      it('should format prices with custom currency symbols', () => {
        // Given: Price value and custom currency symbols
        const price = 100
        const dollarSymbol = '$'
        const euroSymbol = '€'
        
        // When: Prices are formatted with custom currencies
        const dollarResult = PriceExtractor.formatPrice(price, dollarSymbol)
        const euroResult = PriceExtractor.formatPrice(price, euroSymbol)
        
        // Then: Custom currency symbols are used in formatting
        expect(dollarResult).toBe('$100.00')
        expect(euroResult).toBe('€100.00')
      })

      it('should round decimal values to appropriate precision', () => {
        // Given: Prices with excessive decimal precision
        const roundUpPrice = 99.999
        const roundDownPrice = 99.991
        
        // When: Prices are formatted
        const result1 = PriceExtractor.formatPrice(roundUpPrice)
        const result2 = PriceExtractor.formatPrice(roundDownPrice)
        
        // Then: Values are rounded to standard currency precision
        expect(result1).toBe('₹100.00')
        expect(result2).toBe('₹99.99')
      })
    })

    describe('when formatting price ranges for display', () => {
      it('should format price ranges with proper min-max display', () => {
        // Given: A price range with different min and max values
        const priceRange: PriceRange = { min: 100, max: 200, currency: '₹' }
        
        // When: Price range is formatted for display
        const result = PriceExtractor.formatPriceRange(priceRange)
        
        // Then: Properly formatted range string is returned
        expect(result).toBe('₹100.00 - ₹200.00')
      })

      it('should format single-price ranges as individual prices', () => {
        // Given: A price range where min equals max
        const singlePriceRange: PriceRange = { min: 150, max: 150, currency: '₹' }
        
        // When: Single-price range is formatted
        const result = PriceExtractor.formatPriceRange(singlePriceRange)
        
        // Then: Single price is displayed without range separator
        expect(result).toBe('₹150.00')
      })

      it('should respect custom currency symbols in range formatting', () => {
        // Given: Price range with custom currency
        const dollarRange: PriceRange = { min: 100, max: 200, currency: '$' }
        
        // When: Range is formatted with custom currency
        const result = PriceExtractor.formatPriceRange(dollarRange)
        
        // Then: Custom currency is used throughout the range
        expect(result).toBe('$100.00 - $200.00')
      })
    })
  })

  describe('Discount Calculation Engine', () => {
    describe('when applying percentage discounts to prices', () => {
      it('should calculate discount details correctly for numeric prices', () => {
        // Given: A numeric price and discount percentage
        const originalPrice = 100
        const discountPercent = 10
        
        // When: Discount is applied
        const result = DiscountCalculator.applyDiscount(originalPrice, discountPercent)
        
        // Then: All discount details are calculated accurately
        expect(result.originalPrice).toBe(100)
        expect(result.discountAmount).toBe(10)
        expect(result.discountedPrice).toBe(90)
        expect(result.discountPercent).toBe(10)
        expect(result.savings).toBe('₹10.00')
        expect(result.isDiscounted).toBe(true)
      })

      it('should calculate discount details correctly for currency-formatted prices', () => {
        // Given: A currency-formatted price string and discount percentage
        const formattedPrice = '₹200.00'
        const discountPercent = 25
        
        // When: Discount is applied to formatted price
        const result = DiscountCalculator.applyDiscount(formattedPrice, discountPercent)
        
        // Then: Price is extracted and discount calculated properly
        expect(result.originalPrice).toBe(200)
        expect(result.discountAmount).toBe(50)
        expect(result.discountedPrice).toBe(150)
        expect(result.discountPercent).toBe(25)
        expect(result.savings).toBe('₹50.00')
        expect(result.isDiscounted).toBe(true)
      })

      it('should handle zero discount scenarios correctly', () => {
        // Given: Price with zero discount percentage
        const price = 100
        const zeroDiscount = 0
        
        // When: Zero discount is applied
        const result = DiscountCalculator.applyDiscount(price, zeroDiscount)
        
        // Then: No discount is applied and price remains unchanged
        expect(result.originalPrice).toBe(100)
        expect(result.discountAmount).toBe(0)
        expect(result.discountedPrice).toBe(100)
        expect(result.discountPercent).toBe(0)
        expect(result.isDiscounted).toBe(false)
      })

      it('should prevent negative prices from excessive discounts', () => {
        // Given: Price with discount percentage exceeding 100%
        const price = 100
        const excessiveDiscount = 120
        
        // When: Excessive discount is applied
        const result = DiscountCalculator.applyDiscount(price, excessiveDiscount)
        
        // Then: Price is capped at zero to prevent negative values
        expect(result.discountedPrice).toBe(0)
      })

      it('should handle invalid price strings gracefully', () => {
        // Given: Invalid price string
        const invalidPrice = 'invalid'
        const discountPercent = 10
        
        // When: Discount is applied to invalid price
        const result = DiscountCalculator.applyDiscount(invalidPrice, discountPercent)
        
        // Then: Zero values are returned for invalid input
        expect(result.originalPrice).toBe(0)
        expect(result.discountedPrice).toBe(0)
      })
    })

    describe('when applying discounts to price ranges', () => {
      it('should apply discount to both minimum and maximum prices in range', () => {
        // Given: A price range string and discount percentage
        const priceRange = '₹100.00 - ₹200.00'
        const discountPercent = 10
        
        // When: Discount is applied to the range
        const result = DiscountCalculator.applyDiscountToRange(priceRange, discountPercent)
        
        // Then: Both original and discounted ranges are calculated
        expect(result).not.toBeNull()
        expect(result?.original.min).toBe(100)
        expect(result?.original.max).toBe(200)
        expect(result?.discounted.min).toBe(90)
        expect(result?.discounted.max).toBe(180)
        expect(result?.discount.percent).toBe(10)
      })

      it('should return null for strings without valid price range data', () => {
        // Given: Invalid price range string
        const invalidRange = 'invalid'
        const discountPercent = 10
        
        // When: Discount is applied to invalid range
        const result = DiscountCalculator.applyDiscountToRange(invalidRange, discountPercent)
        
        // Then: Null is returned for invalid input
        expect(result).toBeNull()
      })

      it('should treat single prices as equal min/max ranges', () => {
        // Given: Single price and discount percentage
        const singlePrice = '₹100.00'
        const discountPercent = 20
        
        // When: Discount is applied to single price
        const result = DiscountCalculator.applyDiscountToRange(singlePrice, discountPercent)
        
        // Then: Single price is treated as range with equal min/max
        expect(result?.original.min).toBe(100)
        expect(result?.original.max).toBe(100)
        expect(result?.discounted.min).toBe(80)
        expect(result?.discounted.max).toBe(80)
      })
    })

    describe('when applying coupon-based discounts', () => {
      it('should apply coupon discount percentage when valid coupon is provided', () => {
        // Given: A price and valid coupon with discount percentage
        const price = 100
        
        // When: Coupon discount is applied
        const result = DiscountCalculator.applyCouponDiscount(price, mockCoupon)
        
        // Then: Coupon discount is applied correctly
        expect(result.discountPercent).toBe(10)
        expect(result.discountedPrice).toBe(90)
        expect(result.isDiscounted).toBe(true)
      })

      it('should return original price when no coupon is provided', () => {
        // Given: A price and null coupon
        const price = 100
        
        // When: Coupon discount is applied with null coupon
        const result = DiscountCalculator.applyCouponDiscount(price, null)
        
        // Then: No discount is applied and original price is maintained
        expect(result.discountPercent).toBe(0)
        expect(result.discountedPrice).toBe(100)
        expect(result.isDiscounted).toBe(false)
      })

      it('should handle currency-formatted prices with coupon discounts', () => {
        // Given: Currency-formatted price and valid coupon
        const formattedPrice = '₹200.00'
        
        // When: Coupon discount is applied to formatted price
        const result = DiscountCalculator.applyCouponDiscount(formattedPrice, mockCoupon)
        
        // Then: Price is extracted and coupon discount applied
        expect(result.originalPrice).toBe(200)
        expect(result.discountedPrice).toBe(180)
      })
    })

    describe('when formatting discounted prices for display', () => {
      it('should show both current and original prices when requested', () => {
        // Given: Original and discounted prices with showOriginal flag
        const originalPrice = 100
        const discountedPrice = 90
        const showOriginal = true
        
        // When: Price is formatted with original price display
        const formatted = DiscountCalculator.formatDiscountedPrice(originalPrice, discountedPrice, showOriginal)
        
        // Then: Both current and original prices are shown
        expect(formatted).toBe('₹90.00 (was ₹100.00)')
      })

      it('should show only current price when original is not requested', () => {
        // Given: Original and discounted prices without showOriginal flag
        const originalPrice = 100
        const discountedPrice = 90
        const showOriginal = false
        
        // When: Price is formatted without original price display
        const formatted = DiscountCalculator.formatDiscountedPrice(originalPrice, discountedPrice, showOriginal)
        
        // Then: Only current discounted price is shown
        expect(formatted).toBe('₹90.00')
      })

      it('should show single price when no discount was applied', () => {
        // Given: Same original and final prices (no discount)
        const price = 100
        const showOriginal = true
        
        // When: Price is formatted with no discount applied
        const formatted = DiscountCalculator.formatDiscountedPrice(price, price, showOriginal)
        
        // Then: Single price is shown without comparison
        expect(formatted).toBe('₹100.00')
      })
    })

    describe('calculateBulkDiscount', () => {
      it('calculates bulk discounts correctly', () => {
        const items = [
          { price: 100, quantity: 2 },
          { price: 50, quantity: 3 }
        ]
        
        const result = DiscountCalculator.calculateBulkDiscount(items, 10)
        expect(result.totalOriginal).toBe(350) // (100*2) + (50*3) = 350
        expect(result.totalDiscounted).toBe(315) // 350 - 35 = 315
        expect(result.totalSavings).toBe(35)
        expect(result.items).toHaveLength(2)
        expect(result.items[0].lineTotal).toBe(180) // 90 * 2
        expect(result.items[1].lineTotal).toBe(135) // 45 * 3
      })

      it('handles empty items array', () => {
        const result = DiscountCalculator.calculateBulkDiscount([], 10)
        expect(result.totalOriginal).toBe(0)
        expect(result.totalDiscounted).toBe(0)
        expect(result.totalSavings).toBe(0)
        expect(result.items).toHaveLength(0)
      })
    })

    describe('validateMinimumOrder', () => {
      it('validates order meets minimum requirement', () => {
        const result = DiscountCalculator.validateMinimumOrder(150, mockCoupon)
        expect(result.isValid).toBe(true)
        expect(result.shortfall).toBe(0)
      })

      it('validates order below minimum requirement', () => {
        const result = DiscountCalculator.validateMinimumOrder(80, mockCoupon)
        expect(result.isValid).toBe(false)
        expect(result.requiredAmount).toBe(100)
        expect(result.shortfall).toBe(20)
      })

      it('returns valid for null coupon', () => {
        const result = DiscountCalculator.validateMinimumOrder(50, null)
        expect(result.isValid).toBe(true)
      })
    })

    describe('getDiscountBadge', () => {
      it('generates appropriate badges for different discount levels', () => {
        expect(DiscountCalculator.getDiscountBadge(0)).toBe('')
        expect(DiscountCalculator.getDiscountBadge(5)).toBe('5% OFF')
        expect(DiscountCalculator.getDiscountBadge(15)).toBe('15% OFF')
        expect(DiscountCalculator.getDiscountBadge(30)).toBe('30% OFF - GREAT DEAL!')
        expect(DiscountCalculator.getDiscountBadge(60)).toBe('60% OFF - HUGE SAVINGS!')
      })
    })

    describe('calculateTieredDiscount', () => {
      const tiers = [
        { minValue: 500, discountPercent: 15 },
        { minValue: 200, discountPercent: 10 },
        { minValue: 100, discountPercent: 5 }
      ]

      it('applies highest applicable tier', () => {
        const result = DiscountCalculator.calculateTieredDiscount(600, tiers)
        expect(result.appliedTier?.discountPercent).toBe(15)
        expect(result.discount.discountPercent).toBe(15)
      })

      it('applies middle tier for mid-range orders', () => {
        const result = DiscountCalculator.calculateTieredDiscount(300, tiers)
        expect(result.appliedTier?.discountPercent).toBe(10)
      })

      it('returns no discount for orders below minimum', () => {
        const result = DiscountCalculator.calculateTieredDiscount(50, tiers)
        expect(result.appliedTier).toBeNull()
        expect(result.discount.discountPercent).toBe(0)
      })
    })
  })

  describe('Discount Utility Functions', () => {
    describe('when detecting discount indicators in price strings', () => {
      it('should identify various discount patterns in price text', () => {
        // Given: Price strings with different discount indicators
        const priceWithComparison = '₹90.00 (was ₹100.00)'
        const priceWithPercentage = '₹50.00 - 10% OFF'
        const regularPrice = '₹100.00'
        
        // When: Discount detection is performed
        const result1 = discountUtils.hasDiscount(priceWithComparison)
        const result2 = discountUtils.hasDiscount(priceWithPercentage)
        const result3 = discountUtils.hasDiscount(regularPrice)
        
        // Then: Discount indicators are correctly identified
        expect(result1).toBe(true)
        expect(result2).toBe(true)
        expect(result3).toBe(false)
      })
    })

    describe('extractSavings', () => {
      it('extracts savings amounts from text', () => {
        expect(discountUtils.extractSavings('Save ₹25.00 today!')).toBe(25)
        expect(discountUtils.extractSavings('You saved ₹10.50')).toBe(10.5)
        expect(discountUtils.extractSavings('No savings here')).toBe(0)
      })
    })

    describe('generateCouponSummary', () => {
      it('generates summary for basic coupon', () => {
        const summary = discountUtils.generateCouponSummary(mockCoupon, 150)
        expect(summary).toContain('10% discount')
        expect(summary).toContain('✓ Minimum met')
      })

      it('shows minimum not met', () => {
        const summary = discountUtils.generateCouponSummary(mockCoupon, 50)
        expect(summary).toContain('Minimum: ₹100')
      })

      it('shows expiry information', () => {
        const summary = discountUtils.generateCouponSummary(mockCoupon)
        expect(summary).toContain('days left')
      })
    })

    describe('formatPercent', () => {
      it('formats percentages correctly', () => {
        expect(discountUtils.formatPercent(10)).toBe('10%')
        expect(discountUtils.formatPercent(10.5)).toBe('10.5%')
        expect(discountUtils.formatPercent(10.55)).toBe('10.6%')
      })
    })
  })
})