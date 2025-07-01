"use client";
import React, { useState } from 'react';
import FormModal from '@/app/components/ui/FormModal';
import { FormField, FieldGroup, FormSection } from '@/app/components/form';

interface Product {
  id?: string;
  name: string;
  category: string;
  price: string;
  stockStatus: string;
  quantity?: number;
  description?: string;
}

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Product) => Promise<void>;
  product?: Product | null;
  loading?: boolean;
}

export default function ProductModal({
  isOpen,
  onClose,
  onSave,
  product = null,
  loading = false
}: ProductModalProps) {
  const [formData, setFormData] = useState<Product>({
    name: product?.name || '',
    category: product?.category || '',
    price: product?.price || '',
    stockStatus: product?.stockStatus || 'in_stock',
    quantity: product?.quantity || 0,
    description: product?.description || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const updateField = (field: keyof Product, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when field is updated
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    }

    if (!formData.price.trim()) {
      newErrors.price = 'Price is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      await onSave(formData);
      // Form will be closed by the parent component
    } catch (error) {
      console.error('Failed to save product:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const stockStatusOptions = [
    { value: 'in_stock', label: 'In Stock' },
    { value: 'out_of_stock', label: 'Out of Stock' },
    { value: 'limited_stock', label: 'Limited Stock' },
    { value: 'made_to_order', label: 'Made to Order' }
  ];

  const categoryOptions = [
    { value: 'laboratory-glassware', label: 'Laboratory Glassware' },
    { value: 'measuring-instruments', label: 'Measuring Instruments' },
    { value: 'safety-equipment', label: 'Safety Equipment' },
    { value: 'chemicals', label: 'Chemicals' }
  ];

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      title={product ? 'Edit Product' : 'Add New Product'}
      subtitle={product ? `Editing: ${product.name}` : 'Create a new product entry'}
      submitLabel={product ? 'Update Product' : 'Create Product'}
      loading={submitting || loading}
      disabled={submitting}
      size="large"
    >
      <FormSection title="Basic Information" subtitle="Essential product details">
        <FieldGroup columns={2}>
          <FormField
            label="Product Name"
            name="name"
            type="text"
            value={formData.name}
            onChange={(value) => updateField('name', value)}
            placeholder="Enter product name"
            required
            error={errors.name}
            disabled={submitting}
          />

          <FormField
            label="Category"
            name="category"
            type="select"
            value={formData.category}
            onChange={(value) => updateField('category', value)}
            options={categoryOptions}
            required
            error={errors.category}
            disabled={submitting}
          />

          <FormField
            label="Price"
            name="price"
            type="text"
            value={formData.price}
            onChange={(value) => updateField('price', value)}
            placeholder="₹0.00"
            required
            error={errors.price}
            disabled={submitting}
            helpText="Include currency symbol (₹)"
          />

          <FormField
            label="Stock Status"
            name="stockStatus"
            type="select"
            value={formData.stockStatus}
            onChange={(value) => updateField('stockStatus', value)}
            options={stockStatusOptions}
            required
            disabled={submitting}
          />
        </FieldGroup>
      </FormSection>

      <FormSection title="Inventory Details" subtitle="Stock and quantity information">
        <FieldGroup columns={1}>
          <FormField
            label="Quantity"
            name="quantity"
            type="number"
            value={formData.quantity || ''}
            onChange={(value) => updateField('quantity', Number(value) || 0)}
            placeholder="0"
            min={0}
            disabled={submitting}
            helpText="Leave empty for unlimited stock"
          />

          <FormField
            label="Description"
            name="description"
            type="textarea"
            value={formData.description || ''}
            onChange={(value) => updateField('description', value)}
            placeholder="Product description..."
            rows={4}
            disabled={submitting}
            helpText="Optional detailed description"
          />
        </FieldGroup>
      </FormSection>
    </FormModal>
  );
}