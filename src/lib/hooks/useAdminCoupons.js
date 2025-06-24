import { useCallback, useState } from 'react';

export function useAdminCoupons({ setMessage, username, password }) {
  const [coupons, setCoupons] = useState([]);
  const [isCouponLoading, setIsCouponLoading] = useState(false);
  const [couponForm, setCouponForm] = useState({
    code: '',
    discountPercent: '',
    expiryDate: '',
    maxUses: ''
  });

  // Load coupons
  const loadCoupons = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/backup-management', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          password,
          action: 'list_coupons'
        }),
      });
      if (response.ok) {
        const data = await response.json();
        setCoupons(data.coupons || []);
      } else {
        setMessage && setMessage('Failed to load coupons');
      }
    } catch (error) {
      setMessage && setMessage('Error loading coupons');
    }
  }, [setMessage, username, password]);

  // Create coupon
  const createCoupon = useCallback(async () => {
    if (!couponForm.code || !couponForm.discountPercent || !couponForm.expiryDate) {
      setMessage('Please fill in all required fields');
      return;
    }
    const discountPercent = parseFloat(couponForm.discountPercent);
    if (isNaN(discountPercent) || discountPercent <= 0 || discountPercent > 100) {
      setMessage('Discount percentage must be between 1 and 100');
      return;
    }
    setIsCouponLoading(true);
    setMessage('');
    try {
      const response = await fetch('/api/admin/backup-management', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          password,
          action: 'create_coupon',
          coupon: {
            code: couponForm.code.toUpperCase(),
            discountPercent,
            expiryDate: couponForm.expiryDate,
            maxUses: couponForm.maxUses ? parseInt(couponForm.maxUses) : null
          }
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
        setCouponForm({ code: '', discountPercent: '', expiryDate: '', maxUses: '' });
        loadCoupons();
      } else {
        setMessage(data.error || 'Failed to create coupon');
      }
    } catch (error) {
      setMessage('Network error. Please try again.');
    } finally {
      setIsCouponLoading(false);
    }
  }, [couponForm, setMessage, loadCoupons, username, password]);

  // Delete coupon
  const deleteCoupon = useCallback(async (code) => {
    if (!confirm(`Are you sure you want to delete coupon: ${code}?`)) {
      return;
    }
    setIsCouponLoading(true);
    setMessage('');
    try {
      const response = await fetch('/api/admin/backup-management', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          password,
          action: 'delete_coupon',
          code
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
        loadCoupons();
      } else {
        setMessage(data.error || 'Failed to delete coupon');
      }
    } catch (error) {
      setMessage('Network error. Please try again.');
    } finally {
      setIsCouponLoading(false);
    }
  }, [setMessage, loadCoupons, username, password]);

  return {
    coupons,
    setCoupons,
    isCouponLoading,
    setIsCouponLoading,
    couponForm,
    setCouponForm,
    loadCoupons,
    createCoupon,
    deleteCoupon
  };
} 