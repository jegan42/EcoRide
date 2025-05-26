// backend/src/tests/middleware/authorize.middleware.test.ts
import { Request, Response, NextFunction } from 'express';
import { authorize } from '../../middleware/authorize.middleware';
import { forbiddenResponse } from '../../utils/response';

jest.mock('../../utils/response', () => ({
  forbiddenResponse: jest.fn(),
}));

describe('authorize middleware', () => {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as unknown as Response;

  const next = jest.fn() as NextFunction;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return "no roles" if user is not set', () => {
    const req = {} as Request;

    const middleware = authorize(['ADMIN']);
    middleware(req, res, next);

    expect(forbiddenResponse).toHaveBeenCalledWith(
      res,
      'Authorize',
      'no roles'
    );
    expect(next).not.toHaveBeenCalled();
  });

  it('should return "no roles" if user.role is not an array', () => {
    const req = { user: { role: 'ADMIN' } } as unknown as Request;

    const middleware = authorize(['ADMIN']);
    middleware(req, res, next);

    expect(forbiddenResponse).toHaveBeenCalledWith(
      res,
      'Authorize',
      'no roles'
    );
    expect(next).not.toHaveBeenCalled();
  });

  it('should return "insufficient permissions" if role is missing', () => {
    const req = { user: { role: ['USER'] } } as unknown as Request;

    const middleware = authorize(['ADMIN']);
    middleware(req, res, next);

    expect(forbiddenResponse).toHaveBeenCalledWith(
      res,
      'Authorize',
      'insufficient permissions'
    );
    expect(next).not.toHaveBeenCalled();
  });

  it('should call next() if user has required role', () => {
    const req = { user: { role: ['USER', 'ADMIN'] } } as unknown as Request;

    const middleware = authorize(['ADMIN']);
    middleware(req, res, next);

    expect(forbiddenResponse).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });
});
