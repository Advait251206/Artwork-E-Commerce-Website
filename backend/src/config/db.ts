import mongoose from 'mongoose';
import { env } from './env.js';
import { logger } from '../utils/logger.js';

export async function connectDB(): Promise<void> {
  try {
    await mongoose.connect(env.MONGODB_URI);
    logger.info('✅ MongoDB connected');
  } catch (error) {
    logger.fatal({ error }, '❌ MongoDB connection failed');
    process.exit(1);
  }
}
