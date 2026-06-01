import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt.js';
import { AppError } from '../utils/AppError.js';
import User from '../modules/user/user.model.js';

export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return next(AppError.unauthorized('No token provided'));
  }

  try {
    const token = authHeader.split(' ')[1];
    const payload = verifyAccessToken(token);

    req.userId = payload.userId;
    req.userRole = payload.role;

    next();
  } catch {
    next(AppError.unauthorized('Invalid or expired token'));
  }
}

export async function authenticateWithVersionCheck(req: Request, _res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return next(AppError.unauthorized('No token provided'));
  }

  try {
    const token = authHeader.split(' ')[1];
    const payload = verifyAccessToken(token);

    const user = await User.findById(payload.userId).select('tokenVersion role');
    if (!user || user.tokenVersion !== payload.tokenVersion) {
      return next(AppError.unauthorized('Token revoked'));
    }

    req.userId = payload.userId;
    req.userRole = user.role;
    next();
  } catch {
    next(AppError.unauthorized('Invalid or expired token'));
  }
}

export function authorize(...roles: string[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.userRole || !roles.includes(req.userRole)) {
      return next(AppError.forbidden('Insufficient permissions'));
    }
    next();
  };
}
