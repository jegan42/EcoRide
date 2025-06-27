// backend/src/validators/email.validator.ts
import { body } from 'express-validator';

export const sendMailValidator = [
  body('to')
    .trim()
    .notEmpty()
    .withMessage('Recipient is required')
    .isEmail()
    .withMessage('The recipient’s email address is invalid'),

  body('subject')
    .trim()
    .notEmpty()
    .withMessage('Subject est requis')
    .isLength({ min: 3 })
    .withMessage('The subject must contain at least 3 characters')
    .isLength({ max: 200 })
    .withMessage('The subject must not exceed 200 characters'),

  body('html')
    .notEmpty()
    .withMessage('Message est requis')
    .isLength({ min: 10 })
    .withMessage('The message must contain at least 10 characters')
    .isLength({ max: 5000 })
    .withMessage('The message must not exceed 5000 characters'),
];
