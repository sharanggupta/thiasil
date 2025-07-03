"use client";
import React from 'react';
import { AdminTabContent } from '@/app/components/admin/TabContent';
import { adaptPropsToGrouped } from '@/app/components/admin/TabContent/propsAdapter';

// Original interface for backward compatibility
interface AdminTabContentProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
  
  // Dashboard data
  products: any[];
  categories: any[];
  backups: any[];
  coupons: any[];
  
  // Common props for all tabs
  isAuthenticated: boolean;
  username: string;
  password: string;
  setMessage: (message: string) => void;
  
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
  
  // Loading states
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  
  // API functions (from hooks)
  updatePrices: () => Promise<void>;
  updateInventory: () => Promise<void>;
  loadProducts: () => void;
  
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

export default function AdminTabContentAdapter(props: AdminTabContentProps) {
  const {
    activeTab,
    onTabChange,
    setMessage,
    isLoading,
    setIsLoading,
    loadProducts,
    ...restProps
  } = props;

  // Convert old props structure to new grouped structure
  const groupedProps = adaptPropsToGrouped(restProps as any);

  return (
    <AdminTabContent
      activeTab={activeTab}
      onTabChange={onTabChange}
      data={groupedProps.data}
      auth={groupedProps.auth}
      setMessage={setMessage}
      isLoading={isLoading}
      setIsLoading={setIsLoading}
      loadProducts={loadProducts}
      priceManagement={groupedProps.priceManagement}
      inventoryManagement={groupedProps.inventoryManagement}
      imageAnalysis={groupedProps.imageAnalysis}
      productAddition={groupedProps.productAddition}
      couponManagement={groupedProps.couponManagement}
    />
  );
}