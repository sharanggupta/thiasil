"use client";
import React from 'react';
import FormSection from './FormSection';
import FormField from './FormField';
import FieldGroup from './FieldGroup';

interface ProductPricingFieldsProps {
  productForm: any;
  setProductForm: (form: any) => void;
  isLoading?: boolean;
}

export default function ProductPricingFields({
  productForm,
  setProductForm,
  isLoading = false
}: ProductPricingFieldsProps) {
  const stockStatusOptions = [
    { value: 'in_stock', label: 'In Stock' },
    { value: 'out_of_stock', label: 'Out of Stock' },
    { value: 'limited_stock', label: 'Limited Stock' },
    { value: 'made_to_order', label: 'Made to Order' },
    { value: 'discontinued', label: 'Discontinued' }
  ];

  return (
    <FormSection 
      title="Pricing & Stock" 
      subtitle="Product pricing, inventory, and availability information"
      icon={
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      }
    >
      <FieldGroup columns={3}>
        <FormField
          label="Price"
          name="price"
          type="text"
          value={productForm.price || ''}
          onChange={(value) => setProductForm({...productForm, price: value})}
          placeholder="e.g., ₹299.00"
          disabled={isLoading}
          helpText="Primary selling price"
          required
        />

        <FormField
          label="Price Range"
          name="priceRange"
          type="text"
          value={productForm.priceRange || ''}
          onChange={(value) => setProductForm({...productForm, priceRange: value})}
          placeholder="e.g., ₹299.00 - ₹500.00"
          disabled={isLoading}
          helpText="For products with variable pricing"
        />

        <FormField
          label="Stock Status"
          name="stockStatus"
          type="select"
          value={productForm.stockStatus || 'in_stock'}
          onChange={(value) => setProductForm({...productForm, stockStatus: value})}
          options={stockStatusOptions}
          disabled={isLoading}
          required
        />

        <FormField
          label="Quantity"
          name="quantity"
          type="number"
          value={productForm.quantity || ''}
          onChange={(value) => setProductForm({...productForm, quantity: value ? parseInt(String(value)) : 0})}
          placeholder="e.g., 100"
          min={0}
          disabled={isLoading}
          helpText="Available stock count"
        />

        <FormField
          label="Capacity"
          name="capacity"
          type="text"
          value={productForm.capacity || ''}
          onChange={(value) => setProductForm({...productForm, capacity: value})}
          placeholder="e.g., 15ml, 100ml"
          disabled={isLoading}
          helpText="Volume or size specification"
        />

        <FormField
          label="Packaging"
          name="packaging"
          type="text"
          value={productForm.packaging || ''}
          onChange={(value) => setProductForm({...productForm, packaging: value})}
          placeholder="e.g., Box of 100"
          disabled={isLoading}
          helpText="How the product is packaged"
        />
      </FieldGroup>
    </FormSection>
  );
}