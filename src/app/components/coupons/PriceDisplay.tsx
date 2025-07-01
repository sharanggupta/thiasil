"use client";
import React from 'react';
import { useCouponDiscount } from '@/contexts/CouponContext';
import { DiscountCalculator, PriceExtractor } from '@/lib/utils/discount';

interface PriceDisplayProps {
  price: string | number;
  priceRange?: string;
  className?: string;
  showOriginal?: boolean;
  showSavings?: boolean;
  showDiscountBadge?: boolean;
  size?: 'small' | 'medium' | 'large';
  currency?: string;
}

export default function PriceDisplay({
  price,
  priceRange,
  className = '',
  showOriginal = true,
  showSavings = true,
  showDiscountBadge = true,
  size = 'medium',
  currency = '₹'
}: PriceDisplayProps) {
  const { activeCoupon, getCouponDiscount, getDiscountedPrice, hasActiveCoupon } = useCouponDiscount();

  // Size classes
  const sizeClasses = {
    small: {
      price: 'text-lg',
      originalPrice: 'text-sm',
      savings: 'text-xs',
      badge: 'text-xs px-2 py-1'
    },
    medium: {
      price: 'text-2xl',
      originalPrice: 'text-lg',
      savings: 'text-sm',
      badge: 'text-sm px-3 py-1'
    },
    large: {
      price: 'text-3xl',
      originalPrice: 'text-xl',
      savings: 'text-base',
      badge: 'text-base px-4 py-2'
    }
  };

  const classes = sizeClasses[size];

  // Handle price range
  if (priceRange) {
    const discountedRange = DiscountCalculator.applyCouponDiscountToRange(priceRange, activeCoupon);
    
    if (!discountedRange || !hasActiveCoupon) {
      return (
        <div className={`price-display ${className}`}>
          <div className={`font-bold text-white ${classes.price}`}>
            {priceRange}
          </div>
        </div>
      );
    }

    const formattedDiscounted = DiscountCalculator.formatDiscountedPriceRange(discountedRange, false);
    const formattedOriginal = PriceExtractor.formatPriceRange(discountedRange.original);
    const avgSavings = (discountedRange.discount.minSavings + discountedRange.discount.maxSavings) / 2;

    return (
      <div className={`price-display space-y-1 ${className}`}>
        {/* Discount Badge */}
        {showDiscountBadge && hasActiveCoupon && (
          <div className={`inline-block bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-full ${classes.badge}`}>
            {DiscountCalculator.getDiscountBadge(discountedRange.discount.percent)}
          </div>
        )}

        {/* Discounted Price */}
        <div className={`font-bold text-green-300 ${classes.price}`}>
          {formattedDiscounted}
        </div>

        {/* Original Price */}
        {showOriginal && hasActiveCoupon && (
          <div className={`text-white/60 line-through ${classes.originalPrice}`}>
            {formattedOriginal}
          </div>
        )}

        {/* Savings */}
        {showSavings && hasActiveCoupon && avgSavings > 0 && (
          <div className={`text-green-300 font-medium ${classes.savings}`}>
            Save up to {PriceExtractor.formatPrice(discountedRange.discount.maxSavings)}
          </div>
        )}
      </div>
    );
  }

  // Handle single price
  const discountResult = DiscountCalculator.applyCouponDiscount(price, activeCoupon);
  const originalPrice = discountResult.originalPrice;
  const discountedPrice = discountResult.discountedPrice;
  const isDiscounted = discountResult.isDiscounted && hasActiveCoupon;

  return (
    <div className={`price-display space-y-1 ${className}`}>
      {/* Discount Badge */}
      {showDiscountBadge && isDiscounted && (
        <div className={`inline-block bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-full ${classes.badge}`}>
          {DiscountCalculator.getDiscountBadge(discountResult.discountPercent)}
        </div>
      )}

      {/* Current Price */}
      <div className={`font-bold ${isDiscounted ? 'text-green-300' : 'text-white'} ${classes.price}`}>
        {PriceExtractor.formatPrice(discountedPrice, currency)}
      </div>

      {/* Original Price */}
      {showOriginal && isDiscounted && (
        <div className={`text-white/60 line-through ${classes.originalPrice}`}>
          {PriceExtractor.formatPrice(originalPrice, currency)}
        </div>
      )}

      {/* Savings */}
      {showSavings && isDiscounted && discountResult.discountAmount > 0 && (
        <div className={`text-green-300 font-medium ${classes.savings}`}>
          You save {discountResult.savings}
        </div>
      )}

      {/* Additional Coupon Info */}
      {isDiscounted && activeCoupon && (
        <div className={`text-xs text-green-300/80`}>
          with coupon {activeCoupon.code}
        </div>
      )}
    </div>
  );
}

// Specialized components for common use cases

interface ProductPriceProps extends Omit<PriceDisplayProps, 'size'> {
  variant?: 'card' | 'hero' | 'list';
}

export function ProductPrice({ variant = 'card', ...props }: ProductPriceProps) {
  const sizeMap = {
    card: 'medium' as const,
    hero: 'large' as const,
    list: 'small' as const
  };

  return <PriceDisplay {...props} size={sizeMap[variant]} />;
}

interface OrderSummaryPriceProps extends Omit<PriceDisplayProps, 'showDiscountBadge'> {
  label?: string;
  highlight?: boolean;
}

export function OrderSummaryPrice({ 
  label, 
  highlight = false, 
  className = '', 
  ...props 
}: OrderSummaryPriceProps) {
  return (
    <div className={`flex justify-between items-center ${highlight ? 'p-3 bg-white/5 rounded-lg border border-white/10' : ''} ${className}`}>
      {label && (
        <span className={`${highlight ? 'font-semibold text-white' : 'text-white/70'}`}>
          {label}
        </span>
      )}
      <PriceDisplay {...props} showDiscountBadge={false} />
    </div>
  );
}

interface QuickPriceProps {
  price: string | number;
  className?: string;
  showCouponCode?: boolean;
}

export function QuickPrice({ price, className = '', showCouponCode = false }: QuickPriceProps) {
  const { activeCoupon, getDiscountedPrice, hasActiveCoupon } = useCouponDiscount();
  
  const discountedPrice = getDiscountedPrice(activeCoupon, price);
  const originalPrice = typeof price === 'number' ? price : PriceExtractor.extractSinglePrice(price.toString());
  const isDiscounted = hasActiveCoupon && discountedPrice < originalPrice;

  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span className={`font-bold ${isDiscounted ? 'text-green-300' : 'text-white'}`}>
        {PriceExtractor.formatPrice(discountedPrice)}
      </span>
      {isDiscounted && (
        <>
          <span className="text-white/50 line-through text-sm">
            {PriceExtractor.formatPrice(originalPrice)}
          </span>
          {showCouponCode && activeCoupon && (
            <span className="text-xs text-green-300/80 font-mono">
              ({activeCoupon.code})
            </span>
          )}
        </>
      )}
    </span>
  );
}