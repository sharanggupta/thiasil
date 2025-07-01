# 🧩 Phase 3.3: Component Testing

## 📋 Overview

Comprehensive testing of core React components, focusing on UI behavior, user interactions, and integration with the application state. This step ensures that all critical components work correctly and maintain their expected behavior.

## 🎯 Goals

- Test core UI components with React Testing Library
- Verify component rendering with different props
- Test user interactions and event handling
- Test component integration with context providers
- Achieve 80%+ coverage for critical components

## ⏱️ Estimated Time: 4-5 hours

## 🔧 Prerequisites

- Phase 3.1 (Test Setup) and 3.2 (Utility Testing) completed
- Understanding of React Testing Library principles
- Knowledge of component props and behavior

---

## 📋 Step 1: Identify Core Components for Testing

### High Priority Components:
- `ProductCard` - Core product display
- `StockStatusBadge` - Stock status indicator
- `Breadcrumb` - Navigation component
- `CouponInput` - Coupon functionality
- `CouponDisplay` - Coupon state display

### Medium Priority Components:
- Glassmorphism components (buttons, cards, inputs)
- Form components
- Loading states
- Navigation components

### Testing Strategy:
1. Start with utility components (badges, buttons)
2. Progress to complex components (ProductCard)
3. Test interactive components (forms, inputs)
4. Test integrated components (with context)

---

## 🏷️ Step 2: Test StockStatusBadge Component

Create `src/app/components/common/__tests__/StockStatusBadge.test.tsx`:

```typescript
import { render, screen } from '@/__tests__/utils/test-utils'
import StockStatusBadge from '../StockStatusBadge'

describe('StockStatusBadge', () => {
  it('renders in-stock status correctly', () => {
    render(<StockStatusBadge status="in_stock" />)
    
    expect(screen.getByText('In Stock')).toBeInTheDocument()
    expect(screen.getByTestId('stock-badge')).toHaveClass('bg-green-500')
  })

  it('renders out-of-stock status correctly', () => {
    render(<StockStatusBadge status="out_of_stock" />)
    
    expect(screen.getByText('Out of Stock')).toBeInTheDocument()
    expect(screen.getByTestId('stock-badge')).toHaveClass('bg-red-500')
  })

  it('renders low-stock status correctly', () => {
    render(<StockStatusBadge status="low_stock" />)
    
    expect(screen.getByText('Low Stock')).toBeInTheDocument()
    expect(screen.getByTestId('stock-badge')).toHaveClass('bg-yellow-500')
  })

  it('applies custom className', () => {
    render(<StockStatusBadge status="in_stock" className="custom-class" />)
    
    expect(screen.getByTestId('stock-badge')).toHaveClass('custom-class')
  })

  it('handles unknown status gracefully', () => {
    render(<StockStatusBadge status="unknown" as any />)
    
    expect(screen.getByText('Unknown')).toBeInTheDocument()
    expect(screen.getByTestId('stock-badge')).toHaveClass('bg-gray-500')
  })

  it('shows quantity when provided', () => {
    render(<StockStatusBadge status="in_stock" quantity={25} />)
    
    expect(screen.getByText('In Stock (25)')).toBeInTheDocument()
  })

  it('shows zero quantity correctly', () => {
    render(<StockStatusBadge status="out_of_stock" quantity={0} />)
    
    expect(screen.getByText('Out of Stock (0)')).toBeInTheDocument()
  })
})
```

---

## 🧩 Step 3: Test Breadcrumb Component

Create `src/app/components/common/__tests__/Breadcrumb.test.tsx`:

