import { body, param } from 'express-validator';

export const createVehicleValidator = [
  body('brand').notEmpty().withMessage('Brand is required'),
  body('model').notEmpty().withMessage('Model is required'),
  body('color').notEmpty().withMessage('Color is required'),
  body('vehicleYear')
    .notEmpty()
    .withMessage('Vehicle year is required')
    .isInt({ min: 1900, max: new Date().getFullYear() + 1 })
    .withMessage('Vehicle year must be a valid year'),
  body('licensePlate')
    .notEmpty()
    .withMessage('License plate is required')
    .isLength({ min: 3, max: 20 })
    .withMessage('License plate must be between 3 and 20 characters'),
  body('energy').notEmpty().withMessage('Energy is required'),
  body('seatCount')
    .notEmpty()
    .withMessage('Seat count is required')
    .isInt({ min: 1, max: 10 })
    .withMessage('Seat count must be between 1 and 10'),
];

export const updateVehicleValidator = [
  param('id').isUUID().withMessage('Invalid vehicle ID'),
  body('brand').optional().notEmpty().withMessage('Brand must not be empty'),
  body('model').optional().notEmpty().withMessage('Model must not be empty'),
  body('color').optional().notEmpty().withMessage('Color must not be empty'),
  body('vehicleYear')
    .optional()
    .isInt({ min: 1900, max: new Date().getFullYear() + 1 })
    .withMessage('Vehicle year must be a valid year'),
  body('licensePlate')
    .optional()
    .isLength({ min: 3, max: 20 })
    .withMessage('License plate must be between 3 and 20 characters'),
  body('energy').optional().notEmpty().withMessage('Energy must not be empty'),
  body('seatCount')
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage('Seat count must be between 1 and 10'),
];

export const vehicleIdParamValidator = [
  param('id').isUUID().withMessage('Invalid vehicle ID'),
];
