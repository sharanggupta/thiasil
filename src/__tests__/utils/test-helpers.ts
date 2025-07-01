import userEvent from '@testing-library/user-event'

// User event setup
export const user = userEvent.setup()

// Mock fetch helper
export const mockFetch = (
  responseData: any, 
  success: boolean = true, 
  delay: number = 0,
  status: number = 200
) => {
  const mockResponse = {
    ok: success,
    status: success ? status : (status === 200 ? 400 : status),
    json: async () => responseData,
    text: async () => typeof responseData === 'string' ? responseData : JSON.stringify(responseData),
  }

  if (delay > 0) {
    (global.fetch as jest.Mock).mockImplementation(() =>
      new Promise(resolve => setTimeout(() => resolve(mockResponse), delay))
    )
  } else {
    (global.fetch as jest.Mock).mockResolvedValue(mockResponse)
  }
}

// Mock fetch error helper
export const mockFetchError = (errorMessage: string = 'Network Error') => {
  (global.fetch as jest.Mock).mockRejectedValue(new Error(errorMessage))
}

// Clear all mocks helper
export const clearAllMocks = () => {
  jest.clearAllMocks()
  
  // Reset local storage
  if (typeof window !== 'undefined') {
    window.localStorage.clear()
    window.sessionStorage.clear()
  }
  
  // Reset DOM
  document.body.innerHTML = ''
  
  // Reset fetch mock
  if (global.fetch && jest.isMockFunction(global.fetch)) {
    (global.fetch as jest.Mock).mockClear()
  }
}

// Test data generators
export const generateMockProducts = (count: number = 10) => {
  return Array.from({ length: count }, (_, i) => ({
    id: `product-${i}`,
    catNo: `PRD${String(i).padStart(3, '0')}`,
    name: `Test Product ${i}`,
    description: `Description for product ${i}`,
    category: 'test-category',
    categorySlug: 'test-category',
    price: `₹${(i + 1) * 100}.00`,
    stockStatus: i % 3 === 0 ? 'out_of_stock' : 'in_stock',
    capacity: `${(i + 1) * 100}ml`,
    dimensions: {
      height: `${50 + i * 5}`,
      diameter: `${30 + i * 2}`,
    },
    packaging: 'Individual',
    features: [`Feature ${i}A`, `Feature ${i}B`],
    specifications: {
      material: 'Glass',
      grade: 'A'
    }
  }))
}

export const generateMockCoupon = (overrides?: any) => ({
  code: 'TEST10',
  discountPercent: 10,
  isValid: true,
  expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  minimumOrderValue: 100,
  maxDiscount: 500,
  ...overrides
})

// Mock viewport helpers
export const mockViewport = (width: number, height: number) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  })
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: height,
  })
  
  // Trigger resize event
  window.dispatchEvent(new Event('resize'))
}

// Error simulation helpers
export const simulateNetworkError = () => {
  mockFetchError('Network Error')
}

export const simulateServerError = () => {
  mockFetch({ error: 'Internal Server Error' }, false, 0, 500)
}

export const simulateTimeoutError = () => {
  mockFetch({}, true, 10000) // 10 second delay
}