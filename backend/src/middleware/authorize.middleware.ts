// backend/src/middleware/authorize.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { User } from '../../generated/prisma';

export const authorize =
  (
    requiredRoles: string[]
  ): ((req: Request, res: Response, next: NextFunction) => void) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const user = req.user as User;

    if (!user || !Array.isArray(user.role)) {
      res.status(403).json({ message: 'Access denied: no roles found' });
      return;
    }

    const hasRole = user.role.some((role: string) =>
      requiredRoles.includes(role)
    );

    if (!hasRole) {
      res
        .status(403)
        .json({ message: 'Access denied: insufficient permissions' });
      return;
    }

    next();
  };
