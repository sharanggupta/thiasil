"use client";
import React from 'react';
import styles from "../ProductVariantCard.module.css";

interface ProductInfoProps {
  variant: any;
}

export default function ProductInfo({ variant }: ProductInfoProps) {
  const renderDimensions = () => {
    if (!variant.dimensions || Object.keys(variant.dimensions).length === 0) {
      return null;
    }

    const dimensionText = Object.entries(variant.dimensions)
      .filter(([key, value]) => value && value !== 'N/A' && value.toString().trim() !== '')
      .map(([key, value]) => {
        const shortKey = key === 'length' ? 'L' : 
                         key === 'width' ? 'W' : 
                         key === 'height' ? 'H' : 
                         key === 'diameter' ? 'D' : 
                         key.charAt(0).toUpperCase();
        return `${shortKey}: ${value}`;
      })
      .join('mm, ');

    return dimensionText ? <p>{dimensionText}mm</p> : null;
  };

  return (
    <>
      <div className={styles["variant-card-labelContainer"]}>
        <span className={styles["variant-card-label"]}>
          {variant.capacity ? `${variant.capacity}` : variant.name}
        </span>
      </div>
      <div className={styles["variant-card-info"]}>
        <p>Cat No: {variant.catNo}</p>
        {variant.capacity && variant.capacity !== 'N/A' && variant.capacity !== 'Custom' && (
          <p>capacity: {variant.capacity}</p>
        )}
        {renderDimensions()}
        {variant.packaging && variant.packaging !== 'N/A' && (
          <p>packaging: {variant.packaging}</p>
        )}
        <p>pricing: {variant.price ? variant.price : 'varies with size'}</p>
      </div>
    </>
  );
}