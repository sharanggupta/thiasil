"use client";
import React from 'react';
import ProductCardFront from './ProductCardFront';
import ProductCardBack from './ProductCardBack';
import ProductCardCTA from './ProductCardCTA';
import { ProductCardProps } from './types';

export default function ProductCard({ card, onBuyNow }: ProductCardProps) {
  return (
    <div className="group w-[339px] h-[540px] perspective">
      <div className="relative w-full h-full transition-transform duration-700 transform-style-preserve-3d group-hover:rotate-y-180">
        {/* Front side */}
        <ProductCardFront card={card} />
        
        {/* Card CTA for mobile screens */}
        <ProductCardCTA card={card} onBuyNow={onBuyNow} />

        {/* Back side */}
        <ProductCardBack card={card} onBuyNow={onBuyNow} />
      </div>
    </div>
  );
}