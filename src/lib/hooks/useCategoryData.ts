import { useState, useEffect } from 'react';

export interface CategoryData {
  title?: string;
  name?: string;
  description?: string;
  icon?: string;
  image?: string;
  variants?: any[];
  [key: string]: any;
}

export function useCategoryData(categorySlug: string) {
  const [categoryData, setCategoryData] = useState<CategoryData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategoryData = async (slug: string) => {
    if (!slug) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/products?category=${slug}`);
      if (response.ok) {
        const data = await response.json();
        setCategoryData(data);
      } else {
        setError('Category not found');
        setCategoryData(null);
      }
    } catch (error) {
      console.error('Error fetching category data:', error);
      setError('Failed to load category data');
      setCategoryData(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (categorySlug) {
      fetchCategoryData(categorySlug);
    }
  }, [categorySlug]);

  return {
    categoryData,
    isLoading,
    error,
    refetch: () => fetchCategoryData(categorySlug)
  };
}