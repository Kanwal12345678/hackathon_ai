// Custom error classes for the textbook generation system

export class TextbookGenerationError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    // Set the prototype explicitly to maintain instanceof behavior
    Object.setPrototypeOf(this, TextbookGenerationError.prototype);
  }
}

export class ValidationError extends TextbookGenerationError {
  constructor(message: string) {
    super(message, 400);
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

export class NotFoundError extends TextbookGenerationError {
  constructor(message: string = 'Resource not found') {
    super(message, 404);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

export class AuthenticationError extends TextbookGenerationError {
  constructor(message: string = 'Authentication required') {
    super(message, 401);
    Object.setPrototypeOf(this, AuthenticationError.prototype);
  }
}

export class AuthorizationError extends TextbookGenerationError {
  constructor(message: string = 'Insufficient permissions') {
    super(message, 403);
    Object.setPrototypeOf(this, AuthorizationError.prototype);
  }
}

export class RateLimitError extends TextbookGenerationError {
  constructor(message: string = 'Rate limit exceeded') {
    super(message, 429);
    Object.setPrototypeOf(this, RateLimitError.prototype);
  }
}

import logger from './logger';

// Error handling middleware
export const errorHandler = (
  err: Error,
  req: any,
  res: any,
  next: any
): void => {
  // Log the error with additional context
  logger.error({
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  });

  // Set default error response
  let statusCode = 500;
  let message = 'Internal server error';

  // Check if it's a custom error
  if (err instanceof TextbookGenerationError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err.name === 'ValidationError' || err.name === 'JoiValidationError') {
    statusCode = 400;
    message = err.message || 'Validation error';
  } else if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID format';
  } else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  } else if (err.code === 'LIMIT_FILE_SIZE' || err.code === 'LIMIT_UNEXPECTED_FILE') {
    statusCode = 413;
    message = 'File too large or invalid file type';
  }

  // Don't expose sensitive information in production
  const errorResponse = {
    error: {
      message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
      timestamp: new Date().toISOString(),
    },
  };

  // Send response
  res.status(statusCode).json(errorResponse);
};

// Not found middleware
export const notFoundHandler = (req: any, res: any, next: any): void => {
  const error = new NotFoundError(`Route ${req.originalUrl} not found`);
  res.status(error.statusCode).json({
    error: {
      message: error.message,
    },
  });
};