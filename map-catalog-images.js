const fs = require('fs');
const path = require('path');

// Read the current products data
const productsPath = path.join(__dirname, 'src/data/products.json');
const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

// Catalog image mapping based on product categories
const catalogImageMapping = {
  // Crucibles - use catalog images that show crucible products
  'crucibles': [
    '/images/catalog/catalog-000.jpg',  // Main crucible image
    '/images/catalog/catalog-001.jpg',  // Alternative crucible view
    '/images/catalog/catalog-002.jpg',  // Another crucible variant
  ],
  
  // Lids - use catalog images that show lid products
  'lids': [
    '/images/catalog/catalog-003.jpg',  // Lid image
    '/images/catalog/catalog-004.webp', // Alternative lid view
  ],
  
  // Specialty (Gooch Crucibles, etc.)
  'specialty': [
    '/images/catalog/catalog-005.jpg',  // Specialty crucible
    '/images/catalog/catalog-006.webp', // Gooch crucible
  ],
  
  // Basins
  'basins': [
    '/images/catalog/catalog-007.webp', // Basin with spout
    '/images/catalog/catalog-008.webp', // Alternative basin view
  ],
  
  // Capsules
  'capsules': [
    '/images/catalog/catalog-009.webp', // Circular capsules
    '/images/catalog/catalog-010.webp', // Capsule variants
  ],
  
  // Accessories
  'accessories': [
    '/images/catalog/catalog-011.webp', // Muffle stand
    '/images/catalog/catalog-012.webp', // Triangles
    '/images/catalog/catalog-013.webp', // Other accessories
  ]
};

// Update products with catalog images
productsData.products.forEach((product, index) => {
  const categorySlug = product.categorySlug;
  const availableImages = catalogImageMapping[categorySlug];
  
  if (availableImages && availableImages.length > 0) {
    // Use different images for different products in the same category
    const imageIndex = index % availableImages.length;
    product.image = availableImages[imageIndex];
    console.log(`Mapped ${product.name} (${categorySlug}) to ${product.image}`);
  } else {
    // Fallback to existing images or default
    if (!product.image) {
      product.image = '/images/thiasil-1.webp'; // Default fallback
    }
  }
});

// Update productVariants with catalog images
Object.keys(productsData.productVariants).forEach(categorySlug => {
  const categoryData = productsData.productVariants[categorySlug];
  const availableImages = catalogImageMapping[categorySlug];
  
  if (availableImages && availableImages.length > 0) {
    // Use the first image for the category
    categoryData.image = availableImages[0];
    console.log(`Mapped category ${categorySlug} to ${categoryData.image}`);
  } else {
    // Fallback to existing images or default
    if (!categoryData.image) {
      categoryData.image = '/images/thiasil-1.webp'; // Default fallback
    }
  }
});

// Write updated data back to file
fs.writeFileSync(productsPath, JSON.stringify(productsData, null, 2));

console.log('\n✅ Catalog images mapped successfully!');
console.log('📁 Images are stored in: public/images/catalog/');
console.log('🔄 Products updated with catalog images'); 