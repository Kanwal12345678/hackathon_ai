#!/bin/bash

# Deployment script for frontend

set -e  # Exit on any error

echo "Starting frontend deployment..."

# Pull latest code
echo "Pulling latest code..."
git pull origin main

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the application
echo "Building application..."
npm run build

# Copy build files to production directory
echo "Copying build files to production..."
rm -rf /var/www/html/*
cp -r dist/* /var/www/html/

echo "Frontend deployment completed successfully!"