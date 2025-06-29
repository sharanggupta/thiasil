import fs from 'fs';
import { NextResponse } from 'next/server';
import path from 'path';
import { createBackup, deleteBackup, listBackups, restoreBackup } from '../../../../lib/backup-utils';

// Admin credentials
const ADMIN_CREDENTIALS = {
  username: process.env.ADMIN_USERNAME,
  password: process.env.ADMIN_PASSWORD
};

// Rate limiting
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 5 * 60 * 1000; // 5 minutes
const RATE_LIMIT_MAX_REQUESTS = 10;

const COUPONS_FILE = path.join(process.cwd(), 'src', 'data', 'coupons.json');

function checkRateLimit(ip) {
  const now = Date.now();
  const userRequests = rateLimitMap.get(ip) || [];
  
  // Remove old requests outside the window
  const recentRequests = userRequests.filter(time => now - time < RATE_LIMIT_WINDOW);
  
  if (recentRequests.length >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }
  
  // Add current request
  recentRequests.push(now);
  rateLimitMap.set(ip, recentRequests);
  
  return true;
}

function readCoupons() {
  try {
    if (!fs.existsSync(COUPONS_FILE)) {
      return [];
    }
    const data = fs.readFileSync(COUPONS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
}

function writeCoupons(coupons) {
  fs.writeFileSync(COUPONS_FILE, JSON.stringify(coupons, null, 2), 'utf-8');
}

export async function POST(request) {
  const body = await request.json();
  console.log('DEBUG BACKUP BODY', body);
  try {
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    
    // Rate limiting
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
    }
    
    const { username, password, action, backupId, coupon, code } = body;
    
    // Authentication
    if (username !== ADMIN_CREDENTIALS.username || password !== ADMIN_CREDENTIALS.password) {
      console.log('Admin login_failed:', {
        timestamp: new Date().toISOString(),
        action: 'login_failed',
        user: username,
        ip: ip
      });
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    
    console.log('Admin backup_management:', {
      timestamp: new Date().toISOString(),
      action: action,
      user: username,
      ip: ip
    });
    
    switch (action) {
      case 'list_backups':
        const listResult = await listBackups();
        if (listResult.success) {
          console.log('Admin list_backups_successful:', {
            timestamp: new Date().toISOString(),
            action: 'list_backups_successful',
            user: username,
            ip: ip,
            success: true,
            backups: listResult.backups,
            count: listResult.backups.length
          });
          return NextResponse.json({
            success: true,
            backups: listResult.backups,
            method: listResult.method
          });
        } else {
          return NextResponse.json({ error: listResult.error }, { status: 500 });
        }
        
      case 'restore_backup':
        if (!backupId) {
          return NextResponse.json({ error: 'Backup ID required' }, { status: 400 });
        }
        
        const restoreResult = await restoreBackup(backupId);
        if (restoreResult.success) {
          console.log('Admin restore_backup_successful:', {
            timestamp: new Date().toISOString(),
            action: 'restore_backup_successful',
            user: username,
            ip: ip,
            backupId: backupId,
            method: restoreResult.method
          });
          return NextResponse.json({
            success: true,
            data: restoreResult.data,
            method: restoreResult.method
          });
        } else {
          return NextResponse.json({ error: restoreResult.error }, { status: 500 });
        }
        
      case 'delete_backup':
        if (!backupId) {
          return NextResponse.json({ error: 'Backup ID required' }, { status: 400 });
        }
        
        const deleteResult = await deleteBackup(backupId);
        if (deleteResult.success) {
          console.log('Admin delete_backup_successful:', {
            timestamp: new Date().toISOString(),
            action: 'delete_backup_successful',
            user: username,
            ip: ip,
            backupId: backupId,
            method: deleteResult.method
          });
          return NextResponse.json({
            success: true,
            method: deleteResult.method
          });
        } else {
          return NextResponse.json({ error: deleteResult.error }, { status: 500 });
        }
        
      case 'list_coupons': {
        const coupons = readCoupons();
        return NextResponse.json({ success: true, coupons });
      }
      case 'create_coupon': {
        if (!coupon || !coupon.code || !coupon.discountPercent || !coupon.expiryDate) {
          return NextResponse.json({ error: 'Missing coupon fields' }, { status: 400 });
        }
        let coupons = readCoupons();
        if (coupons.find(c => c.code === coupon.code)) {
          return NextResponse.json({ error: 'Coupon code already exists' }, { status: 400 });
        }
        
        const newCoupon = {
          ...coupon,
          code: coupon.code.toUpperCase(),
          isActive: true,
          currentUses: 0,
          createdAt: new Date().toISOString()
        };
        
        coupons.push(newCoupon);
        writeCoupons(coupons);
        
        // Create backup after coupon creation
        try {
          await createBackup({
            action: 'create_coupon',
            coupon: newCoupon,
            allCoupons: coupons,
            timestamp: new Date().toISOString()
          }, 'coupon_created');
          
          console.log('Admin create_coupon_with_backup_successful:', {
            timestamp: new Date().toISOString(),
            action: 'create_coupon_with_backup_successful',
            user: username,
            ip: ip,
            couponCode: newCoupon.code
          });
        } catch (backupError) {
          console.error('Backup failed after coupon creation:', backupError);
          // Don't fail the coupon creation if backup fails
        }
        
        return NextResponse.json({ success: true, message: 'Coupon created', coupons });
      }
      case 'delete_coupon': {
        if (!code) {
          return NextResponse.json({ error: 'Coupon code required' }, { status: 400 });
        }
        let coupons = readCoupons();
        const before = coupons.length;
        const deletedCoupon = coupons.find(c => c.code === code);
        coupons = coupons.filter(c => c.code !== code);
        if (coupons.length === before) {
          return NextResponse.json({ error: 'Coupon not found' }, { status: 404 });
        }
        writeCoupons(coupons);
        
        // Create backup after coupon deletion
        try {
          await createBackup({
            action: 'delete_coupon',
            deletedCoupon,
            allCoupons: coupons,
            timestamp: new Date().toISOString()
          }, 'coupon_deleted');
          
          console.log('Admin delete_coupon_with_backup_successful:', {
            timestamp: new Date().toISOString(),
            action: 'delete_coupon_with_backup_successful',
            user: username,
            ip: ip,
            couponCode: code
          });
        } catch (backupError) {
          console.error('Backup failed after coupon deletion:', backupError);
          // Don't fail the coupon deletion if backup fails
        }
        
        return NextResponse.json({ success: true, message: 'Coupon deleted', coupons });
      }
      case 'reset': {
        // Reset products.json to default_products.json
        const productsPath = path.join(process.cwd(), 'src', 'data', 'products.json');
        const defaultProductsPath = path.join(process.cwd(), 'src', 'data', 'default_products.json');
        try {
          if (!fs.existsSync(defaultProductsPath)) {
            return NextResponse.json({ error: 'Default products file not found' }, { status: 500 });
          }
          const defaultData = fs.readFileSync(defaultProductsPath, 'utf-8');
          fs.writeFileSync(productsPath, defaultData, 'utf-8');
          return NextResponse.json({ success: true, message: 'Products reset to default.' });
        } catch (err) {
          return NextResponse.json({ error: 'Failed to reset products: ' + err.message }, { status: 500 });
        }
      }
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
    
  } catch (error) {
    console.error('Backup management error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 