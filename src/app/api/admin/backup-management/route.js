import fs from 'fs/promises';
import { NextResponse } from 'next/server';
import path from 'path';

// Environment variables for admin credentials (required)
const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

// Validate that credentials are set
if (!ADMIN_USERNAME || !ADMIN_PASSWORD) {
  console.error('Admin credentials not configured. Please set ADMIN_USERNAME and ADMIN_PASSWORD in .env.local');
}

// File paths
const PRODUCTS_FILE = path.join(process.cwd(), 'src', 'data', 'products.json');
const DEFAULT_PRODUCTS_FILE = path.join(process.cwd(), 'src', 'data', 'default_products.json');
const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const COUPONS_FILE = path.join(process.cwd(), 'src', 'data', 'coupons.json');

// Rate limiting (simple in-memory store)
const rateLimit = new Map();

function checkRateLimit(ip) {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = 10; // 10 requests per minute

  if (!rateLimit.has(ip)) {
    rateLimit.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }

  const record = rateLimit.get(ip);
  if (now > record.resetTime) {
    rateLimit.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (record.count >= maxRequests) {
    return false;
  }

  record.count++;
  return true;
}

function logAction(action, user, ip, details = {}) {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    action,
    user,
    ip,
    ...details
  };
  
  console.log(`Admin ${action}:`, logEntry);
}

