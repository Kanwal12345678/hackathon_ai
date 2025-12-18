import { PrismaClient, ContentValidation } from '@prisma/client';
import prisma from '../../lib/prisma';
import { CreateContentValidationInput } from '../../models/content-validation';
import { TextbookGenerationError } from '../../lib/errors';
import openai from '../../lib/openai';
import qdrantClient from '../../lib/qdrant';

/**
 * Service for handling content validation during textbook generation
 */
export class ContentValidationService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = prisma;
  }

  /**
   * Validate content for factual accuracy
   */
  async validateFactualContent(
    content: string,
    context?: string
  ): Promise<ContentValidation> {
    try {
      // Create the prompt for OpenAI to validate factual accuracy
      const prompt = `
        Please validate the following content for factual accuracy in the context of Physical AI & Humanoid Robotics:

        Content: ${content}

        Context: ${context || 'General Physical AI & Humanoid Robotics textbook'}

        Identify any factual errors, inconsistencies, or misleading information.
        Rate the accuracy on a scale of 0 to 1 (where 1 is completely accurate).
      `;

      // Call OpenAI API to validate content
      const completion = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an expert fact-checker specializing in Physical AI & Humanoid Robotics. Identify factual errors and rate accuracy.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 500,
        temperature: 0.2, // Lower temperature for more consistent fact-checking
      });

      const validationResponse = completion.choices[0].message.content || '';

      // Parse the response to determine validity and confidence
      const isValid = this.parseFactualValidity(validationResponse);
      const confidenceScore = this.parseConfidenceScore(validationResponse);
      const issues = this.parseIssues(validationResponse);

      // Create validation record in the database
      const validation = await this.prisma.contentValidation.create({
        data: {
          validationType: 'FACTUAL',
          validationSource: 'OpenAI',
          confidenceScore,
          isValid,
          issues: issues.length > 0 ? issues : null,
          validatedAt: new Date()
        }
      });

      return validation;
    } catch (error) {
      throw new TextbookGenerationError(`Failed to validate factual content: ${error}`);
    }
  }

  /**
   * Validate content for educational quality
   */
  async validateEducationalContent(
    content: string,
    educationalLevel: string,
    learningObjectives?: string[]
  ): Promise<ContentValidation> {
    try {
      const prompt = `
        Please validate the following content for educational quality in the context of Physical AI & Humanoid Robotics:

        Content: ${content}

        Educational Level: ${educationalLevel}
        Learning Objectives: ${learningObjectives ? learningObjectives.join(', ') : 'Not specified'}

        Evaluate if the content is appropriate for the specified educational level.
        Assess if it aligns with the learning objectives.
        Rate the educational quality on a scale of 0 to 1 (where 1 is excellent educational value).
      `;

      // Call OpenAI API to validate educational quality
      const completion = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4-turbo',
        messages: [
          {
            role: 'system',
            content: `You are an expert educator specializing in Physical AI & Humanoid Robotics. Evaluate content for educational appropriateness and quality for ${educationalLevel} level students.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 500,
        temperature: 0.3,
      });

      const validationResponse = completion.choices[0].message.content || '';

      // Parse the response to determine validity and confidence
      const isValid = this.parseEducationalValidity(validationResponse);
      const confidenceScore = this.parseConfidenceScore(validationResponse);
      const issues = this.parseIssues(validationResponse);

      // Create validation record in the database
      const validation = await this.prisma.contentValidation.create({
        data: {
          validationType: 'EDUCATIONAL',
          validationSource: 'OpenAI',
          confidenceScore,
          isValid,
          issues: issues.length > 0 ? issues : null,
          validatedAt: new Date()
        }
      });

      return validation;
    } catch (error) {
      throw new TextbookGenerationError(`Failed to validate educational content: ${error}`);
    }
  }

  /**
   * Validate content for ethical compliance
   */
  async validateEthicalContent(
    content: string
  ): Promise<ContentValidation> {
    try {
      const prompt = `
        Please validate the following content for ethical compliance in the context of Physical AI & Humanoid Robotics:

        Content: ${content}

        Check for any content that might be:
        - Potentially harmful
        - Biased or discriminatory
        - Violating ethical guidelines
        - Inappropriate for educational use

        Rate the ethical compliance on a scale of 0 to 1 (where 1 is fully compliant).
      `;

      // Call OpenAI API to validate ethical compliance
      const completion = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an expert in AI ethics and educational content review. Identify any ethical concerns in the provided content.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 500,
        temperature: 0.2,
      });

      const validationResponse = completion.choices[0].message.content || '';

      // Parse the response to determine validity and confidence
      const isValid = this.parseEthicalValidity(validationResponse);
      const confidenceScore = this.parseConfidenceScore(validationResponse);
      const issues = this.parseIssues(validationResponse);

      // Create validation record in the database
      const validation = await this.prisma.contentValidation.create({
        data: {
          validationType: 'ETHICAL',
          validationSource: 'OpenAI',
          confidenceScore,
          isValid,
          issues: issues.length > 0 ? issues : null,
          validatedAt: new Date()
        }
      });

      return validation;
    } catch (error) {
      throw new TextbookGenerationError(`Failed to validate ethical content: ${error}`);
    }
  }

  /**
   * Create a content validation record directly
   */
  async createContentValidation(data: CreateContentValidationInput): Promise<ContentValidation> {
    try {
      return await this.prisma.contentValidation.create({
        data: {
          textbookId: data.textbookId || null,
          chapterId: data.chapterId || null,
          sectionId: data.sectionId || null,
          validationType: data.validationType,
          validationSource: data.validationSource,
          confidenceScore: data.confidenceScore,
          isValid: data.isValid,
          issues: data.issues || null,
          validatedAt: data.validatedAt || new Date()
        }
      });
    } catch (error) {
      throw new TextbookGenerationError(`Failed to create content validation: ${error}`);
    }
  }

  /**
   * Parse factual validity from AI response
   */
  private parseFactualValidity(response: string): boolean {
    // Simple parsing - in a real implementation, this would be more sophisticated
    return !response.toLowerCase().includes('factual error') &&
           !response.toLowerCase().includes('inaccuracy') &&
           !response.toLowerCase().includes('incorrect');
  }

  /**
   * Parse educational validity from AI response
   */
  private parseEducationalValidity(response: string): boolean {
    // Simple parsing - in a real implementation, this would be more sophisticated
    return !response.toLowerCase().includes('not appropriate') &&
           !response.toLowerCase().includes('too difficult') &&
           !response.toLowerCase().includes('too basic');
  }

  /**
   * Parse ethical validity from AI response
   */
  private parseEthicalValidity(response: string): boolean {
    // Simple parsing - in a real implementation, this would be more sophisticated
    return !response.toLowerCase().includes('ethical concern') &&
           !response.toLowerCase().includes('potentially harmful') &&
           !response.toLowerCase().includes('inappropriate');
  }

  /**
   * Parse confidence score from AI response
   */
  private parseConfidenceScore(response: string): number {
    // Simple parsing - in a real implementation, this would be more sophisticated
    // Look for a rating or score in the response
    const match = response.match(/rating[:\s]+([0-1]\.?\d*)|score[:\s]+([0-1]\.?\d*)/i);
    if (match) {
      const score = parseFloat(match[1] || match[2] || '0.5');
      return Math.min(1, Math.max(0, score)); // Ensure it's between 0 and 1
    }
    return 0.75; // Default score if not found
  }

  /**
   * Parse issues from AI response
   */
  private parseIssues(response: string): string[] {
    // Simple parsing - in a real implementation, this would be more sophisticated
    const issues: string[] = [];

    // Look for issue descriptions in the response
    const issueRegex = /(issue|problem|concern)[:\s]+([^\n.]+)/gi;
    let match;
    while ((match = issueRegex.exec(response)) !== null) {
      issues.push(match[2].trim());
    }

    return issues;
  }
}