import { Coupon } from '@/lib/hooks/useCoupons';

// Types
export interface DiscountCalculationResult {
  originalPrice: number;
  discountAmount: number;
  discountedPrice: number;
  discountPercent: number;
  savings: string;
  isDiscounted: boolean;
}

export interface PriceRange {
  min: number;
  max: number;
  currency: string;
}

export interface DiscountedPriceRange {
  original: PriceRange;
  discounted: PriceRange;
  discount: {
    percent: number;
    minSavings: number;
    maxSavings: number;
  };
}

// Price extraction utilities
export class PriceExtractor {
  private static readonly PRICE_REGEX = /₹(\d+(?:\.\d{2})?)/g;
  private static readonly RANGE_SEPARATORS = ['-', 'to', '–', '—'];

  static extractSinglePrice(priceString: string): number {
    const match = priceString.match(/₹(\d+(?:\.\d{2})?)/);
    return match ? parseFloat(match[1]) : 0;
  }

  static extractPriceRange(priceString: string): PriceRange | null {
    const matches = priceString.match(this.PRICE_REGEX);
    
    if (!matches || matches.length < 2) {
      // Single price, convert to range
      const singlePrice = this.extractSinglePrice(priceString);
      if (singlePrice > 0) {
        return {
          min: singlePrice,
          max: singlePrice,
          currency: '₹'
        };
      }
      return null;
    }

    const prices = matches.map(match => parseFloat(match.replace('₹', '')));
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
      currency: '₹'
    };
  }

  static formatPrice(amount: number, currency: string = '₹'): string {
    return `${currency}${amount.toFixed(2)}`;
  }

  static formatPriceRange(range: PriceRange): string {
    if (range.min === range.max) {
      return this.formatPrice(range.min, range.currency);
    }
    return `${this.formatPrice(range.min, range.currency)} - ${this.formatPrice(range.max, range.currency)}`;
  }
}

// Main discount calculator class
export class DiscountCalculator {
  /**
   * Apply discount to a single price
   */
  static applyDiscount(price: string | number, discountPercent: number): DiscountCalculationResult {
    const originalPrice = typeof price === 'number' 
      ? price 
      : PriceExtractor.extractSinglePrice(price.toString());

    const discountAmount = (originalPrice * discountPercent) / 100;
    const discountedPrice = Math.max(0, originalPrice - discountAmount);

    return {
      originalPrice,
      discountAmount,
      discountedPrice,
      discountPercent,
      savings: PriceExtractor.formatPrice(discountAmount),
      isDiscounted: discountAmount > 0
    };
  }

  /**
   * Apply discount to a price range
   */
  static applyDiscountToRange(priceRangeString: string, discountPercent: number): DiscountedPriceRange | null {
    const originalRange = PriceExtractor.extractPriceRange(priceRangeString);
    if (!originalRange) return null;

    const minDiscount = this.applyDiscount(originalRange.min, discountPercent);
    const maxDiscount = this.applyDiscount(originalRange.max, discountPercent);

    const discountedRange: PriceRange = {
      min: minDiscount.discountedPrice,
      max: maxDiscount.discountedPrice,
      currency: originalRange.currency
    };

    return {
      original: originalRange,
      discounted: discountedRange,
      discount: {
        percent: discountPercent,
        minSavings: minDiscount.discountAmount,
        maxSavings: maxDiscount.discountAmount
      }
    };
  }

  /**
   * Apply coupon discount to price
   */
  static applyCouponDiscount(price: string | number, coupon: Coupon | null): DiscountCalculationResult {
    if (!coupon) {
      const originalPrice = typeof price === 'number' 
        ? price 
        : PriceExtractor.extractSinglePrice(price.toString());
      
      return {
        originalPrice,
        discountAmount: 0,
        discountedPrice: originalPrice,
        discountPercent: 0,
        savings: PriceExtractor.formatPrice(0),
        isDiscounted: false
      };
    }

    return this.applyDiscount(price, coupon.discountPercent);
  }

  /**
   * Apply coupon discount to price range
   */
  static applyCouponDiscountToRange(priceRangeString: string, coupon: Coupon | null): DiscountedPriceRange | null {
    if (!coupon) return null;
    return this.applyDiscountToRange(priceRangeString, coupon.discountPercent);
  }

  /**
   * Format discounted price display
   */
  static formatDiscountedPrice(originalPrice: number, discountedPrice: number, showOriginal: boolean = true): string {
    if (originalPrice === discountedPrice) {
      return PriceExtractor.formatPrice(originalPrice);
    }

    const discountedFormatted = PriceExtractor.formatPrice(discountedPrice);
    
    if (!showOriginal) {
      return discountedFormatted;
    }

    const originalFormatted = PriceExtractor.formatPrice(originalPrice);
    return `${discountedFormatted} (was ${originalFormatted})`;
  }

