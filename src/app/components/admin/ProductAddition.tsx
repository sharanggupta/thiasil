"use client";
import React from 'react';
import CategoryAdditionForm from './CategoryAdditionForm';
import ProductAdditionForm from './ProductAdditionForm';
import ProductAdditionInfo from './ProductAdditionInfo';

interface ProductAdditionProps {
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

export default function ProductAddition({
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
  handleImageUpload
}: ProductAdditionProps) {
  return (
    <div>
      <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-2">
        <span>➕</span>
        Add Categories & Products
      </h2>
      
      {/* Add Category Form */}
      <CategoryAdditionForm
        categoryForm={categoryForm}
        setCategoryForm={setCategoryForm}
        newDimensionField={newDimensionField}
        setNewDimensionField={setNewDimensionField}
        isAddLoading={isAddLoading}
        addCategory={addCategory}
        addDimensionField={addDimensionField}
        removeDimensionField={removeDimensionField}
      />

      {/* Add Product Form */}
      <ProductAdditionForm
        productForm={productForm}
        setProductForm={setProductForm}
        newFeature={newFeature}
        setNewFeature={setNewFeature}
        isAddLoading={isAddLoading}
        isUploading={isUploading}
        selectedImage={selectedImage}
        imagePreview={imagePreview}
        addProduct={addProduct}
        handleImageSelect={handleImageSelect}
        handleImageUpload={handleImageUpload}
      />

      {/* Information */}
      <ProductAdditionInfo />
    </div>
  );
}