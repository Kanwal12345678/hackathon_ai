import express from 'express';
import { Server } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { authenticateUser } from '../middleware/auth';

export interface ProgressUpdate {
  requestId: string;
  progress: number;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  message?: string;
  metadata?: Record<string, any>;
}

export class WebSocketService {
  private io: SocketIOServer;

  constructor(server: Server) {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        methods: ['GET', 'POST']
      }
    });

    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    this.io.use((socket, next) => {
      // Add authentication middleware if needed
      // For now, we'll allow unauthenticated connections for progress updates
      // In a real implementation, you might want to validate the user has access to the specific request
      next();
    });

    this.io.on('connection', (socket: Socket) => {
      console.log('User connected:', socket.id);

      // Join a specific room for progress updates
      socket.on('join-progress-room', (requestId: string) => {
        socket.join(requestId);
        console.log(`Socket ${socket.id} joined progress room: ${requestId}`);
      });

      // Leave a progress room
      socket.on('leave-progress-room', (requestId: string) => {
        socket.leave(requestId);
        console.log(`Socket ${socket.id} left progress room: ${requestId}`);
      });

      // Join user-specific room for personalized updates
      socket.on('join-user-room', (userId: string) => {
        socket.join(`user-${userId}`);
        console.log(`Socket ${socket.id} joined user room: ${userId}`);
      });

      socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
      });
    });
  }

  /**
   * Emit progress update to a specific room
   */
  emitProgressUpdate(requestId: string, update: ProgressUpdate): void {
    this.io.to(requestId).emit('progress-update', update);
  }

  /**
   * Emit progress update to a user's specific room
   */
  emitProgressToUser(userId: string, update: ProgressUpdate): void {
    this.io.to(`user-${userId}`).emit('user-progress-update', update);
  }

  /**
   * Get the socket.io instance
   */
  getSocketServer(): SocketIOServer {
    return this.io;
  }
}