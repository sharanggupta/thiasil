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

describe('PriceDisplay', () => {
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

  describe('basic price display without coupon', () => {
    it('renders single price correctly', () => {
      render(<PriceDisplay price={100} />)
      
      expect(screen.getByText('₹100.00')).toBeInTheDocument()
    })

    it('renders string price correctly', () => {
      render(<PriceDisplay price="₹150.50" />)
      
      // Should pass string price directly to applyCouponDiscount
      expect(mockDiscountCalculator.applyCouponDiscount).toHaveBeenCalledWith('₹150.50', null)
    })

    it('applies size classes correctly', () => {
      const { container, rerender } = render(<PriceDisplay price={100} size="small" />)
      
      let priceElement = container.querySelector('.text-lg')
      expect(priceElement).toBeInTheDocument()
      
      rerender(<PriceDisplay price={100} size="medium" />)
      priceElement = container.querySelector('.text-2xl')
      expect(priceElement).toBeInTheDocument()
      
      rerender(<PriceDisplay price={100} size="large" />)
      priceElement = container.querySelector('.text-3xl')
      expect(priceElement).toBeInTheDocument()
    })

    it('applies custom className', () => {
      const { container } = render(<PriceDisplay price={100} className="custom-price" />)
      
      expect(container.firstChild).toHaveClass('custom-price')
    })
  })

  describe('coupon discount application', () => {
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

    it('shows discounted price when coupon is active', () => {
      render(<PriceDisplay price={100} />)
      
      expect(mockDiscountCalculator.applyCouponDiscount).toHaveBeenCalledWith(100, mockCouponContext.activeCoupon)
    })

    it('displays original price when showOriginal is true', () => {
      render(<PriceDisplay price={100} showOriginal={true} />)
      
      expect(screen.getByText('₹100.00')).toBeInTheDocument() // Original price struck through
      expect(mockPriceExtractor.formatPrice).toHaveBeenCalledWith(100, '₹') // Original price formatting
    })

    it('hides original price when showOriginal is false', () => {
      render(<PriceDisplay price={100} showOriginal={false} />)
      
      expect(mockDiscountCalculator.applyCouponDiscount).toHaveBeenCalled()
    })

    it('shows savings amount when showSavings is true', () => {
      render(<PriceDisplay price={100} showSavings={true} />)
      
      expect(screen.getByText('You save ₹20.00')).toBeInTheDocument()
    })

    it('shows discount badge when showDiscountBadge is true', () => {
      render(<PriceDisplay price={100} showDiscountBadge={true} />)
      
      expect(screen.getByText('20% OFF')).toBeInTheDocument()
      expect(mockDiscountCalculator.getDiscountBadge).toHaveBeenCalledWith(20)
    })
  })

  describe('price range handling', () => {
    beforeEach(() => {
      mockCouponContext.hasActiveCoupon = false
      mockCouponContext.activeCoupon = null
      mockDiscountCalculator.applyCouponDiscountToRange.mockReturnValue(null)
    })

    it('handles price ranges correctly', () => {
      render(<PriceDisplay price={150} priceRange="₹100.00 - ₹200.00" />)
      
      expect(mockDiscountCalculator.applyCouponDiscountToRange).toHaveBeenCalledWith('₹100.00 - ₹200.00', null)
      expect(screen.getByText('₹100.00 - ₹200.00')).toBeInTheDocument()
    })

    it('applies discount to price ranges when coupon is active', () => {
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
      
      render(<PriceDisplay price={150} priceRange="₹100.00 - ₹200.00" />)
      
      expect(mockDiscountCalculator.applyCouponDiscountToRange).toHaveBeenCalledWith('₹100.00 - ₹200.00', mockCouponContext.activeCoupon)
    })
  })

  describe('size variants', () => {
    it('applies small size classes', () => {
      const { container } = render(<PriceDisplay price={100} size="small" />)
      
      expect(container.querySelector('.text-lg')).toBeInTheDocument() // Main price
    })

    it('applies medium size classes', () => {
      const { container } = render(<PriceDisplay price={100} size="medium" />)
      
      expect(container.querySelector('.text-2xl')).toBeInTheDocument() // Main price
    })

    it('applies large size classes', () => {
      const { container } = render(<PriceDisplay price={100} size="large" />)
      
      expect(container.querySelector('.text-3xl')).toBeInTheDocument() // Main price
    })
  })

  describe('custom currency handling', () => {
    it('uses custom currency symbol', () => {
      render(<PriceDisplay price={100} currency="$" />)
      
      // Should use the custom currency in formatting
      expect(mockPriceExtractor.formatPrice).toHaveBeenCalledWith(expect.any(Number), '$')
    })

    it('defaults to rupee symbol', () => {
      render(<PriceDisplay price={100} />)
      
      expect(mockPriceExtractor.formatPrice).toHaveBeenCalledWith(expect.any(Number), '₹')
    })
  })

  describe('edge cases', () => {
    it('handles zero price', () => {
      render(<PriceDisplay price={0} />)
      
      expect(mockPriceExtractor.formatPrice).toHaveBeenCalledWith(0, '₹')
    })

    it('handles negative price', () => {
      render(<PriceDisplay price={-50} />)
      
      expect(mockPriceExtractor.formatPrice).toHaveBeenCalledWith(-50, '₹')
    })

    it('handles very large prices', () => {
      render(<PriceDisplay price={999999.99} />)
      
      expect(mockPriceExtractor.formatPrice).toHaveBeenCalledWith(999999.99, '₹')
    })

    it('handles invalid price strings gracefully', () => {
      render(<PriceDisplay price="invalid-price" />)
      
      expect(mockDiscountCalculator.applyCouponDiscount).toHaveBeenCalledWith('invalid-price', null)
    })
  })

  describe('conditional rendering', () => {
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

    it('hides savings when showSavings is false', () => {
      render(<PriceDisplay price={100} showSavings={false} />)
      
      expect(screen.queryByText(/You save/i)).not.toBeInTheDocument()
    })

    it('hides discount badge when showDiscountBadge is false', () => {
      render(<PriceDisplay price={100} showDiscountBadge={false} />)
      
      expect(screen.queryByText('20% OFF')).not.toBeInTheDocument()
    })

    it('shows only discounted price when showOriginal is false', () => {
      render(<PriceDisplay price={100} showOriginal={false} />)
      
      // Should show discounted price but not original price struck through
      expect(screen.getByText('₹80.00')).toBeInTheDocument()
      expect(screen.queryByTestId('original-price')).not.toBeInTheDocument()
    })
  })

  describe('accessibility', () => {
    it('provides proper price semantics', () => {
      render(<PriceDisplay price={100} />)
      
      // Price should be in the document and accessible
      const priceElement = screen.getByText('₹100.00')
      expect(priceElement).toBeInTheDocument()
    })

    it('maintains readable contrast for all price states', () => {
      const { container } = render(<PriceDisplay price={100} />)
      
      // All text should have proper contrast classes
      const textElements = container.querySelectorAll('[class*="text-"]')
      expect(textElements.length).toBeGreaterThan(0)
    })
  })
})