import { useCallback, useEffect, useState } from 'react';
import productsData from '../../data/products.json';

export function useAdminProducts({ isAuthenticated, setMessage, username, password }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState('all');
  const [productForm, setProductForm] = useState({
    name: '',
    category: '',
    price: '',
    stockStatus: 'in_stock',
    quantity: '',
    dimensions: {},
    features: [],
    image: ''
  });
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    slug: '',
    description: '',
    dimensionFields: []
  });
  const [newDimensionField, setNewDimensionField] = useState({ name: '', unit: '' });
  const [newFeature, setNewFeature] = useState('');
  const [isAddLoading, setIsAddLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Load products and categories
  const loadProducts = useCallback(async () => {
    try {
      const response = await fetch('/api/products');
      if (!response.ok) throw new Error('Failed to load products');
      const data = await response.json();
      setProducts(data.products);
      setCategories(data.categories);
    } catch (error) {
      console.error('Error loading products:', error);
      setMessage && setMessage('Error loading products');
    }
  }, [setMessage]);

  // Update categoryProducts when selectedCategory or products change
  useEffect(() => {
    if (selectedCategory && selectedCategory !== 'all' && products.length > 0) {
      const variants = [];
      products.forEach((p) => {
        if (p.categorySlug === selectedCategory) {
          variants.push({ id: p.id, name: p.name, type: 'product' });
        }
      });
      const allVariants = productsData.productVariants?.[selectedCategory]?.variants || [];
      allVariants.forEach((v) => {
        variants.push({ id: v.id, name: v.name + (v.capacity ? ` (${v.capacity})` : ''), type: 'variant' });
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
      const categoryData = productsData.productVariants?.[productForm.category];
      if (categoryData?.dimensionFields) {
        const newDimensions = {};
        categoryData.dimensionFields.forEach(field => {
          newDimensions[field.name] = '';
        });
        setProductForm(prev => ({ ...prev, dimensions: newDimensions }));
      }
    }
  }, [productForm.category]);

  // Add Category
  const addCategory = useCallback(async () => {
    if (!categoryForm.name || !categoryForm.slug) {
      setMessage('Category name and slug are required');
      return;
    }
    setIsAddLoading(true);
    setMessage('');
    try {
      const response = await fetch('/api/admin/add-products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          password,
          action: 'add_category',
          categoryData: categoryForm
        }),
      });
      if (response.ok) {
        const data = await response.json();
        setMessage(data.message);
        setCategoryForm({ name: '', slug: '', description: '', dimensionFields: [] });
        loadProducts();
      } else {
        const data = await response.json();
        setMessage(data.error || 'Failed to add category');
      }
    } catch (error) {
      console.error('Error adding category:', error);
      setMessage('Network error. Please try again.');
    } finally {
      setIsAddLoading(false);
    }
  }, [categoryForm, setMessage, loadProducts, username, password]);

  // Add Product
  const addProduct = useCallback(async () => {
    if (!productForm.name || !productForm.category) {
      setMessage('Product name and category are required');
      return;
    }
    setIsAddLoading(true);
    setMessage('');
    try {
      const response = await fetch('/api/admin/add-products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          password,
          action: 'add_product',
          productData: productForm
        }),
      });
      if (response.ok) {
        const data = await response.json();
        setMessage(data.message);
        setProductForm({
          name: '',
          category: '',
          price: '',
          stockStatus: 'in_stock',
          quantity: '',
          dimensions: {},
          features: [],
          image: ''
        });
        setSelectedImage(null);
        setImagePreview(null);
        loadProducts();
      } else {
        const data = await response.json();
        setMessage(data.error || 'Failed to add product');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      setMessage('Network error. Please try again.');
    } finally {
      setIsAddLoading(false);
    }
  }, [productForm, setMessage, loadProducts, username, password]);

  // Add/Remove Dimension Field
  const addDimensionField = useCallback(() => {
    if (!newDimensionField.name || !newDimensionField.unit) {
      setMessage('Dimension field name and unit are required');
      return;
    }
    setCategoryForm(prev => ({
      ...prev,
      dimensionFields: [...prev.dimensionFields, newDimensionField]
    }));
    setNewDimensionField({ name: '', unit: '' });
  }, [newDimensionField, setMessage]);

  const removeDimensionField = useCallback((index) => {
    setCategoryForm(prev => ({
      ...prev,
      dimensionFields: prev.dimensionFields.filter((_, i) => i !== index)
    }));
  }, []);

  // Image upload
  const handleImageUpload = useCallback(async (file) => {
    if (!file) return;
    const credentials = { username, password };
    if (!credentials.username || !credentials.password) {
      setMessage('Session expired. Please login again.');
      return;
    }
    setIsUploading(true);
    setMessage('');
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
        setMessage('Image uploaded successfully!');
        setSelectedImage(null);
        setImagePreview(null);
      } else {
        const data = await response.json();
        setMessage(data.error || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setMessage('Network error. Please try again.');
    } finally {
      setIsUploading(false);
    }
  }, [username, password, setMessage, productForm]);

  // Handle image selection
  const handleImageSelect = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  }, []);

  return {
    products,
    setProducts,
    categories,
    setCategories,
    selectedCategory,
    setSelectedCategory,
    categoryProducts,
    setCategoryProducts,
    selectedProductId,
    setSelectedProductId,
    productForm,
    setProductForm,
    categoryForm,
    setCategoryForm,
    newDimensionField,
    setNewDimensionField,
    newFeature,
    setNewFeature,
    isAddLoading,
    setIsAddLoading,
    isUploading,
    setIsUploading,
    selectedImage,
    setSelectedImage,
    imagePreview,
    setImagePreview,
    loadProducts,
    addCategory,
    addProduct,
    addDimensionField,
    removeDimensionField,
    handleImageUpload,
    handleImageSelect
  };
} 