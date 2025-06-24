import fs from 'fs';
import { NextResponse } from 'next/server';
import path from 'path';

// Get admin credentials from environment variables (required)
const ADMIN_CREDENTIALS = {
  username: process.env.ADMIN_USERNAME,
  password: process.env.ADMIN_PASSWORD
};

// Validate that credentials are set
if (!ADMIN_CREDENTIALS.username || !ADMIN_CREDENTIALS.password) {
  console.error('Admin credentials not configured. Please set ADMIN_USERNAME and ADMIN_PASSWORD in .env.local');
}

// Simple in-memory rate limiting
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = 10;

function checkRateLimit(ip) {
  const now = Date.now();
  const userRequests = rateLimitMap.get(ip) || [];
  const recentRequests = userRequests.filter(time => now - time < RATE_LIMIT_WINDOW);
  
  if (recentRequests.length >= MAX_REQUESTS) {
    return false;
  }
  
  recentRequests.push(now);
  rateLimitMap.set(ip, recentRequests);
  return true;
}

function validateInput(data) {
  const { username, password, action, categoryData, productData } = data;
  
  // Check required fields
  if (!username || !password || !action) {
    return { valid: false, error: 'Missing required fields' };
  }
  
  // Validate credentials
  if (username !== ADMIN_CREDENTIALS.username || password !== ADMIN_CREDENTIALS.password) {
    return { valid: false, error: 'Unauthorized' };
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

function createBackup(productsData) {
  const timestamp = Date.now();
  const backupFilename = `products_backup_add_products_${timestamp}.json`;
  const backupPath = path.join(process.cwd(), 'src', 'data', backupFilename);
  
  try {
    fs.writeFileSync(backupPath, JSON.stringify(productsData, null, 2));
    console.log(`Backup created: ${backupFilename}`);
    return backupFilename;
  } catch (error) {
    console.error('Error creating backup:', error);
    return null;
  }
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
    const validation = validateInput(body);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }
    
    const { username, password, action, categoryData, productData } = body;
    
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
    
    // Create backup before making changes
    const backupFilename = createBackup(productsData);
    
    let result = {};
    
    if (action === 'add_category') {
      // Add new category
      const { name, slug, description, dimensionFields } = categoryData;
      
      // Check if category already exists
      if (productsData.productVariants[slug]) {
        return NextResponse.json({ error: 'Category already exists' }, { status: 400 });
      }
      
      // Add category to productVariants
      productsData.productVariants[slug] = {
        name: name,
        description: description || '',
        dimensionFields: dimensionFields || [],
        variants: []
      };
      
      // Add category to main products list
      productsData.products.push({
        id: productsData.products.length + 1,
        name: name,
        category: name,
        categorySlug: slug,
        description: description || '',
        priceRange: '₹0.00 - ₹0.00',
        image: '/images/default-product.jpg',
        stockStatus: 'in_stock',
        quantity: null,
        capacity: 'N/A',
        packaging: 'N/A',
        catNo: `${Math.floor(Math.random() * 9000) + 1000} Series`,
        features: ['Custom category', 'Dynamic dimensions', 'Flexible configuration']
      });
      
      // Add category to productVariants for category page
      productsData.productVariants[slug] = {
        name: name,
        description: description || '',
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
      const { name, category, price, stockStatus, quantity, dimensions, features, image } = productData;
      
      // Check if category exists
      if (!productsData.productVariants[category]) {
        return NextResponse.json({ error: 'Category does not exist' }, { status: 400 });
      }
      
      // Create new variant
      const newVariant = {
        id: Date.now(),
        name,
        price,
        stockStatus: stockStatus || 'in_stock',
        quantity: quantity || null,
        dimensions: dimensions || {},
        features: Array.isArray(features) ? features : [],
        image: image || null
      };
      
      // Add variant to category
      productsData.productVariants[category].variants.push(newVariant);
      
      // Update category image if this is the first product with an image
      if (image && !productsData.productVariants[category].image) {
        productsData.productVariants[category].image = image;
      }
      
      result = {
        success: true,
        message: 'Product variant added successfully',
        product: newVariant
      };
    }
    
    // Write updated data back to file
    try {
      fs.writeFileSync(productsPath, JSON.stringify(productsData, null, 2));
    } catch (error) {
      console.error('Error writing products data file:', error);
      return NextResponse.json({ error: 'Error saving changes' }, { status: 500 });
    }
    
    // Log successful operation
    console.log(`Admin add products successful:`, {
      user: username,
      ip: ip,
      action: action,
      backup: backupFilename,
      result: result
    });
    
    return NextResponse.json({
      success: true,
      message: result.message,
      data: result,
      backup: backupFilename
    });
    
  } catch (error) {
    console.error('Error in add products API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 