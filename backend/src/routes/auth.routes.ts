// backend/src/routes/auth.routes.ts
import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import passport from 'passport';
import { signinValidator, signupValidator } from '../validators/auth.validator';
import { GoogleAuthController } from '../controllers/google.controller';
import { csrfProtection } from '../middleware/csrf.middleware';
import { authenticate } from '../middleware/auth.middleware';
import { handleValidationErrors } from '../middleware/validator.middleware';
import rateLimit from 'express-rate-limit';

const router = Router();

const windowMs =
  process.env.NODE_ENV !== 'test' ? 15 * 60 * 1000 : 60 * 60 * 1000; // 15 min
const maxRequests = process.env.NODE_ENV !== 'test' ? 5 : 100; // Limit to 5 requests per window

router.post(
  '/signup',
  rateLimit({
    windowMs,
    max: maxRequests,
  }),
  csrfProtection,
  signupValidator,
  handleValidationErrors,
  AuthController.signup
);

router.post(
  '/signin',
  rateLimit({
    windowMs,
    max: maxRequests,
  }),
  csrfProtection,
  signinValidator,
  AuthController.signin
);

router.post('/signout', authenticate, csrfProtection, AuthController.signout);

router.put('/update', authenticate, csrfProtection, AuthController.updateUser);

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
