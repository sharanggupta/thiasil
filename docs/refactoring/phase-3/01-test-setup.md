# 🧪 Phase 3.1: Test Setup & Configuration

## 📋 Overview

Set up a comprehensive testing infrastructure for the THIASIL codebase. This guide focuses on configuring Jest, React Testing Library, and establishing testing conventions that will support the entire application.

## 🎯 Goals

- Configure Jest with Next.js testing environment
- Set up React Testing Library with custom utilities
- Implement test coverage reporting
- Create testing scripts and CI integration
- Establish testing conventions and file structure

## ⏱️ Estimated Time: 2-3 hours

## 🔧 Prerequisites

- Phase 0, 1, and 2 completed
- Node.js and npm/yarn installed
- Next.js application running successfully

---

## 📦 Step 1: Install Testing Dependencies

### Core Testing Libraries

```bash
npm install --save-dev \
  jest \
  @testing-library/react \
  @testing-library/jest-dom \
  @testing-library/user-event \
  jest-environment-jsdom
```

### Next.js Testing Integration

```bash
npm install --save-dev \
  @next/env \
  next-router-mock
```

### Coverage and Utilities

```bash
npm install --save-dev \
  @types/jest \
  jest-coverage-istanbul
```

---

## ⚙️ Step 2: Configure Jest

### Create `jest.config.js`

```javascript
// jest.config.js
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: './',
})

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  testPathIgnorePatterns: [
    '<rootDir>/.next/',
    '<rootDir>/node_modules/',
    '<rootDir>/docs/',
    '<rootDir>/public/'
  ],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/data/**',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/app/globals.css',
    '!src/**/Glassmorphism.css'
  ],
  coverageThreshold: {
    global: {
      branches: 60,
      functions: 70,
      lines: 70,
      statements: 70
    }
  },
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.{test,spec}.{js,jsx,ts,tsx}',
    '<rootDir>/tests/**/*.{test,spec}.{js,jsx,ts,tsx}'
  ]
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig)
```

### Create `jest.setup.js`

```javascript
// jest.setup.js
import '@testing-library/jest-dom'

// Mock Next.js router
jest.mock('next/router', () => require('next-router-mock'))

// Mock Next.js image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} />
  },
}))

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
global.localStorage = localStorageMock

// Mock sessionStorage
global.sessionStorage = localStorageMock

// Mock fetch
global.fetch = jest.fn()

// Console error filtering (suppress known warnings)
const originalError = console.error
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is no longer supported')
    ) {
      return
    }
    originalError.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalError
})
```

---

## 📋 Step 3: Update Package.json Scripts

Add testing scripts to your `package.json`:

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:ci": "jest --ci --coverage --watchAll=false",
    "test:debug": "node --inspect-brk node_modules/.bin/jest --runInBand"
  }
}
```

---

## 📁 Step 4: Create Testing File Structure

Create the following directory structure:

```
src/
├── __tests__/                  # Global test utilities
│   ├── utils/
│   │   ├── test-utils.tsx     # Custom render utilities
│   │   ├── mock-data.ts       # Test data fixtures
│   │   └── test-helpers.ts    # Common test helpers
│   └── setup/
│       └── global.ts          # Global test setup
├── lib/
│   └── __tests__/             # Utility function tests
│       ├── utils.test.ts
│       ├── price.test.ts
│       └── image-utils.test.ts
└── app/
    └── components/
        ├── ui/
        │   └── __tests__/     # Component tests
        │       ├── ProductCard.test.tsx
        │       └── StockStatusBadge.test.tsx
        └── common/
            └── __tests__/
                ├── Breadcrumb.test.tsx
                └── Heading.test.tsx
```

---

## 🛠️ Step 5: Create Testing Utilities

### Custom Render Utility

Create `src/__tests__/utils/test-utils.tsx`:

```typescript
import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { CouponProvider } from '@/contexts/CouponContext'

// Mock providers for testing
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <CouponProvider enablePersistence={false}>
      {children}
    </CouponProvider>
  )
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options })

export * from '@testing-library/react'
export { customRender as render }
```

### Mock Data Fixtures

Create `src/__tests__/utils/mock-data.ts`:

```typescript
import { Product } from '@/types'

export const mockProduct: Product = {
  id: 'test-001',
  name: 'Test Beaker',
  description: 'A test beaker for testing purposes',
  category: 'Beakers',
  categorySlug: 'beakers',
  catNo: 'TB001',
  price: '₹150.00',
  priceRange: '₹150.00 - ₹300.00',
  capacity: '250ml',
  packaging: 'Individual',
  stockStatus: 'in_stock',
  quantity: 10,
  dimensions: {
    height: '10cm',
    diameter: '5cm'
  },
  features: ['Borosilicate glass', 'Heat resistant'],
  imageUrl: '/test-images/beaker.jpg'
}

