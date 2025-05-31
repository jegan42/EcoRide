// backend/src/test/passport/google.strategy.test.ts
import passport from 'passport';
import {
  googleVerifyCallback,
  setupGoogleStrategy,
} from '../../passport/google.strategy';
import prismaNewClient from '../../lib/prisma';
import { AuthService } from '../../services/auth.service';

// Mock Prisma client and AuthService
jest.mock('../../lib/prisma', () => ({
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
}));
jest.mock('../../services/auth.service', () => ({
  AuthService: {
    signToken: jest.fn(),
    updateUserToken: jest.fn(),
  },
}));

describe('google.strategy', () => {
  beforeAll(() => {
    // Simuler les variables d'env nécessaires
    process.env.GOOGLE_CLIENT_ID = 'fake-client-id';
    process.env.GOOGLE_CLIENT_SECRET = 'fake-client-secret';
    process.env.GOOGLE_CALLBACK_URL = 'http://localhost/callback';
  });
  const done = jest.fn();

  const mockProfile = {
    id: 'google-id-123',
    emails: [{ value: 'test@example.com' }],
    displayName: 'John Doe',
    name: {
      givenName: 'John',
      familyName: 'Doe',
    },
    username: 'johnny',
    photos: [{ value: 'http://avatar.url' }],
  } as any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return error if no email in profile', async () => {
    const profileNoEmail = { ...mockProfile, emails: [] };
    await googleVerifyCallback(
      {} as any,
      'access-token',
      'refresh-token',
      profileNoEmail,
      done
    );
    expect(done).toHaveBeenCalledWith(expect.any(Error), undefined);
  });

  it('should find existing user and update token', async () => {
    (prismaNewClient.user.findUnique as jest.Mock).mockResolvedValue({
      id: 'user-id-1',
      email: 'test@example.com',
    });
    (AuthService.signToken as jest.Mock).mockReturnValue('jwt-token');
    (AuthService.updateUserToken as jest.Mock).mockResolvedValue(undefined);

    await googleVerifyCallback(
      {} as any,
      'access-token',
      'refresh-token',
      mockProfile,
      done
    );

    expect(prismaNewClient.user.findUnique).toHaveBeenCalledWith({
      where: { googleId: 'google-id-123' },
    });
    expect(prismaNewClient.user.create).not.toHaveBeenCalled();
    expect(AuthService.signToken).toHaveBeenCalledWith({
      id: 'user-id-1',
      email: 'test@example.com',
    });
    expect(AuthService.updateUserToken).toHaveBeenCalledWith(
      'user-id-1',
      'jwt-token'
    );
    expect(done).toHaveBeenCalledWith(null, {
      id: 'user-id-1',
      email: 'test@example.com',
    });
  });

  it('should create user if not found and update token', async () => {
    (prismaNewClient.user.findUnique as jest.Mock).mockResolvedValue(null);
    (prismaNewClient.user.create as jest.Mock).mockResolvedValue({
      id: 'user-id-2',
      email: 'test@example.com',
    });
    (AuthService.signToken as jest.Mock).mockReturnValue('jwt-token');
    (AuthService.updateUserToken as jest.Mock).mockResolvedValue(undefined);

    await googleVerifyCallback(
      {} as any,
      'access-token',
      'refresh-token',
      mockProfile,
      done
    );

    expect(prismaNewClient.user.findUnique).toHaveBeenCalledWith({
      where: { googleId: 'google-id-123' },
    });
    expect(prismaNewClient.user.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          googleId: 'google-id-123',
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe',
        }),
      })
    );
    expect(AuthService.signToken).toHaveBeenCalledWith({
      id: 'user-id-2',
      email: 'test@example.com',
    });
    expect(AuthService.updateUserToken).toHaveBeenCalledWith(
      'user-id-2',
      'jwt-token'
    );
    expect(done).toHaveBeenCalledWith(null, {
      id: 'user-id-2',
      email: 'test@example.com',
    });
  });

  it('should handle error thrown inside verify callback', async () => {
    (prismaNewClient.user.findUnique as jest.Mock).mockRejectedValue(
      new Error('DB error')
    );

    await googleVerifyCallback(
      {} as any,
      'access-token',
      'refresh-token',
      mockProfile,
      done
    );

    expect(done).toHaveBeenCalledWith(expect.any(Error), undefined);
  });

  it('should setup google strategy in passport', () => {
    setupGoogleStrategy();

    // Check if the GoogleStrategy is registered
    const strategies = (passport as any)._strategies;
    expect(strategies.google).toBeDefined();

    // Check serializeUser and deserializeUser are set
    expect(typeof (passport as any)._serializers[0]).toBe('function');
    expect(typeof (passport as any)._deserializers[0]).toBe('function');
  });
});
describe('Google Strategy serialize/deserialize user', () => {
  beforeAll(() => {
    process.env.GOOGLE_CLIENT_ID = 'fake-client-id';
    process.env.GOOGLE_CLIENT_SECRET = 'fake-client-secret';
    process.env.GOOGLE_CALLBACK_URL = 'http://localhost/callback';

    setupGoogleStrategy();
  });

  it('should serialize user', (done) => {
    const user = { id: 'user-id-123' };
    // Appelle manuellement serializeUser
    const serializeFn = (passport as any)._serializers[0];
    serializeFn(user, (err: Error | null, id: string) => {
      expect(err).toBeNull();
      expect(id).toBe(user.id);
      done();
    });
  });

  it('should deserialize user', async () => {
    (prismaNewClient.user.findUnique as jest.Mock).mockResolvedValue({
      id: 'user-id-123',
    });

    // Appelle manuellement deserializeUser
    const deserializeFn = (passport as any)._deserializers[0];

    const doneMock = jest.fn();

    await deserializeFn('user-id-123', doneMock);

    expect(prismaNewClient.user.findUnique).toHaveBeenCalledWith({
      where: { id: 'user-id-123' },
    });
    expect(doneMock).toHaveBeenCalledWith(null, { id: 'user-id-123' });
  });
});

describe('additionnal test', () => {
  it('should handle missing displayName, name, username, and photos correctly', async () => {
    const incompleteProfile = {
      id: 'google-id-123',
      emails: [{ value: 'test@example.com' }],
      // displayName missing
      // name missing
      // username missing
      // photos missing
    };

    (prismaNewClient.user.findUnique as jest.Mock).mockResolvedValue(null);
    (prismaNewClient.user.create as jest.Mock).mockResolvedValue({
      id: 'user-id-123',
      email: 'test@example.com',
    });
    (AuthService.signToken as jest.Mock).mockReturnValue('jwt-token');
    (AuthService.updateUserToken as jest.Mock).mockResolvedValue(undefined);

    const doneMock = jest.fn();

    await googleVerifyCallback(
      {} as any,
      'access-token',
      'refresh-token',
      incompleteProfile as any,
      doneMock
    );

    expect(doneMock).toHaveBeenCalledWith(
      null,
      expect.objectContaining({
        id: 'user-id-123',
        email: 'test@example.com',
      })
    );
  });
});
