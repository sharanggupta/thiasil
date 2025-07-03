"use client";
import React from 'react';
import { getProductImageInfo } from "@/lib/image-utils";
import styles from "../ProductVariantCard.module.css";

interface ProductImageProps {
  variant: any;
  productImage: string;
}

export default function ProductImage({ variant, productImage }: ProductImageProps) {
  const { url: imageUrl, hasImage } = getProductImageInfo(variant, productImage);

  if (hasImage) {
    return (
      <div
        className={styles["variant-card-picture"]}
        style={{
          backgroundImage: `var(--card-overlay-gradient), url('${imageUrl}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundBlendMode: 'screen',
        }}
      />
    );
  }

  return (
    <div
      className={styles["variant-card-picture"]}
      style={{
        background: 'var(--card-overlay-gradient)',
        backgroundBlendMode: 'screen',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center'
      }}
    >
      <div className="flex flex-col items-center justify-center text-gray-400 mb-2">
        <svg 
          width="40" 
          height="40" 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="opacity-40"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none"/>
          <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" opacity="0.6"/>
          <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.6"/>
        </svg>
      </div>
    </div>
  );
}