# AI-Powered Textbook Generation Platform

This project implements an AI-powered textbook generation system for Physical AI & Humanoid Robotics education, as part of the AI-Native Learning Platform initiative.

## Project Structure

```
├── backend/                 # Backend API server
│   ├── src/
│   │   ├── models/         # Data models
│   │   ├── services/       # Business logic
│   │   │   ├── textbook-generation/
│   │   │   ├── content-validation/
│   │   │   └── export-formats/
│   │   ├── api/            # API route handlers
│   │   │   ├── textbook/
│   │   │   ├── validation/
│   │   │   └── export/
│   │   └── lib/            # Utility functions
│   ├── tests/              # Test files
│   └── package.json        # Backend dependencies
├── frontend/               # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service clients
│   │   └── App.tsx         # Main application component
│   ├── tests/              # Frontend tests
│   └── package.json        # Frontend dependencies
├── specs/                  # Feature specifications and plans
└── README.md              # This file
```

## Features

- **Textbook Generation**: AI-powered generation of comprehensive textbooks based on topic outlines
- **Content Customization**: Customizable format, style, and pedagogical approach
- **Multi-format Export**: Export textbooks in PDF, ePub, and HTML formats
- **Content Validation**: Factual accuracy and ethical compliance checking
- **Multilingual Support**: Support for English and Urdu content generation

## Getting Started

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy the environment file and configure your settings:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy the environment file and configure your settings:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. Start the frontend development server:
   ```bash
   npm run dev
   ```

## Tech Stack

- **Backend**: Node.js, TypeScript, Express, Prisma, PostgreSQL, OpenAI API
- **Frontend**: React, TypeScript, Vite, React Router
- **Database**: PostgreSQL (with Prisma ORM)
- **Vector Database**: Qdrant Cloud
- **Authentication**: Better Auth
- **Testing**: Jest, React Testing Library

## API Endpoints

- `POST /api/textbook/generate` - Initiate textbook generation
- `GET /api/textbook/:id` - Retrieve textbook details
- `PUT /api/textbook/:id` - Update textbook content
- `POST /api/textbook/:id/export` - Export textbook in specified format
- `GET /api/export/:requestId` - Check export status
- `POST /api/validation` - Validate content accuracy

## Architecture

The system follows a service-oriented architecture with distinct services for:
- Textbook generation and content creation
- Content validation and fact-checking
- Export format conversion
- User authentication and preferences

## Development

For development, each feature is organized by user stories with independent testability:
- User Story 1: Core textbook generation
- User Story 2: Customization features
- User Story 3: Export and sharing capabilities
- Content validation and ethical compliance

## License

MIT License - see the LICENSE file for details.