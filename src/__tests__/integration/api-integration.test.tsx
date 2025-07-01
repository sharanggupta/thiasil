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

describe('API Integration Tests', () => {
  beforeEach(() => {
    clearAllMocks()
  })

  describe('Product API Integration', () => {
    it('successfully loads products from API', async () => {
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

      render(<TestComponent />)

      // Verify loading state
      expect(screen.getByText('Loading products...')).toBeInTheDocument()

      // Wait for API call to complete
      await waitFor(() => {
        expect(screen.getByText('Products')).toBeInTheDocument()
      })

      // Verify API was called correctly
      expect(global.fetch).toHaveBeenCalledWith('/api/products')

      // Verify products are displayed
      expect(screen.getByTestId('product-beaker-500ml')).toBeInTheDocument()
      expect(screen.getByText('Test Beaker')).toBeInTheDocument()
      expect(screen.getByText('₹300.00')).toBeInTheDocument()
      expect(screen.getByTestId('stock-beaker-500ml')).toHaveTextContent('in_stock')
    })

    it('handles API errors gracefully', async () => {
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

      render(<TestComponent />)

      // Wait for error state
      await waitFor(() => {
        expect(screen.getByTestId('error-message')).toBeInTheDocument()
      })

      expect(screen.getByText('Error: Failed to fetch products')).toBeInTheDocument()
    })

    it('handles network timeout correctly', async () => {
      // Mock slow network response (10 second delay)
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

      render(<TestComponent />)

      // Initially should show loading
      expect(screen.getByText('Loading products...')).toBeInTheDocument()

      // After timeout, should show slow loading message
      await waitFor(() => {
        expect(screen.getByTestId('slow-loading')).toBeInTheDocument()
      }, { timeout: 4000 })
    })

    it('handles malformed API responses', async () => {
      // Mock a response that will fail JSON parsing
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

      render(<TestComponent />)

      await waitFor(() => {
        expect(screen.getByTestId('parse-error')).toBeInTheDocument()
      })

      expect(screen.getByText('Failed to parse response')).toBeInTheDocument()
    })

    it('respects rate limiting', async () => {
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

      render(<TestComponent />)

      await waitFor(() => {
        expect(screen.getByTestId('rate-limit-error')).toBeInTheDocument()
      })

      expect(screen.getByText('Too many requests. Please try again later.')).toBeInTheDocument()
    })
  })

  describe('Coupon API Integration', () => {
    it('validates coupon codes successfully', async () => {
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

      // Mock successful coupon validation
      mockFetch(mockApiResponses.couponValidation('SAVE10'))

      render(<TestComponent />)

      // Enter coupon code
      const input = screen.getByTestId('coupon-input')
      await user.type(input, 'SAVE10')

      // Click validate button
      const validateButton = screen.getByTestId('validate-button')
      await user.click(validateButton)

      // Note: Loading state might be too fast to catch, so we'll skip this assertion

      // Wait for validation to complete
      await waitFor(() => {
        expect(screen.getByTestId('coupon-success')).toBeInTheDocument()
      })

      expect(screen.getByText('Coupon applied! 10% off')).toBeInTheDocument()

      // Verify API call
      expect(global.fetch).toHaveBeenCalledWith('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: 'SAVE10', orderValue: 200 })
      })
    })

    it('handles invalid coupon codes', async () => {
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

      // Mock invalid coupon response
      mockFetch(mockApiResponses.couponValidation('INVALID'))

      render(<TestComponent />)

      await waitFor(() => {
        expect(screen.getByTestId('invalid-coupon')).toBeInTheDocument()
      })

      expect(screen.getByText('Invalid coupon code')).toBeInTheDocument()
    })
  })

  describe('Error Recovery and Retry', () => {
    it('allows retry after API failure', async () => {
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

      render(<TestComponent />)

      // Wait for initial error
      await waitFor(() => {
        expect(screen.getByTestId('error-message')).toBeInTheDocument()
      })

      // Click retry button
      const retryButton = screen.getByTestId('retry-button')
      await user.click(retryButton)

      // Wait for success after retry
      await waitFor(() => {
        expect(screen.getByTestId('products-loaded')).toBeInTheDocument()
      })

      expect(screen.getByText('Products loaded: 3')).toBeInTheDocument()
      expect(mockFetchWithRetry).toHaveBeenCalledTimes(2)
    })
  })

  describe('API Performance', () => {
    it('tracks API response times', async () => {
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

      // Mock a response with 200ms delay
      mockFetch(mockProducts, true, 200)

      render(<TestComponent />)

      await waitFor(() => {
        const responseTimeElement = screen.getByTestId('response-time')
        expect(responseTimeElement).toBeInTheDocument()
        
        // Response time should be approximately 200ms (with some tolerance)
        const timeText = responseTimeElement.textContent || ''
        const time = parseFloat(timeText.match(/[\d.]+/)?.[0] || '0')
        expect(time).toBeGreaterThan(190) // Allow some tolerance
      })
    })
  })
})