// backend/src/controllers/google.controller.ts
import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { User } from '../../generated/prisma';
import { setTokenCookie } from '../utils/tokenCookie';
import { sendJsonResponse } from '../utils/response';

export class GoogleAuthController {
  static readonly callback = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const user = req.user as User;

    if (!user) {
      sendJsonResponse(res, 'UNAUTHORIZED', 'Google', 'user not connected');
      return;
    }

    const jwtToken = AuthService.signToken({ id: user.id, email: user.email });
    await AuthService.updateUserToken(user.id, jwtToken);

    setTokenCookie(res, jwtToken);

    const clientURL = process.env.CLIENT_URL ?? 'http://localhost:3000';
    res.redirect(`${clientURL}/`);
  };
}
