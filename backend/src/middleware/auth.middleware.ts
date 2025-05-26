// backend/src/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import prismaNewClient from '../lib/prisma';
import { errorResponse, unauthorizedResponse } from '../utils/response';

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;

  const jwtToken =
    req.cookies.jwtToken ??
    (authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : undefined);
  if (!jwtToken) {
    unauthorizedResponse(res, 'Athenticate', 'missing token');
    return;
  }

  const decoded = AuthService.verifyToken(jwtToken);
  if (!decoded?.userId) {
    unauthorizedResponse(res, 'Athenticate', 'invalid token');
    return;
  }

  try {
    const user = await prismaNewClient.user.findUnique({
      where: {
        id: decoded.userId,
      },
    });
    if (!user) {
      unauthorizedResponse(res, 'Athenticate', 'user not connected');
      return;
    }

    req.user = user;

    next();
  } catch (error) {
    errorResponse(res, 'Athenticate', 'server error', error);
    return;
  }
};
