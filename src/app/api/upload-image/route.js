import { mkdir, writeFile } from 'fs/promises';
import { NextResponse } from 'next/server';
import path from 'path';

// Admin credentials validation
const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

// Validate that credentials are set
if (!ADMIN_USERNAME || !ADMIN_PASSWORD) {
  console.error('Admin credentials not configured. Please set ADMIN_USERNAME and ADMIN_PASSWORD in .env.local');
}

export async function POST(request) {
  try {
    // Parse form data
    const formData = await request.formData();
    
    // Get authentication data
    const username = formData.get('username');
    const password = formData.get('password');
    
    // Validate admin credentials
    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    // Get file and product info
    const file = formData.get('image');
    const productName = formData.get('productName');
    const categorySlug = formData.get('categorySlug');
    
    if (!file) {
      return NextResponse.json(
        { error: 'No image file provided' },
        { status: 400 }
      );
    }
    
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, and WebP images are allowed.' },
        { status: 400 }
      );
    }
    
    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size too large. Maximum size is 5MB.' },
        { status: 400 }
      );
    }
    
    // Create products directory if it doesn't exist
    const productsDir = path.join(process.cwd(), 'public', 'images', 'products');
    await mkdir(productsDir, { recursive: true });
    
    // Generate unique filename
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop().toLowerCase();
    const filename = `${categorySlug}_${productName.replace(/[^a-zA-Z0-9]/g, '_')}_${timestamp}.${fileExtension}`;
    const filepath = path.join(productsDir, filename);
    
    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);
    
    // Return the image URL
    const imageUrl = `/images/products/${filename}`;
    
    return NextResponse.json({
      success: true,
      imageUrl,
      filename,
      message: 'Image uploaded successfully'
    });
    
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
} 