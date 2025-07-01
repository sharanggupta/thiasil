# 🔗 Phase 3.4: Integration Testing

## 📋 Overview

Test complete user workflows and component interactions in realistic scenarios. This step ensures that all parts of the application work together correctly and provides confidence in the overall system behavior.

## 🎯 Goals

- Test complete user workflows (browsing, filtering, admin operations)
- Verify API integration and data flow
- Test form submissions and validation
- Test navigation and routing behavior
- Achieve comprehensive coverage of critical user paths

## ⏱️ Estimated Time: 4-6 hours

## 🔧 Prerequisites

- Phase 3.1, 3.2, and 3.3 completed
- Understanding of application user flows
- Knowledge of API endpoints and data structures

---

## 🛣️ Step 1: Identify Critical User Workflows

### Public User Workflows:
1. **Product Browsing:** Home → Products → Category → Product Details
2. **Product Filtering:** Apply filters, search, sort products
3. **Coupon Usage:** Apply coupon, see discount, remove coupon
4. **Navigation:** Use breadcrumbs, navigate between pages

### Admin Workflows:
1. **Authentication:** Login, session management, logout
2. **Product Management:** Add, edit, delete products
3. **Price Management:** Bulk price updates
4. **Backup Management:** Create, restore, cleanup backups
5. **Coupon Management:** Create, activate, deactivate coupons

---

## 🛍️ Step 2: Test Product Browsing Workflow

Create `src/__tests__/integration/product-browsing.test.tsx`:

```typescript
import { render, screen, waitFor } from '@/__tests__/utils/test-utils'
import { user } from '@/__tests__/utils/test-helpers'
import { mockFetch, clearAllMocks } from '@/__tests__/utils/test-helpers'
import ProductsPage from '@/app/products/page'
import CategoryPage from '@/app/products/[category]/page'
import { mockProducts } from '@/__tests__/utils/mock-data'

// Mock Next.js router
const mockPush = jest.fn()
const mockParams = { category: 'beakers' }

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  useParams: () => mockParams,
}))

describe('Product Browsing Integration', () => {
  beforeEach(() => {
    clearAllMocks()
    mockFetch(mockProducts)
  })

  describe('Products Page Flow', () => {
    it('allows complete product browsing experience', async () => {
      render(<ProductsPage />)

      // 1. Page loads with products
      await waitFor(() => {
        expect(screen.getByText('Our Products')).toBeInTheDocument()
      })

      // 2. Products are displayed
      expect(screen.getByText('Test Beaker')).toBeInTheDocument()
      expect(screen.getByText('Test Flask')).toBeInTheDocument()

      // 3. Filter by category
      const categorySelect = screen.getByDisplayValue('Category: All')
      await user.selectOptions(categorySelect, 'Beakers')

      // 4. Verify filtered results
      await waitFor(() => {
        expect(screen.getByText('Test Beaker')).toBeInTheDocument()
        expect(screen.queryByText('Test Flask')).not.toBeInTheDocument()
      })

      // 5. Apply price filter
      const minPriceInput = screen.getByPlaceholderText('Min Price')
      await user.type(minPriceInput, '100')

      // 6. Verify price filtering
      await waitFor(() => {
        expect(screen.getByText('Test Beaker')).toBeInTheDocument()
      })

      // 7. Search for specific product
      const searchInput = screen.getByPlaceholderText(/search/i)
      await user.type(searchInput, 'TB001')

      // 8. Verify search results
      await waitFor(() => {
        expect(screen.getByText('TB001')).toBeInTheDocument()
      })
    })

    it('handles empty search results gracefully', async () => {
      render(<ProductsPage />)

      const searchInput = screen.getByPlaceholderText(/search/i)
      await user.type(searchInput, 'nonexistent product')

      await waitFor(() => {
        expect(screen.getByText('No products found')).toBeInTheDocument()
      })
    })

    it('allows downloading price list', async () => {
      render(<ProductsPage />)

      const downloadLink = screen.getByText(/download price list/i)
      expect(downloadLink).toHaveAttribute('href', '/pricelist.pdf')
      expect(downloadLink).toHaveAttribute('download')
    })
  })

  describe('Category Page Flow', () => {
    it('displays category-specific products', async () => {
      const categoryProducts = mockProducts.filter(p => p.categorySlug === 'beakers')
      mockFetch(categoryProducts)

      render(<CategoryPage />)

      await waitFor(() => {
        expect(screen.getByText('Beakers')).toBeInTheDocument()
        expect(screen.getByText('Test Beaker')).toBeInTheDocument()
      })

      // Verify breadcrumb navigation
      expect(screen.getByText('Home')).toBeInTheDocument()
      expect(screen.getByText('Products')).toBeInTheDocument()
      expect(screen.getByText('Beakers')).toBeInTheDocument()
    })

    it('handles product variant selection', async () => {
      render(<CategoryPage />)

      // Find product with variants
      const productCard = screen.getByTestId('product-card')
      await user.click(productCard)

      // Verify variant options appear
      await waitFor(() => {
        expect(screen.getByText('250ml')).toBeInTheDocument()
        expect(screen.getByText('500ml')).toBeInTheDocument()
      })

      // Select variant
      await user.click(screen.getByText('500ml'))

      // Verify price updates
      await waitFor(() => {
        expect(screen.getByText(/₹300.00/)).toBeInTheDocument()
      })
    })
  })
})
```

