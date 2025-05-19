// backend/src/validators/uuid.validator.ts
import { param } from 'express-validator';

export const uuidParamValidator = [
  param('id').isUUID().withMessage('Invalid ID'),
];
