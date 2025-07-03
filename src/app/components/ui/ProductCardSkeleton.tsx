"use client";
import React from 'react';
import { GlassCard } from "@/app/components/Glassmorphism";
import SkeletonLoader from './SkeletonLoader';

export interface ProductCardSkeletonProps {
  count?: number;
  className?: string;
}

export default function ProductCardSkeleton({
  count = 1,
  className = ''
}: ProductCardSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <GlassCard 
          key={index}
          variant="secondary" 
          padding="default" 
          className={`h-full flex flex-col animate-pulse ${className}`}
        >
          <div className="flex flex-col h-full">
            {/* Image Skeleton */}
            <div className="mb-4 relative">
              <SkeletonLoader
                variant="rounded-sm"
                width="100%"
                height="6rem"
                className="bg-white/10"
              />
            </div>
            
            {/* Product Header */}
            <div className="mb-4 space-y-2">
              {/* Product Name */}
              <SkeletonLoader
                variant="text"
                lines={2}
                height="1.25rem"
                className="bg-white/10"
              />
              
              {/* Cat No */}
              <div className="flex items-center gap-2">
                <SkeletonLoader
                  variant="circular"
                  width="1rem"
                  height="1rem"
                  className="bg-white/10"
                />
                <SkeletonLoader
                  variant="text"
                  width="60%"
                  height="0.875rem"
                  className="bg-white/10"
                />
              </div>
              
              {/* Capacity */}
              <div className="flex items-center gap-2">
                <SkeletonLoader
                  variant="circular"
                  width="1rem"
                  height="1rem"
                  className="bg-white/10"
                />
                <SkeletonLoader
                  variant="text"
                  width="40%"
                  height="0.875rem"
                  className="bg-white/10"
                />
              </div>
              
              {/* Packaging */}
              <div className="flex items-center gap-2">
                <SkeletonLoader
                  variant="circular"
                  width="1rem"
                  height="1rem"
                  className="bg-white/10"
                />
                <SkeletonLoader
                  variant="text"
                  width="50%"
                  height="0.875rem"
                  className="bg-white/10"
                />
              </div>
            </div>

            {/* Stock Status */}
            <div className="mb-4">
              <SkeletonLoader
                variant="rounded-sm"
                width="5rem"
                height="1.5rem"
                className="bg-white/10"
              />
            </div>

            {/* Price Section */}
            <div className="mb-6">
              <div className="rounded-xl p-4 border border-white/20 bg-white/5">
                <div className="text-center space-y-2">
                  <SkeletonLoader
                    variant="text"
                    width="60%"
                    height="0.875rem"
                    className="bg-white/10 mx-auto"
                  />
                  <SkeletonLoader
                    variant="text"
                    width="40%"
                    height="2rem"
                    className="bg-white/10 mx-auto"
                  />
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="mb-6 grow space-y-2">
              <SkeletonLoader
                variant="text"
                width="30%"
                height="0.875rem"
                className="bg-white/10"
              />
              <div className="space-y-1">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <SkeletonLoader
                      variant="circular"
                      width="0.25rem"
                      height="0.25rem"
                      className="bg-white/10"
                    />
                    <SkeletonLoader
                      variant="text"
                      width={`${60 + Math.random() * 30}%`}
                      height="0.75rem"
                      className="bg-white/10"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-auto space-y-2">
              <SkeletonLoader
                variant="rounded-sm"
                width="100%"
                height="2.5rem"
                className="bg-white/10"
              />
              <SkeletonLoader
                variant="rounded-sm"
                width="100%"
                height="2.5rem"
                className="bg-white/10"
              />
            </div>
          </div>
        </GlassCard>
      ))}
    </>
  );
}