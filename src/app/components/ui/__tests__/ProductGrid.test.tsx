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

describe('ProductGrid', () => {
  const mockChildren = (
    <>
      <div data-testid="product-1">Product 1</div>
      <div data-testid="product-2">Product 2</div>
      <div data-testid="product-3">Product 3</div>
    </>
  )

  describe('basic rendering', () => {
    it('renders children correctly', () => {
      render(<ProductGrid>{mockChildren}</ProductGrid>)
      
      expect(screen.getByTestId('product-1')).toBeInTheDocument()
      expect(screen.getByTestId('product-2')).toBeInTheDocument()
      expect(screen.getByTestId('product-3')).toBeInTheDocument()
    })

    it('applies default grid classes', () => {
      const { container } = render(<ProductGrid>{mockChildren}</ProductGrid>)
      const grid = container.firstChild as HTMLElement
      
      expect(grid).toHaveClass('grid', 'auto-fit-grid', 'gap-6', 'items-stretch')
    })

    it('applies custom className', () => {
      const { container } = render(<ProductGrid className="custom-grid">{mockChildren}</ProductGrid>)
      const grid = container.firstChild as HTMLElement
      
      expect(grid).toHaveClass('custom-grid')
    })
  })

  describe('responsive behavior', () => {
    it('applies responsive grid by default', () => {
      const { container } = render(<ProductGrid>{mockChildren}</ProductGrid>)
      const grid = container.firstChild as HTMLElement
      
      expect(grid).toHaveClass('auto-fit-grid')
      expect(grid).toHaveStyle({ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' })
    })

    it('uses custom minItemWidth for responsive grid', () => {
      const { container } = render(<ProductGrid minItemWidth="320px">{mockChildren}</ProductGrid>)
      const grid = container.firstChild as HTMLElement
      
      expect(grid).toHaveStyle({ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' })
    })

    it('disables responsive behavior when responsive=false', () => {
      const { container } = render(<ProductGrid responsive={false}>{mockChildren}</ProductGrid>)
      const grid = container.firstChild as HTMLElement
      
      expect(grid).toHaveClass('grid-cols-3') // Default 3 columns
      expect(grid).not.toHaveClass('auto-fit-grid')
      expect(grid).not.toHaveStyle({ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' })
    })
  })

  describe('column configuration', () => {
    it('applies 1 column layout when responsive=false', () => {
      const { container } = render(<ProductGrid columns={1} responsive={false}>{mockChildren}</ProductGrid>)
      const grid = container.firstChild as HTMLElement
      
      expect(grid).toHaveClass('grid-cols-1')
    })

    it('applies 2 column layout when responsive=false', () => {
      const { container } = render(<ProductGrid columns={2} responsive={false}>{mockChildren}</ProductGrid>)
      const grid = container.firstChild as HTMLElement
      
      expect(grid).toHaveClass('grid-cols-2')
    })

    it('applies 4 column layout when responsive=false', () => {
      const { container } = render(<ProductGrid columns={4} responsive={false}>{mockChildren}</ProductGrid>)
      const grid = container.firstChild as HTMLElement
      
      expect(grid).toHaveClass('grid-cols-4')
    })

    it('applies 5 column layout when responsive=false', () => {
      const { container } = render(<ProductGrid columns={5} responsive={false}>{mockChildren}</ProductGrid>)
      const grid = container.firstChild as HTMLElement
      
      expect(grid).toHaveClass('grid-cols-5')
    })

    it('applies 6 column layout when responsive=false', () => {
      const { container } = render(<ProductGrid columns={6} responsive={false}>{mockChildren}</ProductGrid>)
      const grid = container.firstChild as HTMLElement
      
      expect(grid).toHaveClass('grid-cols-6')
    })

    it('defaults to 3 columns when responsive=false', () => {
      const { container } = render(<ProductGrid responsive={false}>{mockChildren}</ProductGrid>)
      const grid = container.firstChild as HTMLElement
      
      expect(grid).toHaveClass('grid-cols-3')
    })
  })

  describe('gap configuration', () => {
    it('applies small gap correctly', () => {
      const { container } = render(<ProductGrid gap="small">{mockChildren}</ProductGrid>)
      const grid = container.firstChild as HTMLElement
      
      expect(grid).toHaveClass('gap-4')
    })

    it('applies medium gap by default', () => {
      const { container } = render(<ProductGrid>{mockChildren}</ProductGrid>)
      const grid = container.firstChild as HTMLElement
      
      expect(grid).toHaveClass('gap-6')
    })

    it('applies large gap correctly', () => {
      const { container } = render(<ProductGrid gap="large">{mockChildren}</ProductGrid>)
      const grid = container.firstChild as HTMLElement
      
      expect(grid).toHaveClass('gap-8')
    })
  })

  describe('loading state', () => {
    it('renders skeleton loader when loading=true', () => {
      render(<ProductGrid loading={true}>{mockChildren}</ProductGrid>)
      
      expect(screen.getByTestId('skeleton-loader')).toBeInTheDocument()
      expect(screen.queryByTestId('product-1')).not.toBeInTheDocument()
    })

    it('uses default loading count of 6', () => {
      render(<ProductGrid loading={true}>{mockChildren}</ProductGrid>)
      
      expect(screen.getByTestId('skeleton-0')).toBeInTheDocument()
      expect(screen.getByTestId('skeleton-5')).toBeInTheDocument()
      expect(screen.queryByTestId('skeleton-6')).not.toBeInTheDocument()
    })

    it('uses custom loading count', () => {
      render(<ProductGrid loading={true} loadingCount={3}>{mockChildren}</ProductGrid>)
      
      expect(screen.getByTestId('skeleton-0')).toBeInTheDocument()
      expect(screen.getByTestId('skeleton-1')).toBeInTheDocument()
      expect(screen.getByTestId('skeleton-2')).toBeInTheDocument()
      expect(screen.queryByTestId('skeleton-3')).not.toBeInTheDocument()
    })

    it('applies grid classes to loading state', () => {
      const { container } = render(<ProductGrid loading={true} gap="large">{mockChildren}</ProductGrid>)
      const grid = container.firstChild as HTMLElement
      
      expect(grid).toHaveClass('grid', 'auto-fit-grid', 'gap-8', 'items-stretch')
    })

    it('applies responsive style to loading state', () => {
      const { container } = render(<ProductGrid loading={true} minItemWidth="300px">{mockChildren}</ProductGrid>)
      const grid = container.firstChild as HTMLElement
      
      expect(grid).toHaveStyle({ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' })
    })
  })

  describe('responsive combinations', () => {
    it('combines responsive grid with small gap', () => {
      const { container } = render(<ProductGrid gap="small" minItemWidth="250px">{mockChildren}</ProductGrid>)
      const grid = container.firstChild as HTMLElement
      
      expect(grid).toHaveClass('auto-fit-grid', 'gap-4')
      expect(grid).toHaveStyle({ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' })
    })

    it('combines fixed grid with large gap', () => {
      const { container } = render(<ProductGrid columns={2} gap="large" responsive={false}>{mockChildren}</ProductGrid>)
      const grid = container.firstChild as HTMLElement
      
      expect(grid).toHaveClass('grid-cols-2', 'gap-8')
      expect(grid).not.toHaveStyle({ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' })
    })

    it('ignores columns setting when responsive=true', () => {
      const { container } = render(<ProductGrid columns={5} responsive={true}>{mockChildren}</ProductGrid>)
      const grid = container.firstChild as HTMLElement
      
      expect(grid).toHaveClass('auto-fit-grid')
      expect(grid).not.toHaveClass('grid-cols-5')
    })

    it('ignores minItemWidth when responsive=false', () => {
      const { container } = render(<ProductGrid minItemWidth="400px" responsive={false}>{mockChildren}</ProductGrid>)
      const grid = container.firstChild as HTMLElement
      
      expect(grid).not.toHaveStyle({ gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))' })
    })
  })

  describe('edge cases', () => {
    it('handles empty children gracefully', () => {
      const { container } = render(<ProductGrid>{}</ProductGrid>)
      const grid = container.firstChild as HTMLElement
      
      expect(grid).toBeInTheDocument()
      expect(grid).toHaveClass('grid')
    })

    it('handles null children gracefully', () => {
      const { container } = render(<ProductGrid>{null}</ProductGrid>)
      const grid = container.firstChild as HTMLElement
      
      expect(grid).toBeInTheDocument()
      expect(grid).toHaveClass('grid')
    })

    it('handles loading with zero count', () => {
      render(<ProductGrid loading={true} loadingCount={0}>{mockChildren}</ProductGrid>)
      
      expect(screen.getByTestId('skeleton-loader')).toBeInTheDocument()
      expect(screen.queryByTestId('skeleton-0')).not.toBeInTheDocument()
    })

    it('handles very large loading count', () => {
      render(<ProductGrid loading={true} loadingCount={20}>{mockChildren}</ProductGrid>)
      
      expect(screen.getByTestId('skeleton-0')).toBeInTheDocument()
      expect(screen.getByTestId('skeleton-19')).toBeInTheDocument()
    })

    it('handles very small minItemWidth', () => {
      const { container } = render(<ProductGrid minItemWidth="50px">{mockChildren}</ProductGrid>)
      const grid = container.firstChild as HTMLElement
      
      expect(grid).toHaveStyle({ gridTemplateColumns: 'repeat(auto-fit, minmax(50px, 1fr))' })
    })

    it('handles very large minItemWidth', () => {
      const { container } = render(<ProductGrid minItemWidth="1000px">{mockChildren}</ProductGrid>)
      const grid = container.firstChild as HTMLElement
      
      expect(grid).toHaveStyle({ gridTemplateColumns: 'repeat(auto-fit, minmax(1000px, 1fr))' })
    })
  })

  describe('accessibility and semantics', () => {
    it('uses div with proper role', () => {
      const { container } = render(<ProductGrid>{mockChildren}</ProductGrid>)
      const grid = container.firstChild as HTMLElement
      
      expect(grid.tagName).toBe('DIV')
    })

    it('maintains item stretch alignment', () => {
      const { container } = render(<ProductGrid>{mockChildren}</ProductGrid>)
      const grid = container.firstChild as HTMLElement
      
      expect(grid).toHaveClass('items-stretch')
    })

    it('provides consistent behavior for screen readers', () => {
      const { container } = render(<ProductGrid>{mockChildren}</ProductGrid>)
      const grid = container.firstChild as HTMLElement
      
      // Grid should be a semantic container
      expect(grid.tagName).toBe('DIV')
      expect(grid).toHaveClass('grid')
    })
  })

  describe('performance considerations', () => {
    it('uses CSS Grid for optimal layout performance', () => {
      const { container } = render(<ProductGrid>{mockChildren}</ProductGrid>)
      const grid = container.firstChild as HTMLElement
      
      expect(grid).toHaveClass('grid')
    })

    it('applies minimal DOM modifications between states', () => {
      const { container, rerender } = render(<ProductGrid gap="small">{mockChildren}</ProductGrid>)
      const initialGrid = container.firstChild as HTMLElement
      
      rerender(<ProductGrid gap="large">{mockChildren}</ProductGrid>)
      const updatedGrid = container.firstChild as HTMLElement
      
      expect(initialGrid).toBe(updatedGrid) // Same DOM element
      expect(updatedGrid).toHaveClass('gap-8')
      expect(updatedGrid).not.toHaveClass('gap-4')
    })

    it('handles responsive breakpoints efficiently', () => {
      const { container } = render(<ProductGrid responsive={true}>{mockChildren}</ProductGrid>)
      const grid = container.firstChild as HTMLElement
      
      // Responsive grid should use CSS auto-fit instead of JavaScript breakpoints
      expect(grid).toHaveStyle({ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' })
    })
  })

  describe('real-world usage scenarios', () => {
    it('works well for product catalog displays', () => {
      const productCards = Array.from({ length: 12 }, (_, i) => (
        <div key={i} data-testid={`product-card-${i}`}>Product {i + 1}</div>
      ))
      
      render(<ProductGrid gap="medium">{productCards}</ProductGrid>)
      
      expect(screen.getByTestId('product-card-0')).toBeInTheDocument()
      expect(screen.getByTestId('product-card-11')).toBeInTheDocument()
    })

    it('works well for admin panel layouts', () => {
      const { container } = render(
        <ProductGrid columns={4} gap="small" responsive={false}>
          {mockChildren}
        </ProductGrid>
      )
      const grid = container.firstChild as HTMLElement
      
      expect(grid).toHaveClass('grid-cols-4', 'gap-4')
    })

    it('works well for mobile-responsive designs', () => {
      const { container } = render(
        <ProductGrid minItemWidth="250px" gap="medium">
          {mockChildren}
        </ProductGrid>
      )
      const grid = container.firstChild as HTMLElement
      
      expect(grid).toHaveStyle({ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' })
    })

    it('handles loading states for better UX', () => {
      const { container, rerender } = render(
        <ProductGrid loading={true} loadingCount={8}>
          {mockChildren}
        </ProductGrid>
      )
      
      expect(screen.getByTestId('skeleton-loader')).toBeInTheDocument()
      
      rerender(<ProductGrid loading={false}>{mockChildren}</ProductGrid>)
      
      expect(screen.queryByTestId('skeleton-loader')).not.toBeInTheDocument()
      expect(screen.getByTestId('product-1')).toBeInTheDocument()
    })
  })
})