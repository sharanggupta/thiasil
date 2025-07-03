import { useCallback, useState, useEffect } from 'react';
import { useAdminApi, AdminCredentials, ADMIN_ENDPOINTS, ADMIN_ACTIONS } from './useAdminApi';
import { useApiGet } from './useApi';
import productsData from '../../data/products.json';

// Types
interface Product {
  id: string | number;
  name: string;
  categorySlug: string;
}

interface Category {
  name: string;
  slug: string;
  description: string;
  dimensionFields: Array<{ name: string; unit: string }>;
}

interface ProductForm {
  name: string;
  category: string;
  price: string;
  stockStatus: string;
  quantity: string;
  dimensions: Record<string, string>;
  features: string[];
  image: string;
}

interface CategoryForm {
  name: string;
  slug: string;
  description: string;
  dimensionFields: Array<{ name: string; unit: string }>;
}

interface LoadingStates {
  loading: boolean;
  adding: boolean;
  uploading: boolean;
  updating: boolean;
  deleting: boolean;
}

interface UseAdminProductsResult {
  // Data
  products: Product[];
  categories: Category[];
  selectedCategory: string;
  categoryProducts: Array<{ id: string | number; name: string; type: 'product' | 'variant' }>;
  selectedProductId: string;
  
  // Forms
  productForm: ProductForm;
  categoryForm: CategoryForm;
  newDimensionField: { name: string; unit: string };
  newFeature: string;
  
  // Loading States
  isLoading: boolean;
  isAdding: boolean;
  isUploading: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  loadingStates: LoadingStates;
  
  // Error Handling
  error: any;
  hasError: boolean;
  
  // Image State
  selectedImage: File | null;
  imagePreview: string | null;
  
  // Actions
  loadProducts: () => Promise<void>;
  addCategory: () => Promise<boolean>;
  addProduct: () => Promise<boolean>;
  updateProduct: (id: string, data: Partial<ProductForm>) => Promise<boolean>;
  deleteProduct: (id: string) => Promise<boolean>;
  
  // Form Management
  setSelectedCategory: (category: string) => void;
  setSelectedProductId: (id: string) => void;
  setProductForm: (form: Partial<ProductForm>) => void;
  setCategoryForm: (form: Partial<CategoryForm>) => void;
  setNewDimensionField: (field: { name: string; unit: string }) => void;
  setNewFeature: (feature: string) => void;
  addDimensionField: () => void;
  removeDimensionField: (index: number) => void;
  resetProductForm: () => void;
  resetCategoryForm: () => void;
  
  // Image Management
  handleImageSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleImageUpload: (file: File) => Promise<boolean>;
  clearImage: () => void;
  
  // Error Recovery
  retry: () => Promise<void>;
  clearError: () => void;
}

// Initial states
const initialProductForm: ProductForm = {
  name: '',
  category: '',
  price: '',
  stockStatus: 'in_stock',
  quantity: '',
  dimensions: {},
  features: [],
  image: ''
};

const initialCategoryForm: CategoryForm = {
  name: '',
  slug: '',
  description: '',
  dimensionFields: []
};

const initialLoadingStates: LoadingStates = {
  loading: false,
  adding: false,
  uploading: false,
  updating: false,
  deleting: false
};

