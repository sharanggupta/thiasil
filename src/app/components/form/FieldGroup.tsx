"use client";
import React from 'react';

export interface FieldGroupProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4;
  gap?: 'small' | 'medium' | 'large';
  responsive?: boolean;
  className?: string;
}

export default function FieldGroup({
  children,
  columns = 2,
  gap = 'medium',
  responsive = true,
  className = ''
}: FieldGroupProps) {
  const getGridClasses = () => {
    const gapClasses = {
      small: 'gap-2',
      medium: 'gap-4',
      large: 'gap-6'
    };

    const columnClasses = {
      1: 'grid-cols-1',
      2: responsive ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-2',
      3: responsive ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-3',
      4: responsive ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4' : 'grid-cols-4'
    };

    return `grid ${columnClasses[columns]} ${gapClasses[gap]}`;
  };

  return (
    <div className={`field-group ${getGridClasses()} ${className}`}>
      {children}
    </div>
  );
}