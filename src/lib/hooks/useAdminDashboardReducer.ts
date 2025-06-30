import { useReducer, useCallback } from 'react';

// Types
interface ImageAnalysis {
  unusedCount: number;
  totalSize: string;
  unusedImages?: Array<{
    filename: string;
    size: string;
    path: string;
  }>;
}

interface AdminDashboardState {
  // UI State
  activeTab: string;
  isLoading: boolean;
  message: string;
  
  // Price Management
  priceChangePercent: string;
  priceFormValid: boolean;
  
  // Inventory Management  
  stockStatus: string;
  quantity: string;
  selectedCategory: string;
  selectedProductId: string;
  inventoryFormValid: boolean;
  
  // Image Management
  imageAnalysis: ImageAnalysis | null;
  isImageLoading: boolean;
  
  // Operation Results
  lastOperation: {
    type: 'price_update' | 'inventory_update' | 'image_analysis' | null;
    success: boolean;
    timestamp: number;
  };
}

// Actions
type AdminDashboardAction =
  | { type: 'SET_ACTIVE_TAB'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_MESSAGE'; payload: string }
  | { type: 'CLEAR_MESSAGE' }
  | { type: 'UPDATE_PRICE_PERCENT'; payload: string }
  | { type: 'UPDATE_STOCK_STATUS'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: string }
  | { type: 'SET_SELECTED_CATEGORY'; payload: string }
  | { type: 'SET_SELECTED_PRODUCT_ID'; payload: string }
  | { type: 'SET_IMAGE_LOADING'; payload: boolean }
  | { type: 'SET_IMAGE_ANALYSIS'; payload: ImageAnalysis }
  | { type: 'CLEAR_IMAGE_ANALYSIS' }
  | { type: 'OPERATION_START'; payload: 'price_update' | 'inventory_update' | 'image_analysis' }
  | { type: 'OPERATION_SUCCESS'; payload: { type: 'price_update' | 'inventory_update' | 'image_analysis'; message: string } }
  | { type: 'OPERATION_ERROR'; payload: { type: 'price_update' | 'inventory_update' | 'image_analysis'; message: string } }
  | { type: 'RESET_PRICE_FORM' }
  | { type: 'RESET_INVENTORY_FORM' }
  | { type: 'RESET_ALL_FORMS' };

// Initial state
const initialState: AdminDashboardState = {
  activeTab: 'dashboard',
  isLoading: false,
  message: '',
  priceChangePercent: '10',
  priceFormValid: true,
  stockStatus: 'in_stock',
  quantity: '',
  selectedCategory: 'all',
  selectedProductId: 'all',
  inventoryFormValid: true,
  imageAnalysis: null,
  isImageLoading: false,
  lastOperation: {
    type: null,
    success: false,
    timestamp: 0
  }
};

// Validation functions
const validatePricePercent = (value: string): boolean => {
  const percent = parseFloat(value);
  return !isNaN(percent) && percent >= -50 && percent <= 100;
};

const validateInventoryForm = (stockStatus: string, quantity: string): boolean => {
  // Basic validation - stock status should be valid
  const validStatuses = ['in_stock', 'out_of_stock', 'low_stock', 'discontinued'];
  const isStatusValid = validStatuses.includes(stockStatus);
  
  // If quantity is provided, it should be a valid number
  const isQuantityValid = quantity === '' || (!isNaN(parseInt(quantity)) && parseInt(quantity) >= 0);
  
  return isStatusValid && isQuantityValid;
};

// Reducer
function adminDashboardReducer(state: AdminDashboardState, action: AdminDashboardAction): AdminDashboardState {
  switch (action.type) {
    case 'SET_ACTIVE_TAB':
      return {
        ...state,
        activeTab: action.payload,
        message: '' // Clear messages when switching tabs
      };

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      };

    case 'SET_MESSAGE':
      return {
        ...state,
        message: action.payload
      };

    case 'CLEAR_MESSAGE':
      return {
        ...state,
        message: ''
      };

    case 'UPDATE_PRICE_PERCENT': {
      const newPercent = action.payload;
      return {
        ...state,
        priceChangePercent: newPercent,
        priceFormValid: validatePricePercent(newPercent)
      };
    }

    case 'UPDATE_STOCK_STATUS': {
      const newStatus = action.payload;
      return {
        ...state,
        stockStatus: newStatus,
        inventoryFormValid: validateInventoryForm(newStatus, state.quantity)
      };
    }

    case 'UPDATE_QUANTITY': {
      const newQuantity = action.payload;
      return {
        ...state,
        quantity: newQuantity,
        inventoryFormValid: validateInventoryForm(state.stockStatus, newQuantity)
      };
    }

    case 'SET_SELECTED_CATEGORY':
      return {
        ...state,
        selectedCategory: action.payload,
        // Reset product selection when category changes
        selectedProductId: 'all'
      };

    case 'SET_SELECTED_PRODUCT_ID':
      return {
        ...state,
        selectedProductId: action.payload
      };

    case 'SET_IMAGE_LOADING':
      return {
        ...state,
        isImageLoading: action.payload
      };

    case 'SET_IMAGE_ANALYSIS':
      return {
        ...state,
        imageAnalysis: action.payload,
        isImageLoading: false
      };

    case 'CLEAR_IMAGE_ANALYSIS':
      return {
        ...state,
        imageAnalysis: null
      };

    case 'OPERATION_START':
      return {
        ...state,
        isLoading: true,
        message: '',
        lastOperation: {
          type: action.payload,
          success: false,
          timestamp: Date.now()
        }
      };

    case 'OPERATION_SUCCESS':
      return {
        ...state,
        isLoading: false,
        message: `✅ ${action.payload.message}`,
        lastOperation: {
          type: action.payload.type,
          success: true,
          timestamp: Date.now()
        }
      };

    case 'OPERATION_ERROR':
      return {
        ...state,
        isLoading: false,
        message: `❌ Error: ${action.payload.message}`,
        lastOperation: {
          type: action.payload.type,
          success: false,
          timestamp: Date.now()
        }
      };

    case 'RESET_PRICE_FORM':
      return {
        ...state,
        priceChangePercent: '10',
        priceFormValid: true
      };

    case 'RESET_INVENTORY_FORM':
      return {
        ...state,
        stockStatus: 'in_stock',
        quantity: '',
        selectedCategory: 'all',
        selectedProductId: 'all',
        inventoryFormValid: true
      };

    case 'RESET_ALL_FORMS':
      return {
        ...initialState,
        activeTab: state.activeTab // Keep current tab
      };

    default:
      return state;
  }
}

