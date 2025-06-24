#!/bin/bash

echo "🚀 Setting up Redis for Thiasil development..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop and try again."
    exit 1
fi

# Start Redis container
echo "📦 Starting Redis container..."
docker-compose up -d

# Wait for Redis to be ready
echo "⏳ Waiting for Redis to be ready..."
sleep 3

# Check if Redis is running
if docker-compose ps | grep -q "Up"; then
    echo "✅ Redis is running successfully!"
    
    # Test Redis connection
    if docker exec thiasil-redis redis-cli ping | grep -q "PONG"; then
        echo "✅ Redis connection test successful!"
    else
        echo "❌ Redis connection test failed!"
        exit 1
    fi
else
    echo "❌ Failed to start Redis container!"
    docker-compose logs redis
    exit 1
fi

echo ""
echo "🎉 Redis setup complete!"
echo ""
echo "Next steps:"
echo "1. Update your .env.local file with: REDIS_URL=\"redis://localhost:6379\""
echo "2. Start your Next.js development server: npm run dev"
echo "3. Test the admin panel backup functionality"
echo ""
echo "Useful commands:"
echo "  - View Redis logs: docker-compose logs -f redis"
echo "  - Stop Redis: docker-compose down"
echo "  - Access Redis CLI: docker exec -it thiasil-redis redis-cli" 