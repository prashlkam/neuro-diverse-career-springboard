#!/bin/bash
# Startup script for Azure App Service Linux

cd /home/site/wwwroot

# Build the app if dist folder doesn't exist
if [ ! -d "dist" ]; then
    echo "Building application..."
    npm run build
fi

# Get the port from environment variable (Azure sets this) or default to 8080
PORT="${PORT:-8080}"
echo "Starting application on port $PORT..."

# Start the preview server
npm run preview -- --port $PORT --host 0.0.0.0
