import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      userRole?: string;
      requestId?: string;
    }
  }
}
