// backend/src/controllers/csrf.controller.ts
import { CsrfService } from '../services/csrf.service';
import { successResponse } from '../utils/response';
import { Request, Response } from 'express';

export class CsrfController {
  static readonly getCsrf = (req: Request, res: Response): void => {
    successResponse(res, 'CSRF', 'getCsrfToken', CsrfService.getCsrfToken(req));
  };
}
