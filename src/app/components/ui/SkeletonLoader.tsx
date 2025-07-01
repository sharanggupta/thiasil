"use client";
import React from 'react';

export interface SkeletonLoaderProps {
  width?: string | number;
  height?: string | number;
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  animation?: 'pulse' | 'wave' | 'none';
  lines?: number; // For text variant
}

export default function SkeletonLoader({
  width = '100%',
  height = '1rem',
  className = '',
  variant = 'rectangular',
  animation = 'pulse',
  lines = 1
}: SkeletonLoaderProps) {
  const getVariantClasses = () => {
    switch (variant) {
      case 'text':
        return 'rounded';
      case 'circular':
        return 'rounded-full';
      case 'rounded':
        return 'rounded-lg';
      default:
        return 'rounded-sm';
    }
  };

  const getAnimationClasses = () => {
    switch (animation) {
      case 'wave':
        return 'animate-pulse bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 bg-[length:200%_100%] animate-wave';
      case 'none':
        return 'bg-gray-300';
      default:
        return 'animate-pulse bg-gray-300';
    }
  };

  const style = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  // For text variant with multiple lines
  if (variant === 'text' && lines > 1) {
    return (
      <div className={`space-y-2 ${className}`}>
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={`
              ${getVariantClasses()}
              ${getAnimationClasses()}
              ${index === lines - 1 ? 'w-3/4' : ''}
            `}
            style={{
              width: index === lines - 1 ? '75%' : style.width,
              height: style.height,
            }}
            role="status"
            aria-label={`Loading line ${index + 1}`}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`
        ${getVariantClasses()}
        ${getAnimationClasses()}
        ${className}
      `}
      style={style}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}