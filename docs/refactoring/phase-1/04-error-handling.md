# 🛡️ Error Handling Foundation

## 📋 Task Checklist
- [ ] Add error boundaries to main layout components (`layout.js`)
- [ ] Create a centralized error logging utility
- [ ] Add basic error states for API call failures
- [ ] Implement graceful fallbacks for image loading failures
- [ ] Add proper 404 and error page components

---

## 🔧 Task 1: Add Error Boundaries to Layout Components

### Current State:
No error boundaries exist - any component error crashes the entire app

### Target: Comprehensive Error Boundary System

#### Step 1: Create Base Error Boundary Component
```jsx
// src/app/components/common/ErrorBoundary.jsx
'use client';

import { Component } from 'react';
import { logError } from '@/lib/error';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error
    logError(error, {
      componentStack: errorInfo.componentStack,
      errorBoundary: this.constructor.name,
      props: this.props,
    });

    this.setState({
      error,
      errorInfo,
    });
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.handleRetry);
      }

      // Default fallback UI
      return (
        <div className="error-boundary">
          <div className="error-boundary-content">
            <div className="error-boundary-icon">⚠️</div>
            <h2 className="error-boundary-title">
              {this.props.title || 'Something went wrong'}
            </h2>
            <p className="error-boundary-message">
              {this.props.message || 'An unexpected error occurred. Please try refreshing the page.'}
            </p>
            
            {process.env.NODE_ENV === 'development' && (
              <details className="error-boundary-details">
                <summary>Error Details (Development)</summary>
                <pre className="error-boundary-stack">
                  {this.state.error && this.state.error.toString()}
                  <br />
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
            
            <div className="error-boundary-actions">
              <button
                onClick={this.handleRetry}
                className="error-boundary-retry-btn"
              >
                Try Again
              </button>
              <button
                onClick={() => window.location.reload()}
                className="error-boundary-reload-btn"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
```

#### Step 2: Create Specialized Error Boundaries

**Layout Error Boundary:**
```jsx
// src/app/components/common/LayoutErrorBoundary.jsx
import ErrorBoundary from './ErrorBoundary';

export default function LayoutErrorBoundary({ children }) {
  return (
    <ErrorBoundary
      title="Layout Error"
      message="There was a problem loading the page layout. This might be a temporary issue."
      fallback={(error, retry) => (
        <div className="layout-error-fallback">
          <div className="layout-error-content">
            <h1>Thiasil</h1>
            <div className="layout-error-message">
              <h2>Page Layout Error</h2>
              <p>We're experiencing technical difficulties. Please try again.</p>
              <div className="layout-error-actions">
                <button onClick={retry}>Try Again</button>
                <button onClick={() => window.location.href = '/'}>Go Home</button>
              </div>
            </div>
          </div>
        </div>
      )}
    >
      {children}
    </ErrorBoundary>
  );
}
```

**Component Error Boundary:**
```jsx
// src/app/components/common/ComponentErrorBoundary.jsx
import ErrorBoundary from './ErrorBoundary';

export default function ComponentErrorBoundary({ 
  children, 
  componentName,
  fallbackMessage 
}) {
  return (
    <ErrorBoundary
      title={`${componentName} Error`}
      message={fallbackMessage || `The ${componentName} component failed to load.`}
      fallback={(error, retry) => (
        <div className="component-error-fallback">
          <div className="component-error-icon">🔧</div>
          <h3>Component Error</h3>
          <p>{fallbackMessage || `The ${componentName} component encountered an error.`}</p>
          <button onClick={retry} className="btn-sm">
            Retry Component
          </button>
        </div>
      )}
    >
      {children}
    </ErrorBoundary>
  );
}
```

#### Step 3: Update Layout Components

**Root Layout:**
```jsx
// src/app/layout.js
import LayoutErrorBoundary from './components/common/LayoutErrorBoundary';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LayoutErrorBoundary>
          {children}
        </LayoutErrorBoundary>
      </body>
    </html>
  );
}
```

