// backend/src/utils/response.ts
import { Response } from 'express';
import { messages, statusCodes } from '../constant';

export const sendJsonResponse = <T = object>(
  res: Response,
  statusKey: keyof typeof statusCodes,
  method: string = '',
  item: string = '',
  dataKey?: string,
  data?: T,
  error?: any
): Response => {
  const response: any = {};
  response.message = messages[statusKey](method, item);
  if (dataKey && data) response[dataKey] = data;
  if (error)
    response.error =
      error instanceof Error ? { message: error.message } : error;

  return res.status(statusCodes[statusKey]).json(response);
};
