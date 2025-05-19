// backend/src/validators/booking.validator.ts
import { body } from 'express-validator';

export const createBookingValidator = [
  body('tripId')
    .notEmpty()
    .withMessage('Trip ID is required')
    .isUUID()
    .withMessage('Invalid Trip ID'),

  body('seatCount')
    .notEmpty()
    .withMessage('Seat count is required')
    .isInt({ min: 1, max: 10 })
    .withMessage('Seat count must be between 1 and 10'),
];

export const actionValidator = [
  body('action')
    .exists()
    .withMessage('Action is required')
    .isString()
    .withMessage('Action must be a string')
    .isIn(['accept', 'reject'])
    .withMessage('Action must be either "accept" or "reject"'),
];
