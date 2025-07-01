import React from 'react'
import { render, screen, waitFor } from '../utils/test-utils'
import { mockFetch, mockFetchError, clearAllMocks, user, simulateNetworkError, simulateServerError } from '../utils/test-helpers'
import { mockProducts, mockApiResponses } from '../utils/mock-data'

// Mock Next.js router
const mockPush = jest.fn()
const mockReplace = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
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

describe('API Integration Testing Suite', () => {
  beforeEach(() => {
    clearAllMocks()
  })

  describe('when integrating with Product API endpoints', () => {
    it('should successfully fetch and display product data from backend', async () => {
      // Given: Product API returning valid product data
      mockFetch(mockApiResponses.products)

      // Create a simple component that fetches products
      const TestComponent = () => {
        const [products, setProducts] = React.useState([])
        const [loading, setLoading] = React.useState(true)
        const [error, setError] = React.useState(null)

        React.useEffect(() => {
          const fetchProducts = async () => {
            try {
              const response = await fetch('/api/products')
              const data = await response.json()
              setProducts(data.data || [])
            } catch (err) {
              setError(err instanceof Error ? err.message : 'Unknown error')
            } finally {
              setLoading(false)
            }
          }
          fetchProducts()
        }, [])

        if (loading) return <div>Loading products...</div>
        if (error) return <div>Error: {error}</div>
        if (products.length === 0) return <div>No products found</div>

        return (
          <div>
            <h1>Products</h1>
            {products.map((product: any) => (
              <div key={product.id} data-testid={`product-${product.id}`}>
                <h3>{product.name}</h3>
                <p>{product.price}</p>
                <span data-testid={`stock-${product.id}`}>{product.stockStatus}</span>
              </div>
            ))}
          </div>
        )
      }

      // When: Component fetches products from API
      render(<TestComponent />)

      // Then: Loading state provides immediate user feedback
      expect(screen.getByText('Loading products...')).toBeInTheDocument()

      // Then: Products are successfully loaded and displayed
      await waitFor(() => {
        expect(screen.getByText('Products')).toBeInTheDocument()
      })

      // Then: API is called with correct endpoint
      expect(global.fetch).toHaveBeenCalledWith('/api/products')

      // Then: Product data is correctly rendered for user browsing
      expect(screen.getByTestId('product-beaker-500ml')).toBeInTheDocument()
      expect(screen.getByText('Test Beaker')).toBeInTheDocument()
      expect(screen.getByText('₹300.00')).toBeInTheDocument()
      expect(screen.getByTestId('stock-beaker-500ml')).toHaveTextContent('in_stock')
    })

    it('should provide clear error messaging when API requests fail', async () => {
      // Given: Product API returning error response
      mockFetchError('Failed to fetch products')

      const TestComponent = () => {
        const [products, setProducts] = React.useState([])
        const [loading, setLoading] = React.useState(true)
        const [error, setError] = React.useState(null)

        React.useEffect(() => {
          const fetchProducts = async () => {
            try {
              const response = await fetch('/api/products')
              const data = await response.json()
              setProducts(data.data || [])
            } catch (err) {
              setError(err instanceof Error ? err.message : 'Unknown error')
            } finally {
              setLoading(false)
            }
          }
          fetchProducts()
        }, [])

        if (loading) return <div>Loading products...</div>
        if (error) return <div data-testid="error-message">Error: {error}</div>

        return <div>Products loaded</div>
      }

      // When: Component attempts to fetch products
      render(<TestComponent />)

      // Then: Error state provides helpful feedback to user
      await waitFor(() => {
        expect(screen.getByTestId('error-message')).toBeInTheDocument()
      })

      // Then: Clear error message helps user understand issue
      expect(screen.getByText('Error: Failed to fetch products')).toBeInTheDocument()
    })

    it('should provide timeout feedback for slow network connections', async () => {
      // Given: Slow network causing extended loading time
      mockFetch(mockProducts, true, 10000)

      const TestComponent = () => {
        const [loading, setLoading] = React.useState(true)
        const [slowLoading, setSlowLoading] = React.useState(false)

        React.useEffect(() => {
          const fetchProducts = async () => {
            const timer = setTimeout(() => {
              setSlowLoading(true)
            }, 3000) // Show slow loading after 3 seconds

            try {
              const response = await fetch('/api/products')
              clearTimeout(timer)
              setLoading(false)
            } catch (err) {
              clearTimeout(timer)
              setLoading(false)
            }
          }
          fetchProducts()
        }, [])

        if (slowLoading && loading) {
          return <div data-testid="slow-loading">Taking longer than expected...</div>
        }

        if (loading) return <div>Loading products...</div>
        return <div>Products loaded</div>
      }

      // When: Component loads with slow network
      render(<TestComponent />)

      // Then: Initial loading state appears immediately
      expect(screen.getByText('Loading products...')).toBeInTheDocument()

      // Then: Extended loading message helps manage user expectations
      await waitFor(() => {
        expect(screen.getByTestId('slow-loading')).toBeInTheDocument()
      }, { timeout: 4000 })
    })

    it('should handle corrupted API responses without breaking user experience', async () => {
      // Given: API returning malformed JSON data
      const mockBadResponse = {
        ok: true,
        json: () => Promise.reject(new Error('Invalid JSON'))
      }
      
      global.fetch = jest.fn().mockResolvedValue(mockBadResponse)

      const TestComponent = () => {
        const [error, setError] = React.useState(null)
        const [loading, setLoading] = React.useState(true)

        React.useEffect(() => {
          const fetchProducts = async () => {
            try {
              const response = await fetch('/api/products')
              await response.json() // This will fail with invalid JSON
            } catch (err) {
              setError('Failed to parse response')
            } finally {
              setLoading(false)
            }
          }
          fetchProducts()
        }, [])

        if (loading) return <div>Loading...</div>
        if (error) return <div data-testid="parse-error">{error}</div>
        return <div>Success</div>
      }

      // When: Component attempts to parse corrupted response
      render(<TestComponent />)

      // Then: Parse error is handled gracefully
      await waitFor(() => {
        expect(screen.getByTestId('parse-error')).toBeInTheDocument()
      })

      // Then: User-friendly error message is displayed
      expect(screen.getByText('Failed to parse response')).toBeInTheDocument()
    })

    it('should handle API rate limiting with appropriate user guidance', async () => {
      // Given: API enforcing rate limits with 429 status
      mockFetch({ error: 'Rate limit exceeded' }, false, 0, 429)

      const TestComponent = () => {
        const [error, setError] = React.useState(null)
        const [loading, setLoading] = React.useState(true)

        React.useEffect(() => {
          const fetchProducts = async () => {
            try {
              const response = await fetch('/api/products')
              if (response.status === 429) {
                setError('Too many requests. Please try again later.')
              }
            } catch (err) {
              setError('Network error')
            } finally {
              setLoading(false)
            }
          }
          fetchProducts()
        }, [])

        if (loading) return <div>Loading...</div>
        if (error) return <div data-testid="rate-limit-error">{error}</div>
        return <div>Success</div>
      }

      // When: Component encounters rate limiting
      render(<TestComponent />)

      // Then: Rate limit error is detected and handled
      await waitFor(() => {
        expect(screen.getByTestId('rate-limit-error')).toBeInTheDocument()
      })

      // Then: User receives clear guidance about rate limiting
      expect(screen.getByText('Too many requests. Please try again later.')).toBeInTheDocument()
    })
  })

  describe('when integrating with Coupon validation API', () => {
    it('should successfully validate and apply valid coupon codes', async () => {
      const TestComponent = () => {
        const [couponCode, setCouponCode] = React.useState('')
        const [validation, setValidation] = React.useState(null)
        const [loading, setLoading] = React.useState(false)

        const validateCoupon = async (code: string) => {
          setLoading(true)
          try {
            const response = await fetch('/api/coupons', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ code, orderValue: 200 })
            })
            const data = await response.json()
            setValidation(data)
          } catch (err) {
            setValidation({ isValid: false, error: 'Network error' })
          } finally {
            setLoading(false)
          }
        }

        return (
          <div>
            <input
              data-testid="coupon-input"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder="Enter coupon code"
            />
            <button
              data-testid="validate-button"
              onClick={() => validateCoupon(couponCode)}
              disabled={loading}
            >
              {loading ? 'Validating...' : 'Apply Coupon'}
            </button>
            {validation && (
              <div data-testid="validation-result">
                {validation.isValid ? (
                  <div data-testid="coupon-success">
                    Coupon applied! {validation.discount}% off
                  </div>
                ) : (
                  <div data-testid="coupon-error">
                    {validation.error}
                  </div>
                )}
              </div>
            )}
          </div>
        )
      }

      // Given: Valid coupon code available for validation
      mockFetch(mockApiResponses.couponValidation('SAVE10'))

      // When: User enters and validates coupon code
      render(<TestComponent />)

      const input = screen.getByTestId('coupon-input')
      await user.type(input, 'SAVE10')

      const validateButton = screen.getByTestId('validate-button')
      await user.click(validateButton)

      // Then: Validation succeeds and discount is applied
      await waitFor(() => {
        expect(screen.getByTestId('coupon-success')).toBeInTheDocument()
      })

      // Then: User sees confirmation of successful coupon application
      expect(screen.getByText('Coupon applied! 10% off')).toBeInTheDocument()

      // Then: API is called with correct validation parameters
      expect(global.fetch).toHaveBeenCalledWith('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: 'SAVE10', orderValue: 200 })
      })
    })

    it('should provide clear feedback for invalid coupon codes', async () => {
      const TestComponent = () => {
        const [validation, setValidation] = React.useState(null)

        const validateCoupon = async () => {
          try {
            const response = await fetch('/api/coupons', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ code: 'INVALID', orderValue: 200 })
            })
            const data = await response.json()
            setValidation(data)
          } catch (err) {
            setValidation({ isValid: false, error: 'Network error' })
          }
        }

        React.useEffect(() => {
          validateCoupon()
        }, [])

        if (!validation) return <div>Loading...</div>

        return (
          <div data-testid="validation-result">
            {validation.isValid ? (
              <div>Valid coupon</div>
            ) : (
              <div data-testid="invalid-coupon">{validation.error}</div>
            )}
          </div>
        )
      }

      // Given: Invalid coupon code submitted for validation
      mockFetch(mockApiResponses.couponValidation('INVALID'))

      // When: Component validates invalid coupon
      render(<TestComponent />)

      // Then: Invalid coupon error is displayed
      await waitFor(() => {
        expect(screen.getByTestId('invalid-coupon')).toBeInTheDocument()
      })

      // Then: Clear error message guides user to try different code
      expect(screen.getByText('Invalid coupon code')).toBeInTheDocument()
    })
  })

  describe('when implementing error recovery and retry mechanisms', () => {
    it('should enable users to retry failed API requests successfully', async () => {
      let callCount = 0
      const mockFetchWithRetry = jest.fn().mockImplementation(() => {
        callCount++
        if (callCount === 1) {
          return Promise.reject(new Error('Network error'))
        }
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockApiResponses.products)
        })
      })

      global.fetch = mockFetchWithRetry

      const TestComponent = () => {
        const [products, setProducts] = React.useState([])
        const [loading, setLoading] = React.useState(false)
        const [error, setError] = React.useState(null)

        const fetchProducts = async () => {
          setLoading(true)
          setError(null)
          try {
            const response = await fetch('/api/products')
            const data = await response.json()
            setProducts(data.data || [])
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error')
          } finally {
            setLoading(false)
          }
        }

        React.useEffect(() => {
          fetchProducts()
        }, [])

        if (loading) return <div>Loading...</div>
        if (error) {
          return (
            <div>
              <div data-testid="error-message">Error: {error}</div>
              <button data-testid="retry-button" onClick={fetchProducts}>
                Retry
              </button>
            </div>
          )
        }

        return (
          <div data-testid="products-loaded">
            Products loaded: {products.length}
          </div>
        )
      }

      // When: Component experiences initial failure then retries
      render(<TestComponent />)

      // Then: Initial error state provides retry option
      await waitFor(() => {
        expect(screen.getByTestId('error-message')).toBeInTheDocument()
      })

      // When: User clicks retry button
      const retryButton = screen.getByTestId('retry-button')
      await user.click(retryButton)

      // Then: Retry succeeds and data loads properly
      await waitFor(() => {
        expect(screen.getByTestId('products-loaded')).toBeInTheDocument()
      })

      // Then: Successful retry loads expected data
      expect(screen.getByText('Products loaded: 3')).toBeInTheDocument()
      expect(mockFetchWithRetry).toHaveBeenCalledTimes(2)
    })
  })

  describe('when monitoring API performance and response times', () => {
    it('should accurately measure and report API response times', async () => {
      const performanceData = {
        startTime: 0,
        endTime: 0,
        duration: 0
      }

      const TestComponent = () => {
        const [responseTime, setResponseTime] = React.useState(0)

        React.useEffect(() => {
          const fetchWithTiming = async () => {
            performanceData.startTime = performance.now()
            
            try {
              await fetch('/api/products')
            } catch (err) {
              // Ignore error for this test
            }
            
            performanceData.endTime = performance.now()
            performanceData.duration = performanceData.endTime - performanceData.startTime
            setResponseTime(performanceData.duration)
          }

          fetchWithTiming()
        }, [])

        return (
          <div data-testid="response-time">
            Response time: {responseTime.toFixed(2)}ms
          </div>
        )
      }

      // Given: API with known 200ms response delay
      mockFetch(mockProducts, true, 200)

      // When: Component measures API response time
      render(<TestComponent />)

      // Then: Response time is accurately measured and displayed
      await waitFor(() => {
        const responseTimeElement = screen.getByTestId('response-time')
        expect(responseTimeElement).toBeInTheDocument()
        
        // Then: Measured time reflects actual API delay with reasonable tolerance
        const timeText = responseTimeElement.textContent || ''
        const time = parseFloat(timeText.match(/[\d.]+/)?.[0] || '0')
        expect(time).toBeGreaterThan(190) // Allow some tolerance for test execution
      })
    })
  })
})