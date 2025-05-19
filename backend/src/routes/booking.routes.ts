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
  BookingController.cancel
);
router.use(authenticate);
router.use(csrfProtection);

// POST /bookings
router.post(
  '/',
  createBookingValidator,
  handleValidationErrors,
  BookingController.create
);

// GET /bookings/:id
router.get(
  '/:id',
  uuidParamValidator,
  handleValidationErrors,
  BookingController.getById
);

// GET /bookings/me
router.get('/me', BookingController.getAllByUser);

// GET /bookings/driver
router.get('/driver', BookingController.getAllByDriver);

// GET /bookings/trip/:tripId
router.get(
  '/trip/:tripId',
  uuidParamValidator,
  handleValidationErrors,
  BookingController.getAllByTrip
);

// POST /bookings/:id/validate
router.post(
  '/:id/validate',
  uuidParamValidator,
  actionValidator, // pour valider { action: "accept" | "reject" }
  handleValidationErrors,
  BookingController.validate
);

// DELETE /bookings/:id
router.delete(
  '/:id',
  uuidParamValidator,
  handleValidationErrors,
  BookingController.cancel
);

export default router;
