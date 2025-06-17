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

const router = express.Router();

router.get(
  '/driver',
  authenticate,
  authorize(['driver']),
  searchTripValidator,
  TripController.getByDriver
);

router.post('/search', searchTripValidator, TripController.getAll);

router.get(
  '/:id',
  uuidParamValidator,
  handleValidationErrors,
  TripController.getById
);

router.post(
  '/',
  authenticate,
  authorize(['driver']),
  createTripValidator,
  handleValidationErrors,
  TripController.create
);
router.put(
  '/:id',
  authenticate,
  authorize(['driver']),
  updateTripValidator,
  handleValidationErrors,
  TripController.update
);
router.delete(
  '/:id',
  authenticate,
  authorize(['driver']),
  uuidParamValidator,
  handleValidationErrors,
  TripController.cancel
);

export default router;
