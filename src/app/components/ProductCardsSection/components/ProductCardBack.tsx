"use client";
import React from 'react';
import Button from "../../MainButton/Button";
import { ProductCardData } from './types';

interface ProductCardBackProps {
  card: ProductCardData;
  onBuyNow: () => void;
}

export default function ProductCardBack({ card, onBuyNow }: ProductCardBackProps) {
  return (
    <div className={`absolute w-full h-full rounded-xs shadow-2xl backface-hidden rotate-y-180 ${card.backSideClass}`}>
      <div className="flex flex-col justify-center items-center p-8 h-full">
        <p className="mb-4 text-lg font-semibold text-white">
          Starts From
        </p>
        <h1 className="flex flex-col mb-24 text-7xl font-extralight text-center text-white">
          {card.startingPrice.split(' ')[0]} per <br /> 
          <span className="mt-10">{card.startingPrice.split(' ').slice(1).join(' ')}</span>
        </h1>

        <Button
          name="Buy Now!"
          color="#777777"
          bgColor="#ffffff"
          textSize="text-sm md:text-base"
          padding="px-7 md:px-10 py-3 md:py-5"
          onClick={onBuyNow}
        />
      </div>
    </div>
  );
}