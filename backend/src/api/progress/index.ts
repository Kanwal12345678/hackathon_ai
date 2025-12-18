import express from 'express';
import { authenticateUser } from '../../middleware/auth';
import { ProgressTrackerService } from '../../services/textbook-generation/progress-tracker';
import { WebSocketService } from '../../lib/websocket';
import { TextbookGenerationService } from '../../services/textbook-generation/textbook-generation-service';

const router = express.Router();
const textbookService = new TextbookGenerationService();
let webSocketService: WebSocketService | undefined;

// Initialize WebSocket service if available (it would be passed from the main app)
// For now, we'll create a dummy reference - in a real implementation this would be properly injected
// This is just to show how the progress tracker would work with WebSocket

// GET /api/progress/:requestId - Get current progress for a textbook generation request
router.get('/:requestId', authenticateUser, async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = (req as any).userId;

    // Verify that the user owns this request
    const request = await textbookService.getGenerationRequestById(requestId);
    if (!request || request.userId !== userId) {
      return res.status(404).json({ error: 'Generation request not found or access denied' });
    }

    // In a real implementation, we'd use the ProgressTrackerService to get detailed progress
    // For now, we'll return the progress from the database
    res.json({
      requestId: request.id,
      progress: request.progress,
      status: request.status,
      metadata: request.metadata,
      createdAt: request.createdAt,
      updatedAt: request.updatedAt
    });
  } catch (error) {
    console.error('Error fetching progress:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/progress/:requestId/details - Get detailed progress information
router.get('/:requestId/details', authenticateUser, async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = (req as any).userId;

    // Verify that the user owns this request
    const request = await textbookService.getGenerationRequestById(requestId);
    if (!request || request.userId !== userId) {
      return res.status(404).json({ error: 'Generation request not found or access denied' });
    }

    // Create a progress tracker service instance
    const progressTracker = new ProgressTrackerService(webSocketService);
    const details = await progressTracker.getProgressDetails(requestId);

    res.json(details);
  } catch (error) {
    console.error('Error fetching progress details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/progress/:requestId/join - Join a progress tracking room via WebSocket
router.post('/:requestId/join', authenticateUser, async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = (req as any).userId;

    // Verify that the user owns this request
    const request = await textbookService.getGenerationRequestById(requestId);
    if (!request || request.userId !== userId) {
      return res.status(404).json({ error: 'Generation request not found or access denied' });
    }

    // In a real implementation, we would register the user's socket to receive progress updates
    // For now, we'll just return a success response
    res.json({
      success: true,
      message: 'Successfully joined progress tracking room',
      requestId
    });
  } catch (error) {
    console.error('Error joining progress room:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;