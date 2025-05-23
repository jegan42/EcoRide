// backend/src/validators/trip.validator.ts
import { body, param } from 'express-validator';

export const createTripValidator = [
  body('vehicleId')
    .notEmpty()
    .withMessage('vehicle ID is required')
    .isUUID()
    .withMessage('invalid ID'),
  body('departureCity')
    .notEmpty()
    .withMessage('departureCity is required')
    .isString()
    .withMessage('departureCity must be a string'),
  body('arrivalCity')
    .notEmpty()
    .withMessage('arrivalCity is required')
    .isString()
    .withMessage('arrivalCity must be a string'),
  body('departureDate')
    .notEmpty()
    .withMessage('departureDate is required')
    .isISO8601()
    .withMessage('departureDate must be a valid ISO 8601 date'),
  body('arrivalDate')
    .notEmpty()
    .withMessage('arrivalDate is required')
    .isISO8601()
    .withMessage('arrivalDate must be a valid ISO 8601 date'),
  body('availableSeats')
    .notEmpty()
    .withMessage('availableSeats are required')
    .isInt()
    .withMessage('availableSeats must be an Int')
    .isInt({ min: 1, max: 10 })
    .withMessage('availableSeats must be at least 1'),
  body('price')
    .notEmpty()
    .withMessage('price is required')
    .isFloat({ min: 0 })
    .withMessage('price must be a positive number'),
];

export const updateTripValidator = [
  param('id').isUUID().withMessage('invalid ID'),
  body('vehicleId')
    .optional()
    .notEmpty()
    .withMessage('vehicle ID is required')
    .isUUID()
    .withMessage('invalid ID'),
  body('departureCity')
    .optional()
    .notEmpty()
    .withMessage('departureCity is required')
    .isString()
    .withMessage('departureCity must be a string'),
  body('arrivalCity')
    .optional()
    .notEmpty()
    .withMessage('arrivalCity is required')
    .isString()
    .withMessage('arrivalCity must be a string'),
  body('departureDate')
    .optional()
    .notEmpty()
    .withMessage('departureDate is required')
    .isISO8601()
    .withMessage('departureDate must be a valid ISO 8601 date'),
  body('arrivalDate')
    .optional()
    .notEmpty()
    .withMessage('arrivalDate is required')
    .isISO8601()
    .withMessage('arrivalDate must be a valid ISO 8601 date'),
  body('availableSeats')
    .optional()
    .notEmpty()
    .withMessage('availableSeats are required')
    .isInt()
    .withMessage('availableSeats must be an Int')
    .isInt({ min: 1, max: 10 })
    .withMessage('availableSeats must be at least 1'),
  body('price')
    .optional()
    .notEmpty()
    .withMessage('price is required')
    .isFloat({ min: 0 })
    .withMessage('price must be a positive number'),
];

export const searchTripValidator = [
  body('departureCity')
    .optional()
    .notEmpty()
    .withMessage('departureCity is required')
    .isString()
    .withMessage('departureCity must be a string'),
  body('arrivalCity')
    .optional()
    .notEmpty()
    .withMessage('arrivalCity is required')
    .isString()
    .withMessage('arrivalCity must be a string'),
  body('departureDate')
    .optional()
    .notEmpty()
    .withMessage('departureDate is required')
    .isISO8601()
    .withMessage('departureDate must be a valid ISO 8601 date'),
  body('flexible')
    .optional()
    .isBoolean()
    .withMessage('Must be true or false')
    .toBoolean(),
];
