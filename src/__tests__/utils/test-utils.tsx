import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { CouponProvider } from '@/contexts/CouponContext'

// Global test setup utilities
export * from '@testing-library/react'

// Custom render function that includes providers
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  withCouponProvider?: boolean
  couponProviderProps?: any
}

const AllTheProviders = ({ 
  children, 
  withCouponProvider = false, 
  couponProviderProps = {} 
}: { 
  children: React.ReactNode
  withCouponProvider?: boolean
  couponProviderProps?: any
}) => {
  if (withCouponProvider) {
    return (
      <CouponProvider enablePersistence={false} {...couponProviderProps}>
        {children}
      </CouponProvider>
    )
  }
  
  return <>{children}</>
}

const customRender = (
  ui: ReactElement,
  options: CustomRenderOptions = {}
) => {
  const { withCouponProvider, couponProviderProps, ...renderOptions } = options
  
  return render(ui, {
    wrapper: ({ children }) => (
      <AllTheProviders 
        withCouponProvider={withCouponProvider}
        couponProviderProps={couponProviderProps}
      >
        {children}
      </AllTheProviders>
    ),
    ...renderOptions,
  })
}

// Re-export everything
export { customRender as render }

// Helper to create a render function with providers
export const renderWithProviders = (ui: ReactElement, options: CustomRenderOptions = {}) => {
  return customRender(ui, { withCouponProvider: true, ...options })
}

// Setup global fetch mock
export const setupFetchMock = () => {
  // Store original fetch
  const originalFetch = global.fetch
  
  // Create mock function
  const mockFetch = jest.fn()
  global.fetch = mockFetch
  
  // Cleanup function
  const cleanup = () => {
    global.fetch = originalFetch
  }
  
  return { mockFetch, cleanup }
}

// Media query mock for responsive testing
export const mockMediaQuery = (matches: boolean) => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches,
      media: query,
      onchange: null,
      addListener: jest.fn(), // deprecated
      removeListener: jest.fn(), // deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  })
}

// Local storage mock
export const mockLocalStorage = () => {
  const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  }
  
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock
  })
  
  return localStorageMock
}

// Session storage mock
export const mockSessionStorage = () => {
  const sessionStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  }
  
  Object.defineProperty(window, 'sessionStorage', {
    value: sessionStorageMock
  })
  
  return sessionStorageMock
}

// Performance mock for performance testing
export const mockPerformance = () => {
  const performanceMock = {
    now: jest.fn(() => Date.now()),
    mark: jest.fn(),
    measure: jest.fn(),
    getEntriesByName: jest.fn(() => []),
    getEntriesByType: jest.fn(() => []),
  }
  
  Object.defineProperty(window, 'performance', {
    value: performanceMock
  })
  
  return performanceMock
}

// Timeout utilities for async testing
export const waitForTimeout = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Custom assertion helpers
export const expectToBeInViewport = (element: Element) => {
  const rect = element.getBoundingClientRect()
  expect(rect.top).toBeGreaterThanOrEqual(0)
  expect(rect.left).toBeGreaterThanOrEqual(0)
  expect(rect.bottom).toBeLessThanOrEqual(window.innerHeight)
  expect(rect.right).toBeLessThanOrEqual(window.innerWidth)
}

export const expectElementToHaveStyle = (element: Element, styles: Record<string, string>) => {
  const computedStyles = window.getComputedStyle(element)
  Object.entries(styles).forEach(([property, value]) => {
    expect(computedStyles.getPropertyValue(property)).toBe(value)
  })
}

// Accessibility testing helpers
export const expectElementToBeAccessible = (element: Element) => {
  // Check for ARIA attributes
  const hasAriaLabel = element.hasAttribute('aria-label')
  const hasAriaDescribedBy = element.hasAttribute('aria-describedby')
  const hasRole = element.hasAttribute('role')
  const hasId = element.hasAttribute('id')
  
  // Should have at least one accessibility attribute
  expect(hasAriaLabel || hasAriaDescribedBy || hasRole || hasId).toBe(true)
}