import Joi from 'joi';
import { ValidationError } from '../../lib/errors';

/**
 * Service for validating textbook generation inputs
 */
export class TextbookInputValidationService {
  /**
   * Validate topic outline
   */
  static validateTopicOutline(outline: string): void {
    if (!outline || outline.trim().length < 10) {
      throw new ValidationError('Topic outline must be at least 10 characters long');
    }

    if (outline.length > 5000) {
      throw new ValidationError('Topic outline exceeds maximum length of 5000 characters');
    }
  }

  /**
   * Validate learning objectives
   */
  static validateLearningObjectives(objectives: string[]): void {
    if (!objectives || objectives.length === 0) {
      throw new ValidationError('At least one learning objective is required');
    }

    if (objectives.length > 20) {
      throw new ValidationError('Maximum 20 learning objectives allowed');
    }

    for (const objective of objectives) {
      if (!objective || objective.trim().length === 0) {
        throw new ValidationError('Learning objectives cannot be empty');
      }

      if (objective.length > 200) {
        throw new ValidationError('Each learning objective must be less than 200 characters');
      }
    }
  }

  /**
   * Validate educational level
   */
  static validateEducationalLevel(level: string): void {
    const validLevels = ['beginner', 'intermediate', 'advanced'];
    if (!validLevels.includes(level.toLowerCase())) {
      throw new ValidationError(`Educational level must be one of: ${validLevels.join(', ')}`);
    }
  }

  /**
   * Validate language
   */
  static validateLanguage(language: string): void {
    const validLanguages = ['en', 'ur']; // English and Urdu as per requirements
    if (!validLanguages.includes(language)) {
      throw new ValidationError(`Language must be one of: ${validLanguages.join(', ')}`);
    }
  }

  /**
   * Validate chapter count
   */
  static validateChapterCount(count: number): void {
    if (count < 1 || count > 50) {
      throw new ValidationError('Chapter count must be between 1 and 50');
    }
  }

  /**
   * Validate the complete textbook generation request
   */
  static validateTextbookGenerationRequest(request: {
    title: string;
    description?: string;
    subject: string;
    educationalLevel: string;
    language: string;
    topicOutline: string;
    learningObjectives: string[];
    chapterCount: number;
    includeExercises: boolean;
  }): void {
    // Validate title
    if (!request.title || request.title.trim().length < 3) {
      throw new ValidationError('Title must be at least 3 characters long');
    }

    if (request.title.length > 200) {
      throw new ValidationError('Title must be less than 200 characters');
    }

    // Validate description if provided
    if (request.description && request.description.length > 1000) {
      throw new ValidationError('Description must be less than 1000 characters');
    }

    // Validate subject
    if (!request.subject || request.subject.trim().length === 0) {
      throw new ValidationError('Subject is required');
    }

    // Validate other fields using specific methods
    this.validateEducationalLevel(request.educationalLevel);
    this.validateLanguage(request.language);
    this.validateTopicOutline(request.topicOutline);
    this.validateLearningObjectives(request.learningObjectives);
    this.validateChapterCount(request.chapterCount);

    // Validate includeExercises is boolean
    if (typeof request.includeExercises !== 'boolean') {
      throw new ValidationError('includeExercises must be a boolean value');
    }
  }

  /**
   * Validate textbook update request
   */
  static validateTextbookUpdateRequest(request: {
    title?: string;
    description?: string;
    content?: any;
  }): void {
    // Validate title if provided
    if (request.title && (request.title.trim().length < 3 || request.title.length > 200)) {
      throw new ValidationError('Title must be between 3 and 200 characters');
    }

    // Validate description if provided
    if (request.description && request.description.length > 1000) {
      throw new ValidationError('Description must be less than 1000 characters');
    }

    // Validate content structure if provided
    if (request.content) {
      if (request.content.chapters && !Array.isArray(request.content.chapters)) {
        throw new ValidationError('Content chapters must be an array');
      }
    }
  }
}