"use client";
import React from 'react';
import Image from "next/image";
import productDetailsStyles from "../ProductDetails.module.css";

interface ProductHeroProps {
  product: {
    name: string;
    description: string;
    image?: string;
  };
  category: string;
}

export default function ProductHero({ product, category }: ProductHeroProps) {
  return (
    <div className="relative w-full" style={{ minHeight: '500px' }} id="product-hero">
      {/* Background gradient with clip-path */}
      <div 
        className="absolute inset-0 z-0" 
        style={{ 
          background: 'var(--primary-gradient)', 
          clipPath: 'polygon(0 0, 100% 0, 100% 70%, 0 100%)', 
          WebkitClipPath: 'polygon(0 0, 100% 0, 100% 70%, 0 100%)' 
        }} 
      />
      
      {/* Hero content */}
      <div className="flex relative z-10 flex-col justify-center items-center py-32 w-full h-full text-center text-white">
        <h1
          className={`leading-[1.1] mb-0 md:mb-5 uppercase ${productDetailsStyles.productDetailsTitle}`}
          style={{ letterSpacing: '0.16em' }}
        >
          {(product.name || "").toUpperCase()}
        </h1>
        <p
          className="mx-auto mt-8 max-w-2xl text-base font-semibold leading-5 uppercase md:text-xl md:leading-10"
          style={{ letterSpacing: '0.08em' }}
        >
          {product.description}
        </p>
      </div>
      
      {/* Product image as a large, circular avatar overlapping the cut */}
      {product.image && (
        <div
          className="absolute z-20 flex justify-center items-center w-[55vw] h-[55vw] max-w-[180px] max-h-[180px] md:w-[350px] md:h-[350px] md:max-w-[350px] md:max-h-[350px] left-1/2 -translate-x-1/2 bottom-[-40px] md:left-[20%] md:-translate-x-[30%] md:bottom-[-160px] md:translate-x-0"
          id="product-image-avatar"
        >
          <div className="flex overflow-hidden relative justify-center items-center w-full h-full bg-white rounded-full border-4 border-white shadow-xl">
            <Image
              src={product.image}
              alt={product.name}
              width={350}
              height={350}
              className="object-cover w-full h-full rounded-full"
              priority
            />
          </div>
        </div>
      )}
    </div>
  );
}