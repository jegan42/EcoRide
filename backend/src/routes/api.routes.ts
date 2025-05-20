// backend/src/routes/api.routes.ts
import { Router } from 'express';
import { authRoutes, vehicleRoutes, tripRoutes, bookingRoutes } from './';

const router = Router();

router.use('/auth', authRoutes);
router.use('/vehicles', vehicleRoutes);
router.use('/trips', tripRoutes);
router.use('/bookings', bookingRoutes);

export default router;
