import fs from 'fs';
import { NextResponse } from 'next/server';
import path from 'path';
import { createBackup } from '../../../../lib/backup-utils';

// Get admin credentials from environment variables (required)
const ADMIN_CREDENTIALS = {
  username: process.env.ADMIN_USERNAME,
  password: process.env.ADMIN_PASSWORD
};


// Validate that credentials are set
if (!ADMIN_CREDENTIALS.username || !ADMIN_CREDENTIALS.password) {
  console.error('Admin credentials not configured. Please set ADMIN_USERNAME and ADMIN_PASSWORD in .env.local');
}

// Simple in-memory rate limiting (in production, use Redis or similar)
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 5 * 60 * 1000; // 5 minutes
const RATE_LIMIT_MAX_REQUESTS = 10;

function checkRateLimit(ip) {
  const now = Date.now();
  const userRequests = rateLimitMap.get(ip) || [];
  
  // Remove old requests outside the window
  const recentRequests = userRequests.filter(time => now - time < RATE_LIMIT_WINDOW);
  
  if (recentRequests.length >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }
  
  recentRequests.push(now);
  rateLimitMap.set(ip, recentRequests);
  return true;
}

function validateInput(data) {
  const { username, password, category, priceChangePercent } = data;
  
  // Check required fields
  if (!username || !password || !category || priceChangePercent === undefined) {
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
  
  // Validate price change percentage
  const percent = parseFloat(priceChangePercent);
  if (isNaN(percent) || percent < -50 || percent > 100) {
    return { valid: false, error: 'Price change percentage must be between -50 and 100' };
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
    const body = await request.json();
    
    // Validate input
    const validation = validateInput(body);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }
    
    const { username, password, category, priceChangePercent } = body;
    
    // Authenticate the request
    if (username !== ADMIN_CREDENTIALS.username || password !== ADMIN_CREDENTIALS.password) {
      // Log failed login attempt
      console.warn(`Failed admin login attempt from IP: ${ip}, username: ${username}`);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Log successful authentication
    console.log(`Admin login successful from IP: ${ip}, username: ${username}`);
    
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
    
    // Update prices based on category filter
    if (category === 'all') {
      // Update all products
      productsData.products.forEach(product => {
        if (product.priceRange) {
          const [minPrice, maxPrice] = product.priceRange.split('-').map(p => parseFloat(p.trim().replace('₹', '')));
          if (!isNaN(minPrice) && !isNaN(maxPrice)) {
            const newMinPrice = minPrice * (1 + priceChangePercent / 100);
            const newMaxPrice = maxPrice * (1 + priceChangePercent / 100);
            const oldRange = product.priceRange;
            product.priceRange = `₹${newMinPrice.toFixed(2)} - ₹${newMaxPrice.toFixed(2)}`;
            changes.push({
              product: product.name,
              category: product.category,
              oldPrice: oldRange,
              newPrice: product.priceRange
            });
            updatedCount++;
          }
        }
      });
      
      // Update product variants
      Object.keys(productsData.productVariants).forEach(catKey => {
        const categoryData = productsData.productVariants[catKey];
        if (categoryData && categoryData.variants) {
          categoryData.variants.forEach(variant => {
            if (variant.price) {
              const price = parseFloat(variant.price.replace('₹', ''));
              if (!isNaN(price)) {
                const newPrice = price * (1 + priceChangePercent / 100);
                const oldPrice = variant.price;
                variant.price = `₹${newPrice.toFixed(2)}`;
                changes.push({
                  product: variant.name,
                  category: catKey,
                  oldPrice: oldPrice,
                  newPrice: variant.price
                });
                updatedCount++;
              }
            }
          });
        }
      });
    } else {
      // Update specific category
      const categoryData = productsData.productVariants[category];
      if (categoryData && categoryData.variants) {
        categoryData.variants.forEach(variant => {
          if (variant.price) {
            const price = parseFloat(variant.price.replace('₹', ''));
            if (!isNaN(price)) {
              const newPrice = price * (1 + priceChangePercent / 100);
              const oldPrice = variant.price;
              variant.price = `₹${newPrice.toFixed(2)}`;
              changes.push({
                product: variant.name,
                category: category,
                oldPrice: oldPrice,
                newPrice: variant.price
              });
              updatedCount++;
            }
          }
        });
      }
      
      // Update main product price range for this category
      const mainProduct = productsData.products.find(p => p.category === category);
      if (mainProduct && mainProduct.priceRange) {
        const [minPrice, maxPrice] = mainProduct.priceRange.split('-').map(p => parseFloat(p.trim().replace('₹', '')));
        if (!isNaN(minPrice) && !isNaN(maxPrice)) {
          const newMinPrice = minPrice * (1 + priceChangePercent / 100);
          const newMaxPrice = maxPrice * (1 + priceChangePercent / 100);
          const oldRange = mainProduct.priceRange;
          mainProduct.priceRange = `₹${newMinPrice.toFixed(2)} - ₹${newMaxPrice.toFixed(2)}`;
          changes.push({
            product: mainProduct.name,
            category: category,
            oldPrice: oldRange,
            newPrice: mainProduct.priceRange
          });
          updatedCount++;
        }
      }
    }
    
    // Create backup before writing changes
    const backupResult = await createBackup(productsData, 'price_update');
    let backupCreated = false;
    
    if (backupResult.success) {
      backupCreated = true;
      console.log(`Backup created: ${backupResult.backupId} (${backupResult.method})`);
    } else {
      console.error('Failed to create backup:', backupResult.error);
      // Don't fail the request if backup fails
    }
    
    // Write the updated data back to the file (only in development)
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
      console.log('Production environment: Price changes logged but not persisted to filesystem');
    }
    
    // Log the changes for audit
    console.log(`Admin price update successful:`, {
      user: username,
      ip: ip,
      category: category,
      priceChangePercent: priceChangePercent,
      updatedCount: updatedCount,
      changes: changes.slice(0, 5) // Log first 5 changes to avoid huge logs
    });
    
    return NextResponse.json({
      success: true,
      updatedCount,
      message: `Successfully updated prices for ${updatedCount} items`,
      backupCreated: backupCreated
    });
    
  } catch (error) {
    console.error('Error updating prices:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 