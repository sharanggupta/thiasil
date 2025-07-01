import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import ProductCard from '../ProductCard'

// Mock the CSS modules
jest.mock('../ProductCard.module.css', () => ({
  'variant-card': 'variant-card',
  'variant-card-inner': 'variant-card-inner',
  'variant-card-front': 'variant-card-front',
  'variant-card-picture': 'variant-card-picture',
  'variant-card-labelContainer': 'variant-card-labelContainer',
  'variant-card-label': 'variant-card-label',
  'variant-card-info': 'variant-card-info',
  'variant-card-backRect': 'variant-card-backRect',
  'out-of-stock': 'out-of-stock'
}))

// Mock Button component
jest.mock('@/app/components/MainButton/Button', () => {
  return function MockButton({ name, href, onClick, disabled, className, ...props }: any) {
    // Filter out non-DOM props
    const { bgColor, color, padding, textSize, size, ...domProps } = props
    const Component = href ? 'a' : 'button'
    return (
      <Component
        href={href}
        onClick={onClick}
        disabled={disabled}
        className={className}
        {...domProps}
      >
        {name}
      </Component>
    )
  }
})

// Mock image utils
jest.mock('@/lib/image-utils', () => ({
  getProductImageInfo: jest.fn()
}))

import { getProductImageInfo } from '@/lib/image-utils'

const mockGetProductImageInfo = getProductImageInfo as jest.MockedFunction<typeof getProductImageInfo>

