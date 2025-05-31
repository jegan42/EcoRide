// backend/src/utils/env.ts
export const getNodeEnv = (): string => {
  return process.env.NODE_ENV ?? 'development';
};

export const getSessionSecret = (): string => {
  return process.env.SESSION_SECRET ?? 'secret';
};
