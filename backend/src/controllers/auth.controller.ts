// backend/src/controllers/auth.controller.ts
import { Request, Response } from 'express';
import prismaNewClient from '../lib/prisma';
import { AuthService } from '../services/auth.service';
import { clearTokenCookie, setTokenCookie } from '../utils/tokenCookie';
import { isId } from '../utils/validation';
import { requireUser } from '../utils/request';
import { sendJsonResponse } from '../utils/response';

export class AuthController {
  static readonly signup = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    if (!AuthService.isSignUpInputValid(req.body)) {
      sendJsonResponse(res, 'BAD_REQUEST', 'Auth', 'missing required fields');
      return;
    }

    const { email, password, firstName, lastName, username, phone, address } =
      req.body;

    try {
      const existingUserEmail = await prismaNewClient.user.findUnique({
        where: { email },
      });
      if (existingUserEmail) {
        sendJsonResponse(res, 'CONFLICT', 'Auth', 'email already used');
        return;
      }

      const existingUserUsername = await prismaNewClient.user.findUnique({
        where: { username },
      });
      if (existingUserUsername) {
        sendJsonResponse(res, 'CONFLICT', 'Auth', 'username already used');
        return;
      }

      const hashedPassword = await AuthService.hashPassword(password);
      const newUser = await prismaNewClient.user.create({
        data: {
          email,
          password: hashedPassword,
          firstName,
          lastName,
          username,
          phone,
          address,
          role: ['passenger'],
          credits: 20,
        },
      });

      const jwtToken = AuthService.signToken({ id: newUser.id, email });
      await AuthService.updateUserToken(newUser.id, jwtToken);
      setTokenCookie(res, jwtToken);

      sendJsonResponse(
        res,
        'SUCCESS_CREATE',
        'Auth',
        'created',
        'user',
        AuthService.sanitizedUser(newUser)
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
    if (!AuthService.isSignInInputValid(req.body)) {
      sendJsonResponse(res, 'BAD_REQUEST', 'Auth', 'missing required fields');
      return;
    }

    const { email, password } = req.body;

    try {
      const user = await prismaNewClient.user.findUnique({ where: { email } });
      if (!user?.password) {
        sendJsonResponse(res, 'UNAUTHORIZED', 'Auth', 'invalid credentials');
        return;
      }

      const isValidPassword = await AuthService.verifyPassword(
        password,
        user.password
      );
      if (!isValidPassword) {
        sendJsonResponse(res, 'UNAUTHORIZED', 'Auth', 'invalid credentials');
        return;
      }

      const jwtToken = AuthService.signToken({ id: user.id, email });
      await AuthService.updateUserToken(user.id, jwtToken);
      setTokenCookie(res, jwtToken);

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
    const user = requireUser(req, res);
    if (!user) return;

    if (!isId(user.id)) {
      sendJsonResponse(res, 'BAD_REQUEST', 'Auth', 'invalid ID');
      return;
    }
    try {
      const userData = await prismaNewClient.user.findUnique({
        where: { id: user.id },
      });
      if (!userData) {
        sendJsonResponse(res, 'NOT_FOUND', 'Auth', 'user not found');
        return;
      }

      sendJsonResponse(
        res,
        'SUCCESS',
        'Auth',
        'getMe',
        'user',
        AuthService.sanitizedUser(userData)
      );
    } catch (error) {
      sendJsonResponse(
        res,
        'ERROR',
        'Auth',
        'failed to getMe',
        undefined,
        undefined,
        error
      );
    }
  };

  static readonly update = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { id } = req.body;

    if (
      !id ||
      Object.keys(req.body).length < 2 ||
      AuthService.isUpdateInputValid(req.body)
    ) {
      sendJsonResponse(res, 'BAD_REQUEST', 'Auth', 'invalid or missing fields');
      return;
    }

    if (!isId(id)) {
      sendJsonResponse(res, 'BAD_REQUEST', 'Auth', 'invalid ID');
      return;
    }

    const currentUser = requireUser(req, res);
    if (!currentUser) return;

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

      const {
        firstName,
        lastName,
        username,
        email,
        password,
        phone,
        address,
        avatar,
        role,
        credits,
      } = req.body;

      const updateData: any = {
        firstName: firstName ?? user.firstName,
        lastName: lastName ?? user.lastName,
        phone: phone ?? user.phone,
        address: address ?? user.address,
        avatar: avatar ?? user.avatar,
      };

      if (password) {
        updateData.password = await AuthService.hashPassword(password);
      }

      if (currentUser.role.includes('admin')) {
        updateData.role = role
          ? Array.from(new Set([...user.role, ...role]))
          : user.role;
        updateData.credits = credits ?? user.credits;

        const alReadyUsed = await AuthService.isUsed(user.id, email, username);
        if (alReadyUsed !== null) {
          sendJsonResponse(res, 'CONFLICT', 'Auth', alReadyUsed);
        }

        updateData.email = email ?? user.email;
        updateData.username = username ?? user.username;
      }

      if (!updateData) {
        sendJsonResponse(res, 'BAD_REQUEST', 'Auth', 'Request is empty');
        return;
      }

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
