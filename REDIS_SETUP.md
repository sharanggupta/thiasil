# Redis Setup for Thiasil

This project uses Redis for backup functionality in both development and production environments.

## Local Development Setup

### 1. Start Redis with Docker Compose

```bash
# Start Redis container
docker-compose up -d

# Check if Redis is running
docker-compose ps

# View Redis logs
docker-compose logs redis
```

### 2. Environment Configuration

For local development, update your `.env.local` file:

```bash
# Local Development - Redis URL for Docker Compose
REDIS_URL="redis://localhost:6379"
```

### 3. Test Redis Connection

```bash
# Test Redis connection
redis-cli ping
# Should return: PONG

# Or test from within the container
docker exec thiasil-redis redis-cli ping
```

## Production Setup

In production (Vercel), the system automatically uses Vercel KV (Redis) when `process.env.VERCEL === '1'`.

## Backup System

The backup system now uses Redis everywhere:

- **Development**: Local Redis via Docker Compose
- **Production**: Vercel KV (Redis)

### Backup Operations

- `createBackup(data, operation)` - Create a new backup
- `listBackups()` - List all available backups
- `restoreBackup(backupId)` - Restore a specific backup
- `deleteBackup(backupId)` - Delete a backup

## Docker Commands

```bash
# Start Redis
docker-compose up -d

# Stop Redis
docker-compose down

# Stop and remove volumes
docker-compose down -v

# View logs
docker-compose logs -f redis

# Access Redis CLI
docker exec -it thiasil-redis redis-cli
```

## Troubleshooting

### Redis Connection Issues

1. Check if Redis container is running:
   ```bash
   docker-compose ps
   ```

2. Check Redis logs:
   ```bash
   docker-compose logs redis
   ```

3. Test Redis connection:
   ```bash
   redis-cli ping
   ```

### Port Conflicts

If port 6379 is already in use, update the `docker-compose.yml` file:

```yaml
ports:
  - "6380:6379"  # Use port 6380 instead
```

Then update your `REDIS_URL` to `redis://localhost:6380`.

## Benefits of This Setup

1. **Consistency**: Same Redis interface in development and production
2. **Isolation**: Local Redis doesn't interfere with other projects
3. **Persistence**: Redis data persists between container restarts
4. **Scalability**: Easy to switch between local and production Redis
5. **No Filesystem Dependencies**: Eliminates read-only filesystem issues in production 