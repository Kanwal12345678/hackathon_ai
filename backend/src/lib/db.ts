import prisma from './prisma';
import logger from './logger';

/**
 * Database utilities for the textbook generation system
 */

// Test database connection
export const testConnection = async (): Promise<boolean> => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    logger.error('Database connection test failed:', error);
    return false;
  }
};

// Transaction utility function
export const runTransaction = async <T>(fn: () => Promise<T>): Promise<T> => {
  return prisma.$transaction(async (tx) => {
    // tx is the transaction client
    return fn();
  });
};

// Disconnect database
export const disconnect = async (): Promise<void> => {
  await prisma.$disconnect();
};