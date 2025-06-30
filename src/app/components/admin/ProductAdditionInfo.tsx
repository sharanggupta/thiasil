"use client";
import React from 'react';
import { GlassContainer } from "@/app/components/Glassmorphism";

export default function ProductAdditionInfo() {
  return (
    <GlassContainer className="mt-4 mb-6">
      <h4 className="text-lg font-semibold text-white mb-3">How to Use</h4>
      <div className="space-y-2 text-sm text-white/80">
        <p>• <strong>Categories:</strong> Create new product categories with custom dimension fields</p>
        <p>• <strong>Dimension Fields:</strong> Define custom measurement fields (e.g., Length, Width, Height) with units</p>
        <p>• <strong>Products:</strong> Add product variants to existing categories with specific dimensions</p>
        <p>• <strong>Dynamic Forms:</strong> Product forms automatically adapt to category dimension fields</p>
        <p>• <strong>Auto-backup:</strong> All changes are automatically backed up before saving</p>
      </div>
    </GlassContainer>
  );
}