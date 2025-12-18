import { Request, Response, NextFunction } from 'express';
import { AuthenticationError } from '../lib/errors';
import auth from '../lib/auth';

// Authentication middleware using Better Auth
export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get session from Better Auth
    const session = await auth.getSession({
      headers: req.headers,
    });

    if (!session) {
      throw new AuthenticationError('Authentication required');
    }

    // Attach user info to request
    (req as any).user = session.user;
    (req as any).userId = session.user.id;

    next();
  } catch (error) {
    next(error);
  }
};

// Authorization middleware to check user roles
export const authorizeUser = (requiredRole: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;

    if (!user) {
      throw new AuthenticationError('User not authenticated');
    }

    // Check if user has the required role
    // Note: The role field may need to be added to the user model if not already present
    const userRole = user.role || 'LEARNER'; // Default to LEARNER if no role specified

    if (userRole !== requiredRole && requiredRole !== 'LEARNER') {
      // For this system, we allow educators and admins to access most features
      if (userRole !== 'EDUCATOR' && userRole !== 'ADMIN') {
        throw new AuthenticationError('Insufficient permissions');
      }
    }

    next();
  };
};