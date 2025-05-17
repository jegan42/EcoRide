import { body, param } from 'express-validator';

export const createTripValidator = [
  body('vehicleId').notEmpty().withMessage('Vehicle ID is required'),
  body('departureCity').notEmpty().withMessage('Departure city is required'),
  body('arrivalCity').notEmpty().withMessage('Arrival city is required'),
  body('departureDate')
    .notEmpty()
    .withMessage('Departure date is required')
    .isISO8601()
    .withMessage('Departure date must be a valid ISO 8601 date'),
  body('arrivalDate')
    .notEmpty()
    .withMessage('Arrival date is required')
    .isISO8601()
    .withMessage('Arrival date must be a valid ISO 8601 date'),
  body('availableSeats')
    .notEmpty()
    .withMessage('Available seats are required')
    .isInt()
    .withMessage('availableSeats must be an Int')
    .isInt({ min: 1 })
    .withMessage('Available seats must be at least 1'),
  body('price')
    .notEmpty()
    .withMessage('Price is required')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
];

export const updateTripValidator = [
  body('vehicleId').optional().notEmpty().withMessage('Vehicle ID is required'),
  body('departureCity')
    .optional()
    .notEmpty()
    .withMessage('Departure city is required'),
  body('arrivalCity')
    .optional()
    .notEmpty()
    .withMessage('Arrival city is required'),
  body('departureDate')
    .optional()
    .notEmpty()
    .withMessage('Departure date is required')
    .isISO8601()
    .withMessage('Departure date must be a valid ISO 8601 date'),
  body('arrivalDate')
    .optional()
    .notEmpty()
    .withMessage('Arrival date is required')
    .isISO8601()
    .withMessage('Arrival date must be a valid ISO 8601 date'),
  body('availableSeats')
    .optional()
    .notEmpty()
    .optional()
    .withMessage('Available seats are required')
    .isInt({ min: 1 })
    .withMessage('Available seats must be at least 1'),
  body('price')
    .optional()
    .notEmpty()
    .withMessage('Price is required')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
];

export const tripIdParamValidator = [
  param('id').isUUID().withMessage('Invalid trip ID'),
];
