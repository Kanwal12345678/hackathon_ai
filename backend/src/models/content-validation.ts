// ContentValidation model interface based on Prisma schema
export interface ContentValidation {
  id: string;
  textbookId?: string;
  chapterId?: string;
  sectionId?: string;
  validationType: 'FACTUAL' | 'EDUCATIONAL' | 'ETHICAL';
  validationSource: string;
  confidenceScore: number; // 0-1
  isValid: boolean;
  issues?: any; // JSON object for validation issues
  validatedAt?: Date;
  createdAt: Date;
}

// Create a partial interface for creation (without auto-generated fields)
export interface CreateContentValidationInput {
  textbookId?: string;
  chapterId?: string;
  sectionId?: string;
  validationType: 'FACTUAL' | 'EDUCATIONAL' | 'ETHICAL';
  validationSource: string;
  confidenceScore: number; // 0-1
  isValid: boolean;
  issues?: any;
  validatedAt?: Date;
}

// Interface for updating content validation
export interface UpdateContentValidationInput {
  confidenceScore?: number;
  isValid?: boolean;
  issues?: any;
  validatedAt?: Date;
}