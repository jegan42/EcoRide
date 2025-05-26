// backend/src/tests/middleware/error.middleware.test.ts
import { Request, Response, NextFunction } from 'express';
import { errorHandler } from '../../middleware/error.middleware';
import { errorResponse } from '../../utils/response';

jest.mock('../../utils/response', () => ({
  errorResponse: jest.fn(),
}));

describe('errorHandler middleware', () => {
  const req = {} as Request;
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as unknown as Response;
  const next = jest.fn() as NextFunction;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call errorResponse with expected parameters', () => {
    const error = new Error('Test error');

    errorHandler(error, req, res, next);

    expect(errorResponse).toHaveBeenCalledWith(
      res,
      'Middleware',
      'something went wrong',
      error
    );
  });

  it('should not call next()', () => {
    const error = new Error('Test error');

    errorHandler(error, req, res, next);

    expect(next).not.toHaveBeenCalled();
  });
});
