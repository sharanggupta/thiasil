'use client';

import { useDeferredValue, ReactNode } from 'react';

interface DeferredComponentProps {
  children: ReactNode;
  value: any;
  fallback?: ReactNode;
}

/**
 * Component that uses React 18's useDeferredValue to defer non-urgent updates
 * Improves responsiveness during heavy operations
 */
export default function DeferredComponent({ 
  children, 
  value, 
  fallback 
}: DeferredComponentProps) {
  const deferredValue = useDeferredValue(value);
  const isDeferred = deferredValue !== value;

  if (isDeferred && fallback) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

/**
 * Hook that provides deferred filtering capabilities
 * Useful for search and filter operations
 */
export function useDeferredFilters<T>(filters: T) {
  const deferredFilters = useDeferredValue(filters);
  const isFiltering = deferredFilters !== filters;

  return {
    deferredFilters,
    isFiltering
  };
}