// src/utils/request.ts
import { Request, Response } from 'express';
import { User } from '../../generated/prisma';
import { sendJsonResponse } from './response';

export const requireUser = (req: Request, res: Response): User | null => {
  const user = (req.user as User) ?? null;

  if (!user) {
    sendJsonResponse(res, 'UNAUTHORIZED', 'Request', 'user not connected');
    return null;
  }

  return user;
};

export const assertOwnership = (
  req: Request,
  res: Response,
  ownerId: string
): User | null => {
  const user = req.user as User;

  if (user.id !== ownerId) {
    sendJsonResponse(res, 'FORBIDDEN', 'Owner', 'not the owner');
    return null;
  }

  return user;
};
