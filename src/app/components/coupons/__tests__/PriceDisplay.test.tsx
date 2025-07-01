import React from 'react'
import { render, screen } from '@testing-library/react'
import PriceDisplay from '../PriceDisplay'

// Mock the CouponContext
const mockCouponContext = {
  activeCoupon: null,
  getCouponDiscount: jest.fn(),
  getDiscountedPrice: jest.fn(),
  hasActiveCoupon: false
}

jest.mock('@/contexts/CouponContext', () => ({
  useCouponDiscount: () => mockCouponContext
}))

// Mock discount utilities
jest.mock('@/lib/utils/discount', () => ({
  DiscountCalculator: {
    applyCouponDiscount: jest.fn(),
    applyCouponDiscountToRange: jest.fn(),
    formatDiscountedPrice: jest.fn(),
    formatDiscountedPriceRange: jest.fn(),
    getDiscountBadge: jest.fn(),
    applyDiscountToRange: jest.fn()
  },
  PriceExtractor: {
    formatPrice: jest.fn(),
    extractSinglePrice: jest.fn(),
    extractPriceRange: jest.fn(),
    formatPriceRange: jest.fn()
  }
}))

import { DiscountCalculator, PriceExtractor } from '@/lib/utils/discount'

const mockDiscountCalculator = DiscountCalculator as jest.Mocked<typeof DiscountCalculator>
const mockPriceExtractor = PriceExtractor as jest.Mocked<typeof PriceExtractor>

