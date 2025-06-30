import { createClient } from 'redis';
import { performImageCleanup } from './image-cleanup-utils.js';

let redisClient = null;

// Initialize Redis client
async function initializeRedis() {
  if (redisClient) {
    return { client: redisClient, isVercel: false };
  }

  try {
    // Check if we're in Vercel environment
    if (process.env.VERCEL === '1') {
      const { kv } = await import('@vercel/kv');
      return { kv, isVercel: true };
    }

    // Create Redis client for local development
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    
    redisClient = createClient({
      url: redisUrl
    });

    await redisClient.connect();
    return { client: redisClient, isVercel: false };
  } catch (err) {
    throw err;
  }
}

// Backup utility that uses Redis everywhere
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

  try {
    const redis = await initializeRedis();
    
    if (redis.isVercel) {
      // Use Vercel KV in production
      await redis.kv.set(`backup:${backupId}`, JSON.stringify(backupData));
    } else {
      // Use local Redis in development
      await redis.client.set(`backup:${backupId}`, JSON.stringify(backupData));
    }
    
    return { success: true, backupId, timestamp };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// List all backups
export async function listBackups() {
  try {
    const redis = await initializeRedis();
    
    if (redis.isVercel) {
      // Use Vercel KV in production
      const keys = await redis.kv.keys('backup:*');
      const backups = [];
      
      for (const key of keys) {
        const backupData = await redis.kv.get(key);
        if (backupData) {
          const backup = JSON.parse(backupData);
          backups.push({
            filename: `${backup.id}.json`,
            size: JSON.stringify(backup).length,
            created: new Date(backup.timestamp),
            modified: new Date(backup.timestamp)
          });
        }
      }
      
      return { success: true, backups: backups.sort((a, b) => b.created - a.created) };
    } else {
      // Use local Redis in development
      const keys = await redis.client.keys('backup:*');
      const backups = [];
      
      for (const key of keys) {
        const backupData = await redis.client.get(key);
        if (backupData) {
          const backup = JSON.parse(backupData);
          backups.push({
            filename: `${backup.id}.json`,
            size: JSON.stringify(backup).length,
            created: new Date(backup.timestamp),
            modified: new Date(backup.timestamp)
          });
        }
      }
      
      return { success: true, backups: backups.sort((a, b) => b.created - a.created) };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Restore backup
export async function restoreBackup(backupId) {
  try {
    const redis = await initializeRedis();
    
    if (redis.isVercel) {
      // Use Vercel KV in production
      const backupData = await redis.kv.get(`backup:${backupId}`);
      if (!backupData) {
        return { success: false, error: 'Backup not found' };
      }
      
      const backup = JSON.parse(backupData);
      return { success: true, data: backup.data };
    } else {
      // Use local Redis in development
      const backupData = await redis.client.get(`backup:${backupId}`);
      if (!backupData) {
        return { success: false, error: 'Backup not found' };
      }
      
      const backup = JSON.parse(backupData);
      return { success: true, data: backup.data };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Restore backup with automatic image cleanup
export async function restoreBackupWithCleanup(backupId, performCleanup = true) {
  try {
    // First restore the backup
    const restoreResult = await restoreBackup(backupId);
    
    if (!restoreResult.success) {
      return restoreResult;
    }
    
    let cleanupResult = null;
    
    // Perform image cleanup if requested
    if (performCleanup) {
      try {
        console.log('Performing automatic image cleanup after backup restoration...');
        cleanupResult = performImageCleanup(restoreResult.data, false); // false = not dry run
        
        console.log(`Image cleanup completed:
          - Analyzed ${cleanupResult.analysis.totalImages} total images
          - Found ${cleanupResult.analysis.unusedCount} unused images
          - Removed ${cleanupResult.cleanup.removed.length} files
          - Freed ${cleanupResult.cleanup.totalSize} bytes`);
      } catch (cleanupError) {
        console.error('Image cleanup failed:', cleanupError);
        // Don't fail the restore if cleanup fails
        cleanupResult = { error: cleanupError.message };
      }
    }
    
    return {
      success: true,
      data: restoreResult.data,
      cleanup: cleanupResult
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Delete backup
export async function deleteBackup(backupId) {
  try {
    const redis = await initializeRedis();
    
    if (redis.isVercel) {
      // Use Vercel KV in production
      await redis.kv.del(`backup:${backupId}`);
    } else {
      // Use local Redis in development
      await redis.client.del(`backup:${backupId}`);
    }
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Close Redis connection (for cleanup)
export async function closeRedisConnection() {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
  }
} 