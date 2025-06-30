// backend/src/utils/rateLimitConfig.ts
export const getRateLimitConfig = (
  env: string
): {
  windowMs: number;
  max: number;
} => {
  return {
    windowMs: env !== 'test' ? 15 * 60 * 1000 : 60 * 60 * 1000,
    max: env !== 'test' ? 200 : 500,
  };
};
