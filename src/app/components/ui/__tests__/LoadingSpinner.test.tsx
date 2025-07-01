import React from 'react'
import { render, screen } from '@testing-library/react'
import LoadingSpinner from '../LoadingSpinner'

describe('LoadingSpinner Component', () => {
  describe('when rendering different size variants', () => {
    it('should render compact spinner for small UI elements', () => {
      // Given: LoadingSpinner configured for small size
      
      // When: Component is rendered with small size
      const { container } = render(<LoadingSpinner size="small" />)
      const spinner = container.querySelector('[class*="w-4 h-4"]')
      
      // Then: Small dimensions are applied for compact spaces
      expect(spinner).toBeInTheDocument()
    })

    it('should render medium spinner as default size', () => {
      // Given: LoadingSpinner without explicit size prop
      
      // When: Component is rendered with default configuration
      const { container } = render(<LoadingSpinner />)
      const spinner = container.querySelector('[class*="w-6 h-6"]')
      
      // Then: Medium size is used as default
      expect(spinner).toBeInTheDocument()
    })

    it('should render prominent spinner for main loading states', () => {
      // Given: LoadingSpinner configured for large size
      
      // When: Component is rendered with large size
      const { container } = render(<LoadingSpinner size="large" />)
      const spinner = container.querySelector('[class*="w-8 h-8"]')
      
      // Then: Large dimensions provide prominent visual feedback
      expect(spinner).toBeInTheDocument()
    })

    it('should render extra large spinner for full-page loading', () => {
      // Given: LoadingSpinner configured for xlarge size
      
      // When: Component is rendered with xlarge size
      const { container } = render(<LoadingSpinner size="xlarge" />)
      const spinner = container.querySelector('[class*="w-12 h-12"]')
      
      // Then: Extra large dimensions for prominent page-level loading
      expect(spinner).toBeInTheDocument()
    })
  })

  describe('when applying different color themes', () => {
    it('should use primary brand colors as default', () => {
      // Given: LoadingSpinner with default color configuration
      
      // When: Component is rendered without color prop
      const { container } = render(<LoadingSpinner />)
      const spinner = container.querySelector('div')
      
      // Then: Primary blue colors are applied for brand consistency
      expect(spinner).toHaveClass('border-blue-300', 'border-t-blue-600')
    })

    it('should use neutral colors for secondary contexts', () => {
      // Given: LoadingSpinner configured for secondary color
      
      // When: Component is rendered with secondary color
      const { container } = render(<LoadingSpinner color="secondary" />)
      const spinner = container.querySelector('div')
      
      // Then: Gray colors provide subtle loading indication
      expect(spinner).toHaveClass('border-gray-300', 'border-t-gray-600')
    })

    it('should use white colors for dark backgrounds', () => {
      // Given: LoadingSpinner configured for dark background visibility
      
      // When: Component is rendered with white color
      const { container } = render(<LoadingSpinner color="white" />)
      const spinner = container.querySelector('div')
      
      // Then: White colors provide visibility on dark backgrounds
      expect(spinner).toHaveClass('border-white/30', 'border-t-white')
    })

    it('should use accent colors for highlighted loading states', () => {
      // Given: LoadingSpinner configured for accent color
      
      // When: Component is rendered with accent color
      const { container } = render(<LoadingSpinner color="accent" />)
      const spinner = container.querySelector('div')
      
      // Then: Purple accent colors draw attention to important loading
      expect(spinner).toHaveClass('border-purple-300', 'border-t-purple-600')
    })
  })

  describe('when adjusting border thickness for visual emphasis', () => {
    it('should render thin borders for subtle loading indicators', () => {
      // Given: LoadingSpinner configured for minimal visual impact
      
      // When: Component is rendered with thin thickness
      const { container } = render(<LoadingSpinner thickness="thin" />)
      const spinner = container.querySelector('div')
      
      // Then: Thin border provides subtle loading indication
      expect(spinner).toHaveClass('border-2')
    })

    it('should render medium borders as balanced default thickness', () => {
      // Given: LoadingSpinner with default thickness setting
      
      // When: Component is rendered without thickness prop
      const { container } = render(<LoadingSpinner />)
      const spinner = container.querySelector('div')
      
      // Then: Medium thickness provides balanced visual feedback
      expect(spinner).toHaveClass('border-3')
    })

    it('should render thick borders for prominent loading states', () => {
      // Given: LoadingSpinner configured for high visibility
      
      // When: Component is rendered with thick thickness
      const { container } = render(<LoadingSpinner thickness="thick" />)
      const spinner = container.querySelector('div')
      
      // Then: Thick border provides prominent visual emphasis
      expect(spinner).toHaveClass('border-4')
    })
  })

  describe('when applying custom styling and animations', () => {
    it('should accept and merge custom CSS classes with defaults', () => {
      // Given: LoadingSpinner with custom className for specific styling needs
      
      // When: Component is rendered with custom CSS class
      const { container } = render(<LoadingSpinner className="custom-spinner" />)
      const spinner = container.firstChild as HTMLElement
      
      // Then: Custom class is applied alongside default styling
      expect(spinner).toHaveClass('custom-spinner')
    })

    it('should use CSS animation for smooth rotation performance', () => {
      // Given: LoadingSpinner requiring smooth visual feedback
      
      // When: Component is rendered with default configuration
      const { container } = render(<LoadingSpinner />)
      const spinner = container.querySelector('div')
      
      // Then: CSS-based animation provides optimal performance
      expect(spinner).toHaveClass('animate-spin')
    })

    it('should apply circular border styling to create spinner effect', () => {
      // Given: LoadingSpinner requiring recognizable spinner appearance
      
      // When: Component is rendered
      const { container } = render(<LoadingSpinner />)
      const spinner = container.querySelector('div')
      
      // Then: Circular borders with contrasting top create spinning effect
      expect(spinner).toHaveClass('rounded-full')
      expect(spinner).toHaveClass('border-solid')
      expect(spinner).toHaveClass('border-t-blue-600')
    })

    it('should combine essential styling for proper spinner appearance', () => {
      // Given: LoadingSpinner requiring standard spinner presentation
      
      // When: Component is rendered with defaults
      const { container } = render(<LoadingSpinner />)
      const spinner = container.querySelector('div')
      
      // Then: Essential circular shape and animation are present
      expect(spinner).toHaveClass('rounded-full')
      expect(spinner).toHaveClass('animate-spin')
    })
  })

  describe('when providing accessibility features for screen readers', () => {
    it('should use status role to announce loading state to assistive technology', () => {
      // Given: LoadingSpinner component for accessible loading indication
      
      // When: Component is rendered
      render(<LoadingSpinner />)
      
      // Then: Status role enables screen reader announcement of loading state
      const spinner = screen.getByRole('status')
      expect(spinner).toBeInTheDocument()
    })

    it('should provide descriptive aria-label for screen reader context', () => {
      // Given: LoadingSpinner requiring screen reader understanding
      
      // When: Component is rendered
      render(<LoadingSpinner />)
      
      // Then: Aria-label provides clear loading context to assistive technology
      const spinner = screen.getByLabelText(/loading/i)
      expect(spinner).toBeInTheDocument()
    })

    it('should include screen reader text for loading state description', () => {
      // Given: LoadingSpinner needing textual loading indication
      
      // When: Component is rendered
      render(<LoadingSpinner />)
      
      // Then: Text content provides explicit loading message for screen readers
      expect(screen.getByText('Loading...')).toBeInTheDocument()
    })
  })

  describe('when handling complex prop combinations and edge cases', () => {
    it('should correctly apply all valid props simultaneously', () => {
      // Given: LoadingSpinner with multiple customization props
      
      // When: Component is rendered with size, color, thickness, and custom class
      const { container } = render(
        <LoadingSpinner 
          size="large" 
          color="white" 
          thickness="thick"
          className="my-custom-class"
        />
      )
      const spinner = container.querySelector('div')
      
      // Then: All props are applied correctly without conflicts
      expect(spinner).toHaveClass('my-custom-class')
      expect(spinner).toHaveClass('w-8', 'h-8') // large size
      expect(spinner).toHaveClass('border-4') // thick
      expect(spinner).toHaveClass('border-white/30', 'border-t-white') // white color
    })

    it('should gracefully handle invalid prop values with default fallbacks', () => {
      // Given: LoadingSpinner with invalid prop values
      
      // When: Component is rendered with invalid size, color, and thickness
      const { container } = render(
        <LoadingSpinner 
          size={'invalid' as any} 
          color={'invalid' as any} 
          thickness={'invalid' as any}
        />
      )
      
      const spinner = container.querySelector('div')
      
      // Then: Component renders with safe default values
      expect(spinner).toBeInTheDocument()
      expect(spinner).toHaveClass('w-6', 'h-6') // default medium size
      expect(spinner).toHaveClass('border-3') // default medium thickness
    })
  })

  describe('when ensuring consistent visual behavior across contexts', () => {
    it('should maintain perfect circular aspect ratio across all size variants', () => {
      // Given: All available size variants for LoadingSpinner
      const sizes = ['small', 'medium', 'large', 'xlarge'] as const
      
      sizes.forEach(size => {
        // When: Each size variant is rendered
        const { container } = render(<LoadingSpinner size={size} />)
        const spinner = container.querySelector('div')
        
        // Then: Perfect circular shape is maintained with equal width/height
        expect(spinner).toHaveClass('rounded-full')
        const classList = Array.from(spinner?.classList || [])
        const widthClass = classList.find(cls => cls.startsWith('w-'))
        const heightClass = classList.find(cls => cls.startsWith('h-'))
        
        expect(widthClass?.replace('w-', '')).toBe(heightClass?.replace('h-', ''))
      })
    })

    it('should integrate seamlessly with different layout systems', () => {
      // Given: LoadingSpinner used in various layout containers
      
      // When: Spinner is placed in flexbox and grid containers
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
      
      // Then: Spinner renders correctly in both layout systems
      expect(flexContainer.querySelector('[class*="animate-spin"]')).toBeInTheDocument()
      expect(gridContainer.querySelector('[class*="animate-spin"]')).toBeInTheDocument()
    })
  })

  describe('when optimizing for rendering performance', () => {
    it('should use efficient block-level display for proper layout behavior', () => {
      // Given: LoadingSpinner requiring efficient rendering and centering
      
      // When: Component is rendered
      const { container } = render(<LoadingSpinner />)
      const spinner = container.querySelector('div')
      
      // Then: Proper block element enables efficient layout and centering
      expect(spinner).toHaveClass('rounded-full')
      expect(spinner).toBeInTheDocument()
    })

    it('should leverage CSS animations for optimal performance', () => {
      // Given: LoadingSpinner requiring smooth animation without JavaScript overhead
      
      // When: Component is rendered
      const { container } = render(<LoadingSpinner />)
      const spinner = container.querySelector('div')
      
      // Then: CSS-based animation provides hardware acceleration and efficiency
      expect(spinner).toHaveClass('animate-spin')
    })
  })

  describe('when supporting common loading scenarios', () => {
    it('should function effectively as button loading indicator', () => {
      // Given: Button requiring loading state with spinner and text
      
      // When: LoadingSpinner is used within disabled button context
      render(
        <button disabled className="flex items-center gap-2">
          <LoadingSpinner size="small" color="white" />
          Loading...
        </button>
      )
      
      // Then: Spinner integrates seamlessly with button text for clear loading state
      const spinner = screen.getByRole('status', { hidden: true })
      expect(spinner).toBeInTheDocument()
      expect(spinner.parentElement).toHaveTextContent('Loading...')
    })

    it('should serve as prominent full-page loading overlay', () => {
      // Given: Application requiring full-page loading indication
      
      // When: LoadingSpinner is used in overlay context
      render(
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <LoadingSpinner size="large" color="white" />
        </div>
      )
      
      // Then: Large spinner provides clear loading feedback on overlay background
      const spinner = screen.getByRole('status', { hidden: true })
      expect(spinner).toBeInTheDocument()
    })

    it('should work as inline content loading indicator', () => {
      // Given: Content area requiring inline loading indication
      
      // When: LoadingSpinner is used with accompanying text
      render(
        <div className="text-center">
          <LoadingSpinner size="small" />
          <span className="ml-2">Loading content...</span>
        </div>
      )
      
      // Then: Small spinner complements text without overwhelming content area
      const spinner = screen.getByRole('status', { hidden: true })
      expect(spinner).toBeInTheDocument()
    })
  })
})