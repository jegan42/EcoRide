// backend/src/controllers/email.controller.ts
import { Request, Response } from 'express';
import { errorResponse, successResponse } from '../utils/response';
import { sendEmail } from '../services/email.service';

export class EmailController {
  static readonly send = async (req: Request, res: Response): Promise<void> => {
    try {
      const { to, subject, html } = req.body;
      await sendEmail({
        to,
        subject,
        html,
      });

      successResponse(res, 'Email', 'created');
    } catch (error) {
      errorResponse(res, 'Email', 'failed to sendEmail', error);
    }
  };
}
