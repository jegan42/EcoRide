// backend/src/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import prismaNewClient from '../lib/prisma';
import { sendJsonResponse } from '../utils/response';

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
    sendJsonResponse(res, 'UNAUTHORIZED', 'Athenticate', 'missing token');
    return;
  }

  const decoded = AuthService.verifyToken(jwtToken);
  if (!decoded?.userId) {
    sendJsonResponse(res, 'UNAUTHORIZED', 'Athenticate', 'invalid token');
    return;
  }

  try {
    const user = await prismaNewClient.user.findUnique({
      where: {
        id: decoded.userId,
      },
    });
    if (!user) {
      sendJsonResponse(
        res,
        'UNAUTHORIZED',
        'Athenticate',
        'user not connected'
      );
      return;
    }

    req.user = user;

    next();
  } catch (error) {
    sendJsonResponse(
      res,
      'ERROR',
      'Athenticate',
      'server error',
      undefined,
      undefined,
      error
    );
    return;
  }
};
