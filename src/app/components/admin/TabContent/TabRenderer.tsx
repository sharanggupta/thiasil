"use client";
import React from 'react';
import AdminDashboard from '../AdminDashboard';
import PerformanceDashboard from '../PerformanceDashboard';
import PriceManagement from '../PriceManagement';
import InventoryManagement from '../InventoryManagement';
import ProductAddition from '../ProductAddition';
import BackupManagement from '../BackupManagement';
import CouponManagement from '../CouponManagement';
import {
  AdminData,
  PriceManagement as PriceManagementType,
  InventoryManagement as InventoryManagementType,
  ImageAnalysis,
  ProductAddition as ProductAdditionType,
  CouponManagement as CouponManagementType
} from './types';

interface TabRendererProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
  data: AdminData;
  isLoading: boolean;
  priceManagement: PriceManagementType;
  inventoryManagement: InventoryManagementType;
  imageAnalysis: ImageAnalysis;
  productAddition: ProductAdditionType;
  couponManagement: CouponManagementType;
}

export default function TabRenderer({
  activeTab,
  onTabChange,
  data,
  isLoading,
  priceManagement,
  inventoryManagement,
  imageAnalysis,
  productAddition,
  couponManagement
}: TabRendererProps) {
  const { products, categories, backups, coupons } = data;
  const { selectedCategory, selectedProductId } = inventoryManagement;

  switch (activeTab) {
    case 'dashboard':
      return (
        <AdminDashboard
          products={products}
          categories={categories}
          backups={backups}
          coupons={coupons}
          onTabChange={onTabChange}
        />
      );

    case 'performance':
      return <PerformanceDashboard />;

    case 'prices':
      return (
        <PriceManagement
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={inventoryManagement.setSelectedCategory}
          categoryProducts={products.filter(p => 
            selectedCategory === "all" || p.category === selectedCategory
          )}
          selectedProductId={selectedProductId}
          setSelectedProductId={inventoryManagement.setSelectedProductId}
          priceChangePercent={priceManagement.priceChangePercent}
          setPriceChangePercent={priceManagement.setPriceChangePercent}
          updatePrices={priceManagement.updatePrices}
          isLoading={isLoading}
        />
      );

    case 'inventory':
      return (
        <InventoryManagement
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={inventoryManagement.setSelectedCategory}
          categoryProducts={products.filter(p => 
            selectedCategory === "all" || p.category === selectedCategory
          )}
          selectedProductId={selectedProductId}
          setSelectedProductId={inventoryManagement.setSelectedProductId}
          stockStatus={inventoryManagement.stockStatus}
          setStockStatus={inventoryManagement.setStockStatus}
          quantity={inventoryManagement.quantity}
          setQuantity={inventoryManagement.setQuantity}
          updateInventory={inventoryManagement.updateInventory}
          isLoading={isLoading}
        />
      );

    case 'add-products':
      return (
        <ProductAddition
          categoryForm={productAddition.categoryForm}
          setCategoryForm={productAddition.setCategoryForm}
          productForm={productAddition.productForm}
          setProductForm={productAddition.setProductForm}
          newDimensionField={productAddition.newDimensionField}
          setNewDimensionField={productAddition.setNewDimensionField}
          newFeature={productAddition.newFeature}
          setNewFeature={productAddition.setNewFeature}
          isAddLoading={productAddition.isAddLoading}
          isUploading={productAddition.isUploading}
          selectedImage={productAddition.selectedImage}
          imagePreview={productAddition.imagePreview}
          addCategory={productAddition.addCategory}
          addProduct={productAddition.addProduct}
          addDimensionField={productAddition.addDimensionField}
          removeDimensionField={productAddition.removeDimensionField}
          handleImageSelect={productAddition.handleImageSelect}
          handleImageUpload={productAddition.handleImageUpload}
        />
      );

    case 'backups':
      return (
        <BackupManagement
          backups={backups}
          selectedBackup={null}
          setSelectedBackup={() => {}}
          isBackupLoading={isLoading}
          restoreBackup={() => {}}
          resetToDefault={() => {}}
          cleanupBackups={() => {}}
          deleteBackup={() => {}}
          analyzeImages={imageAnalysis.analyzeImages}
          cleanupImages={imageAnalysis.cleanupImages}
          imageAnalysis={imageAnalysis.imageAnalysis}
        />
      );

    case 'coupons':
      return (
        <CouponManagement
          coupons={coupons}
          isCouponLoading={couponManagement.isCouponLoading}
          couponForm={couponManagement.couponForm}
          setCouponForm={couponManagement.setCouponForm}
          createCoupon={couponManagement.createCoupon}
          deleteCoupon={couponManagement.deleteCoupon}
        />
      );

    default:
      return <div>Tab not found</div>;
  }
}