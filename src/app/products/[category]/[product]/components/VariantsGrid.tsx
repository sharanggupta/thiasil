"use client";
import React from 'react';
import ProductVariantCard from './ProductVariantCard';

interface VariantsGridProps {
  variants: any[];
  productImage: string;
}

export default function VariantsGrid({ variants, productImage }: VariantsGridProps) {
  if (!variants.length) {
    return (
      <div className="px-4 py-32 mx-auto max-w-5xl text-center">
        <div className="mt-[80px] md:mt-[180px]">
          <p className="text-gray-600">No variants available for this product.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-32 mx-auto max-w-6xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 sm:gap-16 lg:gap-20 mt-[80px] md:mt-[180px] justify-items-center">
        {variants.map((variant) => (
          <ProductVariantCard 
            key={variant.catNo || variant.id} 
            variant={variant} 
            productImage={productImage} 
          />
        ))}
      </div>
    </div>
  );
}