**Page Components:**
```jsx
// src/app/products/page.jsx
import ComponentErrorBoundary from '../components/common/ComponentErrorBoundary';
import ProductsContent from './ProductsContent';

export default function ProductsPage() {
  return (
    <ComponentErrorBoundary 
      componentName="Products Page"
      fallbackMessage="Unable to load the products catalog. Please check your connection and try again."
    >
      <ProductsContent />
    </ComponentErrorBoundary>
  );
}
```

### Validation:
- [ ] Error boundaries catch and display errors gracefully
- [ ] App doesn't crash when components throw errors
- [ ] Retry functionality works correctly
- [ ] Development mode shows error details
- [ ] Production mode shows user-friendly messages

---

## 🔧 Task 2: Create Centralized Error Logging Utility

### Current State:
No error logging system in place

### Target: Comprehensive Error Logging

#### Step 1: Create Error Logging Utility
```javascript
// src/lib/error.js

/**
 * Error logging utility for centralized error handling
 */

// Error severity levels
export const ERROR_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
};

// Error categories
export const ERROR_CATEGORIES = {
  API: 'api',
  COMPONENT: 'component',
  NETWORK: 'network',
  VALIDATION: 'validation',
  AUTH: 'auth',
  UNKNOWN: 'unknown',
};

/**
 * Log an error with context information
 * @param {Error|string} error - The error to log
 * @param {Object} context - Additional context information
 */
export function logError(error, context = {}) {
  const errorData = {
    timestamp: new Date().toISOString(),
    message: error?.message || error,
    stack: error?.stack,
    level: context.level || ERROR_LEVELS.MEDIUM,
    category: context.category || ERROR_CATEGORIES.UNKNOWN,
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
    url: typeof window !== 'undefined' ? window.location.href : 'unknown',
    userId: context.userId || 'anonymous',
    sessionId: context.sessionId || generateSessionId(),
    ...context,
  };

  // Console logging (always in development)
  if (process.env.NODE_ENV === 'development') {
    console.group(`🚨 Error [${errorData.level.toUpperCase()}]`);
    console.error('Message:', errorData.message);
    console.error('Category:', errorData.category);
    console.error('Context:', context);
    if (errorData.stack) {
      console.error('Stack:', errorData.stack);
    }
    console.groupEnd();
  }

  // Send to external service (production)
  if (process.env.NODE_ENV === 'production' && errorData.level !== ERROR_LEVELS.LOW) {
    sendToErrorService(errorData);
  }

  // Store in local storage for debugging (development)
  if (process.env.NODE_ENV === 'development') {
    storeErrorLocally(errorData);
  }
}

/**
 * Generate a simple session ID
 */
function generateSessionId() {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

/**
 * Send error to external service (implement based on your service)
 */
function sendToErrorService(errorData) {
  // Example: Send to Sentry, LogRocket, or custom endpoint
  try {
    fetch('/api/errors', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(errorData),
    }).catch(() => {
      // Silently fail - don't log errors about error logging
    });
  } catch (e) {
    // Silently fail
  }
}

/**
 * Store error locally for development debugging
 */
function storeErrorLocally(errorData) {
  try {
    const errors = JSON.parse(localStorage.getItem('debug_errors') || '[]');
    errors.push(errorData);
    
    // Keep only last 50 errors
    if (errors.length > 50) {
      errors.splice(0, errors.length - 50);
    }
    
    localStorage.setItem('debug_errors', JSON.stringify(errors));
  } catch (e) {
    // Silently fail
  }
}

/**
 * Log API errors with specific context
 */
export function logApiError(error, endpoint, method = 'GET', payload = null) {
  logError(error, {
    category: ERROR_CATEGORIES.API,
    level: ERROR_LEVELS.HIGH,
    endpoint,
    method,
    payload,
    responseStatus: error?.response?.status,
    responseData: error?.response?.data,
  });
}

/**
 * Log component errors
 */
export function logComponentError(error, componentName, props = {}) {
  logError(error, {
    category: ERROR_CATEGORIES.COMPONENT,
    level: ERROR_LEVELS.MEDIUM,
    componentName,
    props,
  });
}

/**
 * Log validation errors
 */
export function logValidationError(field, value, rule, message) {
  logError(new Error(message), {
    category: ERROR_CATEGORIES.VALIDATION,
    level: ERROR_LEVELS.LOW,
    field,
    value,
    rule,
  });
}

/**
 * Log authentication errors
 */
export function logAuthError(error, action) {
  logError(error, {
    category: ERROR_CATEGORIES.AUTH,
    level: ERROR_LEVELS.HIGH,
    action,
  });
}

/**
 * Utility to get stored errors (development only)
 */
export function getStoredErrors() {
  if (process.env.NODE_ENV !== 'development') return [];
  
  try {
    return JSON.parse(localStorage.getItem('debug_errors') || '[]');
  } catch (e) {
    return [];
  }
}

/**
 * Clear stored errors (development only)
 */
export function clearStoredErrors() {
  if (process.env.NODE_ENV !== 'development') return;
  
  try {
    localStorage.removeItem('debug_errors');
  } catch (e) {
    // Silently fail
  }
}
```

