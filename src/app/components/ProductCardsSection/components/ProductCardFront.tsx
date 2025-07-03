"use client";
import React from 'react';
import { ProductCardData } from './types';

interface ProductCardFrontProps {
  card: ProductCardData;
}

export default function ProductCardFront({ card }: ProductCardFrontProps) {
  return (
    <div className="absolute w-full h-full bg-white rounded-lg shadow-2xl backface-hidden">
      <div className={`${card.gradientClass} card__picture`}></div>
      <div className="absolute text-right top-28 right-0">
        <h3 className="text-[#ffffff] flex flex-col text-lg md:text-3xl mr-5">
          <span className={`${card.headingClasses[0]} ${card.id === 'card2' ? '' : 'self-end w-fit'}`}>
            {card.title[0]}
          </span>
          <span className={`${card.headingClasses[1]} ${card.id === 'card2' ? 'self-end w-fit' : ''}`}>
            {card.title[1]}
          </span>
        </h3>
      </div>
      <div className="mt-12 text-sm text-center text-custom-gray md:text-base">
        <p className="p-2 mx-10 mt-2 border-b md:p-3">
          capacity: {card.capacity}
        </p>
        <p className="p-2 mx-10 border-b md:p-3">
          packaging: {card.packaging}
        </p>
        <p className="p-2 mx-10 border-b md:p-3">
          pricing: {card.pricing}
        </p>
      </div>
    </div>
  );
}