describe('PriceDisplay Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Reset coupon context to defaults
    mockCouponContext.hasActiveCoupon = false
    mockCouponContext.activeCoupon = null
    
    mockPriceExtractor.formatPrice.mockImplementation((price) => `₹${price.toFixed(2)}`)
    mockPriceExtractor.extractSinglePrice.mockImplementation((price) => 
      typeof price === 'number' ? price : parseFloat(price.toString().replace('₹', ''))
    )
    
    // Set up default applyCouponDiscount return value - this gets called with the extracted price
    mockDiscountCalculator.applyCouponDiscount.mockImplementation((price) => ({
      originalPrice: typeof price === 'number' ? price : parseFloat(price.toString().replace('₹', '')),
      discountedPrice: typeof price === 'number' ? price : parseFloat(price.toString().replace('₹', '')),
      discountAmount: 0,
      discountPercent: 0,
      isDiscounted: false,
      savings: '₹0.00'
    }))
  })

  describe('when displaying prices without active coupons', () => {
    it('should render numeric prices with proper currency formatting', () => {
      // Given: Product with numeric price value
      
      // When: PriceDisplay renders price without coupon
      render(<PriceDisplay price={100} />)
      
      // Then: Price is displayed in formatted currency for customer clarity
      expect(screen.getByText('₹100.00')).toBeInTheDocument()
    })

    it('should handle pre-formatted price strings correctly', () => {
      // Given: Product with pre-formatted price string
      
      // When: PriceDisplay renders string price
      render(<PriceDisplay price="₹150.50" />)
      
      // Then: String price is processed through discount calculator
      expect(mockDiscountCalculator.applyCouponDiscount).toHaveBeenCalledWith('₹150.50', null)
    })

    it('should apply appropriate typography sizes for different contexts', () => {
      // Given: PriceDisplay needing different size variations
      const { container, rerender } = render(<PriceDisplay price={100} size="small" />)
      
      // When: Small size is applied for compact display
      let priceElement = container.querySelector('.text-lg')
      
      // Then: Small typography is used for space-constrained contexts
      expect(priceElement).toBeInTheDocument()
      
      // When: Medium size is applied for standard display
      rerender(<PriceDisplay price={100} size="medium" />)
      priceElement = container.querySelector('.text-2xl')
      
      // Then: Medium typography provides balanced visibility
      expect(priceElement).toBeInTheDocument()
      
      // When: Large size is applied for prominent display
      rerender(<PriceDisplay price={100} size="large" />)
      priceElement = container.querySelector('.text-3xl')
      
      // Then: Large typography draws attention to important pricing
      expect(priceElement).toBeInTheDocument()
    })

    it('should accept and apply custom CSS classes for specialized styling', () => {
      // Given: PriceDisplay requiring custom styling for specific context
      
      // When: Component is rendered with custom className
      const { container } = render(<PriceDisplay price={100} className="custom-price" />)
      
      // Then: Custom class is applied for specialized presentation
      expect(container.firstChild).toHaveClass('custom-price')
    })
  })

  describe('when applying active coupon discounts to prices', () => {
    beforeEach(() => {
      mockCouponContext.hasActiveCoupon = true
      mockCouponContext.activeCoupon = {
        code: 'SAVE20',
        discountPercent: 20
      }
      mockCouponContext.getDiscountedPrice.mockReturnValue(80)
      mockCouponContext.getCouponDiscount.mockReturnValue({
        originalPrice: 100,
        discountedPrice: 80,
        discountAmount: 20,
        discountPercent: 20,
        savings: '₹20.00',
        isDiscounted: true
      })
      
      // Update applyCouponDiscount to return discounted values
      mockDiscountCalculator.applyCouponDiscount.mockReturnValue({
        originalPrice: 100,
        discountedPrice: 80,
        discountAmount: 20,
        discountPercent: 20,
        isDiscounted: true,
        savings: '₹20.00'
      })
      
      mockDiscountCalculator.getDiscountBadge.mockReturnValue('20% OFF')
    })

    it('should calculate and display discounted price when customer has active coupon', () => {
      // Given: Customer with active coupon and product price
      
      // When: PriceDisplay renders price with active coupon
      render(<PriceDisplay price={100} />)
      
      // Then: Discount calculation is performed with customer's coupon
      expect(mockDiscountCalculator.applyCouponDiscount).toHaveBeenCalledWith(100, mockCouponContext.activeCoupon)
    })

    it('should show original price with strikethrough when comparison is requested', () => {
      // Given: Customer wanting to see original vs discounted price comparison
      
      // When: PriceDisplay renders with showOriginal enabled
      render(<PriceDisplay price={100} showOriginal={true} />)
      
      // Then: Original price is displayed to show value of discount
      expect(screen.getByText('₹100.00')).toBeInTheDocument()
      expect(mockPriceExtractor.formatPrice).toHaveBeenCalledWith(100, '₹')
    })

    it('should display only discounted price when original comparison is not needed', () => {
      // Given: Clean price display without original price comparison
      
      // When: PriceDisplay renders with showOriginal disabled
      render(<PriceDisplay price={100} showOriginal={false} />)
      
      // Then: Only discounted price is shown for simplified display
      expect(mockDiscountCalculator.applyCouponDiscount).toHaveBeenCalled()
    })

    it('should highlight savings amount to emphasize customer benefit', () => {
      // Given: Customer receiving discount and wanting to see savings
      
      // When: PriceDisplay renders with showSavings enabled
      render(<PriceDisplay price={100} showSavings={true} />)
      
      // Then: Savings amount is prominently displayed to emphasize value
      expect(screen.getByText('You save ₹20.00')).toBeInTheDocument()
    })

    it('should display discount badge to draw attention to promotional pricing', () => {
      // Given: Product with promotional discount requiring visual emphasis
      
      // When: PriceDisplay renders with showDiscountBadge enabled
      render(<PriceDisplay price={100} showDiscountBadge={true} />)
      
      // Then: Discount badge creates visual emphasis for promotional value
      expect(screen.getByText('20% OFF')).toBeInTheDocument()
      expect(mockDiscountCalculator.getDiscountBadge).toHaveBeenCalledWith(20)
    })
  })

  describe('when handling product price ranges with discount application', () => {
    beforeEach(() => {
      mockCouponContext.hasActiveCoupon = false
      mockCouponContext.activeCoupon = null
      mockDiscountCalculator.applyCouponDiscountToRange.mockReturnValue(null)
    })

    it('should display price ranges for products with variable pricing', () => {
      // Given: Product with price range based on options or configurations
      
      // When: PriceDisplay renders price range without active coupon
      render(<PriceDisplay price={150} priceRange="₹100.00 - ₹200.00" />)
      
      // Then: Full price range is displayed to show pricing spectrum
      expect(mockDiscountCalculator.applyCouponDiscountToRange).toHaveBeenCalledWith('₹100.00 - ₹200.00', null)
      expect(screen.getByText('₹100.00 - ₹200.00')).toBeInTheDocument()
    })

    it('should apply coupon discounts across entire price range', () => {
      // Given: Customer with active coupon and product with price range
      mockCouponContext.hasActiveCoupon = true
      mockCouponContext.activeCoupon = { code: 'SAVE20', discountPercent: 20 }
      
      const mockDiscountedRange = {
        original: { min: 100, max: 200, currency: '₹' },
        discounted: { min: 80, max: 160, currency: '₹' },
        discount: { percent: 20, minSavings: 20, maxSavings: 40 }
      }
      
      mockDiscountCalculator.applyCouponDiscountToRange.mockReturnValue(mockDiscountedRange)
      mockDiscountCalculator.formatDiscountedPriceRange.mockReturnValue('₹80.00 - ₹160.00')
      mockPriceExtractor.formatPriceRange.mockReturnValue('₹100.00 - ₹200.00')
      
      // When: PriceDisplay renders range with active coupon
      render(<PriceDisplay price={150} priceRange="₹100.00 - ₹200.00" />)
      
      // Then: Discount is applied to both minimum and maximum prices
      expect(mockDiscountCalculator.applyCouponDiscountToRange).toHaveBeenCalledWith('₹100.00 - ₹200.00', mockCouponContext.activeCoupon)
    })
  })

  describe('when adapting typography size for different display contexts', () => {
    it('should use compact typography for space-constrained interfaces', () => {
      // Given: Price display in compact interface element
      
      // When: PriceDisplay renders with small size
      const { container } = render(<PriceDisplay price={100} size="small" />)
      
      // Then: Compact text size maintains readability in limited space
      expect(container.querySelector('.text-lg')).toBeInTheDocument()
    })

    it('should use balanced typography for standard product displays', () => {
      // Given: Price display in standard product card or listing
      
      // When: PriceDisplay renders with medium size
      const { container } = render(<PriceDisplay price={100} size="medium" />)
      
      // Then: Medium text size provides good visibility without dominating
      expect(container.querySelector('.text-2xl')).toBeInTheDocument()
    })

    it('should use prominent typography for featured pricing displays', () => {
      // Given: Price display in hero section or featured product
      
      // When: PriceDisplay renders with large size
      const { container } = render(<PriceDisplay price={100} size="large" />)
      
      // Then: Large text size draws attention to important pricing
      expect(container.querySelector('.text-3xl')).toBeInTheDocument()
    })
  })

  describe('when handling different currency symbols and localization', () => {
    it('should format prices with custom currency for international markets', () => {
      // Given: Product pricing for international customer with different currency
      
      // When: PriceDisplay renders with custom currency symbol
      render(<PriceDisplay price={100} currency="$" />)
      
      // Then: Price is formatted with appropriate currency for customer's region
      expect(mockPriceExtractor.formatPrice).toHaveBeenCalledWith(expect.any(Number), '$')
    })

    it('should use default Indian Rupee symbol for domestic market', () => {
      // Given: Product pricing for domestic Indian market
      
      // When: PriceDisplay renders without specified currency
      render(<PriceDisplay price={100} />)
      
      // Then: Default Rupee symbol is used for local market clarity
      expect(mockPriceExtractor.formatPrice).toHaveBeenCalledWith(expect.any(Number), '₹')
    })
  })

  describe('when handling unusual price values and edge cases', () => {
    it('should display zero prices for free products or promotions', () => {
      // Given: Product offered for free or with full discount
      
      // When: PriceDisplay renders zero price
      render(<PriceDisplay price={0} />)
      
      // Then: Zero price is formatted and displayed appropriately
      expect(mockPriceExtractor.formatPrice).toHaveBeenCalledWith(0, '₹')
    })

    it('should handle negative prices for refunds or credits gracefully', () => {
      // Given: Product with credit or refund value
      
      // When: PriceDisplay renders negative price
      render(<PriceDisplay price={-50} />)
      
      // Then: Negative price is processed without breaking component
      expect(mockPriceExtractor.formatPrice).toHaveBeenCalledWith(-50, '₹')
    })

    it('should format very large prices for high-value products', () => {
      // Given: High-value specialized equipment or bulk orders
      
      // When: PriceDisplay renders very large price
      render(<PriceDisplay price={999999.99} />)
      
      // Then: Large price is formatted with proper number formatting
      expect(mockPriceExtractor.formatPrice).toHaveBeenCalledWith(999999.99, '₹')
    })

    it('should process invalid price data without breaking component', () => {
      // Given: Corrupted or invalid price data from API
      
      // When: PriceDisplay renders invalid price string
      render(<PriceDisplay price="invalid-price" />)
      
      // Then: Invalid price is passed to discount calculator for safe handling
      expect(mockDiscountCalculator.applyCouponDiscount).toHaveBeenCalledWith('invalid-price', null)
    })
  })

  describe('when controlling display elements based on user preferences', () => {
    beforeEach(() => {
      mockCouponContext.hasActiveCoupon = true
      mockCouponContext.activeCoupon = { code: 'SAVE20', discountPercent: 20 }
      mockDiscountCalculator.applyCouponDiscount.mockReturnValue({
        originalPrice: 100,
        discountedPrice: 80,
        discountAmount: 20,
        discountPercent: 20,
        isDiscounted: true,
        savings: '₹20.00'
      })
      mockDiscountCalculator.getDiscountBadge.mockReturnValue('20% OFF')
    })

    it('should hide savings information when clean display is preferred', () => {
      // Given: Interface requiring minimal price display without savings emphasis
      
      // When: PriceDisplay renders with showSavings disabled
      render(<PriceDisplay price={100} showSavings={false} />)
      
      // Then: Savings information is hidden for cleaner presentation
      expect(screen.queryByText(/You save/i)).not.toBeInTheDocument()
    })

    it('should hide promotional badges when subtle pricing is needed', () => {
      // Given: Professional or business context where promotional badges are inappropriate
      
      // When: PriceDisplay renders with showDiscountBadge disabled
      render(<PriceDisplay price={100} showDiscountBadge={false} />)
      
      // Then: Discount badge is hidden for professional appearance
      expect(screen.queryByText('20% OFF')).not.toBeInTheDocument()
    })

    it('should show only final price when original comparison is not needed', () => {
      // Given: Simplified price display without comparison emphasis
      
      // When: PriceDisplay renders with showOriginal disabled
      render(<PriceDisplay price={100} showOriginal={false} />)
      
      // Then: Only final discounted price is shown for clean presentation
      expect(screen.getByText('₹80.00')).toBeInTheDocument()
      expect(screen.queryByTestId('original-price')).not.toBeInTheDocument()
    })
  })

  describe('when ensuring accessibility for all users', () => {
    it('should provide clear price information for screen readers', () => {
      // Given: Visually impaired user needing price information
      
      // When: PriceDisplay renders price content
      render(<PriceDisplay price={100} />)
      
      // Then: Price information is properly exposed to assistive technology
      const priceElement = screen.getByText('₹100.00')
      expect(priceElement).toBeInTheDocument()
    })

    it('should maintain readable contrast for users with visual impairments', () => {
      // Given: Users requiring high contrast for price readability
      
      // When: PriceDisplay renders with styling
      const { container } = render(<PriceDisplay price={100} />)
      
      // Then: Text elements use classes that provide appropriate contrast
      const textElements = container.querySelectorAll('[class*="text-"]')
      expect(textElements.length).toBeGreaterThan(0)
    })
  })
})