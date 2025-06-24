import { kv } from '@vercel/kv';
import fs from 'fs';
import path from 'path';

// Backup utility that works in both development and production
export async function createBackup(data, operation = 'backup') {
  const timestamp = Date.now();
  const backupId = `${operation}_${timestamp}`;
  const backupData = {
    id: backupId,
    timestamp,
    operation,
    data,
    environment: process.env.NODE_ENV,
    isVercel: process.env.VERCEL === '1'
  };

  const isDevelopment = process.env.NODE_ENV === 'development';
  const isVercel = process.env.VERCEL === '1';

  try {
    if (isDevelopment && !isVercel) {
      // Use file system in development (not on Vercel)
      const backupPath = path.join(process.cwd(), 'src', 'data', `${backupId}.json`);
      fs.writeFileSync(backupPath, JSON.stringify(backupData, null, 2));
      console.log(`Backup created (file): ${backupId}`);
      return { success: true, backupId, method: 'file' };
    } else {
      // Use Vercel KV in production or on Vercel
      if (!kv) {
        console.warn('Vercel KV not available, skipping backup');
        return { success: false, error: 'KV not available' };
      }
      
      await kv.set(`backup:${backupId}`, backupData);
      await kv.expire(`backup:${backupId}`, 60 * 60 * 24 * 30); // 30 days TTL
      
      // Also store in a list for easy retrieval
      await kv.lpush('backups:list', backupId);
      await kv.ltrim('backups:list', 0, 99); // Keep only last 100 backups
      
      console.log(`Backup created (KV): ${backupId}`);
      return { success: true, backupId, method: 'kv' };
    }
  } catch (error) {
    console.error('Backup creation failed:', error);
    return { success: false, error: error.message };
  }
}

// List all backups
export async function listBackups() {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const isVercel = process.env.VERCEL === '1';

  try {
    if (isDevelopment && !isVercel) {
      // List file-based backups
      const dataDir = path.join(process.cwd(), 'src', 'data');
      const files = fs.readdirSync(dataDir).filter(file => file.endsWith('.json') && file.includes('backup'));
      
      const backups = files.map(filename => {
        const filePath = path.join(dataDir, filename);
        const stats = fs.statSync(filePath);
        return {
          filename,
          size: stats.size,
          created: stats.birthtime,
          modified: stats.mtime
        };
      }).sort((a, b) => b.modified - a.modified);

      return { success: true, backups, method: 'file' };
    } else {
      // List KV-based backups
      if (!kv) {
        return { success: false, error: 'KV not available' };
      }

      const backupIds = await kv.lrange('backups:list', 0, -1);
      const backups = [];

      for (const backupId of backupIds) {
        const backupData = await kv.get(`backup:${backupId}`);
        if (backupData) {
          backups.push({
            id: backupId,
            timestamp: backupData.timestamp,
            operation: backupData.operation,
            size: JSON.stringify(backupData).length,
            created: new Date(backupData.timestamp),
            modified: new Date(backupData.timestamp)
          });
        }
      }

      return { success: true, backups, method: 'kv' };
    }
  } catch (error) {
    console.error('Failed to list backups:', error);
    return { success: false, error: error.message };
  }
}

// Restore a backup
export async function restoreBackup(backupId) {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const isVercel = process.env.VERCEL === '1';

  try {
    if (isDevelopment && !isVercel) {
      // Restore from file
      const backupPath = path.join(process.cwd(), 'src', 'data', `${backupId}.json`);
      if (!fs.existsSync(backupPath)) {
        return { success: false, error: 'Backup not found' };
      }
      
      const backupData = JSON.parse(fs.readFileSync(backupPath, 'utf8'));
      return { success: true, data: backupData.data, method: 'file' };
    } else {
      // Restore from KV
      if (!kv) {
        return { success: false, error: 'KV not available' };
      }

      const backupData = await kv.get(`backup:${backupId}`);
      if (!backupData) {
        return { success: false, error: 'Backup not found' };
      }

      return { success: true, data: backupData.data, method: 'kv' };
    }
  } catch (error) {
    console.error('Failed to restore backup:', error);
    return { success: false, error: error.message };
  }
}

// Delete a backup
export async function deleteBackup(backupId) {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const isVercel = process.env.VERCEL === '1';

  try {
    if (isDevelopment && !isVercel) {
      // Delete file
      const backupPath = path.join(process.cwd(), 'src', 'data', `${backupId}.json`);
      if (fs.existsSync(backupPath)) {
        fs.unlinkSync(backupPath);
        return { success: true, method: 'file' };
      }
      return { success: false, error: 'Backup not found' };
    } else {
      // Delete from KV
      if (!kv) {
        return { success: false, error: 'KV not available' };
      }

      await kv.del(`backup:${backupId}`);
      await kv.lrem('backups:list', 0, backupId);
      
      return { success: true, method: 'kv' };
    }
  } catch (error) {
    console.error('Failed to delete backup:', error);
    return { success: false, error: error.message };
  }
} 