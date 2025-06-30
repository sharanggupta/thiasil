"use client";
import React from 'react';
import productsData from '../../../data/products.json';
import { GlassButton, GlassInput, GlassContainer } from "@/app/components/Glassmorphism";

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
  handleImageUpload
}: ProductAdditionFormProps) {
  return (
    <GlassContainer className="mb-6">
      <h4 className="text-lg font-semibold text-white mb-4">Add New Product</h4>
      
      {/* Basic Product Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">Product Name</label>
          <GlassInput
            type="text"
            value={productForm.name}
            onChange={(e) => setProductForm({...productForm, name: e.target.value})}
            placeholder="e.g., 15ml Test Tube"
            maxLength={100}
            min={1}
            max={100}
            step={1}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">Category</label>
          <select
            value={productForm.category}
            onChange={(e) => setProductForm({...productForm, category: e.target.value})}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/80 focus:outline-none focus:border-[#3a8fff] transition-colors"
          >
            <option value="">Select a category</option>
            {Object.keys(productsData.productVariants || {}).map((category) => (
              <option key={category} value={category}>
                {productsData.productVariants[category].name || category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Price and Stock Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">Price (₹)</label>
          <GlassInput
            type="number"
            value={productForm.price}
            onChange={(e) => setProductForm({...productForm, price: e.target.value})}
            placeholder="0.00"
            min={0}
            step={0.01}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">Stock Status</label>
          <select
            value={productForm.stockStatus}
            onChange={(e) => setProductForm({...productForm, stockStatus: e.target.value})}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/80 focus:outline-none focus:border-[#3a8fff] transition-colors"
          >
            <option value="in_stock">In Stock</option>
            <option value="out_of_stock">Out of Stock</option>
            <option value="made_to_order">Made to Order</option>
            <option value="discontinued">Discontinued</option>
          </select>
        </div>
      </div>

      {/* Packaging and Quantity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">Packaging</label>
          <GlassInput
            type="text"
            value={productForm.packaging || '1 piece'}
            onChange={(e) => setProductForm({...productForm, packaging: e.target.value})}
            placeholder="e.g., 1 piece, 10 pieces, 1 box"
            min={1}
            max={100}
            step={1}
          />
          <p className="text-xs text-white/60 mt-1">Default: 1 piece</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">Quantity (Optional)</label>
          <GlassInput
            type="number"
            value={productForm.quantity}
            onChange={(e) => setProductForm({...productForm, quantity: e.target.value})}
            placeholder="Leave empty for made-to-order"
            min={0}
            max={100}
            step={1}
          />
        </div>
      </div>

      {/* Dynamic Dimension Fields */}
      {productForm.category && productsData.productVariants?.[productForm.category]?.dimensionFields?.length > 0 && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-white/80 mb-2">Dimensions</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {productsData.productVariants[productForm.category].dimensionFields.map((field: any) => (
              <div key={field.name}>
                <label className="block text-xs text-white/60 mb-1">{field.name} ({field.unit})</label>
                <input
                  type="text"
                  value={productForm.dimensions[field.name] || ""}
                  onChange={(e) => setProductForm({
                    ...productForm,
                    dimensions: {
                      ...productForm.dimensions,
                      [field.name]: e.target.value
                    }
                  })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/80 focus:outline-none focus:border-[#3a8fff] transition-colors"
                  placeholder={`Enter ${field.name.toLowerCase()}`}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Features Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-white/80 mb-2">Features (Optional)</label>
        <div className="flex gap-2 mb-2">
          <GlassInput
            type="text"
            value={newFeature}
            onChange={e => setNewFeature(e.target.value)}
            placeholder="Enter a feature and click Add"
            maxLength={100}
            min={1}
            max={100}
            step={1}
          />
          <GlassButton
            type="button"
            variant="secondary"
            size="small"
            onClick={() => {
              if (newFeature.trim()) {
                setProductForm((prev: any) => ({
                  ...prev,
                  features: [...(prev.features || []), newFeature.trim()]
                }));
                setNewFeature("");
              }
            }}
            disabled={!newFeature.trim()}
          >
            <span>Add</span>
          </GlassButton>
        </div>
        {productForm.features && productForm.features.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {productForm.features.map((feature: string, idx: number) => (
              <span key={idx} className="bg-white/10 text-white px-3 py-1 rounded-full text-xs flex items-center gap-1">
                {feature}
                <button
                  type="button"
                  className="ml-1 text-red-300 hover:text-red-500"
                  onClick={() => setProductForm((prev: any) => ({
                    ...prev,
                    features: prev.features.filter((_: any, i: number) => i !== idx)
                  }))}
                  aria-label="Remove feature"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Image Upload */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-white/80 mb-2">Product Image</label>
        <div className="flex gap-2 items-center">
          <label
            htmlFor="product-image-upload"
            className="glass-button glass-button--secondary glass-button--medium cursor-pointer flex items-center gap-2 text-white font-medium transition-all"
            style={{
              opacity: isUploading ? '0.5' : '1',
              pointerEvents: isUploading ? 'none' : 'auto'
            }}
          >
            <input
              id="product-image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
              disabled={isUploading}
            />
            <span>Choose File</span>
            <span aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 16V4" stroke="#3a8fff" strokeWidth="2.2" strokeLinecap="round"/>
                <path d="M6 8l4-4 4 4" stroke="#3a8fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </label>
          <span className="text-white/80 text-sm truncate max-w-xs">
            {selectedImage ? selectedImage.name : "No file chosen"}
          </span>
          {selectedImage && (
            <GlassButton
              onClick={() => handleImageUpload(selectedImage)}
              variant="accent"
              size="small"
              disabled={isUploading}
            >
              {isUploading ? (
                <span>Uploading...</span>
              ) : (
                <>
                  <span>Upload</span>
                  <span>
                    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 16V4" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
                      <path d="M6 8l4-4 4 4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                </>
              )}
            </GlassButton>
          )}
        </div>
      </div>

      {/* Image Preview */}
      {(imagePreview || productForm.image) && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-white/80 mb-2">Image Preview</label>
          <div className="h-32 w-32 overflow-hidden rounded-lg border border-white/20">
            <img
              src={imagePreview || productForm.image}
              alt="Product Image"
              className="w-full h-full object-cover"
            />
          </div>
          {productForm.image && (
            <p className="text-xs text-white/60 mt-1">Image uploaded: {productForm.image}</p>
          )}
        </div>
      )}

      {/* No Image Note */}
      {!imagePreview && !productForm.image && (
        <div className="mb-4 p-3 bg-blue-500/10 border border-blue-400/20 rounded-lg">
          <div className="flex items-center gap-2 text-blue-300">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <path d="m9 12 2 2 4-4" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <span className="text-sm font-medium">No image selected</span>
          </div>
          <p className="text-xs text-blue-300/80 mt-1 ml-6">
            Products without images will display a subtle "No Image Available" placeholder in the product cards.
          </p>
        </div>
      )}

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