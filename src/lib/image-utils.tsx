/**
 * Dynamic image handling utilities
 */

/**
 * Get product image info for a given catalog number or product
 * @param {string|object} catNoOrProduct - The catalog number or product object
 * @param {string} fallbackImage - Optional fallback image URL
 * @returns {object} - Object with url and hasImage properties
 */
export const getProductImageInfo = (catNoOrProduct, fallbackImage = null) => {
  let catNo, productImage;
  
  // Handle both string catNo and product object
  if (typeof catNoOrProduct === 'string') {
    catNo = catNoOrProduct;
  } else if (catNoOrProduct && typeof catNoOrProduct === 'object') {
    catNo = catNoOrProduct.catNo;
    productImage = catNoOrProduct.image;
  }

  // If product has a direct image property, use it
  if (productImage) {
    return { url: productImage, hasImage: true };
  }

  // If fallback image is provided, use it
  if (fallbackImage) {
    return { url: fallbackImage, hasImage: true };
  }

  // Try to construct WebP image path from catalog number
  if (catNo) {
    // Extract numeric part from catalog number (e.g., "1170" from "1170 Series")
    const baseCatalogNumber = catNo.replace(/[^0-9]/g, '');
    
    if (baseCatalogNumber) {
      // Return the potential WebP path - let the browser/Next.js handle if it exists
      return { 
        url: `/images/products/${baseCatalogNumber}.webp`, 
        hasImage: true 
      };
    }
  }

  // No image available
  return { url: null, hasImage: false };
};

/**
 * React component to handle product image loading with fallback
 * @param {string} catNo - Product catalog number
 * @param {string} productImage - Direct product image URL
 * @param {string} alt - Alt text for the image
 * @param {string} className - CSS classes to apply
 * @param {React.Component} fallbackComponent - Component to show when no image
 * @param {Object} props - Additional props to pass to img element
 * @returns {React.Component} Image component or fallback
 */
export const ProductImage = ({ 
  catNo, 
  productImage, 
  alt, 
  className = "",
  fallbackComponent = null,
  ...props 
}) => {
  const { url: imageUrl, hasImage } = getProductImageInfo({ catNo, image: productImage });
  
  if (!hasImage) {
    return fallbackComponent || (
      <div className={`flex flex-col items-center justify-center text-gray-400 ${className}`}>
        <svg 
          width="40" 
          height="40" 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="opacity-40"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none"/>
          <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" opacity="0.6"/>
          <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.6"/>
        </svg>
        <span className="text-xs mt-2 opacity-60">No Image</span>
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={alt}
      className={className}
      onError={(e) => {
        // If image fails to load, hide it and show fallback
        const target = e.target as HTMLImageElement;
        target.style.display = 'none';
        if (target.nextSibling && fallbackComponent) {
          (target.nextSibling as HTMLElement).style.display = 'block';
        }
      }}
      {...props}
    />
  );
};