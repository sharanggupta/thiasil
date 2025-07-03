import { mkdir, writeFile } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { authenticateAdmin } from '../../../lib/auth';
import { 
  validateFileUpload, 
  generateSecureFilename, 
  checkUploadRateLimit,
  DEFAULT_IMAGE_CONFIG 
} from '../../../lib/file-security';

// Validate that credentials are set
if (!process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD_HASH) {
  console.error('Admin credentials not configured. Please set ADMIN_USERNAME and ADMIN_PASSWORD_HASH in .env.local');
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Get client IP for rate limiting
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : 'unknown';
    
    // Check upload rate limiting
    if (!checkUploadRateLimit(ip)) {
      console.warn(`Upload rate limit exceeded for IP: ${ip}`);
      return NextResponse.json(
        { error: 'Upload rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }
    
    // Parse form data
    const formData = await request.formData();
    
    // Get authentication data
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;
    
    // Validate admin credentials
    const authResult = await authenticateAdmin(username, password);
    if (!authResult.success) {
      console.warn(`Failed upload authentication attempt from IP: ${ip}, username: ${username}`);
      return NextResponse.json(
        { error: authResult.error || 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    // Get file and product info
    const file = formData.get('image') as File;
    const productName = formData.get('productName') as string;
    const categorySlug = formData.get('categorySlug') as string;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No image file provided' },
        { status: 400 }
      );
    }
    
    // Validate required fields
    if (!productName || !categorySlug) {
      return NextResponse.json(
        { error: 'Product name and category are required' },
        { status: 400 }
      );
    }
    
    // Comprehensive file security validation
    const validationResult = await validateFileUpload(file, DEFAULT_IMAGE_CONFIG);
    if (!validationResult.isValid) {
      console.warn(`File upload validation failed for IP: ${ip}, error: ${validationResult.error}`);
      return NextResponse.json(
        { error: validationResult.error },
        { status: 400 }
      );
    }
    
    // Create products directory if it doesn't exist
    const productsDir = path.join(process.cwd(), 'public', 'images', 'products');
    await mkdir(productsDir, { recursive: true });
    
    // Generate secure filename
    const secureFilename = generateSecureFilename(file.name, categorySlug, productName);
    const filepath = path.join(productsDir, secureFilename);
    
    // Ensure file path is within the allowed directory (prevent directory traversal)
    const resolvedPath = path.resolve(filepath);
    const resolvedDir = path.resolve(productsDir);
    if (!resolvedPath.startsWith(resolvedDir)) {
      console.error(`Directory traversal attempt detected for IP: ${ip}`);
      return NextResponse.json(
        { error: 'Invalid file path' },
        { status: 400 }
      );
    }
    
    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(resolvedPath, buffer);
    
    // Return the image URL
    const imageUrl = `/images/products/${secureFilename}`;
    
    // Log successful upload
    console.log(`Successful image upload from IP: ${ip}, user: ${username}, file: ${secureFilename}`);
    
    return NextResponse.json({
      success: true,
      imageUrl,
      filename: secureFilename,
      message: 'Image uploaded successfully',
      fileSize: file.size,
      contentType: validationResult.contentType
    });
    
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
} 