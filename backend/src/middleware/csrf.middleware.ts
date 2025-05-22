// backend/src/middleware/csrf.middleware.ts
import csrf from 'csurf';
import { Request, Response, NextFunction } from 'express';
import { sendJsonResponse } from '../utils/response';

export const csrfProtection =
  process.env.NODE_ENV !== 'test'
    ? csrf({
        cookie: {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production', // Render is HTTPS, so required
          sameSite: 'lax', // Important when using cross-origin (front/back separated)
        },
      })
    : [];

export const csrfErrorHandler = (
  err: any,
  _req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (err.code === 'EBADCSRFTOKEN') {
    sendJsonResponse(res, 'FORBIDDEN', 'CSRF', 'invalid token');
    return;
  }
  next(err);
};
