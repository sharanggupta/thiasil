"use client";
import React, { useState } from 'react';
import { useCouponInput } from '@/contexts/CouponContext';
import { GlassCard, GlassButton, GlassInput } from '@/app/components/Glassmorphism';

interface CouponInputProps {
  className?: string;
  placeholder?: string;
  showLastUsed?: boolean;
  compact?: boolean;
  onApplySuccess?: () => void;
  onApplyError?: () => void;
}

export default function CouponInput({
  className = '',
  placeholder = 'Enter coupon code',
  showLastUsed = true,
  compact = false,
  onApplySuccess,
  onApplyError
}: CouponInputProps) {
  const {
    couponCode,
    setCouponCode,
    applyCoupon,
    isApplyingCoupon,
    couponMessage,
    lastUsedCoupons
  } = useCouponInput();

  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleApplyCoupon = async () => {
    const success = await applyCoupon();
    
    if (success) {
      onApplySuccess?.();
      setShowSuggestions(false);
    } else {
      onApplyError?.();
    }
  };

  const handleInputChange = (value: string) => {
    setCouponCode(value);
    setShowSuggestions(value.length === 0 && lastUsedCoupons.length > 0);
  };

  const handleSuggestionClick = (code: string) => {
    setCouponCode(code);
    setShowSuggestions(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && couponCode.trim()) {
      handleApplyCoupon();
    }
  };

  if (compact) {
    return (
      <div className={`relative ${className}`}>
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <GlassInput
              type="text"
              value={couponCode}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyPress={handleKeyPress}
              onFocus={() => setShowSuggestions(couponCode.length === 0 && lastUsedCoupons.length > 0)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              placeholder={placeholder}
              disabled={isApplyingCoupon}
              className="w-full"
            />
            
            {/* Suggestions dropdown */}
            {showSuggestions && showLastUsed && (
              <div className="absolute top-full left-0 right-0 mt-1 z-50">
                <GlassCard variant="primary" padding="compact" className="border border-white/20">
                  <div className="space-y-1">
                    <div className="text-xs text-white/60 px-2 py-1">Recently used:</div>
                    {lastUsedCoupons.slice(0, 3).map((coupon) => (
                      <button
                        key={coupon.code}
                        onClick={() => handleSuggestionClick(coupon.code)}
                        className="w-full text-left px-2 py-1 text-sm text-white/80 hover:bg-white/10 rounded transition-colors"
                      >
                        <span className="font-medium">{coupon.code}</span>
                        <span className="text-white/50 ml-2">({coupon.discountPercent}% off)</span>
                      </button>
                    ))}
                  </div>
                </GlassCard>
              </div>
            )}
          </div>
          
          <GlassButton
            onClick={handleApplyCoupon}
            disabled={!couponCode.trim() || isApplyingCoupon}
            variant="primary"
            size="small"
            loading={isApplyingCoupon}
            className="whitespace-nowrap"
          >
            Apply
          </GlassButton>
        </div>
        
        {/* Message */}
        {couponMessage && (
          <div className={`mt-2 text-xs ${
            couponMessage.includes('applied') || couponMessage.includes('✅') 
              ? 'text-green-300' 
              : 'text-red-300'
          }`}>
            {couponMessage}
          </div>
        )}
      </div>
    );
  }

  return (
    <GlassCard variant="secondary" padding="default" className={`${className}`}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Have a Coupon?</h3>
            <p className="text-sm text-white/70">Enter your coupon code to get a discount</p>
          </div>
        </div>

        {/* Input section */}
        <div className="relative">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <GlassInput
                type="text"
                value={couponCode}
                onChange={(e) => handleInputChange(e.target.value)}
                onKeyPress={handleKeyPress}
                onFocus={() => setShowSuggestions(couponCode.length === 0 && lastUsedCoupons.length > 0)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                placeholder={placeholder}
                disabled={isApplyingCoupon}
                className="w-full text-center font-mono tracking-wider uppercase"
              />
              
              {/* Suggestions dropdown */}
              {showSuggestions && showLastUsed && (
                <div className="absolute top-full left-0 right-0 mt-2 z-50">
                  <GlassCard variant="primary" padding="compact" className="border border-white/20">
                    <div className="space-y-2">
                      <div className="text-xs font-medium text-white/60 px-3 py-2 border-b border-white/10">
                        Recently used coupons:
                      </div>
                      {lastUsedCoupons.slice(0, 4).map((coupon) => (
                        <button
                          key={coupon.code}
                          onClick={() => handleSuggestionClick(coupon.code)}
                          className="w-full text-left px-3 py-2 hover:bg-white/10 rounded transition-colors group"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium text-white/90 font-mono tracking-wide">
                                {coupon.code}
                              </div>
                              <div className="text-xs text-white/60">
                                {coupon.discountPercent}% discount
                                {coupon.description && ` • ${coupon.description}`}
                              </div>
                            </div>
                            <div className="text-xs text-white/40 group-hover:text-white/60 transition-colors">
                              Click to use
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </GlassCard>
                </div>
              )}
            </div>
            
            <GlassButton
              onClick={handleApplyCoupon}
              disabled={!couponCode.trim() || isApplyingCoupon}
              variant="primary"
              size="medium"
              loading={isApplyingCoupon}
              className="px-6"
            >
              {isApplyingCoupon ? 'Applying...' : 'Apply Coupon'}
            </GlassButton>
          </div>
        </div>

        {/* Message */}
        {couponMessage && (
          <div className={`p-3 rounded-lg border ${
            couponMessage.includes('applied') || couponMessage.includes('✅')
              ? 'bg-green-500/20 border-green-500/30 text-green-300'
              : 'bg-red-500/20 border-red-500/30 text-red-300'
          }`}>
            <div className="flex items-center gap-2">
              {couponMessage.includes('applied') || couponMessage.includes('✅') ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
              <span className="text-sm font-medium">{couponMessage}</span>
            </div>
          </div>
        )}

        {/* Tips */}
        {!couponMessage && showLastUsed && lastUsedCoupons.length === 0 && (
          <div className="text-xs text-white/50 space-y-1">
            <div>💡 Tip: Coupon codes are usually uppercase (e.g., SAVE20, WELCOME10)</div>
            <div>💰 Watch for promotional emails with exclusive coupon codes</div>
          </div>
        )}
      </div>
    </GlassCard>
  );
}