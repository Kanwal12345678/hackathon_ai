import { PrismaClient, Chapter } from '@prisma/client';
import prisma from '../../lib/prisma';
import { CreateChapterInput, UpdateChapterInput } from '../../models/chapter';
import { TextbookGenerationError } from '../../lib/errors';
import openai from '../../lib/openai';

/**
 * Service for handling chapter generation
 */
export class ChapterGenerationService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = prisma;
  }

  /**
   * Generate a chapter based on topic outline and learning objectives
   */
  async generateChapter(
    title: string,
    topicOutline: string,
    learningObjectives: string[],
    chapterOrder: number,
    educationalLevel: string,
    language: string = 'en'
  ): Promise<Chapter> {
    try {
      // Create the prompt for OpenAI to generate the chapter
      const prompt = this.buildChapterPrompt(
        title,
        topicOutline,
        learningObjectives,
        educationalLevel,
        language
      );

      // Call OpenAI API to generate chapter content
      const completion = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4-turbo',
        messages: [
          {
            role: 'system',
            content: `You are an expert textbook writer specializing in Physical AI & Humanoid Robotics. Generate educational content appropriate for ${educationalLevel} level students.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.7,
      });

      const chapterContent = completion.choices[0].message.content || '';

      // Create the chapter in the database
      const chapter = await this.prisma.chapter.create({
        data: {
          title,
          order: chapterOrder,
          content: chapterContent,
          learningObjectives,
          summary: this.extractSummary(chapterContent),
          textbookId: 'temp-placeholder' // Will be updated when textbook is created
        }
      });

      return chapter;
    } catch (error) {
      throw new TextbookGenerationError(`Failed to generate chapter: ${error}`);
    }
  }

  /**
   * Create a chapter directly (without AI generation)
   */
  async createChapter(data: CreateChapterInput): Promise<Chapter> {
    try {
      return await this.prisma.chapter.create({
        data: {
          title: data.title,
          order: data.order,
          content: data.content,
          learningObjectives: data.learningObjectives,
          summary: data.summary || this.extractSummary(data.content),
          textbookId: data.textbookId
        }
      });
    } catch (error) {
      throw new TextbookGenerationError(`Failed to create chapter: ${error}`);
    }
  }

  /**
   * Get a chapter by ID
   */
  async getChapterById(id: string): Promise<Chapter | null> {
    try {
      return await this.prisma.chapter.findUnique({
        where: { id }
      });
    } catch (error) {
      throw new TextbookGenerationError(`Failed to get chapter: ${error}`);
    }
  }

  /**
   * Update a chapter
   */
  async updateChapter(id: string, data: UpdateChapterInput): Promise<Chapter> {
    try {
      return await this.prisma.chapter.update({
        where: { id },
        data: {
          ...data,
          summary: data.summary || (data.content ? this.extractSummary(data.content) : undefined)
        }
      });
    } catch (error) {
      throw new TextbookGenerationError(`Failed to update chapter: ${error}`);
    }
  }

  /**
   * Delete a chapter
   */
  async deleteChapter(id: string): Promise<Chapter> {
    try {
      return await this.prisma.chapter.delete({
        where: { id }
      });
    } catch (error) {
      throw new TextbookGenerationError(`Failed to delete chapter: ${error}`);
    }
  }

  /**
   * Build the prompt for OpenAI to generate a chapter
   */
  private buildChapterPrompt(
    title: string,
    topicOutline: string,
    learningObjectives: string[],
    educationalLevel: string,
    language: string
  ): string {
    const levelDescription = this.getLevelDescription(educationalLevel);

    return `
      Generate a comprehensive textbook chapter titled "${title}".

      Topic Outline: ${topicOutline}

      Learning Objectives:
      ${learningObjectives.map((obj, index) => `${index + 1}. ${obj}`).join('\n')}

      Educational Level: ${levelDescription}
      Language: ${language}

      Requirements:
      - Structure the content with appropriate headings and subheadings
      - Include detailed explanations appropriate for the educational level
      - Make the content engaging and educational
      - Include examples where appropriate
      - Format as markdown if possible
      - Aim for approximately 800-1200 words
    `;
  }

  /**
   * Extract a summary from chapter content
   */
  private extractSummary(content: string): string {
    // Simple approach: take the first 200 characters and add ellipsis
    // In a real implementation, this could use NLP to generate a proper summary
    return content.substring(0, 200) + (content.length > 200 ? '...' : '');
  }

  /**
   * Get description for educational level
   */
  private getLevelDescription(level: string): string {
    switch (level.toLowerCase()) {
      case 'beginner':
        return 'Beginner level - Content should be accessible to newcomers with minimal prior knowledge. Use simple language and provide foundational concepts.';
      case 'intermediate':
        return 'Intermediate level - Content should build on basic concepts with more depth. Assume some prior knowledge but explain complex ideas clearly.';
      case 'advanced':
        return 'Advanced level - Content should be comprehensive and detailed. Assume solid foundational knowledge and include complex concepts and applications.';
      default:
        return 'Intermediate level - Content should build on basic concepts with more depth. Assume some prior knowledge but explain complex ideas clearly.';
    }
  }
}