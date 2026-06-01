import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

export function requestId(req: Request, _res: Response, next: NextFunction): void {
  req.requestId = crypto.randomUUID();
  next();
}
