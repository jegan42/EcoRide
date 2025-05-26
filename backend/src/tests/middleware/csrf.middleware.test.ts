// backend/src/middleware/csrf.middleware.test.ts
import { csrfErrorHandler } from '../../middleware/csrf.middleware';
import { Request, Response, NextFunction } from 'express';
import { sendJsonResponse } from '../../utils/response';

jest.mock('csurf', () => jest.fn(() => 'mocked-csrf-middleware'));
jest.mock('../../utils/response', () => ({
  sendJsonResponse: jest.fn(),
}));

describe('csrf.middleware', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules(); // Clear cache
    process.env = { ...OLD_ENV }; // Reset env
    jest.clearAllMocks();
    jest.doMock('../../utils/response', () => ({
      sendJsonResponse: jest.fn(),
    }));
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  describe('csrfProtection', () => {
    it('should be disabled (empty array) when NODE_ENV is "test"', () => {
      process.env.NODE_ENV = 'test';
      // Re-import to apply new env
      const {
        csrfProtection: testCsrfProtection,
      } = require('../../middleware/csrf.middleware');
      expect(testCsrfProtection).toEqual([]);
    });

    it('should return csrf middleware when NODE_ENV is "production"', () => {
      process.env.NODE_ENV = 'production';
      jest.resetModules();

      // Mock csrf juste après resetModules
      const mockCsurf = jest.fn(() => 'mocked-csrf-middleware');
      jest.doMock('csurf', () => mockCsurf);

      const {
        csrfProtection: prodCsrfProtection,
      } = require('../../middleware/csrf.middleware');

      expect(prodCsrfProtection).toBe('mocked-csrf-middleware');
      expect(mockCsurf).toHaveBeenCalledWith({
        cookie: {
          httpOnly: true,
          secure: true,
          sameSite: 'lax',
        },
      });
    });
  });

  describe('csrfErrorHandler', () => {
    const req = {} as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
    const next = jest.fn() as NextFunction;

    it('should send CSRF error response when EBADCSRFTOKEN error occurs', () => {
      const err = { code: 'EBADCSRFTOKEN' };
      csrfErrorHandler(err, req, res, next);
      expect(sendJsonResponse).toHaveBeenCalledWith(
        res,
        'FORBIDDEN',
        'CSRF',
        'invalid token'
      );
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next() with error if error is not CSRF related', () => {
      const { csrfErrorHandler } = require('../../middleware/csrf.middleware');
      const req = {} as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;
      const next = jest.fn();

      const err = { code: 'SOME_OTHER_ERROR' };
      csrfErrorHandler(err, req, res, next);

      const { sendJsonResponse } = require('../../utils/response');
      expect(sendJsonResponse).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(err);
    });
  });
});
