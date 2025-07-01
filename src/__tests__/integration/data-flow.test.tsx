import React from 'react'
import { render, screen, waitFor } from '../utils/test-utils'
import { user, mockFetch, clearAllMocks } from '../utils/test-helpers'
import { mockProducts, mockApiResponses } from '../utils/mock-data'

// Mock fetch globally
const originalFetch = global.fetch
beforeAll(() => {
  global.fetch = jest.fn()
})

afterAll(() => {
  global.fetch = originalFetch
})

describe('Data Flow and State Management Integration Tests', () => {
  beforeEach(() => {
    clearAllMocks()
  })

  describe('Product Data Flow', () => {
    it('handles product loading and basic filtering', async () => {
      const TestComponent = () => {
        const [products, setProducts] = React.useState([])
        const [filteredProducts, setFilteredProducts] = React.useState([])
        const [loading, setLoading] = React.useState(false)
        const [filters, setFilters] = React.useState({
          category: '',
          priceRange: 'all',
          stockStatus: 'all'
        })

        // Load products
        const loadProducts = async () => {
          setLoading(true)
          try {
            const response = await fetch('/api/products')
            const data = await response.json()
            setProducts(data.data || [])
          } catch (error) {
            console.error('Failed to load products')
          } finally {
            setLoading(false)
          }
        }

        // Apply filters
        React.useEffect(() => {
          if (products.length === 0) {
            setFilteredProducts([])
            return
          }

          let filtered = [...products]

          if (filters.category && filters.category !== '') {
            filtered = filtered.filter(p => p.categorySlug === filters.category)
          }

          if (filters.stockStatus && filters.stockStatus !== 'all') {
            filtered = filtered.filter(p => p.stockStatus === filters.stockStatus)
          }

          if (filters.priceRange === 'under-200') {
            filtered = filtered.filter(p => {
              const price = parseFloat(p.price.replace('₹', ''))
              return price < 200
            })
          } else if (filters.priceRange === 'over-200') {
            filtered = filtered.filter(p => {
              const price = parseFloat(p.price.replace('₹', ''))
              return price >= 200
            })
          }

          setFilteredProducts(filtered)
        }, [products, filters])

        React.useEffect(() => {
          loadProducts()
        }, [])

        return (
          <div>
            <h1>Product Catalog</h1>
            
            {/* Filter Controls */}
            <div data-testid="filter-controls">
              <select 
                data-testid="category-filter" 
                value={filters.category}
                onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
              >
                <option value="">All Categories</option>
                <option value="beakers">Beakers</option>
                <option value="flasks">Flasks</option>
                <option value="pipettes">Pipettes</option>
              </select>

              <select 
                data-testid="stock-filter" 
                value={filters.stockStatus}
                onChange={(e) => setFilters(prev => ({ ...prev, stockStatus: e.target.value }))}
              >
                <option value="all">All Stock Status</option>
                <option value="in_stock">In Stock</option>
                <option value="out_of_stock">Out of Stock</option>
              </select>

              <select 
                data-testid="price-filter" 
                value={filters.priceRange}
                onChange={(e) => setFilters(prev => ({ ...prev, priceRange: e.target.value }))}
              >
                <option value="all">All Prices</option>
                <option value="under-200">Under ₹200</option>
                <option value="over-200">₹200 and above</option>
              </select>

              <button 
                data-testid="clear-filters" 
                onClick={() => setFilters({ category: '', priceRange: 'all', stockStatus: 'all' })}
              >
                Clear Filters
              </button>
            </div>

            {/* Loading State */}
            {loading && <div data-testid="loading">Loading products...</div>}

            {/* Product Grid */}
            <div data-testid="product-grid">
              {filteredProducts.length === 0 && !loading && (
                <div data-testid="no-products">No products found</div>
              )}
              
              {filteredProducts.map((product: any) => (
                <div key={product.id} data-testid={`product-${product.id}`} className="product-card">
                  <h3>{product.name}</h3>
                  <p data-testid={`price-${product.id}`}>{product.price}</p>
                  <span data-testid={`category-${product.id}`}>{product.category}</span>
                  <span 
                    data-testid={`stock-${product.id}`}
                    className={product.stockStatus === 'in_stock' ? 'in-stock' : 'out-of-stock'}
                  >
                    {product.stockStatus}
                  </span>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div data-testid="summary">
              Total Products: {products.length} | Filtered: {filteredProducts.length}
            </div>
          </div>
        )
      }

      // Mock API response
      mockFetch(mockApiResponses.products)

      render(<TestComponent />)

      // Verify loading state
      expect(screen.getByTestId('loading')).toBeInTheDocument()

      // Wait for products to load
      await waitFor(() => {
        expect(screen.getByText('Product Catalog')).toBeInTheDocument()
        expect(screen.queryByTestId('loading')).not.toBeInTheDocument()
      })

      // Verify products are loaded and displayed
      await waitFor(() => {
        expect(screen.getByTestId('summary')).toHaveTextContent('Total Products: 3 | Filtered: 3')
      })
      
      // Verify products are actually displayed
      expect(screen.getByTestId('product-beaker-500ml')).toBeInTheDocument()
      expect(screen.getByTestId('product-flask-250ml')).toBeInTheDocument()
      expect(screen.getByTestId('product-pipette-out-of-stock')).toBeInTheDocument()

      // Test category filtering
      const categoryFilter = screen.getByTestId('category-filter')
      await user.selectOptions(categoryFilter, 'beakers')

      await waitFor(() => {
        expect(screen.getByTestId('product-beaker-500ml')).toBeInTheDocument()
        expect(screen.queryByTestId('product-flask-250ml')).not.toBeInTheDocument()
        expect(screen.queryByTestId('product-pipette-out-of-stock')).not.toBeInTheDocument()
      })

      expect(screen.getByTestId('summary')).toHaveTextContent('Total Products: 3 | Filtered: 1')

      // Test stock status filtering
      await user.selectOptions(categoryFilter, '') // Clear category filter
      const stockFilter = screen.getByTestId('stock-filter')
      await user.selectOptions(stockFilter, 'out_of_stock')

      await waitFor(() => {
        expect(screen.queryByTestId('product-beaker-500ml')).not.toBeInTheDocument()
        expect(screen.queryByTestId('product-flask-250ml')).not.toBeInTheDocument()
        expect(screen.getByTestId('product-pipette-out-of-stock')).toBeInTheDocument()
      })

      expect(screen.getByTestId('summary')).toHaveTextContent('Total Products: 3 | Filtered: 1')

      // Test price filtering
      await user.selectOptions(stockFilter, 'all') // Clear stock filter
      const priceFilter = screen.getByTestId('price-filter')
      await user.selectOptions(priceFilter, 'under-200')

      await waitFor(() => {
        expect(screen.queryByTestId('product-beaker-500ml')).not.toBeInTheDocument() // ₹300
        expect(screen.queryByTestId('product-flask-250ml')).not.toBeInTheDocument() // ₹250
        expect(screen.getByTestId('product-pipette-out-of-stock')).toBeInTheDocument() // ₹150
      })

      expect(screen.getByTestId('summary')).toHaveTextContent('Total Products: 3 | Filtered: 1')

      // Test clear filters
      const clearButton = screen.getByTestId('clear-filters')
      await user.click(clearButton)

      await waitFor(() => {
        expect(screen.getByTestId('product-beaker-500ml')).toBeInTheDocument()
        expect(screen.getByTestId('product-flask-250ml')).toBeInTheDocument()
        expect(screen.getByTestId('product-pipette-out-of-stock')).toBeInTheDocument()
      })

      expect(screen.getByTestId('summary')).toHaveTextContent('Total Products: 3 | Filtered: 3')
    })
  })

  describe('Shopping Cart State Management', () => {
    it('manages cart state across operations', async () => {
      const TestComponent = () => {
        const [cart, setCart] = React.useState<any[]>([])
        const [products] = React.useState(mockProducts.slice(0, 2)) // Only in-stock products

        const addToCart = (product: any) => {
          setCart(prev => {
            const existing = prev.find(item => item.id === product.id)
            if (existing) {
              return prev.map(item => 
                item.id === product.id 
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              )
            }
            return [...prev, { ...product, quantity: 1 }]
          })
        }

        const updateQuantity = (productId: string, quantity: number) => {
          if (quantity <= 0) {
            setCart(prev => prev.filter(item => item.id !== productId))
          } else {
            setCart(prev => prev.map(item => 
              item.id === productId ? { ...item, quantity } : item
            ))
          }
        }

        const removeFromCart = (productId: string) => {
          setCart(prev => prev.filter(item => item.id !== productId))
        }

        const clearCart = () => {
          setCart([])
        }

        const getTotalPrice = () => {
          return cart.reduce((total, item) => {
            const price = parseFloat(item.price.replace('₹', ''))
            return total + (price * item.quantity)
          }, 0)
        }

        const getTotalItems = () => {
          return cart.reduce((total, item) => total + item.quantity, 0)
        }

        return (
          <div>
            <h1>Shopping Cart Test</h1>
            
            {/* Product List */}
            <div data-testid="product-list">
              {products.map((product: any) => (
                <div key={product.id} data-testid={`product-${product.id}`}>
                  <h3>{product.name}</h3>
                  <p>{product.price}</p>
                  <button 
                    data-testid={`add-to-cart-${product.id}`}
                    onClick={() => addToCart(product)}
                  >
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>

            {/* Cart Summary */}
            <div data-testid="cart-summary">
              <p data-testid="cart-items">Items: {getTotalItems()}</p>
              <p data-testid="cart-total">Total: ₹{getTotalPrice().toFixed(2)}</p>
              <button data-testid="clear-cart" onClick={clearCart}>
                Clear Cart
              </button>
            </div>

            {/* Cart Items */}
            <div data-testid="cart-items-list">
              {cart.length === 0 && (
                <div data-testid="empty-cart">Cart is empty</div>
              )}
              
              {cart.map((item: any) => (
                <div key={item.id} data-testid={`cart-item-${item.id}`}>
                  <h4>{item.name}</h4>
                  <p>Price: {item.price}</p>
                  <div data-testid={`quantity-controls-${item.id}`}>
                    <button 
                      data-testid={`decrease-${item.id}`}
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      -
                    </button>
                    <span data-testid={`quantity-${item.id}`}>{item.quantity}</span>
                    <button 
                      data-testid={`increase-${item.id}`}
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                    <button 
                      data-testid={`remove-${item.id}`}
                      onClick={() => removeFromCart(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                  <p data-testid={`subtotal-${item.id}`}>
                    Subtotal: ₹{(parseFloat(item.price.replace('₹', '')) * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )
      }

      render(<TestComponent />)

      // Verify initial empty state
      expect(screen.getByTestId('empty-cart')).toBeInTheDocument()
      expect(screen.getByTestId('cart-items')).toHaveTextContent('Items: 0')
      expect(screen.getByTestId('cart-total')).toHaveTextContent('Total: ₹0.00')

      // Add first product to cart
      const addBeakerButton = screen.getByTestId('add-to-cart-beaker-500ml')
      await user.click(addBeakerButton)

      await waitFor(() => {
        expect(screen.queryByTestId('empty-cart')).not.toBeInTheDocument()
        expect(screen.getByTestId('cart-item-beaker-500ml')).toBeInTheDocument()
      })

      expect(screen.getByTestId('cart-items')).toHaveTextContent('Items: 1')
      expect(screen.getByTestId('cart-total')).toHaveTextContent('Total: ₹300.00')
      expect(screen.getByTestId('quantity-beaker-500ml')).toHaveTextContent('1')
      expect(screen.getByTestId('subtotal-beaker-500ml')).toHaveTextContent('Subtotal: ₹300.00')

      // Add same product again (should increase quantity)
      await user.click(addBeakerButton)

      await waitFor(() => {
        expect(screen.getByTestId('quantity-beaker-500ml')).toHaveTextContent('2')
      })

      expect(screen.getByTestId('cart-items')).toHaveTextContent('Items: 2')
      expect(screen.getByTestId('cart-total')).toHaveTextContent('Total: ₹600.00')
      expect(screen.getByTestId('subtotal-beaker-500ml')).toHaveTextContent('Subtotal: ₹600.00')

      // Add different product
      const addFlaskButton = screen.getByTestId('add-to-cart-flask-250ml')
      await user.click(addFlaskButton)

      await waitFor(() => {
        expect(screen.getByTestId('cart-item-flask-250ml')).toBeInTheDocument()
      })

      expect(screen.getByTestId('cart-items')).toHaveTextContent('Items: 3')
      expect(screen.getByTestId('cart-total')).toHaveTextContent('Total: ₹850.00') // 600 + 250

      // Test quantity controls
      const increaseFlaskButton = screen.getByTestId('increase-flask-250ml')
      await user.click(increaseFlaskButton)

      await waitFor(() => {
        expect(screen.getByTestId('quantity-flask-250ml')).toHaveTextContent('2')
      })

      expect(screen.getByTestId('cart-items')).toHaveTextContent('Items: 4')
      expect(screen.getByTestId('cart-total')).toHaveTextContent('Total: ₹1100.00') // 600 + 500

      // Test decrease quantity
      const decreaseBeakerButton = screen.getByTestId('decrease-beaker-500ml')
      await user.click(decreaseBeakerButton)

      await waitFor(() => {
        expect(screen.getByTestId('quantity-beaker-500ml')).toHaveTextContent('1')
      })

      expect(screen.getByTestId('cart-items')).toHaveTextContent('Items: 3')
      expect(screen.getByTestId('cart-total')).toHaveTextContent('Total: ₹800.00') // 300 + 500

      // Test remove item
      const removeBeakerButton = screen.getByTestId('remove-beaker-500ml')
      await user.click(removeBeakerButton)

      await waitFor(() => {
        expect(screen.queryByTestId('cart-item-beaker-500ml')).not.toBeInTheDocument()
      })

      expect(screen.getByTestId('cart-items')).toHaveTextContent('Items: 2')
      expect(screen.getByTestId('cart-total')).toHaveTextContent('Total: ₹500.00')

      // Test clear cart
      const clearCartButton = screen.getByTestId('clear-cart')
      await user.click(clearCartButton)

      await waitFor(() => {
        expect(screen.getByTestId('empty-cart')).toBeInTheDocument()
        expect(screen.queryByTestId('cart-item-flask-250ml')).not.toBeInTheDocument()
      })

      expect(screen.getByTestId('cart-items')).toHaveTextContent('Items: 0')
      expect(screen.getByTestId('cart-total')).toHaveTextContent('Total: ₹0.00')
    })
  })

  describe('Cross-Component State Synchronization', () => {
    it('synchronizes state between multiple components', async () => {
      // Parent component managing shared state
      const ParentComponent = () => {
        const [selectedProduct, setSelectedProduct] = React.useState<any>(null)
        const [favoriteProducts, setFavoriteProducts] = React.useState<string[]>([])
        const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid')

        const toggleFavorite = (productId: string) => {
          setFavoriteProducts(prev => 
            prev.includes(productId) 
              ? prev.filter(id => id !== productId)
              : [...prev, productId]
          )
        }

        return (
          <div>
            {/* Product List Component */}
            <ProductListComponent 
              products={mockProducts}
              selectedProduct={selectedProduct}
              onSelectProduct={setSelectedProduct}
              favoriteProducts={favoriteProducts}
              onToggleFavorite={toggleFavorite}
              viewMode={viewMode}
            />

            {/* View Controls Component */}
            <ViewControlsComponent
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              favoriteCount={favoriteProducts.length}
            />

            {/* Product Details Component */}
            <ProductDetailsComponent
              product={selectedProduct}
              isFavorite={selectedProduct ? favoriteProducts.includes(selectedProduct.id) : false}
              onToggleFavorite={() => selectedProduct && toggleFavorite(selectedProduct.id)}
            />
          </div>
        )
      }

      const ProductListComponent = ({ 
        products, 
        selectedProduct, 
        onSelectProduct, 
        favoriteProducts, 
        onToggleFavorite,
        viewMode 
      }: any) => (
        <div data-testid="product-list" className={`view-${viewMode}`}>
          <h2>Products ({products.length})</h2>
          {products.map((product: any) => (
            <div 
              key={product.id} 
              data-testid={`product-${product.id}`}
              className={`product-item ${selectedProduct?.id === product.id ? 'selected' : ''}`}
              onClick={() => onSelectProduct(product)}
            >
              <h3>{product.name}</h3>
              <p>{product.price}</p>
              <button 
                data-testid={`favorite-${product.id}`}
                onClick={(e) => {
                  e.stopPropagation()
                  onToggleFavorite(product.id)
                }}
                className={favoriteProducts.includes(product.id) ? 'favorited' : ''}
              >
                {favoriteProducts.includes(product.id) ? '❤️' : '🤍'}
              </button>
            </div>
          ))}
        </div>
      )

      const ViewControlsComponent = ({ viewMode, onViewModeChange, favoriteCount }: any) => (
        <div data-testid="view-controls">
          <button 
            data-testid="grid-view"
            onClick={() => onViewModeChange('grid')}
            className={viewMode === 'grid' ? 'active' : ''}
          >
            Grid View
          </button>
          <button 
            data-testid="list-view"
            onClick={() => onViewModeChange('list')}
            className={viewMode === 'list' ? 'active' : ''}
          >
            List View
          </button>
          <div data-testid="favorite-count">
            Favorites: {favoriteCount}
          </div>
        </div>
      )

      const ProductDetailsComponent = ({ product, isFavorite, onToggleFavorite }: any) => (
        <div data-testid="product-details">
          {product ? (
            <div>
              <h2>Selected Product</h2>
              <h3 data-testid="selected-name">{product.name}</h3>
              <p data-testid="selected-price">{product.price}</p>
              <p data-testid="selected-description">{product.description}</p>
              <button 
                data-testid="favorite-selected"
                onClick={onToggleFavorite}
                className={isFavorite ? 'favorited' : ''}
              >
                {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
              </button>
            </div>
          ) : (
            <div data-testid="no-selection">Select a product to view details</div>
          )}
        </div>
      )

      render(<ParentComponent />)

      // Verify initial state
      expect(screen.getByTestId('no-selection')).toBeInTheDocument()
      expect(screen.getByTestId('favorite-count')).toHaveTextContent('Favorites: 0')
      expect(screen.getByTestId('product-list')).toHaveClass('view-grid')

      // Test product selection
      const beakerProduct = screen.getByTestId('product-beaker-500ml')
      await user.click(beakerProduct)

      await waitFor(() => {
        expect(screen.queryByTestId('no-selection')).not.toBeInTheDocument()
        expect(screen.getByTestId('selected-name')).toHaveTextContent('Test Beaker')
      })

      expect(screen.getByTestId('selected-price')).toHaveTextContent('₹300.00')
      expect(beakerProduct).toHaveClass('selected')

      // Test view mode change
      const listViewButton = screen.getByTestId('list-view')
      await user.click(listViewButton)

      await waitFor(() => {
        expect(screen.getByTestId('product-list')).toHaveClass('view-list')
      })

      expect(listViewButton).toHaveClass('active')

      // Test favorite toggle from product list
      const favoriteButton = screen.getByTestId('favorite-beaker-500ml')
      await user.click(favoriteButton)

      await waitFor(() => {
        expect(screen.getByTestId('favorite-count')).toHaveTextContent('Favorites: 1')
      })

      expect(favoriteButton).toHaveClass('favorited')
      expect(favoriteButton).toHaveTextContent('❤️')
      expect(screen.getByTestId('favorite-selected')).toHaveClass('favorited')
      expect(screen.getByTestId('favorite-selected')).toHaveTextContent('Remove from Favorites')

      // Test favorite toggle from details panel
      const detailsFavoriteButton = screen.getByTestId('favorite-selected')
      await user.click(detailsFavoriteButton)

      await waitFor(() => {
        expect(screen.getByTestId('favorite-count')).toHaveTextContent('Favorites: 0')
      })

      expect(favoriteButton).not.toHaveClass('favorited')
      expect(favoriteButton).toHaveTextContent('🤍')
      expect(detailsFavoriteButton).not.toHaveClass('favorited')
      expect(detailsFavoriteButton).toHaveTextContent('Add to Favorites')

      // Test multiple favorites
      await user.click(favoriteButton) // Beaker
      const flaskFavoriteButton = screen.getByTestId('favorite-flask-250ml')
      await user.click(flaskFavoriteButton) // Flask

      await waitFor(() => {
        expect(screen.getByTestId('favorite-count')).toHaveTextContent('Favorites: 2')
      })

      // Switch selection and verify state consistency
      const flaskProduct = screen.getByTestId('product-flask-250ml')
      await user.click(flaskProduct)

      await waitFor(() => {
        expect(screen.getByTestId('selected-name')).toHaveTextContent('Test Flask')
      })

      expect(beakerProduct).not.toHaveClass('selected')
      expect(flaskProduct).toHaveClass('selected')
      expect(screen.getByTestId('favorite-selected')).toHaveClass('favorited') // Flask is favorited
    })
  })
})