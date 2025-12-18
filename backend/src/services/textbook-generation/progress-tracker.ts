import { TextbookGenerationService } from './textbook-generation-service';
import { TextbookGenerationError } from '../../lib/errors';
import { WebSocketService, ProgressUpdate } from '../../lib/websocket';

/**
 * Service for tracking textbook generation progress
 */
export class ProgressTrackerService {
  private textbookService: TextbookGenerationService;
  private webSocketService?: WebSocketService;

  constructor(webSocketService?: WebSocketService) {
    this.textbookService = new TextbookGenerationService();
    this.webSocketService = webSocketService;
  }

  /**
   * Update progress for a textbook generation request
   */
  async updateProgress(
    requestId: string,
    progress: number,
    status?: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED',
    message?: string,
    metadata?: Record<string, any>
  ): Promise<void> {
    try {
      // Validate progress is between 0 and 100
      if (progress < 0 || progress > 100) {
        throw new TextbookGenerationError('Progress must be between 0 and 100');
      }

      // Update the generation request with new progress
      await this.textbookService.updateProgress(requestId, progress, status);

      // Emit real-time progress update via WebSocket if available
      if (this.webSocketService) {
        const update: ProgressUpdate = {
          requestId,
          progress,
          status: status || 'PROCESSING',
          message,
          metadata
        };

        this.webSocketService.emitProgressUpdate(requestId, update);
      }
    } catch (error) {
      throw new TextbookGenerationError(`Failed to update progress: ${error}`);
    }
  }

  /**
   * Calculate progress based on completed chapters
   */
  calculateChapterProgress(completedChapters: number, totalChapters: number): number {
    if (totalChapters <= 0) {
      return 0;
    }

    const progress = (completedChapters / totalChapters) * 100;
    return Math.min(100, Math.round(progress)); // Ensure it doesn't exceed 100
  }

  /**
   * Calculate progress based on content generation steps
   */
  calculateContentProgress(
    currentStep: number,
    totalSteps: number,
    chapterProgress: number = 0
  ): number {
    // Base progress from steps completed
    const stepProgress = (currentStep / totalSteps) * 100;

    // Weighted average: 70% for overall steps, 30% for chapter generation
    const weightedProgress = (stepProgress * 0.7) + (chapterProgress * 0.3);

    return Math.min(100, Math.round(weightedProgress));
  }

  /**
   * Get progress details for a generation request
   */
  async getProgressDetails(requestId: string): Promise<{
    id: string;
    status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
    progress: number;
    estimatedCompletionTime: Date;
    details: {
      totalChapters: number;
      completedChapters: number;
      currentChapter?: string;
      currentStep: string;
    };
  }> {
    try {
      const request = await this.textbookService.getGenerationRequestById(requestId);

      if (!request) {
        throw new TextbookGenerationError('Generation request not found');
      }

      // Calculate estimated completion time based on current progress
      // For simplicity, assume linear progress over 10 minutes total
      const totalTimeMs = 10 * 60 * 1000; // 10 minutes in milliseconds
      const elapsed = Date.now() - request.createdAt.getTime();
      const estimatedRemaining = (elapsed / request.progress) * (100 - request.progress);

      return {
        id: request.id,
        status: request.status as 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED',
        progress: request.progress,
        estimatedCompletionTime: new Date(Date.now() + estimatedRemaining),
        details: {
          totalChapters: request.parameters?.chapterCount || 10,
          completedChapters: Math.floor((request.progress / 100) * (request.parameters?.chapterCount || 10)),
          currentStep: this.getCurrentStep(request.progress),
          currentChapter: `Chapter ${Math.floor((request.progress / 100) * (request.parameters?.chapterCount || 10)) + 1}`
        }
      };
    } catch (error) {
      throw new TextbookGenerationError(`Failed to get progress details: ${error}`);
    }
  }

  /**
   * Determine the current step based on progress
   */
  private getCurrentStep(progress: number): string {
    if (progress === 0) {
      return 'Initializing generation';
    } else if (progress < 10) {
      return 'Processing input parameters';
    } else if (progress < 30) {
      return 'Generating chapter outlines';
    } else if (progress < 60) {
      return 'Creating chapter content';
    } else if (progress < 80) {
      return 'Adding exercises and summaries';
    } else if (progress < 95) {
      return 'Validating content';
    } else if (progress < 100) {
      return 'Finalizing textbook';
    } else {
      return 'Completed';
    }
  }

  /**
   * Update progress with detailed step information
   */
  async updateProgressWithStep(
    requestId: string,
    step: 'input-processing' | 'outline-generation' | 'content-generation' | 'exercise-addition' | 'validation' | 'finalization',
    stepProgress: number
  ): Promise<void> {
    try {
      let baseProgress = 0;
      let message = '';

      // Map steps to progress ranges and messages
      switch (step) {
        case 'input-processing':
          baseProgress = 0;
          message = 'Processing input parameters';
          break;
        case 'outline-generation':
          baseProgress = 10;
          message = 'Generating chapter outlines';
          break;
        case 'content-generation':
          baseProgress = 30;
          message = 'Creating chapter content';
          break;
        case 'exercise-addition':
          baseProgress = 60;
          message = 'Adding exercises and summaries';
          break;
        case 'validation':
          baseProgress = 80;
          message = 'Validating content';
          break;
        case 'finalization':
          baseProgress = 95;
          message = 'Finalizing textbook';
          break;
      }

      // Calculate actual progress within the range
      const progressIncrement = (stepProgress / 100) * (this.getNextStepBase(step) - baseProgress);
      const actualProgress = baseProgress + progressIncrement;

      await this.updateProgress(
        requestId,
        Math.min(100, Math.round(actualProgress)),
        undefined,
        message,
        { currentStep: step, stepProgress }
      );
    } catch (error) {
      throw new TextbookGenerationError(`Failed to update progress with step: ${error}`);
    }
  }

  /**
   * Get the next step's base progress
   */
  private getNextStepBase(step: string): number {
    switch (step) {
      case 'input-processing':
        return 10;
      case 'outline-generation':
        return 30;
      case 'content-generation':
        return 60;
      case 'exercise-addition':
        return 80;
      case 'validation':
        return 95;
      case 'finalization':
        return 100;
      default:
        return 100;
    }
  }
}