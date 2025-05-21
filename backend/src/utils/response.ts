// backend/src/utils/response.ts
import { Response } from 'express';
import { messages, statusCodes } from '../constant';

export const sendJsonResponse = (
  res: Response,
  statusKey: keyof typeof statusCodes,
  method: string,
  item: string,
  dataKey?: string,
  data?: object
): Response => {
  const response: any = {};
  response.message = messages[statusKey](item, method);
  if (dataKey && data) {
    response[dataKey] = data;
  }
  return res.status(statusCodes[statusKey]).json(response);
};
