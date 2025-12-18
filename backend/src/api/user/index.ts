import express from 'express';
import { authenticateUser } from '../../middleware/auth';
import { PrismaClient } from '@prisma/client';
import prisma from '../../lib/prisma';

const router = express.Router();
const prismaClient = new PrismaClient();

// GET /api/user/profile - Get current user profile
router.get('/profile', authenticateUser, async (req, res) => {
  try {
    const userId = (req as any).userId;

    const user = await prismaClient.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        expertiseLevel: true,
        preferences: true,
        createdAt: true,
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/user/profile - Update user profile
router.put('/profile', authenticateUser, async (req, res) => {
  try {
    const userId = (req as any).userId;
    const { name, expertiseLevel, preferences } = req.body;

    const updatedUser = await prismaClient.user.update({
      where: { id: userId },
      data: {
        name: name || undefined,
        expertiseLevel: expertiseLevel || undefined,
        preferences: preferences || undefined,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        expertiseLevel: true,
        preferences: true,
        createdAt: true,
      }
    });

    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/user/dashboard - Get personalized dashboard data
router.get('/dashboard', authenticateUser, async (req, res) => {
  try {
    const userId = (req as any).userId;

    // Get user info
    const user = await prismaClient.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        role: true,
        expertiseLevel: true,
        preferences: true,
        createdAt: true,
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get user's textbook generation requests (including recent activity)
    const generationRequests = await prismaClient.textbookGenerationRequest.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 10, // Get last 10 requests
      select: {
        id: true,
        title: true,
        status: true,
        progress: true,
        createdAt: true,
        updatedAt: true,
        parameters: true,
      }
    });

    // Get user's completed textbooks
    const completedTextbooks = await prismaClient.textbook.findMany({
      where: {
        authorId: userId,
        status: 'COMPLETE',
      },
      orderBy: { createdAt: 'desc' },
      take: 5, // Get last 5 completed textbooks
      select: {
        id: true,
        title: true,
        subject: true,
        educationalLevel: true,
        createdAt: true,
        generatedAt: true,
      }
    });

    // Get in-progress textbooks
    const inProgressTextbooks = await prismaClient.textbook.findMany({
      where: {
        authorId: userId,
        status: { in: ['DRAFT', 'GENERATING'] }
      },
      orderBy: { updatedAt: 'desc' },
      take: 5,
      select: {
        id: true,
        title: true,
        status: true,
        progress: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    // Get statistics
    const stats = {
      totalTextbooksGenerated: await prismaClient.textbook.count({
        where: { authorId: userId }
      }),
      totalGenerationRequests: await prismaClient.textbookGenerationRequest.count({
        where: { userId }
      }),
      completedTextbooks: await prismaClient.textbook.count({
        where: {
          authorId: userId,
          status: 'COMPLETE'
        }
      }),
      inProgressTextbooks: await prismaClient.textbook.count({
        where: {
          authorId: userId,
          status: { in: ['DRAFT', 'GENERATING'] }
        }
      }),
    };

    // Get recent activity summary
    const recentActivity = {
      lastLogin: user.createdAt, // In a real implementation, this would be from a session log
      lastGeneration: generationRequests[0]?.createdAt || null,
      activeRequests: generationRequests.filter(req => req.status === 'PROCESSING').length,
    };

    res.json({
      user,
      stats,
      recentActivity,
      recentGenerationRequests: generationRequests,
      completedTextbooks,
      inProgressTextbooks,
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/user/dashboard/stats - Get just the statistics for the dashboard
router.get('/dashboard/stats', authenticateUser, async (req, res) => {
  try {
    const userId = (req as any).userId;

    // Get statistics
    const stats = {
      totalTextbooksGenerated: await prismaClient.textbook.count({
        where: { authorId: userId }
      }),
      totalGenerationRequests: await prismaClient.textbookGenerationRequest.count({
        where: { userId }
      }),
      completedTextbooks: await prismaClient.textbook.count({
        where: {
          authorId: userId,
          status: 'COMPLETE'
        }
      }),
      inProgressTextbooks: await prismaClient.textbook.count({
        where: {
          authorId: userId,
          status: { in: ['DRAFT', 'GENERATING'] }
        }
      }),
    };

    res.json(stats);
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/user/dashboard/recent - Get recent activity for the dashboard
router.get('/dashboard/recent', authenticateUser, async (req, res) => {
  try {
    const userId = (req as any).userId;

    // Get recent textbook generation requests
    const recentRequests = await prismaClient.textbookGenerationRequest.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: {
        id: true,
        inputPrompt: true,
        status: true,
        progress: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    // Get recently completed textbooks
    const recentTextbooks = await prismaClient.textbook.findMany({
      where: {
        authorId: userId,
        status: 'COMPLETE',
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: {
        id: true,
        title: true,
        subject: true,
        educationalLevel: true,
        createdAt: true,
        generatedAt: true,
      }
    });

    res.json({
      recentRequests,
      recentTextbooks
    });
  } catch (error) {
    console.error('Error fetching recent dashboard data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;