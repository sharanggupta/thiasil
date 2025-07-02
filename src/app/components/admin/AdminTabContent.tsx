"use client";
import React from 'react';
import { GlassCard } from "@/app/components/Glassmorphism";
import AdminDashboard from './AdminDashboard';
import PerformanceDashboard from './PerformanceDashboard';
import PriceManagement from './PriceManagement';
import InventoryManagement from './InventoryManagement';
import ProductAddition from './ProductAddition';
import BackupManagement from './BackupManagement';
import CouponManagement from './CouponManagement';

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

export default function AdminTabContent({ 
  activeTab,
  onTabChange,
  products,
  categories,
  backups,
  coupons,
  isAuthenticated,
  username,
  password,
  setMessage,
  priceChangePercent,
  setPriceChangePercent,
  stockStatus,
  setStockStatus,
  quantity,
  setQuantity,
  selectedCategory,
  setSelectedCategory,
  selectedProductId,
  setSelectedProductId,
  isLoading,
  setIsLoading,
  updatePrices,
  updateInventory,
  loadProducts,
  imageAnalysis,
  setImageAnalysis,
  isImageLoading,
  setIsImageLoading,
  analyzeImages,
  cleanupImages,
  categoryForm,
  setCategoryForm,
  productForm,
  setProductForm,
  newDimensionField,
  setNewDimensionField,
  newFeature,
  setNewFeature,
  isAddLoading,
  isUploading,
  selectedImage,
  imagePreview,
  addCategory,
  addProduct,
  addDimensionField,
  removeDimensionField,
  handleImageSelect,
  handleImageUpload,
  couponForm,
  setCouponForm,
  isCouponLoading,
  createCoupon,
  deleteCoupon
}: AdminTabContentProps) {
  return (
    <section className="w-full">
      <GlassCard variant="secondary" padding="large" className="w-full">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <AdminDashboard
            products={products}
            categories={categories}
            backups={backups}
            coupons={coupons}
            onTabChange={onTabChange}
          />
        )}

        {/* Performance Dashboard Tab */}
        {activeTab === 'performance' && (
          <PerformanceDashboard />
        )}

        {/* Price Management Tab */}
        {activeTab === 'prices' && (
          <PriceManagement
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            categoryProducts={products.filter(p => selectedCategory === "all" || p.category === selectedCategory)}
            selectedProductId={selectedProductId}
            setSelectedProductId={setSelectedProductId}
            priceChangePercent={priceChangePercent}
            setPriceChangePercent={setPriceChangePercent}
            updatePrices={updatePrices}
            isLoading={isLoading}
          />
        )}

        {/* Inventory Management Tab */}
        {activeTab === 'inventory' && (
          <InventoryManagement
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            categoryProducts={products.filter(p => selectedCategory === "all" || p.category === selectedCategory)}
            selectedProductId={selectedProductId}
            setSelectedProductId={setSelectedProductId}
            stockStatus={stockStatus}
            setStockStatus={setStockStatus}
            quantity={quantity}
            setQuantity={setQuantity}
            updateInventory={updateInventory}
            isLoading={isLoading}
          />
        )}

        {/* Add Products Tab */}
        {activeTab === 'add-products' && (
          <ProductAddition
            categoryForm={categoryForm}
            setCategoryForm={setCategoryForm}
            productForm={productForm}
            setProductForm={setProductForm}
            newDimensionField={newDimensionField}
            setNewDimensionField={setNewDimensionField}
            newFeature={newFeature}
            setNewFeature={setNewFeature}
            isAddLoading={isAddLoading}
            isUploading={isUploading}
            selectedImage={selectedImage}
            imagePreview={imagePreview}
            addCategory={addCategory}
            addProduct={addProduct}
            addDimensionField={addDimensionField}
            removeDimensionField={removeDimensionField}
            handleImageSelect={handleImageSelect}
            handleImageUpload={handleImageUpload}
          />
        )}

        {/* Backup Management Tab */}
        {activeTab === 'backups' && (
          <BackupManagement
            backups={backups}
            selectedBackup={null}
            setSelectedBackup={() => {}}
            isBackupLoading={isLoading}
            restoreBackup={() => {}}
            resetToDefault={() => {}}
            cleanupBackups={() => {}}
            deleteBackup={() => {}}
            analyzeImages={analyzeImages}
            cleanupImages={cleanupImages}
            imageAnalysis={imageAnalysis}
          />
        )}

        {/* Coupon Management Tab */}
        {activeTab === 'coupons' && (
          <CouponManagement
            coupons={coupons}
            isCouponLoading={isCouponLoading}
            couponForm={couponForm}
            setCouponForm={setCouponForm}
            createCoupon={createCoupon}
            deleteCoupon={deleteCoupon}
          />
        )}
      </GlassCard>
    </section>
  );
}