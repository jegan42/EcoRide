// backend/src/routes/api.routes.ts
import { Router } from 'express';
import { authRoutes, vehicleRoutes } from './';

const router = Router();

router.use('/auth', authRoutes);
router.use('/vehicles', vehicleRoutes);

export default router;
