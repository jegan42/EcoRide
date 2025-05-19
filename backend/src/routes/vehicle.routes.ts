// backend/src/routes/vehicle.routes.ts
import express from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { handleValidationErrors } from '../middleware/validator.middleware';
import {
  createVehicleValidator,
  updateVehicleValidator,
} from '../validators/vehicle.validator';
import { VehicleController } from '../controllers/vehicle.controller';
import { csrfProtection } from '../middleware/csrf.middleware';
import { authorize } from '../middleware/authorize.middleware';
import { uuidParamValidator } from '../validators/uuid.validator';

const router = express.Router();

router.post(
  '/',
  authenticate,
  csrfProtection,
  createVehicleValidator,
  handleValidationErrors,
  VehicleController.create
);

router.get('/', VehicleController.getAll);

router.get(
  '/:id',
  uuidParamValidator,
  handleValidationErrors,
  VehicleController.getById
);

router.put(
  '/:id',
  authenticate,
  authorize(['driver']),
  csrfProtection,
  updateVehicleValidator,
  uuidParamValidator,
  handleValidationErrors,
  VehicleController.update
);

router.delete(
  '/:id',
  authenticate,
  authorize(['driver']),
  csrfProtection,
  uuidParamValidator,
  handleValidationErrors,
  VehicleController.delete
);

export default router;
