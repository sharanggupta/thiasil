import { NextResponse } from 'next/server';
import { deleteBackup, listBackups, restoreBackup } from '../../../../lib/backup-utils';

// Admin credentials
const ADMIN_CREDENTIALS = {
  username: process.env.ADMIN_USERNAME,
  password: process.env.ADMIN_PASSWORD
};

// Rate limiting
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
  
  // Add current request
  recentRequests.push(now);
  rateLimitMap.set(ip, recentRequests);
  
  return true;
}

export async function POST(request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    
    // Rate limiting
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
    }
    
    const { username, password, action, backupId } = await request.json();
    
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
        
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
    
  } catch (error) {
    console.error('Backup management error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 