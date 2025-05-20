// backend/src/validators/userPreferences.validator.ts
import { body } from 'express-validator';

export const createPreferencesValidator = [
  body('acceptsSmoker')
    .exists()
    .withMessage('acceptsSmoker is required')
    .isBoolean()
    .withMessage('Must be true or false')
    .toBoolean(),
  body('acceptsPets')
    .exists()
    .withMessage('acceptsPets is required')
    .isBoolean()
    .withMessage('Must be true or false')
    .toBoolean(),
  body('acceptsMusic')
    .exists()
    .withMessage('acceptsMusic is required')
    .isBoolean()
    .withMessage('Must be true or false')
    .toBoolean(),
  body('acceptsChatter')
    .exists()
    .withMessage('acceptsChatter is required')
    .isBoolean()
    .withMessage('Must be true or false')
    .toBoolean(),
];

export const updatePreferencesValidator = [
  body('acceptsSmoker')
    .optional()
    .isBoolean()
    .withMessage('Must be true or false')
    .toBoolean(),
  body('acceptsPets')
    .optional()
    .isBoolean()
    .withMessage('Must be true or false')
    .toBoolean(),
  body('acceptsMusic')
    .optional()
    .isBoolean()
    .withMessage('Must be true or false')
    .toBoolean(),
  body('acceptsChatter')
    .optional()
    .isBoolean()
    .withMessage('Must be true or false')
    .toBoolean(),
];
