import type { Response } from 'express';
import bcrypt from 'bcrypt';
import { AuthService } from '../../services/auth.service';
import prismaNewClient from '../../lib/prisma';
import * as jwtUtils from '../../utils/jwt';
import { setTokenCookie } from '../../utils/tokenCookie';

jest.mock('../../lib/prisma', () => ({
  user: {
    findUnique: jest.fn(),
    update: jest.fn(),
  },
}));

jest.mock('../../utils/jwt', () => ({
  signToken: jest.fn(),
  verifyToken: jest.fn(),
}));

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

jest.mock('../../utils/tokenCookie', () => ({
  setTokenCookie: jest.fn(),
}));

afterEach(() => {
  jest.resetAllMocks(); // réinitialise tous les mocks
});

describe('setSessionToken', () => {
  it('should generate token, update user and set cookie', async () => {
    const mockRes = { cookie: jest.fn() } as Partial<Response> as Response;
    const mockToken = 'mock.jwt.token';

    // Spy sur la vraie méthode signToken pour mocker son retour
    jest.spyOn(AuthService, 'signToken').mockReturnValue(mockToken);

    (prismaNewClient.user.update as jest.Mock).mockResolvedValue(undefined);
    (setTokenCookie as jest.Mock).mockImplementation(() => {});

    await AuthService.setSessionToken(mockRes, 'user-id', 'user@example.com');

    expect(AuthService.signToken).toHaveBeenCalledWith({
      id: 'user-id',
      email: 'user@example.com',
    });

    expect(prismaNewClient.user.update).toHaveBeenCalledWith({
      where: { id: 'user-id' },
      data: { jwtToken: mockToken },
    });

    expect(setTokenCookie).toHaveBeenCalledWith(mockRes, mockToken);
  });
});


