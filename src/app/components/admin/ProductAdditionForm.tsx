"use client";
import React, { useMemo } from 'react';
import productsData from '../../../data/products.json';
import { GlassButton, GlassContainer } from "@/app/components/Glassmorphism";
import BasicProductFields from "@/app/components/form/BasicProductFields";
import ProductPricingFields from "@/app/components/form/ProductPricingFields";
import ProductDimensionsFields from "@/app/components/form/ProductDimensionsFields";
import ProductFeaturesManager from "@/app/components/form/ProductFeaturesManager";
import ImageUploadField from "@/app/components/form/ImageUploadField";

interface ProductAdditionFormProps {
  productForm: any;
  setProductForm: (form: any) => void;
  newFeature: string;
  setNewFeature: (feature: string) => void;
  isAddLoading: boolean;
  isUploading: boolean;
  selectedImage: any;
  imagePreview: string;
  addProduct: () => void;
  handleImageSelect: (event: any) => void;
  handleImageUpload: (file: any) => void;
  dimensionFields: Array<{ id: string; name: string; unit: string }>;
}

export default function ProductAdditionForm({
  productForm,
  setProductForm,
  newFeature,
  setNewFeature,
  isAddLoading,
  isUploading,
  selectedImage,
  imagePreview,
  addProduct,
  handleImageSelect,
  handleImageUpload,
  dimensionFields
}: ProductAdditionFormProps) {
  // Extract unique categories from products data
  const categories = useMemo(() => {
    const cats = [...new Set(productsData.products.map(p => p.category))];
    return cats.sort();
  }, []);

  // Clear image selection
  const handleImageClear = () => {
    setProductForm({...productForm, image: ''});
  };

  return (
    <GlassContainer className="mb-6">
      <h4 className="text-lg font-semibold text-white mb-6">Add New Product</h4>
      
      <div className="space-y-6">
        {/* Basic Product Information */}
        <BasicProductFields
          productForm={productForm}
          setProductForm={setProductForm}
          categories={categories}
          isLoading={isAddLoading}
        />

        {/* Pricing and Stock Information */}
        <ProductPricingFields
          productForm={productForm}
          setProductForm={setProductForm}
          isLoading={isAddLoading}
        />

        {/* Dynamic Dimension Fields */}
        {dimensionFields && dimensionFields.length > 0 && (
          <ProductDimensionsFields
            productForm={productForm}
            setProductForm={setProductForm}
            dimensionFields={dimensionFields}
            isLoading={isAddLoading}
          />
        )}

        {/* Product Features Manager */}
        <ProductFeaturesManager
          productForm={productForm}
          setProductForm={setProductForm}
          newFeature={newFeature}
          setNewFeature={setNewFeature}
          isLoading={isAddLoading}
        />

        {/* Image Upload */}
        <ImageUploadField
          selectedImage={selectedImage}
          imagePreview={imagePreview}
          isUploading={isUploading}
          isLoading={isAddLoading}
          onImageSelect={handleImageSelect}
          onImageUpload={handleImageUpload}
          onImageClear={handleImageClear}
        />
      </div>

      <div className="flex justify-center">
        <GlassButton
          onClick={addProduct}
          variant="accent"
          size="large"
          disabled={isAddLoading || !productForm.category}
        >
          {isAddLoading ? (
            <span>Adding...</span>
          ) : (
            <>
              <span>Add Product</span>
              <span>➕</span>
            </>
          )}
        </GlassButton>
      </div>
    </GlassContainer>
  );
}