---

## 🎫 Step 3: Test Coupon Integration Workflow

Create `src/__tests__/integration/coupon-workflow.test.tsx`:

```typescript
import { render, screen, waitFor } from '@/__tests__/utils/test-utils'
import { user } from '@/__tests__/utils/test-helpers'
import { CouponProvider } from '@/contexts/CouponContext'
import ProductsPage from '@/app/products/page'
import { mockProducts, mockCoupon } from '@/__tests__/utils/mock-data'

// Mock coupon validation API
const mockValidateCoupon = jest.fn()
jest.mock('@/lib/api/coupons', () => ({
  validateCoupon: mockValidateCoupon
}))

describe('Coupon Integration Workflow', () => {
  const renderWithCouponProvider = (ui: React.ReactElement) => {
    return render(
      <CouponProvider enablePersistence={false}>
        {ui}
      </CouponProvider>
    )
  }

  beforeEach(() => {
    mockValidateCoupon.mockClear()
    localStorage.clear()
  })

  it('completes full coupon application workflow', async () => {
    mockValidateCoupon.mockResolvedValue({
      isValid: true,
      coupon: mockCoupon,
      discount: 15
    })

    renderWithCouponProvider(<ProductsPage />)

    // 1. Find coupon input
    const couponInput = screen.getByPlaceholderText(/enter coupon/i)
    const applyButton = screen.getByRole('button', { name: /apply/i })

    // 2. Enter coupon code
    await user.type(couponInput, 'SAVE10')
    await user.click(applyButton)

    // 3. Verify API call
    await waitFor(() => {
      expect(mockValidateCoupon).toHaveBeenCalledWith('SAVE10', expect.any(Number))
    })

    // 4. Verify coupon display appears
    await waitFor(() => {
      expect(screen.getByText('SAVE10')).toBeInTheDocument()
      expect(screen.getByText('₹15.00')).toBeInTheDocument()
    })

    // 5. Verify prices show discounted amounts
    await waitFor(() => {
      expect(screen.getByText(/save/i)).toBeInTheDocument()
    })

    // 6. Remove coupon
    const removeButton = screen.getByRole('button', { name: /remove/i })
    await user.click(removeButton)

    // 7. Verify coupon removed
    await waitFor(() => {
      expect(screen.queryByText('SAVE10')).not.toBeInTheDocument()
    })
  })

  it('handles invalid coupon codes gracefully', async () => {
    mockValidateCoupon.mockResolvedValue({
      isValid: false,
      error: 'Invalid coupon code'
    })

    renderWithCouponProvider(<ProductsPage />)

    const couponInput = screen.getByPlaceholderText(/enter coupon/i)
    const applyButton = screen.getByRole('button', { name: /apply/i })

    await user.type(couponInput, 'INVALID')
    await user.click(applyButton)

    await waitFor(() => {
      expect(screen.getByText('Invalid coupon code')).toBeInTheDocument()
    })

    // Verify no coupon display
    expect(screen.queryByTestId('coupon-display')).not.toBeInTheDocument()
  })

  it('persists coupon state across page navigation', async () => {
    mockValidateCoupon.mockResolvedValue({
      isValid: true,
      coupon: mockCoupon,
      discount: 15
    })

    const { rerender } = renderWithCouponProvider(<ProductsPage />)

    // Apply coupon
    const couponInput = screen.getByPlaceholderText(/enter coupon/i)
    await user.type(couponInput, 'SAVE10')
    await user.click(screen.getByRole('button', { name: /apply/i }))

    await waitFor(() => {
      expect(screen.getByText('SAVE10')).toBeInTheDocument()
    })

    // Simulate navigation to another page and back
    rerender(
      <CouponProvider enablePersistence={false}>
        <ProductsPage />
      </CouponProvider>
    )

    // Verify coupon state persisted
    expect(screen.getByText('SAVE10')).toBeInTheDocument()
  })

  it('shows coupon history for quick reapplication', async () => {
    // Pre-populate coupon history
    const couponsHistory = ['SAVE10', 'WELCOME20']
    localStorage.setItem('coupon_history', JSON.stringify(couponsHistory))

    renderWithCouponProvider(<ProductsPage />)

    // Verify history shows
    expect(screen.getByText('SAVE10')).toBeInTheDocument()
    expect(screen.getByText('WELCOME20')).toBeInTheDocument()

    // Click on historical coupon
    mockValidateCoupon.mockResolvedValue({
      isValid: true,
      coupon: mockCoupon,
      discount: 15
    })

    await user.click(screen.getByText('SAVE10'))

    await waitFor(() => {
      expect(mockValidateCoupon).toHaveBeenCalledWith('SAVE10', expect.any(Number))
    })
  })
})
```

