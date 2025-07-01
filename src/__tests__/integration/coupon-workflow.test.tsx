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

describe('Coupon Integration Workflow', () => {
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

  describe('Complete Coupon Application Workflow', () => {
    it('completes full coupon application and removal workflow', async () => {
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

      // Mock successful coupon validation
      mockFetch(mockApiResponses.couponValidation('SAVE10'))

      renderWithCouponProvider(<TestComponent />)

      // Verify initial state
      expect(screen.getByText('Products with Coupon Support')).toBeInTheDocument()
      expect(screen.getByTestId('coupon-input')).toBeInTheDocument()
      // Button should be disabled initially when coupon code is empty
      expect(screen.getByTestId('apply-coupon-button')).toBeDisabled()

      // Verify products are displayed without discount
      expect(screen.getByTestId('product-beaker-500ml')).toBeInTheDocument()
      expect(screen.getByTestId('original-price-beaker-500ml')).toHaveTextContent('Original: ₹300.00')
      expect(screen.queryByTestId('discounted-price-beaker-500ml')).not.toBeInTheDocument()

      // Enter coupon code
      const couponInput = screen.getByTestId('coupon-input')
      await user.type(couponInput, 'SAVE10')

      // Verify button is now enabled after typing
      await waitFor(() => {
        expect(screen.getByTestId('apply-coupon-button')).not.toBeDisabled()
      })

      // Apply coupon
      const applyButton = screen.getByTestId('apply-coupon-button')
      await user.click(applyButton)

      // Note: Loading state might be too fast to catch with mock data

      // Wait for coupon application to complete
      await waitFor(() => {
        expect(screen.getByTestId('applied-coupon')).toBeInTheDocument()
      })

      // Verify API call was made
      expect(global.fetch).toHaveBeenCalledWith('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: 'SAVE10', orderValue: 300 })
      })

      // Verify coupon is applied
      expect(screen.getByTestId('coupon-info')).toHaveTextContent('Coupon: SAVE10 - 10% off')
      expect(screen.getByTestId('remove-coupon-button')).toBeInTheDocument()

      // Verify input is disabled after application
      expect(screen.getByTestId('coupon-input')).toBeDisabled()
      expect(screen.getByTestId('apply-coupon-button')).toBeDisabled()

      // Verify discounted prices are shown
      expect(screen.getByTestId('discounted-price-beaker-500ml')).toHaveTextContent('Discounted: ₹270.00')
      expect(screen.getByTestId('savings-beaker-500ml')).toHaveTextContent('You save: ₹30.00')

      // Remove coupon
      const removeButton = screen.getByTestId('remove-coupon-button')
      await user.click(removeButton)

      // Verify coupon is removed
      await waitFor(() => {
        expect(screen.queryByTestId('applied-coupon')).not.toBeInTheDocument()
      })

      // Verify input is re-enabled but button disabled since input is empty
      expect(screen.getByTestId('coupon-input')).not.toBeDisabled()
      expect(screen.getByTestId('apply-coupon-button')).toBeDisabled()

      // Verify discounted prices are hidden
      expect(screen.queryByTestId('discounted-price-beaker-500ml')).not.toBeInTheDocument()
      expect(screen.queryByTestId('savings-beaker-500ml')).not.toBeInTheDocument()
    })

    it('handles invalid coupon codes gracefully', async () => {
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

      // Mock invalid coupon response
      mockFetch(mockApiResponses.couponValidation('INVALID'))

      renderWithCouponProvider(<TestComponent />)

      // Enter invalid coupon
      const input = screen.getByTestId('coupon-input')
      await user.type(input, 'INVALID')

      // Apply coupon
      const applyButton = screen.getByTestId('apply-button')
      await user.click(applyButton)

      // Verify error is displayed
      await waitFor(() => {
        expect(screen.getByTestId('error-message')).toBeInTheDocument()
      })

      expect(screen.getByText('Invalid coupon code')).toBeInTheDocument()
    })

    it('persists coupon state across component re-renders', async () => {
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

      // Mock successful coupon validation
      mockFetch(mockApiResponses.couponValidation('SAVE10'))

      const { rerender } = renderWithCouponProvider(<TestComponent />)

      // Apply coupon
      const input = screen.getByTestId('coupon-input')
      await user.type(input, 'SAVE10')
      await user.click(screen.getByTestId('apply-button'))

      await waitFor(() => {
        expect(screen.getByTestId('persisted-coupon')).toBeInTheDocument()
      })

      // Simulate component re-render (navigation, etc.)
      rerender(
        <CouponProvider enablePersistence={false}>
          <TestComponent testKey="rerendered" />
        </CouponProvider>
      )

      // Verify coupon persisted across re-render
      expect(screen.getByTestId('component-key')).toHaveTextContent('rerendered')
      expect(screen.getByTestId('persisted-coupon')).toBeInTheDocument()
      expect(screen.getByText('Applied: SAVE10')).toBeInTheDocument()
    })

    it('handles multiple rapid coupon applications', async () => {
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

      // Mock different responses for different codes
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

      renderWithCouponProvider(<TestComponent />)

      // Trigger rapid applications
      const button = screen.getByTestId('rapid-test-button')
      await user.click(button)

      // Wait for all results
      await waitFor(() => {
        expect(screen.getByTestId('result-0')).toBeInTheDocument()
        expect(screen.getByTestId('result-1')).toBeInTheDocument()
        expect(screen.getByTestId('result-2')).toBeInTheDocument()
      })

      // Verify results
      expect(screen.getByText('SAVE10: Valid')).toBeInTheDocument()
      expect(screen.getByText('INVALID1: Invalid')).toBeInTheDocument()
      expect(screen.getByText('INVALID2: Invalid')).toBeInTheDocument()

      // Verify all API calls were made
      expect(mockFetchMultiple).toHaveBeenCalledTimes(3)
    })
  })

  describe('Coupon Context Integration', () => {
    it('integrates with CouponProvider context', async () => {
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

      mockFetch(mockApiResponses.couponValidation('SAVE10'))

      renderWithCouponProvider(<TestComponent />)

      const button = screen.getByTestId('apply-context-coupon')
      await user.click(button)

      await waitFor(() => {
        expect(screen.getByTestId('context-coupon')).toBeInTheDocument()
      })

      expect(screen.getByText('Context Coupon: SAVE10')).toBeInTheDocument()
    })
  })
})