// Hook
export function useAdminDashboardReducer() {
  const [state, dispatch] = useReducer(adminDashboardReducer, initialState);

  // Action creators
  const setActiveTab = useCallback((tab: string) => {
    dispatch({ type: 'SET_ACTIVE_TAB', payload: tab });
  }, []);

  const setMessage = useCallback((message: string) => {
    dispatch({ type: 'SET_MESSAGE', payload: message });
  }, []);

  const clearMessage = useCallback(() => {
    dispatch({ type: 'CLEAR_MESSAGE' });
  }, []);

  const updatePricePercent = useCallback((percent: string) => {
    // Sanitize input
    const sanitized = percent.replace(/[<>]/g, '').trim();
    dispatch({ type: 'UPDATE_PRICE_PERCENT', payload: sanitized });
  }, []);

  const updateStockStatus = useCallback((status: string) => {
    dispatch({ type: 'UPDATE_STOCK_STATUS', payload: status });
  }, []);

  const updateQuantity = useCallback((quantity: string) => {
    // Sanitize and validate numeric input
    const sanitized = quantity.replace(/[<>]/g, '').trim();
    dispatch({ type: 'UPDATE_QUANTITY', payload: sanitized });
  }, []);

  const setSelectedCategory = useCallback((category: string) => {
    dispatch({ type: 'SET_SELECTED_CATEGORY', payload: category });
  }, []);

  const setSelectedProductId = useCallback((productId: string) => {
    dispatch({ type: 'SET_SELECTED_PRODUCT_ID', payload: productId });
  }, []);

  // Operation handlers
  const startOperation = useCallback((type: 'price_update' | 'inventory_update' | 'image_analysis') => {
    dispatch({ type: 'OPERATION_START', payload: type });
  }, []);

  const operationSuccess = useCallback((type: 'price_update' | 'inventory_update' | 'image_analysis', message: string) => {
    dispatch({ type: 'OPERATION_SUCCESS', payload: { type, message } });
  }, []);

  const operationError = useCallback((type: 'price_update' | 'inventory_update' | 'image_analysis', message: string) => {
    dispatch({ type: 'OPERATION_ERROR', payload: { type, message } });
  }, []);

  // Image analysis handlers
  const setImageAnalysis = useCallback((analysis: ImageAnalysis) => {
    dispatch({ type: 'SET_IMAGE_ANALYSIS', payload: analysis });
  }, []);

  const clearImageAnalysis = useCallback(() => {
    dispatch({ type: 'CLEAR_IMAGE_ANALYSIS' });
  }, []);

  const setImageLoading = useCallback((loading: boolean) => {
    dispatch({ type: 'SET_IMAGE_LOADING', payload: loading });
  }, []);

  // Form resetters
  const resetPriceForm = useCallback(() => {
    dispatch({ type: 'RESET_PRICE_FORM' });
  }, []);

  const resetInventoryForm = useCallback(() => {
    dispatch({ type: 'RESET_INVENTORY_FORM' });
  }, []);

  const resetAllForms = useCallback(() => {
    dispatch({ type: 'RESET_ALL_FORMS' });
  }, []);

  // Computed properties
  const canUpdatePrices = state.priceFormValid && !state.isLoading;
  const canUpdateInventory = state.inventoryFormValid && !state.isLoading;
  const hasRecentOperation = Date.now() - state.lastOperation.timestamp < 5000; // 5 seconds

  // Validation getters
  const getPriceValidationError = (): string => {
    if (!state.priceFormValid) {
      return 'Price change percentage must be between -50 and 100';
    }
    return '';
  };

  const getInventoryValidationError = (): string => {
    if (!state.inventoryFormValid) {
      return 'Please check your inventory settings';
    }
    return '';
  };

  return {
    // State
    ...state,

    // Actions
    setActiveTab,
    setMessage,
    clearMessage,
    updatePricePercent,
    updateStockStatus,
    updateQuantity,
    setSelectedCategory,
    setSelectedProductId,
    startOperation,
    operationSuccess,
    operationError,
    setImageAnalysis,
    clearImageAnalysis,
    setImageLoading,
    resetPriceForm,
    resetInventoryForm,
    resetAllForms,

    // Computed properties
    canUpdatePrices,
    canUpdateInventory,
    hasRecentOperation,
    getPriceValidationError,
    getInventoryValidationError,

    // Direct dispatch for advanced usage
    dispatch
  };
}

// Type exports
export type { AdminDashboardState, ImageAnalysis };