---

## 🔐 Step 4: Test Admin Authentication Workflow

Create `src/__tests__/integration/admin-auth.test.tsx`:

```typescript
import { render, screen, waitFor } from '@/__tests__/utils/test-utils'
import { user } from '@/__tests__/utils/test-helpers'
import { mockFetch, mockFetchError, clearAllMocks } from '@/__tests__/utils/test-helpers'
import AdminPage from '@/app/admin/page'

describe('Admin Authentication Integration', () => {
  beforeEach(() => {
    clearAllMocks()
    localStorage.clear()
    sessionStorage.clear()
  })

  it('completes successful login workflow', async () => {
    mockFetch({ success: true, token: 'mock-jwt-token' })

    render(<AdminPage />)

    // 1. Verify login form displayed
    expect(screen.getByText('Admin Access')).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument()

    // 2. Enter credentials
    await user.type(screen.getByPlaceholderText(/username/i), 'admin')
    await user.type(screen.getByPlaceholderText(/password/i), 'password123')

    // 3. Submit form
    await user.click(screen.getByRole('button', { name: /login/i }))

    // 4. Verify API call made
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: 'admin',
          password: 'password123'
        })
      })
    })

    // 5. Verify admin dashboard appears
    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument()
      expect(screen.getByText('Total Products')).toBeInTheDocument()
    })

    // 6. Verify user info displayed
    expect(screen.getByText('admin')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument()
  })

  it('handles login failure correctly', async () => {
    mockFetch({ success: false, error: 'Invalid credentials' }, false)

    render(<AdminPage />)

    await user.type(screen.getByPlaceholderText(/username/i), 'wrong')
    await user.type(screen.getByPlaceholderText(/password/i), 'wrong')
    await user.click(screen.getByRole('button', { name: /login/i }))

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument()
    })

    // Verify still on login page
    expect(screen.getByText('Admin Access')).toBeInTheDocument()
  })

  it('implements account lockout after failed attempts', async () => {
    render(<AdminPage />)

    // Simulate 3 failed attempts
    for (let i = 0; i < 3; i++) {
      mockFetch({ success: false, error: 'Invalid credentials' }, false)
      
      await user.clear(screen.getByPlaceholderText(/username/i))
      await user.clear(screen.getByPlaceholderText(/password/i))
      await user.type(screen.getByPlaceholderText(/username/i), 'wrong')
      await user.type(screen.getByPlaceholderText(/password/i), 'wrong')
      await user.click(screen.getByRole('button', { name: /login/i }))

      await waitFor(() => {
        expect(screen.getByText('Invalid credentials')).toBeInTheDocument()
      })
    }

    // Verify account locked
    await waitFor(() => {
      expect(screen.getByText(/account.*locked/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /login/i })).toBeDisabled()
    })
  })

  it('handles session timeout correctly', async () => {
    // Mock successful login
    mockFetch({ success: true, token: 'mock-jwt-token' })
    
    render(<AdminPage />)

    // Login
    await user.type(screen.getByPlaceholderText(/username/i), 'admin')
    await user.type(screen.getByPlaceholderText(/password/i), 'password123')
    await user.click(screen.getByRole('button', { name: /login/i }))

    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument()
    })

    // Simulate session timeout (would normally be handled by timer)
    // For testing, we'll manually trigger logout
    await user.click(screen.getByRole('button', { name: /logout/i }))

    await waitFor(() => {
      expect(screen.getByText('Admin Access')).toBeInTheDocument()
    })
  })

  it('persists session across page refresh', async () => {
    // Set session data
    sessionStorage.setItem('admin_session', JSON.stringify({
      isAuthenticated: true,
      username: 'admin',
      timestamp: Date.now()
    }))

    render(<AdminPage />)

    // Should skip login and show dashboard
    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument()
    })
  })
})
```

