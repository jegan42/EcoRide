// backend/src/utils/setTokenCookie.ts
import { Response } from 'express';

export const setTokenCookie = (res: Response, token: string): void => {
  res.cookie('jwtToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite:
      process.env.NODE_ENV === 'production'
        ? ((process.env.COOKIE_SAMESITE as 'none' | 'lax' | 'strict') ?? 'none')
        : 'lax',
    maxAge: 12 * 60 * 60 * 1000, // 12 hour
  });
};

export const clearTokenCookie = (res: Response): void => {
  res.clearCookie('jwtToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite:
      process.env.NODE_ENV === 'production'
        ? ((process.env.COOKIE_SAMESITE as 'none' | 'lax' | 'strict') ?? 'none')
        : 'lax',
  });
};
