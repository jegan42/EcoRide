// backend/src/middleware/error.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { errorResponse } from '../utils/response';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  errorResponse(res, 'Middleware', 'something went wrong', err);
};
