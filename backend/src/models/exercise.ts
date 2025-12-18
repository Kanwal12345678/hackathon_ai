// Exercise model interface based on Prisma schema
export interface Exercise {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  sectionId?: string;
  chapterId?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Create a partial interface for creation (without auto-generated fields)
export interface CreateExerciseInput {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  sectionId?: string;
  chapterId?: string;
}

// Interface for updating exercise
export interface UpdateExerciseInput {
  question?: string;
  options?: string[];
  correctAnswer?: string;
  explanation?: string;
  difficulty?: 'EASY' | 'MEDIUM' | 'HARD';
}