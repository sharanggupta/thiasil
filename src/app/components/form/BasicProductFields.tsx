"use client";
import React from 'react';
import FormSection from './FormSection';
import FormField from './FormField';
import FieldGroup from './FieldGroup';

interface BasicProductFieldsProps {
  productForm: any;
  setProductForm: (form: any) => void;
  categories: string[];
  isLoading?: boolean;
}

export default function BasicProductFields({
  productForm,
  setProductForm,
  categories,
  isLoading = false
}: BasicProductFieldsProps) {
  const categoryOptions = categories.map(cat => ({ value: cat, label: cat }));

  return (
    <FormSection title="Basic Information" subtitle="Essential product details">
      <FieldGroup columns={2}>
        <FormField
          label="Product Name"
          name="name"
          type="text"
          value={productForm.name || ''}
          onChange={(value) => setProductForm({...productForm, name: value})}
          placeholder="e.g., 15ml Test Tube"
          maxLength={100}
          disabled={isLoading}
          required
        />

        <FormField
          label="Category"
          name="category"
          type="select"
          value={productForm.category || ''}
          onChange={(value) => setProductForm({...productForm, category: value})}
          options={categoryOptions}
          disabled={isLoading}
          required
        />

        <FormField
          label="Category Slug"
          name="categorySlug"
          type="text"
          value={productForm.categorySlug || ''}
          onChange={(value) => setProductForm({...productForm, categorySlug: value})}
          placeholder="e.g., test-tubes"
          disabled={isLoading}
          helpText="URL-friendly version of the category name"
        />

        <FormField
          label="Catalog Number"
          name="catNo"
          type="text"
          value={productForm.catNo || ''}
          onChange={(value) => setProductForm({...productForm, catNo: value})}
          placeholder="e.g., TT-15-100"
          disabled={isLoading}
          helpText="Unique product identifier"
        />
      </FieldGroup>

      <FormField
        label="Description"
        name="description"
        type="textarea"
        value={productForm.description || ''}
        onChange={(value) => setProductForm({...productForm, description: value})}
        placeholder="Product description..."
        rows={3}
        disabled={isLoading}
        helpText="Detailed description of the product and its uses"
      />
    </FormSection>
  );
}