import { useState, useCallback, useMemo } from 'react';
import { useApiPost } from './useApi';
import { isExpired } from '@/lib/utils';

// Types
export interface Coupon {
  id: string;
  code: string;
  discountPercent: number;
  expiryDate?: string;
  maxUses?: number;
  usedCount?: number;
  isActive?: boolean;
  description?: string;
  minOrderValue?: number;
  applicableCategories?: string[];
  createdAt?: string;
}

export interface CouponValidationResult {
  isValid: boolean;
  reason?: string;
  discount?: number;
}

export interface UseCouponsResult {
  // State
  couponCode: string;
  activeCoupon: Coupon | null;
  couponMessage: string;
  isApplyingCoupon: boolean;
  
  // Actions
  setCouponCode: (code: string) => void;
  setCouponMessage: (message: string) => void;
  applyCoupon: () => Promise<boolean>;
  clearCoupon: () => void;
  
  // Validation
  validateCoupon: (coupon: Coupon, orderValue?: number) => CouponValidationResult;
  isCouponValid: (coupon: Coupon | null) => boolean;
  
  // Calculations
  getCouponDiscount: (coupon: Coupon | null, price: string | number) => number;
  getDiscountedPrice: (coupon: Coupon | null, price: string | number) => number;
  getDiscountDisplay: (coupon: Coupon | null) => string;
  
  // Utilities
  formatCouponMessage: (coupon: Coupon) => string;
  checkCouponExpiry: (coupon: Coupon) => { isExpired: boolean; daysLeft?: number };
}

// Error messages
const COUPON_ERRORS = {
  EMPTY_CODE: 'Please enter a coupon code',
  INVALID_CODE: 'Invalid coupon code',
  EXPIRED: 'This coupon has expired',
  USAGE_LIMIT: 'This coupon has reached its usage limit',
  MIN_ORDER: 'Minimum order value not met for this coupon',
  NETWORK_ERROR: 'Network error. Please try again.',
  INACTIVE: 'This coupon is no longer active'
} as const;

// Success messages
const COUPON_SUCCESS = {
  APPLIED: (code: string, discount: number) => 
    `Coupon ${code} applied! ${discount}% discount active.`,
  REMOVED: 'Coupon removed successfully'
} as const;

// Validation functions
function validateCouponCode(code: string): boolean {
  return Boolean(code && code.trim().length >= 3);
}

function checkExpiry(expiryDate?: string): { isExpired: boolean; daysLeft?: number } {
  if (!expiryDate) return { isExpired: false };
  
  const expiry = new Date(expiryDate);
  const now = new Date();
  const diffTime = expiry.getTime() - now.getTime();
  const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return {
    isExpired: diffTime <= 0,
    daysLeft: diffTime > 0 ? daysLeft : undefined
  };
}

function extractPriceValue(price: string | number): number {
  if (typeof price === 'number') return price;
  const match = price.match(/₹?(\d+\.?\d*)/);
  return match ? parseFloat(match[1]) : 0;
}

