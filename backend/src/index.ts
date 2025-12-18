import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import http from 'http';

// Import configuration
import config from './config/app';

// Import API routes
import textbookRoutes from './api/textbook/generate';
import textbookUpdateRoutes from './api/textbook/update';
import validationRoutes from './api/validation/create';
import exportRoutes from './api/export/create';
import userRoutes from './api/user';
import progressRoutes from './api/progress';

// Import authentication
import auth from './lib/auth';

// Import WebSocket service
import { WebSocketService } from './lib/websocket';

// Import middleware and utilities
import { errorHandler, notFoundHandler } from './lib/errors';
import logger from './lib/logger';
import { initializeServices } from './lib/initializers';

const app = express();
const server = http.createServer(app);
const PORT = config.port;

// Initialize foundational services
initializeServices()
  .then(() => {
    logger.info('All foundational services initialized');
  })
  .catch((error) => {
    logger.error('Failed to initialize services:', error);
    process.exit(1);
  });

// Logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path} - ${req.ip}`);
  next();
});

// Production optimizations
if (process.env.NODE_ENV === 'production') {
  // Enable compression
  app.use(compression());

  // Trust proxy if behind a reverse proxy (like nginx)
  app.set('trust proxy', 1);

  // Add security headers
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'", "https://*.openai.com", "wss:"],
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
    referrerPolicy: {
      policy: 'no-referrer-when-downgrade',
    },
  }));
} else {
  // Development security
  app.use(helmet());
}

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? process.env.FRONTEND_URL
    : config.cors.origin,
  credentials: config.cors.credentials,
}));

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: process.env.NODE_ENV === 'production'
    ? (process.env.RATE_LIMIT_WINDOW_MS ? parseInt(process.env.RATE_LIMIT_WINDOW_MS) : config.rateLimit.windowMs)
    : 60 * 60 * 1000, // 1 hour in development
  max: process.env.NODE_ENV === 'production'
    ? (process.env.RATE_LIMIT_MAX ? parseInt(process.env.RATE_LIMIT_MAX) : config.rateLimit.max)
    : 1000, // Higher limit in development
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Body parsing middleware with production optimizations
app.use(express.json({
  limit: process.env.NODE_ENV === 'production' ? '10mb' : '50mb',
  verify: (req, res, buf, encoding) => {
    // Log large requests in production
    if (process.env.NODE_ENV === 'production' && buf.length > 5 * 1024 * 1024) { // 5MB
      logger.warn(`Large request received: ${buf.length} bytes from ${req.ip}`);
    }
  }
}));
app.use(express.urlencoded({
  extended: true,
  limit: process.env.NODE_ENV === 'production' ? '10mb' : '50mb'
}));

// Add response time tracking in production
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      if (duration > 1000) { // Log slow requests (>1s)
        logger.warn(`${req.method} ${req.path} took ${duration}ms`);
      }
    });
    next();
  });
}

// API routes
app.use('/api/auth', auth.handler); // Better Auth endpoints
app.use('/api/user', userRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/textbook', textbookRoutes);
app.use('/api/textbook', textbookUpdateRoutes);
app.use('/api/validation', validationRoutes);
app.use('/api/export', exportRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Catch 404 and forward to error handler
app.use(notFoundHandler);

// Error handling middleware
app.use(errorHandler);

// Initialize WebSocket service after all routes are set up
const webSocketService = new WebSocketService(server);

// Make the WebSocket service available globally or through dependency injection
// For simplicity in this implementation, we'll attach it to the app object
(app as any).webSocketService = webSocketService;

server.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
  logger.info(`Health check available at http://localhost:${PORT}/health`);
  logger.info(`WebSocket server initialized for real-time progress tracking`);
});

export default app;