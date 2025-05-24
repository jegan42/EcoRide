// backend/src/routes/booking.routes.ts
import express from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { csrfProtection } from '../middleware/csrf.middleware';
import { uuidParamValidator } from '../validators/uuid.validator';
import {
  actionValidator,
  createBookingValidator,
} from '../validators/booking.validator';
import { handleValidationErrors } from '../middleware/validator.middleware';
import { BookingController } from '../controllers/booking.controller';
import { authorize } from '../middleware/authorize.middleware';

const router = express.Router();

router.post(
  '/',
  authenticate,
  csrfProtection,
  createBookingValidator,
  handleValidationErrors,
  BookingController.create
);

router.delete(
  '/:id',
  authenticate,
  csrfProtection,
  uuidParamValidator,
  handleValidationErrors,
  BookingController.cancel
);

router.get('/me', authenticate, BookingController.getAllByUser);

router.get(
  '/driver',
  authenticate,
  authorize(['driver']),
  BookingController.getAllByDriver
);

router.get(
  '/trip/:id',
  authenticate,
  uuidParamValidator,
  handleValidationErrors,
  BookingController.getAllByTrip
);

router.post(
  '/:id/validate',
  authenticate,
  authorize(['driver']),
  csrfProtection,
  actionValidator,
  handleValidationErrors,
  BookingController.validate
);

router.get(
  '/:id',
  authenticate,
  uuidParamValidator,
  handleValidationErrors,
  BookingController.getById
);

export default router;
