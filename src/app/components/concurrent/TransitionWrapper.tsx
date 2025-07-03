'use client';

import { startTransition, useTransition } from 'react';
import { ReactNode } from 'react';

/**
 * Props for the TransitionWrapper component
 */
interface TransitionWrapperProps {
  /** Child components to wrap with transition */
  children: ReactNode;
  /** Callback function to execute during transition */
  onTransition?: () => void;
  /** Loading state indicator component */
  fallback?: ReactNode;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Wrapper component that provides React 18+ concurrent features
 * Uses startTransition for non-urgent state updates to improve responsiveness
 */
export default function TransitionWrapper({
  children,
  onTransition,
  fallback,
  className = ''
}: TransitionWrapperProps) {
  const [isPending, startTransitionInternal] = useTransition();

  const handleTransition = (callback?: () => void) => {
    startTransitionInternal(() => {
      onTransition?.();
      callback?.();
    });
  };

  if (isPending && fallback) {
    return (
      <div className={`transition-pending ${className}`}>
        {fallback}
      </div>
    );
  }

  return (
    <div className={className}>
      {children}
    </div>
  );
}

/**
 * Hook to access transition functionality
 * Provides utilities for managing concurrent updates
 */
export function useTransitionHelpers() {
  const [isPending, startTransitionInternal] = useTransition();

  const startNonUrgentUpdate = (callback: () => void) => {
    startTransition(callback);
  };

  const startTransitionWithCallback = (callback: () => void) => {
    startTransitionInternal(callback);
  };

  return {
    isPending,
    startNonUrgentUpdate,
    startTransitionWithCallback
  };
}