#### Step 2: Create Error API Endpoint
```javascript
// src/app/api/errors/route.js
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const errorData = await request.json();
    
    // In a real application, you would:
    // 1. Validate the error data
    // 2. Store in database or send to external service
    // 3. Maybe send alerts for critical errors
    
    console.error('Client Error:', errorData);
    
    // For now, just acknowledge receipt
    return NextResponse.json({ 
      success: true, 
      message: 'Error logged successfully' 
    });
    
  } catch (error) {
    console.error('Error logging failed:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to log error' },
      { status: 500 }
    );
  }
}
```

### Validation:
- [ ] Errors are logged with appropriate context
- [ ] Development mode shows detailed error information
- [ ] Production mode logs errors without exposing sensitive data
- [ ] Local storage debugging works in development
- [ ] API endpoint receives and processes error data

---

## 🔧 Task 3: Add Error States for API Call Failures

### Current State:
API failures often show loading states indefinitely or crash components

### Target: Graceful API Error Handling

#### Step 1: Create API Error Hook
```javascript
// src/lib/hooks/useApiError.js
import { useState, useCallback } from 'react';
import { logApiError } from '../error';

export function useApiError() {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleApiCall = useCallback(async (apiCall, endpoint, method = 'GET') => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await apiCall();
      setIsLoading(false);
      return result;
    } catch (err) {
      const apiError = {
        message: err.message || 'An API error occurred',
        status: err.response?.status || 0,
        statusText: err.response?.statusText || 'Unknown Error',
        endpoint,
        method,
      };

      setError(apiError);
      setIsLoading(false);
      
      // Log the error
      logApiError(err, endpoint, method);
      
      throw apiError;
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const retry = useCallback(async (apiCall, endpoint, method = 'GET') => {
    return handleApiCall(apiCall, endpoint, method);
  }, [handleApiCall]);

  return {
    error,
    isLoading,
    handleApiCall,
    clearError,
    retry,
  };
}
```

#### Step 2: Update Existing Hooks with Error Handling

**Update Products Hook:**
```javascript
// src/lib/hooks/useProducts.js
import { useState, useEffect } from 'react';
import { useApiError } from './useApiError';

export function useProducts() {
  const [products, setProducts] = useState([]);
  const { error, isLoading, handleApiCall, retry } = useApiError();

  const fetchProducts = async () => {
    const apiCall = () => fetch('/api/products').then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      return res.json();
    });

    try {
      const data = await handleApiCall(apiCall, '/api/products', 'GET');
      setProducts(data.products || []);
    } catch (err) {
      // Error is already handled by useApiError
      setProducts([]);
    }
  };

  const retryFetchProducts = () => {
    fetchProducts();
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    isLoading,
    error,
    refetch: retryFetchProducts,
    retry: retryFetchProducts,
  };
}
```

