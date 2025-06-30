"use client";
import React from 'react';
import { NeonBubblesBackground } from "@/app/components/Glassmorphism";
import LoadingSpinner from './LoadingSpinner';

export interface LoadingStateProps {
  title?: string;
  message?: string;
  showBackground?: boolean;
  fullScreen?: boolean;
  size?: 'small' | 'medium' | 'large';
  className?: string;
  spinnerColor?: 'primary' | 'secondary' | 'white' | 'accent';
}

export default function LoadingState({
  title = 'Loading...',
  message = 'Please wait while we process your request.',
  showBackground = false,
  fullScreen = true,
  size = 'medium',
  className = '',
  spinnerColor = 'white'
}: LoadingStateProps) {
  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return {
          container: 'py-8',
          title: 'text-lg',
          message: 'text-sm',
          spinner: 'small' as const
        };
      case 'large':
        return {
          container: 'py-24',
          title: 'text-4xl',
          message: 'text-lg',
          spinner: 'xlarge' as const
        };
      default:
        return {
          container: 'py-16',
          title: 'text-2xl',
          message: 'text-base',
          spinner: 'large' as const
        };
    }
  };

  const sizeClasses = getSizeClasses();
  const containerClasses = fullScreen 
    ? 'min-h-screen relative overflow-hidden' 
    : 'relative overflow-hidden';

  const backgroundStyle = showBackground 
    ? { background: 'var(--dark-primary-gradient)' }
    : {};

  return (
    <div className={`${containerClasses} ${className}`} style={backgroundStyle}>
      {showBackground && <NeonBubblesBackground />}
      
      <div className={`relative z-10 container mx-auto px-4 ${sizeClasses.container}`}>
        <div className="text-center">
          {/* Loading Spinner */}
          <div className="flex justify-center mb-6">
            <LoadingSpinner 
              size={sizeClasses.spinner}
              color={spinnerColor}
              thickness="medium"
            />
          </div>

          {/* Title */}
          <h1 className={`${sizeClasses.title} font-bold text-white mb-4`}>
            {title}
          </h1>

          {/* Message */}
          <p className={`${sizeClasses.message} text-gray-300 max-w-md mx-auto`}>
            {message}
          </p>

          {/* Animated dots */}
          <div className="flex justify-center mt-6 space-x-1">
            <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}