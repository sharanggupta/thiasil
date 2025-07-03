"use client";
import React from 'react';
import SkeletonLoader from './SkeletonLoader';

export interface ProductListProps {
  children: React.ReactNode;
  spacing?: 'compact' | 'comfortable' | 'spacious';
  dividers?: boolean;
  loading?: boolean;
  loadingCount?: number;
  className?: string;
  itemClassName?: string;
  emptyState?: React.ReactNode;
}

export default function ProductList({
  children,
  spacing = 'comfortable',
  dividers = false,
  loading = false,
  loadingCount = 5,
  className = '',
  itemClassName = '',
  emptyState
}: ProductListProps) {
  const getSpacingClasses = () => {
    switch (spacing) {
      case 'compact':
        return 'space-y-2';
      case 'spacious':
        return 'space-y-8';
      default:
        return 'space-y-4';
    }
  };

  const getDividerClasses = () => {
    if (!dividers) return '';
    return 'divide-y divide-white/10';
  };

  const getItemPadding = () => {
    if (!dividers) return '';
    switch (spacing) {
      case 'compact':
        return 'py-2 first:pt-0 last:pb-0';
      case 'spacious':
        return 'py-6 first:pt-0 last:pb-0';
      default:
        return 'py-4 first:pt-0 last:pb-0';
    }
  };

  // Loading skeleton for list items
  const renderLoadingItems = () => {
    return Array.from({ length: loadingCount }).map((_, index) => (
      <div key={index} className={`${getItemPadding()} ${itemClassName}`}>
        <div className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-lg">
          {/* Image skeleton */}
          <SkeletonLoader
            variant="rounded-sm"
            width="80px"
            height="80px"
            className="bg-white/10 shrink-0"
          />
          
          {/* Content skeleton */}
          <div className="flex-1 space-y-2">
            <SkeletonLoader
              variant="text"
              width="60%"
              height="1.25rem"
              className="bg-white/10"
            />
            <SkeletonLoader
              variant="text"
              width="40%"
              height="1rem"
              className="bg-white/10"
            />
            <SkeletonLoader
              variant="text"
              width="80%"
              height="0.875rem"
              className="bg-white/10"
            />
          </div>
          
          {/* Action skeleton */}
          <div className="shrink-0 space-y-2">
            <SkeletonLoader
              variant="rounded-sm"
              width="80px"
              height="2rem"
              className="bg-white/10"
            />
            <SkeletonLoader
              variant="rounded-sm"
              width="60px"
              height="1.5rem"
              className="bg-white/10"
            />
          </div>
        </div>
      </div>
    ));
  };

  if (loading) {
    return (
      <div className={`${getSpacingClasses()} ${getDividerClasses()} ${className}`}>
        {renderLoadingItems()}
      </div>
    );
  }

  const childrenArray = React.Children.toArray(children);

  if (childrenArray.length === 0 && emptyState) {
    return (
      <div className={`text-center py-12 ${className}`}>
        {emptyState}
      </div>
    );
  }

  return (
    <div className={`${getSpacingClasses()} ${getDividerClasses()} ${className}`}>
      {React.Children.map(children, (child, index) => (
        <div key={index} className={`${getItemPadding()} ${itemClassName}`}>
          {child}
        </div>
      ))}
    </div>
  );
}