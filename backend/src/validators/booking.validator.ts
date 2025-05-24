// backend/src/validators/booking.validator.ts
import { body, param } from 'express-validator';

export const createBookingValidator = [
  body('tripId')
    .notEmpty()
    .withMessage('tripId is required')
    .isUUID()
    .withMessage('invalid ID'),

  body('seatCount')
    .notEmpty()
    .withMessage('seatCount is required')
    .isInt({ min: 1, max: 10 })
    .withMessage('seatCount must be between 1 and 10'),
];

export const actionValidator = [
  param('id').isUUID().withMessage('invalid ID'),
  body('action')
    .notEmpty()
    .withMessage('action is required')
    .isString()
    .withMessage('action must be a string')
    .isIn(['accept', 'reject'])
    .withMessage('action must be either "accept" or "reject"'),
];
