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
import { authenticate } from '../middleware/auth.middleware';
import { handleValidationErrors } from '../middleware/validator.middleware';
import { authorize } from '../middleware/authorize.middleware';

const router = Router();

router.post(
  '/signup',
  signupValidator,
  handleValidationErrors,
  AuthController.signup
);

router.post(
  '/signin',
  signinValidator,
  handleValidationErrors,
  AuthController.signin
);

router.post('/signout', authenticate, AuthController.signout);

router.put(
  '/update',
  authenticate,
  updateValidator,
  handleValidationErrors,
  AuthController.update
);

router.get('/all', authenticate, authorize(['admin']), AuthController.getAllUsers);

router.get('/me', authenticate, AuthController.getMe);

router.get('/:id', AuthController.getUserById);

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
