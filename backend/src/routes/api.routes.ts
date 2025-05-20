// backend/src/routes/api.routes.ts
import { Router } from 'express';
import {
  authRoutes,
  vehicleRoutes,
  tripRoutes,
  bookingRoutes,
  UserPreferencesRoutes,
} from './';

const router = Router();

router.use('/auth', authRoutes);
router.use('/vehicles', vehicleRoutes);
router.use('/trips', tripRoutes);
router.use('/bookings', bookingRoutes);
router.use('/user-preferences', UserPreferencesRoutes);

export default router;
