// backend/src/services/auth.service.ts
import bcrypt from 'bcrypt';
import { User } from '../../generated/prisma';
import {
  signToken as generateToken,
  verifyToken as checkToken,
} from '../utils/jwt';
import prismaNewClient from '../lib/prisma';
import {
  isEmail,
  isCorrectPassword,
  isCorrectUsername,
} from '../utils/validation';

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

  static isSignUpInputValid(user: User): boolean {
    return Boolean(
      user.email &&
        user.password &&
        user.firstName &&
        user.lastName &&
        user.username
    );
  }

  static isSignInInputValid(user: User): boolean {
    return Boolean(user.email && user.password);
  }

  static isUpdateInputValid(user: User): boolean {
    return Boolean(
      user.email &&
        isEmail(user.email) &&
        user.password &&
        isCorrectPassword(user.password) &&
        user.username &&
        isCorrectUsername(user.username)
    );
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

  static async isUsed(email: string, username: string): Promise<string | null> {
    const existingUserEmail = email
      ? await prismaNewClient.user.findUnique({ where: { email } })
      : null;

    if (existingUserEmail) {
      return 'already used email';
    }

    const existingUserUsername = username
      ? await prismaNewClient.user.findUnique({ where: { username } })
      : null;

    if (existingUserUsername) {
      return 'already used username';
    }
    return null;
  }
}
