import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import { env } from './config/env.js';
import { generalLimiter } from './middleware/rateLimiter.js';
import { requestId } from './middleware/requestId.js';
import { timeout } from './middleware/timeout.js';
import { errorHandler } from './middleware/errorHandler.js';

import authRoutes from './modules/auth/auth.routes.js';
import artworkRoutes from './modules/artwork/artwork.routes.js';
import cartRoutes from './modules/cart/cart.routes.js';
import orderRoutes from './modules/order/order.routes.js';
import adminRoutes from './modules/admin/admin.routes.js';
import userRoutes from './modules/user/user.routes.js';

const app = express();

// Security
if (env.NODE_ENV === 'production') {
  app.use(helmet());
} else {
  app.use(helmet({ contentSecurityPolicy: false }));
}

app.use(cors({ origin: true, credentials: true }));
app.use(mongoSanitize());

// Parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Production middleware
app.use(requestId);
app.use(timeout);
app.use(generalLimiter);

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/artworks', artworkRoutes);
app.use('/api/v1/cart', cartRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/users', userRoutes);

// Error handler (must be last)
app.use(errorHandler);

export default app;
