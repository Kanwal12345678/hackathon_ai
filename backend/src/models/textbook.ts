// Textbook model interface based on Prisma schema
export interface Textbook {
  id: string;
  title: string;
  description?: string;
  subject: string;
  educationalLevel: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  language: string;
  status: 'DRAFT' | 'GENERATING' | 'COMPLETE' | 'FAILED';
  createdAt: Date;
  updatedAt: Date;
  generatedAt?: Date;
  authorId: string;
  metadata?: any; // JSON object for additional metadata
}

// Create a partial interface for creation (without auto-generated fields)
export interface CreateTextbookInput {
  title: string;
  description?: string;
  subject?: string;
  educationalLevel: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  language?: string;
  status?: 'DRAFT' | 'GENERATING' | 'COMPLETE' | 'FAILED';
  authorId: string;
  metadata?: any;
}

// Interface for updating textbook
export interface UpdateTextbookInput {
  title?: string;
  description?: string;
  subject?: string;
  educationalLevel?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  status?: 'DRAFT' | 'GENERATING' | 'COMPLETE' | 'FAILED';
  metadata?: any;
}