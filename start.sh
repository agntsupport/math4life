#!/bin/bash

echo "🚀 Starting Math4Life..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if docker-compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ docker-compose is not installed. Please install docker-compose first."
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from .env.example..."
    cp .env.example .env
    echo "✅ .env file created. Please review and update the values if needed."
fi

# Build and start containers
echo "🐳 Building Docker containers..."
docker-compose build

echo "🔧 Starting services..."
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 5

# Check if services are running
if docker-compose ps | grep -q "Up"; then
    echo "✅ Math4Life is running!"
    echo ""
    echo "🌐 Access the application at:"
    echo "   Frontend: http://localhost:3000"
    echo "   API: http://localhost:4000"
    echo "   Proxy: http://localhost:80"
    echo ""
    echo "📚 Check logs with: docker-compose logs -f"
    echo "🛑 Stop with: docker-compose down"
else
    echo "❌ Failed to start services. Check logs with: docker-compose logs"
    exit 1
fi