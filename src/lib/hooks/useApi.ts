import { useState, useCallback, useRef, useEffect } from 'react';

// Types
export interface ApiError {
  message: string;
  status: number;
  code?: string;
  details?: Record<string, any>;
  timestamp: number;
  endpoint: string;
  method: string;
  stack?: string;
}

export interface UseApiOptions<T> {
  endpoint: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  initialData?: T;
  immediate?: boolean;
  cacheKey?: string;
  retryAttempts?: number;
  retryDelay?: number;
  headers?: Record<string, string>;
  transform?: (data: any) => T;
  onSuccess?: (data: T) => void;
  onError?: (error: ApiError) => void;
  abortOnUnmount?: boolean;
}

export interface UseApiResult<T> {
  data: T | null;
  isLoading: boolean;
  error: ApiError | null;
  execute: (requestData?: any, options?: Partial<UseApiOptions<T>>) => Promise<T>;
  retry: () => Promise<T>;
  reset: () => void;
  abort: () => void;
  isAborted: boolean;
}

// Error types
export const ERROR_TYPES = {
  NETWORK: 'NETWORK_ERROR',
  VALIDATION: 'VALIDATION_ERROR',
  AUTHENTICATION: 'AUTH_ERROR',
  AUTHORIZATION: 'PERMISSION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  SERVER_ERROR: 'SERVER_ERROR',
  TIMEOUT: 'TIMEOUT_ERROR',
  ABORT: 'ABORT_ERROR',
} as const;

// Simple in-memory cache
class ApiCache {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

  set(key: string, data: any, ttl: number = 5 * 60 * 1000) { // 5 minutes default
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  get(key: string): any {
    const cached = this.cache.get(key);
    if (!cached) return null;

    const isExpired = Date.now() - cached.timestamp > cached.ttl;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  invalidate(key: string) {
    this.cache.delete(key);
  }

  clear() {
    this.cache.clear();
  }
}

const apiCache = new ApiCache();

// Request deduplication
const pendingRequests = new Map<string, Promise<any>>();

// Helper to create API error
function createApiError(
  message: string,
  status: number,
  endpoint: string,
  method: string,
  details?: any,
  code?: string
): ApiError {
  return {
    message,
    status,
    code,
    details,
    timestamp: Date.now(),
    endpoint,
    method,
    stack: new Error().stack
  };
}

// Helper to get error details from response
async function getErrorDetails(response: Response): Promise<any> {
  try {
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      return await response.json();
    }
    return await response.text();
  } catch {
    return null;
  }
}

// Sleep utility for retry delays
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Main hook
export function useApi<T = any>(options: UseApiOptions<T>): UseApiResult<T> {
  const {
    endpoint,
    method = 'GET',
    initialData = null,
    immediate = false,
    cacheKey,
    retryAttempts = 3,
    retryDelay = 1000,
    headers = {},
    transform,
    onSuccess,
    onError,
    abortOnUnmount = true
  } = options;

  const [data, setData] = useState<T | null>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [isAborted, setIsAborted] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);
  const lastRequestRef = useRef<any>(null);
  const mountedRef = useRef(true);

  // Create request key for deduplication and caching
  const createRequestKey = useCallback((requestData?: any) => {
    const key = `${method}:${endpoint}`;
    if (requestData && method !== 'GET') {
      return `${key}:${JSON.stringify(requestData)}`;
    }
    return key;
  }, [method, endpoint]);

  // Execute API request
  const execute = useCallback(async (
    requestData?: any,
    overrideOptions?: Partial<UseApiOptions<T>>
  ): Promise<T> => {
    const requestKey = createRequestKey(requestData);
    
    // Check cache for GET requests
    if (method === 'GET' && cacheKey) {
      const cached = apiCache.get(cacheKey);
      if (cached) {
        setData(cached);
        if (onSuccess) onSuccess(cached);
        return cached;
      }
    }

    // Request deduplication
    if (pendingRequests.has(requestKey)) {
      return pendingRequests.get(requestKey);
    }

    // Abort previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();
    setIsAborted(false);
    setIsLoading(true);
    setError(null);

    const actualOptions = { ...options, ...overrideOptions };
    const requestPromise = performRequest(requestData, actualOptions, requestKey);
    
    // Store pending request for deduplication
    pendingRequests.set(requestKey, requestPromise);

    try {
      const result = await requestPromise;
      return result;
    } finally {
      // Clean up pending request
      pendingRequests.delete(requestKey);
    }
  }, [method, endpoint, cacheKey, onSuccess, options, createRequestKey]);

