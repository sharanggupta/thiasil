import { createClient } from 'redis';

let redisClient = null;

// Initialize Redis client
async function initializeRedis() {
  if (redisClient) {
    return redisClient;
  }

  try {
    // Check if we're in Vercel environment
    if (process.env.VERCEL === '1') {
      console.log('Using Vercel KV in production');
      return null; // Use Vercel KV instead
    }

    // Create Redis client for local development
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    console.log(`Connecting to Redis: ${redisUrl}`);
    
    redisClient = createClient({
      url: redisUrl
    });

    // Handle connection events
    redisClient.on('error', (err) => {
      console.error('Redis Client Error:', err);
    });

    redisClient.on('connect', () => {
      console.log('Redis Client Connected');
    });

    redisClient.on('ready', () => {
      console.log('Redis Client Ready');
    });

    redisClient.on('end', () => {
      console.log('Redis Client Disconnected');
    });

    // Connect to Redis
    await redisClient.connect();
    
    return redisClient;
  } catch (error) {
    console.error('Failed to initialize Redis:', error);
    return null;
  }
}

// Get Redis client instance
export async function getRedisClient() {
  if (!redisClient) {
    await initializeRedis();
  }
  return redisClient;
}

// Close Redis connection
export async function closeRedisConnection() {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
  }
}

// Get value from Redis
export async function getValue(key) {
  try {
    if (process.env.VERCEL === '1') {
      // Use Vercel KV in production
      const { kv } = await import('@vercel/kv');
      const value = await kv.get(key);
      return { success: true, value };
    } else {
      // Use local Redis in development
      const client = await initializeRedis();
      if (!client) {
        return { success: false, error: 'Redis not available' };
      }
      
      const value = await client.get(key);
      return { success: true, value };
    }
  } catch (error) {
    console.error('Failed to get value:', error);
    return { success: false, error: error.message };
  }
}

// Set value in Redis
export async function setValue(key, value, ttl = null) {
  try {
    if (process.env.VERCEL === '1') {
      // Use Vercel KV in production
      const { kv } = await import('@vercel/kv');
      if (ttl) {
        await kv.setex(key, ttl, value);
      } else {
        await kv.set(key, value);
      }
      return { success: true };
    } else {
      // Use local Redis in development
      const client = await initializeRedis();
      if (!client) {
        return { success: false, error: 'Redis not available' };
      }
      
      if (ttl) {
        await client.setEx(key, ttl, value);
      } else {
        await client.set(key, value);
      }
      return { success: true };
    }
  } catch (error) {
    console.error('Failed to set value:', error);
    return { success: false, error: error.message };
  }
}

// Delete value from Redis
export async function deleteValue(key) {
  try {
    if (process.env.VERCEL === '1') {
      // Use Vercel KV in production
      const { kv } = await import('@vercel/kv');
      await kv.del(key);
      return { success: true };
    } else {
      // Use local Redis in development
      const client = await initializeRedis();
      if (!client) {
        return { success: false, error: 'Redis not available' };
      }
      
      await client.del(key);
      return { success: true };
    }
  } catch (error) {
    console.error('Failed to delete value:', error);
    return { success: false, error: error.message };
  }
}

// Push to list
export async function listPush(key, value) {
  try {
    if (process.env.VERCEL === '1') {
      // Use Vercel KV in production
      const { kv } = await import('@vercel/kv');
      await kv.lpush(key, value);
      return { success: true };
    } else {
      // Use local Redis in development
      const client = await initializeRedis();
      if (!client) {
        return { success: false, error: 'Redis not available' };
      }
      
      await client.lPush(key, value);
      return { success: true };
    }
  } catch (error) {
    console.error('Failed to push to list:', error);
    return { success: false, error: error.message };
  }
}

// Get range from list
export async function listRange(key, start = 0, stop = -1) {
  try {
    if (process.env.VERCEL === '1') {
      // Use Vercel KV in production
      const { kv } = await import('@vercel/kv');
      const values = await kv.lrange(key, start, stop);
      return { success: true, values };
    } else {
      // Use local Redis in development
      const client = await initializeRedis();
      if (!client) {
        return { success: false, error: 'Redis not available' };
      }
      
      const values = await client.lRange(key, start, stop);
      return { success: true, values };
    }
  } catch (error) {
    console.error('Failed to get list range:', error);
    return { success: false, error: error.message };
  }
} 