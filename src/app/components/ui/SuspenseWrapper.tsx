'use client';

import { Suspense, ReactNode } from 'react';
import LoadingSpinner from './LoadingSpinner';

interface SuspenseWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
  className?: string;
}

/**
 * Wrapper component that provides Suspense boundaries with loading fallbacks
 * Improves user experience during async operations
 */
export default function SuspenseWrapper({ 
  children, 
  fallback, 
  className = '' 
}: SuspenseWrapperProps) {
  const defaultFallback = (
    <div className={`flex items-center justify-center min-h-[200px] ${className}`}>
      <LoadingSpinner size="medium" />
    </div>
  );

  return (
    <Suspense fallback={fallback || defaultFallback}>
      {children}
    </Suspense>
  );
}