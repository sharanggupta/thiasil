import React from 'react'
import { render, screen } from '@testing-library/react'
import LoadingSpinner from '../LoadingSpinner'

describe('LoadingSpinner', () => {
  describe('size variants', () => {
    it('renders small size correctly', () => {
      const { container } = render(<LoadingSpinner size="small" />)
      const spinner = container.querySelector('[class*="w-4 h-4"]')
      
      expect(spinner).toBeInTheDocument()
    })

    it('renders medium size correctly (default)', () => {
      const { container } = render(<LoadingSpinner />)
      const spinner = container.querySelector('[class*="w-6 h-6"]')
      
      expect(spinner).toBeInTheDocument()
    })

    it('renders large size correctly', () => {
      const { container } = render(<LoadingSpinner size="large" />)
      const spinner = container.querySelector('[class*="w-8 h-8"]')
      
      expect(spinner).toBeInTheDocument()
    })

    it('renders xlarge size correctly', () => {
      const { container } = render(<LoadingSpinner size="xlarge" />)
      const spinner = container.querySelector('[class*="w-12 h-12"]')
      
      expect(spinner).toBeInTheDocument()
    })
  })

  describe('color variants', () => {
    it('renders primary color correctly (default)', () => {
      const { container } = render(<LoadingSpinner />)
      const spinner = container.querySelector('div')
      
      expect(spinner).toHaveClass('border-blue-300', 'border-t-blue-600')
    })

    it('renders secondary color correctly', () => {
      const { container } = render(<LoadingSpinner color="secondary" />)
      const spinner = container.querySelector('div')
      
      expect(spinner).toHaveClass('border-gray-300', 'border-t-gray-600')
    })

    it('renders white color correctly', () => {
      const { container } = render(<LoadingSpinner color="white" />)
      const spinner = container.querySelector('div')
      
      expect(spinner).toHaveClass('border-white/30', 'border-t-white')
    })

    it('renders accent color correctly', () => {
      const { container } = render(<LoadingSpinner color="accent" />)
      const spinner = container.querySelector('div')
      
      expect(spinner).toHaveClass('border-purple-300', 'border-t-purple-600')
    })
  })

  describe('thickness variants', () => {
    it('renders thin thickness correctly', () => {
      const { container } = render(<LoadingSpinner thickness="thin" />)
      const spinner = container.querySelector('div')
      
      expect(spinner).toHaveClass('border-2')
    })

    it('renders medium thickness correctly (default)', () => {
      const { container } = render(<LoadingSpinner />)
      const spinner = container.querySelector('div')
      
      expect(spinner).toHaveClass('border-3')
    })

    it('renders thick thickness correctly', () => {
      const { container } = render(<LoadingSpinner thickness="thick" />)
      const spinner = container.querySelector('div')
      
      expect(spinner).toHaveClass('border-4')
    })
  })

  describe('styling and behavior', () => {
    it('applies custom className', () => {
      const { container } = render(<LoadingSpinner className="custom-spinner" />)
      const spinner = container.firstChild as HTMLElement
      
      expect(spinner).toHaveClass('custom-spinner')
    })

    it('has proper animation classes', () => {
      const { container } = render(<LoadingSpinner />)
      const spinner = container.querySelector('div')
      
      expect(spinner).toHaveClass('animate-spin')
    })

    it('has proper border styling for spinner effect', () => {
      const { container } = render(<LoadingSpinner />)
      const spinner = container.querySelector('div')
      
      expect(spinner).toHaveClass('rounded-full')
      expect(spinner).toHaveClass('border-solid')
      expect(spinner).toHaveClass('border-t-blue-600') // Different top border for spin effect
    })

    it('has proper default styling', () => {
      const { container } = render(<LoadingSpinner />)
      const spinner = container.querySelector('div')
      
      expect(spinner).toHaveClass('rounded-full')
      expect(spinner).toHaveClass('animate-spin')
    })
  })

  describe('accessibility', () => {
    it('has proper role for screen readers', () => {
      render(<LoadingSpinner />)
      
      const spinner = screen.getByRole('status')
      expect(spinner).toBeInTheDocument()
    })

    it('has proper aria-label', () => {
      render(<LoadingSpinner />)
      
      const spinner = screen.getByLabelText(/loading/i)
      expect(spinner).toBeInTheDocument()
    })

    it('has screen reader text', () => {
      render(<LoadingSpinner />)
      
      expect(screen.getByText('Loading...')).toBeInTheDocument()
    })
  })

  describe('combinations', () => {
    it('correctly combines all props', () => {
      const { container } = render(
        <LoadingSpinner 
          size="large" 
          color="white" 
          thickness="thick"
          className="my-custom-class"
        />
      )
      const spinner = container.querySelector('div')
      
      expect(spinner).toHaveClass('my-custom-class')
      expect(spinner).toHaveClass('w-8', 'h-8') // large size
      expect(spinner).toHaveClass('border-4') // thick
      expect(spinner).toHaveClass('border-white/30', 'border-t-white') // white color
    })

    it('handles invalid prop combinations gracefully', () => {
      const { container } = render(
        <LoadingSpinner 
          size={'invalid' as any} 
          color={'invalid' as any} 
          thickness={'invalid' as any}
        />
      )
      
      const spinner = container.querySelector('div')
      expect(spinner).toBeInTheDocument()
      
      // Should fall back to defaults
      expect(spinner).toHaveClass('w-6', 'h-6') // default medium size
      expect(spinner).toHaveClass('border-3') // default medium thickness
    })
  })

  describe('responsive behavior', () => {
    it('maintains aspect ratio across different sizes', () => {
      const sizes = ['small', 'medium', 'large', 'xlarge'] as const
      
      sizes.forEach(size => {
        const { container } = render(<LoadingSpinner size={size} />)
        const spinner = container.querySelector('div')
        
        expect(spinner).toHaveClass('rounded-full')
        // Width and height should be equal for perfect circle
        const classList = Array.from(spinner?.classList || [])
        const widthClass = classList.find(cls => cls.startsWith('w-'))
        const heightClass = classList.find(cls => cls.startsWith('h-'))
        
        expect(widthClass?.replace('w-', '')).toBe(heightClass?.replace('h-', ''))
      })
    })

    it('works well in different container contexts', () => {
      const { container: flexContainer } = render(
        <div className="flex items-center justify-center">
          <LoadingSpinner />
        </div>
      )
      
      const { container: gridContainer } = render(
        <div className="grid place-items-center">
          <LoadingSpinner />
        </div>
      )
      
      expect(flexContainer.querySelector('[class*="animate-spin"]')).toBeInTheDocument()
      expect(gridContainer.querySelector('[class*="animate-spin"]')).toBeInTheDocument()
    })
  })

  describe('performance', () => {
    it('uses proper display behavior', () => {
      const { container } = render(<LoadingSpinner />)
      const spinner = container.querySelector('div')
      
      // Should be a proper block element that can be centered
      expect(spinner).toHaveClass('rounded-full')
      expect(spinner).toBeInTheDocument()
    })

    it('uses CSS animations for better performance', () => {
      const { container } = render(<LoadingSpinner />)
      const spinner = container.querySelector('div')
      
      // Should use Tailwind's animate-spin which is CSS-based
      expect(spinner).toHaveClass('animate-spin')
    })
  })

  describe('use cases', () => {
    it('works as button loading indicator', () => {
      render(
        <button disabled className="flex items-center gap-2">
          <LoadingSpinner size="small" color="white" />
          Loading...
        </button>
      )
      
      const spinner = screen.getByRole('status', { hidden: true })
      expect(spinner).toBeInTheDocument()
      expect(spinner.parentElement).toHaveTextContent('Loading...')
    })

    it('works as page loading indicator', () => {
      render(
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <LoadingSpinner size="large" color="white" />
        </div>
      )
      
      const spinner = screen.getByRole('status', { hidden: true })
      expect(spinner).toBeInTheDocument()
    })

    it('works as inline content loading', () => {
      render(
        <div className="text-center">
          <LoadingSpinner size="small" />
          <span className="ml-2">Loading content...</span>
        </div>
      )
      
      const spinner = screen.getByRole('status', { hidden: true })
      expect(spinner).toBeInTheDocument()
    })
  })
})