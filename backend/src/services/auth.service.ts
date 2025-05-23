// backend/src/services/auth.service.ts
import bcrypt from 'bcrypt';
import { User } from '../../generated/prisma';
import {
  signToken as generateToken,
  verifyToken as checkToken,
} from '../utils/jwt';
import { Response } from 'express';
import prismaNewClient from '../lib/prisma';
import { setTokenCookie } from '../utils/tokenCookie';

export class AuthService {
  static async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }

  static async verifyPassword(
    password: string,
    hash: string
  ): Promise<boolean> {
    try {
      return await bcrypt.compare(password, hash);
    } catch {
      return false;
    }
  }

  static signToken(user: Pick<User, 'id' | 'email'>): string {
    return generateToken({
      userId: user.id,
      email: user.email,
    });
  }

  static verifyToken(token: string): { userId: string; email: string } | null {
    try {
      const decoded = checkToken(token);
      return {
        userId: decoded.userId,
        email: decoded.email,
      };
    } catch {
      return null;
    }
  }

  static async updateUserToken(id: string, jwtToken: string): Promise<void> {
    await prismaNewClient.user.update({
      where: { id },
      data: {
        jwtToken,
      },
    });
  }

  static sanitizedUser(
    user: User
  ): Omit<
    User,
    | 'password'
    | 'jwtToken'
    | 'googleId'
    | 'googleAccessToken'
    | 'googleRefreshToken'
  > {
    const {
      googleId: _googleId,
      password: _password,
      jwtToken: _jwtToken,
      googleAccessToken: _googleAccessToken,
      googleRefreshToken: _googleRefreshToken,
      ...userCleanUp
    } = user;
    return userCleanUp;
  }

  static async isUsedEmailOrUsername(
    email: string,
    username: string
  ): Promise<string | null> {
    if (email && (await prismaNewClient.user.findUnique({ where: { email } }))) {
      return 'already used email';
    }

    if (username && await prismaNewClient.user.findUnique({ where: { username } })) {
      return 'already used username';
    }

    return null;
  }

  static async setSessionToken(
    res: Response,
    id: string,
    email: string
  ): Promise<void> {
    const jwtToken = AuthService.signToken({ id, email });
    await AuthService.updateUserToken(id, jwtToken);
    setTokenCookie(res, jwtToken);
  }

  static async buildData(
    data: Partial<User>,
    user: User,
    currentUser: User
  ): Promise<Partial<User>> {
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
    } = data;

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
      updateData.email = email ?? user.email;
      updateData.username = username ?? user.username;
    }

    return updateData;
  }
}
