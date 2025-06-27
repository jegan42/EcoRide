// backend/src/routes/email.routes.ts
import express from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { handleValidationErrors } from '../middleware/validator.middleware';
import { EmailController } from '../controllers/email.controller';
import { sendMailValidator } from '../validators/email.validator';

const router = express.Router();

router.post(
  '/',
  authenticate,
  sendMailValidator,
  handleValidationErrors,
  EmailController.send
);

export default router;