describe('ProductCard Component', () => {
  const mockProduct = {
    catNo: 'GB-500',
    name: 'Glass Beaker 500ml',
    category: 'beakers',
    categorySlug: 'beakers',
    capacity: '500ml',
    dimensions: {
      height: '95',
      diameter: '85'
    },
    packaging: 'Individual',
    stockStatus: 'in_stock',
    price: '₹150.00'
  }

  const mockActiveCoupon = {
    code: 'SAVE10',
    discountPercent: 10
  }

  beforeEach(() => {
    mockGetProductImageInfo.mockReturnValue({
      url: '/images/products/gb-500.webp',
      hasImage: true
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('when rendering product information', () => {
    it('should display all essential product details', () => {
      // Given: A complete product with all details
      
      // When: ProductCard is rendered
      render(<ProductCard product={mockProduct} />)
      
      // Then: All product information is displayed
      expect(screen.getByText('Glass Beaker 500ml')).toBeInTheDocument()
      expect(screen.getByText('Cat No: GB-500')).toBeInTheDocument()
      expect(screen.getByText('capacity: 500ml')).toBeInTheDocument()
      expect(screen.getByText('packaging: Individual')).toBeInTheDocument()
    })

    it('should format product dimensions for display', () => {
      // Given: Product with height and diameter dimensions
      
      // When: ProductCard is rendered
      render(<ProductCard product={mockProduct} />)
      
      // Then: Dimensions are formatted consistently
      expect(screen.getByText('H: 95mm, D: 85mm')).toBeInTheDocument()
    })

    it('should use catalog number as fallback when product name is missing', () => {
      // Given: Product without a name
      const productWithoutName = { ...mockProduct, name: '' }
      
      // When: ProductCard is rendered
      render(<ProductCard product={productWithoutName} />)
      
      // Then: Catalog number is used as display name
      expect(screen.getByText('GB-500')).toBeInTheDocument()
    })
  })

  describe('when handling product images', () => {
    it('should display product image as background when available', () => {
      // Given: Product with available image
      
      // When: ProductCard is rendered
      render(<ProductCard product={mockProduct} />)
      
      // Then: Image is set as background with overlay
      const imageDiv = document.querySelector('.variant-card-picture')
      expect(imageDiv).toHaveStyle({
        backgroundImage: "var(--card-overlay-gradient), url('/images/products/gb-500.webp')"
      })
    })

    it('should show placeholder when product image is not available', () => {
      // Given: Product without available image
      mockGetProductImageInfo.mockReturnValue({
        url: null,
        hasImage: false
      })
      
      // When: ProductCard is rendered
      render(<ProductCard product={mockProduct} />)
      
      // Then: No image placeholder is displayed
      expect(screen.getByText('No Image')).toBeInTheDocument()
      const svg = document.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })

    it('should request image information for the specific product', () => {
      // Given: A product requiring image lookup
      
      // When: ProductCard is rendered
      render(<ProductCard product={mockProduct} />)
      
      // Then: Image utility is called with correct product
      expect(mockGetProductImageInfo).toHaveBeenCalledWith(mockProduct)
    })
  })

  describe('when handling stock status', () => {
    it('should enable interaction for in-stock products', () => {
      // Given: Product that is in stock
      
      // When: ProductCard is rendered
      render(<ProductCard product={mockProduct} />)
      
      // Then: Button is enabled and links to product page
      const button = screen.getByText('Details')
      expect(button).not.toHaveAttribute('disabled')
      expect(button).toHaveAttribute('href', '/products/beakers/GB-500')
    })

    it('should disable interaction for out-of-stock products', () => {
      // Given: Product that is out of stock
      const outOfStockProduct = { ...mockProduct, stockStatus: 'out_of_stock' }
      
      // When: ProductCard is rendered
      render(<ProductCard product={outOfStockProduct} />)
      
      // Then: Button shows unavailable state and is disabled
      const button = screen.getByText('Unavailable')
      expect(button).toHaveAttribute('disabled')
      expect(button).not.toHaveAttribute('href')
    })

    it('should apply visual styling to indicate out-of-stock status', () => {
      // Given: Product that is out of stock
      const outOfStockProduct = { ...mockProduct, stockStatus: 'out_of_stock' }
      
      // When: ProductCard is rendered
      const { container } = render(<ProductCard product={outOfStockProduct} />)
      
      // Then: Appropriate CSS class is applied for styling
      const card = container.firstChild as HTMLElement
      expect(card).toHaveClass('out-of-stock')
    })
  })

  describe('when displaying pricing information', () => {
    it('should show custom price when explicitly provided', () => {
      // Given: ProductCard with custom display price
      
      // When: Card is rendered with custom price
      render(<ProductCard product={mockProduct} displayPrice="₹135.00" />)
      
      // Then: Custom price is displayed
      expect(screen.getByText('₹135.00')).toBeInTheDocument()
    })

    it('should show contact message when no price is available', () => {
      // Given: ProductCard without custom price
      
      // When: Card is rendered
      render(<ProductCard product={mockProduct} />)
      
      // Then: Contact message is shown as fallback
      expect(screen.getByText('Contact for pricing')).toBeInTheDocument()
    })

    it('should display active coupon discount information', () => {
      // Given: ProductCard with active coupon
      
      // When: Card is rendered with coupon
      render(<ProductCard product={mockProduct} activeCoupon={mockActiveCoupon} />)
      
      // Then: Coupon discount information is displayed
      expect(screen.getByText('10% off with SAVE10')).toBeInTheDocument()
    })

    it('should show both custom price and coupon information together', () => {
      // Given: ProductCard with both custom price and active coupon
      
      // When: Card is rendered with price and coupon
      render(
        <ProductCard 
          product={mockProduct} 
          displayPrice="₹135.00"
          activeCoupon={mockActiveCoupon} 
        />
      )
      
      // Then: Both price and coupon info are displayed
      expect(screen.getByText('₹135.00')).toBeInTheDocument()
      expect(screen.getByText('10% off with SAVE10')).toBeInTheDocument()
    })
  })

  describe('when using custom content and button configurations', () => {
    it('should replace default content with custom back content', () => {
      // Given: Custom content for card back
      const customBackContent = <div>Custom Content</div>
      
      // When: ProductCard is rendered with custom content
      render(<ProductCard product={mockProduct} backContent={customBackContent} />)
      
      // Then: Custom content replaces default elements
      expect(screen.getByText('Custom Content')).toBeInTheDocument()
      expect(screen.queryByText('Contact for pricing')).not.toBeInTheDocument()
      expect(screen.queryByText('Details')).not.toBeInTheDocument()
    })

    it('should use custom button text when provided', () => {
      // Given: Custom button text
      
      // When: ProductCard is rendered with custom button text
      render(<ProductCard product={mockProduct} buttonText="Buy Now" />)
      
      // Then: Custom text appears instead of default
      expect(screen.getByText('Buy Now')).toBeInTheDocument()
      expect(screen.queryByText('Details')).not.toBeInTheDocument()
    })

    it('should use custom button link when provided', () => {
      // Given: Custom button href
      
      // When: ProductCard is rendered with custom href
      render(<ProductCard product={mockProduct} buttonHref="/custom-link" />)
      
      // Then: Button links to custom URL
      const button = screen.getByText('Details')
      expect(button).toHaveAttribute('href', '/custom-link')
    })

    it('should execute custom click handler when button is clicked', () => {
      // Given: Custom click handler
      const handleClick = jest.fn()
      
      // When: ProductCard is rendered with custom handler and button is clicked
      render(<ProductCard product={mockProduct} buttonOnClick={handleClick} />)
      const button = screen.getByText('Details')
      fireEvent.click(button)
      
      // Then: Custom handler is executed
      expect(handleClick).toHaveBeenCalledTimes(1)
    })
  })

  describe('when handling user interactions', () => {
    it('should execute card click handler when card is clicked', () => {
      // Given: ProductCard with click handler
      const handleCardClick = jest.fn()
      
      // When: Card is rendered and clicked
      render(<ProductCard product={mockProduct} onCardClick={handleCardClick} />)
      const card = screen.getByText('Glass Beaker 500ml').closest('.variant-card')
      fireEvent.click(card!)
      
      // Then: Click handler is executed
      expect(handleCardClick).toHaveBeenCalledTimes(1)
    })

    it('should handle card clicks gracefully when no handler is provided', () => {
      // Given: ProductCard without click handler
      
      // When: Card is rendered and clicked
      render(<ProductCard product={mockProduct} />)
      const card = screen.getByText('Glass Beaker 500ml').closest('.variant-card')
      
      // Then: Click does not cause errors
      expect(() => fireEvent.click(card!)).not.toThrow()
    })
  })

  describe('when rendering conditional product fields', () => {
    it('should hide capacity field when value is not meaningful', () => {
      // Given: Products with N/A or Custom capacity values
      const productNA = { ...mockProduct, capacity: 'N/A' }
      const productCustom = { ...mockProduct, capacity: 'Custom' }
      
      // When: ProductCards are rendered
      const { rerender } = render(<ProductCard product={productNA} />)
      
      // Then: Capacity field is hidden for non-meaningful values
      expect(screen.queryByText(/capacity:/)).not.toBeInTheDocument()
      
      rerender(<ProductCard product={productCustom} />)
      expect(screen.queryByText(/capacity:/)).not.toBeInTheDocument()
    })

    it('should hide dimensions section when no valid dimensions exist', () => {
      // Given: Product without dimensions
      const productNoDimensions = { ...mockProduct, dimensions: {} }
      
      // When: ProductCard is rendered
      render(<ProductCard product={productNoDimensions} />)
      
      // Then: Dimensions section is not displayed
      expect(screen.queryByText(/H:/)).not.toBeInTheDocument()
    })

    it('should hide packaging field when value is standard or not applicable', () => {
      // Given: Products with N/A or default packaging values
      const productNA = { ...mockProduct, packaging: 'N/A' }
      const productDefault = { ...mockProduct, packaging: '1 piece' }
      
      // When: ProductCards are rendered
      const { rerender } = render(<ProductCard product={productNA} />)
      
      // Then: Packaging field is hidden for standard values
      expect(screen.queryByText(/packaging:/)).not.toBeInTheDocument()
      
      rerender(<ProductCard product={productDefault} />)
      expect(screen.queryByText(/packaging:/)).not.toBeInTheDocument()
    })

    it('should filter out empty or invalid dimension values', () => {
      // Given: Product with mixed valid and invalid dimensions
      const productWithEmptyDimensions = {
        ...mockProduct,
        dimensions: {
          height: '95',
          diameter: '',
          width: 'N/A',
          length: '  '
        }
      }
      
      // When: ProductCard is rendered
      render(<ProductCard product={productWithEmptyDimensions} />)
      
      // Then: Only valid dimensions are displayed
      expect(screen.getByText('H: 95mm')).toBeInTheDocument()
      expect(screen.queryByText(/D:/)).not.toBeInTheDocument()
      expect(screen.queryByText(/W:/)).not.toBeInTheDocument()
      expect(screen.queryByText(/L:/)).not.toBeInTheDocument()
    })
  })

  describe('when applying styling and layout', () => {
    it('should apply custom CSS classes when provided', () => {
      // Given: ProductCard with custom className
      
      // When: Card is rendered with custom class
      const { container } = render(<ProductCard product={mockProduct} className="custom-class" />)
      const card = container.firstChild as HTMLElement
      
      // Then: Custom class is applied to card element
      expect(card).toHaveClass('custom-class')
    })

    it('should apply default CSS module classes for layout structure', () => {
      // Given: ProductCard with default styling
      
      // When: Card is rendered
      const { container } = render(<ProductCard product={mockProduct} />)
      
      // Then: All necessary CSS classes are present for layout
      expect(container.querySelector('.variant-card')).toBeInTheDocument()
      expect(container.querySelector('.variant-card-inner')).toBeInTheDocument()
      expect(container.querySelector('.variant-card-front')).toBeInTheDocument()
      expect(container.querySelector('.variant-card-backRect')).toBeInTheDocument()
    })

    it('should pass through DOM attributes while filtering component-specific props', () => {
      // Given: ProductCard with mix of DOM and component props
      
      // When: Card is rendered with various props
      render(<ProductCard product={mockProduct} data-testid="product-card" loading={true} />)
      
      // Then: DOM attributes are preserved, component props are filtered
      const card = screen.getByTestId('product-card')
      expect(card).toBeInTheDocument()
      expect(card).not.toHaveAttribute('loading')
    })
  })

  describe('when generating product URLs', () => {
    it('should create correct product page URL for in-stock products', () => {
      // Given: In-stock product with category and catalog number
      
      // When: ProductCard is rendered
      render(<ProductCard product={mockProduct} />)
      
      // Then: Button links to correct product page
      const button = screen.getByText('Details')
      expect(button).toHaveAttribute('href', '/products/beakers/GB-500')
    })

    it('should use category fallback when categorySlug is missing', () => {
      // Given: Product without categorySlug
      const productWithoutSlug = { ...mockProduct, categorySlug: undefined }
      
      // When: ProductCard is rendered
      render(<ProductCard product={productWithoutSlug} />)
      
      // Then: Category is used in URL path
      const button = screen.getByText('Details')
      expect(button).toHaveAttribute('href', '/products/beakers/GB-500')
    })

    it('should properly encode special characters in catalog numbers', () => {
      // Given: Product with special characters in catalog number
      const productWithSpecialCatNo = { ...mockProduct, catNo: 'GB-500 (Special)' }
      
      // When: ProductCard is rendered
      render(<ProductCard product={productWithSpecialCatNo} />)
      
      // Then: Special characters are URL encoded
      const button = screen.getByText('Details')
      expect(button).toHaveAttribute('href', '/products/beakers/GB-500%20(Special)')
    })
  })

  describe('when providing accessibility features', () => {
    it('should provide proper link semantics for interactive products', () => {
      // Given: In-stock product that can be navigated to
      
      // When: ProductCard is rendered
      render(<ProductCard product={mockProduct} />)
      
      // Then: Proper link role and attributes are present
      const button = screen.getByRole('link')
      expect(button).toBeInTheDocument()
      expect(button).toHaveTextContent('Details')
      expect(button).toHaveAttribute('href', '/products/beakers/GB-500')
    })

    it('should provide appropriate disabled state for non-interactive products', () => {
      // Given: Out-of-stock product that cannot be navigated to
      const outOfStockProduct = { ...mockProduct, stockStatus: 'out_of_stock' }
      
      // When: ProductCard is rendered
      render(<ProductCard product={outOfStockProduct} />)
      
      // Then: Button role with disabled state is provided
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('disabled')
      expect(button).toHaveTextContent('Unavailable')
    })
  })
})