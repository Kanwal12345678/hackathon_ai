#!/bin/bash

# Main deployment script for AI-Powered Textbook Generation Platform

set -e  # Exit on any error

echo "Starting full application deployment..."

# Function to deploy backend
deploy_backend() {
    echo "Deploying backend..."
    cd backend

    # Pull latest code
    git pull origin main

    # Install dependencies
    npm install

    # Build the application
    npm run build

    # Run database migrations
    npx prisma migrate deploy

    # Restart the application
    if [ -f "../pm2.config.js" ]; then
        pm2 reload pm2.config.js --only textbook-backend
    else
        pm2 start src/index.js --name "textbook-backend" --watch
    fi

    cd ..
    echo "Backend deployment completed!"
}

# Function to deploy frontend
deploy_frontend() {
    echo "Deploying frontend..."
    cd frontend

    # Pull latest code
    git pull origin main

    # Install dependencies
    npm install

    # Build the application
    npm run build

    cd ..
    echo "Frontend deployment completed!"
}

# Main deployment process
if [ "$1" = "backend" ]; then
    deploy_backend
elif [ "$1" = "frontend" ]; then
    deploy_frontend
else
    deploy_backend
    deploy_frontend
    echo "Full application deployment completed successfully!"
fi