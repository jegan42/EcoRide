// backend/src/services/csrf.service.ts
import { Request } from 'express';

export class CsrfService {
  static getCsrfToken(req: Request): string {
    return req.csrfToken();
  }
}
