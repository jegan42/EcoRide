// backend/src/routes/auth.routes.ts
import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import passport from 'passport';
import {
  signinValidator,
  signupValidator,
  updateValidator,
} from '../validators/auth.validator';
import { GoogleAuthController } from '../controllers/google.controller';
import { csrfProtection } from '../middleware/csrf.middleware';
import { authenticate } from '../middleware/auth.middleware';
import { handleValidationErrors } from '../middleware/validator.middleware';

const router = Router();

router.post(
  '/signup',
  csrfProtection,
  signupValidator,
  handleValidationErrors,
  AuthController.signup
);

router.post(
  '/signin',
  csrfProtection,
  signinValidator,
  handleValidationErrors,
  AuthController.signin
);

router.post('/signout', authenticate, csrfProtection, AuthController.signout);

router.put(
  '/update',
  authenticate,
  csrfProtection,
  updateValidator,
  handleValidationErrors,
  AuthController.update
);

router.get('/me', authenticate, AuthController.getMe);

router.get(
  '/google',
  passport.authenticate('google', {
    scope: [
      'profile',
      'email',
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/calendar.events',
      'https://www.googleapis.com/auth/calendar.readonly',
    ],
    accessType: 'offline',
    prompt: 'consent',
  })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  GoogleAuthController.callback
);

export default router;
