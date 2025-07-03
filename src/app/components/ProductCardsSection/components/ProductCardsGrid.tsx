"use client";
import React from 'react';
import ProductCard from './ProductCard';
import { ProductCardData } from './types';

interface ProductCardsGridProps {
  cards: ProductCardData[];
  onBuyNow: () => void;
}

export default function ProductCardsGrid({ cards, onBuyNow }: ProductCardsGridProps) {
  return (
    <div className="flex flex-col gap-16 justify-center items-center custom-mobile:flex-row">
      {cards.map((card) => (
        <ProductCard 
          key={card.id} 
          card={card} 
          onBuyNow={onBuyNow} 
        />
      ))}
    </div>
  );
}