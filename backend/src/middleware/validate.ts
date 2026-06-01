import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(422).json({
          success: false,
          message: 'Validation failed',
          errors: error.errors.map((e) => ({ path: e.path.join('.'), message: e.message })),
        });
        return;
      }
      next(error);
    }
  };
}
