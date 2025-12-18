// User model interface based on Prisma schema
export interface User {
  id: string;
  email: string;
  name?: string;
  role: 'LEARNER' | 'EDUCATOR' | 'ADMIN';
  expertiseLevel: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  preferences?: any; // JSON object for user preferences
  createdAt: Date;
  updatedAt: Date;
}

// Create a partial interface for creation (without auto-generated fields)
export interface CreateUserInput {
  email: string;
  name?: string;
  role?: 'LEARNER' | 'EDUCATOR' | 'ADMIN';
  expertiseLevel?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  preferences?: any;
}

// Interface for updating user
export interface UpdateUserInput {
  name?: string;
  expertiseLevel?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  preferences?: any;
}