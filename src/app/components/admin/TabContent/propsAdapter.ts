import {
  AdminData,
  AuthContext,
  PriceManagement,
  InventoryManagement,
  ImageAnalysis,
  ProductAddition,
  CouponManagement
} from './types';

// Original AdminTabContent props interface (for compatibility)
interface OriginalAdminTabContentProps {
  // Dashboard data
  products: any[];
  categories: any[];
  backups: any[];
  coupons: any[];
  
  // Common props for all tabs
  isAuthenticated: boolean;
  username: string;
  password: string;
  
  // Price management props
  priceChangePercent: string;
  setPriceChangePercent: (value: string) => void;
  
  // Inventory props
  stockStatus: string;
  setStockStatus: (value: string) => void;
  quantity: string;
  setQuantity: (value: string) => void;
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  selectedProductId: string;
  setSelectedProductId: (value: string) => void;
  
  // API functions (from hooks)
  updatePrices: () => Promise<void>;
  updateInventory: () => Promise<void>;
  
  // Image analysis props
  imageAnalysis: any;
  setImageAnalysis: (analysis: any) => void;
  isImageLoading: boolean;
  setIsImageLoading: (loading: boolean) => void;
  analyzeImages: () => Promise<void>;
  cleanupImages: () => Promise<void>;
  
  // Product addition props
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
  
  // Coupon form props
  couponForm: any;
  setCouponForm: (form: any) => void;
  isCouponLoading: boolean;
  createCoupon: () => void;
  deleteCoupon: (id: string) => void;
}

export function adaptPropsToGrouped(props: OriginalAdminTabContentProps) {
  const data: AdminData = {
    products: props.products,
    categories: props.categories,
    backups: props.backups,
    coupons: props.coupons
  };

  const auth: AuthContext = {
    isAuthenticated: props.isAuthenticated,
    username: props.username,
    password: props.password
  };

  const priceManagement: PriceManagement = {
    priceChangePercent: props.priceChangePercent,
    setPriceChangePercent: props.setPriceChangePercent,
    updatePrices: props.updatePrices
  };

  const inventoryManagement: InventoryManagement = {
    stockStatus: props.stockStatus,
    setStockStatus: props.setStockStatus,
    quantity: props.quantity,
    setQuantity: props.setQuantity,
    selectedCategory: props.selectedCategory,
    setSelectedCategory: props.setSelectedCategory,
    selectedProductId: props.selectedProductId,
    setSelectedProductId: props.setSelectedProductId,
    updateInventory: props.updateInventory
  };

  const imageAnalysis: ImageAnalysis = {
    imageAnalysis: props.imageAnalysis,
    setImageAnalysis: props.setImageAnalysis,
    isImageLoading: props.isImageLoading,
    setIsImageLoading: props.setIsImageLoading,
    analyzeImages: props.analyzeImages,
    cleanupImages: props.cleanupImages
  };

  const productAddition: ProductAddition = {
    categoryForm: props.categoryForm,
    setCategoryForm: props.setCategoryForm,
    productForm: props.productForm,
    setProductForm: props.setProductForm,
    newDimensionField: props.newDimensionField,
    setNewDimensionField: props.setNewDimensionField,
    newFeature: props.newFeature,
    setNewFeature: props.setNewFeature,
    isAddLoading: props.isAddLoading,
    isUploading: props.isUploading,
    selectedImage: props.selectedImage,
    imagePreview: props.imagePreview,
    addCategory: props.addCategory,
    addProduct: props.addProduct,
    addDimensionField: props.addDimensionField,
    removeDimensionField: props.removeDimensionField,
    handleImageSelect: props.handleImageSelect,
    handleImageUpload: props.handleImageUpload
  };

  const couponManagement: CouponManagement = {
    couponForm: props.couponForm,
    setCouponForm: props.setCouponForm,
    isCouponLoading: props.isCouponLoading,
    createCoupon: props.createCoupon,
    deleteCoupon: props.deleteCoupon
  };

  return {
    data,
    auth,
    priceManagement,
    inventoryManagement,
    imageAnalysis,
    productAddition,
    couponManagement
  };
}