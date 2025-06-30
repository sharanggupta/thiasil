"use client";
import React from 'react';

export interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  color?: 'primary' | 'secondary' | 'white' | 'accent';
  thickness?: 'thin' | 'medium' | 'thick';
  className?: string;
}

export default function LoadingSpinner({
  size = 'medium',
  color = 'primary',
  thickness = 'medium',
  className = ''
}: LoadingSpinnerProps) {
  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'w-4 h-4';
      case 'large':
        return 'w-8 h-8';
      case 'xlarge':
        return 'w-12 h-12';
      default:
        return 'w-6 h-6';
    }
  };

  const getColorClasses = () => {
    switch (color) {
      case 'secondary':
        return 'border-gray-300 border-t-gray-600';
      case 'white':
        return 'border-white/30 border-t-white';
      case 'accent':
        return 'border-purple-300 border-t-purple-600';
      default:
        return 'border-blue-300 border-t-blue-600';
    }
  };

  const getThicknessClasses = () => {
    switch (thickness) {
      case 'thin':
        return 'border-2';
      case 'thick':
        return 'border-4';
      default:
        return 'border-3';
    }
  };

  return (
    <div
      className={`
        ${getSizeClasses()}
        ${getColorClasses()}
        ${getThicknessClasses()}
        border-solid
        rounded-full
        animate-spin
        ${className}
      `}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}