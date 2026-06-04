import mongoose from 'mongoose';
import { env } from './env.js';
import { logger } from '../utils/logger.js';

export async function connectDB(): Promise<void> {
  try {
    await mongoose.connect(env.MONGODB_URI);
    logger.info('✅ MongoDB connected');
  } catch (error) {
    logger.error('❌ mongodb not connected');
    // We don't exit here so the server can still start
  }
}
