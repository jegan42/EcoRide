// backend/src/middleware/csrf.middleware.ts
import csrf from 'csurf';
import { Request, Response, NextFunction } from 'express';
import { forbiddenResponse } from '../utils/response';

const safeMethods = ['GET', 'HEAD', 'OPTIONS'];

export const csrfProtection =
  process.env.NODE_ENV !== 'test'
    ? csrf({
        cookie: {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production', // Render is HTTPS, so required
          sameSite: 'lax', // Important when using cross-origin (front/back separated)
        },
      })
    : (_req: Request, _res: Response, next: NextFunction): void => next();

export const conditionalCsrfProtection = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (safeMethods.includes(req.method)) {
    return next();
  }
  return csrfProtection(req, res, next);
};

export const csrfErrorHandler = (
  err: any,
  _req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (err.code === 'EBADCSRFTOKEN') {
    forbiddenResponse(res, 'CSRF', 'invalid token');
    return;
  }
  next(err);
};
