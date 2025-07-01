"use client";
import React from 'react';
import { GlassInput, GlassButton } from "@/app/components/Glassmorphism";

interface ProductFeaturesManagerProps {
  productForm: any;
  setProductForm: (form: any) => void;
  newFeature: string;
  setNewFeature: (feature: string) => void;
  isLoading?: boolean;
}

export default function ProductFeaturesManager({
  productForm,
  setProductForm,
  newFeature,
  setNewFeature,
  isLoading = false
}: ProductFeaturesManagerProps) {
  // Add new feature to the list
  const addFeature = () => {
    if (newFeature.trim() && !productForm.features.includes(newFeature.trim())) {
      setProductForm({
        ...productForm,
        features: [...productForm.features, newFeature.trim()]
      });
      setNewFeature('');
    }
  };

  // Remove feature from the list
  const removeFeature = (indexToRemove: number) => {
    setProductForm({
      ...productForm,
      features: productForm.features.filter((_, index) => index !== indexToRemove)
    });
  };

  // Handle Enter key press to add feature
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addFeature();
    }
  };

  // Clear all features
  const clearAllFeatures = () => {
    setProductForm({
      ...productForm,
      features: []
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h5 className="text-md font-medium text-white/90">Product Features</h5>
        {productForm.features && productForm.features.length > 0 && (
          <GlassButton
            onClick={clearAllFeatures}
            variant="secondary"
            size="small"
            disabled={isLoading}
          >
            Clear All ({productForm.features.length})
          </GlassButton>
        )}
      </div>

      {/* Add new feature */}
      <div className="flex gap-2">
        <GlassInput
          type="text"
          value={newFeature}
          onChange={(e) => setNewFeature(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter product feature..."
          className="flex-1"
          disabled={isLoading}
          maxLength={100}
        />
        <GlassButton
          onClick={addFeature}
          variant="primary"
          size="medium"
          disabled={isLoading || !newFeature.trim()}
        >
          Add Feature
        </GlassButton>
      </div>

      {/* Features list */}
      {productForm.features && productForm.features.length > 0 && (
        <div className="space-y-2">
          <h6 className="text-sm font-medium text-white/80">
            Current Features ({productForm.features.length}):
          </h6>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {productForm.features.map((feature: string, index: number) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg group hover:bg-white/10 transition-colors"
              >
                <span className="text-white/90 text-sm flex-1 mr-3">{feature}</span>
                <GlassButton
                  onClick={() => removeFeature(index)}
                  variant="secondary"
                  size="small"
                  disabled={isLoading}
                  className="opacity-70 group-hover:opacity-100 transition-opacity"
                >
                  Remove
                </GlassButton>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No features message */}
      {(!productForm.features || productForm.features.length === 0) && (
        <div className="p-4 bg-white/5 border border-white/10 rounded-lg text-center">
          <p className="text-white/60 text-sm">No features added yet. Add features to highlight product benefits.</p>
        </div>
      )}
    </div>
  );
}