// backend/src/middleware/validator.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { badRequestResponse } from '../utils/response';

export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    badRequestResponse(res, 'Validator', errors.array()[0].msg);
    return;
  }
  next();
};
