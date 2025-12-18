import express from 'express';
import Joi from 'joi';
import { TextbookGenerationService } from '../../services/textbook-generation/textbook-generation-service';
import { ChapterGenerationService } from '../../services/textbook-generation/chapter-generation-service';
import { SectionGenerationService } from '../../services/textbook-generation/section-generation-service';
import { ExerciseGenerationService } from '../../services/textbook-generation/exercise-generation-service';
import { ContentValidationService } from '../../services/textbook-generation/validation-service';
import { ProgressTrackerService } from '../../services/textbook-generation/progress-tracker';
import { authenticateUser } from '../../middleware/auth';
import { TextbookGenerationError } from '../../lib/errors';
import { WebSocketService } from '../../lib/websocket';

const router = express.Router();
const textbookService = new TextbookGenerationService();
const chapterService = new ChapterGenerationService();
const sectionService = new SectionGenerationService();
const exerciseService = new ExerciseGenerationService();
const validationService = new ContentValidationService();

// Request body validation schema
const generateTextbookSchema = Joi.object({
  title: Joi.string().min(3).max(200).required(),
  description: Joi.string().allow('').max(1000),
  subject: Joi.string().default('Physical AI & Humanoid Robotics'),
  educationalLevel: Joi.string().valid('beginner', 'intermediate', 'advanced').required(),
  language: Joi.string().default('en').valid('en', 'ur'),
  topicOutline: Joi.string().min(10).required(),
  learningObjectives: Joi.array().items(Joi.string()).min(1).required(),
  chapterCount: Joi.number().integer().min(1).max(50).default(10),
  includeExercises: Joi.boolean().default(true)
});

// POST /api/textbook/generate
router.post('/generate', authenticateUser, async (req, res) => {
  try {
    // Validate request body
    const { error, value } = generateTextbookSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Invalid request parameters',
        details: error.details
      });
    }

    const {
      title,
      description,
      subject,
      educationalLevel,
      language,
      topicOutline,
      learningObjectives,
      chapterCount,
      includeExercises
    } = value;

    // Create a textbook generation request in the database
    const userId = (req as any).userId; // From authentication middleware
    const generationRequest = await textbookService.createGenerationRequest({
      inputPrompt: topicOutline,
      parameters: {
        title,
        description,
        subject,
        educationalLevel,
        language,
        chapterCount,
        includeExercises,
        learningObjectives
      },
      userId,
      status: 'PROCESSING',
      progress: 0
    });

    // For now, return the generation request info
    // In a real implementation, we would start an async process to generate the textbook
    res.status(201).json({
      id: generationRequest.id,
      title,
      status: generationRequest.status,
      progress: generationRequest.progress,
      createdAt: generationRequest.createdAt.toISOString(),
      estimatedCompletionTime: new Date(Date.now() + 10 * 60000).toISOString() // 10 minutes from now
    });
  } catch (err) {
    if (err instanceof TextbookGenerationError) {
      res.status(400).json({ error: err.message });
    } else {
      console.error('Error in textbook generation:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

// GET /api/textbook/:id
router.get('/:id', authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID format
    if (!id) {
      return res.status(400).json({ error: 'Textbook ID is required' });
    }

    // Get the generation request
    const generationRequest = await textbookService.getGenerationRequestById(id);

    if (!generationRequest) {
      return res.status(404).json({ error: 'Textbook generation request not found' });
    }

    // Return the status and any available content
    res.status(200).json({
      id: generationRequest.id,
      title: (generationRequest.parameters as any)?.title || 'Untitled Textbook',
      status: generationRequest.status,
      progress: generationRequest.progress,
      content: generationRequest.resultTextbookId ? {
        // In a real implementation, we would fetch the actual textbook content
        chapters: [] // Placeholder - would be populated with actual content
      } : null,
      createdAt: generationRequest.createdAt.toISOString(),
      updatedAt: generationRequest.updatedAt.toISOString()
    });
  } catch (err) {
    if (err instanceof TextbookGenerationError) {
      res.status(400).json({ error: err.message });
    } else {
      console.error('Error retrieving textbook:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

export default router;