**Update Admin Hooks:**
```javascript
// src/lib/hooks/useAdminProducts.js
import { useState } from 'react';
import { useApiError } from './useApiError';

export function useAdminProducts() {
  const [products, setProducts] = useState([]);
  const { error, isLoading, handleApiCall } = useApiError();

  const updatePrice = async (productId, newPrice) => {
    const apiCall = () => fetch('/api/admin/update-prices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, price: newPrice }),
    }).then(res => {
      if (!res.ok) throw new Error(`Failed to update price: ${res.statusText}`);
      return res.json();
    });

    try {
      const result = await handleApiCall(apiCall, '/api/admin/update-prices', 'POST');
      
      // Update local state
      setProducts(prev => prev.map(p => 
        p.id === productId ? { ...p, price: newPrice } : p
      ));
      
      return result;
    } catch (err) {
      throw err;
    }
  };

  return {
    products,
    setProducts,
    updatePrice,
    isLoading,
    error,
  };
}
```

#### Step 3: Create API Error Display Components

**Generic API Error Component:**
```jsx
// src/app/components/common/ApiError.jsx
export default function ApiError({ 
  error, 
  onRetry, 
  title = 'Failed to Load Data',
  showDetails = false 
}) {
  if (!error) return null;

  return (
    <div className="api-error">
      <div className="api-error-content">
        <div className="api-error-icon">⚠️</div>
        <h3 className="api-error-title">{title}</h3>
        <p className="api-error-message">
          {error.message || 'An unexpected error occurred while loading data.'}
        </p>
        
        {showDetails && error.status && (
          <details className="api-error-details">
            <summary>Technical Details</summary>
            <p>Status: {error.status} - {error.statusText}</p>
            <p>Endpoint: {error.endpoint}</p>
            <p>Method: {error.method}</p>
          </details>
        )}
        
        {onRetry && (
          <button 
            onClick={onRetry}
            className="api-error-retry-btn"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}
```

**Products-Specific Error:**
```jsx
// src/app/components/products/ProductsError.jsx
import ApiError from '../common/ApiError';

export default function ProductsError({ error, onRetry }) {
  return (
    <ApiError
      error={error}
      onRetry={onRetry}
      title="Unable to Load Products"
      showDetails={process.env.NODE_ENV === 'development'}
    />
  );
}
```

#### Step 4: Update Components to Use Error States

**Products Page:**
```jsx
// src/app/products/page.jsx
import { useProducts } from '@/lib/hooks/useProducts';
import ProductsError from './components/ProductsError';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function ProductsPage() {
  const { products, isLoading, error, retry } = useProducts();

  if (isLoading) {
    return (
      <div className="products-loading">
        <LoadingSpinner size="large" />
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return <ProductsError error={error} onRetry={retry} />;
  }

  return (
    <div className="products-page">
      {/* Products content */}
    </div>
  );
}
```

### Validation:
- [ ] API errors are caught and displayed gracefully
- [ ] Loading states show while API calls are in progress
- [ ] Retry functionality works for failed API calls
- [ ] Error details are shown in development mode only
- [ ] Users see friendly error messages in production

---

## 🔧 Task 4: Implement Graceful Image Loading Fallbacks

### Current State:
Broken images show as empty boxes or alt text

### Target: Graceful Image Loading with Fallbacks

