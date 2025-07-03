"use client";
import React from 'react';
import ProductImage from './ProductImage';
import ProductInfo from './ProductInfo';
import ProductActions from './ProductActions';
import { calculateTotalCost, createPrefillMessage } from './utils';
import styles from "../ProductVariantCard.module.css";

interface ProductVariantCardProps {
  variant: any;
  productImage: string;
}

export default function ProductVariantCard({ variant, productImage }: ProductVariantCardProps) {
  const isOutOfStock = variant.stockStatus !== 'in_stock';
  const totalCost = calculateTotalCost(variant.packaging, variant.price);

  const handleBuyNow = () => {
    const prefillMessage = createPrefillMessage(variant, totalCost);
    window.location.href = `/contact?message=${prefillMessage}`;
  };

  return (
    <div className={`${styles["variant-card"]} ${isOutOfStock ? styles["out-of-stock"] : ""}`}>
      <div className={styles["variant-card-inner"]}>
        {/* Front Side */}
        <div className={styles["variant-card-front"]}>
          <ProductImage variant={variant} productImage={productImage} />
          <ProductInfo variant={variant} />
        </div>
        
        {/* Back Side */}
        <div className={styles["variant-card-backRect"]}>
          <ProductActions 
            totalCost={totalCost}
            isOutOfStock={isOutOfStock}
            onBuyNow={handleBuyNow}
          />
        </div>
      </div>
    </div>
  );
}