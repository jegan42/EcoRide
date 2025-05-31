// backend/src/tests/controllers/google.controller.test.ts
import { Request, Response } from 'express';
import { GoogleAuthController } from '../../controllers/google.controller';
import { AuthService } from '../../services/auth.service';
import { unauthorizedResponse } from '../../utils/response';

jest.mock('../../services/auth.service');

jest.mock('../../utils/tokenCookie');
jest.mock('../../utils/response');

describe('GoogleAuthController.callback', () => {
  const res = {
    redirect: jest.fn(),
  } as unknown as Response;

  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...OLD_ENV };
    (AuthService.setSessionToken as jest.Mock) = jest.fn();
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it('should respond with UNAUTHORIZED if no user is in request', async () => {
    const req = {} as Request;

    await GoogleAuthController.callback(req, res);

    expect(unauthorizedResponse).toHaveBeenCalledWith(
      res,
      'Google',
      'user not connected'
    );
    expect(AuthService.signToken).not.toHaveBeenCalled();
    expect(res.redirect).not.toHaveBeenCalled();
  });

  it('should call setSessionToken and redirect to client URL', async () => {
    const user = { id: '123', email: 'user@example.com' };
    const req = { user } as unknown as Request;

    await GoogleAuthController.callback(req, res);

    expect(AuthService.setSessionToken).toHaveBeenCalledWith(
      res,
      user.id,
      user.email
    );

    expect(res.redirect).toHaveBeenCalledWith('http://localhost:5173/');
  });

  it('should return unauthorized response if no user', async () => {
    const req = {} as Request;
    const mockRes = {
      redirect: jest.fn(),
    } as unknown as Response;

    await GoogleAuthController.callback(req, mockRes);

    expect(unauthorizedResponse).toHaveBeenCalledWith(
      mockRes,
      'Google',
      'user not connected'
    );

    expect(AuthService.setSessionToken).not.toHaveBeenCalled();
    expect(mockRes.redirect).not.toHaveBeenCalled();
  });

  it('should redirect to CLIENT_URL if defined', async () => {
    process.env.CLIENT_URL = 'https://myapp.com';
    const user = { id: '321', email: 'another@example.com' };
    const req = { user } as unknown as Request;
    await GoogleAuthController.callback(req, res);

    expect(res.redirect).toHaveBeenCalledWith('https://myapp.com/');
  });

  it('should fallback to localhost:3000 if CLIENT_URL is not defined', async () => {
    delete process.env.CLIENT_URL;
    const user = { id: '999', email: 'fallback@example.com' };
    const req = { user } as unknown as Request;

    await GoogleAuthController.callback(req, res);

    expect(res.redirect).toHaveBeenCalledWith('http://localhost:3000/');
  });
});
