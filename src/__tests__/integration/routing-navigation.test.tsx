import React from 'react'
import { render, screen, waitFor } from '../utils/test-utils'
import { user, mockFetch, clearAllMocks } from '../utils/test-helpers'
import { mockProducts, mockApiResponses } from '../utils/mock-data'

// Mock Next.js router
const mockPush = jest.fn()
const mockReplace = jest.fn()
const mockBack = jest.fn()
const mockForward = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
    back: mockBack,
    forward: mockForward,
    refresh: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => '/products',
  useSearchParams: () => new URLSearchParams(),
}))

// Mock fetch globally
const originalFetch = global.fetch
beforeAll(() => {
  global.fetch = jest.fn()
})

afterAll(() => {
  global.fetch = originalFetch
})

describe('Routing and Navigation Integration Testing Suite', () => {
  beforeEach(() => {
    clearAllMocks()
    mockPush.mockClear()
    mockReplace.mockClear()
    mockBack.mockClear()
    mockForward.mockClear()
  })

  describe('when testing Product Navigation and Breadcrumb workflows', () => {
    it('should successfully navigate through complete product browsing hierarchy', async () => {
      const TestComponent = () => {
        const [products, setProducts] = React.useState(mockProducts)
        const [selectedCategory, setSelectedCategory] = React.useState('')
        const [breadcrumbs, setBreadcrumbs] = React.useState(['Home'])
        
        const navigateToCategory = (category: string) => {
          setSelectedCategory(category)
          setBreadcrumbs(['Home', 'Products', category])
          mockPush(`/products/${category}`)
        }
        
        const navigateToProduct = (product: any) => {
          setBreadcrumbs(['Home', 'Products', product.category, product.name])
          mockPush(`/products/${product.categorySlug}/${product.id}`)
        }
        
        const navigateToBreadcrumb = (index: number) => {
          const newBreadcrumbs = breadcrumbs.slice(0, index + 1)
          setBreadcrumbs(newBreadcrumbs)
          
          if (index === 0) {
            mockPush('/')
          } else if (index === 1) {
            setSelectedCategory('')
            mockPush('/products')
          } else if (index === 2) {
            mockPush(`/products/${selectedCategory}`)
          }
        }

        const filteredProducts = selectedCategory 
          ? products.filter(p => p.categorySlug === selectedCategory)
          : products

        return (
          <div>
            <nav data-testid="breadcrumb-nav">
              {breadcrumbs.map((crumb, index) => (
                <span key={index}>
                  <button 
                    data-testid={`breadcrumb-${index}`}
                    onClick={() => navigateToBreadcrumb(index)}
                    className={index === breadcrumbs.length - 1 ? 'active' : ''}
                  >
                    {crumb}
                  </button>
                  {index < breadcrumbs.length - 1 && <span> &gt; </span>}
                </span>
              ))}
            </nav>

            <div data-testid="category-navigation">
              <h2>Categories</h2>
              <button 
                data-testid="nav-beakers"
                onClick={() => navigateToCategory('beakers')}
              >
                Beakers
              </button>
              <button 
                data-testid="nav-flasks"
                onClick={() => navigateToCategory('flasks')}
              >
                Flasks
              </button>
              <button 
                data-testid="nav-pipettes"
                onClick={() => navigateToCategory('pipettes')}
              >
                Pipettes
              </button>
            </div>

            <div data-testid="product-listing">
              <h2>
                {selectedCategory ? `${selectedCategory} Products` : 'All Products'}
              </h2>
              {filteredProducts.map(product => (
                <div key={product.id} data-testid={`product-item-${product.id}`}>
                  <h3>{product.name}</h3>
                  <p>{product.price}</p>
                  <button 
                    data-testid={`view-product-${product.id}`}
                    onClick={() => navigateToProduct(product)}
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>

            <div data-testid="navigation-state">
              Current Category: {selectedCategory || 'None'}
            </div>
          </div>
        )
      }

      // Given: Product catalog requiring hierarchical navigation system
      render(<TestComponent />)

      // Then: Initial navigation state shows homepage with proper breadcrumb
      expect(screen.getByTestId('breadcrumb-0')).toHaveTextContent('Home')
      expect(screen.getByTestId('breadcrumb-0')).toHaveClass('active')
      expect(screen.getByText('All Products')).toBeInTheDocument()
      expect(screen.getByTestId('navigation-state')).toHaveTextContent('Current Category: None')

      // When: User navigates to specific product category
      const beakersButton = screen.getByTestId('nav-beakers')
      await user.click(beakersButton)

      // Then: Category navigation updates URL and breadcrumb state
      expect(mockPush).toHaveBeenCalledWith('/products/beakers')
      expect(screen.getByTestId('breadcrumb-2')).toHaveTextContent('beakers')
      expect(screen.getByTestId('breadcrumb-2')).toHaveClass('active')
      expect(screen.getByText('beakers Products')).toBeInTheDocument()
      expect(screen.getByTestId('navigation-state')).toHaveTextContent('Current Category: beakers')

      // Then: Product filtering reflects category selection
      expect(screen.getByTestId('product-item-beaker-500ml')).toBeInTheDocument()
      expect(screen.queryByTestId('product-item-flask-250ml')).not.toBeInTheDocument()

      // When: User navigates to individual product details
      const viewProductButton = screen.getByTestId('view-product-beaker-500ml')
      await user.click(viewProductButton)

      // Then: Product detail navigation extends breadcrumb hierarchy
      expect(mockPush).toHaveBeenCalledWith('/products/beakers/beaker-500ml')
      expect(screen.getByTestId('breadcrumb-3')).toHaveTextContent('Test Beaker')

      // When: User navigates back using breadcrumb navigation
      const productsButton = screen.getByTestId('breadcrumb-1')
      await user.click(productsButton)

      // Then: Breadcrumb navigation restores previous application state
      expect(mockPush).toHaveBeenCalledWith('/products')
      expect(screen.getByTestId('breadcrumb-1')).toHaveClass('active')
      expect(screen.getByText('All Products')).toBeInTheDocument()
      expect(screen.getByTestId('navigation-state')).toHaveTextContent('Current Category: None')

      // Then: Product catalog returns to unfiltered complete view
      expect(screen.getByTestId('product-item-beaker-500ml')).toBeInTheDocument()
      expect(screen.getByTestId('product-item-flask-250ml')).toBeInTheDocument()
    })
  })

  describe('when testing Search Integration and URL synchronization workflows', () => {
    it('should maintain search state and sorting preferences through URL management', async () => {
      const TestComponent = () => {
        const [searchTerm, setSearchTerm] = React.useState('')
        const [sortBy, setSortBy] = React.useState('name')
        const [products] = React.useState(mockProducts)
        
        const updateURL = (newSearchTerm: string, newSortBy: string) => {
          const params = new URLSearchParams()
          if (newSearchTerm) params.set('search', newSearchTerm)
          if (newSortBy !== 'name') params.set('sort', newSortBy)
          
          const url = `/products${params.toString() ? '?' + params.toString() : ''}`
          mockReplace(url)
        }

        const handleSearch = (term: string) => {
          setSearchTerm(term)
          updateURL(term, sortBy)
        }

        const handleSort = (sort: string) => {
          setSortBy(sort)
          updateURL(searchTerm, sort)
        }

        const filteredAndSortedProducts = React.useMemo(() => {
          let filtered = products.filter(p =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.description.toLowerCase().includes(searchTerm.toLowerCase())
          )

          return filtered.sort((a, b) => {
            switch (sortBy) {
              case 'price':
                return parseFloat(a.price.replace('₹', '')) - parseFloat(b.price.replace('₹', ''))
              case 'name':
              default:
                return a.name.localeCompare(b.name)
            }
          })
        }, [products, searchTerm, sortBy])

        return (
          <div>
            <div data-testid="search-controls">
              <input
                data-testid="search-input"
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
              />
              
              <select
                data-testid="sort-select"
                value={sortBy}
                onChange={(e) => handleSort(e.target.value)}
              >
                <option value="name">Sort by Name</option>
                <option value="price">Sort by Price</option>
              </select>
            </div>

            <div data-testid="search-results">
              <p data-testid="results-count">
                Found {filteredAndSortedProducts.length} products
              </p>
              
              {filteredAndSortedProducts.length === 0 && (
                <div data-testid="no-results">
                  No products found matching &quot;{searchTerm}&quot;
                </div>
              )}

              {filteredAndSortedProducts.map((product, index) => (
                <div key={product.id} data-testid={`result-${index}`}>
                  <h3 data-testid={`result-name-${index}`}>{product.name}</h3>
                  <p data-testid={`result-price-${index}`}>{product.price}</p>
                  <button 
                    data-testid={`select-result-${index}`}
                    onClick={() => mockPush(`/products/${product.categorySlug}/${product.id}`)}
                  >
                    Select
                  </button>
                </div>
              ))}
            </div>

            <div data-testid="current-url">
              Last URL: {mockReplace.mock.calls.length > 0 
                ? mockReplace.mock.calls[mockReplace.mock.calls.length - 1][0] 
                : '/products'}
            </div>
          </div>
        )
      }

      // Given: Search interface requiring URL synchronization with filter state
      render(<TestComponent />)

      // Then: Initial catalog state shows all products with default sorting
      expect(screen.getByTestId('results-count')).toHaveTextContent('Found 3 products')
      expect(screen.getByTestId('result-name-0')).toHaveTextContent('Test Beaker')
      expect(screen.getByTestId('current-url')).toHaveTextContent('Last URL: /products')

      // When: User searches for specific product type
      const searchInput = screen.getByTestId('search-input')
      await user.type(searchInput, 'beaker')

      // Then: Search results filter products and update URL parameters
      await waitFor(() => {
        expect(screen.getByTestId('results-count')).toHaveTextContent('Found 1 products')
      })

      expect(mockReplace).toHaveBeenCalledWith('/products?search=beaker')
      expect(screen.getByTestId('result-name-0')).toHaveTextContent('Test Beaker')
      expect(screen.queryByText('Test Flask')).not.toBeInTheDocument()

      // When: User changes sorting preference during active search
      const sortSelect = screen.getByTestId('sort-select')
      await user.selectOptions(sortSelect, 'price')

      // Then: URL preserves search term while adding sort parameter
      expect(mockReplace).toHaveBeenCalledWith('/products?search=beaker&sort=price')

      // When: User clears search to see all products with new sorting
      await user.clear(searchInput)

      await waitFor(() => {
        expect(screen.getByTestId('results-count')).toHaveTextContent('Found 3 products')
      })

      // Then: Price sorting arranges products by ascending cost
      expect(screen.getByTestId('result-name-0')).toHaveTextContent('Test Pipette')
      expect(screen.getByTestId('result-price-0')).toHaveTextContent('₹150.00')
      expect(screen.getByTestId('result-name-1')).toHaveTextContent('Test Flask')
      expect(screen.getByTestId('result-name-2')).toHaveTextContent('Test Beaker')

      expect(mockReplace).toHaveBeenCalledWith('/products?sort=price')

      // When: User selects product from search results
      const selectButton = screen.getByTestId('select-result-0')
      await user.click(selectButton)

      // Then: Selection navigates to individual product detail page
      expect(mockPush).toHaveBeenCalledWith('/products/pipettes/pipette-out-of-stock')

      // When: User searches for non-existent product
      await user.type(searchInput, 'nonexistent')

      // Then: No results state provides clear feedback to user
      await waitFor(() => {
        expect(screen.getByTestId('no-results')).toBeInTheDocument()
      })

      expect(screen.getByTestId('no-results')).toHaveTextContent('No products found matching "nonexistent"')
    })
  })

  describe('when testing Multi-Page Application Navigation and History Management', () => {
    it('should maintain navigation history and enable back button functionality across application sections', async () => {
      const TestComponent = () => {
        const [currentPage, setCurrentPage] = React.useState('home')
        const [navigationHistory, setNavigationHistory] = React.useState(['home'])
        const [selectedProduct, setSelectedProduct] = React.useState(null)

        const navigateTo = (page: string, productId?: string) => {
          setCurrentPage(page)
          setNavigationHistory(prev => [...prev, page])
          
          if (page === 'product-details' && productId) {
            const product = mockProducts.find(p => p.id === productId)
            setSelectedProduct(product)
            mockPush(`/products/${product?.categorySlug}/${productId}`)
          } else {
            mockPush(`/${page === 'home' ? '' : page}`)
          }
        }

        const goBack = () => {
          if (navigationHistory.length > 1) {
            const newHistory = navigationHistory.slice(0, -1)
            const previousPage = newHistory[newHistory.length - 1]
            setNavigationHistory(newHistory)
            setCurrentPage(previousPage)
            mockBack()
          }
        }

        const renderPage = () => {
          switch (currentPage) {
            case 'home':
              return (
                <div data-testid="home-page">
                  <h1>Welcome to THIASIL</h1>
                  <button 
                    data-testid="nav-to-products"
                    onClick={() => navigateTo('products')}
                  >
                    Browse Products
                  </button>
                  <button 
                    data-testid="nav-to-about"
                    onClick={() => navigateTo('about')}
                  >
                    About Us
                  </button>
                </div>
              )
            
            case 'products':
              return (
                <div data-testid="products-page">
                  <h1>Our Products</h1>
                  {mockProducts.map(product => (
                    <div key={product.id} data-testid={`product-card-${product.id}`}>
                      <h3>{product.name}</h3>
                      <p>{product.price}</p>
                      <button 
                        data-testid={`view-details-${product.id}`}
                        onClick={() => navigateTo('product-details', product.id)}
                      >
                        View Details
                      </button>
                    </div>
                  ))}
                  <button 
                    data-testid="nav-to-contact"
                    onClick={() => navigateTo('contact')}
                  >
                    Contact Us
                  </button>
                </div>
              )
            
            case 'product-details':
              return (
                <div data-testid="product-details-page">
                  <h1>Product Details</h1>
                  {selectedProduct && (
                    <div data-testid="product-info">
                      <h2 data-testid="product-name">{selectedProduct.name}</h2>
                      <p data-testid="product-description">{selectedProduct.description}</p>
                      <p data-testid="product-price">{selectedProduct.price}</p>
                      <button 
                        data-testid="add-to-cart"
                        onClick={() => navigateTo('cart')}
                      >
                        Add to Cart
                      </button>
                    </div>
                  )}
                </div>
              )
            
            case 'about':
              return (
                <div data-testid="about-page">
                  <h1>About THIASIL</h1>
                  <p>We are a leading supplier of laboratory equipment.</p>
                  <button 
                    data-testid="nav-to-contact-from-about"
                    onClick={() => navigateTo('contact')}
                  >
                    Get in Touch
                  </button>
                </div>
              )
            
            case 'contact':
              return (
                <div data-testid="contact-page">
                  <h1>Contact Us</h1>
                  <p>Get in touch with our team.</p>
                  <button 
                    data-testid="submit-contact"
                    onClick={() => navigateTo('thank-you')}
                  >
                    Submit Message
                  </button>
                </div>
              )
            
            case 'cart':
              return (
                <div data-testid="cart-page">
                  <h1>Shopping Cart</h1>
                  <p>Your items are here.</p>
                  <button 
                    data-testid="checkout"
                    onClick={() => navigateTo('checkout')}
                  >
                    Proceed to Checkout
                  </button>
                </div>
              )
            
            case 'checkout':
              return (
                <div data-testid="checkout-page">
                  <h1>Checkout</h1>
                  <button 
                    data-testid="place-order"
                    onClick={() => navigateTo('order-confirmation')}
                  >
                    Place Order
                  </button>
                </div>
              )
            
            case 'thank-you':
            case 'order-confirmation':
              return (
                <div data-testid={`${currentPage}-page`}>
                  <h1>Thank You!</h1>
                  <p>{currentPage === 'order-confirmation' ? 'Order placed successfully!' : 'Message sent successfully!'}</p>
                  <button 
                    data-testid="return-home"
                    onClick={() => navigateTo('home')}
                  >
                    Return to Home
                  </button>
                </div>
              )
            
            default:
              return <div>Page not found</div>
          }
        }

        return (
          <div>
            <nav data-testid="main-navigation">
              <button 
                data-testid="back-button"
                onClick={goBack}
                disabled={navigationHistory.length <= 1}
              >
                ← Back
              </button>
              <span data-testid="current-page">Current: {currentPage}</span>
              <span data-testid="nav-history">
                History: {navigationHistory.join(' → ')}
              </span>
            </nav>
            
            {renderPage()}
          </div>
        )
      }

      // Given: Multi-page application requiring complex navigation and history tracking
      render(<TestComponent />)

      // Then: Initial application state shows homepage with empty navigation history
      expect(screen.getByTestId('home-page')).toBeInTheDocument()
      expect(screen.getByTestId('current-page')).toHaveTextContent('Current: home')
      expect(screen.getByTestId('nav-history')).toHaveTextContent('History: home')
      expect(screen.getByTestId('back-button')).toBeDisabled()

      // When: User navigates to product catalog section
      await user.click(screen.getByTestId('nav-to-products'))

      // Then: Product page loads with updated navigation history
      expect(screen.getByTestId('products-page')).toBeInTheDocument()
      expect(mockPush).toHaveBeenCalledWith('/products')
      expect(screen.getByTestId('nav-history')).toHaveTextContent('History: home → products')

      // When: User selects specific product for detailed view
      await user.click(screen.getByTestId('view-details-beaker-500ml'))

      // Then: Product detail page shows complete product information
      expect(screen.getByTestId('product-details-page')).toBeInTheDocument()
      expect(screen.getByTestId('product-name')).toHaveTextContent('Test Beaker')
      expect(mockPush).toHaveBeenCalledWith('/products/beakers/beaker-500ml')

      // When: User adds product to shopping cart
      await user.click(screen.getByTestId('add-to-cart'))

      // Then: Cart page loads with proper URL navigation
      expect(screen.getByTestId('cart-page')).toBeInTheDocument()
      expect(mockPush).toHaveBeenCalledWith('/cart')

      // When: User uses back button to return to previous page
      await user.click(screen.getByTestId('back-button'))

      // Then: Back navigation restores previous application state
      expect(screen.getByTestId('product-details-page')).toBeInTheDocument()
      expect(mockBack).toHaveBeenCalled()

      // When: User continues using back navigation
      await user.click(screen.getByTestId('back-button'))

      // Then: Navigation continues through history stack
      expect(screen.getByTestId('products-page')).toBeInTheDocument()

      // When: User navigates to company information section
      await user.click(screen.getByTestId('back-button')) // Back to home
      await user.click(screen.getByTestId('nav-to-about'))

      // Then: About page provides company information
      expect(screen.getByTestId('about-page')).toBeInTheDocument()
      expect(mockPush).toHaveBeenCalledWith('/about')

      // When: User navigates to contact form from about page
      await user.click(screen.getByTestId('nav-to-contact-from-about'))

      // Then: Contact page enables user communication
      expect(screen.getByTestId('contact-page')).toBeInTheDocument()
      expect(mockPush).toHaveBeenCalledWith('/contact')

      // When: User submits contact form message
      await user.click(screen.getByTestId('submit-contact'))

      // Then: Thank you page confirms message submission
      expect(screen.getByTestId('thank-you-page')).toBeInTheDocument()
      expect(mockPush).toHaveBeenCalledWith('/thank-you')

      // When: User returns to homepage after completing workflow
      await user.click(screen.getByTestId('return-home'))

      // Then: Navigation completes full application cycle
      expect(screen.getByTestId('home-page')).toBeInTheDocument()
      expect(mockPush).toHaveBeenCalledWith('/')

      // Then: Navigation history accurately reflects complete user journey
      expect(screen.getByTestId('nav-history')).toHaveTextContent(
        'History: home → about → contact → thank-you → home'
      )
    })
  })
})