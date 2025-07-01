"use client";
import React from 'react';
import LoadingSpinner from './LoadingSpinner';

export interface LoadingOverlayProps {
  show: boolean;
  message?: string;
  transparent?: boolean;
  blur?: boolean;
  className?: string;
}

export default function LoadingOverlay({
  show,
  message = 'Loading...',
  transparent = false,
  blur = true,
  className = ''
}: LoadingOverlayProps) {
  if (!show) return null;

  const overlayClasses = `
    fixed inset-0 z-50 flex items-center justify-center
    ${transparent ? 'bg-black/20' : 'bg-black/50'}
    ${blur ? 'backdrop-blur-sm' : ''}
    ${className}
  `;

  return (
    <div className={overlayClasses}>
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-8 text-center max-w-sm mx-4">
        {/* Loading Spinner */}
        <div className="flex justify-center mb-4">
          <LoadingSpinner 
            size="large"
            color="white"
            thickness="medium"
          />
        </div>

        {/* Message */}
        <p className="text-white/90 text-lg font-medium">
          {message}
        </p>

        {/* Animated dots */}
        <div className="flex justify-center mt-4 space-x-1">
          <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
}