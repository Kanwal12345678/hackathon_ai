import prisma from './prisma';
import logger from './logger';

/**
 * Initialize all foundational services
 */
export const initializeServices = async (): Promise<void> => {
  try {
    // Test database connection
    await prisma.$connect();
    logger.info('Database connected successfully');

    // Additional initialization steps can be added here
    logger.info('All foundational services initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize services:', error);
    throw error;
  }
};

/**
 * Cleanup function to close connections properly
 */
export const cleanupServices = async (): Promise<void> => {
  try {
    await prisma.$disconnect();
    logger.info('Database disconnected successfully');
  } catch (error) {
    logger.error('Error during cleanup:', error);
    throw error;
  }
};