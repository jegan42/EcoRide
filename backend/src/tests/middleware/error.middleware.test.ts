// backend/src/tests/middleware/error.middleware.test.ts
import { Request, Response, NextFunction } from 'express';
import { errorHandler } from '../../middleware/error.middleware';
import { sendJsonResponse } from '../../utils/response';

jest.mock('../../utils/response', () => ({
  sendJsonResponse: jest.fn(),
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

  it('should call sendJsonResponse with expected parameters', () => {
    const error = new Error('Test error');

    errorHandler(error, req, res, next);

    expect(sendJsonResponse).toHaveBeenCalledWith(
      res,
      'ERROR',
      'Middleware',
      'something went wrong',
      undefined,
      undefined,
      error
    );
  });

  it('should not call next()', () => {
    const error = new Error('Test error');

    errorHandler(error, req, res, next);

    expect(next).not.toHaveBeenCalled();
  });
});