```typescript
import { render, screen } from '@/__tests__/utils/test-utils'
import { user } from '@/__tests__/utils/test-helpers'
import Breadcrumb from '../Breadcrumb'

// Mock Next.js router
const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

describe('Breadcrumb', () => {
  const mockItems = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Products' },
    { label: 'Current Page' }
  ]

  beforeEach(() => {
    mockPush.mockClear()
  })

  it('renders all breadcrumb items', () => {
    render(<Breadcrumb items={mockItems} />)
    
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Products')).toBeInTheDocument()
    expect(screen.getByText('Current Page')).toBeInTheDocument()
  })

  it('renders links for items with href', () => {
    render(<Breadcrumb items={mockItems} />)
    
    const homeLink = screen.getByRole('link', { name: 'Home' })
    const productsLink = screen.getByRole('link', { name: 'Products' })
    
    expect(homeLink).toHaveAttribute('href', '/')
    expect(productsLink).toHaveAttribute('href', '/products')
  })

  it('renders last item as plain text (no link)', () => {
    render(<Breadcrumb items={mockItems} />)
    
    expect(screen.getByText('Current Page')).not.toHaveAttribute('href')
  })

  it('handles navigation clicks', async () => {
    render(<Breadcrumb items={mockItems} />)
    
    await user.click(screen.getByText('Home'))
    expect(mockPush).toHaveBeenCalledWith('/')
  })

  it('applies custom className', () => {
    render(<Breadcrumb items={mockItems} className="custom-breadcrumb" />)
    
    expect(screen.getByRole('navigation')).toHaveClass('custom-breadcrumb')
  })

  it('renders separator between items', () => {
    render(<Breadcrumb items={mockItems} />)
    
    const separators = screen.getAllByText('/')
    expect(separators).toHaveLength(2) // Between 3 items = 2 separators
  })

  it('handles empty items array', () => {
    render(<Breadcrumb items={[]} />)
    
    expect(screen.getByRole('navigation')).toBeEmptyDOMElement()
  })

  it('handles single item', () => {
    render(<Breadcrumb items={[{ label: 'Single Item' }]} />)
    
    expect(screen.getByText('Single Item')).toBeInTheDocument()
    expect(screen.queryByText('/')).not.toBeInTheDocument()
  })
})
```

---

## 🎫 Step 4: Test Coupon Components

Create `src/app/components/coupons/__tests__/CouponInput.test.tsx`:

```typescript
import { render, screen, waitFor } from '@/__tests__/utils/test-utils'
import { user } from '@/__tests__/utils/test-helpers'
import CouponInput from '../CouponInput'

// Mock the coupon context
const mockApplyCoupon = jest.fn()
const mockClearCoupon = jest.fn()

jest.mock('@/contexts/CouponContext', () => ({
  useCoupon: () => ({
    applyCoupon: mockApplyCoupon,
    clearCoupon: mockClearCoupon,
    couponHistory: ['SAVE10', 'WELCOME'],
    isLoading: false,
    error: null
  })
}))

describe('CouponInput', () => {
  beforeEach(() => {
    mockApplyCoupon.mockClear()
    mockClearCoupon.mockClear()
  })

  it('renders input field and apply button', () => {
    render(<CouponInput />)
    
    expect(screen.getByPlaceholderText(/enter coupon/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /apply/i })).toBeInTheDocument()
  })

  it('allows typing in the input field', async () => {
    render(<CouponInput />)
    
    const input = screen.getByPlaceholderText(/enter coupon/i)
    await user.type(input, 'SAVE20')
    
    expect(input).toHaveValue('SAVE20')
  })

  it('applies coupon when form is submitted', async () => {
    render(<CouponInput />)
    
    const input = screen.getByPlaceholderText(/enter coupon/i)
    const button = screen.getByRole('button', { name: /apply/i })
    
    await user.type(input, 'SAVE20')
    await user.click(button)
    
    expect(mockApplyCoupon).toHaveBeenCalledWith('SAVE20')
  })

  it('applies coupon when Enter key is pressed', async () => {
    render(<CouponInput />)
    
    const input = screen.getByPlaceholderText(/enter coupon/i)
    
    await user.type(input, 'SAVE20{enter}')
    
    expect(mockApplyCoupon).toHaveBeenCalledWith('SAVE20')
  })

  it('clears input after successful application', async () => {
    render(<CouponInput />)
    
    const input = screen.getByPlaceholderText(/enter coupon/i)
    
    await user.type(input, 'SAVE20')
    await user.click(screen.getByRole('button', { name: /apply/i }))
    
    await waitFor(() => {
      expect(input).toHaveValue('')
    })
  })

  it('shows last used coupons when showLastUsed is true', () => {
    render(<CouponInput showLastUsed={true} />)
    
    expect(screen.getByText('SAVE10')).toBeInTheDocument()
    expect(screen.getByText('WELCOME')).toBeInTheDocument()
  })

  it('applies last used coupon when clicked', async () => {
    render(<CouponInput showLastUsed={true} />)
    
    await user.click(screen.getByText('SAVE10'))
    
    expect(mockApplyCoupon).toHaveBeenCalledWith('SAVE10')
  })

  it('renders in compact mode', () => {
    render(<CouponInput compact={true} />)
    
    const container = screen.getByTestId('coupon-input-container')
    expect(container).toHaveClass('compact')
  })

  it('does not submit empty coupon code', async () => {
    render(<CouponInput />)
    
    const button = screen.getByRole('button', { name: /apply/i })
    await user.click(button)
    
    expect(mockApplyCoupon).not.toHaveBeenCalled()
  })

  it('trims whitespace from coupon code', async () => {
    render(<CouponInput />)
    
    const input = screen.getByPlaceholderText(/enter coupon/i)
    
    await user.type(input, '  SAVE20  ')
    await user.click(screen.getByRole('button', { name: /apply/i }))
    
    expect(mockApplyCoupon).toHaveBeenCalledWith('SAVE20')
  })
})
```

