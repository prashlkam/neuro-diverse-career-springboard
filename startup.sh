#!/bin/bash
# Startup script for Azure App Service Linux

cd /home/site/wwwroot

# Install production dependencies if node_modules is missing
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install --production
fi

# Build the app if dist folder doesn't exist
if [ ! -d "dist" ]; then
    echo "Building application..."
    npm run build
fi

# Get the port from environment variable (Azure sets this) or default to 8080
export PORT="${PORT:-8080}"
echo "Starting application on port $PORT..."

# Start the production server
npm run start
