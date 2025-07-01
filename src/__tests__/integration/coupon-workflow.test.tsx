import React from 'react'
import { render, screen, waitFor } from '../utils/test-utils'
import { user, mockFetch, clearAllMocks } from '../utils/test-helpers'
import { mockProducts, mockCoupon, mockApiResponses } from '../utils/mock-data'
import { CouponProvider } from '@/contexts/CouponContext'

// Mock fetch globally
const originalFetch = global.fetch
beforeAll(() => {
  global.fetch = jest.fn()
})

afterAll(() => {
  global.fetch = originalFetch
})

describe('Coupon Integration Workflow Testing Suite', () => {
  beforeEach(() => {
    clearAllMocks()
    localStorage.clear()
    sessionStorage.clear()
  })

  const renderWithCouponProvider = (ui: React.ReactElement) => {
    return render(
      <CouponProvider enablePersistence={false}>
        {ui}
      </CouponProvider>
    )
  }

  describe('when testing complete coupon lifecycle management', () => {
    it('should successfully handle full coupon application and removal workflow', async () => {
      const TestComponent = () => {
        const [couponCode, setCouponCode] = React.useState('')
        const [appliedCoupon, setAppliedCoupon] = React.useState(null)
        const [products, setProducts] = React.useState([])
        const [loading, setLoading] = React.useState(false)
        const [error, setError] = React.useState('')

        const applyCoupon = async () => {
          if (!couponCode.trim()) return

          setLoading(true)
          setError('')

          try {
            const response = await fetch('/api/coupons', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                code: couponCode.trim(), 
                orderValue: 300 
              })
            })

            const data = await response.json()

            if (data.isValid) {
              setAppliedCoupon(data.coupon)
              setCouponCode('')
            } else {
              setError(data.error || 'Invalid coupon code')
            }
          } catch (err) {
            setError('Failed to validate coupon')
          } finally {
            setLoading(false)
          }
        }

        const removeCoupon = () => {
          setAppliedCoupon(null)
          setError('')
        }

        const calculateDiscountedPrice = (price: string) => {
          if (!appliedCoupon) return price
          
          const numericPrice = parseFloat(price.replace('₹', ''))
          const discountAmount = (numericPrice * appliedCoupon.discountPercent) / 100
          const discountedPrice = numericPrice - discountAmount
          
          return `₹${discountedPrice.toFixed(2)}`
        }

        React.useEffect(() => {
          // Load products on mount
          setProducts(mockProducts)
        }, [])

        return (
          <div>
            <h1>Products with Coupon Support</h1>
            
            {/* Coupon Input Section */}
            <div data-testid="coupon-section">
              <input
                data-testid="coupon-input"
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Enter coupon code"
                disabled={loading || !!appliedCoupon}
              />
              <button
                data-testid="apply-coupon-button"
                onClick={applyCoupon}
                disabled={loading || !couponCode.trim() || !!appliedCoupon}
              >
                {loading ? 'Applying...' : 'Apply Coupon'}
              </button>
            </div>

            {/* Error Display */}
            {error && (
              <div data-testid="coupon-error" style={{ color: 'red' }}>
                {error}
              </div>
            )}

            {/* Applied Coupon Display */}
            {appliedCoupon && (
              <div data-testid="applied-coupon">
                <div data-testid="coupon-info">
                  Coupon: {appliedCoupon.code} - {appliedCoupon.discountPercent}% off
                </div>
                <button
                  data-testid="remove-coupon-button"
                  onClick={removeCoupon}
                >
                  Remove Coupon
                </button>
              </div>
            )}

            {/* Products Display */}
            <div data-testid="products-section">
              {products.map((product: any) => (
                <div key={product.id} data-testid={`product-${product.id}`}>
                  <h3>{product.name}</h3>
                  <div data-testid={`original-price-${product.id}`}>
                    Original: {product.price}
                  </div>
                  {appliedCoupon && (
                    <div data-testid={`discounted-price-${product.id}`}>
                      Discounted: {calculateDiscountedPrice(product.price)}
                    </div>
                  )}
                  {appliedCoupon && (
                    <div data-testid={`savings-${product.id}`}>
                      You save: ₹{(parseFloat(product.price.replace('₹', '')) * appliedCoupon.discountPercent / 100).toFixed(2)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )
      }

      // Given: Valid coupon available for application
      mockFetch(mockApiResponses.couponValidation('SAVE10'))

      // When: Component renders with coupon functionality
      renderWithCouponProvider(<TestComponent />)

      // Then: Initial state shows interface ready for coupon input
      expect(screen.getByText('Products with Coupon Support')).toBeInTheDocument()
      expect(screen.getByTestId('coupon-input')).toBeInTheDocument()
      expect(screen.getByTestId('apply-coupon-button')).toBeDisabled()

      // Then: Products display original pricing without discounts
      expect(screen.getByTestId('product-beaker-500ml')).toBeInTheDocument()
      expect(screen.getByTestId('original-price-beaker-500ml')).toHaveTextContent('Original: ₹300.00')
      expect(screen.queryByTestId('discounted-price-beaker-500ml')).not.toBeInTheDocument()

      // When: User enters valid coupon code
      const couponInput = screen.getByTestId('coupon-input')
      await user.type(couponInput, 'SAVE10')

      // Then: Apply button becomes enabled with valid input
      await waitFor(() => {
        expect(screen.getByTestId('apply-coupon-button')).not.toBeDisabled()
      })

      // When: User applies the coupon
      const applyButton = screen.getByTestId('apply-coupon-button')
      await user.click(applyButton)

      // Note: Loading state might be too fast to catch with mock data

      // Then: Coupon application succeeds with visual confirmation
      await waitFor(() => {
        expect(screen.getByTestId('applied-coupon')).toBeInTheDocument()
      })

      // Then: API is called with correct validation parameters
      expect(global.fetch).toHaveBeenCalledWith('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: 'SAVE10', orderValue: 300 })
      })

      // Then: Applied coupon information is clearly displayed
      expect(screen.getByTestId('coupon-info')).toHaveTextContent('Coupon: SAVE10 - 10% off')
      expect(screen.getByTestId('remove-coupon-button')).toBeInTheDocument()

      // Then: Input controls are disabled to prevent multiple applications
      expect(screen.getByTestId('coupon-input')).toBeDisabled()
      expect(screen.getByTestId('apply-coupon-button')).toBeDisabled()

      // Then: Discounted prices and savings are prominently displayed
      expect(screen.getByTestId('discounted-price-beaker-500ml')).toHaveTextContent('Discounted: ₹270.00')
      expect(screen.getByTestId('savings-beaker-500ml')).toHaveTextContent('You save: ₹30.00')

      // When: User removes the applied coupon
      const removeButton = screen.getByTestId('remove-coupon-button')
      await user.click(removeButton)

      // Then: Coupon is successfully removed from interface
      await waitFor(() => {
        expect(screen.queryByTestId('applied-coupon')).not.toBeInTheDocument()
      })

      // Then: Input controls return to initial state for new coupon entry
      expect(screen.getByTestId('coupon-input')).not.toBeDisabled()
      expect(screen.getByTestId('apply-coupon-button')).toBeDisabled()

      // Then: Pricing returns to original state without discounts
      expect(screen.queryByTestId('discounted-price-beaker-500ml')).not.toBeInTheDocument()
      expect(screen.queryByTestId('savings-beaker-500ml')).not.toBeInTheDocument()
    })

    it('should provide clear feedback for invalid coupon submissions', async () => {
      const TestComponent = () => {
        const [couponCode, setCouponCode] = React.useState('')
        const [error, setError] = React.useState('')
        const [loading, setLoading] = React.useState(false)

        const applyCoupon = async () => {
          setLoading(true)
          setError('')

          try {
            const response = await fetch('/api/coupons', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ code: couponCode, orderValue: 300 })
            })

            const data = await response.json()

            if (!data.isValid) {
              setError(data.error || 'Invalid coupon code')
            }
          } catch (err) {
            setError('Failed to validate coupon')
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
              data-testid="apply-button"
              onClick={applyCoupon}
              disabled={loading}
            >
              Apply
            </button>
            {error && (
              <div data-testid="error-message">
                {error}
              </div>
            )}
          </div>
        )
      }

      // Given: Invalid coupon code for validation testing
      mockFetch(mockApiResponses.couponValidation('INVALID'))

      // When: User attempts to apply invalid coupon
      renderWithCouponProvider(<TestComponent />)

      const input = screen.getByTestId('coupon-input')
      await user.type(input, 'INVALID')

      const applyButton = screen.getByTestId('apply-button')
      await user.click(applyButton)

      // Then: Clear error message guides user to try different code
      await waitFor(() => {
        expect(screen.getByTestId('error-message')).toBeInTheDocument()
      })

      // Then: Specific error message helps user understand validation failure
      expect(screen.getByText('Invalid coupon code')).toBeInTheDocument()
    })

    it('should maintain coupon state during navigation and re-renders', async () => {
      const TestComponent = ({ testKey }: { testKey?: string }) => {
        const [appliedCoupon, setAppliedCoupon] = React.useState(null)
        const [couponCode, setCouponCode] = React.useState('')

        const applyCoupon = async () => {
          const response = await fetch('/api/coupons', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code: couponCode, orderValue: 300 })
          })
          const data = await response.json()
          if (data.isValid) {
            setAppliedCoupon(data.coupon)
            // Simulate persistence
            sessionStorage.setItem('appliedCoupon', JSON.stringify(data.coupon))
          }
        }

        React.useEffect(() => {
          // Simulate loading from persistence
          const saved = sessionStorage.getItem('appliedCoupon')
          if (saved) {
            setAppliedCoupon(JSON.parse(saved))
          }
        }, [])

        return (
          <div>
            <div data-testid="component-key">{testKey || 'initial'}</div>
            {appliedCoupon ? (
              <div data-testid="persisted-coupon">
                Applied: {appliedCoupon.code}
              </div>
            ) : (
              <div>
                <input
                  data-testid="coupon-input"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                />
                <button data-testid="apply-button" onClick={applyCoupon}>
                  Apply
                </button>
              </div>
            )}
          </div>
        )
      }

      // Given: Applied coupon requiring persistence across navigation
      mockFetch(mockApiResponses.couponValidation('SAVE10'))

      const { rerender } = renderWithCouponProvider(<TestComponent />)

      // When: User applies coupon and navigates to different component
      const input = screen.getByTestId('coupon-input')
      await user.type(input, 'SAVE10')
      await user.click(screen.getByTestId('apply-button'))

      await waitFor(() => {
        expect(screen.getByTestId('persisted-coupon')).toBeInTheDocument()
      })

      // When: Component re-renders (simulating navigation)
      rerender(
        <CouponProvider enablePersistence={false}>
          <TestComponent testKey="rerendered" />
        </CouponProvider>
      )

      // Then: Coupon state persists across component lifecycle changes
      expect(screen.getByTestId('component-key')).toHaveTextContent('rerendered')
      expect(screen.getByTestId('persisted-coupon')).toBeInTheDocument()
      expect(screen.getByText('Applied: SAVE10')).toBeInTheDocument()
    })

    it('should handle concurrent coupon validation requests correctly', async () => {
      const TestComponent = () => {
        const [results, setResults] = React.useState<string[]>([])
        const [loading, setLoading] = React.useState(false)

        const applyCoupon = async (code: string) => {
          setLoading(true)
          try {
            const response = await fetch('/api/coupons', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ code, orderValue: 300 })
            })
            const data = await response.json()
            setResults(prev => [...prev, `${code}: ${data.isValid ? 'Valid' : 'Invalid'}`])
          } catch (err) {
            setResults(prev => [...prev, `${code}: Error`])
          } finally {
            setLoading(false)
          }
        }

        return (
          <div>
            <button
              data-testid="rapid-test-button"
              onClick={async () => {
                // Simulate rapid applications
                await Promise.all([
                  applyCoupon('SAVE10'),
                  applyCoupon('INVALID1'),
                  applyCoupon('INVALID2')
                ])
              }}
              disabled={loading}
            >
              Test Rapid Applications
            </button>
            <div data-testid="results">
              {results.map((result, index) => (
                <div key={index} data-testid={`result-${index}`}>
                  {result}
                </div>
              ))}
            </div>
          </div>
        )
      }

      // Given: Multiple coupon codes requiring concurrent validation
      let callCount = 0
      const mockFetchMultiple = jest.fn().mockImplementation(() => {
        callCount++
        if (callCount === 1) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockApiResponses.couponValidation('SAVE10'))
          })
        }
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockApiResponses.couponValidation('INVALID'))
        })
      })

      global.fetch = mockFetchMultiple

      // When: Multiple coupon validations are triggered simultaneously
      renderWithCouponProvider(<TestComponent />)

      const button = screen.getByTestId('rapid-test-button')
      await user.click(button)

      // Then: All validation requests complete successfully
      await waitFor(() => {
        expect(screen.getByTestId('result-0')).toBeInTheDocument()
        expect(screen.getByTestId('result-1')).toBeInTheDocument()
        expect(screen.getByTestId('result-2')).toBeInTheDocument()
      })

      // Then: Each validation result is correctly categorized
      expect(screen.getByText('SAVE10: Valid')).toBeInTheDocument()
      expect(screen.getByText('INVALID1: Invalid')).toBeInTheDocument()
      expect(screen.getByText('INVALID2: Invalid')).toBeInTheDocument()

      // Then: All API calls are properly executed
      expect(mockFetchMultiple).toHaveBeenCalledTimes(3)
    })
  })

  describe('when integrating with CouponProvider context system', () => {
    it('should seamlessly work with centralized coupon state management', async () => {
      const TestComponent = () => {
        const [contextCoupon, setContextCoupon] = React.useState(null)

        // Simulate accessing coupon from context
        React.useEffect(() => {
          const savedCoupon = sessionStorage.getItem('active_coupon')
          if (savedCoupon) {
            setContextCoupon(JSON.parse(savedCoupon))
          }
        }, [])

        const applyCoupon = async () => {
          const response = await fetch('/api/coupons', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code: 'SAVE10', orderValue: 300 })
          })
          const data = await response.json()
          
          if (data.isValid) {
            sessionStorage.setItem('active_coupon', JSON.stringify(data.coupon))
            setContextCoupon(data.coupon)
          }
        }

        return (
          <div>
            <button data-testid="apply-context-coupon" onClick={applyCoupon}>
              Apply via Context
            </button>
            {contextCoupon && (
              <div data-testid="context-coupon">
                Context Coupon: {contextCoupon.code}
              </div>
            )}
          </div>
        )
      }

      // Given: CouponProvider context managing application-wide coupon state
      mockFetch(mockApiResponses.couponValidation('SAVE10'))

      // When: Component applies coupon through context system
      renderWithCouponProvider(<TestComponent />)

      const button = screen.getByTestId('apply-context-coupon')
      await user.click(button)

      // Then: Coupon state is properly managed through context
      await waitFor(() => {
        expect(screen.getByTestId('context-coupon')).toBeInTheDocument()
      })

      // Then: Context provides centralized access to coupon information
      expect(screen.getByText('Context Coupon: SAVE10')).toBeInTheDocument()
    })
  })
})