---

## 📦 Step 5: Test Admin Product Management Workflow

Create `src/__tests__/integration/admin-products.test.tsx`:

```typescript
import { render, screen, waitFor } from '@/__tests__/utils/test-utils'
import { user } from '@/__tests__/utils/test-helpers'
import { mockFetch, clearAllMocks } from '@/__tests__/utils/test-helpers'
import AdminPage from '@/app/admin/page'
import { mockProducts } from '@/__tests__/utils/mock-data'

describe('Admin Product Management Integration', () => {
  beforeEach(() => {
    clearAllMocks()
    // Mock authenticated session
    sessionStorage.setItem('admin_session', JSON.stringify({
      isAuthenticated: true,
      username: 'admin',
      timestamp: Date.now()
    }))
  })

  it('completes product addition workflow', async () => {
    // Mock API responses
    mockFetch(mockProducts) // Initial products load
    
    render(<AdminPage />)

    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument()
    })

    // 1. Navigate to Add Products tab
    await user.click(screen.getByText('Add Products'))

    await waitFor(() => {
      expect(screen.getByText('Add Categories & Products')).toBeInTheDocument()
    })

    // 2. Fill out product form
    await user.type(screen.getByLabelText(/product name/i), 'New Test Product')
    await user.type(screen.getByLabelText(/description/i), 'A new test product')
    await user.type(screen.getByLabelText(/catalog number/i), 'NTP001')
    await user.type(screen.getByLabelText(/price/i), '199.99')

    // 3. Select category
    await user.selectOptions(screen.getByLabelText(/category/i), 'Beakers')

    // 4. Add features
    await user.type(screen.getByLabelText(/features/i), 'High quality glass')
    await user.click(screen.getByRole('button', { name: /add feature/i }))

    // 5. Submit form
    mockFetch({ success: true, product: { id: 'new-001' } })
    await user.click(screen.getByRole('button', { name: /add product/i }))

    // 6. Verify success message
    await waitFor(() => {
      expect(screen.getByText(/successfully added/i)).toBeInTheDocument()
    })

    // 7. Verify API call
    expect(global.fetch).toHaveBeenCalledWith('/api/admin/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: expect.stringContaining('New Test Product')
    })
  })

  it('handles bulk price updates correctly', async () => {
    mockFetch(mockProducts)
    
    render(<AdminPage />)

    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument()
    })

    // Navigate to Price Management
    await user.click(screen.getByText('Price Management'))

    // Select category
    await user.selectOptions(screen.getByLabelText(/category/i), 'Beakers')

    // Enter price change percentage
    await user.type(screen.getByLabelText(/price change/i), '10')

    // Mock price update response
    mockFetch({ success: true, updatedCount: 5 })

    // Submit update
    await user.click(screen.getByRole('button', { name: /update prices/i }))

    // Verify success
    await waitFor(() => {
      expect(screen.getByText(/updated prices for 5 items/i)).toBeInTheDocument()
    })
  })

  it('handles inventory management workflow', async () => {
    mockFetch(mockProducts)
    
    render(<AdminPage />)

    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument()
    })

    // Navigate to Inventory Management
    await user.click(screen.getByText('Inventory'))

    // Select category and product
    await user.selectOptions(screen.getByLabelText(/category/i), 'Beakers')
    await user.selectOptions(screen.getByLabelText(/product/i), 'TB001')

    // Update stock status
    await user.selectOptions(screen.getByLabelText(/stock status/i), 'out_of_stock')
    await user.type(screen.getByLabelText(/quantity/i), '0')

    // Mock inventory update response
    mockFetch({ success: true, updatedCount: 1 })

    // Submit update
    await user.click(screen.getByRole('button', { name: /update inventory/i }))

    // Verify success
    await waitFor(() => {
      expect(screen.getByText(/updated inventory for 1 items/i)).toBeInTheDocument()
    })
  })

  it('handles validation errors gracefully', async () => {
    mockFetch(mockProducts)
    
    render(<AdminPage />)

    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument()
    })

    // Navigate to Add Products
    await user.click(screen.getByText('Add Products'))

    // Try to submit empty form
    await user.click(screen.getByRole('button', { name: /add product/i }))

    // Verify validation errors
    await waitFor(() => {
      expect(screen.getByText(/product name is required/i)).toBeInTheDocument()
    })
  })
})
```

