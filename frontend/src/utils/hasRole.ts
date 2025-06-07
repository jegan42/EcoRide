// frontend/src/utils/hasRole.ts
import type { RoleEnum, User } from '../types/user';

export const hasRole = (user: Partial<User>, role: RoleEnum): boolean => {
  return Boolean(user?.role?.includes(role));
};
