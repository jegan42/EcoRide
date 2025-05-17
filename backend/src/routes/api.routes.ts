// backend/src/routes/api.routes.ts
import { Router } from 'express';
import { authRoutes } from './';

const router = Router();

router.use('/auth', authRoutes);

export default router;
