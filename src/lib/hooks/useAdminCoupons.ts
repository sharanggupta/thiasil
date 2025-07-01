import { useCallback, useState, useEffect } from 'react';
import { useAdminApi, AdminCredentials, ADMIN_ENDPOINTS, ADMIN_ACTIONS } from './useAdminApi';
import { useApiGet } from './useApi';

// Types
interface Coupon {
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

interface CouponForm {
  code: string;
  discountPercent: number;
  expiryDate: string;
  maxUses: number;
  description: string;
  minOrderValue: number;
  isActive: boolean;
  applicableCategories: string[];
}

interface LoadingStates {
  loading: boolean;
  creating: boolean;
  updating: boolean;
  deleting: boolean;
  activating: boolean;
  deactivating: boolean;
}

interface UseAdminCouponsResult {
  // Data
  coupons: Coupon[];
  activeCoupons: Coupon[];
  expiredCoupons: Coupon[];
  
  // Form
  couponForm: CouponForm;
  
  // Loading States
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  isActivating: boolean;
  isDeactivating: boolean;
  loadingStates: LoadingStates;
  
  // Error Handling
  error: any;
  hasError: boolean;
  
  // Statistics
  totalCoupons: number;
  activeCouponsCount: number;
  expiredCouponsCount: number;
  totalUsage: number;
  
  // Actions
  loadCoupons: () => Promise<void>;
  createCoupon: () => Promise<boolean>;
  updateCoupon: (id: string, data: Partial<CouponForm>) => Promise<boolean>;
  deleteCoupon: (id: string) => Promise<boolean>;
  activateCoupon: (id: string) => Promise<boolean>;
  deactivateCoupon: (id: string) => Promise<boolean>;
  bulkDeleteCoupons: (ids: string[]) => Promise<boolean>;
  
  // Form Management
  setCouponForm: (form: Partial<CouponForm>) => void;
  resetCouponForm: () => void;
  validateCouponForm: () => { isValid: boolean; errors: Record<string, string> };
  
  // Utilities
  getCouponById: (id: string) => Coupon | undefined;
  getCouponByCode: (code: string) => Coupon | undefined;
  getExpiringSoonCoupons: (days?: number) => Coupon[];
  