export const mockProducts: Product[] = [
  mockProduct,
  {
    ...mockProduct,
    id: 'test-002',
    name: 'Test Flask',
    catNo: 'TF001',
    stockStatus: 'out_of_stock',
    quantity: 0
  }
]

export const mockCoupon = {
  code: 'TEST10',
  discount: 10,
  type: 'percentage' as const,
  minOrder: 100,
  maxDiscount: 50,
  isActive: true,
  expiryDate: '2024-12-31'
}

export const mockAdminCredentials = {
  username: 'testadmin',
  password: 'testpass123'
}
```

### Test Helpers

Create `src/__tests__/utils/test-helpers.ts`:

```typescript
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// Helper to wait for element to appear
export const waitForElement = async (text: string | RegExp) => {
  return await waitFor(() => screen.getByText(text))
}

// Helper to wait for element to disappear
export const waitForElementToBeRemoved = async (text: string | RegExp) => {
  const element = screen.queryByText(text)
  if (element) {
    await waitFor(() => expect(screen.queryByText(text)).not.toBeInTheDocument())
  }
}

// Helper for user interactions
export const user = userEvent.setup()

// Helper to mock fetch responses
export const mockFetch = (response: any, ok = true) => {
  ;(global.fetch as jest.Mock).mockResolvedValueOnce({
    ok,
    json: async () => response,
    status: ok ? 200 : 400,
  })
}

// Helper to mock fetch errors
export const mockFetchError = (error = 'Network error') => {
  ;(global.fetch as jest.Mock).mockRejectedValueOnce(new Error(error))
}

// Helper to clear all mocks
export const clearAllMocks = () => {
  jest.clearAllMocks()
  localStorage.clear()
  sessionStorage.clear()
}

// Helper for testing component loading states
export const expectLoadingState = () => {
  expect(screen.getByText(/loading/i)).toBeInTheDocument()
}

// Helper for testing error states
export const expectErrorState = (error?: string) => {
  if (error) {
    expect(screen.getByText(error)).toBeInTheDocument()
  } else {
    expect(screen.getByText(/error|failed|something went wrong/i)).toBeInTheDocument()
  }
}
```

---

## 🧪 Step 6: Create First Test

Create a simple test to verify setup: `src/lib/__tests__/utils.test.ts`

```typescript
import { getBaseCatalogNumber } from '@/lib/utils'

describe('getBaseCatalogNumber', () => {
  it('should extract base catalog number correctly', () => {
    expect(getBaseCatalogNumber('ABC-001-250')).toBe('ABC-001')
    expect(getBaseCatalogNumber('XYZ-123')).toBe('XYZ-123')
    expect(getBaseCatalogNumber('')).toBe('')
  })

  it('should handle edge cases', () => {
    expect(getBaseCatalogNumber('ABC')).toBe('ABC')
    expect(getBaseCatalogNumber('ABC-')).toBe('ABC-')
  })
})
```

---

## 🔍 Step 7: Verify Setup

### Run Initial Test

```bash
npm test
```

### Run with Coverage

```bash
npm run test:coverage
```

### Check Test Coverage Report

Coverage reports will be generated in the `coverage/` directory. Open `coverage/lcov-report/index.html` in your browser to view detailed coverage reports.

---

## 📋 Step 8: CI/CD Integration (Optional)

### GitHub Actions

Create `.github/workflows/test.yml`:

```yaml
name: Tests

on:
  push:
    branches: [ main, refactor-phase-1-and-2-complete ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3
    
    - name: Use Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm run test:ci
    
    - name: Upload coverage to Codecov
      uses: codecov/codecov-action@v3
      if: success()
      with:
        file: ./coverage/lcov.info
```

---

## ✅ Verification Checklist

- [ ] All testing dependencies installed
- [ ] Jest configuration created and working
- [ ] Testing file structure established
- [ ] Custom testing utilities created
- [ ] First test passes
- [ ] Coverage reporting working
- [ ] Testing scripts added to package.json
- [ ] CI/CD integration configured (optional)

---

## 🚀 Next Steps

After completing this setup:

1. **Move to Step 2:** [Utility Testing](./02-utility-testing.md)
2. **Begin systematic testing** of utility functions
3. **Establish testing patterns** that will be used throughout the project

---

## 📝 Notes

- **Coverage Thresholds:** Start with 60-70% and increase gradually
- **Test Organization:** Keep tests close to the code they test
- **Mock Strategy:** Mock external dependencies, not internal utilities
- **Performance:** Use `describe.skip()` and `it.skip()` for temporarily disabled tests

---

## 🔧 Troubleshooting

### Common Issues:

1. **Jest can't find modules:** Check `moduleNameMapping` in jest.config.js
2. **Next.js components failing:** Ensure proper Next.js mocking in jest.setup.js
3. **TypeScript errors:** Install `@types/jest` and configure properly
4. **Coverage not working:** Check `collectCoverageFrom` patterns

### Performance Tips:

- Use `--maxWorkers=1` for debugging
- Use `--bail` to stop on first failure
- Use `--onlyChanged` during development