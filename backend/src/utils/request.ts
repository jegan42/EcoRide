// src/utils/request.ts
import { Request, Response } from 'express';
import { User } from '../../generated/prisma';
import { isId } from './validation';
import { sendJsonResponse } from './response';

export const requireUser = (req: Request, res: Response): User | null => {
  const user = (req.user as User) ?? null;

  if (!user) {
    sendJsonResponse(res, 'UNAUTHORIZED', 'Request', 'User not connected');
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
    sendJsonResponse(res, 'BAD_REQUEST', 'Owner', 'Invalid ID');
    return null;
  }

  if (user.id !== ownerId) {
    sendJsonResponse(res, 'FORBIDDEN', 'Owner', 'Not the owner');
    return null;
  }

  return user;
};