Create `src/app/components/coupons/__tests__/CouponDisplay.test.tsx`:

```typescript
import { render, screen } from '@/__tests__/utils/test-utils'
import { user } from '@/__tests__/utils/test-helpers'
import CouponDisplay from '../CouponDisplay'

const mockClearCoupon = jest.fn()

jest.mock('@/contexts/CouponContext', () => ({
  useCoupon: () => ({
    activeCoupon: {
      code: 'SAVE10',
      discount: 10,
      type: 'percentage',
      description: '10% off your order'
    },
    clearCoupon: mockClearCoupon,
    totalDiscount: 25.50
  })
}))

describe('CouponDisplay', () => {
  beforeEach(() => {
    mockClearCoupon.mockClear()
  })

  it('displays active coupon information', () => {
    render(<CouponDisplay />)
    
    expect(screen.getByText('SAVE10')).toBeInTheDocument()
    expect(screen.getByText('10% off your order')).toBeInTheDocument()
    expect(screen.getByText('₹25.50')).toBeInTheDocument()
  })

  it('shows remove button for active coupon', () => {
    render(<CouponDisplay />)
    
    expect(screen.getByRole('button', { name: /remove/i })).toBeInTheDocument()
  })

  it('removes coupon when remove button is clicked', async () => {
    render(<CouponDisplay />)
    
    await user.click(screen.getByRole('button', { name: /remove/i }))
    
    expect(mockClearCoupon).toHaveBeenCalled()
  })

  it('renders in compact mode', () => {
    render(<CouponDisplay compact={true} />)
    
    const container = screen.getByTestId('coupon-display')
    expect(container).toHaveClass('compact')
  })

  it('shows detailed information when showDetails is true', () => {
    render(<CouponDisplay showDetails={true} />)
    
    expect(screen.getByText(/savings/i)).toBeInTheDocument()
    expect(screen.getByText(/discount applied/i)).toBeInTheDocument()
  })
})

// Test with no active coupon
jest.mock('@/contexts/CouponContext', () => ({
  useCoupon: () => ({
    activeCoupon: null,
    clearCoupon: mockClearCoupon,
    totalDiscount: 0
  })
}))

describe('CouponDisplay - No Active Coupon', () => {
  it('renders nothing when no coupon is active', () => {
    render(<CouponDisplay />)
    
    expect(screen.queryByTestId('coupon-display')).not.toBeInTheDocument()
  })
})
```

---

## 🃏 Step 5: Test ProductCard Component

Create `src/app/components/ui/__tests__/ProductCard.test.tsx`:

