// backend/src/routes/userPreferences.routes.ts
import express from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { handleValidationErrors } from '../middleware/validator.middleware';
import { csrfProtection } from '../middleware/csrf.middleware';
import { uuidParamValidator } from '../validators/uuid.validator';
import {
  createPreferencesValidator,
  updatePreferencesValidator,
} from '../validators/userPreferences.validator';
import { PreferencesController } from '../controllers/userPreferences.controller';

const router = express.Router();

router.post(
  '/:id',
  authenticate,
  csrfProtection,
  uuidParamValidator,
  createPreferencesValidator,
  handleValidationErrors,
  PreferencesController.create
);

router.get('/me', authenticate, PreferencesController.getUser);

router.get(
  '/:id',
  authenticate,
  uuidParamValidator,
  handleValidationErrors,
  PreferencesController.getByUserId
);

router.put(
  '/:id',
  authenticate,
  csrfProtection,
  uuidParamValidator,
  updatePreferencesValidator,
  handleValidationErrors,
  PreferencesController.update
);

router.delete(
  '/:id',
  authenticate,
  csrfProtection,
  uuidParamValidator,
  handleValidationErrors,
  PreferencesController.delete
);

export default router;
