// backend/src/constant/roles.ts
export const roles = {
  ADMIN: 'admin',
  EMPLOYEE: 'employee',
  PASSENGER: 'passenger',
  DRIVER: 'driver',
} as const;

export type Role = (typeof roles)[keyof typeof roles];