  /**
   * Format discounted price range display
   */
  static formatDiscountedPriceRange(
    discountedRange: DiscountedPriceRange, 
    showOriginal: boolean = true
  ): string {
    const discountedFormatted = PriceExtractor.formatPriceRange(discountedRange.discounted);
    
    if (!showOriginal || discountedRange.discount.percent === 0) {
      return discountedFormatted;
    }

    const originalFormatted = PriceExtractor.formatPriceRange(discountedRange.original);
    return `${discountedFormatted} (was ${originalFormatted})`;
  }

  /**
   * Calculate bulk discount for multiple items
   */
  static calculateBulkDiscount(
    items: Array<{ price: string | number; quantity: number }>,
    discountPercent: number
  ): {
    totalOriginal: number;
    totalDiscounted: number;
    totalSavings: number;
    items: Array<DiscountCalculationResult & { quantity: number; lineTotal: number; lineSavings: number }>;
  } {
    const results = items.map(item => {
      const discount = this.applyDiscount(item.price, discountPercent);
      return {
        ...discount,
        quantity: item.quantity,
        lineTotal: discount.discountedPrice * item.quantity,
        lineSavings: discount.discountAmount * item.quantity
      };
    });

    const totalOriginal = results.reduce((sum, item) => sum + (item.originalPrice * item.quantity), 0);
    const totalDiscounted = results.reduce((sum, item) => sum + item.lineTotal, 0);
    const totalSavings = totalOriginal - totalDiscounted;

    return {
      totalOriginal,
      totalDiscounted,
      totalSavings,
      items: results
    };
  }

  /**
   * Validate minimum order value for coupon
   */
  static validateMinimumOrder(
    totalValue: number,
    coupon: Coupon | null
  ): { isValid: boolean; requiredAmount?: number; shortfall?: number } {
    if (!coupon || !coupon.minOrderValue) {
      return { isValid: true };
    }

    const isValid = totalValue >= coupon.minOrderValue;
    return {
      isValid,
      requiredAmount: coupon.minOrderValue,
      shortfall: isValid ? 0 : coupon.minOrderValue - totalValue
    };
  }

  /**
   * Get discount badge text
   */
  static getDiscountBadge(discountPercent: number): string {
    if (discountPercent <= 0) return '';
    if (discountPercent >= 50) return `${discountPercent}% OFF - HUGE SAVINGS!`;
    if (discountPercent >= 25) return `${discountPercent}% OFF - GREAT DEAL!`;
    if (discountPercent >= 10) return `${discountPercent}% OFF`;
    return `${discountPercent}% OFF`;
  }

  /**
   * Calculate discount tier for progressive discounts
   */
  static calculateTieredDiscount(
    orderValue: number,
    tiers: Array<{ minValue: number; discountPercent: number }>
  ): { appliedTier: typeof tiers[0] | null; discount: DiscountCalculationResult } {
    // Sort tiers by minimum value (descending) to find the highest applicable tier
    const sortedTiers = [...tiers].sort((a, b) => b.minValue - a.minValue);
    
    const appliedTier = sortedTiers.find(tier => orderValue >= tier.minValue) || null;
    const discountPercent = appliedTier?.discountPercent || 0;
    
    const discount = this.applyDiscount(orderValue, discountPercent);
    
    return {
      appliedTier,
      discount
    };
  }
}

// Utility functions for common discount operations
export const discountUtils = {
  /**
   * Quick check if a price string contains a discount
   */
  hasDiscount: (priceString: string): boolean => {
    return priceString.includes('was') || priceString.includes('(') || priceString.includes('OFF');
  },

  /**
   * Extract savings amount from formatted discount text
   */
  extractSavings: (discountText: string): number => {
    const match = discountText.match(/save[sd]?\s*₹(\d+(?:\.\d{2})?)/i);
    return match ? parseFloat(match[1]) : 0;
  },

  /**
   * Generate coupon summary text
   */
  generateCouponSummary: (coupon: Coupon, orderValue?: number): string => {
    const parts = [`${coupon.discountPercent}% discount`];
    
    if (coupon.minOrderValue && orderValue) {
      const meetsMin = orderValue >= coupon.minOrderValue;
      parts.push(meetsMin ? '✓ Minimum met' : `Minimum: ₹${coupon.minOrderValue}`);
    }
    
    if (coupon.expiryDate) {
      const expiry = new Date(coupon.expiryDate);
      const now = new Date();
      const daysLeft = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysLeft > 0) {
        parts.push(`${daysLeft} days left`);
      } else {
        parts.push('EXPIRED');
      }
    }
    
    return parts.join(' • ');
  },

  /**
   * Format percentage for display
   */
  formatPercent: (percent: number): string => {
    return `${Math.round(percent * 10) / 10}%`;
  }
};

// Export types and utilities