// backend/src/routes/trip.routes.ts
import express from 'express';
import { TripController } from '../controllers/trip.controller';
import { authenticate } from '../middleware/auth.middleware';
import { handleValidationErrors } from '../middleware/validator.middleware';
import {
  createTripValidator,
  searchTripValidator,
  updateTripValidator,
} from '../validators/trip.validator';
import { uuidParamValidator } from '../validators/uuid.validator';
import { authorize } from '../middleware/authorize.middleware';
import { csrfProtection } from '../middleware/csrf.middleware';

const router = express.Router();

router.get('/', searchTripValidator, TripController.getAll);

router.get(
  '/:id',
  uuidParamValidator,
  handleValidationErrors,
  TripController.getById
);

router.post(
  '/',
  authenticate,
  csrfProtection,
  authorize(['driver']),
  createTripValidator,
  handleValidationErrors,
  TripController.create
);
router.put(
  '/:id',
  authenticate,
  csrfProtection,
  authorize(['driver']),
  updateTripValidator,
  handleValidationErrors,
  TripController.update
);
router.delete(
  '/:id',
  authenticate,
  csrfProtection,
  authorize(['driver']),
  uuidParamValidator,
  handleValidationErrors,
  TripController.delete
);

export default router;
