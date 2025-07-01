import React from 'react'
import { render, screen } from '@testing-library/react'
import Breadcrumb from '../Breadcrumb'

// Mock Next.js Link component
jest.mock('next/link', () => {
  return function MockLink({ children, href, ...props }: any) {
    return <a href={href} {...props}>{children}</a>
  }
})

describe('Breadcrumb Navigation Component', () => {
  const mockItems = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'Beakers', href: '/products/beakers' },
    { label: 'Glass Beaker 500ml' } // No href = current page
  ]

  describe('when rendering breadcrumb navigation', () => {
    it('should display all navigation items in the breadcrumb path', () => {
      // Given: A breadcrumb component with multiple navigation items
      
      // When: Component is rendered
      render(<Breadcrumb items={mockItems} />)
      
      // Then: All breadcrumb items are visible
      expect(screen.getByText('Home')).toBeInTheDocument()
      expect(screen.getByText('Products')).toBeInTheDocument()
      expect(screen.getByText('Beakers')).toBeInTheDocument()
      expect(screen.getByText('Glass Beaker 500ml')).toBeInTheDocument()
    })

    it('should show separators between breadcrumb items', () => {
      // Given: Multiple breadcrumb items requiring separation
      
      // When: Component is rendered
      render(<Breadcrumb items={mockItems} />)
      
      // Then: Separators appear between items (one less than total items)
      const separators = screen.getAllByText('/')
      expect(separators).toHaveLength(3)
    })

    it('should create clickable links for navigable breadcrumb items', () => {
      // Given: Breadcrumb items with href properties
      
      // When: Component is rendered
      render(<Breadcrumb items={mockItems} />)
      
      // Then: Links are created with correct href attributes
      const homeLink = screen.getByRole('link', { name: 'Home' })
      const productsLink = screen.getByRole('link', { name: 'Products' })
      const beakersLink = screen.getByRole('link', { name: 'Beakers' })
      
      expect(homeLink).toHaveAttribute('href', '/')
      expect(productsLink).toHaveAttribute('href', '/products')
      expect(beakersLink).toHaveAttribute('href', '/products/beakers')
    })

    it('should display current page item as non-clickable text', () => {
      // Given: Current page item without href (last item)
      
      // When: Component is rendered
      render(<Breadcrumb items={mockItems} />)
      
      // Then: Current page appears as span without link functionality
      const currentPage = screen.getByText('Glass Beaker 500ml')
      expect(currentPage).not.toHaveAttribute('href')
      expect(currentPage.tagName).toBe('SPAN')
    })
  })

  describe('when applying visual styling', () => {
    it('should apply default layout and typography classes', () => {
      // Given: Breadcrumb component with default styling
      
      // When: Component is rendered
      const { container } = render(<Breadcrumb items={mockItems} />)
      const nav = container.firstChild as HTMLElement
      
      // Then: Default styling classes are applied correctly
      expect(nav).toHaveClass('pt-32', 'pb-4')
      expect(nav.querySelector('div')).toHaveClass('flex', 'items-center', 'space-x-2', 'text-sm', 'text-white/60')
    })

    it('should accept and apply custom CSS classes', () => {
      // Given: Breadcrumb component with custom className
      
      // When: Component is rendered with custom styling
      const { container } = render(<Breadcrumb items={mockItems} className="custom-breadcrumb" />)
      const nav = container.firstChild as HTMLElement
      
      // Then: Custom class is applied to the component
      expect(nav).toHaveClass('custom-breadcrumb')
    })

    it('should apply interactive hover effects to navigation links', () => {
      // Given: Breadcrumb component with clickable links
      
      // When: Component is rendered
      render(<Breadcrumb items={mockItems} />)
      
      // Then: All links have hover and transition styles
      const links = screen.getAllByRole('link')
      links.forEach(link => {
        expect(link).toHaveClass('hover:text-white', 'transition-colors')
      })
    })

    it('should style current page item distinctly from navigation links', () => {
      // Given: Current page item that should appear different from links
      
      // When: Component is rendered
      render(<Breadcrumb items={mockItems} />)
      
      // Then: Current page has emphasized styling
      const currentPage = screen.getByText('Glass Beaker 500ml')
      expect(currentPage).toHaveClass('text-white', 'font-medium')
    })
  })

  describe('when handling edge cases and unusual data', () => {
    it('should render single breadcrumb item without any separators', () => {
      // Given: Single breadcrumb item
      const singleItem = [{ label: 'Home', href: '/' }]
      
      // When: Component is rendered with single item
      render(<Breadcrumb items={singleItem} />)
      
      // Then: Item appears without separators
      expect(screen.getByText('Home')).toBeInTheDocument()
      expect(screen.queryByText('/')).not.toBeInTheDocument()
    })

    it('should handle empty breadcrumb items array gracefully', () => {
      // Given: Empty items array
      
      // When: Component is rendered with no items
      const { container } = render(<Breadcrumb items={[]} />)
      
      // Then: Component renders without errors but shows no content
      expect(container.firstChild).toBeInTheDocument()
      expect(container.querySelector('div > div')).toBeNull()
    })

    it('should handle breadcrumb items with empty label strings', () => {
      // Given: Items including one with empty label
      const itemsWithEmpty = [
        { label: '', href: '/' },
        { label: 'Products', href: '/products' }
      ]
      
      // When: Component is rendered with empty label
      render(<Breadcrumb items={itemsWithEmpty} />)
      
      // Then: Both items render correctly including empty label
      expect(screen.getByText('Products')).toBeInTheDocument()
      const emptyLabel = screen.getByRole('link', { name: '' })
      expect(emptyLabel).toBeInTheDocument()
    })

    it('should properly display labels containing special characters', () => {
      // Given: Breadcrumb items with various special characters
      const specialItems = [
        { label: 'Home & Garden', href: '/' },
        { label: 'Beakers (Glass)', href: '/products' },
        { label: '250ml - Premium' }
      ]
      
      // When: Component is rendered with special characters
      render(<Breadcrumb items={specialItems} />)
      
      // Then: All special characters are preserved and displayed
      expect(screen.getByText('Home & Garden')).toBeInTheDocument()
      expect(screen.getByText('Beakers (Glass)')).toBeInTheDocument()
      expect(screen.getByText('250ml - Premium')).toBeInTheDocument()
    })
  })

  describe('when providing accessibility features', () => {
    it('should use semantic navigation element for screen readers', () => {
      // Given: Breadcrumb component for navigation
      
      // When: Component is rendered
      render(<Breadcrumb items={mockItems} />)
      
      // Then: Navigation landmark is available for assistive technology
      const nav = screen.getByRole('navigation')
      expect(nav).toBeInTheDocument()
    })

    it('should provide proper link semantics for navigable items', () => {
      // Given: Breadcrumb items with href properties
      
      // When: Component is rendered
      render(<Breadcrumb items={mockItems} />)
      
      // Then: Correct number of links with proper attributes exist
      const links = screen.getAllByRole('link')
      expect(links).toHaveLength(3) // Items with href
      
      links.forEach(link => {
        expect(link).toHaveAttribute('href')
      })
    })

    it('should distinguish current page from clickable navigation links', () => {
      // Given: Current page item in breadcrumb
      
      // When: Component is rendered
      render(<Breadcrumb items={mockItems} />)
      
      // Then: Current page does not have link role for screen readers
      const currentPage = screen.getByText('Glass Beaker 500ml')
      expect(currentPage).not.toHaveRole('link')
    })
  })

  describe('when providing navigation functionality', () => {
    it('should generate correct href attributes for all navigation links', () => {
      // Given: Breadcrumb items with various href values
      
      // When: Component is rendered
      render(<Breadcrumb items={mockItems} />)
      
      // Then: Each link has the correct href attribute
      const homeLink = screen.getByRole('link', { name: 'Home' })
      const productsLink = screen.getByRole('link', { name: 'Products' })
      const beakersLink = screen.getByRole('link', { name: 'Beakers' })
      
      expect(homeLink).toHaveAttribute('href', '/')
      expect(productsLink).toHaveAttribute('href', '/products')
      expect(beakersLink).toHaveAttribute('href', '/products/beakers')
    })

    it('should handle complex URLs with query parameters correctly', () => {
      // Given: Breadcrumb items with complex URL structures
      const complexItems = [
        { label: 'Home', href: '/' },
        { label: 'Search', href: '/search?q=beaker&category=glass' },
        { label: 'Results' }
      ]
      
      // When: Component is rendered with complex URLs
      render(<Breadcrumb items={complexItems} />)
      
      // Then: Complex URL is preserved correctly in href
      const searchLink = screen.getByRole('link', { name: 'Search' })
      expect(searchLink).toHaveAttribute('href', '/search?q=beaker&category=glass')
    })
  })

  describe('when handling responsive and layout behavior', () => {
    it('should maintain consistent spacing between breadcrumb elements', () => {
      // Given: Breadcrumb component with spacing requirements
      
      // When: Component is rendered
      const { container } = render(<Breadcrumb items={mockItems} />)
      const breadcrumbContainer = container.querySelector('.flex.items-center.space-x-2')
      
      // Then: Proper spacing classes are applied
      expect(breadcrumbContainer).toHaveClass('space-x-2')
      expect(breadcrumbContainer?.querySelectorAll('.mx-2')).toHaveLength(3) // Separators
    })

    it('should handle extensive breadcrumb chains without breaking layout', () => {
      // Given: Very long breadcrumb chain (10 levels deep)
      const longItems = Array.from({ length: 10 }, (_, i) => ({
        label: `Level ${i + 1}`,
        href: i < 9 ? `/level-${i + 1}` : undefined
      }))
      
      // When: Component is rendered with many items
      render(<Breadcrumb items={longItems} />)
      
      // Then: All items render correctly with proper separator count
      expect(screen.getByText('Level 1')).toBeInTheDocument()
      expect(screen.getByText('Level 10')).toBeInTheDocument()
      expect(screen.getAllByText('/')).toHaveLength(9)
    })
  })
})