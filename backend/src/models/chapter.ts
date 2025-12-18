// Chapter model interface based on Prisma schema
export interface Chapter {
  id: string;
  title: string;
  order: number;
  content: string;
  learningObjectives: string[];
  summary?: string;
  textbookId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Create a partial interface for creation (without auto-generated fields)
export interface CreateChapterInput {
  title: string;
  order: number;
  content: string;
  learningObjectives: string[];
  summary?: string;
  textbookId: string;
}

// Interface for updating chapter
export interface UpdateChapterInput {
  title?: string;
  order?: number;
  content?: string;
  learningObjectives?: string[];
  summary?: string;
}