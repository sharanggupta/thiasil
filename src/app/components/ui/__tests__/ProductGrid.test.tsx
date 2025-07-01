import React from 'react'
import { render, screen } from '@testing-library/react'
import ProductGrid from '../ProductGrid'

// Mock ProductCardSkeleton
jest.mock('../ProductCardSkeleton', () => {
  return function MockProductCardSkeleton({ count }: { count: number }) {
    return (
      <div data-testid="skeleton-loader">
        {Array.from({ length: count }, (_, i) => (
          <div key={i} data-testid={`skeleton-${i}`} className="skeleton-item">
            Loading skeleton {i + 1}
          </div>
        ))}
      </div>
    )
  }
})

describe('ProductGrid Component', () => {
  const mockChildren = (
    <>
      <div data-testid="product-1">Product 1</div>
      <div data-testid="product-2">Product 2</div>
      <div data-testid="product-3">Product 3</div>
    </>
  )

  describe('when rendering product collections in grid layout', () => {
    it('should display all product children in organized grid structure', () => {
      // Given: Multiple products requiring organized display
      
      // When: ProductGrid renders with product children
      render(<ProductGrid>{mockChildren}</ProductGrid>)
      
      // Then: All products are visible and accessible in grid layout
      expect(screen.getByTestId('product-1')).toBeInTheDocument()
      expect(screen.getByTestId('product-2')).toBeInTheDocument()
      expect(screen.getByTestId('product-3')).toBeInTheDocument()
    })

    it('should apply responsive grid styling with proper spacing and alignment', () => {
      // Given: ProductGrid requiring default responsive layout behavior
      
      // When: Component renders with default configuration
      const { container } = render(<ProductGrid>{mockChildren}</ProductGrid>)
      const grid = container.firstChild as HTMLElement
      
      // Then: Standard grid classes provide responsive layout with proper spacing
      expect(grid).toHaveClass('grid', 'auto-fit-grid', 'gap-6', 'items-stretch')
    })

    it('should accept and apply custom CSS classes for specialized styling', () => {
      // Given: ProductGrid requiring custom styling for specific design context
      
      // When: Component renders with custom className
      const { container } = render(<ProductGrid className="custom-grid">{mockChildren}</ProductGrid>)
      const grid = container.firstChild as HTMLElement
      
      // Then: Custom class is applied alongside default grid functionality
      expect(grid).toHaveClass('custom-grid')
    })
  })

  describe('when adapting layout for different screen sizes and devices', () => {
    it('should use CSS auto-fit grid for automatic responsive behavior', () => {
      // Given: Product grid requiring automatic screen size adaptation
      
      // When: ProductGrid renders with default responsive configuration
      const { container } = render(<ProductGrid>{mockChildren}</ProductGrid>)
      const grid = container.firstChild as HTMLElement
      
      // Then: Auto-fit grid adapts to available space with minimum item width
      expect(grid).toHaveClass('auto-fit-grid')
      expect(grid).toHaveStyle({ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' })
    })

    it('should respect custom minimum item width for optimal product card sizing', () => {
      // Given: Products requiring specific minimum width for proper display
      
      // When: ProductGrid renders with custom minimum item width
      const { container } = render(<ProductGrid minItemWidth="320px">{mockChildren}</ProductGrid>)
      const grid = container.firstChild as HTMLElement
      
      // Then: Custom minimum width ensures adequate space for product information
      expect(grid).toHaveStyle({ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' })
    })

    it('should use fixed column layout when responsive behavior is disabled', () => {
      // Given: Admin interface or specialized view requiring fixed grid structure
      
      // When: ProductGrid renders with responsive disabled
      const { container } = render(<ProductGrid responsive={false}>{mockChildren}</ProductGrid>)
      const grid = container.firstChild as HTMLElement
      
      // Then: Fixed 3-column layout provides predictable structure
      expect(grid).toHaveClass('grid-cols-3')
      expect(grid).not.toHaveClass('auto-fit-grid')
      expect(grid).not.toHaveStyle({ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' })
    })
  })

  describe('when configuring fixed column layouts for specialized interfaces', () => {
    it('should create single column layout for mobile or detailed view', () => {
      // Given: Interface requiring single column for detailed product examination
      
      // When: ProductGrid renders with 1 column configuration
      const { container } = render(<ProductGrid columns={1} responsive={false}>{mockChildren}</ProductGrid>)
      const grid = container.firstChild as HTMLElement
      
      // Then: Single column provides maximum width for detailed product display
      expect(grid).toHaveClass('grid-cols-1')
    })

    it('should create two column layout for tablet or comparison view', () => {
      // Given: Interface optimized for tablet screens or side-by-side comparison
      
      // When: ProductGrid renders with 2 column configuration
      const { container } = render(<ProductGrid columns={2} responsive={false}>{mockChildren}</ProductGrid>)
      const grid = container.firstChild as HTMLElement
      
      // Then: Two columns balance product visibility with adequate detail space
      expect(grid).toHaveClass('grid-cols-2')
    })

    it('should create four column layout for dense product catalogs', () => {
      // Given: Product catalog requiring high density display
      
      // When: ProductGrid renders with 4 column configuration
      const { container } = render(<ProductGrid columns={4} responsive={false}>{mockChildren}</ProductGrid>)
      const grid = container.firstChild as HTMLElement
      
      // Then: Four columns maximize product visibility in available space
      expect(grid).toHaveClass('grid-cols-4')
    })

    it('should create five column layout for specialized admin interfaces', () => {
      // Given: Admin interface requiring custom column configuration
      
      // When: ProductGrid renders with 5 column configuration
      const { container } = render(<ProductGrid columns={5} responsive={false}>{mockChildren}</ProductGrid>)
      const grid = container.firstChild as HTMLElement
      
      // Then: Five columns provide specialized layout for admin workflows
      expect(grid).toHaveClass('grid-cols-5')
    })

    it('should create six column layout for maximum density display', () => {
      // Given: Interface requiring maximum product density
      
      // When: ProductGrid renders with 6 column configuration
      const { container } = render(<ProductGrid columns={6} responsive={false}>{mockChildren}</ProductGrid>)
      const grid = container.firstChild as HTMLElement
      
      // Then: Six columns provide maximum density while maintaining usability
      expect(grid).toHaveClass('grid-cols-6')
    })

    it('should use balanced three column layout as default for fixed grids', () => {
      // Given: Fixed grid requiring balanced default layout
      
      // When: ProductGrid renders with responsive disabled but no column specification
      const { container } = render(<ProductGrid responsive={false}>{mockChildren}</ProductGrid>)
      const grid = container.firstChild as HTMLElement
      
      // Then: Three columns provide optimal balance of visibility and detail
      expect(grid).toHaveClass('grid-cols-3')
    })
  })

  describe('when adjusting spacing between products for visual hierarchy', () => {
    it('should use compact spacing for high-density product displays', () => {
      // Given: Interface requiring maximum product visibility with minimal spacing
      
      // When: ProductGrid renders with small gap configuration
      const { container } = render(<ProductGrid gap="small">{mockChildren}</ProductGrid>)
      const grid = container.firstChild as HTMLElement
      
      // Then: Compact spacing maximizes product count while maintaining separation
      expect(grid).toHaveClass('gap-4')
    })

    it('should use balanced spacing for general product browsing', () => {
      // Given: Standard product catalog requiring good visual balance
      
      // When: ProductGrid renders with default spacing
      const { container } = render(<ProductGrid>{mockChildren}</ProductGrid>)
      const grid = container.firstChild as HTMLElement
      
      // Then: Medium spacing provides optimal balance of density and readability
      expect(grid).toHaveClass('gap-6')
    })

    it('should use generous spacing for premium or featured product displays', () => {
      // Given: Premium product showcase requiring elegant presentation
      
      // When: ProductGrid renders with large gap configuration
      const { container } = render(<ProductGrid gap="large">{mockChildren}</ProductGrid>)
      const grid = container.firstChild as HTMLElement
      
      // Then: Generous spacing creates premium feel and emphasizes individual products
      expect(grid).toHaveClass('gap-8')
    })
  })

  describe('when providing loading feedback during data fetching', () => {
    it('should display skeleton placeholders instead of content during loading', () => {
      // Given: Product data being fetched requiring loading indication
      
      // When: ProductGrid renders in loading state
      render(<ProductGrid loading={true}>{mockChildren}</ProductGrid>)
      
      // Then: Skeleton loaders provide visual feedback while hiding actual content
      expect(screen.getByTestId('skeleton-loader')).toBeInTheDocument()
      expect(screen.queryByTestId('product-1')).not.toBeInTheDocument()
    })

    it('should show appropriate number of loading placeholders by default', () => {
      // Given: Loading state requiring realistic placeholder count
      
      // When: ProductGrid renders with default loading configuration
      render(<ProductGrid loading={true}>{mockChildren}</ProductGrid>)
      
      // Then: Six placeholders simulate typical product page content
      expect(screen.getByTestId('skeleton-0')).toBeInTheDocument()
      expect(screen.getByTestId('skeleton-5')).toBeInTheDocument()
      expect(screen.queryByTestId('skeleton-6')).not.toBeInTheDocument()
    })

    it('should respect custom loading count for different interface contexts', () => {
      // Given: Interface requiring specific number of loading placeholders
      
      // When: ProductGrid renders with custom loading count
      render(<ProductGrid loading={true} loadingCount={3}>{mockChildren}</ProductGrid>)
      
      // Then: Custom count provides appropriate loading feedback for context
      expect(screen.getByTestId('skeleton-0')).toBeInTheDocument()
      expect(screen.getByTestId('skeleton-1')).toBeInTheDocument()
      expect(screen.getByTestId('skeleton-2')).toBeInTheDocument()
      expect(screen.queryByTestId('skeleton-3')).not.toBeInTheDocument()
    })

    it('should maintain consistent grid styling during loading state', () => {
      // Given: Loading state requiring same visual layout as loaded content
      
      // When: ProductGrid renders loading skeletons with custom spacing
      const { container } = render(<ProductGrid loading={true} gap="large">{mockChildren}</ProductGrid>)
      const grid = container.firstChild as HTMLElement
      
      // Then: Grid styling remains consistent for smooth transition
      expect(grid).toHaveClass('grid', 'auto-fit-grid', 'gap-8', 'items-stretch')
    })

    it('should apply responsive behavior to loading placeholders', () => {
      // Given: Loading state requiring responsive placeholder layout
      
      // When: ProductGrid renders loading state with responsive configuration
      const { container } = render(<ProductGrid loading={true} minItemWidth="300px">{mockChildren}</ProductGrid>)
      const grid = container.firstChild as HTMLElement
      
      // Then: Responsive styling applies to placeholders for consistent experience
      expect(grid).toHaveStyle({ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' })
    })
  })

  describe('when combining different layout configurations for optimal display', () => {
    it('should combine responsive grid with compact spacing for dense mobile displays', () => {
      // Given: Mobile interface requiring dense product display with responsive behavior
      
      // When: ProductGrid combines responsive grid with small gap
      const { container } = render(<ProductGrid gap="small" minItemWidth="250px">{mockChildren}</ProductGrid>)
      const grid = container.firstChild as HTMLElement
      
      // Then: Responsive behavior works with compact spacing for mobile optimization
      expect(grid).toHaveClass('auto-fit-grid', 'gap-4')
      expect(grid).toHaveStyle({ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' })
    })

    it('should combine fixed columns with generous spacing for premium displays', () => {
      // Given: Premium product showcase requiring fixed layout with elegant spacing
      
      // When: ProductGrid combines fixed columns with large gap
      const { container } = render(<ProductGrid columns={2} gap="large" responsive={false}>{mockChildren}</ProductGrid>)
      const grid = container.firstChild as HTMLElement
      
      // Then: Fixed layout provides predictable structure with premium spacing
      expect(grid).toHaveClass('grid-cols-2', 'gap-8')
      expect(grid).not.toHaveStyle({ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' })
    })

    it('should prioritize responsive behavior over fixed column settings', () => {
      // Given: Configuration with conflicting responsive and column settings
      
      // When: ProductGrid receives both responsive and column configuration
      const { container } = render(<ProductGrid columns={5} responsive={true}>{mockChildren}</ProductGrid>)
      const grid = container.firstChild as HTMLElement
      
      // Then: Responsive behavior takes precedence for better user experience
      expect(grid).toHaveClass('auto-fit-grid')
      expect(grid).not.toHaveClass('grid-cols-5')
    })

    it('should ignore responsive settings when fixed layout is specified', () => {
      // Given: Configuration requiring fixed layout without responsive behavior
      
      // When: ProductGrid receives responsive settings with responsive disabled
      const { container } = render(<ProductGrid minItemWidth="400px" responsive={false}>{mockChildren}</ProductGrid>)
      const grid = container.firstChild as HTMLElement
      
      // Then: Fixed layout ignores responsive width settings
      expect(grid).not.toHaveStyle({ gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))' })
    })
  })

  describe('when handling unusual data conditions and extreme configurations', () => {
    it('should render stable grid container even with no product content', () => {
      // Given: Product grid with empty or missing product data
      
      // When: ProductGrid renders with empty children
      const { container } = render(<ProductGrid>{}</ProductGrid>)
      const grid = container.firstChild as HTMLElement
      
      // Then: Grid structure remains stable without breaking layout
      expect(grid).toBeInTheDocument()
      expect(grid).toHaveClass('grid')
    })

    it('should handle null children without component failure', () => {
      // Given: Product data that may be null during error states
      
      // When: ProductGrid renders with null children
      const { container } = render(<ProductGrid>{null}</ProductGrid>)
      const grid = container.firstChild as HTMLElement
      
      // Then: Component gracefully handles null data without crashing
      expect(grid).toBeInTheDocument()
      expect(grid).toHaveClass('grid')
    })

    it('should handle zero loading count for instant loading completion', () => {
      // Given: Loading state that completes immediately
      
      // When: ProductGrid renders with zero loading placeholders
      render(<ProductGrid loading={true} loadingCount={0}>{mockChildren}</ProductGrid>)
      
      // Then: Loading container exists but shows no placeholders
      expect(screen.getByTestId('skeleton-loader')).toBeInTheDocument()
      expect(screen.queryByTestId('skeleton-0')).not.toBeInTheDocument()
    })

    it('should handle very high loading counts for large datasets', () => {
      // Given: Interface loading very large product collections
      
      // When: ProductGrid renders with high loading placeholder count
      render(<ProductGrid loading={true} loadingCount={20}>{mockChildren}</ProductGrid>)
      
      // Then: All placeholders render correctly for large dataset preview
      expect(screen.getByTestId('skeleton-0')).toBeInTheDocument()
      expect(screen.getByTestId('skeleton-19')).toBeInTheDocument()
    })

    it('should handle extremely small minimum widths for compact displays', () => {
      // Given: Highly constrained display requiring minimal product width
      
      // When: ProductGrid renders with very small minimum item width
      const { container } = render(<ProductGrid minItemWidth="50px">{mockChildren}</ProductGrid>)
      const grid = container.firstChild as HTMLElement
      
      // Then: Extremely small width is applied without breaking grid behavior
      expect(grid).toHaveStyle({ gridTemplateColumns: 'repeat(auto-fit, minmax(50px, 1fr))' })
    })

    it('should handle very large minimum widths for detailed product displays', () => {
      // Given: Detailed product display requiring large minimum width
      
      // When: ProductGrid renders with very large minimum item width
      const { container } = render(<ProductGrid minItemWidth="1000px">{mockChildren}</ProductGrid>)
      const grid = container.firstChild as HTMLElement
      
      // Then: Large minimum width is applied for detailed product presentation
      expect(grid).toHaveStyle({ gridTemplateColumns: 'repeat(auto-fit, minmax(1000px, 1fr))' })
    })
  })

  describe('when ensuring accessibility and semantic correctness', () => {
    it('should use appropriate semantic container element for product collection', () => {
      // Given: Product collection requiring proper semantic markup
      
      // When: ProductGrid renders product container
      const { container } = render(<ProductGrid>{mockChildren}</ProductGrid>)
      const grid = container.firstChild as HTMLElement
      
      // Then: Div element provides appropriate semantic container for grid layout
      expect(grid.tagName).toBe('DIV')
    })

    it('should maintain consistent item alignment for uniform product presentation', () => {
      // Given: Product cards of varying heights requiring aligned presentation
      
      // When: ProductGrid renders with item alignment
      const { container } = render(<ProductGrid>{mockChildren}</ProductGrid>)
      const grid = container.firstChild as HTMLElement
      
      // Then: Stretch alignment ensures uniform card heights for clean layout
      expect(grid).toHaveClass('items-stretch')
    })

    it('should provide predictable structure for assistive technology', () => {
      // Given: Product grid requiring screen reader navigation
      
      // When: ProductGrid renders with semantic structure
      const { container } = render(<ProductGrid>{mockChildren}</ProductGrid>)
      const grid = container.firstChild as HTMLElement
      
      // Then: Consistent semantic structure enables reliable screen reader navigation
      expect(grid.tagName).toBe('DIV')
      expect(grid).toHaveClass('grid')
    })
  })

  describe('when optimizing rendering performance for large product collections', () => {
    it('should leverage CSS Grid for hardware-accelerated layout performance', () => {
      // Given: Product collection requiring optimal rendering performance
      
      // When: ProductGrid renders with CSS Grid layout
      const { container } = render(<ProductGrid>{mockChildren}</ProductGrid>)
      const grid = container.firstChild as HTMLElement
      
      // Then: CSS Grid enables hardware acceleration for smooth layout performance
      expect(grid).toHaveClass('grid')
    })

    it('should minimize DOM manipulation during configuration changes', () => {
      // Given: Dynamic interface requiring frequent layout updates
      const { container, rerender } = render(<ProductGrid gap="small">{mockChildren}</ProductGrid>)
      const initialGrid = container.firstChild as HTMLElement
      
      // When: Grid configuration changes
      rerender(<ProductGrid gap="large">{mockChildren}</ProductGrid>)
      const updatedGrid = container.firstChild as HTMLElement
      
      // Then: Same DOM element is reused with updated classes for optimal performance
      expect(initialGrid).toBe(updatedGrid)
      expect(updatedGrid).toHaveClass('gap-8')
      expect(updatedGrid).not.toHaveClass('gap-4')
    })

    it('should use CSS-based responsive behavior for optimal breakpoint handling', () => {
      // Given: Product grid requiring responsive behavior without JavaScript overhead
      
      // When: ProductGrid renders with responsive configuration
      const { container } = render(<ProductGrid responsive={true}>{mockChildren}</ProductGrid>)
      const grid = container.firstChild as HTMLElement
      
      // Then: CSS auto-fit provides responsive behavior without JavaScript event listeners
      expect(grid).toHaveStyle({ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' })
    })
  })

  describe('when supporting common e-commerce interface patterns', () => {
    it('should effectively display large product catalogs with consistent layout', () => {
      // Given: E-commerce catalog with multiple product pages
      const productCards = Array.from({ length: 12 }, (_, i) => (
        <div key={i} data-testid={`product-card-${i}`}>Product {i + 1}</div>
      ))
      
      // When: ProductGrid displays full product collection
      render(<ProductGrid gap="medium">{productCards}</ProductGrid>)
      
      // Then: All products are accessible and consistently presented
      expect(screen.getByTestId('product-card-0')).toBeInTheDocument()
      expect(screen.getByTestId('product-card-11')).toBeInTheDocument()
    })

    it('should support admin dashboard interfaces with fixed dense layouts', () => {
      // Given: Admin interface requiring predictable product management layout
      
      // When: ProductGrid renders with admin-optimized configuration
      const { container } = render(
        <ProductGrid columns={4} gap="small" responsive={false}>
          {mockChildren}
        </ProductGrid>
      )
      const grid = container.firstChild as HTMLElement
      
      // Then: Fixed four-column layout provides consistent admin workflow
      expect(grid).toHaveClass('grid-cols-4', 'gap-4')
    })

    it('should optimize mobile shopping experiences with responsive design', () => {
      // Given: Mobile e-commerce interface requiring responsive product display
      
      // When: ProductGrid renders with mobile-optimized configuration
      const { container } = render(
        <ProductGrid minItemWidth="250px" gap="medium">
          {mockChildren}
        </ProductGrid>
      )
      const grid = container.firstChild as HTMLElement
      
      // Then: Responsive layout adapts to mobile screen constraints
      expect(grid).toHaveStyle({ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' })
    })

    it('should provide smooth loading transitions for better user experience', () => {
      // Given: Product catalog with data loading states
      const { container, rerender } = render(
        <ProductGrid loading={true} loadingCount={8}>
          {mockChildren}
        </ProductGrid>
      )
      
      // When: Interface transitions from loading to loaded state
      expect(screen.getByTestId('skeleton-loader')).toBeInTheDocument()
      
      rerender(<ProductGrid loading={false}>{mockChildren}</ProductGrid>)
      
      // Then: Smooth transition provides clear feedback of content availability
      expect(screen.queryByTestId('skeleton-loader')).not.toBeInTheDocument()
      expect(screen.getByTestId('product-1')).toBeInTheDocument()
    })
  })
})