// backend/src/routes/api.routes.ts
import { Router } from 'express';
import authRoutes from './auth.routes';
import vehicleRoutes from './vehicle.routes';
import tripRoutes from './trip.routes';
import bookingRoutes from './booking.routes';
import UserPreferencesRoutes from './userPreferences.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/vehicles', vehicleRoutes);
router.use('/trips', tripRoutes);
router.use('/bookings', bookingRoutes);
router.use('/user-preferences', UserPreferencesRoutes);

export default router;
