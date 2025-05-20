// src/utils/request.ts
import { Request, Response } from 'express';
import { User } from '../../generated/prisma';
import { isId } from './validation';

export const requireUser = (req: Request, res: Response): User | null => {
  const user = (req.user as User) ?? null;

  if (!user) {
    res.status(401).json({ message: 'Unauthorized' });
    return null;
  }

  return user;
};

export const assertOwnership = (
  req: Request,
  res: Response,
  ownerId: string
): User | null => {
  const user = requireUser(req, res);
  if (!user) return null;

  if (!isId(ownerId)) {
    res.status(400).json({ message: 'Invalid ID' });
    return null;
  }

  if (user.id !== ownerId) {
    res.status(403).json({ message: 'Forbidden' });
    return null;
  }

  return user;
};
