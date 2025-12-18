import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Application configuration
const config = {
  port: parseInt(process.env.PORT || '8000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  logLevel: process.env.LOG_LEVEL || 'info',

  // Database
  database: {
    url: process.env.DATABASE_URL || '',
  },

  // OpenAI
  openai: {
    apiKey: process.env.OPENAI_API_KEY || '',
    model: process.env.OPENAI_MODEL || 'gpt-4-turbo',
  },

  // Qdrant
  qdrant: {
    url: process.env.QDRANT_URL || '',
    apiKey: process.env.QDRANT_API_KEY || '',
  },

  // JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'fallback-secret-for-development',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },

  // Rate limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  },

  // CORS
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    credentials: process.env.CORS_CREDENTIALS === 'true',
  },

  // Textbook generation
  textbookGeneration: {
    defaultChapterCount: parseInt(process.env.DEFAULT_CHAPTER_COUNT || '10', 10),
    maxChapterCount: parseInt(process.env.MAX_CHAPTER_COUNT || '50', 10),
    maxTopicOutlineLength: parseInt(process.env.MAX_TOPIC_OUTLINE_LENGTH || '5000', 10),
    generationTimeoutMs: parseInt(process.env.GENERATION_TIMEOUT_MS || '600000', 10), // 10 minutes
  }
};

// Validate required environment variables
const requiredEnvVars = [
  'DATABASE_URL',
  'OPENAI_API_KEY',
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.warn(`Warning: Environment variable ${envVar} is not set`);
  }
}

export default config;