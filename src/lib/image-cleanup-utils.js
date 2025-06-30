import fs from 'fs';
import path from 'path';

/**
 * Scans for all image files in the public/images directory
 * @returns {Array} Array of image file paths
 */
export function scanImageFiles() {
  const imagesDir = path.join(process.cwd(), 'public', 'images');
  const imageFiles = [];
  
  function scanDirectory(dir, relativePath = '') {
    try {
      const items = fs.readdirSync(dir);
      
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const relativeItemPath = path.join(relativePath, item);
        
        if (fs.statSync(fullPath).isDirectory()) {
          scanDirectory(fullPath, relativeItemPath);
        } else if (item.match(/\.(webp|png|jpg|jpeg|svg|gif)$/i)) {
          imageFiles.push({
            filename: item,
            relativePath: relativeItemPath.replace(/\\/g, '/'),
            fullPath: fullPath,
            size: fs.statSync(fullPath).size,
            url: `/images/${relativeItemPath.replace(/\\/g, '/')}`
          });
        }
      }
    } catch (error) {
      console.error(`Error scanning directory ${dir}:`, error);
    }
  }
  
  if (fs.existsSync(imagesDir)) {
    scanDirectory(imagesDir);
  }
  
  return imageFiles;
}

/**
 * Finds all image references in the codebase and data files
 * @param {Object} productsData - Current products data
 * @returns {Set} Set of referenced image URLs
 */
export function findReferencedImages(productsData) {
  const referencedImages = new Set();
  
  // Add images from product data
  if (productsData && productsData.products) {
    productsData.products.forEach(product => {
      if (product.image) {
        referencedImages.add(product.image);
      }
    });
  }
  
  // Add images from product variants
  if (productsData && productsData.productVariants) {
    Object.values(productsData.productVariants).forEach(category => {
      if (category.image) {
        referencedImages.add(category.image);
      }
      
      if (category.variants) {
        category.variants.forEach(variant => {
          if (variant.image) {
            referencedImages.add(variant.image);
          }
        });
      }
    });
  }
  
  // Add dynamically generated image references
  // Based on getBaseCatalogNumber function pattern
  if (productsData && productsData.products) {
    productsData.products.forEach(product => {
      if (product.catNo) {
        const baseCatalogNumber = product.catNo.split(/[\s\/]/)[0];
        if (baseCatalogNumber && baseCatalogNumber.match(/^\d+$/)) {
          // Add both webp and svg versions
          referencedImages.add(`/images/products/${baseCatalogNumber}.webp`);
          referencedImages.add(`/images/products/${baseCatalogNumber}.svg`);
        }
      }
    });
  }
  
  // Add fallback images
  referencedImages.add('/images/catalog/catalog-000.webp');
  
  // Add mapped catalog images (catalog-000 through catalog-013)
  for (let i = 0; i <= 13; i++) {
    const catalogNum = i.toString().padStart(3, '0');
    referencedImages.add(`/images/catalog/catalog-${catalogNum}.webp`);
  }
  
  return referencedImages;
}

/**
 * Identifies unused image files that can be safely removed
 * @param {Object} productsData - Current products data
 * @returns {Object} Analysis results with unused files
 */
export function analyzeUnusedImages(productsData) {
  const allImages = scanImageFiles();
  const referencedImages = findReferencedImages(productsData);
  
  const unusedImages = allImages.filter(image => {
    // Check if image URL is referenced
    const isReferenced = referencedImages.has(image.url);
    
    // Additional checks for special cases
    const isTestFile = image.filename.includes('test') || 
                      image.filename.match(/\d{13,}/); // Timestamp pattern
    
    const isShadowFile = image.filename.includes('shadow');
    
    return !isReferenced && !isShadowFile;
  });
  
  const totalSize = unusedImages.reduce((sum, img) => sum + img.size, 0);
  
  return {
    totalImages: allImages.length,
    referencedCount: allImages.length - unusedImages.length,
    unusedImages: unusedImages,
    unusedCount: unusedImages.length,
    totalUnusedSize: totalSize,
    savings: {
      files: unusedImages.length,
      bytes: totalSize,
      kb: Math.round(totalSize / 1024 * 100) / 100,
      mb: Math.round(totalSize / (1024 * 1024) * 100) / 100
    }
  };
}

/**
 * Safely removes unused image files
 * @param {Array} unusedImages - Array of unused image objects
 * @param {boolean} dryRun - If true, only logs what would be removed
 * @returns {Object} Cleanup results
 */
export function cleanupUnusedImages(unusedImages, dryRun = false) {
  const results = {
    removed: [],
    failed: [],
    dryRun: dryRun,
    totalSize: 0
  };
  
  for (const image of unusedImages) {
    try {
      if (dryRun) {
        console.log(`[DRY RUN] Would remove: ${image.relativePath} (${image.size} bytes)`);
        results.removed.push(image);
        results.totalSize += image.size;
      } else {
        if (fs.existsSync(image.fullPath)) {
          fs.unlinkSync(image.fullPath);
          console.log(`Removed unused image: ${image.relativePath} (${image.size} bytes)`);
          results.removed.push(image);
          results.totalSize += image.size;
        } else {
          console.warn(`File not found: ${image.fullPath}`);
          results.failed.push({ ...image, error: 'File not found' });
        }
      }
    } catch (error) {
      console.error(`Failed to remove ${image.relativePath}:`, error);
      results.failed.push({ ...image, error: error.message });
    }
  }
  
  return results;
}

/**
 * Comprehensive image cleanup function for backup restoration
 * @param {Object} productsData - Products data after restoration
 * @param {boolean} dryRun - If true, only reports what would be cleaned
 * @returns {Object} Complete cleanup results
 */
export function performImageCleanup(productsData, dryRun = false) {
  console.log('Starting image cleanup analysis...');
  
  const analysis = analyzeUnusedImages(productsData);
  
  console.log(`Image Analysis Results:
    - Total images: ${analysis.totalImages}
    - Referenced images: ${analysis.referencedCount}
    - Unused images: ${analysis.unusedCount}
    - Potential savings: ${analysis.savings.kb}KB (${analysis.savings.mb}MB)`);
  
  if (analysis.unusedCount === 0) {
    console.log('No unused images found. Image directory is clean.');
    return {
      analysis,
      cleanup: { removed: [], failed: [], dryRun, totalSize: 0 }
    };
  }
  
  console.log('\nUnused images found:');
  analysis.unusedImages.forEach(img => {
    console.log(`  - ${img.relativePath} (${Math.round(img.size/1024*100)/100}KB)`);
  });
  
  const cleanup = cleanupUnusedImages(analysis.unusedImages, dryRun);
  
  if (!dryRun && cleanup.removed.length > 0) {
    console.log(`\nCleanup completed:
      - Removed ${cleanup.removed.length} files
      - Freed ${Math.round(cleanup.totalSize/1024*100)/100}KB of storage`);
  }
  
  return { analysis, cleanup };
}