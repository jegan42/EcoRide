// backend/src/utils/env.ts
export function getNodeEnv(): string {
  return process.env.NODE_ENV ?? 'development';
}

export function getSessionSecret(): string {
  return process.env.SESSION_SECRET ?? 'secret';
}
