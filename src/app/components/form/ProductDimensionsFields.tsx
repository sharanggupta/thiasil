"use client";
import React from 'react';
import { GlassInput, GlassButton } from "@/app/components/Glassmorphism";

interface ProductDimensionsFieldsProps {
  productForm: any;
  setProductForm: (form: any) => void;
  dimensionFields: Array<{ id: string; name: string; unit: string }>;
  isLoading?: boolean;
}

export default function ProductDimensionsFields({
  productForm,
  setProductForm,
  dimensionFields,
  isLoading = false
}: ProductDimensionsFieldsProps) {
  // Get dimension value for a specific field
  const getDimensionValue = (fieldName: string) => {
    return productForm.dimensions?.[fieldName] || '';
  };

  // Update dimension value
  const updateDimension = (fieldName: string, value: string) => {
    const currentDimensions = productForm.dimensions || {};
    setProductForm({
      ...productForm,
      dimensions: {
        ...currentDimensions,
        [fieldName]: value
      }
    });
  };

  // Clear all dimensions
  const clearDimensions = () => {
    setProductForm({
      ...productForm,
      dimensions: {}
    });
  };

  if (!dimensionFields || dimensionFields.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h5 className="text-md font-medium text-white/90">Dimensions</h5>
        <GlassButton
          onClick={clearDimensions}
          variant="secondary"
          size="small"
          disabled={isLoading}
        >
          Clear All
        </GlassButton>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {dimensionFields.map((field) => (
          <div key={field.id}>
            <label className="block text-sm font-medium text-white/80 mb-2 capitalize">
              {field.name} {field.unit && `(${field.unit})`}
            </label>
            <GlassInput
              type="text"
              value={getDimensionValue(field.name)}
              onChange={(e) => updateDimension(field.name, e.target.value)}
              placeholder={`Enter ${field.name.toLowerCase()}`}
              disabled={isLoading}
            />
          </div>
        ))}
      </div>

      {/* Display current dimensions summary */}
      {productForm.dimensions && Object.keys(productForm.dimensions).length > 0 && (
        <div className="mt-4 p-3 bg-white/5 border border-white/10 rounded-lg">
          <h6 className="text-sm font-medium text-white/80 mb-2">Dimensions Summary:</h6>
          <div className="text-sm text-white/70">
            {Object.entries(productForm.dimensions)
              .filter(([key, value]) => value && value.toString().trim() !== '')
              .map(([key, value]) => (
                <span key={key} className="inline-block mr-3 mb-1">
                  <span className="capitalize">{key}:</span> {String(value)}
                  {dimensionFields.find(f => f.name === key)?.unit}
                </span>
              ))
            }
          </div>
        </div>
      )}
    </div>
  );
}