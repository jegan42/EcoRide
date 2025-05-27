// frontend/src/types/user.ts
export interface User {
  id: string;
  googleId?: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone?: string;
  address?: string;
  avatar?: string;
  role: Array<'user' | 'admin' | 'employee'>;
  credits: number;
  lastLogin: string;
  createdAt: string;
  updatedAt: string;
}
