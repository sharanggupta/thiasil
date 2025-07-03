"use client";
import React from 'react';
import Button from "@/app/components/MainButton/Button";
import { formatRupee } from './utils';

interface ProductActionsProps {
  totalCost: number | null;
  isOutOfStock: boolean;
  onBuyNow: () => void;
}

export default function ProductActions({ totalCost, isOutOfStock, onBuyNow }: ProductActionsProps) {
  return (
    <div>
      <div style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: 8 }}>Total Cost</div>
      <div style={{ fontSize: "2.1rem", fontWeight: 200, marginBottom: 0 }}>
        {totalCost ? formatRupee(totalCost) : "-"}
      </div>
      <div style={{ fontSize: "1.1rem", fontWeight: 400, marginBottom: 18 }}>
        {totalCost ? "per pack" : ""}
      </div>
      <Button
        name={isOutOfStock ? "Unavailable" : "Buy Now!"}
        color="#0A6EBD"
        bgColor="#fff"
        size="medium"
        padding="px-4 py-2"
        textSize="text-sm"
        className="w-full max-w-[140px] mx-auto mt-2"
        onClick={isOutOfStock ? undefined : onBuyNow}
        disabled={isOutOfStock}
      />
    </div>
  );
}