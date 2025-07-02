import { createClient, RedisClientType } from 'redis';
import { performImageCleanup } from './image-cleanup-utils';

// TypeScript interfaces
interface BackupResult {
  success: boolean;
  data?: any;
  error?: any;
  backupId?: string;
  method?: string;
  timestamp?: number;
}

interface ListBackupsResult {
  success: boolean;
  backups?: any[];
  error?: string;
}

interface CleanupResult {
  analysis?: {
    totalImages: number;
  };
  cleanup?: {
    removed?: any[];
    totalSize?: number;
  };
}

interface RestoreWithCleanupResult extends BackupResult {
  cleanup?: CleanupResult;
}

let redisClient: RedisClientType | null = null;

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
export async function createBackup(data: any, operation: string = 'backup'): Promise<BackupResult> {
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
    
    return { success: true, backupId, timestamp, method: redis.isVercel ? 'vercel-kv' : 'redis' };
  } catch (error) {
    return { success: false, error: (error as any).message };
  }
}

// List all backups
export async function listBackups(): Promise<ListBackupsResult> {
  try {
    const redis = await initializeRedis();
    
    if (redis.isVercel) {
      // Use Vercel KV in production
      const keys = await redis.kv.keys('backup:*');
      const backups = [];
      
      for (const key of keys) {
        const backupData = await redis.kv.get(key);
        if (backupData) {
          const backup = JSON.parse(backupData as string);
          backups.push({
            filename: `${backup.id}.json`,
            size: JSON.stringify(backup).length,
            created: new Date(backup.timestamp),
            modified: new Date(backup.timestamp)
          });
        }
      }
      
      return { success: true, backups: backups.sort((a: any, b: any) => b.created - a.created) };
    } else {
      // Use local Redis in development
      const keys = await redis.client.keys('backup:*');
      const backups = [];
      
      for (const key of keys) {
        const backupData = await redis.client.get(key);
        if (backupData) {
          const backup = JSON.parse(backupData as string);
          backups.push({
            filename: `${backup.id}.json`,
            size: JSON.stringify(backup).length,
            created: new Date(backup.timestamp),
            modified: new Date(backup.timestamp)
          });
        }
      }
      
      return { success: true, backups: backups.sort((a: any, b: any) => b.created - a.created) };
    }
  } catch (error: any) {
    return { success: false, error: (error as any).message };
  }
}

// Restore backup
export async function restoreBackup(backupId: string): Promise<BackupResult> {
  try {
    const redis = await initializeRedis();
    
    if (redis.isVercel) {
      // Use Vercel KV in production
      const backupData = await redis.kv.get(`backup:${backupId}`);
      if (!backupData) {
        return { success: false, error: 'Backup not found' };
      }
      
      const backup = JSON.parse(backupData as string);
      return { success: true, data: backup.data };
    } else {
      // Use local Redis in development
      const backupData = await redis.client.get(`backup:${backupId}`);
      if (!backupData) {
        return { success: false, error: 'Backup not found' };
      }
      
      const backup = JSON.parse(backupData as string);
      return { success: true, data: backup.data };
    }
  } catch (error) {
    return { success: false, error: (error as any).message };
  }
}

// Restore backup with automatic image cleanup
export async function restoreBackupWithCleanup(backupId: string, performCleanup: boolean = true): Promise<RestoreWithCleanupResult> {
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
    return { success: false, error: (error as any).message };
  }
}

// Delete backup
export async function deleteBackup(backupId: string): Promise<BackupResult> {
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
    return { success: false, error: (error as any).message };
  }
}

// Close Redis connection (for cleanup)
export async function closeRedisConnection(): Promise<void> {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
  }
} 