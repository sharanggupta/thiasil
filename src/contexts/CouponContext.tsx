"use client";
import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useCoupons, Coupon, CouponValidationResult } from '@/lib/hooks/useCoupons';

// Types
interface CouponContextType {
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
  
  // Additional context-specific state
  isPersistent: boolean;
  lastUsedCoupons: Coupon[];
  couponHistory: Array<{ coupon: Coupon; usedAt: string }>;
}

interface CouponProviderProps {
  children: ReactNode;
  enablePersistence?: boolean;
  maxHistorySize?: number;
}

// Storage keys
const STORAGE_KEYS = {
  ACTIVE_COUPON: 'thiasil_active_coupon',
  COUPON_CODE: 'thiasil_coupon_code',
  COUPON_HISTORY: 'thiasil_coupon_history',
  LAST_USED_COUPONS: 'thiasil_last_used_coupons'
} as const;

// Create context
const CouponContext = createContext<CouponContextType | null>(null);

// Custom hook to use coupon context
export function useCouponContext(): CouponContextType {
  const context = useContext(CouponContext);
  if (!context) {
    throw new Error('useCouponContext must be used within a CouponProvider');
  }
  return context;
}

// Storage utilities
const storage = {
  get: (key: string) => {
    if (typeof window === 'undefined') return null;
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.warn(`Failed to read from localStorage (${key}):`, error);
      return null;
    }
  },
  
  set: (key: string, value: any) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn(`Failed to write to localStorage (${key}):`, error);
    }
  },
  
  remove: (key: string) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn(`Failed to remove from localStorage (${key}):`, error);
    }
  }
};

// Enhanced useCoupons hook with persistence
function useCouponsWithPersistence(enablePersistence: boolean = true, maxHistorySize: number = 10) {
  // Initialize with persisted state
  const initialCouponCode = enablePersistence ? storage.get(STORAGE_KEYS.COUPON_CODE) || '' : '';
  const initialActiveCoupon = enablePersistence ? storage.get(STORAGE_KEYS.ACTIVE_COUPON) : null;
  
  const couponHook = useCoupons();
  
  // Override initial state with persisted values
  useEffect(() => {
    if (enablePersistence && initialCouponCode) {
      couponHook.setCouponCode(initialCouponCode);
    }
  }, []);

  // Persistence effects
  useEffect(() => {
    if (!enablePersistence) return;
    
    if (couponHook.couponCode) {
      storage.set(STORAGE_KEYS.COUPON_CODE, couponHook.couponCode);
    } else {
      storage.remove(STORAGE_KEYS.COUPON_CODE);
    }
  }, [couponHook.couponCode, enablePersistence]);

  useEffect(() => {
    if (!enablePersistence) return;
    
    if (couponHook.activeCoupon) {
      storage.set(STORAGE_KEYS.ACTIVE_COUPON, couponHook.activeCoupon);
      
      // Add to history
      const history = storage.get(STORAGE_KEYS.COUPON_HISTORY) || [];
      const newEntry = {
        coupon: couponHook.activeCoupon,
        usedAt: new Date().toISOString()
      };
      
      // Remove duplicates and limit size
      const filteredHistory = history.filter((entry: any) => entry.coupon.code !== couponHook.activeCoupon!.code);
      const updatedHistory = [newEntry, ...filteredHistory].slice(0, maxHistorySize);
      
      storage.set(STORAGE_KEYS.COUPON_HISTORY, updatedHistory);
      
      // Update last used coupons (just the coupon objects, limit to 5)
      const lastUsed = storage.get(STORAGE_KEYS.LAST_USED_COUPONS) || [];
      const filteredLastUsed = lastUsed.filter((c: Coupon) => c.code !== couponHook.activeCoupon!.code);
      const updatedLastUsed = [couponHook.activeCoupon, ...filteredLastUsed].slice(0, 5);
      
      storage.set(STORAGE_KEYS.LAST_USED_COUPONS, updatedLastUsed);
    } else {
      storage.remove(STORAGE_KEYS.ACTIVE_COUPON);
    }
  }, [couponHook.activeCoupon, enablePersistence, maxHistorySize]);

  return couponHook;
}

