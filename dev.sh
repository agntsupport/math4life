#!/bin/bash

echo "🔧 Starting Math4Life in development mode..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+."
    exit 1
fi

# Check Node version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from .env.example..."
    cp .env.example .env
    echo "✅ .env file created. Please review and update the values if needed."
fi

# Function to run in new terminal (macOS)
run_in_terminal() {
    if [[ "$OSTYPE" == "darwin"* ]]; then
        osascript -e "tell app \"Terminal\" to do script \"cd $(pwd) && $1\""
    else
        echo "Please run this command in a new terminal: $1"
    fi
}

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
cd ..

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
cd ..

# Start PostgreSQL and Redis with Docker
echo "🐳 Starting database services with Docker..."
docker-compose up -d postgres redis

# Wait for services
echo "⏳ Waiting for database services..."
sleep 5

# Start frontend in new terminal
echo "🎨 Starting frontend development server..."
run_in_terminal "cd frontend && npm run dev"

# Start backend in new terminal
echo "🔧 Starting backend development server..."
run_in_terminal "cd backend && npm run dev"

echo ""
echo "✅ Development servers starting..."
echo ""
echo "🌐 Services will be available at:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:4000"
echo "   PostgreSQL: localhost:5432"
echo "   Redis: localhost:6379"
echo ""
echo "📚 Frontend and backend are running in separate terminals"
echo "🛑 To stop database services: docker-compose down"