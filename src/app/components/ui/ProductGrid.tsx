"use client";
import React from 'react';
import ProductCardSkeleton from './ProductCardSkeleton';

export interface ProductGridProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4 | 5 | 6;
  gap?: 'small' | 'medium' | 'large';
  loading?: boolean;
  loadingCount?: number;
  className?: string;
  responsive?: boolean;
  minItemWidth?: string;
}

export default function ProductGrid({
  children,
  columns = 3,
  gap = 'medium',
  loading = false,
  loadingCount = 6,
  className = '',
  responsive = true,
  minItemWidth = '280px'
}: ProductGridProps) {
  const getGridClasses = () => {
    const gapClasses = {
      small: 'gap-4',
      medium: 'gap-6',
      large: 'gap-8'
    };

    if (responsive) {
      // Responsive grid with auto-fit
      return `grid auto-fit-grid ${gapClasses[gap]}`;
    } else {
      // Fixed column grid
      const columnClasses = {
        1: 'grid-cols-1',
        2: 'grid-cols-2',
        3: 'grid-cols-3',
        4: 'grid-cols-4',
        5: 'grid-cols-5',
        6: 'grid-cols-6'
      };
      return `grid ${columnClasses[columns]} ${gapClasses[gap]}`;
    }
  };

  const gridStyle = responsive ? {
    gridTemplateColumns: `repeat(auto-fit, minmax(${minItemWidth}, 1fr))`
  } : {};

  if (loading) {
    return (
      <div 
        className={`${getGridClasses()} items-stretch ${className}`}
        style={gridStyle}
      >
        <ProductCardSkeleton count={loadingCount} />
      </div>
    );
  }

  return (
    <div 
      className={`${getGridClasses()} items-stretch ${className}`}
      style={gridStyle}
    >
      {children}
    </div>
  );
}