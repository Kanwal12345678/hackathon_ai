import { PrismaClient, TextbookGenerationRequest } from '@prisma/client';
import prisma from '../../lib/prisma';
import { CreateTextbookGenerationRequestInput, UpdateTextbookGenerationRequestInput } from '../../models/textbook-generation-request';
import { TextbookGenerationError } from '../../lib/errors';

/**
 * Service for handling textbook generation requests
 */
export class TextbookGenerationService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = prisma;
  }

  /**
   * Create a new textbook generation request
   */
  async createGenerationRequest(data: CreateTextbookGenerationRequestInput): Promise<TextbookGenerationRequest> {
    try {
      return await this.prisma.textbookGenerationRequest.create({
        data: {
          inputPrompt: data.inputPrompt,
          parameters: data.parameters,
          status: data.status || 'PENDING',
          progress: data.progress || 0,
          resultTextbookId: data.resultTextbookId || null,
          userId: data.userId,
        }
      });
    } catch (error) {
      throw new TextbookGenerationError(`Failed to create textbook generation request: ${error}`);
    }
  }

  /**
   * Get a textbook generation request by ID
   */
  async getGenerationRequestById(id: string): Promise<TextbookGenerationRequest | null> {
    try {
      return await this.prisma.textbookGenerationRequest.findUnique({
        where: { id }
      });
    } catch (error) {
      throw new TextbookGenerationError(`Failed to get textbook generation request: ${error}`);
    }
  }

  /**
   * Update a textbook generation request
   */
  async updateGenerationRequest(id: string, data: UpdateTextbookGenerationRequestInput): Promise<TextbookGenerationRequest> {
    try {
      return await this.prisma.textbookGenerationRequest.update({
        where: { id },
        data: {
          ...data,
          updatedAt: new Date()
        }
      });
    } catch (error) {
      throw new TextbookGenerationError(`Failed to update textbook generation request: ${error}`);
    }
  }

  /**
   * Get generation requests for a specific user
   */
  async getGenerationRequestsByUser(userId: string): Promise<TextbookGenerationRequest[]> {
    try {
      return await this.prisma.textbookGenerationRequest.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' }
      });
    } catch (error) {
      throw new TextbookGenerationError(`Failed to get textbook generation requests for user: ${error}`);
    }
  }

  /**
   * Update progress of a generation request
   */
  async updateProgress(id: string, progress: number, status?: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'): Promise<TextbookGenerationRequest> {
    try {
      const updateData: any = { progress };
      if (status) {
        updateData.status = status;
      }
      if (status === 'COMPLETED' || status === 'FAILED') {
        updateData.updatedAt = new Date();
      }

      return await this.prisma.textbookGenerationRequest.update({
        where: { id },
        data: updateData
      });
    } catch (error) {
      throw new TextbookGenerationError(`Failed to update progress for generation request: ${error}`);
    }
  }
}