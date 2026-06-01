import { Response } from 'express';

interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  meta?: any;
  message: string;
}

export function sendSuccess<T>(res: Response, data: T, message = 'Success', statusCode = 200, meta?: any): void {
  const body: ApiResponse<T> = { success: true, data, message };
  if (meta) body.meta = meta;
  res.status(statusCode).json(body);
}

export function sendError(res: Response, message: string, statusCode = 500): void {
  const body: ApiResponse = { success: false, message };
  res.status(statusCode).json(body);
}
