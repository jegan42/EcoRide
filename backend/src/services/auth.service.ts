// backend/src/services/auth.service.ts
import bcrypt from 'bcrypt';
import { User } from '../../generated/prisma';
import {
  signToken as generateToken,
  verifyToken as checkToken,
} from '../utils/jwt';
import prismaNewClient from '../lib/prisma';

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

  static async updateUserToken(id: string, jwtToken: string): Promise<boolean> {
    try {
      await prismaNewClient.user.update({
        where: { id },
        data: {
          jwtToken,
        },
      });
      return true;
    } catch {
      return false;
    }
  }

  static checkCreateInput(data: User): string | null {
    return !data.email ||
      !data.password ||
      !data.firstName ||
      !data.lastName ||
      !data.username
      ? 'Missing required fields'
      : null;
  }

  static async buildUpdateData(
    body: any,
    currentUser: User,
    originalUser: User
  ): Promise<User | string | null> {
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
    } = body;

    const updateData: any = {
      firstName: firstName ?? originalUser.firstName,
      lastName: lastName ?? originalUser.lastName,
      phone: phone ?? originalUser.phone,
      address: address ?? originalUser.address,
      avatar: avatar ?? originalUser.avatar,
    };

    if (password) {
      updateData.password = await AuthService.hashPassword(password);
    }

    if (currentUser.role.includes('admin')) {
      updateData.role = role
        ? [...originalUser.role, ...role]
        : originalUser.role;
      updateData.credits = credits ?? originalUser.credits;

      const existingUserEmail = email
        ? await prismaNewClient.user.findUnique({ where: { email } })
        : null;

      if (existingUserEmail && existingUserEmail.id !== originalUser.id) {
        return 'Email already in use';
      }

      const existingUserUsername = username
        ? await prismaNewClient.user.findUnique({ where: { username } })
        : null;

      if (existingUserUsername && existingUserUsername.id !== originalUser.id) {
        return 'Username already in use';
      }

      updateData.email = email ?? originalUser.email;
      updateData.username = username ?? originalUser.username;
    }

    return updateData;
  }
}