#### Step 1: Create Enhanced Image Component
```jsx
// src/app/components/common/SafeImage.jsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { logError, ERROR_CATEGORIES, ERROR_LEVELS } from '@/lib/error';

export default function SafeImage({
  src,
  alt,
  fallbackSrc = '/images/placeholder.webp',
  showPlaceholder = true,
  className = '',
  ...props
}) {
  const [imgSrc, setImgSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleError = (error) => {
    // Log the image loading error
    logError(error || new Error('Image failed to load'), {
      category: ERROR_CATEGORIES.NETWORK,
      level: ERROR_LEVELS.LOW,
      imageSrc: imgSrc,
      fallbackSrc,
    });

    setHasError(true);
    setIsLoading(false);

    // Try fallback image if we haven't already
    if (imgSrc !== fallbackSrc) {
      setImgSrc(fallbackSrc);
      setHasError(false);
    }
  };

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  // If both original and fallback failed, show placeholder
  if (hasError && imgSrc === fallbackSrc) {
    return showPlaceholder ? (
      <div className={`image-placeholder ${className}`} {...props}>
        <div className="image-placeholder-content">
          <div className="image-placeholder-icon">🖼️</div>
          <div className="image-placeholder-text">
            {alt || 'Image unavailable'}
          </div>
        </div>
      </div>
    ) : null;
  }

  return (
    <div className={`safe-image-container ${className}`}>
      {isLoading && (
        <div className="image-loading">
          <div className="image-loading-spinner"></div>
        </div>
      )}
      
      <Image
        src={imgSrc}
        alt={alt}
        onError={handleError}
        onLoad={handleLoad}
        className={`safe-image ${isLoading ? 'loading' : ''}`}
        {...props}
      />
    </div>
  );
}
```

#### Step 2: Create Product Image Component
```jsx
// src/app/components/products/ProductImage.jsx
import SafeImage from '../common/SafeImage';

export default function ProductImage({ 
  product, 
  size = 'medium',
  showName = false,
  className = '' 
}) {
  const sizeClasses = {
    small: 'w-16 h-16',
    medium: 'w-32 h-32',
    large: 'w-64 h-64',
    xl: 'w-80 h-80',
  };

  return (
    <div className={`product-image ${className}`}>
      <SafeImage
        src={product.image}
        alt={`${product.name} - ${product.category}`}
        fallbackSrc="/images/products/placeholder.webp"
        className={`product-image-img ${sizeClasses[size]}`}
        width={size === 'xl' ? 320 : size === 'large' ? 256 : size === 'medium' ? 128 : 64}
        height={size === 'xl' ? 320 : size === 'large' ? 256 : size === 'medium' ? 128 : 64}
      />
      
      {showName && (
        <div className="product-image-name">
          {product.name}
        </div>
      )}
    </div>
  );
}
```

#### Step 3: Create Catalog Image Component
```jsx
// src/app/components/catalog/CatalogImage.jsx
import SafeImage from '../common/SafeImage';

export default function CatalogImage({ 
  pageNumber, 
  className = '',
  onClick 
}) {
  const imageSrc = `/images/catalog/catalog-${pageNumber.toString().padStart(3, '0')}.webp`;

  return (
    <div 
      className={`catalog-image ${className}`}
      onClick={onClick}
    >
      <SafeImage
        src={imageSrc}
        alt={`Catalog page ${pageNumber}`}
        fallbackSrc="/images/catalog/placeholder.webp"
        className="catalog-image-img"
        width={400}
        height={600}
      />
      
      <div className="catalog-image-overlay">
        <span className="catalog-page-number">Page {pageNumber}</span>
      </div>
    </div>
  );
}
```

#### Step 4: Create Placeholder Images
Create placeholder images in your public directory:
- `/public/images/placeholder.webp` - Generic placeholder
- `/public/images/products/placeholder.webp` - Product-specific placeholder
- `/public/images/catalog/placeholder.webp` - Catalog-specific placeholder

#### Step 5: Update Existing Components

**Update ProductCard to use SafeImage:**
```jsx
// src/app/components/ui/ProductCard.jsx
import ProductImage from '../products/ProductImage';

export default function ProductCard({ product }) {
  return (
    <div className="product-card">
      <ProductImage 
        product={product}
        size="medium"
        className="product-card-image"
      />
      
      <div className="product-card-content">
        {/* Rest of product card content */}
      </div>
    </div>
  );
}
```