describe('AuthService', () => {
  describe('hashPassword & verifyPassword', () => {
    it('should hash and verify password correctly', async () => {
      const password = 'super-secret';
      const fakeHash = 'hashedPassword123';

      // mock les fonctions de bcrypt
      (bcrypt.hash as jest.Mock).mockResolvedValue(fakeHash);
      (bcrypt.compare as jest.Mock).mockImplementation((pwd, hash) => {
        return pwd === password && hash === fakeHash;
      });

      const hash = await AuthService.hashPassword(password);
      expect(hash).toBe(fakeHash);

      expect(await AuthService.verifyPassword(password, hash)).toBe(true);
      expect(await AuthService.verifyPassword('wrong-password', hash)).toBe(
        false
      );
    });
  });

  describe('signToken & verifyToken', () => {
    it('should call signToken and verifyToken correctly', () => {
      const fakeToken = 'jwt.token.here';
      const payload = { id: 'abc123', email: 'test@example.com' };

      jest.spyOn(AuthService, 'signToken').mockReturnValue(fakeToken);
      const token = AuthService.signToken(payload);
      expect(token).toBe(fakeToken);

      (jwtUtils.verifyToken as jest.Mock).mockReturnValue({
        userId: 'abc123',
        email: 'test@example.com',
      });
      const decoded = AuthService.verifyToken(fakeToken);
      expect(decoded).toEqual({
        userId: 'abc123',
        email: 'test@example.com',
      });

      (jwtUtils.verifyToken as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid');
      });
      const invalid = AuthService.verifyToken('bad.token');
      expect(invalid).toBeNull();
    });
  });

  describe('isUsedEmailOrUsername', () => {
    it('should detect already used email', async () => {
      (prismaNewClient.user.findUnique as jest.Mock).mockResolvedValueOnce({
        id: '1',
      });
      const result = await AuthService.isUsedEmailOrUsername(
        'test@example.com',
        ''
      );
      expect(result).toBe('already used email');
    });

    it('should detect already used username', async () => {
      (prismaNewClient.user.findUnique as jest.Mock).mockImplementation(
        ({ where }) => {
          if (where.email) return null;
          if (where.username) return { id: '1' };
          return null;
        }
      );

      const result = await AuthService.isUsedEmailOrUsername('', 'john_doe');
      expect(result).toBe('already used username');
    });

    it('should return null if both are available', async () => {
      (prismaNewClient.user.findUnique as jest.Mock).mockImplementation(
        () => null
      );

      const result = await AuthService.isUsedEmailOrUsername(
        'available@example.com',
        'new_user'
      );
      expect(result).toBeNull();
    });
  });

  describe('buildData', () => {
    const currentUser = {
      id: 'admin-1',
      role: ['admin'],
    } as any;

    const user = {
      id: 'user-1',
      firstName: 'Jane',
      lastName: 'Doe',
      phone: '123',
      address: 'Street',
      avatar: 'img.jpg',
      role: ['passenger'],
      email: 'jane@example.com',
      username: 'jane123',
      credits: 20,
    } as any;

    it('should build updateData with admin permissions', async () => {
      (bcrypt.hash as jest.Mock).mockResolvedValue('mocked-hash');

      const data = {
        firstName: 'New',
        password: 'newpass',
        role: ['driver'],
        credits: 100,
        email: 'new@example.com',
        username: 'newname',
      };

      const result = await AuthService.buildData(data, user, currentUser);
      expect(result.firstName).toBe('New');
      expect(result.email).toBe('new@example.com');
      expect(result.role).toContain('passenger');
      expect(result.role).toContain('driver');
      expect(result.password).toBe('mocked-hash');
    });
  });

  describe('sanitizedUser', () => {
    it('should remove sensitive fields', () => {
      const user = {
        id: 'user1',
        email: 'a@a.com',
        password: 'hashed',
        jwtToken: 'token',
        googleId: 'gid',
        googleAccessToken: 'access',
        googleRefreshToken: 'refresh',
        username: 'user',
      } as any;

      const sanitized = AuthService.sanitizedUser(user);
      expect(sanitized).not.toHaveProperty('password');
      expect(sanitized).not.toHaveProperty('jwtToken');
      expect(sanitized).not.toHaveProperty('googleId');
      expect(sanitized.username).toBe('user');
    });

    const currentUser = {
      id: 'admin-1',
      role: ['admin'],
    } as any;

    const user = {
      id: 'user-1',
      firstName: 'Jane',
      lastName: 'Doe',
      phone: '123',
      address: 'Street',
      avatar: 'img.jpg',
      role: ['passenger'],
      email: 'jane@example.com',
      username: 'jane123',
      credits: 20,
    } as any;

    it('should update role, credits, email, and username if provided', async () => {
      (bcrypt.hash as jest.Mock).mockResolvedValue('irrelevant-hash');

      const data = {
        role: ['driver', 'admin'], // doublon avec rôle déjà existant
        credits: 150,
        email: 'updated@example.com',
        username: 'updatedUser',
      };

      const result = await AuthService.buildData(data, user, currentUser);

      // Vérifie que les rôles sont fusionnés sans doublons
      expect(result.role?.sort((a, b) => a.localeCompare(b))).toEqual(
        ['admin', 'driver', 'passenger'].sort((a, b) => a.localeCompare(b))
      );
      expect(result.credits).toBe(150);
      expect(result.email).toBe('updated@example.com');
      expect(result.username).toBe('updatedUser');
    });

    it('should fallback to user data if values are not provided', async () => {
      const result = await AuthService.buildData({}, user, currentUser);

      expect(result.role).toEqual(user.role);
      expect(result.credits).toBe(user.credits);
      expect(result.email).toBe(user.email);
      expect(result.username).toBe(user.username);
    });
  });

  describe('AuthService.verifyPassword', () => {
    it('should return false if bcrypt.compare throws an error', async () => {
      // Simule une erreur dans bcrypt.compare
      (bcrypt.compare as jest.Mock).mockImplementation(() => {
        throw new Error('Something went wrong');
      });

      const result = await AuthService.verifyPassword(
        'testPassword',
        'fakeHash'
      );
      expect(result).toBe(false);
    });
  });
});
