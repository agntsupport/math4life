#!/bin/bash

echo "🛑 Stopping Math4Life..."

# Check if docker-compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ docker-compose is not installed."
    exit 1
fi

# Stop containers
docker-compose down

echo "✅ Math4Life has been stopped."
echo ""
echo "💡 To remove volumes (database data), run: docker-compose down -v"
echo "🚀 To start again, run: ./start.sh"