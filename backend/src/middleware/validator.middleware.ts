// backend/src/middleware/validator.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { sendJsonResponse } from '../utils/response';

export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    sendJsonResponse(res, 'BAD_REQUEST', 'Validator', errors.array()[0].msg);
    return;
  }
  next();
};
