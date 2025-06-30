"use client";
import React from 'react';
import { GlassButton } from "@/app/components/Glassmorphism";

interface ImageUploadFieldProps {
  selectedImage: File | null;
  imagePreview: string;
  isUploading: boolean;
  isLoading?: boolean;
  onImageSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onImageUpload: (file: File) => void;
  onImageClear?: () => void;
}

export default function ImageUploadField({
  selectedImage,
  imagePreview,
  isUploading,
  isLoading = false,
  onImageSelect,
  onImageUpload,
  onImageClear
}: ImageUploadFieldProps) {
  const handleUpload = () => {
    if (selectedImage) {
      onImageUpload(selectedImage);
    }
  };

  const handleClear = () => {
    if (onImageClear) {
      onImageClear();
    }
  };

  return (
    <div className="space-y-4">
      <h5 className="text-md font-medium text-white/90">Product Image</h5>
      
      {/* Image Upload Input */}
      <div>
        <label className="block text-sm font-medium text-white/80 mb-2">Select Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={onImageSelect}
          disabled={isLoading || isUploading}
          className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-white/20 file:text-white hover:file:bg-white/30 transition-colors focus:outline-none focus:border-[#3a8fff]"
        />
      </div>

      {/* Image Preview */}
      {imagePreview && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-white/80">Preview</label>
          <div className="relative inline-block">
            <img
              src={imagePreview}
              alt="Product preview"
              className="w-32 h-32 object-cover rounded-lg border border-white/20 shadow-lg"
            />
            {onImageClear && (
              <button
                onClick={handleClear}
                disabled={isLoading || isUploading}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold disabled:opacity-50 transition-colors"
                title="Remove image"
              >
                ×
              </button>
            )}
          </div>
        </div>
      )}

      {/* Upload Actions */}
      <div className="flex gap-2">
        <GlassButton
          onClick={handleUpload}
          variant="accent"
          size="medium"
          disabled={!selectedImage || isUploading || isLoading}
        >
          {isUploading ? 'Uploading...' : 'Upload Image'}
        </GlassButton>
        
        {selectedImage && !isUploading && (
          <GlassButton
            onClick={handleClear}
            variant="secondary"
            size="medium"
            disabled={isLoading}
          >
            Clear Selection
          </GlassButton>
        )}
      </div>

      {/* Upload Status */}
      {isUploading && (
        <div className="flex items-center gap-2 text-sm text-white/70">
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          <span>Uploading image...</span>
        </div>
      )}

      {/* Help Text */}
      <div className="text-xs text-white/60">
        <p>• Supported formats: JPG, PNG, GIF, WebP</p>
        <p>• Maximum file size: 5MB</p>
        <p>• Recommended dimensions: 400x400px or larger</p>
      </div>
    </div>
  );
}