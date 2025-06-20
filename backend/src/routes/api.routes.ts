// backend/src/routes/api.routes.ts
import { Router } from 'express';
import csrfRoutes from './csrf.route';
import authRoutes from './auth.routes';
import vehicleRoutes from './vehicle.routes';
import tripRoutes from './trip.routes';
import bookingRoutes from './booking.routes';
import UserPreferencesRoutes from './userPreferences.routes';
import firebaseRoutes from './firebase.route';
import { csrfProtection } from '../middleware/csrf.middleware';

const router = Router();

router.use('/csrf-token', csrfProtection, csrfRoutes);
router.use('/auth', authRoutes);
router.use('/vehicles', vehicleRoutes);
router.use('/trips', tripRoutes);
router.use('/bookings', bookingRoutes);
router.use('/preferences', UserPreferencesRoutes);
router.use('/firebase-token', firebaseRoutes);

export default router;
