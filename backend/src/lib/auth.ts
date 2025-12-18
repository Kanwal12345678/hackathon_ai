import BetterAuth from 'better-auth';
import { PrismaAdapter } from '@better-auth/adapter-prisma';
import prisma from './prisma';

// Initialize Better Auth with Prisma adapter
const auth = BetterAuth({
  database: PrismaAdapter(prisma, {
    provider: 'postgresql'
  }),
  secret: process.env.JWT_SECRET || 'fallback-secret-for-development',
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Set to true in production
  },
  socialProviders: {
    // Add social providers as needed
  },
  account: {
    accountModel: {
      // Define custom account model if needed
    }
  },
  session: {
    expiresIn: 7 * 24 * 60 * 60, // 7 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  user: {
    include: {
      // Add any additional user fields that should be included in the session
    }
  }
});

export default auth;