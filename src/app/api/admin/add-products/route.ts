import fs from 'fs';
import { NextResponse } from 'next/server';
import path from 'path';
import { createBackup } from '../../../../lib/backup-utils';
import { updateCategoryPriceRange } from '../../../../lib/utils';
import { authenticateAdmin } from '../../../../lib/auth';
import { sanitizeObject, SANITIZATION_CONFIGS } from '../../../../lib/input-sanitization';

// Validate that credentials are set
if (!process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD_HASH) {
  console.error('Admin credentials not configured. Please set ADMIN_USERNAME and ADMIN_PASSWORD_HASH in .env.local');
}

// Simple in-memory rate limiting
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 5 * 60 * 1000; // 5 minutes
const RATE_LIMIT_MAX_REQUESTS = 10;

function checkRateLimit(ip) {
  const now = Date.now();
  const userRequests = rateLimitMap.get(ip) || [];
  const recentRequests = userRequests.filter(time => now - time < RATE_LIMIT_WINDOW);
  
  if (recentRequests.length >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }
  
  recentRequests.push(now);
  rateLimitMap.set(ip, recentRequests);
  return true;
}

async function validateInput(data) {
  const { username, password, action, categoryData, productData } = data;
  
  // Check required fields
  if (!username || !password || !action) {
    return { valid: false, error: 'Missing required fields' };
  }
  
  // Validate credentials using secure authentication
  const authResult = await authenticateAdmin(username, password);
  if (!authResult.success) {
    return { valid: false, error: authResult.error || 'Unauthorized' };
  }
  
  // Validate action
  if (!['add_category', 'add_product'].includes(action)) {
    return { valid: false, error: 'Invalid action' };
  }
  
  // Validate category data
  if (action === 'add_category' && (!categoryData || !categoryData.name || !categoryData.slug)) {
    return { valid: false, error: 'Category name and slug are required' };
  }
  
  // Validate product data
  if (action === 'add_product' && (!productData || !productData.name || !productData.category)) {
    return { valid: false, error: 'Product name and category are required' };
  }
  
  return { valid: true };
}

