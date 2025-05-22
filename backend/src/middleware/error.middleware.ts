// backend/src/middleware/error.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { sendJsonResponse } from '../utils/response';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  sendJsonResponse(
    res,
    'ERROR',
    'Middleware',
    'something went wrong',
    undefined,
    undefined,
    err
  );
};
