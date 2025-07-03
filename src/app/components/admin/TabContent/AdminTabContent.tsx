"use client";
import React from 'react';
import { GlassCard } from "@/app/components/Glassmorphism";
import TabRenderer from './TabRenderer';
import { AdminTabContentProps } from './types';

export default function AdminTabContentV2({
  activeTab,
  onTabChange,
  data,
  isLoading,
  priceManagement,
  inventoryManagement,
  imageAnalysis,
  productAddition,
  couponManagement
}: AdminTabContentProps) {
  return (
    <section className="w-full">
      <GlassCard variant="secondary" padding="large" className="w-full">
        <TabRenderer
          activeTab={activeTab}
          onTabChange={onTabChange}
          data={data}
          isLoading={isLoading}
          priceManagement={priceManagement}
          inventoryManagement={inventoryManagement}
          imageAnalysis={imageAnalysis}
          productAddition={productAddition}
          couponManagement={couponManagement}
        />
      </GlassCard>
    </section>
  );
}