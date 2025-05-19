// src/utils/request.ts
import { Request, Response } from 'express';
import { User } from '../../generated/prisma';

export const requireUser = (req: Request, res: Response): User | null => {
  const user = (req.user as User) ?? null;

  if (!user) {
    res.status(401).json({ message: 'Unauthorized' });
    return null;
  }

  return user;
};
