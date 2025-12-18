# Deployment Guide for AI-Powered Textbook Generation Platform

## Overview
This document provides instructions for deploying the AI-Powered Textbook Generation Platform to production.

## Architecture
The application consists of:
- **Backend**: Express.js server with TypeScript, PostgreSQL database, and Better Auth
- **Frontend**: React application built with Vite
- **Database**: PostgreSQL with Prisma ORM
- **Vector Database**: Qdrant Cloud for RAG functionality
- **AI Integration**: OpenAI API for textbook generation

## Prerequisites

### Server Requirements
- Node.js 18+ (both for backend and frontend)
- PostgreSQL 12+
- PM2 process manager (optional but recommended)
- Git
- Nginx or Apache (for reverse proxy)

### Environment Variables
Ensure all required environment variables are set before deployment.

## Deployment Process

### 1. Environment Setup

#### Backend Environment Variables
Create a `.env` file in the `backend` directory with the following variables:

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/textbook_generation_prod"

# OpenAI Configuration
OPENAI_API_KEY="your_production_openai_api_key_here"

# Qdrant Vector Database Configuration
QDRANT_URL="your_production_qdrant_cloud_url_here"
QDRANT_API_KEY="your_production_qdrant_api_key_here"

# JWT Configuration
JWT_SECRET="your_production_jwt_secret_here"

# Application Configuration
PORT=8000
NODE_ENV=production

# CORS Configuration
FRONTEND_URL="https://yourdomain.com"

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100

# Better Auth Configuration
BETTER_AUTH_URL="https://yourdomain.com"
BETTER_AUTH_SECRET="your_production_auth_secret_here"
```

#### Frontend Environment Variables
Create a `.env` file in the `frontend` directory with the following variables:

```env
# Application Configuration
REACT_APP_API_BASE_URL=https://yourdomain.com/api
REACT_APP_OPENAI_API_KEY=your_production_openai_api_key_here

# Environment
NODE_ENV=production
```

### 2. Server Setup

#### Backend Setup
```bash
# Clone the repository
git clone https://github.com/yourusername/your-repo.git
cd your-repo

# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Build the application
npm run build

# Run database migrations
npx prisma migrate deploy

# Start the application with PM2 (recommended)
npm install -g pm2
pm2 start src/index.js --name "textbook-backend"
```

#### Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Build the application
npm run build

# The build files will be in the `dist` directory
# Serve these files with your web server (Nginx, Apache, etc.)
```

### 3. Using the Deployment Scripts

The repository includes automated deployment scripts:

#### Deploy Both Services
```bash
# Make the script executable
chmod +x deploy.sh

# Deploy both backend and frontend
./deploy.sh
```

#### Deploy Specific Service
```bash
# Deploy only backend
./deploy.sh backend

# Deploy only frontend
./deploy.sh frontend
```

### 4. Reverse Proxy Configuration

#### Nginx Configuration
Create an Nginx configuration file:

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    # SSL configuration
    ssl_certificate /path/to/your/certificate.crt;
    ssl_certificate_key /path/to/your/private.key;

    # Frontend (static files)
    location / {
        root /var/www/html;
        try_files $uri $uri/ /index.html;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Backend API proxy
    location /api {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # WebSocket for progress tracking
    location /socket.io {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 5. Process Management with PM2

Create a PM2 configuration file (`pm2.config.js`):

```javascript
module.exports = {
  apps: [
    {
      name: 'textbook-backend',
      script: './backend/src/index.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 8000,
      },
    },
  ],
};
```

Start the application with PM2:
```bash
pm2 start pm2.config.js
pm2 startup  # Enable PM2 startup script
pm2 save     # Save current processes
```

### 6. Database Migrations

Run database migrations after each deployment:
```bash
cd backend
npx prisma migrate deploy
```

### 7. Health Checks

The application provides a health check endpoint:
- `GET /health` - Returns application status

## Production Optimizations

### Backend Optimizations
- Enable gzip compression
- Implement proper error handling
- Set up logging
- Configure rate limiting
- Use production-ready database connection pooling

### Frontend Optimizations
- Code splitting
- Asset optimization
- Caching strategies
- Bundle size optimization

## Monitoring and Logging

### Backend Logging
The application uses Winston for logging. Configure log rotation and monitoring based on your needs.

### Error Tracking
Consider implementing error tracking services like Sentry for production monitoring.

## Rollback Procedure

To rollback to a previous version:
1. Stop the current application: `pm2 stop textbook-backend`
2. Checkout the previous commit: `git checkout <previous-commit-hash>`
3. Reinstall dependencies: `npm install`
4. Rebuild the application: `npm run build`
5. Run migrations if needed: `npx prisma migrate deploy`
6. Restart the application: `pm2 start textbook-backend`

## Security Considerations

- Use HTTPS in production
- Set proper CORS policies
- Implement rate limiting
- Use secure JWT tokens
- Validate all user inputs
- Keep dependencies up to date
- Regular security audits

## Troubleshooting

### Common Issues
1. **Database Connection**: Ensure PostgreSQL is running and accessible
2. **Environment Variables**: Verify all required environment variables are set
3. **Port Conflicts**: Ensure ports 80/443 and 8000 are available
4. **Build Errors**: Check that all dependencies are properly installed

### Logs
- Backend logs: Check PM2 logs with `pm2 logs textbook-backend`
- System logs: Check system logs in `/var/log/`

## Support

For deployment issues, contact the development team or refer to the project documentation.