```typescript
import { render, screen } from '@/__tests__/utils/test-utils'
import { user } from '@/__tests__/utils/test-helpers'
import ProductCard from '../ProductCard'
import { mockProduct } from '@/__tests__/utils/mock-data'

// Mock Next.js router
const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}))

describe('ProductCard', () => {
  beforeEach(() => {
    mockPush.mockClear()
  })

  it('renders product information correctly', () => {
    render(<ProductCard product={mockProduct} />)
    
    expect(screen.getByText('Test Beaker')).toBeInTheDocument()
    expect(screen.getByText('A test beaker for testing purposes')).toBeInTheDocument()
    expect(screen.getByText('TB001')).toBeInTheDocument()
    expect(screen.getByText('₹150.00 - ₹300.00')).toBeInTheDocument()
  })

  it('displays stock status badge', () => {
    render(<ProductCard product={mockProduct} />)
    
    expect(screen.getByText('In Stock')).toBeInTheDocument()
  })

  it('navigates to product page when clicked', async () => {
    const onCardClick = jest.fn()
    render(<ProductCard product={mockProduct} onCardClick={onCardClick} />)
    
    await user.click(screen.getByTestId('product-card'))
    
    expect(onCardClick).toHaveBeenCalledWith(mockProduct)
  })

  it('displays custom display price when provided', () => {
    render(<ProductCard product={mockProduct} displayPrice="From ₹140.00" />)
    
    expect(screen.getByText('From ₹140.00')).toBeInTheDocument()
  })

  it('applies coupon discount when active coupon provided', () => {
    const activeCoupon = {
      code: 'SAVE10',
      discount: 10,
      type: 'percentage' as const
    }
    
    render(<ProductCard product={mockProduct} activeCoupon={activeCoupon} />)
    
    // Should show discounted price
    expect(screen.getByText(/save/i)).toBeInTheDocument()
  })

  it('renders custom back content when provided', () => {
    const backContent = <div>Custom back content</div>
    
    render(<ProductCard product={mockProduct} backContent={backContent} />)
    
    expect(screen.getByText('Custom back content')).toBeInTheDocument()
  })

  it('shows custom button when buttonText provided', () => {
    render(
      <ProductCard 
        product={mockProduct} 
        buttonText="Add to Cart" 
        buttonOnClick={jest.fn()}
      />
    )
    
    expect(screen.getByRole('button', { name: 'Add to Cart' })).toBeInTheDocument()
  })

  it('handles button click', async () => {
    const handleButtonClick = jest.fn()
    
    render(
      <ProductCard 
        product={mockProduct} 
        buttonText="Add to Cart" 
        buttonOnClick={handleButtonClick}
      />
    )
    
    await user.click(screen.getByRole('button', { name: 'Add to Cart' }))
    
    expect(handleButtonClick).toHaveBeenCalledWith(mockProduct)
  })

  it('renders button as link when buttonHref provided', () => {
    render(
      <ProductCard 
        product={mockProduct} 
        buttonText="View Details" 
        buttonHref="/products/test-beaker"
      />
    )
    
    const link = screen.getByRole('link', { name: 'View Details' })
    expect(link).toHaveAttribute('href', '/products/test-beaker')
  })

  it('applies custom className', () => {
    render(<ProductCard product={mockProduct} className="custom-card" />)
    
    expect(screen.getByTestId('product-card')).toHaveClass('custom-card')
  })

  it('handles product with missing image gracefully', () => {
    const productWithoutImage = { ...mockProduct, imageUrl: '' }
    
    render(<ProductCard product={productWithoutImage} />)
    
    // Should render placeholder or handle missing image
    expect(screen.getByTestId('product-card')).toBeInTheDocument()
  })

  it('displays product features when available', () => {
    render(<ProductCard product={mockProduct} />)
    
    expect(screen.getByText('Borosilicate glass')).toBeInTheDocument()
    expect(screen.getByText('Heat resistant')).toBeInTheDocument()
  })

  it('shows dimensions when available', () => {
    render(<ProductCard product={mockProduct} />)
    
    expect(screen.getByText('10cm')).toBeInTheDocument()
    expect(screen.getByText('5cm')).toBeInTheDocument()
  })

  it('handles out of stock products', () => {
    const outOfStockProduct = {
      ...mockProduct,
      stockStatus: 'out_of_stock' as const,
      quantity: 0
    }
    
    render(<ProductCard product={outOfStockProduct} />)
    
    expect(screen.getByText('Out of Stock')).toBeInTheDocument()
  })
})
```

---

