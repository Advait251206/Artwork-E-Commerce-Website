import { Request, Response, NextFunction } from 'express';

const TIMEOUT_MS = 15_000;

export function timeout(req: Request, res: Response, next: NextFunction): void {
  res.setTimeout(TIMEOUT_MS, () => {
    if (!res.headersSent) {
      res.status(408).json({ success: false, message: 'Request timeout' });
    }
  });
  next();
}
