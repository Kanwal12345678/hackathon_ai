import { TextbookGenerationError } from '../../lib/errors';
import openai from '../../lib/openai';

/**
 * Service for handling multilingual content generation and translation
 */
export class MultilingualService {
  /**
   * Translate content to the specified language
   */
  async translateContent(content: string, targetLanguage: string, sourceLanguage: string = 'en'): Promise<string> {
    try {
      // Only process if target language is different from source
      if (targetLanguage === sourceLanguage) {
        return content;
      }

      // Create a prompt for translation
      const prompt = this.buildTranslationPrompt(content, targetLanguage, sourceLanguage);

      // Use OpenAI to perform the translation
      const completion = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4-turbo',
        messages: [
          {
            role: 'system',
            content: `You are a professional translator specializing in educational content for Physical AI & Humanoid Robotics. Translate the provided content accurately while maintaining the educational context and technical terminology. Preserve the meaning and structure of the original content.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.3, // Lower temperature for more consistent translations
      });

      const translatedContent = completion.choices[0].message.content || content;

      return translatedContent;
    } catch (error) {
      throw new TextbookGenerationError(`Failed to translate content: ${error}`);
    }
  }

  /**
   * Generate content directly in the specified language
   */
  async generateContentInLanguage(
    topic: string,
    learningObjectives: string[],
    educationalLevel: string,
    targetLanguage: string
  ): Promise<string> {
    try {
      // Create a prompt that includes language requirements
      const prompt = this.buildLanguageSpecificPrompt(
        topic,
        learningObjectives,
        educationalLevel,
        targetLanguage
      );

      // Use OpenAI to generate content in the specified language
      const completion = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4-turbo',
        messages: [
          {
            role: 'system',
            content: `You are an expert textbook writer specializing in Physical AI & Humanoid Robotics. Generate educational content appropriate for ${educationalLevel} level students in ${this.getLanguageName(targetLanguage)}. Ensure the content is culturally appropriate and technically accurate.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.7,
      });

      const content = completion.choices[0].message.content || '';

      return content;
    } catch (error) {
      throw new TextbookGenerationError(`Failed to generate content in target language: ${error}`);
    }
  }

  /**
   * Adapt educational terminology for the target language
   */
  async adaptTerminology(content: string, targetLanguage: string): Promise<string> {
    try {
      // For now, we'll use the translation function which will handle terminology
      // In a more sophisticated implementation, we might have a terminology database
      return await this.translateContent(content, targetLanguage);
    } catch (error) {
      throw new TextbookGenerationError(`Failed to adapt terminology: ${error}`);
    }
  }

  /**
   * Build a translation prompt
   */
  private buildTranslationPrompt(content: string, targetLanguage: string, sourceLanguage: string): string {
    const targetLangName = this.getLanguageName(targetLanguage);
    const sourceLangName = this.getLanguageName(sourceLanguage);

    return `
      Translate the following educational content from ${sourceLangName} to ${targetLangName}:

      Content to translate:
      "${content}"

      Translation requirements:
      - Maintain technical accuracy for Physical AI & Humanoid Robotics concepts
      - Preserve the educational context and learning objectives
      - Use appropriate terminology in the target language
      - Maintain the structure and formatting as much as possible
      - Ensure cultural appropriateness for the target language audience
    `;
  }

  /**
   * Build a language-specific content generation prompt
   */
  private buildLanguageSpecificPrompt(
    topic: string,
    learningObjectives: string[],
    educationalLevel: string,
    targetLanguage: string
  ): string {
    const levelDescription = this.getLevelDescription(educationalLevel);
    const targetLangName = this.getLanguageName(targetLanguage);

    return `
      Generate educational content in ${targetLangName} about: ${topic}

      Learning Objectives:
      ${learningObjectives.map((obj, index) => `${index + 1}. ${obj}`).join('\n')}

      Educational Level: ${levelDescription}

      Content requirements:
      - Use appropriate terminology in ${targetLangName}
      - Ensure cultural appropriateness for ${targetLangName}-speaking audience
      - Include examples relevant to the target culture where appropriate
      - Maintain technical accuracy for Physical AI & Humanoid Robotics concepts
      - Structure the content with headings and subheadings
      - Aim for approximately 800-1200 words
    `;
  }

  /**
   * Get the full name of a language from its code
   */
  private getLanguageName(languageCode: string): string {
    const languageMap: { [key: string]: string } = {
      'en': 'English',
      'ur': 'Urdu',
      'es': 'Spanish',
      'fr': 'French',
      'de': 'German',
      'ja': 'Japanese',
      'zh': 'Chinese',
      'ar': 'Arabic',
      'hi': 'Hindi',
      'pt': 'Portuguese',
      'ru': 'Russian'
    };

    return languageMap[languageCode] || languageCode;
  }

  /**
   * Get description for educational level in the target language
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

  /**
   * Check if a language is supported
   */
  isLanguageSupported(languageCode: string): boolean {
    const supportedLanguages = ['en', 'ur']; // Currently supporting English and Urdu
    return supportedLanguages.includes(languageCode.toLowerCase());
  }

  /**
   * Get supported languages
   */
  getSupportedLanguages(): string[] {
    return ['en', 'ur']; // Currently supporting English and Urdu
  }
}