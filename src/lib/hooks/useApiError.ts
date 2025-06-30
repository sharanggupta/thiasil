import { useState, useCallback } from 'react';
import { logApiError } from '../error';

export interface ApiError {
  message: string;
  status: number;
  statusText: string;
  endpoint: string;
  method: string;
}

export function useApiError() {
  const [error, setError] = useState<ApiError | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleApiCall = useCallback(async <T>(
    apiCall: () => Promise<T>, 
    endpoint: string, 
    method: string = 'GET'
  ): Promise<T> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await apiCall();
      setIsLoading(false);
      return result;
    } catch (err: any) {
      const apiError: ApiError = {
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

  const retry = useCallback(async <T>(
    apiCall: () => Promise<T>, 
    endpoint: string, 
    method: string = 'GET'
  ): Promise<T> => {
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