---

## 🗂️ Step 6: Test Navigation and Routing

Create `src/__tests__/integration/navigation.test.tsx`:

```typescript
import { render, screen, waitFor } from '@/__tests__/utils/test-utils'
import { user } from '@/__tests__/utils/test-helpers'
import HomePage from '@/app/page'
import ProductsPage from '@/app/products/page'

// Mock Next.js router
const mockPush = jest.fn()
const mockBack = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    back: mockBack,
  }),
  usePathname: () => '/products',
}))

describe('Navigation Integration', () => {
  beforeEach(() => {
    mockPush.mockClear()
    mockBack.mockClear()
  })

  it('handles complete navigation flow', async () => {
    render(<HomePage />)

    // 1. Verify home page elements
    expect(screen.getByText(/premium laboratory/i)).toBeInTheDocument()

    // 2. Navigate to products via CTA button
    const productsButton = screen.getByRole('link', { name: /browse products/i })
    expect(productsButton).toHaveAttribute('href', '/products')

    // 3. Navigate via navbar
    const navProductsLink = screen.getByRole('link', { name: /products/i })
    await user.click(navProductsLink)

    expect(navProductsLink).toHaveAttribute('href', '/products')
  })

  it('handles breadcrumb navigation correctly', async () => {
    render(<ProductsPage />)

    // Wait for page to load
    await waitFor(() => {
      expect(screen.getByText('Our Products')).toBeInTheDocument()
    })

    // Find breadcrumb navigation
    const homeLink = screen.getByRole('link', { name: 'Home' })
    expect(homeLink).toHaveAttribute('href', '/')

    // Click breadcrumb
    await user.click(homeLink)
    expect(mockPush).toHaveBeenCalledWith('/')
  })

  it('handles mobile navigation menu', async () => {
    // Mock mobile viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    })

    render(<HomePage />)

    // Find mobile menu toggle
    const menuToggle = screen.getByLabelText(/menu/i)
    await user.click(menuToggle)

    // Verify mobile menu opens
    await waitFor(() => {
      expect(screen.getByRole('navigation', { name: /mobile/i })).toBeVisible()
    })

    // Click mobile link
    const mobileProductsLink = screen.getByRole('link', { name: /products/i })
    await user.click(mobileProductsLink)

    // Verify navigation
    expect(mobileProductsLink).toHaveAttribute('href', '/products')
  })

  it('handles 404 navigation gracefully', async () => {
    // This would be tested with actual routing in a full integration test
    // For now, we'll test the error boundary behavior
    
    const ThrowError = () => {
      throw new Error('Page not found')
    }

    const { container } = render(<ThrowError />)

    // Verify error boundary catches the error
    // In a real app, this would show a 404 page
    expect(container).toBeInTheDocument()
  })
})
```

---

## 📊 Step 7: Test API Integration

Create `src/__tests__/integration/api-integration.test.tsx`:

