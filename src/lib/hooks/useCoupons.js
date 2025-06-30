import { useCallback, useState } from 'react';
import { API_ENDPOINTS, ERROR_MESSAGES } from '@/lib/constants';
import { isExpired } from '@/lib/utils';

export const useCoupons = () => {
  const [couponCode, setCouponCode] = useState('');
  const [activeCoupon, setActiveCoupon] = useState(null);
  const [couponMessage, setCouponMessage] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const applyCoupon = useCallback(async () => {
    if (!couponCode.trim()) {
      setCouponMessage('Please enter a coupon code');
      return false;
    }

    setIsApplyingCoupon(true);
    setCouponMessage('');

    try {
      const response = await fetch(API_ENDPOINTS.COUPONS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: couponCode.trim() }),
      });

      const data = await response.json();

      if (response.ok) {
        // Check if coupon is expired
        if (data.coupon.expiryDate && isExpired(data.coupon.expiryDate)) {
          setActiveCoupon(null);
          setCouponMessage(ERROR_MESSAGES.COUPON_EXPIRED);
          return false;
        }

        setActiveCoupon(data.coupon);
        setCouponMessage(`Coupon ${data.coupon.code} applied! ${data.coupon.discountPercent}% discount active.`);
        return true;
      } else {
        setActiveCoupon(null);
        setCouponMessage(data.error || ERROR_MESSAGES.COUPON_INVALID);
        return false;
      }
    } catch (error) {
      console.error('Error applying coupon:', error);
      setCouponMessage(ERROR_MESSAGES.NETWORK_ERROR);
      return false;
    } finally {
      setIsApplyingCoupon(false);
    }
  }, [couponCode]);

  const clearCoupon = useCallback(() => {
    setActiveCoupon(null);
    setCouponCode('');
    setCouponMessage('');
  }, []);

  const isCouponValid = useCallback((coupon) => {
    if (!coupon) return false;
    
    // Check expiry date
    if (coupon.expiryDate && isExpired(coupon.expiryDate)) {
      return false;
    }
    
    // Check usage limit
    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
      return false;
    }
    
    return true;
  }, []);

  const getCouponDiscount = useCallback((coupon, price) => {
    if (!coupon || !isCouponValid(coupon)) return 0;
    
    const discountPercent = coupon.discountPercent || 0;
    const priceValue = typeof price === 'string' ? parseFloat(price.replace(/[^\d.]/g, '')) : price;
    
    return (priceValue * discountPercent) / 100;
  }, [isCouponValid]);

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
    isCouponValid,
    getCouponDiscount,
  };
}; 