// Main hook
export function useCoupons(): UseCouponsResult {
  const [couponCode, setCouponCode] = useState('');
  const [activeCoupon, setActiveCoupon] = useState<Coupon | null>(null);
  const [couponMessage, setCouponMessage] = useState('');

  // Validate coupon with comprehensive checks
  const validateCoupon = useCallback((coupon: Coupon, orderValue?: number): CouponValidationResult => {
    if (!coupon) {
      return { isValid: false, reason: COUPON_ERRORS.INVALID_CODE };
    }

    // Check if coupon is active
    if (coupon.isActive === false) {
      return { isValid: false, reason: COUPON_ERRORS.INACTIVE };
    }

    // Check expiry
    const { isExpired } = checkExpiry(coupon.expiryDate);
    if (isExpired) {
      return { isValid: false, reason: COUPON_ERRORS.EXPIRED };
    }

    // Check usage limit
    if (coupon.maxUses && coupon.usedCount && coupon.usedCount >= coupon.maxUses) {
      return { isValid: false, reason: COUPON_ERRORS.USAGE_LIMIT };
    }

    // Check minimum order value
    if (coupon.minOrderValue && orderValue && orderValue < coupon.minOrderValue) {
      return { 
        isValid: false, 
        reason: `${COUPON_ERRORS.MIN_ORDER} (₹${coupon.minOrderValue})` 
      };
    }

    const discount = coupon.discountPercent || 0;
    return { isValid: true, discount };
  }, []);

  // API hook for coupon application
  const {
    execute: applyCouponApi,
    isLoading: isApplyingCoupon,
    error: apiError
  } = useApiPost<{ coupon: Coupon }>('/api/coupons', {
    onSuccess: (data) => {
      const coupon = data.coupon;
      const validation = validateCoupon(coupon);
      
      if (validation.isValid) {
        setActiveCoupon(coupon);
        setCouponMessage(COUPON_SUCCESS.APPLIED(coupon.code, coupon.discountPercent));
      } else {
        setActiveCoupon(null);
        setCouponMessage(validation.reason || COUPON_ERRORS.INVALID_CODE);
      }
    },
    onError: (error) => {
      setActiveCoupon(null);
      setCouponMessage(error.details?.error || COUPON_ERRORS.INVALID_CODE);
    }
  });

  // Simple validity check
  const isCouponValid = useCallback((coupon: Coupon | null): boolean => {
    if (!coupon) return false;
    return validateCoupon(coupon).isValid;
  }, [validateCoupon]);

  // Apply coupon
  const applyCoupon = useCallback(async (): Promise<boolean> => {
    if (!validateCouponCode(couponCode)) {
      setCouponMessage(COUPON_ERRORS.EMPTY_CODE);
      return false;
    }

    setCouponMessage('');
    
    try {
      await applyCouponApi({ code: couponCode.trim() });
      return Boolean(activeCoupon);
    } catch (error) {
      // Error handled in onError callback
      return false;
    }
  }, [couponCode, applyCouponApi, activeCoupon]);

  // Clear coupon
  const clearCoupon = useCallback(() => {
    setActiveCoupon(null);
    setCouponCode('');
    setCouponMessage(COUPON_SUCCESS.REMOVED);
    
    // Clear message after 3 seconds
    setTimeout(() => {
      setCouponMessage('');
    }, 3000);
  }, []);

  // Calculate discount amount
  const getCouponDiscount = useCallback((coupon: Coupon | null, price: string | number): number => {
    if (!coupon || !isCouponValid(coupon)) return 0;
    
    const priceValue = extractPriceValue(price);
    const discountPercent = coupon.discountPercent || 0;
    
    return (priceValue * discountPercent) / 100;
  }, [isCouponValid]);

  // Calculate discounted price
  const getDiscountedPrice = useCallback((coupon: Coupon | null, price: string | number): number => {
    const priceValue = extractPriceValue(price);
    const discount = getCouponDiscount(coupon, price);
    
    return Math.max(0, priceValue - discount);
  }, [getCouponDiscount]);

  // Get discount display text
  const getDiscountDisplay = useCallback((coupon: Coupon | null): string => {
    if (!coupon || !isCouponValid(coupon)) return '';
    
    return `${coupon.discountPercent}% OFF`;
  }, [isCouponValid]);

  // Format coupon message
  const formatCouponMessage = useCallback((coupon: Coupon): string => {
    const parts = [`Code: ${coupon.code}`];
    
    if (coupon.discountPercent) {
      parts.push(`${coupon.discountPercent}% discount`);
    }
    
    if (coupon.expiryDate) {
      const { daysLeft } = checkExpiry(coupon.expiryDate);
      if (daysLeft !== undefined) {
        parts.push(`expires in ${daysLeft} day${daysLeft !== 1 ? 's' : ''}`);
      }
    }
    
    if (coupon.minOrderValue) {
      parts.push(`min order ₹${coupon.minOrderValue}`);
    }
    
    return parts.join(' • ');
  }, []);

  // Check coupon expiry with details
  const checkCouponExpiry = useCallback((coupon: Coupon) => {
    return checkExpiry(coupon.expiryDate);
  }, []);

  // Memoized coupon status
  const couponStatus = useMemo(() => {
    if (!activeCoupon) return null;
    
    const validation = validateCoupon(activeCoupon);
    const expiry = checkCouponExpiry(activeCoupon);
    
    return {
      isValid: validation.isValid,
      isExpired: expiry.isExpired,
      daysLeft: expiry.daysLeft,
      discount: validation.discount || 0,
      reason: validation.reason
    };
  }, [activeCoupon, validateCoupon, checkCouponExpiry]);

  return {
    // State
    couponCode,
    activeCoupon,
    couponMessage,
    isApplyingCoupon,
    
    // Actions
    setCouponCode,
    setCouponMessage,
    applyCoupon,
    clearCoupon,
    
    // Validation
    validateCoupon,
    isCouponValid,
    
    // Calculations
    getCouponDiscount,
    getDiscountedPrice,
    getDiscountDisplay,
    
    // Utilities
    formatCouponMessage,
    checkCouponExpiry,
    
    // Additional computed state
    couponStatus
  } as UseCouponsResult & { couponStatus: typeof couponStatus };
}

// Hook for coupon management (admin)
export function useCouponManagement() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  
  const createCouponApi = useApiPost('/api/coupons');
  const deleteCouponApi = useApiPost('/api/coupons');
  
  const createCoupon = useCallback(async (couponData: Partial<Coupon>) => {
    try {
      const result = await createCouponApi.execute({
        action: 'create_coupon',
        ...couponData
      });
      
      // Add to local state optimistically
      if (result) {
        setCoupons(prev => [...prev, result]);
      }
      
      return result;
    } catch (error) {
      throw error;
    }
  }, [createCouponApi]);
  
  const deleteCoupon = useCallback(async (couponId: string) => {
    try {
      await deleteCouponApi.execute({
        action: 'delete_coupon',
        couponId
      });
      
      // Remove from local state optimistically
      setCoupons(prev => prev.filter(c => c.id !== couponId));
      
      return true;
    } catch (error) {
      throw error;
    }
  }, [deleteCouponApi]);
  
  return {
    coupons,
    createCoupon,
    deleteCoupon,
    isLoading: createCouponApi.isLoading || deleteCouponApi.isLoading,
    error: createCouponApi.error || deleteCouponApi.error
  };
}

// Export constants
export { COUPON_ERRORS, COUPON_SUCCESS };