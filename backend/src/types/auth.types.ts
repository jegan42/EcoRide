// backend/src/types/auth.types.ts
import { JwtPayload } from 'jsonwebtoken';

export interface SignupInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  username: string;
  phone: string;
  address: string;
}

export interface SigninInput {
  email: string;
  password: string;
}

export interface TokenPayload {
  userId: string;
  email: string;
}

export interface DecodedToken extends JwtPayload {
  userId: string;
  email: string;
  iat: number;
  exp: number;
}
