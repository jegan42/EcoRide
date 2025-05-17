// backend/src/utils/jwt.ts
import jwt from 'jsonwebtoken';
import { TokenPayload, DecodedToken } from '../types/auth.types';

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';
const JWT_EXPIRATION = '1d'; // 1 day

export const signToken = (payload: TokenPayload) =>
  jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION });

export const verifyToken = (token: string): DecodedToken => {
  return jwt.verify(token, JWT_SECRET) as DecodedToken;
};

export const decodeToken = (token: string): DecodedToken | null => {
  try {
    return jwt.decode(token) as DecodedToken;
  } catch {
    return null;
  }
};