### Validation:
- [ ] Images load gracefully with loading states
- [ ] Fallback images display when originals fail
- [ ] Placeholder content shows when all images fail
- [ ] Image loading errors are logged appropriately
- [ ] No broken image icons visible to users

---

## 🔧 Task 5: Add Proper 404 and Error Page Components

### Current State:
Default Next.js error pages without custom styling

### Target: Branded Error Pages

#### Step 1: Create Custom 404 Page
```jsx
// src/app/not-found.jsx
import Link from 'next/link';
import { GlassButton, GlassCard } from './components/Glassmorphism';
import { NeonBubblesBackground } from './components/NeonBubblesBackground';

export default function NotFound() {
  return (
    <div className="not-found-page">
      <NeonBubblesBackground />
      
      <div className="not-found-container">
        <GlassCard className="not-found-card">
          <div className="not-found-content">
            <div className="not-found-icon">🔍</div>
            
            <h1 className="not-found-title">
              Page Not Found
            </h1>
            
            <div className="not-found-code">404</div>
            
            <p className="not-found-message">
              The page you're looking for doesn't exist or has been moved.
            </p>
            
            <div className="not-found-suggestions">
              <h3>What can you do?</h3>
              <ul>
                <li>Check the URL for typing errors</li>
                <li>Go back to the previous page</li>
                <li>Visit our homepage</li>
                <li>Browse our products</li>
              </ul>
            </div>
            
            <div className="not-found-actions">
              <GlassButton
                href="/"
                variant="primary"
                size="large"
              >
                Go Home
              </GlassButton>
              
              <GlassButton
                href="/products"
                variant="secondary"
                size="large"
              >
                Browse Products
              </GlassButton>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
```

#### Step 2: Create Global Error Page
```jsx
// src/app/error.jsx
'use client';

import { useEffect } from 'react';
import { GlassButton, GlassCard } from './components/Glassmorphism';
import { NeonBubblesBackground } from './components/NeonBubblesBackground';
import { logError, ERROR_CATEGORIES, ERROR_LEVELS } from '@/lib/error';

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log the error
    logError(error, {
      category: ERROR_CATEGORIES.COMPONENT,
      level: ERROR_LEVELS.HIGH,
      page: 'global-error-boundary',
    });
  }, [error]);

  return (
    <div className="error-page">
      <NeonBubblesBackground />
      
      <div className="error-container">
        <GlassCard className="error-card">
          <div className="error-content">
            <div className="error-icon">⚠️</div>
            
            <h1 className="error-title">
              Something went wrong
            </h1>
            
            <p className="error-message">
              We encountered an unexpected error. This has been reported to our team.
            </p>
            
            {process.env.NODE_ENV === 'development' && (
              <details className="error-details">
                <summary>Error Details (Development)</summary>
                <pre className="error-stack">
                  {error.message}
                  {'\n\n'}
                  {error.stack}
                </pre>
              </details>
            )}
            
            <div className="error-actions">
              <GlassButton
                onClick={reset}
                variant="primary"
                size="large"
              >
                Try Again
              </GlassButton>
              
              <GlassButton
                href="/"
                variant="secondary"
                size="large"
              >
                Go Home
              </GlassButton>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
```

#### Step 3: Create Loading Page
```jsx
// src/app/loading.jsx
import { GlassCard } from './components/Glassmorphism';
import { NeonBubblesBackground } from './components/NeonBubblesBackground';

export default function Loading() {
  return (
    <div className="loading-page">
      <NeonBubblesBackground />
      
      <div className="loading-container">
        <GlassCard className="loading-card">
          <div className="loading-content">
            <div className="loading-spinner-large">
              <div className="spinner"></div>
            </div>
            
            <h2 className="loading-title">Loading</h2>
            <p className="loading-message">Please wait while we load the page...</p>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
```

