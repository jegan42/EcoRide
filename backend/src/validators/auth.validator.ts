// backend/src/validators/auth.validator.ts
import { body } from 'express-validator';

export const signupValidator = [
  body('firstName')
    .notEmpty()
    .withMessage('firstName is required')
    .isString()
    .withMessage('firstName must be a string'),
  body('lastName')
    .notEmpty()
    .withMessage('lastName is required')
    .isString()
    .withMessage('lastName must be a string'),
  body('username')
    .notEmpty()
    .withMessage('username is required')
    .isLength({ min: 3, max: 20 })
    .withMessage('username must be between 3 and 20 characters'),
  body('email')
    .notEmpty()
    .withMessage('email is required')
    .isEmail()
    .withMessage('email must be a valid email address'),
  body('password')
    .notEmpty()
    .withMessage('password is required')
    .isLength({ min: 8, max: 128 })
    .withMessage('password must be at least 8 characters long')
    .matches(/\d/)
    .withMessage('password must contain a number')
    .matches(/[a-zA-Z]/)
    .withMessage('password must contain both letters and numbers')
    .matches(/[@$!%*?&]/)
    .withMessage('password must contain a special character'),
  body('phone')
    .notEmpty()
    .withMessage('phone number is required')
    .isString()
    .withMessage('phone must be a string'),
  body('address')
    .notEmpty()
    .withMessage('address is required')
    .isString()
    .withMessage('address must be a string'),
  body('avatar')
    .optional()
    .isURL()
    .withMessage('avatar must be an URL')
    .notEmpty()
    .withMessage('avatar is required'),
];

export const signinValidator = [
  body('email')
    .notEmpty()
    .withMessage('email is required')
    .isEmail()
    .withMessage('email must be a valid email address'),
  body('password')
    .notEmpty()
    .withMessage('password is required')
    .isLength({ min: 8, max: 128 })
    .withMessage('password must be at least 8 characters long')
    .matches(/\d/)
    .withMessage('password must contain a number')
    .matches(/[a-zA-Z]/)
    .withMessage('password must contain both letters and numbers')
    .matches(/[@$!%*?&]/)
    .withMessage('password must contain a special character'),
];

export const updateValidator = [
  body('id').isUUID().withMessage('invalid ID'),
  body('firstName')
    .optional()
    .isString()
    .withMessage('firstName must be a string'),
  body('lastName')
    .optional()
    .isString()
    .withMessage('lastName must be a string'),
  body('username')
    .optional()
    .isLength({ min: 3, max: 20 })
    .withMessage('username must be between 3 and 20 characters'),
  body('email')
    .optional()
    .isEmail()
    .withMessage('email must be a valid email address'),
  body('password')
    .optional()
    .isLength({ min: 8, max: 128 })
    .withMessage('password must be at least 8 characters long')
    .matches(/\d/)
    .withMessage('password must contain a number')
    .matches(/[a-zA-Z]/)
    .withMessage('password must contain both letters and numbers')
    .matches(/[@$!%*?&]/)
    .withMessage('password must contain a special character'),
  body('phone').optional().isString().withMessage('phone must be a string'),
  body('address').optional().isString().withMessage('address must be a string'),
  body('avatar')
    .optional()
    .isURL()
    .withMessage('avatar must be an URL')
    .notEmpty()
    .withMessage('avatar is required'),
  body('role')
    .optional()
    .isArray({ min: 1 })
    .withMessage('role must be a non-empty array'),
  body('credits').optional().isFloat().withMessage('credits must be a number'),
];

export const googleSigninValidator = [
  body('idToken').notEmpty().withMessage('Google ID Token is required'),
];
