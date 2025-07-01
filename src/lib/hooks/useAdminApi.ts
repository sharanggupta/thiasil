import { useCallback } from 'react';
import { useApi, UseApiOptions, UseApiResult, ApiError, ERROR_TYPES } from './useApi';

// Types
export interface AdminApiOptions<T> extends Omit<UseApiOptions<T>, 'headers'> {
  action?: string;
  requireAuth?: boolean;
  headers?: Record<string, string>;
}

export interface AdminCredentials {
  username: string;
  password: string;
}

export interface UseAdminApiResult<T> extends UseApiResult<T> {
  executeAsAdmin: (
    credentials: AdminCredentials,
    requestData?: any,
    options?: Partial<AdminApiOptions<T>>
  ) => Promise<T>;
}

// Admin API endpoints
export const ADMIN_ENDPOINTS = {
  ADD_PRODUCTS: '/api/admin/add-products',
  UPDATE_PRICES: '/api/admin/update-prices',
  UPDATE_INVENTORY: '/api/admin/update-inventory',
  BACKUP_MANAGEMENT: '/api/admin/backup-management',
  ANALYZE_IMAGES: '/api/admin/analyze-images',
  UPLOAD_IMAGE: '/api/upload-image',
  COUPONS: '/api/coupons',
  PRODUCTS: '/api/products'
} as const;

// Admin actions
export const ADMIN_ACTIONS = {
  ADD_CATEGORY: 'add_category',
  ADD_PRODUCT: 'add_product',
  UPDATE_PRICES: 'update_prices',
  UPDATE_INVENTORY: 'update_inventory',
  CREATE_BACKUP: 'create_backup',
  RESTORE_BACKUP: 'restore_backup',
  DELETE_BACKUP: 'delete_backup',
  ANALYZE_IMAGES: 'analyze_images',
  CLEANUP_IMAGES: 'cleanup_images',
  CREATE_COUPON: 'create_coupon',
  DELETE_COUPON: 'delete_coupon'
} as const;

// Validation helpers
export function validateAdminCredentials(credentials: AdminCredentials): boolean {
  return Boolean(credentials.username && credentials.password);
}

export function createAuthError(message: string = 'Authentication required'): ApiError {
  return {
    message,
    status: 401,
    code: ERROR_TYPES.AUTHENTICATION,
    timestamp: Date.now(),
    endpoint: 'admin',
    method: 'POST'
  };
}

// Main admin API hook
export function useAdminApi<T = any>(options: AdminApiOptions<T>): UseAdminApiResult<T> {
  const {
    action,
    requireAuth = true,
    headers = {},
    ...apiOptions
  } = options;

  const baseApi = useApi<T>({
    ...apiOptions,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    }
  });

  // Execute request with admin credentials
  const executeAsAdmin = useCallback(async (
    credentials: AdminCredentials,
    requestData?: any,
    overrideOptions?: Partial<AdminApiOptions<T>>
  ): Promise<T> => {
    // Validate credentials if authentication is required
    if (requireAuth && !validateAdminCredentials(credentials)) {
      const authError = createAuthError('Session expired. Please login again.');
      if (options.onError) options.onError(authError);
      throw authError;
    }

    // Prepare request data with credentials
    const adminRequestData = {
      ...credentials,
      ...(action && { action }),
      ...requestData
    };

    // Merge options
    const mergedOptions = {
      ...options,
      ...overrideOptions,
      headers: {
        ...headers,
        ...overrideOptions?.headers
      }
    };

    return baseApi.execute(adminRequestData, mergedOptions);
  }, [baseApi, requireAuth, action, options, headers]);

  return {
    ...baseApi,
    executeAsAdmin
  };
}

// Specialized admin hooks for common operations

// Products management
export function useAdminProducts(credentials: AdminCredentials) {
  const addProductApi = useAdminApi({
    endpoint: ADMIN_ENDPOINTS.ADD_PRODUCTS,
    method: 'POST',
    action: ADMIN_ACTIONS.ADD_PRODUCT
  });

  const addCategoryApi = useAdminApi({
    endpoint: ADMIN_ENDPOINTS.ADD_PRODUCTS,
    method: 'POST',
    action: ADMIN_ACTIONS.ADD_CATEGORY
  });

  const addProduct = useCallback(async (productData: any) => {
    return addProductApi.executeAsAdmin(credentials, { productData });
  }, [addProductApi, credentials]);

  const addCategory = useCallback(async (categoryData: any) => {
    return addCategoryApi.executeAsAdmin(credentials, { categoryData });
  }, [addCategoryApi, credentials]);

  return {
    addProduct,
    addCategory,
    isLoading: addProductApi.isLoading || addCategoryApi.isLoading,
    error: addProductApi.error || addCategoryApi.error
  };
}