  // Error Recovery
  retry: () => Promise<void>;
  clearError: () => void;
}

// Initial states
const initialCouponForm: CouponForm = {
  code: '',
  discountPercent: 10,
  expiryDate: '',
  maxUses: 0,
  description: '',
  minOrderValue: 0,
  isActive: true,
  applicableCategories: []
};

const initialLoadingStates: LoadingStates = {
  loading: false,
  creating: false,
  updating: false,
  deleting: false,
  activating: false,
  deactivating: false
};

export function useAdminCoupons(
  credentials: AdminCredentials,
  setMessage?: (message: string) => void
): UseAdminCouponsResult {
  // Data fetching with enhanced error handling - NO immediate loading
  const {
    data: couponsData,
    isLoading: isLoadingCoupons,
    error: loadError,
    execute: refetchCoupons,
    retry: retryLoad
  } = useApiGet<Coupon[]>('/api/coupons', {
    immediate: false, // Never load automatically
    cacheKey: 'admin_coupons_data',
    retryAttempts: 3,
    retryDelay: 1000,
    onError: (error) => {
      setMessage?.(`Failed to load coupons: ${error.message}`);
    }
  });

  // Admin API hooks for CRUD operations
  const createCouponApi = useAdminApi({
    endpoint: ADMIN_ENDPOINTS.COUPONS,
    method: 'POST',
    retryAttempts: 2,
    retryDelay: 1500,
    onSuccess: () => {
      setMessage?.('Coupon created successfully!');
      refetchCoupons();
    },
    onError: (error) => {
      setMessage?.(`Failed to create coupon: ${error.details?.error || error.message}`);
    }
  });

  const updateCouponApi = useAdminApi({
    endpoint: ADMIN_ENDPOINTS.COUPONS,
    method: 'POST',
    retryAttempts: 2,
    retryDelay: 1500,
    onSuccess: () => {
      setMessage?.('Coupon updated successfully!');
      refetchCoupons();
    },
    onError: (error) => {
      setMessage?.(`Failed to update coupon: ${error.details?.error || error.message}`);
    }
  });

  const deleteCouponApi = useAdminApi({
    endpoint: ADMIN_ENDPOINTS.COUPONS,
    method: 'POST',
    retryAttempts: 2,
    retryDelay: 1500,
    onSuccess: () => {
      setMessage?.('Coupon deleted successfully!');
      refetchCoupons();
    },
    onError: (error) => {
      setMessage?.(`Failed to delete coupon: ${error.details?.error || error.message}`);
    }
  });

  // Local state
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [couponForm, setCouponForm] = useState<CouponForm>(initialCouponForm);
  const [loadingStates, setLoadingStates] = useState<LoadingStates>(initialLoadingStates);

  // Manual loading only - remove automatic triggers

  // Update coupons when data is loaded
  useEffect(() => {
    if (couponsData) {
      setCoupons(Array.isArray(couponsData) ? couponsData : []);
    }
  }, [couponsData]);

  // Computed values
  const activeCoupons = coupons.filter(coupon => coupon.isActive && !isExpired(coupon));
  const expiredCoupons = coupons.filter(coupon => isExpired(coupon));
  const totalUsage = coupons.reduce((sum, coupon) => sum + (coupon.usedCount || 0), 0);

  // Utility functions (defined early for use in actions)
  const getCouponById = useCallback((id: string): Coupon | undefined => {
    return coupons.find(coupon => coupon.id === id);
  }, [coupons]);

  const getCouponByCode = useCallback((code: string): Coupon | undefined => {
    return coupons.find(coupon => coupon.code.toLowerCase() === code.toLowerCase());
  }, [coupons]);

  // Helper functions
  function isExpired(coupon: Coupon): boolean {
    if (!coupon.expiryDate) return false;
    return new Date(coupon.expiryDate) < new Date();
  }

  function getExpiringSoon(coupon: Coupon, days: number = 7): boolean {
    if (!coupon.expiryDate) return false;
    const expiryDate = new Date(coupon.expiryDate);
    const warningDate = new Date();
    warningDate.setDate(warningDate.getDate() + days);
    return expiryDate <= warningDate && expiryDate > new Date();
  }

  // Enhanced Actions
  const loadCoupons = useCallback(async () => {
    setLoadingStates(prev => ({ ...prev, loading: true }));
    try {
      await refetchCoupons();
    } finally {
      setLoadingStates(prev => ({ ...prev, loading: false }));
    }
  }, [refetchCoupons]);

  const createCoupon = useCallback(async (): Promise<boolean> => {
    const validation = validateCouponForm();
    if (!validation.isValid) {
      const errorMessages = Object.values(validation.errors);
      setMessage?.(errorMessages.join(', '));
      return false;
    }

    // Optimistic update - add coupon immediately to UI
    const optimisticCoupon: Coupon = {
      id: `temp-${Date.now()}`,
      code: couponForm.code.toUpperCase(),
      discountPercent: couponForm.discountPercent,
      expiryDate: couponForm.expiryDate,
      maxUses: couponForm.maxUses,
      usedCount: 0,
      isActive: couponForm.isActive,
      description: couponForm.description,
      minOrderValue: couponForm.minOrderValue,
      applicableCategories: couponForm.applicableCategories,
      createdAt: new Date().toISOString()
    };

    setCoupons(prev => [...prev, optimisticCoupon]);
    setLoadingStates(prev => ({ ...prev, creating: true }));

    try {
      await createCouponApi.executeAsAdmin(credentials, {
        action: ADMIN_ACTIONS.CREATE_COUPON,
        ...couponForm
      });
      setCouponForm(initialCouponForm);
      // Refetch to get the real data and replace optimistic update
      await refetchCoupons();
      return true;
    } catch (error) {
      // Rollback optimistic update on error
      setCoupons(prev => prev.filter(c => c.id !== optimisticCoupon.id));
      return false;
    } finally {
      setLoadingStates(prev => ({ ...prev, creating: false }));
    }
  }, [couponForm, createCouponApi, credentials, setMessage, refetchCoupons]);

  const updateCoupon = useCallback(async (id: string, data: Partial<CouponForm>): Promise<boolean> => {
    setLoadingStates(prev => ({ ...prev, updating: true }));
    try {
      await updateCouponApi.executeAsAdmin(credentials, {
        action: 'update_coupon',
        couponId: id,
        ...data
      });
      return true;
    } catch (error) {
      return false;
    } finally {
      setLoadingStates(prev => ({ ...prev, updating: false }));
    }
  }, [updateCouponApi, credentials]);

  const deleteCoupon = useCallback(async (id: string): Promise<boolean> => {
    // Store the coupon for potential rollback
    const couponToDelete = getCouponById(id);
    if (!couponToDelete) return false;

    // Optimistic update - remove coupon immediately from UI
    setCoupons(prev => prev.filter(c => c.id !== id));
    setLoadingStates(prev => ({ ...prev, deleting: true }));

    try {
      await deleteCouponApi.executeAsAdmin(credentials, {
        action: ADMIN_ACTIONS.DELETE_COUPON,
        couponId: id
      });
      // Success - no need to refetch, optimistic update was correct
      return true;
    } catch (error) {
      // Rollback optimistic update on error
      setCoupons(prev => [...prev, couponToDelete]);
      return false;
    } finally {
      setLoadingStates(prev => ({ ...prev, deleting: false }));
    }
  }, [deleteCouponApi, credentials, getCouponById]);

  const activateCoupon = useCallback(async (id: string): Promise<boolean> => {
    setLoadingStates(prev => ({ ...prev, activating: true }));
    try {
      await updateCouponApi.executeAsAdmin(credentials, {
        action: 'update_coupon',
        couponId: id,
        isActive: true
      });
      setMessage?.('Coupon activated successfully!');
      return true;
    } catch (error) {
      return false;
    } finally {
      setLoadingStates(prev => ({ ...prev, activating: false }));
    }
  }, [updateCouponApi, credentials, setMessage]);

  const deactivateCoupon = useCallback(async (id: string): Promise<boolean> => {
    setLoadingStates(prev => ({ ...prev, deactivating: true }));
    try {
      await updateCouponApi.executeAsAdmin(credentials, {
        action: 'update_coupon',
        couponId: id,
        isActive: false
      });
      setMessage?.('Coupon deactivated successfully!');
      return true;
    } catch (error) {
      return false;
    } finally {
      setLoadingStates(prev => ({ ...prev, deactivating: false }));
    }
  }, [updateCouponApi, credentials, setMessage]);

  const bulkDeleteCoupons = useCallback(async (ids: string[]): Promise<boolean> => {
    // Store coupons for potential rollback
    const couponsToDelete = ids.map(id => getCouponById(id)).filter(Boolean) as Coupon[];
    
    // Optimistic update - remove all coupons immediately from UI
    setCoupons(prev => prev.filter(c => !ids.includes(c.id)));
    setLoadingStates(prev => ({ ...prev, deleting: true }));
    
    try {
      const deletePromises = ids.map(id => 
        deleteCouponApi.executeAsAdmin(credentials, {
          action: ADMIN_ACTIONS.DELETE_COUPON,
          couponId: id
        })
      );
      
      await Promise.all(deletePromises);
      setMessage?.(`Successfully deleted ${ids.length} coupons`);
      // Success - no need to rollback, optimistic update was correct
      return true;
    } catch (error) {
      // Rollback optimistic update on error
      setCoupons(prev => [...prev, ...couponsToDelete]);
      setMessage?.('Some coupons failed to delete');
      return false;
    } finally {
      setLoadingStates(prev => ({ ...prev, deleting: false }));
    }
  }, [deleteCouponApi, credentials, setMessage, getCouponById]);

  // Form management
  const updateCouponForm = useCallback((form: Partial<CouponForm>) => {
    setCouponForm(prev => ({ ...prev, ...form }));
  }, []);

  const resetCouponForm = useCallback(() => {
    setCouponForm(initialCouponForm);
  }, []);

  const validateCouponForm = useCallback((): { isValid: boolean; errors: Record<string, string> } => {
    const errors: Record<string, string> = {};

    if (!couponForm.code.trim()) {
      errors.code = 'Coupon code is required';
    } else if (couponForm.code.length < 3) {
      errors.code = 'Coupon code must be at least 3 characters';
    } else if (!/^[A-Z0-9]+$/.test(couponForm.code)) {
      errors.code = 'Coupon code must contain only uppercase letters and numbers';
    }

    if (couponForm.discountPercent <= 0 || couponForm.discountPercent > 100) {
      errors.discountPercent = 'Discount must be between 1 and 100 percent';
    }

    if (couponForm.expiryDate) {
      const expiryDate = new Date(couponForm.expiryDate);
      if (expiryDate <= new Date()) {
        errors.expiryDate = 'Expiry date must be in the future';
      }
    }

    if (couponForm.maxUses < 0) {
      errors.maxUses = 'Max uses cannot be negative';
    }

    if (couponForm.minOrderValue < 0) {
      errors.minOrderValue = 'Minimum order value cannot be negative';
    }

    // Check for duplicate coupon codes (only if we have a code)
    if (couponForm.code.trim()) {
      const existingCoupon = getCouponByCode(couponForm.code);
      if (existingCoupon) {
        errors.code = 'A coupon with this code already exists';
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }, [couponForm]);

  // Additional utility functions

  const getExpiringSoonCoupons = useCallback((days: number = 7): Coupon[] => {
    return coupons.filter(coupon => getExpiringSoon(coupon, days));
  }, [coupons]);

  // Error recovery
  const retry = useCallback(async () => {
    await retryLoad();
  }, [retryLoad]);

  const clearError = useCallback(() => {
    createCouponApi?.reset?.();
    updateCouponApi?.reset?.();
    deleteCouponApi?.reset?.();
  }, [createCouponApi, updateCouponApi, deleteCouponApi]);

  // Combined error state
  const combinedError = loadError || createCouponApi?.error || updateCouponApi?.error || deleteCouponApi?.error;
  const hasError = Boolean(combinedError);

  return {
    // Data
    coupons,
    activeCoupons,
    expiredCoupons,
    
    // Form
    couponForm,
    
    // Loading States
    isLoading: isLoadingCoupons || loadingStates.loading,
    isCreating: loadingStates.creating,
    isUpdating: loadingStates.updating,
    isDeleting: loadingStates.deleting,
    isActivating: loadingStates.activating,
    isDeactivating: loadingStates.deactivating,
    loadingStates,
    
    // Error Handling
    error: combinedError,
    hasError,
    
    // Statistics
    totalCoupons: coupons.length,
    activeCouponsCount: activeCoupons.length,
    expiredCouponsCount: expiredCoupons.length,
    totalUsage,
    
    // Actions
    loadCoupons,
    createCoupon,
    updateCoupon,
    deleteCoupon,
    activateCoupon,
    deactivateCoupon,
    bulkDeleteCoupons,
    
    // Form Management
    setCouponForm: updateCouponForm,
    resetCouponForm,
    validateCouponForm,
    
    // Utilities
    getCouponById,
    getCouponByCode,
    getExpiringSoonCoupons,
    
    // Error Recovery
    retry,
    clearError
  };
}