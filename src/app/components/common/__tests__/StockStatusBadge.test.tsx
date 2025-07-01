import React from 'react'
import { render, screen } from '@testing-library/react'
import StockStatusBadge from '../StockStatusBadge'

describe('StockStatusBadge', () => {
  describe('status display', () => {
    it('renders in_stock status correctly', () => {
      render(<StockStatusBadge status="in_stock" />)
      
      expect(screen.getByText('In Stock')).toBeInTheDocument()
      expect(screen.getByText('Product is available and ready to ship.')).toBeInTheDocument()
    })

    it('renders out_of_stock status correctly', () => {
      render(<StockStatusBadge status="out_of_stock" />)
      
      expect(screen.getByText('Out of Stock')).toBeInTheDocument()
      expect(screen.getByText('Product is currently unavailable.')).toBeInTheDocument()
    })

    it('renders made_to_order status correctly', () => {
      render(<StockStatusBadge status="made_to_order" />)
      
      expect(screen.getByText('Made to Order')).toBeInTheDocument()
      expect(screen.getByText('Product is manufactured after order is placed.')).toBeInTheDocument()
    })

    it('renders limited_stock status correctly', () => {
      render(<StockStatusBadge status="limited_stock" />)
      
      expect(screen.getByText('Limited Stock')).toBeInTheDocument()
      expect(screen.getByText('Only a few units left in stock.')).toBeInTheDocument()
    })
  })

  describe('styling and accessibility', () => {
    it('applies custom className', () => {
      const { container } = render(<StockStatusBadge status="in_stock" className="custom-class" />)
      const badge = container.firstChild as HTMLElement
      
      expect(badge).toHaveClass('custom-class')
    })

    it('has proper default styling classes', () => {
      const { container } = render(<StockStatusBadge status="in_stock" />)
      const badge = container.firstChild as HTMLElement
      
      expect(badge).toHaveClass('relative', 'inline-block', 'px-3', 'py-1', 'rounded-full', 'text-xs', 'font-medium')
    })

    it('has proper minimum width', () => {
      const { container } = render(<StockStatusBadge status="in_stock" />)
      const badge = container.firstChild as HTMLElement
      
      expect(badge).toHaveClass('min-w-[100px]')
    })

    it('is centered text', () => {
      const { container } = render(<StockStatusBadge status="in_stock" />)
      const badge = container.firstChild as HTMLElement
      
      expect(badge).toHaveClass('text-center')
    })
  })

  describe('tooltip behavior', () => {
    it('shows tooltip on hover for all statuses', () => {
      const statuses = ['in_stock', 'out_of_stock', 'made_to_order', 'limited_stock'] as const
      const expectedTexts = [
        'Product is available and ready to ship.',
        'Product is currently unavailable.',
        'Product is manufactured after order is placed.',
        'Only a few units left in stock.'
      ]

      statuses.forEach((status, index) => {
        const { container } = render(<StockStatusBadge status={status} />)
        const tooltip = container.querySelector('.hidden.group-hover\\:flex')
        
        expect(tooltip).toBeInTheDocument()
        expect(tooltip).toHaveTextContent(expectedTexts[index])
        expect(tooltip).toHaveClass('absolute', 'left-1/2', '-translate-x-1/2', 'mt-2', 'z-20')
      })
    })

    it('tooltip has proper glassmorphism styling', () => {
      const { container } = render(<StockStatusBadge status="in_stock" />)
      const tooltip = container.querySelector('.hidden.group-hover\\:flex')
      
      expect(tooltip).toHaveClass(
        'px-4', 'py-2', 'rounded-xl', 'bg-white/30', 'backdrop-blur-md', 
        'border', 'border-white/30', 'text-white', 'text-xs', 'font-normal', 
        'shadow-lg', 'transition-all', 'duration-200', 'whitespace-nowrap', 
        'pointer-events-none'
      )
    })
  })

  describe('unknown status handling', () => {
    it('handles unknown status gracefully', () => {
      render(<StockStatusBadge status="unknown_status" />)
      
      // Unknown status should default to 'In Stock'
      expect(screen.getByText('In Stock')).toBeInTheDocument()
    })

    it('does not show tooltip for unknown status', () => {
      const { container } = render(<StockStatusBadge status="unknown_status" />)
      const tooltip = container.querySelector('.hidden.group-hover\\:flex')
      
      // Tooltip should be empty or not rendered for unknown status
      if (tooltip) {
        expect(tooltip).toHaveTextContent('')
      }
    })
  })

  describe('edge cases', () => {
    it('handles empty status', () => {
      render(<StockStatusBadge status="" />)
      // Empty status should default to 'In Stock'
      expect(screen.getByText('In Stock')).toBeInTheDocument()
    })

    it('handles null status', () => {
      render(<StockStatusBadge status={null as any} />)
      // Null status should default to 'In Stock'
      expect(screen.getByText('In Stock')).toBeInTheDocument()
    })

    it('handles undefined status', () => {
      render(<StockStatusBadge status={undefined as any} />)
      // Undefined status should default to 'In Stock'
      expect(screen.getByText('In Stock')).toBeInTheDocument()
    })
  })

  describe('responsive design', () => {
    it('maintains proper spacing in different containers', () => {
      const { rerender, container } = render(
        <div className="flex items-center gap-2">
          <StockStatusBadge status="in_stock" />
        </div>
      )
      
      let badge = container.querySelector('span')
      expect(badge).toHaveClass('inline-block')
      
      rerender(
        <div className="grid grid-cols-2 gap-4">
          <StockStatusBadge status="in_stock" />
        </div>
      )
      
      badge = container.querySelector('span')
      expect(badge).toHaveClass('inline-block')
    })
  })
})