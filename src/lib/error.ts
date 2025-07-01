/**
 * Error logging utility for centralized error handling
 */

// Error severity levels
export const ERROR_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
} as const;

// Error categories
export const ERROR_CATEGORIES = {
  API: 'api',
  COMPONENT: 'component',
  NETWORK: 'network',
  VALIDATION: 'validation',
  AUTH: 'auth',
  UNKNOWN: 'unknown',
} as const;

export type ErrorLevel = typeof ERROR_LEVELS[keyof typeof ERROR_LEVELS];
export type ErrorCategory = typeof ERROR_CATEGORIES[keyof typeof ERROR_CATEGORIES];

export interface ErrorContext {
  level?: ErrorLevel;
  category?: ErrorCategory;
  userId?: string;
  sessionId?: string;
  componentName?: string;
  props?: Record<string, any>;
  endpoint?: string;
  method?: string;
  payload?: any;
  responseStatus?: number;
  responseData?: any;
  field?: string;
  value?: any;
  rule?: string;
  action?: string;
  [key: string]: any;
}

export interface ErrorData extends ErrorContext {
  timestamp: string;
  message: string;
  stack?: string;
  userAgent: string;
  url: string;
  userId: string;
  sessionId: string;
  level: ErrorLevel;
  category: ErrorCategory;
}

/**
 * Log an error with context information
 */
export function logError(error: Error | string, context: ErrorContext = {}): void {
  const errorData: ErrorData = {
    timestamp: new Date().toISOString(),
    message: error instanceof Error ? error.message : error,
    stack: error instanceof Error ? error.stack : undefined,
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
function generateSessionId(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

/**
 * Send error to external service
 */
function sendToErrorService(errorData: ErrorData): void {
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
function storeErrorLocally(errorData: ErrorData): void {
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
export function logApiError(
  error: Error | any, 
  endpoint: string, 
  method: string = 'GET', 
  payload: any = null
): void {
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
export function logComponentError(
  error: Error | string, 
  componentName: string, 
  props: Record<string, any> = {}
): void {
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
export function logValidationError(
  field: string, 
  value: any, 
  rule: string, 
  message: string
): void {
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
export function logAuthError(error: Error | string, action: string): void {
  logError(error, {
    category: ERROR_CATEGORIES.AUTH,
    level: ERROR_LEVELS.HIGH,
    action,
  });
}

/**
 * Utility to get stored errors (development only)
 */
export function getStoredErrors(): ErrorData[] {
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
export function clearStoredErrors(): void {
  if (process.env.NODE_ENV !== 'development') return;
  
  try {
    localStorage.removeItem('debug_errors');
  } catch (e) {
    // Silently fail
  }
}