export function useAdminProducts(
  credentials: AdminCredentials,
  setMessage?: (message: string) => void
): UseAdminProductsResult {
  // Data fetching with enhanced error handling - NO immediate loading
  const {
    data: productsData,
    isLoading: isLoadingProducts,
    error: loadError,
    execute: refetchProducts,
    retry: retryLoad
  } = useApiGet<{ products: Product[]; categories: Category[] }>('/api/products', {
    immediate: false, // Never load automatically
    cacheKey: 'admin_products_data',
    retryAttempts: 3,
    retryDelay: 1000,
    onError: (error) => {
      setMessage?.(`Failed to load products: ${error.message}`);
    }
  });

  // Admin API hooks for CRUD operations
  const addProductApi = useAdminApi({
    endpoint: ADMIN_ENDPOINTS.ADD_PRODUCTS,
    method: 'POST',
    action: ADMIN_ACTIONS.ADD_PRODUCT,
    retryAttempts: 2,
    retryDelay: 1500,
    onSuccess: () => {
      setMessage?.('Product added successfully!');
      refetchProducts();
    },
    onError: (error) => {
      setMessage?.(`Failed to add product: ${error.details?.error || error.message}`);
    }
  });

  const addCategoryApi = useAdminApi({
    endpoint: ADMIN_ENDPOINTS.ADD_PRODUCTS,
    method: 'POST',
    action: ADMIN_ACTIONS.ADD_CATEGORY,
    retryAttempts: 2,
    retryDelay: 1500,
    onSuccess: () => {
      setMessage?.('Category added successfully!');
      refetchProducts();
    },
    onError: (error) => {
      setMessage?.(`Failed to add category: ${error.details?.error || error.message}`);
    }
  });

  const imageUploadApi = useAdminApi({
    endpoint: ADMIN_ENDPOINTS.UPLOAD_IMAGE,
    method: 'POST',
    retryAttempts: 3,
    retryDelay: 2000,
    onSuccess: (data: any) => {
      setMessage?.('Image uploaded successfully!');
      setProductForm(prev => ({ ...prev, image: data.imageUrl }));
      clearImage();
    },
    onError: (error) => {
      setMessage?.(`Failed to upload image: ${error.details?.error || error.message}`);
    }
  });

  // Local state
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categoryProducts, setCategoryProducts] = useState<Array<{ id: string | number; name: string; type: 'product' | 'variant' }>>([]);
  const [selectedProductId, setSelectedProductId] = useState('all');
  const [productForm, setProductForm] = useState<ProductForm>(initialProductForm);
  const [categoryForm, setCategoryForm] = useState<CategoryForm>(initialCategoryForm);
  const [newDimensionField, setNewDimensionField] = useState({ name: '', unit: '' });
  const [newFeature, setNewFeature] = useState('');
  const [loadingStates, setLoadingStates] = useState<LoadingStates>(initialLoadingStates);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Manual loading only - remove automatic triggers

  // Update products when data is loaded
  useEffect(() => {
    if (productsData) {
      setProducts(productsData.products || []);
      setCategories(productsData.categories || []);
    }
  }, [productsData]);

  // Update categoryProducts when selectedCategory or products change
  useEffect(() => {
    if (selectedCategory && selectedCategory !== 'all' && products.length > 0) {
      const variants: Array<{ id: string | number; name: string; type: 'product' | 'variant' }> = [];
      
      // Add products from the category
      products.forEach((p) => {
        if (p.categorySlug === selectedCategory) {
          variants.push({ id: p.id, name: p.name, type: 'product' });
        }
      });
      
      // Add variants from productsData
      const allVariants = (productsData as any)?.productVariants?.[selectedCategory]?.variants || [];
      allVariants.forEach((v: any) => {
        variants.push({ 
          id: v.id, 
          name: v.name + (v.capacity ? ` (${v.capacity})` : ''), 
          type: 'variant' 
        });
      });
      
      setCategoryProducts(variants);
      setSelectedProductId('all');
    } else {
      setCategoryProducts([]);
      setSelectedProductId('all');
    }
  }, [selectedCategory, products]);

  // Update Product Dimensions when category changes
  useEffect(() => {
    if (productForm.category) {
      const categoryData = (productsData as any)?.productVariants?.[productForm.category];
      if (categoryData?.dimensionFields) {
        const newDimensions: Record<string, string> = {};
        categoryData.dimensionFields.forEach((field: any) => {
          newDimensions[field.name] = '';
        });
        setProductForm(prev => ({ ...prev, dimensions: newDimensions }));
      }
    }
  }, [productForm.category]);

  // Enhanced Actions
  const loadProducts = useCallback(async () => {
    setLoadingStates(prev => ({ ...prev, loading: true }));
    try {
      await refetchProducts();
    } finally {
      setLoadingStates(prev => ({ ...prev, loading: false }));
    }
  }, [refetchProducts, setLoadingStates]);

  const addCategory = useCallback(async (): Promise<boolean> => {
    if (!categoryForm.name || !categoryForm.slug) {
      setMessage?.('Category name and slug are required');
      return false;
    }

    // Optimistic update - add category immediately to UI
    const optimisticCategory: Category = {
      name: categoryForm.name,
      slug: categoryForm.slug,
      description: categoryForm.description,
      dimensionFields: categoryForm.dimensionFields
    };

    setCategories(prev => [...prev, optimisticCategory]);
    setLoadingStates(prev => ({ ...prev, adding: true }));

    try {
      await addCategoryApi.executeAsAdmin(credentials, { categoryData: categoryForm });
      setCategoryForm(initialCategoryForm);
      // Refetch to get the real data and replace optimistic update
      await refetchProducts();
      return true;
    } catch (error) {
      // Rollback optimistic update on error
      setCategories(prev => prev.filter(c => c.slug !== optimisticCategory.slug));
      return false;
    } finally {
      setLoadingStates(prev => ({ ...prev, adding: false }));
    }
  }, [categoryForm, addCategoryApi, credentials, setMessage, refetchProducts]);

  const addProduct = useCallback(async (): Promise<boolean> => {
    if (!productForm.name || !productForm.category) {
      setMessage?.('Product name and category are required');
      return false;
    }

    // Optimistic update - add product immediately to UI
    const optimisticProduct: Product = {
      id: `temp-${Date.now()}`, // Temporary ID
      name: productForm.name,
      categorySlug: productForm.category
    };

    setProducts(prev => [...prev, optimisticProduct]);
    setLoadingStates(prev => ({ ...prev, adding: true }));

    try {
      await addProductApi.executeAsAdmin(credentials, { productData: productForm });
      setProductForm(initialProductForm);
      clearImage();
      // Refetch to get the real data and replace optimistic update
      await refetchProducts();
      return true;
    } catch (error) {
      // Rollback optimistic update on error
      setProducts(prev => prev.filter(p => p.id !== optimisticProduct.id));
      return false;
    } finally {
      setLoadingStates(prev => ({ ...prev, adding: false }));
    }
  }, [productForm, addProductApi, credentials, setMessage, refetchProducts]);

  const updateProduct = useCallback(async (id: string, data: Partial<ProductForm>): Promise<boolean> => {
    setLoadingStates(prev => ({ ...prev, updating: true }));
    try {
      // This would need a specific update endpoint
      // await updateProductApi.executeAsAdmin(credentials, { productId: id, productData: data });
      setMessage?.('Product update functionality needs to be implemented');
      return true;
    } catch (error) {
      return false;
    } finally {
      setLoadingStates(prev => ({ ...prev, updating: false }));
    }
  }, [credentials, setMessage]);

  const deleteProduct = useCallback(async (id: string): Promise<boolean> => {
    setLoadingStates(prev => ({ ...prev, deleting: true }));
    try {
      // This would need a specific delete endpoint
      // await deleteProductApi.executeAsAdmin(credentials, { productId: id });
      setMessage?.('Product delete functionality needs to be implemented');
      await refetchProducts();
      return true;
    } catch (error) {
      return false;
    } finally {
      setLoadingStates(prev => ({ ...prev, deleting: false }));
    }
  }, [credentials, refetchProducts, setMessage]);

  // Form management helpers
  const updateProductForm = useCallback((form: Partial<ProductForm>) => {
    setProductForm(prev => ({ ...prev, ...form }));
  }, []);

  const updateCategoryForm = useCallback((form: Partial<CategoryForm>) => {
    setCategoryForm(prev => ({ ...prev, ...form }));
  }, []);

  const addDimensionField = useCallback(() => {
    if (!newDimensionField.name || !newDimensionField.unit) {
      setMessage?.('Dimension field name and unit are required');
      return;
    }
    setCategoryForm(prev => ({
      ...prev,
      dimensionFields: [...prev.dimensionFields, newDimensionField]
    }));
    setNewDimensionField({ name: '', unit: '' });
  }, [newDimensionField, setMessage]);

  const removeDimensionField = useCallback((index: number) => {
    setCategoryForm(prev => ({
      ...prev,
      dimensionFields: prev.dimensionFields.filter((_, i) => i !== index)
    }));
  }, []);

  const resetProductForm = useCallback(() => {
    setProductForm(initialProductForm);
    clearImage();
  }, []);

  const resetCategoryForm = useCallback(() => {
    setCategoryForm(initialCategoryForm);
  }, []);

  // Image management
  const handleImageSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  }, []);

  const handleImageUpload = useCallback(async (file: File): Promise<boolean> => {
    if (!file) return false;

    if (!credentials.username || !credentials.password) {
      setMessage?.('Session expired. Please login again.');
      return false;
    }

    setLoadingStates(prev => ({ ...prev, uploading: true }));
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('username', credentials.username);
      formData.append('password', credentials.password);
      formData.append('productName', productForm.name);
      formData.append('categorySlug', productForm.category);

      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setProductForm(prev => ({ ...prev, image: data.imageUrl }));
        setMessage?.('Image uploaded successfully!');
        clearImage();
        return true;
      } else {
        const data = await response.json();
        setMessage?.(data.error || 'Failed to upload image');
        return false;
      }
    } catch (error) {
      setMessage?.('Network error. Please try again.');
      return false;
    } finally {
      setLoadingStates(prev => ({ ...prev, uploading: false }));
    }
  }, [credentials, productForm, setMessage]);

  const clearImage = useCallback(() => {
    setSelectedImage(null);
    setImagePreview(null);
  }, []);

  // Error recovery
  const retry = useCallback(async () => {
    await retryLoad();
  }, [retryLoad]);

  const clearError = useCallback(() => {
    // Clear errors from all APIs with null checks
    addProductApi?.reset?.();
    addCategoryApi?.reset?.();
    imageUploadApi?.reset?.();
  }, [addProductApi, addCategoryApi, imageUploadApi]);

  // Computed values
  const combinedError = loadError || addProductApi?.error || addCategoryApi?.error || imageUploadApi?.error;
  const hasError = Boolean(combinedError);
  const isAnyLoading = isLoadingProducts || loadingStates.loading || loadingStates.adding || loadingStates.uploading || loadingStates.updating || loadingStates.deleting;

  return {
    // Data
    products,
    categories,
    selectedCategory,
    categoryProducts,
    selectedProductId,
    
    // Forms
    productForm,
    categoryForm,
    newDimensionField,
    newFeature,
    
    // Loading States
    isLoading: isLoadingProducts || loadingStates.loading,
    isAdding: loadingStates.adding,
    isUploading: loadingStates.uploading,
    isUpdating: loadingStates.updating,
    isDeleting: loadingStates.deleting,
    loadingStates,
    
    // Error Handling
    error: combinedError,
    hasError,
    
    // Image State
    selectedImage,
    imagePreview,
    
    // Actions
    loadProducts,
    addCategory,
    addProduct,
    updateProduct,
    deleteProduct,
    
    // Form Management
    setSelectedCategory,
    setSelectedProductId,
    setProductForm: updateProductForm,
    setCategoryForm: updateCategoryForm,
    setNewDimensionField,
    setNewFeature,
    addDimensionField,
    removeDimensionField,
    resetProductForm,
    resetCategoryForm,
    
    // Image Management
    handleImageSelect,
    handleImageUpload,
    clearImage,
    
    // Error Recovery
    retry,
    clearError
  };
}