#### Step 4: Add Error Page Styles
```css
/* src/app/globals.css - Add error page styles */

.not-found-page,
.error-page,
.loading-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.not-found-container,
.error-container,
.loading-container {
  max-width: 600px;
  width: 100%;
  padding: 2rem;
  position: relative;
  z-index: 10;
}

.not-found-card,
.error-card,
.loading-card {
  text-align: center;
  padding: 3rem;
}

.not-found-icon,
.error-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.not-found-title,
.error-title,
.loading-title {
  font-size: 2.5rem;
  font-weight: bold;
  color: white;
  margin-bottom: 1rem;
}

.not-found-code {
  font-size: 6rem;
  font-weight: 900;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 1rem 0;
}

.not-found-message,
.error-message,
.loading-message {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 2rem;
  line-height: 1.6;
}

.not-found-suggestions {
  text-align: left;
  margin: 2rem 0;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.not-found-suggestions h3 {
  color: white;
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.not-found-suggestions ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.not-found-suggestions li {
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 0.5rem;
  padding-left: 1.5rem;
  position: relative;
}

.not-found-suggestions li::before {
  content: '→';
  position: absolute;
  left: 0;
  color: var(--color-primary);
}

.not-found-actions,
.error-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 2rem;
}

.error-details {
  margin: 2rem 0;
  text-align: left;
}

.error-details summary {
  cursor: pointer;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 1rem;
}

.error-stack {
  background: rgba(0, 0, 0, 0.3);
  padding: 1rem;
  border-radius: 8px;
  overflow-x: auto;
  font-family: monospace;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.9);
  max-height: 300px;
  overflow-y: auto;
}

.loading-spinner-large {
  margin: 2rem auto;
  display: flex;
  justify-content: center;
}

.loading-spinner-large .spinner {
  width: 60px;
  height: 60px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-left-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .not-found-card,
  .error-card,
  .loading-card {
    padding: 2rem 1.5rem;
  }
  
  .not-found-title,
  .error-title {
    font-size: 2rem;
  }
  
  .not-found-code {
    font-size: 4rem;
  }
  
  .not-found-actions,
  .error-actions {
    flex-direction: column;
    align-items: center;
  }
}
```

### Validation:
- [ ] 404 page displays for non-existent routes
- [ ] Global error page catches unhandled errors
- [ ] Loading page shows during page transitions
- [ ] All error pages maintain brand consistency
- [ ] Error details show only in development mode
- [ ] Navigation buttons work correctly

---

## ✅ Phase 1.4 Completion Checklist

### Before Moving to Phase 2:
- [ ] Error boundaries implemented at layout and component levels
- [ ] Centralized error logging utility created and integrated
- [ ] API error states handled gracefully with retry functionality
- [ ] Image loading fallbacks implemented with placeholders
- [ ] Custom 404, error, and loading pages created
- [ ] All error handling preserves app stability
- [ ] No functionality regressions introduced
- [ ] Error logging works in both development and production

### Files Created/Modified:
- [ ] ErrorBoundary components (3 new files)
- [ ] Error logging utility (1 new file)
- [ ] API error handling hook (1 new file)
- [ ] SafeImage component and variants (4 new files)
- [ ] Custom error pages (3 new files)
- [ ] Error API endpoint (1 new file)
- [ ] Updated hooks with error handling
- [ ] Added error page styles to globals.css

### Benefits Achieved:
- [ ] App doesn't crash from component errors
- [ ] Users see helpful error messages instead of blank screens
- [ ] API failures are handled gracefully
- [ ] Images load with proper fallbacks
- [ ] Errors are logged for debugging and monitoring
- [ ] Better user experience during error conditions

### Time Estimate: 10-12 hours
### Risk Level: 🟢 Very Low

---

## 🎉 Phase 1 Complete!

All Phase 1 tasks completed. The foundation is now solid with:
- ✅ TypeScript setup and utility improvements
- ✅ Component extraction and organization
- ✅ CSS optimization and design system
- ✅ Comprehensive error handling

**Ready to proceed to [Phase 2: Medium-Complexity Refactors](../phase-2/README.md)**