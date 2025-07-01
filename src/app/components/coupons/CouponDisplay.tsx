"use client";
import React from 'react';
import { useCouponDisplay } from '@/contexts/CouponContext';
import { GlassCard, GlassButton, GlassIcon } from '@/app/components/Glassmorphism';

interface CouponDisplayProps {
  className?: string;
  showDetails?: boolean;
  compact?: boolean;
  showClearButton?: boolean;
  onClear?: () => void;
}

export default function CouponDisplay({
  className = '',
  showDetails = true,
  compact = false,
  showClearButton = true,
  onClear
}: CouponDisplayProps) {
  const { activeCoupon, couponInfo, clearCoupon, hasActiveCoupon } = useCouponDisplay();

  if (!hasActiveCoupon || !couponInfo) {
    return null;
  }

  const handleClear = () => {
    clearCoupon();
    onClear?.();
  };

  const isExpiringSoon = couponInfo.expiryInfo.daysLeft !== undefined && couponInfo.expiryInfo.daysLeft <= 3;
  const isExpired = couponInfo.expiryInfo.isExpired;

  if (compact) {
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-500/30 ${className}`}>
        <GlassIcon icon="🎫" size="small" variant="accent" />
        <span className="text-sm font-medium text-white">
          {couponInfo.code} ({couponInfo.displayText})
        </span>
        {showClearButton && (
          <button
            onClick={handleClear}
            className="text-white/60 hover:text-white/90 transition-colors"
            title="Remove coupon"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}
      </div>
    );
  }

  return (
    <GlassCard 
      variant="secondary" 
      padding="default" 
      className={`${className} ${isExpired ? 'border-red-500/50' : isExpiringSoon ? 'border-yellow-500/50' : 'border-green-500/50'}`}
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              isExpired ? 'bg-red-500/20' : 'bg-gradient-to-r from-green-400 to-blue-500'
            }`}>
              {isExpired ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                <GlassIcon icon="🎫" size="medium" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">
                {isExpired ? 'Expired Coupon' : 'Active Coupon'}
              </h3>
              <p className="text-sm text-white/70">
                {isExpired ? 'This coupon has expired' : 'Discount applied to your order'}
              </p>
            </div>
          </div>
          
          {showClearButton && (
            <GlassButton
              onClick={handleClear}
              variant="secondary"
              size="small"
              className="text-white/60 hover:text-white/90"
              title={isExpired ? "Remove expired coupon" : "Remove coupon"}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </GlassButton>
          )}
        </div>

        {/* Coupon Details */}
        <div className="space-y-3">
          {/* Coupon Code */}
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
            <div>
              <div className="text-sm text-white/60">Coupon Code</div>
              <div className="text-xl font-bold font-mono tracking-wider text-white">
                {couponInfo.code}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-white/60">Discount</div>
              <div className={`text-2xl font-bold ${isExpired ? 'text-red-300' : 'text-green-300'}`}>
                {couponInfo.displayText}
              </div>
            </div>
          </div>

          {/* Additional Details */}
          {showDetails && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Expiry Information */}
              {couponInfo.expiryDate && (
                <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                      <polyline points="12,6 12,12 16,14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="text-sm font-medium text-white/80">Expiry</span>
                  </div>
                  <div className={`text-sm mt-1 ${
                    isExpired ? 'text-red-300' : 
                    isExpiringSoon ? 'text-yellow-300' : 
                    'text-white/70'
                  }`}>
                    {isExpired ? 'Expired' : 
                     couponInfo.expiryInfo.daysLeft !== undefined ? 
                     `${couponInfo.expiryInfo.daysLeft} days left` : 
                     'No expiry'}
                  </div>
                </div>
              )}

              {/* Minimum Order */}
              {couponInfo.minOrderValue && (
                <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 17h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="text-sm font-medium text-white/80">Minimum Order</span>
                  </div>
                  <div className="text-sm text-white/70 mt-1">
                    ₹{couponInfo.minOrderValue}
                  </div>
                </div>
              )}

              {/* Usage Limit */}
              {couponInfo.maxUses && (
                <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2"/>
                      <circle cx="8.5" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                      <path d="M20 8v6M23 11h-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="text-sm font-medium text-white/80">Usage</span>
                  </div>
                  <div className="text-sm text-white/70 mt-1">
                    {couponInfo.usedCount || 0} / {couponInfo.maxUses} used
                  </div>
                </div>
              )}

              {/* Description */}
              {couponInfo.description && (
                <div className="p-3 bg-white/5 rounded-lg border border-white/10 md:col-span-2">
                  <div className="flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2"/>
                      <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="text-sm font-medium text-white/80">Description</span>
                  </div>
                  <div className="text-sm text-white/70 mt-1">
                    {couponInfo.description}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Status Messages */}
          {isExpiringSoon && !isExpired && (
            <div className="flex items-center gap-2 p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-sm text-yellow-300">
                ⚠️ This coupon expires soon! Use it before it's too late.
              </span>
            </div>
          )}

          {isExpired && (
            <div className="flex items-center gap-2 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" strokeWidth="2"/>
                <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <span className="text-sm text-red-300">
                ❌ This coupon has expired and cannot be used for discounts.
              </span>
            </div>
          )}
        </div>
      </div>
    </GlassCard>
  );
}