import { PrismaClient, Exercise } from '@prisma/client';
import prisma from '../../lib/prisma';
import { CreateExerciseInput, UpdateExerciseInput } from '../../models/exercise';
import { TextbookGenerationError } from '../../lib/errors';
import openai from '../../lib/openai';

/**
 * Service for handling exercise generation
 */
export class ExerciseGenerationService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = prisma;
  }

  /**
   * Generate an exercise based on chapter/section content and learning objectives
   */
  async generateExercise(
    contentContext: string,
    learningObjectives: string[],
    difficulty: 'easy' | 'medium' | 'hard' = 'medium',
    exerciseType: 'multiple-choice' | 'short-answer' | 'true-false' = 'multiple-choice'
  ): Promise<Exercise> {
    try {
      // Create the prompt for OpenAI to generate the exercise
      const prompt = this.buildExercisePrompt(
        contentContext,
        learningObjectives,
        difficulty,
        exerciseType
      );

      // Call OpenAI API to generate exercise content
      const completion = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an expert educator creating exercises for a Physical AI & Humanoid Robotics textbook. Create exercises that test understanding of the provided content.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 500,
        temperature: 0.7,
      });

      const exerciseText = completion.choices[0].message.content || '';

      // Parse the exercise from the AI response
      const exerciseData = this.parseExercise(exerciseText, exerciseType, difficulty);

      // Create the exercise in the database
      const exercise = await this.prisma.exercise.create({
        data: {
          question: exerciseData.question,
          options: exerciseData.options,
          correctAnswer: exerciseData.correctAnswer,
          explanation: exerciseData.explanation,
          difficulty: exerciseData.difficulty,
          sectionId: exerciseData.sectionId || null,
          chapterId: exerciseData.chapterId || null
        }
      });

      return exercise;
    } catch (error) {
      throw new TextbookGenerationError(`Failed to generate exercise: ${error}`);
    }
  }

  /**
   * Create an exercise directly (without AI generation)
   */
  async createExercise(data: CreateExerciseInput): Promise<Exercise> {
    try {
      return await this.prisma.exercise.create({
        data: {
          question: data.question,
          options: data.options,
          correctAnswer: data.correctAnswer,
          explanation: data.explanation || '',
          difficulty: data.difficulty,
          sectionId: data.sectionId || null,
          chapterId: data.chapterId || null
        }
      });
    } catch (error) {
      throw new TextbookGenerationError(`Failed to create exercise: ${error}`);
    }
  }

  /**
   * Get an exercise by ID
   */
  async getExerciseById(id: string): Promise<Exercise | null> {
    try {
      return await this.prisma.exercise.findUnique({
        where: { id }
      });
    } catch (error) {
      throw new TextbookGenerationError(`Failed to get exercise: ${error}`);
    }
  }

  /**
   * Update an exercise
   */
  async updateExercise(id: string, data: UpdateExerciseInput): Promise<Exercise> {
    try {
      return await this.prisma.exercise.update({
        where: { id },
        data
      });
    } catch (error) {
      throw new TextbookGenerationError(`Failed to update exercise: ${error}`);
    }
  }

  /**
   * Delete an exercise
   */
  async deleteExercise(id: string): Promise<Exercise> {
    try {
      return await this.prisma.exercise.delete({
        where: { id }
      });
    } catch (error) {
      throw new TextbookGenerationError(`Failed to delete exercise: ${error}`);
    }
  }

  /**
   * Build the prompt for OpenAI to generate an exercise
   */
  private buildExercisePrompt(
    contentContext: string,
    learningObjectives: string[],
    difficulty: 'easy' | 'medium' | 'hard',
    exerciseType: 'multiple-choice' | 'short-answer' | 'true-false'
  ): string {
    const difficultyDescription = this.getDifficultyDescription(difficulty);
    const typeInstructions = this.getExerciseTypeInstructions(exerciseType);

    return `
      Create an exercise based on the following content:

      Content Context: ${contentContext}

      Learning Objectives:
      ${learningObjectives.map((obj, index) => `${index + 1}. ${obj}`).join('\n')}

      Difficulty Level: ${difficultyDescription}
      Exercise Type: ${typeInstructions}

      Requirements:
      - The exercise should test understanding of the content
      - Align with one or more of the learning objectives
      - For multiple-choice: provide 4 options with one correct answer
      - Include an explanation for the correct answer
      - Make the exercise clear and unambiguous
    `;
  }

  /**
   * Parse the exercise from AI response
   */
  private parseExercise(
    exerciseText: string,
    exerciseType: 'multiple-choice' | 'short-answer' | 'true-false',
    difficulty: 'easy' | 'medium' | 'hard'
  ): {
    question: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
    difficulty: 'easy' | 'medium' | 'hard';
    sectionId?: string;
    chapterId?: string;
  } {
    // This is a simplified parsing approach
    // In a real implementation, you might want more sophisticated parsing

    // For now, we'll create a basic structure
    // In a real system, the AI would return structured data
    return {
      question: exerciseText.substring(0, exerciseText.indexOf('\n') > 0 ? exerciseText.indexOf('\n') : 100),
      options: exerciseType === 'multiple-choice'
        ? ['Option A', 'Option B', 'Option C', 'Option D']
        : [],
      correctAnswer: exerciseType === 'multiple-choice' ? 'Option A' : 'Answer',
      explanation: 'Explanation for the answer',
      difficulty: difficulty
    };
  }

  /**
   * Get description for difficulty level
   */
  private getDifficultyDescription(difficulty: 'easy' | 'medium' | 'hard'): string {
    switch (difficulty) {
      case 'easy':
        return 'Easy - The exercise should test basic understanding and recall of fundamental concepts.';
      case 'medium':
        return 'Medium - The exercise should require application of concepts and some analysis.';
      case 'hard':
        return 'Hard - The exercise should require synthesis of multiple concepts and critical thinking.';
      default:
        return 'Medium - The exercise should require application of concepts and some analysis.';
    }
  }

  /**
   * Get instructions for exercise type
   */
  private getExerciseTypeInstructions(exerciseType: 'multiple-choice' | 'short-answer' | 'true-false'): string {
    switch (exerciseType) {
      case 'multiple-choice':
        return 'Multiple choice - Provide a question with 4 options and indicate the correct answer.';
      case 'short-answer':
        return 'Short answer - Provide a question that requires a brief written response.';
      case 'true-false':
        return 'True/False - Provide a statement that is either true or false and indicate the correct answer.';
      default:
        return 'Multiple choice - Provide a question with 4 options and indicate the correct answer.';
    }
  }
}