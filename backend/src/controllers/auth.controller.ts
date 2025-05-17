// backend/src/controllers/auth.controller.ts
import { Request, Response } from 'express';
import prismaNewClient from '../lib/prisma';
import { AuthService } from '../services/auth.service';
import { User } from '../../generated/prisma';
import { clearTokenCookie, setTokenCookie } from '../utils/tokenCookie';

export class AuthController {
  static readonly signup = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { email, password, firstName, lastName, username, phone, address } =
      req.body;

    const invalidInput = AuthService.checkCreateInput(req.body);
    if (invalidInput) {
      res.status(400).json({ message: invalidInput });
      return;
    }

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

      const { password: _, ...userWithoutPassword } = newUser;
      res.status(201).json({ user: { ...userWithoutPassword, jwtToken } });
    } catch {
      res.status(500).json({ message: 'Server error during signup' });
    }
  };

  static readonly signin = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { email, password } = req.body;

    try {
      const user = await prismaNewClient.user.findUnique({ where: { email } });
      if (!user?.password) {
        res.status(401).json({ message: 'Invalid credentials' });
        return;
      }

      const isValid = await AuthService.verifyPassword(password, user.password);
      if (!isValid) {
        res.status(401).json({ message: 'Invalid credentials' });
        return;
      }

      const jwtToken = AuthService.signToken({ id: user.id, email });
      await AuthService.updateUserToken(user.id, jwtToken);
      setTokenCookie(res, jwtToken);

      const { password: _, jwtToken: _jwtToken, ...userWithoutPassword } = user;

      res.status(200).json({ user: { ...userWithoutPassword, jwtToken } });
    } catch {
      res.status(500).json({ message: 'Server error during signin' });
    }
  };

  static readonly getMe = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const user = req.user as User;

    if (!user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const userData = await prismaNewClient.user.findUnique({
      where: { id: user.id },
    });
    if (!userData) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const {
      password: _,
      jwtToken: _jwtToken,
      ...userWithoutPassword
    } = userData;

    res.status(200).json({ user: userWithoutPassword });
  };

  static readonly updateUser = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { id } = req.body;

    try {
      const user = await prismaNewClient.user.findUnique({
        where: { id },
      });

      if (!user) {
        res.status(400).json({ message: 'User not found' });
        return;
      }
    } catch {
      res.status(400).json({ message: 'Error checking user existence' });
      return;
    }

    const currentUser = req.user as User;

    if (!id || Object.keys(req.body).length < 2) {
      res.status(400).json({ message: 'Field is required' });
      return;
    }

    if (currentUser.id !== id && !currentUser?.role.includes('admin')) {
      res.status(403).json({ message: 'Unauthorized' });
      return;
    }

    try {
      const originalUser = await prismaNewClient.user.findUnique({
        where: { id },
      });
      if (!originalUser) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      const updateData = await AuthService.buildUpdateData(
        req.body,
        currentUser,
        originalUser
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

      const { password: _, ...userWithoutPassword } = updatedUser;
      res.status(200).json({ user: userWithoutPassword });
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
