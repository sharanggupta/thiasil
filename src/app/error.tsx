'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { logError, ERROR_CATEGORIES, ERROR_LEVELS } from '@/lib/error';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error
    logError(error, {
      category: ERROR_CATEGORIES.COMPONENT,
      level: ERROR_LEVELS.HIGH,
      page: 'global-error-boundary',
    });
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="glass-effect rounded-2xl p-8 max-w-lg text-center">
        <div className="text-4xl mb-6">⚠️</div>
        
        <h1 className="heading-1 mb-4">
          Something went wrong
        </h1>
        
        <p className="body-large text-white/80 mb-6">
          We encountered an unexpected error. This has been reported to our team.
        </p>
        
        {process.env.NODE_ENV === 'development' && (
          <details className="text-left mb-6 text-sm">
            <summary className="cursor-pointer text-white/60 mb-2">Error Details (Development)</summary>
            <pre className="bg-black/30 p-4 rounded-lg overflow-auto max-h-40 text-white/90 text-xs">
              {error.message}
              {'\n\n'}
              {error.stack}
            </pre>
          </details>
        )}
        
        <div className="flex gap-4 justify-center flex-wrap">
          <button
            onClick={reset}
            className="btn-base btn-glass"
          >
            Try Again
          </button>
          
          <Link href="/" className="btn-base bg-white/10 hover:bg-white/20 text-white border border-white/20">
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}