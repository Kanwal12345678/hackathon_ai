import axios, { AxiosResponse } from 'axios';

// Base API URL from environment
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api';

// Define TypeScript interfaces for request/response types
export interface TextbookGenerationRequest {
  title: string;
  description: string;
  subject: string;
  educationalLevel: 'beginner' | 'intermediate' | 'advanced';
  language: 'en' | 'ur';
  topicOutline: string;
  learningObjectives: string[];
  chapterCount: number;
  includeExercises: boolean;
}

export interface TextbookGenerationResponse {
  id: string;
  title: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  createdAt: string;
  estimatedCompletionTime: string;
}

export interface TextbookDetailsResponse {
  id: string;
  title: string;
  status: 'draft' | 'generating' | 'complete' | 'failed';
  progress: number;
  content?: {
    chapters: Array<{
      id: string;
      title: string;
      order: number;
      content: string;
      learningObjectives: string[];
      exercises: Array<{
        id: string;
        question: string;
        options: string[];
        correctAnswer: string;
        explanation: string;
        difficulty: 'easy' | 'medium' | 'hard';
      }>;
      summary: string;
    }>;
  };
  createdAt: string;
  updatedAt: string;
  generatedAt?: string;
}

/**
 * Service for interacting with the textbook generation API
 */
class TextbookApiService {
  private apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000, // 30 seconds timeout
    headers: {
      'Content-Type': 'application/json',
    },
  });

  /**
   * Initialize the API service with authentication token if available
   */
  initialize() {
    const token = localStorage.getItem('authToken');
    if (token) {
      this.apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }

  /**
   * Set auth token after login
   */
  setAuthToken(token: string | null) {
    if (token) {
      this.apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('authToken', token);
    } else {
      delete this.apiClient.defaults.headers.common['Authorization'];
      localStorage.removeItem('authToken');
    }
  }

  /**
   * Generate a new textbook based on the provided parameters
   */
  async generateTextbook(request: TextbookGenerationRequest): Promise<AxiosResponse<TextbookGenerationResponse>> {
    try {
      const response = await this.apiClient.post<TextbookGenerationResponse>(
        '/textbook/generate',
        request
      );
      return response;
    } catch (error) {
      console.error('Error generating textbook:', error);
      throw error;
    }
  }

  /**
   * Get the status and details of a textbook generation request
   */
  async getTextbookDetails(textbookId: string): Promise<AxiosResponse<TextbookDetailsResponse>> {
    try {
      const response = await this.apiClient.get<TextbookDetailsResponse>(
        `/textbook/${textbookId}`
      );
      return response;
    } catch (error) {
      console.error('Error getting textbook details:', error);
      throw error;
    }
  }

  /**
   * Update an existing textbook
   */
  async updateTextbook(textbookId: string, updateData: Partial<TextbookGenerationRequest>): Promise<AxiosResponse<any>> {
    try {
      const response = await this.apiClient.put(
        `/textbook/${textbookId}`,
        updateData
      );
      return response;
    } catch (error) {
      console.error('Error updating textbook:', error);
      throw error;
    }
  }

  /**
   * Export a textbook in the specified format
   */
  async exportTextbook(textbookId: string, format: 'pdf' | 'epub' | 'html', includeExercises: boolean = true, includeSolutions: boolean = false): Promise<AxiosResponse<any>> {
    try {
      const response = await this.apiClient.post(
        `/export/${textbookId}`,
        {
          format,
          includeExercises,
          includeSolutions
        }
      );
      return response;
    } catch (error) {
      console.error('Error exporting textbook:', error);
      throw error;
    }
  }

  /**
   * Validate content using the validation API
   */
  async validateContent(textbookId?: string, chapterId?: string, content?: string, validationType: 'factual' | 'educational' | 'ethical' = 'factual'): Promise<AxiosResponse<any>> {
    try {
      const response = await this.apiClient.post(
        '/validation',
        {
          textbookId,
          chapterId,
          content,
          validationType
        }
      );
      return response;
    } catch (error) {
      console.error('Error validating content:', error);
      throw error;
    }
  }
}

// Create and export a singleton instance
export const textbookApiService = new TextbookApiService();

// Initialize the service when the module is loaded
textbookApiService.initialize();

export default textbookApiService;