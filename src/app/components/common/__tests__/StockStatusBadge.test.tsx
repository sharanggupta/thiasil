import React from 'react'
import { render, screen } from '@testing-library/react'
import StockStatusBadge from '../StockStatusBadge'

describe('StockStatusBadge Component', () => {
  describe('when displaying different stock availability states', () => {
    it('should show available products as in stock with shipping information', () => {
      // Given: Product with available inventory
      
      // When: StockStatusBadge is rendered with in_stock status
      render(<StockStatusBadge status="in_stock" />)
      
      // Then: Users see clear availability and shipping readiness
      expect(screen.getByText('In Stock')).toBeInTheDocument()
      expect(screen.getByText('Product is available and ready to ship.')).toBeInTheDocument()
    })

    it('should communicate unavailable products clearly to prevent purchase attempts', () => {
      // Given: Product with no available inventory
      
      // When: StockStatusBadge is rendered with out_of_stock status
      render(<StockStatusBadge status="out_of_stock" />)
      
      // Then: Users understand product cannot be purchased immediately
      expect(screen.getByText('Out of Stock')).toBeInTheDocument()
      expect(screen.getByText('Product is currently unavailable.')).toBeInTheDocument()
    })

    it('should inform customers about custom manufacturing timeline', () => {
      // Given: Product requiring custom manufacturing
      
      // When: StockStatusBadge is rendered with made_to_order status
      render(<StockStatusBadge status="made_to_order" />)
      
      // Then: Users understand extended delivery time due to manufacturing
      expect(screen.getByText('Made to Order')).toBeInTheDocument()
      expect(screen.getByText('Product is manufactured after order is placed.')).toBeInTheDocument()
    })

    it('should create urgency for products with low inventory', () => {
      // Given: Product with limited remaining inventory
      
      // When: StockStatusBadge is rendered with limited_stock status
      render(<StockStatusBadge status="limited_stock" />)
      
      // Then: Users understand scarcity and may prioritize purchase decision
      expect(screen.getByText('Limited Stock')).toBeInTheDocument()
      expect(screen.getByText('Only a few units left in stock.')).toBeInTheDocument()
    })
  })

  describe('when applying visual styling and custom classes', () => {
    it('should accept and apply custom CSS classes for specialized styling', () => {
      // Given: StockStatusBadge requiring custom styling for specific context
      
      // When: Component is rendered with custom className
      const { container } = render(<StockStatusBadge status="in_stock" className="custom-class" />)
      const badge = container.firstChild as HTMLElement
      
      // Then: Custom class is applied alongside default styling
      expect(badge).toHaveClass('custom-class')
    })

    it('should use consistent badge styling for professional appearance', () => {
      // Given: StockStatusBadge requiring standardized visual presentation
      
      // When: Component is rendered with default styling
      const { container } = render(<StockStatusBadge status="in_stock" />)
      const badge = container.firstChild as HTMLElement
      
      // Then: Professional badge styling is applied consistently
      expect(badge).toHaveClass('relative', 'inline-block', 'px-3', 'py-1', 'rounded-full', 'text-xs', 'font-medium')
    })

    it('should maintain consistent width for uniform badge alignment', () => {
      // Given: StockStatusBadge in layout requiring consistent dimensions
      
      // When: Component is rendered
      const { container } = render(<StockStatusBadge status="in_stock" />)
      const badge = container.firstChild as HTMLElement
      
      // Then: Minimum width ensures consistent layout regardless of text length
      expect(badge).toHaveClass('min-w-[100px]')
    })

    it('should center text content for balanced visual presentation', () => {
      // Given: StockStatusBadge requiring centered text alignment
      
      // When: Component is rendered
      const { container } = render(<StockStatusBadge status="in_stock" />)
      const badge = container.firstChild as HTMLElement
      
      // Then: Text is centered within badge for visual balance
      expect(badge).toHaveClass('text-center')
    })
  })

  describe('when providing additional information through tooltips', () => {
    it('should display explanatory tooltips for all stock status types', () => {
      // Given: All stock status types requiring user understanding
      const statuses = ['in_stock', 'out_of_stock', 'made_to_order', 'limited_stock'] as const
      const expectedTexts = [
        'Product is available and ready to ship.',
        'Product is currently unavailable.',
        'Product is manufactured after order is placed.',
        'Only a few units left in stock.'
      ]

      statuses.forEach((status, index) => {
        // When: Each status badge is rendered
        const { container } = render(<StockStatusBadge status={status} />)
        const tooltip = container.querySelector('.hidden.group-hover\\:flex')
        
        // Then: Tooltip provides clear explanation of stock status implications
        expect(tooltip).toBeInTheDocument()
        expect(tooltip).toHaveTextContent(expectedTexts[index])
        expect(tooltip).toHaveClass('absolute', 'left-1/2', '-translate-x-1/2', 'mt-2', 'z-20')
      })
    })

    it('should use modern glassmorphism design for tooltips', () => {
      // Given: StockStatusBadge requiring contemporary tooltip styling
      
      // When: Component is rendered with tooltip
      const { container } = render(<StockStatusBadge status="in_stock" />)
      const tooltip = container.querySelector('.hidden.group-hover\\:flex')
      
      // Then: Tooltip uses glassmorphism design for modern visual appeal
      expect(tooltip).toHaveClass(
        'px-4', 'py-2', 'rounded-xl', 'bg-white/30', 'backdrop-blur-md', 
        'border', 'border-white/30', 'text-white', 'text-xs', 'font-normal', 
        'shadow-lg', 'transition-all', 'duration-200', 'whitespace-nowrap', 
        'pointer-events-none'
      )
    })
  })

  describe('when handling invalid or unknown status values', () => {
    it('should provide safe fallback behavior for unknown status types', () => {
      // Given: Invalid or unsupported status value
      
      // When: StockStatusBadge is rendered with unknown status
      render(<StockStatusBadge status="unknown_status" />)
      
      // Then: Component gracefully defaults to safest assumption (In Stock)
      expect(screen.getByText('In Stock')).toBeInTheDocument()
    })

    it('should handle unknown status without confusing tooltip information', () => {
      // Given: Unknown status that should not display misleading tooltip
      
      // When: StockStatusBadge is rendered with unknown status
      const { container } = render(<StockStatusBadge status="unknown_status" />)
      const tooltip = container.querySelector('.hidden.group-hover\\:flex')
      
      // Then: Tooltip is empty or absent to avoid user confusion
      if (tooltip) {
        expect(tooltip).toHaveTextContent('')
      }
    })
  })

  describe('when handling missing or invalid data gracefully', () => {
    it('should provide sensible defaults for empty status strings', () => {
      // Given: Product data with empty status field
      
      // When: StockStatusBadge is rendered with empty status
      render(<StockStatusBadge status="" />)
      
      // Then: Component defaults to most optimistic status to avoid blocking sales
      expect(screen.getByText('In Stock')).toBeInTheDocument()
    })

    it('should handle null status values without breaking component', () => {
      // Given: Product data with null status field
      
      // When: StockStatusBadge is rendered with null status
      render(<StockStatusBadge status={null as any} />)
      
      // Then: Component provides safe fallback status display
      expect(screen.getByText('In Stock')).toBeInTheDocument()
    })

    it('should handle undefined status values with appropriate fallback', () => {
      // Given: Product data with undefined status field
      
      // When: StockStatusBadge is rendered with undefined status
      render(<StockStatusBadge status={undefined as any} />)
      
      // Then: Component displays fallback status to maintain functionality
      expect(screen.getByText('In Stock')).toBeInTheDocument()
    })
  })

  describe('when integrating with different layout systems', () => {
    it('should maintain consistent display behavior across layout contexts', () => {
      // Given: StockStatusBadge used in different container layouts
      const { rerender, container } = render(
        <div className="flex items-center gap-2">
          <StockStatusBadge status="in_stock" />
        </div>
      )
      
      // When: Badge is used in flexbox layout
      let badge = container.querySelector('span')
      
      // Then: Inline-block display integrates properly with flex layout
      expect(badge).toHaveClass('inline-block')
      
      // When: Badge is moved to grid layout
      rerender(
        <div className="grid grid-cols-2 gap-4">
          <StockStatusBadge status="in_stock" />
        </div>
      )
      
      badge = container.querySelector('span')
      
      // Then: Same display behavior works consistently in grid layout
      expect(badge).toHaveClass('inline-block')
    })
  })
})