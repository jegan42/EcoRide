// backend/src/tests/utils/rateLimitConfig.test.ts
import { getRateLimitConfig } from '../../utils/rateLimitConfig';

describe('getRateLimitConfig', () => {
  it('should return production settings when not test', () => {
    const config = getRateLimitConfig('production');
    expect(config.max).toBe(25);
    expect(config.windowMs).toBe(15 * 60 * 1000);
  });

  it('should return test settings when test', () => {
    const config = getRateLimitConfig('test');
    expect(config.max).toBe(500);
    expect(config.windowMs).toBe(60 * 60 * 1000);
  });
});
