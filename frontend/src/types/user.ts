// frontend/src/types/user.ts
export type RoleEnum =
  | 'passenger'
  | 'driver'
  | 'admin'
  | 'employee'
  | 'suspended';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password?: string;
  phone?: string;
  address?: string;
  avatar?: string;
  role: RoleEnum[];
  credits: number;
  lastLogin: string;
  createdAt: string;
  updatedAt: string;
  averageRating?: AverageRating;
}

export interface AverageRating {
  asDriver?: { rating: number; reviewCount: number };
  asPassenger?: { rating: number; reviewCount: number };
}
