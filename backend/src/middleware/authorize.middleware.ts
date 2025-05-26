// backend/src/middleware/authorize.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { User } from '../../generated/prisma';
import { forbiddenResponse } from '../utils/response';

export const authorize =
  (
    requiredRoles: string[]
  ): ((req: Request, res: Response, next: NextFunction) => void) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const user = req.user as User;

    if (!user || !Array.isArray(user.role)) {
      forbiddenResponse(res, 'Authorize', 'no roles');
      return;
    }

    const hasRole = user.role.some((role: string) =>
      requiredRoles.includes(role)
    );

    if (!hasRole) {
      forbiddenResponse(res, 'Authorize', 'insufficient permissions');
      return;
    }

    next();
  };
