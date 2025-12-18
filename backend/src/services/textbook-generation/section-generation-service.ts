import { PrismaClient, Section } from '@prisma/client';
import prisma from '../../lib/prisma';
import { CreateSectionInput, UpdateSectionInput } from '../../models/section';
import { TextbookGenerationError } from '../../lib/errors';
import openai from '../../lib/openai';

/**
 * Service for handling section generation within chapters
 */
export class SectionGenerationService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = prisma;
  }

  /**
   * Generate a section based on topic and chapter context
   */
  async generateSection(
    title: string,
    topic: string,
    chapterContext: string,
    sectionOrder: number,
    educationalLevel: string,
    language: string = 'en'
  ): Promise<Section> {
    try {
      // Create the prompt for OpenAI to generate the section
      const prompt = this.buildSectionPrompt(
        title,
        topic,
        chapterContext,
        educationalLevel,
        language
      );

      // Call OpenAI API to generate section content
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
        max_tokens: 1000,
        temperature: 0.7,
      });

      const sectionContent = completion.choices[0].message.content || '';

      // Create the section in the database
      const section = await this.prisma.section.create({
        data: {
          title,
          order: sectionOrder,
          content: sectionContent,
          chapterId: 'temp-placeholder' // Will be updated when chapter is created
        }
      });

      return section;
    } catch (error) {
      throw new TextbookGenerationError(`Failed to generate section: ${error}`);
    }
  }

  /**
   * Create a section directly (without AI generation)
   */
  async createSection(data: CreateSectionInput): Promise<Section> {
    try {
      return await this.prisma.section.create({
        data: {
          title: data.title,
          order: data.order,
          content: data.content,
          chapterId: data.chapterId
        }
      });
    } catch (error) {
      throw new TextbookGenerationError(`Failed to create section: ${error}`);
    }
  }

  /**
   * Get a section by ID
   */
  async getSectionById(id: string): Promise<Section | null> {
    try {
      return await this.prisma.section.findUnique({
        where: { id }
      });
    } catch (error) {
      throw new TextbookGenerationError(`Failed to get section: ${error}`);
    }
  }

  /**
   * Update a section
   */
  async updateSection(id: string, data: UpdateSectionInput): Promise<Section> {
    try {
      return await this.prisma.section.update({
        where: { id },
        data
      });
    } catch (error) {
      throw new TextbookGenerationError(`Failed to update section: ${error}`);
    }
  }

  /**
   * Delete a section
   */
  async deleteSection(id: string): Promise<Section> {
    try {
      return await this.prisma.section.delete({
        where: { id }
      });
    } catch (error) {
      throw new TextbookGenerationError(`Failed to delete section: ${error}`);
    }
  }

  /**
   * Build the prompt for OpenAI to generate a section
   */
  private buildSectionPrompt(
    title: string,
    topic: string,
    chapterContext: string,
    educationalLevel: string,
    language: string
  ): string {
    const levelDescription = this.getLevelDescription(educationalLevel);

    return `
      Generate a textbook section titled "${title}" within the context of a chapter about "${chapterContext}".

      Topic for this section: ${topic}

      Educational Level: ${levelDescription}
      Language: ${language}

      Requirements:
      - Make the content relevant to the chapter context
      - Structure with appropriate subheadings if needed
      - Include detailed explanations appropriate for the educational level
      - Include examples or illustrations where appropriate
      - Format as markdown if possible
      - Aim for approximately 400-600 words
    `;
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