## 🎨 Step 6: Test Glassmorphism Components

Create `src/app/components/Glassmorphism/__tests__/GlassButton.test.tsx`:

```typescript
import { render, screen } from '@/__tests__/utils/test-utils'
import { user } from '@/__tests__/utils/test-helpers'
import GlassButton from '../GlassButton'

describe('GlassButton', () => {
  it('renders button with children', () => {
    render(<GlassButton>Click me</GlassButton>)
    
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
  })

  it('handles click events', async () => {
    const handleClick = jest.fn()
    render(<GlassButton onClick={handleClick}>Click me</GlassButton>)
    
    await user.click(screen.getByRole('button'))
    
    expect(handleClick).toHaveBeenCalled()
  })

  it('renders as link when href provided', () => {
    render(<GlassButton href="/test">Link Button</GlassButton>)
    
    const link = screen.getByRole('link', { name: 'Link Button' })
    expect(link).toHaveAttribute('href', '/test')
  })

  it('applies variant classes correctly', () => {
    render(<GlassButton variant="primary">Primary</GlassButton>)
    
    expect(screen.getByRole('button')).toHaveClass('glass-button--primary')
  })

  it('applies size classes correctly', () => {
    render(<GlassButton size="large">Large</GlassButton>)
    
    expect(screen.getByRole('button')).toHaveClass('glass-button--large')
  })

  it('applies custom className', () => {
    render(<GlassButton className="custom-class">Button</GlassButton>)
    
    expect(screen.getByRole('button')).toHaveClass('custom-class')
  })

  it('handles disabled state', () => {
    render(<GlassButton disabled>Disabled</GlassButton>)
    
    expect(screen.getByRole('button')).toBeDisabled()
    expect(screen.getByRole('button')).toHaveClass('glass-button--disabled')
  })

  it('does not trigger onClick when disabled', async () => {
    const handleClick = jest.fn()
    render(<GlassButton disabled onClick={handleClick}>Disabled</GlassButton>)
    
    await user.click(screen.getByRole('button'))
    
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('spreads additional props correctly', () => {
    render(<GlassButton data-testid="custom-button">Button</GlassButton>)
    
    expect(screen.getByTestId('custom-button')).toBeInTheDocument()
  })
})
```

Create `src/app/components/Glassmorphism/__tests__/GlassInput.test.tsx`:

```typescript
import { render, screen } from '@/__tests__/utils/test-utils'
import { user } from '@/__tests__/utils/test-helpers'
import GlassInput from '../GlassInput'

describe('GlassInput', () => {
  it('renders input with correct props', () => {
    render(
      <GlassInput 
        value="test value" 
        onChange={jest.fn()} 
        placeholder="Enter text"
      />
    )
    
    const input = screen.getByPlaceholderText('Enter text')
    expect(input).toHaveValue('test value')
  })

  it('handles value changes', async () => {
    const handleChange = jest.fn()
    render(<GlassInput value="" onChange={handleChange} />)
    
    await user.type(screen.getByRole('textbox'), 'new value')
    
    expect(handleChange).toHaveBeenCalled()
  })

  it('supports different input types', () => {
    render(<GlassInput type="email" value="" onChange={jest.fn()} />)
    
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email')
  })

  it('handles disabled state', () => {
    render(<GlassInput value="" onChange={jest.fn()} disabled />)
    
    expect(screen.getByRole('textbox')).toBeDisabled()
  })

  it('supports required attribute', () => {
    render(<GlassInput value="" onChange={jest.fn()} required />)
    
    expect(screen.getByRole('textbox')).toBeRequired()
  })

  it('applies maxLength correctly', () => {
    render(<GlassInput value="" onChange={jest.fn()} maxLength={10} />)
    
    expect(screen.getByRole('textbox')).toHaveAttribute('maxLength', '10')
  })

  it('supports number input with min/max/step', () => {
    render(
      <GlassInput 
        type="number" 
        value={5} 
        onChange={jest.fn()} 
        min={0} 
        max={100} 
        step={5}
      />
    )
    
    const input = screen.getByRole('spinbutton')
    expect(input).toHaveAttribute('min', '0')
    expect(input).toHaveAttribute('max', '100')
    expect(input).toHaveAttribute('step', '5')
  })

  it('applies custom className', () => {
    render(
      <GlassInput 
        value="" 
        onChange={jest.fn()} 
        className="custom-input"
      />
    )
    
    expect(screen.getByRole('textbox')).toHaveClass('custom-input')
  })
})
```

