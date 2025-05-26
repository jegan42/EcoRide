// backend/src/middleware/csrf.middleware.test.ts
import { csrfErrorHandler } from '../../middleware/csrf.middleware';
import { Request, Response, NextFunction } from 'express';
import { forbiddenResponse } from '../../utils/response';

jest.mock('csurf', () => jest.fn(() => 'mocked-csrf-middleware'));
jest.mock('../../utils/response', () => ({
  forbiddenResponse: jest.fn(),
}));

describe('csrf.middleware', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
    jest.clearAllMocks();
    jest.doMock('../../utils/response', () => ({
      forbiddenResponse: jest.fn(),
    }));
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  describe('csrfProtection', () => {
    it('should be disabled (empty array) when NODE_ENV is "test"', () => {
      process.env.NODE_ENV = 'test';
      const {
        csrfProtection: testCsrfProtection,
      } = require('../../middleware/csrf.middleware');
      expect(testCsrfProtection).toEqual([]);
    });

    it('should return csrf middleware when NODE_ENV is "production"', () => {
      process.env.NODE_ENV = 'production';
      jest.resetModules();

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
      expect(forbiddenResponse).toHaveBeenCalledWith(
        res,
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

      const { forbiddenResponse } = require('../../utils/response');
      expect(forbiddenResponse).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(err);
    });
  });
});
