#!/bin/bash

# Deployment script for backend

set -e  # Exit on any error

echo "Starting backend deployment..."

# Pull latest code
echo "Pulling latest code..."
git pull origin main

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the application
echo "Building application..."
npm run build

# Run database migrations
echo "Running database migrations..."
npx prisma migrate deploy

# Restart the application
echo "Restarting application..."
if [ -f "pm2.config.js" ]; then
    pm2 reload pm2.config.js
else
    pm2 start src/index.js --name "textbook-backend" --watch
fi

echo "Backend deployment completed successfully!"