  // Perform the actual request with retry logic
  const performRequest = async (
    requestData: any,
    actualOptions: UseApiOptions<T>,
    requestKey: string,
    attempt: number = 1
  ): Promise<T> => {
    try {
      const requestOptions: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
          ...actualOptions.headers
        },
        signal: abortControllerRef.current?.signal
      };

      if (requestData && method !== 'GET') {
        requestOptions.body = JSON.stringify(requestData);
      }

      const response = await fetch(endpoint, requestOptions);

      if (!mountedRef.current) {
        throw createApiError('Component unmounted', 0, endpoint, method, null, ERROR_TYPES.ABORT);
      }

      if (!response.ok) {
        const errorDetails = await getErrorDetails(response);
        const errorCode = response.status === 401 ? ERROR_TYPES.AUTHENTICATION :
                         response.status === 403 ? ERROR_TYPES.AUTHORIZATION :
                         response.status === 404 ? ERROR_TYPES.NOT_FOUND :
                         response.status >= 500 ? ERROR_TYPES.SERVER_ERROR :
                         ERROR_TYPES.VALIDATION;

        throw createApiError(
          errorDetails?.message || `Request failed with status ${response.status}`,
          response.status,
          endpoint,
          method,
          errorDetails,
          errorCode
        );
      }

      const responseData = await response.json();
      const transformedData = transform ? transform(responseData) : responseData;

      if (mountedRef.current) {
        setData(transformedData);
        setIsLoading(false);

        // Cache successful GET requests
        if (method === 'GET' && cacheKey) {
          apiCache.set(cacheKey, transformedData);
        }

        if (onSuccess) onSuccess(transformedData);
      }

      lastRequestRef.current = requestData;
      return transformedData;

    } catch (err: any) {
      if (err.name === 'AbortError') {
        setIsAborted(true);
        setIsLoading(false);
        throw createApiError('Request aborted', 0, endpoint, method, null, ERROR_TYPES.ABORT);
      }

      // Retry logic
      if (attempt < retryAttempts && err.status >= 500) {
        await sleep(retryDelay * Math.pow(2, attempt - 1)); // Exponential backoff
        return performRequest(requestData, actualOptions, requestKey, attempt + 1);
      }

      const apiError = err.endpoint ? err : createApiError(
        err.message || 'Network error occurred',
        0,
        endpoint,
        method,
        { originalError: err.message },
        ERROR_TYPES.NETWORK
      );

      if (mountedRef.current) {
        setError(apiError);
        setIsLoading(false);
        if (onError) onError(apiError);
      }

      throw apiError;
    }
  };

  // Retry last request
  const retry = useCallback(async (): Promise<T> => {
    if (!lastRequestRef.current && method === 'GET') {
      return execute();
    }
    return execute(lastRequestRef.current);
  }, [execute, method]);

  // Reset state
  const reset = useCallback(() => {
    setData(initialData);
    setIsLoading(false);
    setError(null);
    setIsAborted(false);
    lastRequestRef.current = null;
  }, [initialData]);

  // Abort current request
  const abort = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  // Execute immediate request
  useEffect(() => {
    if (immediate) {
      execute().catch(() => {
        // Error is already handled in execute
      });
    }
  }, [immediate, execute]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (abortOnUnmount && abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [abortOnUnmount]);

  return {
    data,
    isLoading,
    error,
    execute,
    retry,
    reset,
    abort,
    isAborted
  };
}

// Specialized hooks for common HTTP methods
export function useApiGet<T = any>(
  endpoint: string, 
  options?: Omit<UseApiOptions<T>, 'method' | 'endpoint'>
): UseApiResult<T> {
  return useApi<T>({ ...options, endpoint, method: 'GET' });
}

export function useApiPost<T = any>(
  endpoint: string,
  options?: Omit<UseApiOptions<T>, 'method' | 'endpoint'>
): UseApiResult<T> {
  return useApi<T>({ ...options, endpoint, method: 'POST' });
}

export function useApiPut<T = any>(
  endpoint: string,
  options?: Omit<UseApiOptions<T>, 'method' | 'endpoint'>
): UseApiResult<T> {
  return useApi<T>({ ...options, endpoint, method: 'PUT' });
}

export function useApiDelete<T = any>(
  endpoint: string,
  options?: Omit<UseApiOptions<T>, 'method' | 'endpoint'>
): UseApiResult<T> {
  return useApi<T>({ ...options, endpoint, method: 'DELETE' });
}

// Cache utilities
export const apiCacheUtils = {
  invalidate: (key: string) => apiCache.invalidate(key),
  clear: () => apiCache.clear(),
  get: (key: string) => apiCache.get(key),
};