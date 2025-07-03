"use client";
import React from 'react';
import Button from "../../MainButton/Button";
import { ProductCardData } from './types';

interface ProductCardCTAProps {
  card: ProductCardData;
  onBuyNow: () => void;
}

export default function ProductCardCTA({ card, onBuyNow }: ProductCardCTAProps) {
  return (
    <div
      className={`absolute bottom-0 w-full bg-black card-cta-mobile ${card.ctaClass}`}
      style={{ clipPath: "polygon(100% 0, 100% 100%, 0 100%, 0 19%)" }}
    >
      <div className="flex flex-col justify-center items-center p-8 h-full">
        <p className="mb-2 text-sm font-semibold text-white">
          Starts From
        </p>
        <h1 className="flex flex-col mb-4 text-2xl font-extralight text-center text-white">
          {card.startingPrice}
        </h1>

        <Button
          name="Buy Now!"
          color="#777777"
          bgColor="#ffffff"
          textSize="text-[10px] md:text-base"
          padding="px-7 md:px-10 py-3 md:py-5"
          onClick={onBuyNow}
        />
      </div>
    </div>
  );
}