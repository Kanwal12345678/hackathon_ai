// TextbookGenerationRequest model interface based on Prisma schema
export interface TextbookGenerationRequest {
  id: string;
  inputPrompt: string;
  parameters?: any; // JSON object for generation parameters
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  progress: number; // 0-100
  resultTextbookId?: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Create a partial interface for creation (without auto-generated fields)
export interface CreateTextbookGenerationRequestInput {
  inputPrompt: string;
  parameters?: any;
  userId: string;
  status?: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  progress?: number;
  resultTextbookId?: string;
}

// Interface for updating textbook generation request
export interface UpdateTextbookGenerationRequestInput {
  status?: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  progress?: number;
  resultTextbookId?: string;
  parameters?: any;
}