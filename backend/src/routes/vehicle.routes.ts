// backend/src/routes/vehicle.routes.ts
import express from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { handleValidationErrors } from '../middleware/validator.middleware';
import {
  createVehicleValidator,
  updateVehicleValidator,
} from '../validators/vehicle.validator';
import { VehicleController } from '../controllers/vehicle.controller';
import { authorize } from '../middleware/authorize.middleware';
import { uuidParamValidator } from '../validators/uuid.validator';

const router = express.Router();

router.post(
  '/',
  authenticate,
  createVehicleValidator,
  handleValidationErrors,
  VehicleController.create
);

router.get('/', authenticate, VehicleController.getByUser);

router.get(
  '/all/:id',
  uuidParamValidator,
  handleValidationErrors,
  VehicleController.getByUserId
);

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
  updateVehicleValidator,
  handleValidationErrors,
  VehicleController.update
);

router.delete(
  '/:id',
  authenticate,
  authorize(['driver']),
  uuidParamValidator,
  handleValidationErrors,
  VehicleController.delete
);

export default router;
