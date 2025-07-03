// Core admin data types
export interface AdminData {
  products: any[];
  categories: any[];
  backups: any[];
  coupons: any[];
}

// Authentication context
export interface AuthContext {
  isAuthenticated: boolean;
  username: string;
  password: string;
}

// Price management context
export interface PriceManagement {
  priceChangePercent: string;
  setPriceChangePercent: (value: string) => void;
  updatePrices: () => Promise<void>;
}

// Inventory management context
export interface InventoryManagement {
  stockStatus: string;
  setStockStatus: (value: string) => void;
  quantity: string;
  setQuantity: (value: string) => void;
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  selectedProductId: string;
  setSelectedProductId: (value: string) => void;
  updateInventory: () => Promise<void>;
}

// Image analysis context
export interface ImageAnalysis {
  imageAnalysis: any;
  setImageAnalysis: (analysis: any) => void;
  isImageLoading: boolean;
  setIsImageLoading: (loading: boolean) => void;
  analyzeImages: () => Promise<void>;
  cleanupImages: () => Promise<void>;
}

// Product addition context
export interface ProductAddition {
  categoryForm: any;
  setCategoryForm: (form: any) => void;
  productForm: any;
  setProductForm: (form: any) => void;
  newDimensionField: any;
  setNewDimensionField: (field: any) => void;
  newFeature: string;
  setNewFeature: (feature: string) => void;
  isAddLoading: boolean;
  isUploading: boolean;
  selectedImage: any;
  imagePreview: string;
  addCategory: () => void;
  addProduct: () => void;
  addDimensionField: () => void;
  removeDimensionField: (index: number) => void;
  handleImageSelect: (event: any) => void;
  handleImageUpload: (file: any) => void;
}

// Coupon management context
export interface CouponManagement {
  couponForm: any;
  setCouponForm: (form: any) => void;
  isCouponLoading: boolean;
  createCoupon: () => void;
  deleteCoupon: (id: string) => void;
}

// Main component props (simplified)
export interface AdminTabContentProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
  data: AdminData;
  auth: AuthContext;
  setMessage: (message: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  loadProducts: () => void;
  priceManagement: PriceManagement;
  inventoryManagement: InventoryManagement;
  imageAnalysis: ImageAnalysis;
  productAddition: ProductAddition;
  couponManagement: CouponManagement;
}