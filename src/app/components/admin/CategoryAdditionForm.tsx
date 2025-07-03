"use client";
import React from 'react';
import { GlassButton, GlassInput, GlassContainer } from "@/app/components/Glassmorphism";

interface CategoryAdditionFormProps {
  categoryForm: any;
  setCategoryForm: (form: any) => void;
  newDimensionField: any;
  setNewDimensionField: (field: any) => void;
  isAddLoading: boolean;
  addCategory: () => void;
  addDimensionField: () => void;
  removeDimensionField: (index: number) => void;
}

export default function CategoryAdditionForm({
  categoryForm,
  setCategoryForm,
  newDimensionField,
  setNewDimensionField,
  isAddLoading,
  addCategory,
  addDimensionField,
  removeDimensionField
}: CategoryAdditionFormProps) {
  return (
    <GlassContainer className="mb-6">
      <h4 className="text-lg font-semibold text-white mb-4">Add New Category</h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">Category Name</label>
          <GlassInput
            type="text"
            value={categoryForm.name}
            onChange={(e) => setCategoryForm({...categoryForm, name: e.target.value})}
            placeholder="e.g., Test Tubes"
            maxLength={50}
            min={1}
            max={100}
            step={1}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">Category Slug</label>
          <GlassInput
            type="text"
            value={categoryForm.slug}
            onChange={(e) => setCategoryForm({...categoryForm, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})}
            placeholder="e.g., test-tubes"
            maxLength={30}
            min={1}
            max={100}
            step={1}
          />
          <p className="text-xs text-white/60 mt-1">Auto-converted to lowercase with hyphens</p>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-white/80 mb-2">Description</label>
        <textarea
          value={categoryForm.description}
          onChange={(e) => setCategoryForm({...categoryForm, description: e.target.value})}
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/80 focus:outline-hidden focus:border-[#3a8fff] transition-colors"
          placeholder="Category description..."
          rows={3}
          maxLength={200}
        />
      </div>

      {/* Dimension Fields */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-white/80 mb-2">Dimension Fields</label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <GlassInput
              type="text"
              value={newDimensionField.name}
              onChange={(e) => setNewDimensionField({...newDimensionField, name: e.target.value})}
              placeholder="Field name (e.g., Length)"
              maxLength={20}
              min={1}
              max={100}
              step={1}
            />
          </div>
          <div>
            <GlassInput
              type="text"
              value={newDimensionField.unit}
              onChange={(e) => setNewDimensionField({...newDimensionField, unit: e.target.value})}
              placeholder="Unit (e.g., mm)"
              maxLength={10}
              min={1}
              max={100}
              step={1}
            />
          </div>
          <div className="flex items-end">
            <GlassButton
              onClick={addDimensionField}
              variant="primary"
              size="large"
              className="w-full text-white font-bold shadow-lg shadow-blue-400/30 border border-white/30 rounded-xl transition-all"
              style={{ background: 'var(--dark-primary-gradient)' }}
            >
              <span>Add Field</span>
            </GlassButton>
          </div>
        </div>

        {categoryForm.dimensionFields.length > 0 && (
          <GlassContainer variant="nested" padding="small">
            <h5 className="text-sm font-medium text-white/80 mb-2">Added Fields:</h5>
            <div className="space-y-2">
              {categoryForm.dimensionFields.map((field: any, index: number) => (
                <GlassContainer key={index} variant="nested" padding="small" className="flex items-center justify-between">
                  <span className="text-white text-sm">
                    {field.name} ({field.unit})
                  </span>
                  <GlassButton
                    onClick={() => removeDimensionField(index)}
                    variant="secondary"
                    size="small"
                  >
                    <span>🗑️</span>
                  </GlassButton>
                </GlassContainer>
              ))}
            </div>
          </GlassContainer>
        )}
      </div>

      <div className="flex justify-center">
        <GlassButton
          onClick={addCategory}
          variant="accent"
          size="large"
          disabled={isAddLoading}
        >
          {isAddLoading ? (
            <span>Adding...</span>
          ) : (
            <>
              <span>Add Category</span>
              <span>➕</span>
            </>
          )}
        </GlassButton>
      </div>
    </GlassContainer>
  );
}