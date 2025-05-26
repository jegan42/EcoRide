// backend/src/tests/utils/env.test.ts
import { getNodeEnv, getSessionSecret } from '../../utils/env';

describe('Environment variable utils', () => {
  afterEach(() => {
    delete process.env.NODE_ENV;
    delete process.env.SESSION_SECRET;
  });

  describe('getNodeEnv', () => {
    it('should return NODE_ENV if defined', () => {
      process.env.NODE_ENV = 'production';
      expect(getNodeEnv()).toBe('production');
    });

    it('should return default "development" if NODE_ENV is undefined', () => {
      expect(getNodeEnv()).toBe('development');
    });
  });

  describe('getSessionSecret', () => {
    it('should return SESSION_SECRET if defined', () => {
      process.env.SESSION_SECRET = 'super-secret';
      expect(getSessionSecret()).toBe('super-secret');
    });

    it('should return default "secret" if SESSION_SECRET is undefined', () => {
      expect(getSessionSecret()).toBe('secret');
    });
  });
});
