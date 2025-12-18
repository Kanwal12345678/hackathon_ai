import express from 'express';
import Joi from 'joi';
import { TextbookGenerationService } from '../../services/textbook-generation/textbook-generation-service';
import { authenticateUser } from '../../middleware/auth';
import { TextbookGenerationError } from '../../lib/errors';

const router = express.Router();
const textbookService = new TextbookGenerationService();

// Request body validation schema for updating textbook
const updateTextbookSchema = Joi.object({
  title: Joi.string().min(3).max(200),
  description: Joi.string().allow('').max(1000),
  content: Joi.object({
    chapters: Joi.array().items(
      Joi.object({
        id: Joi.string().uuid(),
        title: Joi.string().min(1).max(100),
        content: Joi.string(),
        exercises: Joi.array().items(
          Joi.object({
            id: Joi.string().uuid(),
            question: Joi.string(),
            options: Joi.array().items(Joi.string()),
            correctAnswer: Joi.string(),
            explanation: Joi.string(),
            difficulty: Joi.string().valid('easy', 'medium', 'hard')
          })
        )
      })
    )
  })
});

// PUT /api/textbook/:id
router.put('/:id', authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;

    // Validate request body
    const { error, value } = updateTextbookSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Invalid request parameters',
        details: error.details
      });
    }

    const { title, description, content } = value;

    // In a real implementation, we would update the textbook content
    // For now, we'll update the generation request with new parameters
    const updatedRequest = await textbookService.updateGenerationRequest(id, {
      parameters: {
        ...req.body,
        updatedAt: new Date()
      }
    });

    res.status(200).json({
      id: updatedRequest.id,
      title: title || updatedRequest.parameters?.title,
      status: updatedRequest.status,
      updatedAt: updatedRequest.updatedAt.toISOString()
    });
  } catch (err) {
    if (err instanceof TextbookGenerationError) {
      res.status(400).json({ error: err.message });
    } else {
      console.error('Error updating textbook:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

export default router;