export async function POST(request) {
  try {
    // Get client IP for rate limiting
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : 'unknown';
    
    // Check rate limiting
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ 
        error: 'Rate limit exceeded. Please try again later.' 
      }, { status: 429 });
    }
    
    // Parse and validate request body
    let body;
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 });
    }
    
    // Validate input
    const validation = await validateInput(body);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }
    
    // Comprehensive input sanitization
    const sanitizationConfig: Record<string, any> = {
      username: SANITIZATION_CONFIGS.PLAIN_TEXT,
      action: SANITIZATION_CONFIGS.PLAIN_TEXT,
    };
    
    const { sanitized: sanitizedBody, modifications } = sanitizeObject(body, sanitizationConfig);
    
    // Log any sanitization that occurred
    if (Object.keys(modifications).length > 0) {
      console.warn(`Input sanitization applied for IP: ${ip}`, modifications);
    }
    
    const { username, password, action, categoryData, productData } = sanitizedBody;
    
    // Log successful authentication
    console.log(`Admin add products action from IP: ${ip}, username: ${username}, action: ${action}`);
    
    // Read the current products data
    const productsPath = path.join(process.cwd(), 'src', 'data', 'products.json');
    
    if (!fs.existsSync(productsPath)) {
      console.error('Products data file not found');
      return NextResponse.json({ error: 'Products data not available' }, { status: 500 });
    }
    
    let productsData;
    try {
      productsData = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
    } catch (error) {
      console.error('Error reading products data file:', error);
      return NextResponse.json({ error: 'Error reading products data' }, { status: 500 });
    }
    
    // Create backup before adding new products
    const backupResult = await createBackup(productsData, 'add_products');
    let backupCreated = false;
    
    if (backupResult.success) {
      backupCreated = true;
      console.log(`Backup created: ${backupResult.backupId}`);
    } else {
      console.error('Failed to create backup:', backupResult.error);
      // Don't fail the request if backup fails
    }
    
    let result: { message?: string; [key: string]: any } = {};
    
    if (action === 'add_category') {
      // Add new category
      const { name, slug, description, dimensionFields } = categoryData;
      
      // Check if category already exists
      if (productsData.productVariants[slug]) {
        return NextResponse.json({ error: 'Category already exists' }, { status: 400 });
      }
      
      // Add category to main products list
      productsData.products.push({
        id: productsData.products.length + 1,
        name: name,
        category: name,
        categorySlug: slug,
        description: description || '',
        priceRange: '₹0.00 - ₹0.00',
        image: null, // No default image - will show placeholder
        stockStatus: 'in_stock',
        quantity: null,
        capacity: 'N/A',
        packaging: 'N/A',
        catNo: `${Math.floor(Math.random() * 9000) + 1000} Series`,
        features: ['Custom category', 'Dynamic dimensions', 'Flexible configuration']
      });
      
      // Add category to productVariants for category page
      productsData.productVariants[slug] = {
        title: name,
        description: description || '',
        icon: '🧪', // Default icon for new categories
        image: null, // No default image - will show placeholder
        dimensionFields: dimensionFields,
        variants: []
      };
      
      result = {
        success: true,
        message: 'Category added successfully',
        category: { name, slug, description, dimensionFields }
      };
      
    } else if (action === 'add_product') {
      // Add new product variant
      const { name, category, price, stockStatus, quantity, dimensions, features, image, packaging } = productData;
      
      // Check if category exists
      if (!productsData.productVariants[category]) {
        return NextResponse.json({ error: 'Category does not exist' }, { status: 400 });
      }
      
      // Get the main product to extract base catalog number
      const mainProduct = productsData.products.find(p => p.categorySlug === category);
      const baseCatalogNumber = mainProduct ? mainProduct.catNo.split(/[\s\/]/)[0] : '1000';
      
      // Generate variant-specific catalog number
      const variantCatNo = `${baseCatalogNumber}/${Date.now().toString().slice(-3)}`;
      
      // Extract capacity from dimensions if available
      const capacity = dimensions && Object.keys(dimensions).length > 0 
        ? Object.entries(dimensions).map(([key, value]) => `${key}: ${value}`).join(', ')
        : 'Custom';
      
      // Create new variant with both new and legacy fields for compatibility
      const newVariant = {
        id: Date.now(),
        name,
        catNo: variantCatNo, // Legacy compatibility
        capacity: capacity, // Legacy compatibility  
        packaging: packaging || '1 piece', // Default packaging for new variants
        price: `₹${price}`, // Ensure proper format
        stockStatus: stockStatus || 'in_stock',
        quantity: quantity || null,
        dimensions: dimensions || {}, // New admin structure
        features: Array.isArray(features) ? features : [],
        image: image || null
      };
      
      // Add variant to category
      productsData.productVariants[category].variants.push(newVariant);
      
      // Update category image if this is the first product with an image
      if (image && !productsData.productVariants[category].image) {
        productsData.productVariants[category].image = image;
      }
      
      // Update category price range based on all variants
      updateCategoryPriceRange(productsData, category);
      
      result = {
        success: true,
        message: 'Product variant added successfully',
        product: newVariant
      };
    }
    
    // Write updated data back to file (only in development)
    const isDevelopment = process.env.NODE_ENV === 'development';
    const isVercel = process.env.VERCEL === '1';
    
    if (isDevelopment && !isVercel) {
      try {
        fs.writeFileSync(productsPath, JSON.stringify(productsData, null, 2));
      } catch (error) {
        console.error('Error writing products data file:', error);
        return NextResponse.json({ error: 'Error saving changes' }, { status: 500 });
      }
    } else {
      // In production, log the changes but don't write to filesystem
      console.log('Production environment: Product changes logged but not persisted to filesystem');
    }
    
    // Log successful operation
    console.log(`Admin add products successful:`, {
      user: username,
      ip: ip,
      action: action,
      backup: backupResult.backupId,
      result: result
    });
    
    return NextResponse.json({
      success: true,
      message: result.message || 'Operation completed successfully',
      data: result,
      backup: backupResult.success ? backupResult.backupId : null
    });
    
  } catch (error) {
    console.error('Error in add products API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 