// Price management
export function useAdminPrices(credentials: AdminCredentials) {
  const priceApi = useAdminApi({
    endpoint: ADMIN_ENDPOINTS.UPDATE_PRICES,
    method: 'POST'
  });

  const updatePrices = useCallback(async (priceChangePercent: number) => {
    if (priceChangePercent < -50 || priceChangePercent > 100) {
      throw new Error('Price change percentage must be between -50 and 100');
    }

    return priceApi.executeAsAdmin(credentials, { 
      priceChangePercent,
      credentials // Some endpoints expect nested credentials
    });
  }, [priceApi, credentials]);

  return {
    updatePrices,
    isLoading: priceApi.isLoading,
    error: priceApi.error,
    retry: priceApi.retry,
    reset: priceApi.reset
  };
}

// Inventory management
export function useAdminInventory(credentials: AdminCredentials) {
  const inventoryApi = useAdminApi({
    endpoint: ADMIN_ENDPOINTS.UPDATE_INVENTORY,
    method: 'POST'
  });

  const updateInventory = useCallback(async (inventoryData: {
    stockStatus: string;
    quantity?: string | null;
    selectedCategory?: string | null;
    selectedProductId?: string | null;
  }) => {
    return inventoryApi.executeAsAdmin(credentials, { 
      ...inventoryData,
      credentials // Some endpoints expect nested credentials
    });
  }, [inventoryApi, credentials]);

  return {
    updateInventory,
    isLoading: inventoryApi.isLoading,
    error: inventoryApi.error,
    retry: inventoryApi.retry,
    reset: inventoryApi.reset
  };
}

// Backup management
export function useAdminBackups(credentials: AdminCredentials) {
  const backupApi = useAdminApi({
    endpoint: ADMIN_ENDPOINTS.BACKUP_MANAGEMENT,
    method: 'POST'
  });

  const createBackup = useCallback(async () => {
    return backupApi.executeAsAdmin(credentials, { action: ADMIN_ACTIONS.CREATE_BACKUP });
  }, [backupApi, credentials]);

  const deleteBackup = useCallback(async (filename: string) => {
    return backupApi.executeAsAdmin(credentials, { 
      action: ADMIN_ACTIONS.DELETE_BACKUP,
      filename 
    });
  }, [backupApi, credentials]);

  const restoreBackup = useCallback(async (filename: string) => {
    return backupApi.executeAsAdmin(credentials, { 
      action: ADMIN_ACTIONS.RESTORE_BACKUP,
      filename 
    });
  }, [backupApi, credentials]);

  return {
    createBackup,
    deleteBackup,
    restoreBackup,
    isLoading: backupApi.isLoading,
    error: backupApi.error,
    retry: backupApi.retry,
    reset: backupApi.reset
  };
}

// Image management
export function useAdminImages(credentials: AdminCredentials) {
  const imageAnalysisApi = useAdminApi({
    endpoint: ADMIN_ENDPOINTS.ANALYZE_IMAGES,
    method: 'POST'
  });

  const imageUploadApi = useAdminApi({
    endpoint: ADMIN_ENDPOINTS.UPLOAD_IMAGE,
    method: 'POST',
    headers: {} // No Content-Type for FormData
  });

  const analyzeImages = useCallback(async () => {
    return imageAnalysisApi.executeAsAdmin(credentials);
  }, [imageAnalysisApi, credentials]);

  const uploadImage = useCallback(async (imageData: {
    image: File;
    productName: string;
    categorySlug: string;
  }) => {
    const formData = new FormData();
    formData.append('image', imageData.image);
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);
    formData.append('productName', imageData.productName);
    formData.append('categorySlug', imageData.categorySlug);

    // Use base fetch for FormData
    const response = await fetch(ADMIN_ENDPOINTS.UPLOAD_IMAGE, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.error || 'Failed to upload image');
    }

    return response.json();
  }, [credentials]);

  return {
    analyzeImages,
    uploadImage,
    isAnalyzing: imageAnalysisApi.isLoading,
    isUploading: false, // Handled separately for FormData
    error: imageAnalysisApi.error,
    reset: imageAnalysisApi.reset
  };
}

// Coupon management
export function useAdminCoupons(credentials: AdminCredentials) {
  const couponApi = useAdminApi({
    endpoint: ADMIN_ENDPOINTS.COUPONS,
    method: 'POST'
  });

  const createCoupon = useCallback(async (couponData: any) => {
    return couponApi.executeAsAdmin(credentials, { 
      action: ADMIN_ACTIONS.CREATE_COUPON,
      ...couponData 
    });
  }, [couponApi, credentials]);

  const deleteCoupon = useCallback(async (couponId: string) => {
    return couponApi.executeAsAdmin(credentials, { 
      action: ADMIN_ACTIONS.DELETE_COUPON,
      couponId 
    });
  }, [couponApi, credentials]);

  return {
    createCoupon,
    deleteCoupon,
    isLoading: couponApi.isLoading,
    error: couponApi.error,
    retry: couponApi.retry,
    reset: couponApi.reset
  };
}