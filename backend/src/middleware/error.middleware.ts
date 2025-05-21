// backend/src/middleware/error.middleware.ts
import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  res.status(500).json({
    message: 'Something went wrong',
    details: err.message,
  });
};
