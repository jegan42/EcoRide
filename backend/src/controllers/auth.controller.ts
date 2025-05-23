// backend/src/controllers/auth.controller.ts
import { Request, Response } from 'express';
import prismaNewClient from '../lib/prisma';
import { AuthService } from '../services/auth.service';
import { clearTokenCookie, setTokenCookie } from '../utils/tokenCookie';
import { sendJsonResponse } from '../utils/response';
import { User } from '../../generated/prisma';

export class AuthController {
  static readonly signup = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const {
        firstName,
        lastName,
        username,
        email,
        password,
        phone,
        address,
        avatar,
      } = req.body;

      const alReadyUsed = await AuthService.isUsedEmailOrUsername(
        email,
        username
      );
      if (alReadyUsed !== null) {
        sendJsonResponse(res, 'CONFLICT', 'Auth', alReadyUsed);
        return;
      }

      const user = await prismaNewClient.user.create({
        data: {
          firstName,
          lastName,
          username,
          email,
          password: await AuthService.hashPassword(password),
          phone,
          address,
          avatar: avatar ?? '',
          role: ['passenger'],
          credits: 20,
        },
      });

      await AuthService.setSessionToken(res, user.id, email);

      sendJsonResponse(
        res,
        'SUCCESS_CREATE',
        'Auth',
        'signup',
        'user',
        AuthService.sanitizedUser(user)
      );
    } catch (error) {
      sendJsonResponse(
        res,
        'ERROR',
        'Auth',
        'failed to signup',
        undefined,
        undefined,
        error
      );
    }
  };

  static readonly signin = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { email, password } = req.body;

      const user = await prismaNewClient.user.findUnique({ where: { email } });
      if (
        !user?.password ||
        !(await AuthService.verifyPassword(password, user.password))
      ) {
        sendJsonResponse(res, 'UNAUTHORIZED', 'Auth', 'invalid credentials');
        return;
      }

      await AuthService.setSessionToken(res, user.id, email);

      sendJsonResponse(
        res,
        'SUCCESS',
        'Auth',
        'signin',
        'user',
        AuthService.sanitizedUser(user)
      );
    } catch (error) {
      sendJsonResponse(
        res,
        'ERROR',
        'Auth',
        'failed to signin',
        undefined,
        undefined,
        error
      );
    }
  };

  static readonly getMe = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const user = req.user as User;

    sendJsonResponse(
      res,
      'SUCCESS',
      'Auth',
      'getMe',
      'user',
      AuthService.sanitizedUser(user)
    );
  };

  static readonly update = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { id } = req.body;

    if (Object.keys(req.body).length < 2) {
      sendJsonResponse(res, 'BAD_REQUEST', 'Auth', 'invalid or missing fields');
      return;
    }

    const currentUser = req.user as User;

    if (currentUser.id !== id && !currentUser.role.includes('admin')) {
      sendJsonResponse(res, 'FORBIDDEN', 'Auth', 'not own user');
      return;
    }

    try {
      const user = await prismaNewClient.user.findUnique({
        where: { id },
      });
      if (!user) {
        sendJsonResponse(res, 'NOT_FOUND', 'Auth', 'user not found');
        return;
      }

      const { username, email } = req.body;
      const alReadyUsed = await AuthService.isUsedEmailOrUsername(
        email,
        username
      );
      if (alReadyUsed !== null) {
        sendJsonResponse(res, 'CONFLICT', 'Auth', alReadyUsed);
        return;
      }

      const updateData = await AuthService.buildData(
        req.body,
        user,
        currentUser
      );

      const updatedUser = await prismaNewClient.user.update({
        where: { id },
        data: updateData,
      });

      updatedUser.jwtToken && setTokenCookie(res, updatedUser.jwtToken);

      sendJsonResponse(
        res,
        'SUCCESS',
        'Auth',
        'update',
        'user',
        AuthService.sanitizedUser(updatedUser)
      );
    } catch (error) {
      sendJsonResponse(
        res,
        'ERROR',
        'Auth',
        'failed to update',
        undefined,
        undefined,
        error
      );
    }
  };

  static readonly signout = async (
    _req: Request,
    res: Response
  ): Promise<void> => {
    clearTokenCookie(res);
    sendJsonResponse(res, 'SUCCESS', 'Auth', 'signout');
  };
}