export async function POST(request) {
  try {
    const { username, password, action, backupFile, couponData } = await request.json();
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';

    // Rate limiting
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    // Authentication
    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
      logAction('login_failed', username, ip);
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    logAction('backup_management', username, ip, { action });

    // Create backup of current state before any operation (except list_backups and cleanup_backups)
    if (action !== 'list_backups' && action !== 'cleanup_backups' && action !== 'create_coupon' && action !== 'list_coupons' && action !== 'delete_coupon') {
      const timestamp = Date.now();
      const backupFileName = `products_backup_${action}_${timestamp}.json`;
      const backupPath = path.join(DATA_DIR, backupFileName);

      try {
        const currentData = await fs.readFile(PRODUCTS_FILE, 'utf8');
        await fs.writeFile(backupPath, currentData);
        console.log(`Backup created: ${backupFileName}`);
      } catch (error) {
        console.error('Failed to create backup:', error);
        return NextResponse.json(
          { error: 'Failed to create backup before operation' },
          { status: 500 }
        );
      }
    }

    let result;

    switch (action) {
      case 'list_backups':
        result = await listBackups();
        break;
      
      case 'restore':
        if (!backupFile) {
          return NextResponse.json(
            { error: 'Backup file name is required for restore' },
            { status: 400 }
          );
        }
        result = await restoreBackup(backupFile);
        break;
      
      case 'reset':
        result = await resetToDefault();
        break;

      case 'cleanup_backups':
        result = await cleanupBackups();
        break;

      case 'delete_backup':
        if (!backupFile) {
          return NextResponse.json(
            { error: 'Backup file name is required for deletion' },
            { status: 400 }
          );
        }
        result = await deleteBackup(backupFile);
        break;

      case 'create_coupon':
        if (!couponData) {
          return NextResponse.json(
            { error: 'Coupon data is required' },
            { status: 400 }
          );
        }
        result = await createCoupon(couponData);
        break;

      case 'list_coupons':
        result = await listCoupons();
        break;

      case 'delete_coupon':
        if (!couponData || !couponData.code) {
          return NextResponse.json(
            { error: 'Coupon code is required for deletion' },
            { status: 400 }
          );
        }
        result = await deleteCoupon(couponData.code);
        break;
      
      default:
        return NextResponse.json(
          { error: 'Invalid action. Supported actions: list_backups, restore, reset, cleanup_backups, delete_backup, create_coupon, list_coupons, delete_coupon' },
          { status: 400 }
        );
    }

    if (result.success) {
      logAction(`${action}_successful`, username, ip, result);
      return NextResponse.json(result);
    } else {
      logAction(`${action}_failed`, username, ip, { error: result.error });
      return NextResponse.json(result, { status: 500 });
    }

  } catch (error) {
    console.error('Backup management error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function listBackups() {
  try {
    const files = await fs.readdir(DATA_DIR);
    const backupFiles = [];
    
    for (const file of files) {
      if (file.startsWith('products_backup_') && file.endsWith('.json')) {
        try {
          const filePath = path.join(DATA_DIR, file);
          const stats = await fs.stat(filePath);
          backupFiles.push({
            filename: file,
            size: stats.size,
            created: stats.birthtime,
            modified: stats.mtime
          });
        } catch (statError) {
          console.error(`Error getting stats for ${file}:`, statError);
          // Continue with other files
        }
      }
    }
    
    // Sort by modification time (newest first)
    backupFiles.sort((a, b) => new Date(b.modified) - new Date(a.modified));

    return {
      success: true,
      backups: backupFiles,
      count: backupFiles.length
    };
  } catch (error) {
    console.error('Error listing backups:', error);
    return {
      success: false,
      error: 'Failed to list backup files'
    };
  }
}

async function cleanupBackups() {
  try {
    const files = await fs.readdir(DATA_DIR);
    const backupFiles = [];
    
    for (const file of files) {
      if (file.startsWith('products_backup_') && file.endsWith('.json')) {
        try {
          const filePath = path.join(DATA_DIR, file);
          const stats = await fs.stat(filePath);
          backupFiles.push({
            filename: file,
            filePath,
            modified: stats.mtime
          });
        } catch (statError) {
          console.error(`Error getting stats for ${file}:`, statError);
        }
      }
    }
    
    // Sort by modification time (newest first)
    backupFiles.sort((a, b) => new Date(b.modified) - new Date(a.modified));

    // Keep only the last 10 backups
    const filesToDelete = backupFiles.slice(10);
    let deletedCount = 0;

    for (const file of filesToDelete) {
      try {
        await fs.unlink(file.filePath);
        deletedCount++;
      } catch (deleteError) {
        console.error(`Error deleting backup ${file.filename}:`, deleteError);
      }
    }

    return {
      success: true,
      message: `Cleanup completed. Deleted ${deletedCount} old backups, kept ${backupFiles.length - deletedCount} recent backups.`,
      deletedCount,
      keptCount: backupFiles.length - deletedCount
    };
  } catch (error) {
    console.error('Error cleaning up backups:', error);
    return {
      success: false,
      error: 'Failed to cleanup backups'
    };
  }
}

async function deleteBackup(backupFile) {
  try {
    const backupPath = path.join(DATA_DIR, backupFile);
    
    // Check if backup file exists
    try {
      await fs.access(backupPath);
    } catch {
      return {
        success: false,
        error: 'Backup file not found'
      };
    }

    // Delete the backup file
    await fs.unlink(backupPath);

    return {
      success: true,
      message: `Successfully deleted backup: ${backupFile}`
    };
  } catch (error) {
    console.error('Error deleting backup:', error);
    return {
      success: false,
      error: 'Failed to delete backup'
    };
  }
}

async function restoreBackup(backupFile) {
  try {
    const backupPath = path.join(DATA_DIR, backupFile);
    
    // Check if backup file exists
    try {
      await fs.access(backupPath);
    } catch {
      return {
        success: false,
        error: 'Backup file not found'
      };
    }

    // Read and validate backup data
    const backupData = await fs.readFile(backupPath, 'utf8');
    const parsedData = JSON.parse(backupData);

    // Validate backup structure
    if (!parsedData.products || !Array.isArray(parsedData.products)) {
      return {
        success: false,
        error: 'Invalid backup file format'
      };
    }

    // Restore the data
    await fs.writeFile(PRODUCTS_FILE, backupData);

    return {
      success: true,
      message: `Successfully restored from backup: ${backupFile}`,
      restoredProducts: parsedData.products.length,
      restoredVariants: Object.keys(parsedData.productVariants || {}).length
    };
  } catch (error) {
    console.error('Error restoring backup:', error);
    return {
      success: false,
      error: 'Failed to restore backup'
    };
  }
}

async function resetToDefault() {
  try {
    // Check if default file exists
    try {
      await fs.access(DEFAULT_PRODUCTS_FILE);
    } catch {
      return {
        success: false,
        error: 'Default products file not found'
      };
    }

    // Read default data
    const defaultData = await fs.readFile(DEFAULT_PRODUCTS_FILE, 'utf8');
    const parsedData = JSON.parse(defaultData);

    // Validate default data structure
    if (!parsedData.products || !Array.isArray(parsedData.products)) {
      return {
        success: false,
        error: 'Invalid default products file format'
      };
    }

    // Reset to default
    await fs.writeFile(PRODUCTS_FILE, defaultData);

    return {
      success: true,
      message: 'Successfully reset to default products',
      resetProducts: parsedData.products.length,
      resetVariants: Object.keys(parsedData.productVariants || {}).length
    };
  } catch (error) {
    console.error('Error resetting to default:', error);
    return {
      success: false,
      error: 'Failed to reset to default'
    };
  }
}

async function createCoupon(couponData) {
  try {
    // Initialize coupons file if it doesn't exist
    let coupons = [];
    try {
      const existingCoupons = await fs.readFile(COUPONS_FILE, 'utf8');
      coupons = JSON.parse(existingCoupons);
    } catch {
      // File doesn't exist, start with empty array
    }

    // Validate coupon data
    if (!couponData.code || !couponData.discountPercent || !couponData.expiryDate) {
      return {
        success: false,
        error: 'Coupon code, discount percentage, and expiry date are required'
      };
    }

    // Check if coupon code already exists
    if (coupons.find(c => c.code === couponData.code)) {
      return {
        success: false,
        error: 'Coupon code already exists'
      };
    }

    // Create new coupon
    const newCoupon = {
      id: Date.now().toString(),
      code: couponData.code.toUpperCase(),
      discountPercent: parseFloat(couponData.discountPercent),
      expiryDate: couponData.expiryDate,
      maxUses: couponData.maxUses || null,
      currentUses: 0,
      createdAt: new Date().toISOString(),
      isActive: true
    };

    coupons.push(newCoupon);

    // Save coupons
    await fs.writeFile(COUPONS_FILE, JSON.stringify(coupons, null, 2));

    return {
      success: true,
      message: `Coupon ${newCoupon.code} created successfully`,
      coupon: newCoupon
    };
  } catch (error) {
    console.error('Error creating coupon:', error);
    return {
      success: false,
      error: 'Failed to create coupon'
    };
  }
}

async function listCoupons() {
  try {
    let coupons = [];
    try {
      const existingCoupons = await fs.readFile(COUPONS_FILE, 'utf8');
      coupons = JSON.parse(existingCoupons);
    } catch {
      // File doesn't exist, return empty array
    }

    return {
      success: true,
      coupons,
      count: coupons.length
    };
  } catch (error) {
    console.error('Error listing coupons:', error);
    return {
      success: false,
      error: 'Failed to list coupons'
    };
  }
}

async function deleteCoupon(code) {
  try {
    let coupons = [];
    try {
      const existingCoupons = await fs.readFile(COUPONS_FILE, 'utf8');
      coupons = JSON.parse(existingCoupons);
    } catch {
      return {
        success: false,
        error: 'No coupons found'
      };
    }

    const initialCount = coupons.length;
    coupons = coupons.filter(c => c.code !== code.toUpperCase());

    if (coupons.length === initialCount) {
      return {
        success: false,
        error: 'Coupon not found'
      };
    }

    // Save updated coupons
    await fs.writeFile(COUPONS_FILE, JSON.stringify(coupons, null, 2));

    return {
      success: true,
      message: `Coupon ${code} deleted successfully`,
      remainingCount: coupons.length
    };
  } catch (error) {
    console.error('Error deleting coupon:', error);
    return {
      success: false,
      error: 'Failed to delete coupon'
    };
  }
} 