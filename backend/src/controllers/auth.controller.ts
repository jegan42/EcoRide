// backend/src/controllers/auth.controller.ts
import { Request, Response } from 'express';
import prismaNewClient from '../lib/prisma';
import { AuthService } from '../services/auth.service';
import { clearTokenCookie, setTokenCookie } from '../utils/tokenCookie';
import {
  badRequestResponse,
  conflictResponse,
  errorResponse,
  forbiddenResponse,
  notFoundResponse,
  successCreateResponse,
  successResponse,
  unauthorizedResponse,
} from '../utils/response';
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
        conflictResponse(res, 'Auth', alReadyUsed);
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

      successCreateResponse(
        res,
        'Auth',
        'signup',
        AuthService.sanitizedUser(user)
      );
    } catch (error) {
      errorResponse(res, 'Auth', 'failed to signup', error);
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
        unauthorizedResponse(res, 'Auth', 'invalid credentials');
        return;
      }

      await AuthService.setSessionToken(res, user.id, email);

      const updatedUser = await prismaNewClient.user.update({
        where: { id: user.id },
        data: { lastLogin: new Date() },
      });

      successResponse(
        res,
        'Auth',
        'signin',
        AuthService.sanitizedUser(updatedUser)
      );
    } catch (error) {
      errorResponse(res, 'Auth', 'failed to signin', error);
    }
  };

  static readonly getMe = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const user = req.user as User;

    successResponse(res, 'Auth', 'getMe', AuthService.sanitizedUser(user));
  };

  static readonly getUserById = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { id } = req.params;

    try {
      const user = await prismaNewClient.user.findUnique({
        where: { id },
      });
      if (!user) {
        notFoundResponse(res, 'Auth', 'user not found');
        return;
      }

      successResponse(
        res,
        'Auth',
        'getUserById',
        AuthService.sanitizedUser(user)
      );
    } catch (error) {
      errorResponse(res, 'Auth', 'failed to getUserById', error);
    }
  };

  static readonly update = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { id } = req.body;

    if (Object.keys(req.body).length < 2) {
      badRequestResponse(res, 'Auth', 'invalid or missing fields');
      return;
    }

    const currentUser = req.user as User;

    if (currentUser.id !== id && !currentUser.role.includes('admin')) {
      forbiddenResponse(res, 'Auth', 'not own user');
      return;
    }

    try {
      const user = await prismaNewClient.user.findUnique({
        where: { id },
      });
      if (!user) {
        notFoundResponse(res, 'Auth', 'user not found');
        return;
      }

      const { username, email } = req.body;
      const allReadyUsed = await AuthService.isUsedEmailOrUsername(
        email,
        username
      );
      if (allReadyUsed !== null) {
        conflictResponse(res, 'Auth', allReadyUsed);
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

      successResponse(
        res,
        'Auth',
        'update',
        AuthService.sanitizedUser(updatedUser)
      );
    } catch (error) {
      errorResponse(res, 'Auth', 'failed to update', error);
    }
  };

  static readonly signout = async (
    _req: Request,
    res: Response
  ): Promise<void> => {
    clearTokenCookie(res);
    successResponse(res, 'Auth', 'signout');
  };
}
