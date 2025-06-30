import { useCallback, useEffect, useReducer } from 'react';
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
  dimensionFields: DimensionField[];
}

interface DimensionField {
  name: string;
  unit: string;
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
  dimensionFields: DimensionField[];
}

interface AdminProductsState {
  // Data
  products: Product[];
  categories: Category[];
  selectedCategory: string;
  categoryProducts: Array<{ id: string | number; name: string; type: 'product' | 'variant' }>;
  selectedProductId: string;
  
  // Forms
  productForm: ProductForm;
  categoryForm: CategoryForm;
  newDimensionField: DimensionField;
  newFeature: string;
  
  // UI State
  isAddLoading: boolean;
  isUploading: boolean;
  selectedImage: File | null;
  imagePreview: string | null;
}

// Actions
type AdminProductsAction =
  | { type: 'LOAD_DATA_SUCCESS'; payload: { products: Product[]; categories: Category[] } }
  | { type: 'SET_SELECTED_CATEGORY'; payload: string }
  | { type: 'SET_SELECTED_PRODUCT_ID'; payload: string }
  | { type: 'UPDATE_PRODUCT_FORM'; payload: Partial<ProductForm> }
  | { type: 'UPDATE_CATEGORY_FORM'; payload: Partial<CategoryForm> }
  | { type: 'UPDATE_NEW_DIMENSION_FIELD'; payload: Partial<DimensionField> }
  | { type: 'SET_NEW_FEATURE'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_UPLOADING'; payload: boolean }
  | { type: 'SET_IMAGE_SELECTION'; payload: { file: File | null; preview: string | null } }
  | { type: 'ADD_DIMENSION_FIELD' }
  | { type: 'REMOVE_DIMENSION_FIELD'; payload: number }
  | { type: 'RESET_PRODUCT_FORM' }
  | { type: 'RESET_CATEGORY_FORM' }
  | { type: 'UPDATE_CATEGORY_PRODUCTS'; payload: Array<{ id: string | number; name: string; type: 'product' | 'variant' }> }
  | { type: 'UPDATE_PRODUCT_DIMENSIONS'; payload: Record<string, string> }
  | { type: 'IMAGE_UPLOAD_SUCCESS'; payload: string };

// Initial state
const initialState: AdminProductsState = {
  products: [],
  categories: [],
  selectedCategory: 'all',
  categoryProducts: [],
  selectedProductId: 'all',
  productForm: {
    name: '',
    category: '',
    price: '',
    stockStatus: 'in_stock',
    quantity: '',
    dimensions: {},
    features: [],
    image: ''
  },
  categoryForm: {
    name: '',
    slug: '',
    description: '',
    dimensionFields: []
  },
  newDimensionField: { name: '', unit: '' },
  newFeature: '',
  isAddLoading: false,
  isUploading: false,
  selectedImage: null,
  imagePreview: null
};

// Reducer
function adminProductsReducer(state: AdminProductsState, action: AdminProductsAction): AdminProductsState {
  switch (action.type) {
    case 'LOAD_DATA_SUCCESS':
      return {
        ...state,
        products: action.payload.products,
        categories: action.payload.categories
      };

    case 'SET_SELECTED_CATEGORY': {
      const selectedCategory = action.payload;
      
      // Update category products when category changes
      let categoryProducts: Array<{ id: string | number; name: string; type: 'product' | 'variant' }> = [];
      
      if (selectedCategory && selectedCategory !== 'all' && state.products.length > 0) {
        // Add products from the category
        state.products.forEach((p) => {
          if (p.categorySlug === selectedCategory) {
            categoryProducts.push({ id: p.id, name: p.name, type: 'product' });
          }
        });
        
        // Add variants from productsData
        const allVariants = productsData.productVariants?.[selectedCategory]?.variants || [];
        allVariants.forEach((v: any) => {
          categoryProducts.push({ 
            id: v.id, 
            name: v.name + (v.capacity ? ` (${v.capacity})` : ''), 
            type: 'variant' 
          });
        });
      }
      
      return {
        ...state,
        selectedCategory,
        categoryProducts,
        selectedProductId: 'all'
      };
    }

    case 'SET_SELECTED_PRODUCT_ID':
      return {
        ...state,
        selectedProductId: action.payload
      };

    case 'UPDATE_PRODUCT_FORM': {
      const updatedForm = { ...state.productForm, ...action.payload };
      
      // If category changed, update dimensions automatically
      if (action.payload.category && action.payload.category !== state.productForm.category) {
        const categoryData = productsData.productVariants?.[action.payload.category];
        if (categoryData?.dimensionFields) {
          const newDimensions: Record<string, string> = {};
          categoryData.dimensionFields.forEach((field: any) => {
            newDimensions[field.name] = '';
          });
          updatedForm.dimensions = newDimensions;
        }
      }
      
      return {
        ...state,
        productForm: updatedForm
      };
    }

    case 'UPDATE_CATEGORY_FORM':
      return {
        ...state,
        categoryForm: { ...state.categoryForm, ...action.payload }
      };

    case 'UPDATE_NEW_DIMENSION_FIELD':
      return {
        ...state,
        newDimensionField: { ...state.newDimensionField, ...action.payload }
      };

    case 'SET_NEW_FEATURE':
      return {
        ...state,
        newFeature: action.payload
      };

    case 'SET_LOADING':
      return {
        ...state,
        isAddLoading: action.payload
      };

    case 'SET_UPLOADING':
      return {
        ...state,
        isUploading: action.payload
      };

    case 'SET_IMAGE_SELECTION':
      return {
        ...state,
        selectedImage: action.payload.file,
        imagePreview: action.payload.preview
      };

    case 'ADD_DIMENSION_FIELD':
      return {
        ...state,
        categoryForm: {
          ...state.categoryForm,
          dimensionFields: [...state.categoryForm.dimensionFields, state.newDimensionField]
        },
        newDimensionField: { name: '', unit: '' }
      };

    case 'REMOVE_DIMENSION_FIELD':
      return {
        ...state,
        categoryForm: {
          ...state.categoryForm,
          dimensionFields: state.categoryForm.dimensionFields.filter((_, i) => i !== action.payload)
        }
      };

    case 'RESET_PRODUCT_FORM':
      return {
        ...state,
        productForm: initialState.productForm,
        selectedImage: null,
        imagePreview: null
      };

    case 'RESET_CATEGORY_FORM':
      return {
        ...state,
        categoryForm: initialState.categoryForm
      };

    case 'UPDATE_CATEGORY_PRODUCTS':
      return {
        ...state,
        categoryProducts: action.payload
      };

    case 'UPDATE_PRODUCT_DIMENSIONS':
      return {
        ...state,
        productForm: {
          ...state.productForm,
          dimensions: action.payload
        }
      };

    case 'IMAGE_UPLOAD_SUCCESS':
      return {
        ...state,
        productForm: {
          ...state.productForm,
          image: action.payload
        },
        selectedImage: null,
        imagePreview: null
      };

    default:
      return state;
  }
}

// Hook
export function useAdminProductsReducer({ isAuthenticated, setMessage, username, password }: {
  isAuthenticated: boolean;
  setMessage: (message: string) => void;
  username: string;
  password: string;
}) {
  const [state, dispatch] = useReducer(adminProductsReducer, initialState);

  // Load products and categories
  const loadProducts = useCallback(async () => {
    try {
      const response = await fetch('/api/products');
      if (!response.ok) throw new Error('Failed to load products');
      const data = await response.json();
      dispatch({ 
        type: 'LOAD_DATA_SUCCESS', 
        payload: { products: data.products, categories: data.categories } 
      });
    } catch (error) {
      console.error('Error loading products:', error);
      setMessage && setMessage('Error loading products');
    }
  }, [setMessage]);

  // Update category products when products change (for initial load)
  useEffect(() => {
    if (state.selectedCategory !== 'all' && state.products.length > 0) {
      dispatch({ type: 'SET_SELECTED_CATEGORY', payload: state.selectedCategory });
    }
  }, [state.products, state.selectedCategory]);

  // Add Category
  const addCategory = useCallback(async () => {
    if (!state.categoryForm.name || !state.categoryForm.slug) {
      setMessage('Category name and slug are required');
      return;
    }
    
    dispatch({ type: 'SET_LOADING', payload: true });
    setMessage('');
    
    try {
      const response = await fetch('/api/admin/add-products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          password,
          action: 'add_category',
          categoryData: state.categoryForm
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setMessage(data.message);
        dispatch({ type: 'RESET_CATEGORY_FORM' });
        loadProducts();
      } else {
        const data = await response.json();
        setMessage(data.error || 'Failed to add category');
      }
    } catch (error) {
      console.error('Error adding category:', error);
      setMessage('Network error. Please try again.');
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.categoryForm, setMessage, loadProducts, username, password]);

  // Add Product
  const addProduct = useCallback(async () => {
    if (!state.productForm.name || !state.productForm.category) {
      setMessage('Product name and category are required');
      return;
    }
    
    dispatch({ type: 'SET_LOADING', payload: true });
    setMessage('');
    
    try {
      const response = await fetch('/api/admin/add-products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          password,
          action: 'add_product',
          productData: state.productForm
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setMessage(data.message);
        dispatch({ type: 'RESET_PRODUCT_FORM' });
        loadProducts();
      } else {
        const data = await response.json();
        setMessage(data.error || 'Failed to add product');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      setMessage('Network error. Please try again.');
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.productForm, setMessage, loadProducts, username, password]);

  // Add/Remove Dimension Field
  const addDimensionField = useCallback(() => {
    if (!state.newDimensionField.name || !state.newDimensionField.unit) {
      setMessage('Dimension field name and unit are required');
      return;
    }
    dispatch({ type: 'ADD_DIMENSION_FIELD' });
  }, [state.newDimensionField, setMessage]);

  const removeDimensionField = useCallback((index: number) => {
    dispatch({ type: 'REMOVE_DIMENSION_FIELD', payload: index });
  }, []);

  // Image upload
  const handleImageUpload = useCallback(async (file: File) => {
    if (!file) return;
    
    const credentials = { username, password };
    if (!credentials.username || !credentials.password) {
      setMessage('Session expired. Please login again.');
      return;
    }
    
    dispatch({ type: 'SET_UPLOADING', payload: true });
    setMessage('');
    
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('username', credentials.username);
      formData.append('password', credentials.password);
      formData.append('productName', state.productForm.name);
      formData.append('categorySlug', state.productForm.category);
      
      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        const data = await response.json();
        dispatch({ type: 'IMAGE_UPLOAD_SUCCESS', payload: data.imageUrl });
        setMessage('Image uploaded successfully!');
      } else {
        const data = await response.json();
        setMessage(data.error || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setMessage('Network error. Please try again.');
    } finally {
      dispatch({ type: 'SET_UPLOADING', payload: false });
    }
  }, [username, password, setMessage, state.productForm]);

  // Handle image selection
  const handleImageSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        dispatch({ 
          type: 'SET_IMAGE_SELECTION', 
          payload: { file, preview: e.target?.result as string } 
        });
      };
      reader.readAsDataURL(file);
    }
  }, []);

  // Action dispatchers for external use
  const updateProductForm = useCallback((updates: Partial<ProductForm>) => {
    dispatch({ type: 'UPDATE_PRODUCT_FORM', payload: updates });
  }, []);

  const updateCategoryForm = useCallback((updates: Partial<CategoryForm>) => {
    dispatch({ type: 'UPDATE_CATEGORY_FORM', payload: updates });
  }, []);

  const updateNewDimensionField = useCallback((updates: Partial<DimensionField>) => {
    dispatch({ type: 'UPDATE_NEW_DIMENSION_FIELD', payload: updates });
  }, []);

  const setNewFeature = useCallback((feature: string) => {
    dispatch({ type: 'SET_NEW_FEATURE', payload: feature });
  }, []);

  const setSelectedCategory = useCallback((category: string) => {
    dispatch({ type: 'SET_SELECTED_CATEGORY', payload: category });
  }, []);

  const setSelectedProductId = useCallback((productId: string) => {
    dispatch({ type: 'SET_SELECTED_PRODUCT_ID', payload: productId });
  }, []);

  return {
    // State
    ...state,
    
    // Actions
    loadProducts,
    addCategory,
    addProduct,
    addDimensionField,
    removeDimensionField,
    handleImageUpload,
    handleImageSelect,
    updateProductForm,
    updateCategoryForm,
    updateNewDimensionField,
    setNewFeature,
    setSelectedCategory,
    setSelectedProductId,
    
    // Dispatch for advanced usage
    dispatch
  };
}