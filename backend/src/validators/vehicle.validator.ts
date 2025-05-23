// backend/src/validators/vehicle.validator.ts
import { body, param } from 'express-validator';

export const createVehicleValidator = [
  body('brand').notEmpty().withMessage('brand is required'),
  body('model').notEmpty().withMessage('model is required'),
  body('color').notEmpty().withMessage('color is required'),
  body('vehicleYear')
    .notEmpty()
    .withMessage('vehicleYear is required')
    .isInt({ min: 1900, max: new Date().getFullYear() + 1 })
    .withMessage('vehicleYear must be a valid year'),
  body('licensePlate')
    .notEmpty()
    .withMessage('licensePlate is required')
    .isLength({ min: 3, max: 20 })
    .withMessage('licensePlate must be between 3 and 20 characters'),
  body('energy').notEmpty().withMessage('energy is required'),
  body('seatCount')
    .notEmpty()
    .withMessage('seatCount is required')
    .isInt({ min: 1, max: 10 })
    .withMessage('seatCount must be between 1 and 10'),
];

export const updateVehicleValidator = [
  param('id').isUUID().withMessage('invalid ID'),
  body('brand').optional().notEmpty().withMessage('brand must not be empty'),
  body('model').optional().notEmpty().withMessage('model must not be empty'),
  body('color').optional().notEmpty().withMessage('color must not be empty'),
  body('vehicleYear')
    .optional()
    .isInt({ min: 1900, max: new Date().getFullYear() + 1 })
    .withMessage('vehicleYear must be a valid year'),
  body('licensePlate')
    .optional()
    .isLength({ min: 3, max: 20 })
    .withMessage('licensePlate must be between 3 and 20 characters'),
  body('energy').optional().notEmpty().withMessage('energy must not be empty'),
  body('seatCount')
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage('seatCount must be between 1 and 10'),
];
