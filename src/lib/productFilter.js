import { extractPriceFromString } from './utils';

export const filterProducts = (products, filters) => {
  return products.filter((product) => {
    if (filters.category && product.category !== filters.category) return false;
    if (filters.stockStatus && product.stockStatus !== filters.stockStatus) return false;
    if (filters.packaging && product.packaging !== filters.packaging) return false;
    const price = extractPriceFromString(product.price);
    if (filters.minPrice && price < parseFloat(filters.minPrice)) return false;
    if (filters.maxPrice && price > parseFloat(filters.maxPrice)) return false;
    return true;
  });
};

export const searchProducts = (products, searchTerm) => {
  if (!searchTerm) return products;
  const term = searchTerm.toLowerCase();
  return products.filter(product => 
    product.name.toLowerCase().includes(term) ||
    product.category.toLowerCase().includes(term) ||
    (product.catalogNo && product.catalogNo.toLowerCase().includes(term))
  );
}; 