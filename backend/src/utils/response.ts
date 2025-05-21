// backend/src/utils/response.ts
import { Response } from 'express';

export const sendErrorResponse = (
  res: Response,
  statusCode: number,
  message: string
): Response => {
  return res.status(statusCode).json({ message });
};
