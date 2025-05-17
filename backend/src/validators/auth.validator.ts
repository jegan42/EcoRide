// backend/src/validators/auth.validator.ts
import { body } from 'express-validator';

export const signupValidator = [
  body('email').isEmail(),
  body('password').isLength({ min: 8 }),
  body('username').isLength({ min: 3, max: 20 }),
  body('firstName').notEmpty(),
  body('lastName').notEmpty(),
  body('phone').notEmpty(),
  body('address').notEmpty(),
];

export const signinValidator = [
  body('email').isEmail(),
  body('password').notEmpty(),
];

export const googleSigninValidator = [body('idToken').notEmpty()];