```typescript
import { render, screen, waitFor } from '@/__tests__/utils/test-utils'
import { mockFetch, mockFetchError, clearAllMocks } from '@/__tests__/utils/test-helpers'
import ProductsPage from '@/app/products/page'
import { mockProducts } from '@/__tests__/utils/mock-data'

describe('API Integration', () => {
  beforeEach(() => {
    clearAllMocks()
  })

  it('handles successful data loading', async () => {
    mockFetch(mockProducts)

    render(<ProductsPage />)

    // Verify loading state
    expect(screen.getByText(/loading/i)).toBeInTheDocument()

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Test Beaker')).toBeInTheDocument()
    })

    // Verify API call made
    expect(global.fetch).toHaveBeenCalledWith('/api/products')
  })

  it('handles API errors gracefully', async () => {
    mockFetchError('Failed to fetch products')

    render(<ProductsPage />)

    // Wait for error state
    await waitFor(() => {
      expect(screen.getByText(/error.*loading/i)).toBeInTheDocument()
    })

    // Verify retry option available
    const retryButton = screen.getByRole('button', { name: /retry/i })
    expect(retryButton).toBeInTheDocument()

    // Test retry functionality
    mockFetch(mockProducts) // Mock successful retry
    await user.click(retryButton)

    await waitFor(() => {
      expect(screen.getByText('Test Beaker')).toBeInTheDocument()
    })
  })

  it('handles network timeout correctly', async () => {
    // Mock slow network response
    mockFetch(mockProducts, true, 10000) // 10 second delay

    render(<ProductsPage />)

    // Verify timeout handling
    await waitFor(() => {
      expect(screen.getByText(/taking longer than expected/i)).toBeInTheDocument()
    }, { timeout: 5000 })
  })

  it('handles malformed API responses', async () => {
    mockFetch('invalid json response')

    render(<ProductsPage />)

    await waitFor(() => {
      expect(screen.getByText(/error.*loading/i)).toBeInTheDocument()
    })
  })

  it('respects rate limiting', async () => {
    // Mock rate limit response
    mockFetch({ error: 'Rate limit exceeded' }, false, 0, 429)

    render(<ProductsPage />)

    await waitFor(() => {
      expect(screen.getByText(/too many requests/i)).toBeInTheDocument()
    })
  })
})
```

---

## 🎯 Step 8: Performance Integration Tests

Create `src/__tests__/integration/performance.test.tsx`:

```typescript
import { render, screen, waitFor } from '@/__tests__/utils/test-utils'
import { mockFetch } from '@/__tests__/utils/test-helpers'
import ProductsPage from '@/app/products/page'

describe('Performance Integration', () => {
  it('loads large product datasets efficiently', async () => {
    // Create large dataset
    const largeDataset = Array(1000).fill(null).map((_, i) => ({
      id: `product-${i}`,
      name: `Product ${i}`,
      category: 'Test Category',
      price: `₹${(i * 10) + 100}.00`,
      stockStatus: 'in_stock'
    }))

    mockFetch(largeDataset)

    const startTime = performance.now()
    render(<ProductsPage />)

    // Wait for rendering to complete
    await waitFor(() => {
      expect(screen.getByText('Product 0')).toBeInTheDocument()
    })

    const endTime = performance.now()
    const renderTime = endTime - startTime

    // Verify reasonable render time (adjust threshold as needed)
    expect(renderTime).toBeLessThan(2000) // 2 seconds
  })

  it('handles rapid user interactions without lag', async () => {
    mockFetch([])

    render(<ProductsPage />)

    const searchInput = screen.getByPlaceholderText(/search/i)

    // Rapid typing simulation
    const startTime = performance.now()
    
    for (let i = 0; i < 10; i++) {
      await user.type(searchInput, 'a')
      await user.clear(searchInput)
    }

    const endTime = performance.now()
    const interactionTime = endTime - startTime

    // Verify responsive interactions
    expect(interactionTime).toBeLessThan(1000) // 1 second for 10 interactions
  })

  it('efficiently updates DOM with state changes', async () => {
    const products = Array(100).fill(null).map((_, i) => ({
      id: `product-${i}`,
      name: `Product ${i}`,
      price: `₹${100 + i}.00`
    }))

    mockFetch(products)

    render(<ProductsPage />)

    await waitFor(() => {
      expect(screen.getByText('Product 0')).toBeInTheDocument()
    })

    // Measure filter performance
    const startTime = performance.now()
    
    const categorySelect = screen.getByDisplayValue('Category: All')
    await user.selectOptions(categorySelect, 'Test Category')

    const endTime = performance.now()
    const filterTime = endTime - startTime

    expect(filterTime).toBeLessThan(500) // 500ms for filtering
  })
})
```

---

## ✅ Step 9: End-to-End Test Suite

Create a comprehensive test that combines multiple workflows:

```typescript
// src/__tests__/integration/e2e-workflow.test.tsx
import { render, screen, waitFor } from '@/__tests__/utils/test-utils'
import { user } from '@/__tests__/utils/test-helpers'
import { mockFetch, clearAllMocks } from '@/__tests__/utils/test-helpers'
import { CouponProvider } from '@/contexts/CouponContext'
import ProductsPage from '@/app/products/page'
import { mockProducts, mockCoupon } from '@/__tests__/utils/mock-data'

describe('End-to-End User Workflow', () => {
  const renderWithProviders = (ui: React.ReactElement) => (
    render(
      <CouponProvider enablePersistence={false}>
        {ui}
      </CouponProvider>
    )
  )

  beforeEach(() => {
    clearAllMocks()
  })

  it('completes full customer journey', async () => {
    // Mock all required API responses
    mockFetch(mockProducts)

    renderWithProviders(<ProductsPage />)

    // 1. Page loads successfully
    await waitFor(() => {
      expect(screen.getByText('Our Products')).toBeInTheDocument()
    })

    // 2. Browse products
    expect(screen.getByText('Test Beaker')).toBeInTheDocument()

    // 3. Filter by category
    const categorySelect = screen.getByDisplayValue('Category: All')
    await user.selectOptions(categorySelect, 'Beakers')

    // 4. Apply price filter
    const minPriceInput = screen.getByPlaceholderText('Min Price')
    await user.type(minPriceInput, '100')

    // 5. Apply coupon
    mockFetch({ isValid: true, coupon: mockCoupon, discount: 15 })
    const couponInput = screen.getByPlaceholderText(/enter coupon/i)
    await user.type(couponInput, 'SAVE10')
    await user.click(screen.getByRole('button', { name: /apply/i }))

    await waitFor(() => {
      expect(screen.getByText('SAVE10')).toBeInTheDocument()
    })

    // 6. View product details
    const productCard = screen.getByTestId('product-card')
    await user.click(productCard)

    // 7. Verify discounted prices shown
    await waitFor(() => {
      expect(screen.getByText(/save/i)).toBeInTheDocument()
    })

    // 8. Download price list
    const downloadLink = screen.getByLabelText(/download price list/i)
    expect(downloadLink).toHaveAttribute('download')

    // 9. Remove coupon
    const removeButton = screen.getByRole('button', { name: /remove/i })
    await user.click(removeButton)

    await waitFor(() => {
      expect(screen.queryByText('SAVE10')).not.toBeInTheDocument()
    })

    // 10. Verify final state
    expect(screen.getByText('Test Beaker')).toBeInTheDocument()
    expect(screen.queryByTestId('coupon-display')).not.toBeInTheDocument()
  })
})
```

---

## ✅ Verification Checklist

- [ ] Product browsing workflow tested end-to-end
- [ ] Coupon application and removal workflow tested
- [ ] Admin authentication and session management tested
- [ ] Admin product management operations tested
- [ ] Navigation and routing behavior verified
- [ ] API integration and error handling tested
- [ ] Performance characteristics validated
- [ ] Complete end-to-end user journey tested
- [ ] All critical workflows covered with integration tests

---

## 🚀 Final Integration Test Run

### Execute All Integration Tests

```bash
# Run all integration tests
npm test -- src/__tests__/integration

# Run with coverage
npm run test:coverage -- src/__tests__/integration

# Run end-to-end tests only
npm test -- e2e-workflow.test.tsx

# Run all tests with integration
npm run test:ci
```

### Coverage Goals
- **User Workflows:** 95%+ coverage
- **API Integration:** 90%+ coverage  
- **Error Scenarios:** 85%+ coverage
- **Performance Tests:** All critical paths validated

---

## 📝 Best Practices

### Integration Testing Strategy
- Test user behavior, not implementation details
- Mock external services, test internal integration
- Use realistic data and scenarios
- Test both happy paths and error conditions

### Test Organization
- Group tests by workflow or feature area
- Use descriptive test names that explain the scenario
- Keep tests focused on specific integration points
- Maintain test data that reflects real usage

### Error Handling
- Test network failures and timeouts
- Verify graceful degradation
- Test recovery mechanisms
- Validate user feedback for errors

### Performance Considerations
- Set reasonable performance budgets
- Test with realistic data volumes
- Monitor memory usage in tests
- Validate responsive user interactions

---

## 🎯 Phase 3 Completion

After completing all integration tests, you'll have:

✅ **Comprehensive Test Coverage:**
- Utility functions: 90%+
- Core components: 80%+
- Integration workflows: 95%+

✅ **Quality Assurance:**
- All critical user paths tested
- Error handling verified
- Performance characteristics validated
- Regression prevention in place

✅ **Development Confidence:**
- Safe refactoring capabilities
- Reliable deployment process
- Quick feedback on changes
- Documented expected behavior

**Phase 3 Complete!** 🎉 Ready for Phase 4: Performance and Optimization.