// Section model interface based on Prisma schema
export interface Section {
  id: string;
  title: string;
  order: number;
  content: string;
  chapterId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Create a partial interface for creation (without auto-generated fields)
export interface CreateSectionInput {
  title: string;
  order: number;
  content: string;
  chapterId: string;
}

// Interface for updating section
export interface UpdateSectionInput {
  title?: string;
  order?: number;
  content?: string;
}

// Interface for section with nested exercises
export interface SectionWithExercises extends Section {
  exercises: Exercise[];
}