// backend/src/controllers/vehicle.controller.ts
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
import { uuidParamValidator } from '../validators/validator';

const router = express.Router();

router.post(
  '/',
  authenticate,
  csrfProtection,
  createVehicleValidator,
  handleValidationErrors,
  VehicleController.createVehicle
);

router.get('/', VehicleController.getAllVehicles);

router.get(
  '/:id',
  uuidParamValidator,
  handleValidationErrors,
  VehicleController.getVehicleById
);

router.put(
  '/:id',
  authenticate,
  authorize(['driver']),
  csrfProtection,
  updateVehicleValidator,
  uuidParamValidator,
  handleValidationErrors,
  VehicleController.updateVehicle
);

router.delete(
  '/:id',
  authenticate,
  authorize(['driver']),
  csrfProtection,
  uuidParamValidator,
  handleValidationErrors,
  VehicleController.deleteVehicle
);

export default router;
