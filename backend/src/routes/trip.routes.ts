// backend/src/routes/trip.routes.ts
import express from 'express';
import { TripController } from '../controllers/trip.controller';
import { authenticate } from '../middleware/auth.middleware';
import { handleValidationErrors } from '../middleware/validator.middleware';
import {
  tripIdParamValidator,
  createTripValidator,
  updateTripValidator,
} from '../validators/trip.validator';
import { authorize } from '../middleware/authorize.middleware';
import { csrfProtection } from '../middleware/csrf.middleware';

const router = express.Router();

router.get('/', TripController.getAllTrips);
router.get(
  '/:id',
  tripIdParamValidator,
  handleValidationErrors,
  TripController.getTripById
);

router.post(
  '/',
  authenticate,
  csrfProtection,
  authorize(['driver']),
  createTripValidator,
  handleValidationErrors,
  TripController.createTrip
);
router.put(
  '/:id',
  authenticate,
  csrfProtection,
  authorize(['driver']),
  tripIdParamValidator,
  updateTripValidator,
  handleValidationErrors,
  TripController.updateTrip
);
router.delete(
  '/:id',
  authenticate,
  csrfProtection,
  authorize(['driver']),
  tripIdParamValidator,
  handleValidationErrors,
  TripController.deleteTrip
);

export default router;
