"use client";
import React from 'react';
import { GlassCard, GlassIcon, GlassButton } from "@/app/components/Glassmorphism";
import Heading from "@/app/components/common/Heading";
import { CategoryData } from "@/lib/hooks/useCategoryData";

interface CategoryHeroProps {
  categoryData: CategoryData;
  couponCode: string;
  setCouponCode: (code: string) => void;
  activeCoupon: any;
  couponMessage: string;
  isApplyingCoupon: boolean;
  applyCoupon: () => void;
  clearCoupon: () => void;
}

export default function CategoryHero({
  categoryData,
  couponCode,
  setCouponCode,
  activeCoupon,
  couponMessage,
  isApplyingCoupon,
  applyCoupon,
  clearCoupon
}: CategoryHeroProps) {
  return (
    <section className="flex flex-col items-center justify-center pb-10">
      <GlassCard variant="primary" padding="large" className="w-full max-w-4xl flex flex-col items-center text-center">
        <div className="flex items-center gap-4 mb-6">
          <GlassIcon icon={categoryData.icon || "🧪"} variant="primary" size="large" />
          <Heading as="h1" gradient="var(--text-gradient-primary)" className="mb-4" size="primary">
            {categoryData.title || categoryData.name || "Product Category"}
          </Heading>
        </div>
        <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
          {categoryData.description}
        </p>
        
        {/* Product Image Display */}
        {categoryData.image && (
          <div className="mb-8">
            <div className="relative w-full max-w-lg mx-auto">
              <div className="aspect-square w-64 h-64 mx-auto overflow-hidden rounded-2xl border border-white/20 shadow-2xl bg-linear-to-br from-white/10 to-white/5">
                <img
                  src={categoryData.image}
                  alt={categoryData.name || categoryData.title}
                  className="w-full h-full object-cover object-center"
                />
                {/* Enhanced overlay with gradient */}
                <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent rounded-2xl pointer-events-none"></div>
                <div className="absolute inset-0 bg-linear-to-br from-[#3a8fff]/10 to-[#a259ff]/10 rounded-2xl pointer-events-none"></div>
                {/* Subtle border glow */}
                <div className="absolute inset-0 rounded-2xl border border-white/30 shadow-[0_0_20px_rgba(58,143,255,0.3)] pointer-events-none"></div>
              </div>
            </div>
          </div>
        )}
        
        {/* Coupon Section */}
        <div className="w-full max-w-md mb-8">
          <div className="bg-white/5 rounded-xl p-4 border border-white/20">
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <span>🎫</span>
              Apply Coupon
            </h3>
            
            {!activeCoupon ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="Enter coupon code"
                  className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-hidden focus:border-[#3a8fff] transition-colors"
                  maxLength={20}
                />
                <GlassButton
                  onClick={applyCoupon}
                  variant="accent"
                  size="small"
                  disabled={isApplyingCoupon}
                >
                  {isApplyingCoupon ? "Applying..." : "Apply"}
                </GlassButton>
              </div>
            ) : (
              <div className="flex items-center justify-between bg-green-500/20 rounded-lg p-3 border border-green-500/30">
                <div>
                  <div className="text-green-300 font-medium">{activeCoupon.code}</div>
                  <div className="text-green-300/80 text-sm">{activeCoupon.discountPercent}% discount active</div>
                </div>
                <GlassButton
                  onClick={clearCoupon}
                  variant="secondary"
                  size="small"
                >
                  <span>✕</span>
                </GlassButton>
              </div>
            )}
            
            {couponMessage && (
              <div className={`mt-3 p-2 rounded-lg text-sm ${
                couponMessage.includes('applied') || couponMessage.includes('active') 
                  ? 'bg-green-500/20 text-green-300' 
                  : 'bg-red-500/20 text-red-300'
              }`}>
                {couponMessage}
              </div>
            )}
          </div>
        </div>
      </GlassCard>
    </section>
  );
}