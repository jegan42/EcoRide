// backend/src/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import prismaNewClient from '../lib/prisma';

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;

  const jwtToken = authHeader?.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : req.cookies.jwtToken;
  if (!jwtToken) {
    res.status(401).json({ message: 'Missing token' });
    return;
  }

  const decoded = AuthService.verifyToken(jwtToken);
  if (!decoded?.userId) {
    res.status(403).json({ message: 'Invalid token' });
    return;
  }

  try {
    const user = await prismaNewClient.user.findUnique({
      where: {
        id: decoded.userId,
      },
    });
    if (!user) {
      res.status(401).json({ message: 'User not found' });
      return;
    }

    req.user = user;

    next();
  } catch {
    res.status(403).json({
      message: 'Invalid or expired token',
    });
    return;
  }
};
