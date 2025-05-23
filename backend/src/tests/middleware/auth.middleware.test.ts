// backend/tests/middleware/auth.middleware.test.ts
import { authenticate } from '../../middleware/auth.middleware';
import { AuthService } from '../../services/auth.service';
import prismaNewClient from '../../lib/prisma';
import { sendJsonResponse } from '../../utils/response';

jest.mock('../../lib/prisma', () => ({
  user: {
    findUnique: jest.fn(),
  },
}));
jest.mock('../../utils/response', () => ({
  sendJsonResponse: jest.fn(),
}));
jest.mock('../../services/auth.service', () => ({
  AuthService: {
    verifyToken: jest.fn(),
  },
}));

describe('authenticate middleware', () => {
  let req: any;
  let res: any;
  let next: jest.Mock;

  beforeEach(() => {
    req = {
      headers: {},
      cookies: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();

    (sendJsonResponse as jest.Mock).mockClear();
    (prismaNewClient.user.findUnique as jest.Mock).mockClear();
    (AuthService.verifyToken as jest.Mock).mockClear();
    (prismaNewClient.user.findUnique as jest.Mock).mockClear();
  });

  test('missing token returns UNAUTHORIZED', async () => {
    await authenticate(req, res, next);

    expect(sendJsonResponse).toHaveBeenCalledWith(
      res,
      'UNAUTHORIZED',
      'Athenticate',
      'missing token'
    );
    expect(next).not.toHaveBeenCalled();
  });

  test('invalid token returns UNAUTHORIZED', async () => {
    req.cookies.jwtToken = 'some.invalid.token';

    (AuthService.verifyToken as jest.Mock).mockReturnValue(null);

    await authenticate(req, res, next);

    expect(sendJsonResponse).toHaveBeenCalledWith(
      res,
      'UNAUTHORIZED',
      'Athenticate',
      'invalid token'
    );
    expect(next).not.toHaveBeenCalled();
  });

  test('user not connected returns UNAUTHORIZED', async () => {
    req.cookies.jwtToken = 'valid.token.here';

    (AuthService.verifyToken as jest.Mock).mockReturnValue({
      userId: 'user123',
    });
    (prismaNewClient.user.findUnique as jest.Mock).mockResolvedValue(null);

    await authenticate(req, res, next);

    expect(prismaNewClient.user.findUnique).toHaveBeenCalledWith({
      where: { id: 'user123' },
    });

    expect(sendJsonResponse).toHaveBeenCalledWith(
      res,
      'UNAUTHORIZED',
      'Athenticate',
      'user not connected'
    );
    expect(next).not.toHaveBeenCalled();
  });

  test('server error returns ERROR response', async () => {
    req.cookies.jwtToken = 'valid.token.here';

    (AuthService.verifyToken as jest.Mock).mockReturnValue({
      userId: 'user123',
    });
    (prismaNewClient.user.findUnique as jest.Mock).mockRejectedValue(
      new Error('DB failure')
    );

    await authenticate(req, res, next);

    expect(sendJsonResponse).toHaveBeenCalledWith(
      res,
      'ERROR',
      'Athenticate',
      'server error',
      undefined,
      undefined,
      expect.any(Error)
    );
    expect(next).not.toHaveBeenCalled();
  });

  test('valid token and user calls next()', async () => {
    req.cookies.jwtToken = 'valid.token.here';

    const fakeUser = { id: 'user123', email: 'test@example.com' };

    (AuthService.verifyToken as jest.Mock).mockReturnValue({
      userId: 'user123',
    });
    (prismaNewClient.user.findUnique as jest.Mock).mockResolvedValue(fakeUser);

    await authenticate(req, res, next);

    expect(req.user).toBe(fakeUser);
    expect(next).toHaveBeenCalled();
    expect(sendJsonResponse).not.toHaveBeenCalled();
  });

  it('should extract token from Authorization header and authenticate user', async () => {
    req = {
      headers: {
        authorization: 'Bearer test.jwt.token',
      },
      cookies: {},
    };
    // Mock verifyToken to simulate valid token
    (AuthService.verifyToken as jest.Mock).mockReturnValue({
      userId: 'user-123',
      email: 'user@test.com',
    });

    // Mock user found in DB
    (prismaNewClient.user.findUnique as jest.Mock).mockResolvedValue({
      id: 'user-123',
      email: 'user@test.com',
      role: ['passenger'],
    });

    await authenticate(req, res, next);

    expect(AuthService.verifyToken).toHaveBeenCalledWith('test.jwt.token');
    expect(prismaNewClient.user.findUnique).toHaveBeenCalledWith({
      where: { id: 'user-123' },
    });
    expect(req.user).toBeDefined();
    expect(next).toHaveBeenCalled();
  });
});
