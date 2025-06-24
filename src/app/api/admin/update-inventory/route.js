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
const MAX_REQUESTS = 10; // Max 10 requests per 15 minutes

function checkRateLimit(ip) {
  const now = Date.now();
  const userRequests = rateLimitMap.get(ip) || [];
  
  // Remove old requests outside the window
  const recentRequests = userRequests.filter(time => now - time < RATE_LIMIT_WINDOW);
  
  if (recentRequests.length >= MAX_REQUESTS) {
    return false;
  }
  
  recentRequests.push(now);
  rateLimitMap.set(ip, recentRequests);
  return true;
}

function validateInventoryInput(data) {
  const { username, password, category, stockStatus, quantity } = data;
  
  // Check required fields
  if (!username || !password || !category || !stockStatus) {
    return { valid: false, error: 'Missing required fields' };
  }
  
  // Validate username format
  if (typeof username !== 'string' || username.length < 3 || username.length > 50) {
    return { valid: false, error: 'Invalid username format' };
  }
  
  // Validate password format
  if (typeof password !== 'string' || password.length < 6) {
    return { valid: false, error: 'Invalid password format' };
  }
  
  // Validate category
  if (typeof category !== 'string' || (category !== 'all' && category.length < 2)) {
    return { valid: false, error: 'Invalid category' };
  }
  
  // Validate stock status
  const validStatuses = ['in_stock', 'out_of_stock', 'made_to_order', 'limited_stock'];
  if (!validStatuses.includes(stockStatus)) {
    return { valid: false, error: 'Invalid stock status' };
  }
  
  // Validate quantity if provided
  if (quantity !== undefined && quantity !== null) {
    const qty = parseInt(quantity);
    if (isNaN(qty) || qty < 0) {
      return { valid: false, error: 'Quantity must be a non-negative number' };
    }
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
    const validation = validateInventoryInput(body);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }
    
    const { username, password, category, stockStatus, quantity, productId } = body;
    
    // Authenticate the request
    if (username !== ADMIN_CREDENTIALS.username || password !== ADMIN_CREDENTIALS.password) {
      // Log failed login attempt
      console.warn(`Failed admin inventory update attempt from IP: ${ip}, username: ${username}`);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Log successful authentication
    console.log(`Admin inventory update from IP: ${ip}, username: ${username}`);
    
    // Read the current products data
    const productsPath = path.join(process.cwd(), 'src', 'data', 'products.json');
    
    // Check if file exists
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
    
    let updatedCount = 0;
    const changes = []; // Track changes for audit log
    
    // If productId is provided, update only that product/variant
    if (productId) {
      // Try to update main product
      let found = false;
      productsData.products.forEach(product => {
        if (String(product.id) === String(productId)) {
          const oldStatus = product.stockStatus || 'in_stock';
          const oldQuantity = product.quantity;
          product.stockStatus = stockStatus;
          if (quantity !== undefined && quantity !== null) {
            product.quantity = parseInt(quantity);
          }
          changes.push({
            product: product.name,
            category: product.category,
            oldStatus,
            newStatus: stockStatus,
            oldQuantity,
            newQuantity: product.quantity
          });
          updatedCount++;
          found = true;
        }
      });
      // Try to update variant in productVariants
      Object.keys(productsData.productVariants).forEach(catKey => {
        const categoryData = productsData.productVariants[catKey];
        if (categoryData && categoryData.variants) {
          categoryData.variants.forEach(variant => {
            if (String(variant.id) === String(productId)) {
              const oldStatus = variant.stockStatus || 'in_stock';
              const oldQuantity = variant.quantity;
              variant.stockStatus = stockStatus;
              if (quantity !== undefined && quantity !== null) {
                variant.quantity = parseInt(quantity);
              }
              changes.push({
                product: variant.name,
                category: catKey,
                oldStatus,
                newStatus: stockStatus,
                oldQuantity,
                newQuantity: variant.quantity
              });
              updatedCount++;
              found = true;
            }
          });
        }
      });
      if (!found) {
        return NextResponse.json({ error: 'Product or variant not found' }, { status: 404 });
      }
    } else if (category === 'all') {
      // Update all products
      productsData.products.forEach(product => {
        const oldStatus = product.stockStatus || 'in_stock';
        const oldQuantity = product.quantity;
        
        product.stockStatus = stockStatus;
        if (quantity !== undefined && quantity !== null) {
          product.quantity = parseInt(quantity);
        }
        
        changes.push({
          product: product.name,
          category: product.category,
          oldStatus: oldStatus,
          newStatus: stockStatus,
          oldQuantity: oldQuantity,
          newQuantity: product.quantity
        });
        updatedCount++;
      });
      
      // Update product variants
      Object.keys(productsData.productVariants).forEach(catKey => {
        const categoryData = productsData.productVariants[catKey];
        if (categoryData && categoryData.variants) {
          categoryData.variants.forEach(variant => {
            const oldStatus = variant.stockStatus || 'in_stock';
            const oldQuantity = variant.quantity;
            
            variant.stockStatus = stockStatus;
            if (quantity !== undefined && quantity !== null) {
              variant.quantity = parseInt(quantity);
            }
            
            changes.push({
              product: variant.name,
              category: catKey,
              oldStatus: oldStatus,
              newStatus: stockStatus,
              oldQuantity: oldQuantity,
              newQuantity: variant.quantity
            });
            updatedCount++;
          });
        }
      });
    } else {
      // Update specific category
      const categoryData = productsData.productVariants[category];
      if (categoryData && categoryData.variants) {
        categoryData.variants.forEach(variant => {
          const oldStatus = variant.stockStatus || 'in_stock';
          const oldQuantity = variant.quantity;
          
          variant.stockStatus = stockStatus;
          if (quantity !== undefined && quantity !== null) {
            variant.quantity = parseInt(quantity);
          }
          
          changes.push({
            product: variant.name,
            category: category,
            oldStatus: oldStatus,
            newStatus: stockStatus,
            oldQuantity: oldQuantity,
            newQuantity: variant.quantity
          });
          updatedCount++;
        });
      }
      
      // Update main product for this category
      const mainProduct = productsData.products.find(p => p.category === category);
      if (mainProduct) {
        const oldStatus = mainProduct.stockStatus || 'in_stock';
        const oldQuantity = mainProduct.quantity;
        
        mainProduct.stockStatus = stockStatus;
        if (quantity !== undefined && quantity !== null) {
          mainProduct.quantity = parseInt(quantity);
        }
        
        changes.push({
          product: mainProduct.name,
          category: category,
          oldStatus: oldStatus,
          newStatus: stockStatus,
          oldQuantity: oldQuantity,
          newQuantity: mainProduct.quantity
        });
        updatedCount++;
      }
    }
    
    // Create backup before writing changes
    const backupPath = path.join(process.cwd(), 'src', 'data', `products_backup_inventory_${Date.now()}.json`);
    try {
      fs.writeFileSync(backupPath, JSON.stringify(productsData, null, 2));
    } catch (error) {
      console.error('Failed to create backup:', error);
      return NextResponse.json({ error: 'Failed to create backup' }, { status: 500 });
    }
    
    // Write the updated data back to the file
    try {
      fs.writeFileSync(productsPath, JSON.stringify(productsData, null, 2));
    } catch (error) {
      console.error('Failed to write updated data:', error);
      return NextResponse.json({ error: 'Failed to update products data' }, { status: 500 });
    }
    
    // Log the changes for audit
    console.log(`Admin inventory update successful:`, {
      user: username,
      ip: ip,
      category: category,
      stockStatus: stockStatus,
      quantity: quantity,
      updatedCount: updatedCount,
      changes: changes.slice(0, 5) // Log first 5 changes to avoid huge logs
    });
    
    return NextResponse.json({
      success: true,
      updatedCount,
      message: `Successfully updated inventory for ${updatedCount} items`,
      backupCreated: true
    });
    
  } catch (error) {
    console.error('Error updating inventory:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 