// Provider component
export function CouponProvider({ 
  children, 
  enablePersistence = true, 
  maxHistorySize = 10 
}: CouponProviderProps) {
  const couponHook = useCouponsWithPersistence(enablePersistence, maxHistorySize);
  
  // Additional state for context
  const [lastUsedCoupons, setLastUsedCoupons] = React.useState<Coupon[]>([]);
  const [couponHistory, setCouponHistory] = React.useState<Array<{ coupon: Coupon; usedAt: string }>>([]);

  // Load additional data from storage
  useEffect(() => {
    if (enablePersistence) {
      const savedLastUsed = storage.get(STORAGE_KEYS.LAST_USED_COUPONS) || [];
      const savedHistory = storage.get(STORAGE_KEYS.COUPON_HISTORY) || [];
      
      setLastUsedCoupons(savedLastUsed);
      setCouponHistory(savedHistory);
    }
  }, [enablePersistence]);

  // Enhanced clear function that also clears persistence
  const enhancedClearCoupon = React.useCallback(() => {
    couponHook.clearCoupon();
    if (enablePersistence) {
      storage.remove(STORAGE_KEYS.ACTIVE_COUPON);
      storage.remove(STORAGE_KEYS.COUPON_CODE);
    }
  }, [couponHook.clearCoupon, enablePersistence]);

  // Context value
  const contextValue: CouponContextType = {
    // Base hook functionality
    ...couponHook,
    clearCoupon: enhancedClearCoupon,
    
    // Additional context features
    isPersistent: enablePersistence,
    lastUsedCoupons,
    couponHistory
  };

  return (
    <CouponContext.Provider value={contextValue}>
      {children}
    </CouponContext.Provider>
  );
}

// Utility hooks for specific use cases

// Hook for getting coupon discount information
export function useCouponDiscount() {
  const { activeCoupon, getCouponDiscount, getDiscountedPrice, getDiscountDisplay } = useCouponContext();
  
  return {
    activeCoupon,
    getCouponDiscount,
    getDiscountedPrice,
    getDiscountDisplay,
    hasActiveCoupon: Boolean(activeCoupon),
    discountPercent: activeCoupon?.discountPercent || 0
  };
}

// Hook for coupon input components
export function useCouponInput() {
  const { 
    couponCode, 
    setCouponCode, 
    applyCoupon, 
    isApplyingCoupon, 
    couponMessage,
    lastUsedCoupons 
  } = useCouponContext();
  
  return {
    couponCode,
    setCouponCode,
    applyCoupon,
    isApplyingCoupon,
    couponMessage,
    lastUsedCoupons
  };
}

// Hook for coupon display components
export function useCouponDisplay() {
  const { 
    activeCoupon, 
    clearCoupon, 
    formatCouponMessage, 
    checkCouponExpiry,
    getDiscountDisplay 
  } = useCouponContext();
  
  const couponInfo = activeCoupon ? {
    ...activeCoupon,
    formattedMessage: formatCouponMessage(activeCoupon),
    expiryInfo: checkCouponExpiry(activeCoupon),
    displayText: getDiscountDisplay(activeCoupon)
  } : null;
  
  return {
    activeCoupon,
    couponInfo,
    clearCoupon,
    hasActiveCoupon: Boolean(activeCoupon)
  };
}

// Hook for admin coupon management
export function useCouponHistory() {
  const { couponHistory, lastUsedCoupons } = useCouponContext();
  
  const clearHistory = React.useCallback(() => {
    storage.remove(STORAGE_KEYS.COUPON_HISTORY);
    storage.remove(STORAGE_KEYS.LAST_USED_COUPONS);
    // Force re-render by updating state
    window.location.reload();
  }, []);
  
  return {
    couponHistory,
    lastUsedCoupons,
    clearHistory,
    historyCount: couponHistory.length,
    lastUsedCount: lastUsedCoupons.length
  };
}

// Export the context for advanced usage
export { CouponContext };