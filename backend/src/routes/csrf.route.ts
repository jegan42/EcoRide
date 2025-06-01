// backend/src/routes/csrf.routes.ts
import { Router } from 'express';
import { CsrfController } from '../controllers/csrf.controller';

const router = Router();

router.get('/', CsrfController.getCsrf);

export default router;
