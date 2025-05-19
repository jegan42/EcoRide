// backend/src/controllers/auth.controller.ts
import { Request, Response } from 'express';
import prismaNewClient from '../lib/prisma';
import { AuthService } from '../services/auth.service';
import { clearTokenCookie, setTokenCookie } from '../utils/tokenCookie';
import { isId } from '../utils/validation';
import { requireUser } from '../utils/request';

export class AuthController {
  static readonly signup = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    if (!AuthService.isSignUpInputValid(req.body)) {
      res.status(400).json({ message: 'Missing required fields' });
      return;
    }

    const { email, password, firstName, lastName, username, phone, address } =
      req.body;

    try {
      const existingUserEmail = await prismaNewClient.user.findUnique({
        where: { email },
      });
      if (existingUserEmail) {
        res.status(409).json({ message: 'Email already in use' });
        return;
      }

      const existingUserUsername = await prismaNewClient.user.findUnique({
        where: { username },
      });
      if (existingUserUsername) {
        res.status(409).json({ message: 'Username already in use' });
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

      res.status(201).json({ user: AuthService.sanitizedUser(newUser) });
    } catch {
      res.status(500).json({ message: 'Server error during signup' });
    }
  };

  static readonly signin = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    if (!AuthService.isSignInInputValid(req.body)) {
      res.status(400).json({ message: 'Missing required fields' });
      return;
    }

    const { email, password } = req.body;

    try {
      const user = await prismaNewClient.user.findUnique({ where: { email } });
      if (!user?.password) {
        res.status(401).json({ message: 'Invalid credentials' });
        return;
      }

      const isValidPassword = await AuthService.verifyPassword(
        password,
        user.password
      );
      if (!isValidPassword) {
        res.status(401).json({ message: 'Invalid credentials' });
        return;
      }

      const jwtToken = AuthService.signToken({ id: user.id, email });
      await AuthService.updateUserToken(user.id, jwtToken);
      setTokenCookie(res, jwtToken);

      res.status(200).json({ user: AuthService.sanitizedUser(user) });
    } catch {
      res.status(500).json({ message: 'Server error during signin' });
    }
  };

  static readonly getMe = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const user = requireUser(req, res);
    if (!user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    if (!isId(user.id)) {
      res.status(400).json({ message: 'Invalid ID' });
      return;
    }
    try {
      const userData = await prismaNewClient.user.findUnique({
        where: { id: user.id },
      });
      if (!userData) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      res.status(200).json({ user: AuthService.sanitizedUser(userData) });
    } catch {
      res.status(500).json({ message: 'Server error during getMe' });
    }
  };

  static readonly update = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { id } = req.body;

    if (!id || Object.keys(req.body).length < 2) {
      res.status(400).json({ message: 'No fields to update' });
      return;
    }

    if (AuthService.isUpdateInputValid(req.body)) {
      res.status(400).json({ message: 'Invalid or missing fields' });
      return;
    }

    if (!isId(id)) {
      res.status(400).json({ message: 'Invalid ID' });
      return;
    }

    const currentUser = requireUser(req, res);
    if (!currentUser) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    if (currentUser.id !== id && !currentUser.role.includes('admin')) {
      res.status(403).json({ message: 'Unauthorized' });
      return;
    }

    try {
      const user = await prismaNewClient.user.findUnique({
        where: { id },
      });
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      const updateData = await AuthService.buildUpdateData(
        req.body,
        currentUser,
        user
      );
      if (typeof updateData === 'string') {
        res.status(409).json({ message: updateData });
        return;
      }
      if (!updateData) {
        res.status(400).json({ message: 'Request is empty' });
        return;
      }

      const updatedUser = await prismaNewClient.user.update({
        where: { id },
        data: updateData,
      });

      updatedUser.jwtToken && setTokenCookie(res, updatedUser.jwtToken);
      res.status(200).json({ user: AuthService.sanitizedUser(updatedUser) });
    } catch {
      res.status(500).json({ message: 'Server error during updateUser' });
    }
  };

  static readonly signout = async (
    _req: Request,
    res: Response
  ): Promise<void> => {
    clearTokenCookie(res);
    res.status(200).json({ message: 'Signed out successfully' });
  };
}