---

## 🔄 Step 7: Test Loading and Error States

Create `src/app/components/ui/__tests__/LoadingSpinner.test.tsx`:

```typescript
import { render, screen } from '@/__tests__/utils/test-utils'
import LoadingSpinner from '../LoadingSpinner'

describe('LoadingSpinner', () => {
  it('renders loading spinner', () => {
    render(<LoadingSpinner />)
    
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
  })

  it('displays custom message when provided', () => {
    render(<LoadingSpinner message="Loading products..." />)
    
    expect(screen.getByText('Loading products...')).toBeInTheDocument()
  })

  it('applies size variants correctly', () => {
    render(<LoadingSpinner size="large" />)
    
    expect(screen.getByTestId('loading-spinner')).toHaveClass('spinner--large')
  })

  it('centers content when fullScreen is true', () => {
    render(<LoadingSpinner fullScreen />)
    
    expect(screen.getByTestId('loading-container')).toHaveClass('full-screen')
  })

  it('applies custom className', () => {
    render(<LoadingSpinner className="custom-spinner" />)
    
    expect(screen.getByTestId('loading-spinner')).toHaveClass('custom-spinner')
  })
})
```

---

## ✅ Step 8: Run Component Tests

### Execute All Component Tests

```bash
# Run all component tests
npm test -- src/app/components

# Run with coverage
npm run test:coverage -- src/app/components

# Run specific component tests
npm test -- ProductCard.test.tsx

# Run in watch mode
npm run test:watch -- src/app/components
```

### Check Coverage Goals

Aim for these coverage targets:
- **Critical Components:** 90%+ (ProductCard, StockStatusBadge)
- **UI Components:** 80%+ (Glassmorphism components)
- **Utility Components:** 85%+ (Breadcrumb, LoadingSpinner)

---

## 🎯 Step 9: Integration Testing Preparation

Create helper for testing with providers:

```typescript
// src/__tests__/utils/integration-helpers.tsx
import React from 'react'
import { render } from '@testing-library/react'
import { CouponProvider } from '@/contexts/CouponContext'

export const renderWithProviders = (ui: React.ReactElement, options = {}) => {
  const AllProviders = ({ children }: { children: React.ReactNode }) => (
    <CouponProvider enablePersistence={false}>
      {children}
    </CouponProvider>
  )

  return render(ui, { wrapper: AllProviders, ...options })
}

export const mockApiResponses = {
  products: mockProducts,
  coupons: [mockCoupon],
  adminAuth: { success: true, token: 'mock-token' }
}
```

---

## ✅ Verification Checklist

- [ ] StockStatusBadge component fully tested
- [ ] Breadcrumb navigation tested with routing
- [ ] Coupon components tested with context integration
- [ ] ProductCard tested with all props and interactions
- [ ] Glassmorphism components tested for variants and states
- [ ] Loading and error state components tested
- [ ] 80%+ test coverage achieved for critical components
- [ ] All tests passing consistently
- [ ] Integration test helpers prepared

---

## 🚀 Next Steps

After completing component testing:

1. **Move to Step 4:** [Integration Testing](./04-integration-testing.md)
2. **Test complete user workflows**
3. **Verify component interactions in realistic scenarios**

---

## 📝 Best Practices

### Component Testing Strategy
- Test behavior, not implementation
- Use user-centric queries (getByRole, getByText)
- Mock external dependencies, not internal components
- Test different prop combinations and edge cases

### User Interaction Testing
- Use `@testing-library/user-event` for realistic interactions
- Test keyboard navigation and accessibility
- Verify focus management and ARIA attributes

### Context and State Testing
- Test components both in isolation and with providers
- Mock context values for different scenarios
- Test state changes and side effects

### Visual Testing Considerations
- Test CSS classes are applied correctly
- Verify responsive behavior with different viewport sizes
- Test component variants and themes