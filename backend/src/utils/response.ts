// backend/src/utils/response.ts
import { Response } from 'express';
import { messages, statusCodes } from '../constant';

export const sendNewResponse = <T = object>(
  res: Response,
  statusKey: keyof typeof statusCodes,
  context: string = '',
  messageDetail: string = '',
  data?: T,
  error?: any
): Response => {
  const response: any = {};
  const lcContext = context?.toLowerCase?.() ?? '';

  let dataKey: string;
  if (lcContext === 'auth') {
    dataKey = 'user';
  } else if (lcContext === 'userpreferences') {
    dataKey = 'userPreferences';
  } else {
    dataKey = lcContext;
  }
  response.message = messages[statusKey](context, messageDetail);
  if (!!dataKey && data) response[dataKey] = data;
  if (error)
    response.error =
      error instanceof Error ? { message: error.message } : error;

  return res.status(statusCodes[statusKey]).json(response);
};

export const successResponse = <T = object>(
  res: Response,
  context: string = '',
  messageDetail: string = '',
  data?: T
): Response =>
  sendNewResponse(res, 'SUCCESS', context, messageDetail, data ?? undefined);

export const successCreateResponse = <T = object>(
  res: Response,
  context: string = '',
  messageDetail: string = '',
  data?: T
): Response =>
  sendNewResponse(
    res,
    'SUCCESS_CREATE',
    context,
    messageDetail,
    data ?? undefined
  );

export const badRequestResponse = (
  res: Response,
  context: string = '',
  messageDetail: string = '',
  error?: any
): Response =>
  sendNewResponse(
    res,
    'BAD_REQUEST',
    context,
    messageDetail,
    undefined,
    error ?? undefined
  );

export const unauthorizedResponse = (
  res: Response,
  context: string = '',
  messageDetail: string = '',
  error?: any
): Response =>
  sendNewResponse(
    res,
    'UNAUTHORIZED',
    context,
    messageDetail,
    undefined,
    error ?? undefined
  );

export const forbiddenResponse = (
  res: Response,
  context: string = '',
  messageDetail: string = '',
  error?: any
): Response =>
  sendNewResponse(
    res,
    'FORBIDDEN',
    context,
    messageDetail,
    undefined,
    error ?? undefined
  );

export const notFoundResponse = (
  res: Response,
  context: string = '',
  messageDetail: string = '',
  error?: any
): Response =>
  sendNewResponse(
    res,
    'NOT_FOUND',
    context,
    messageDetail,
    undefined,
    error ?? undefined
  );

export const conflictResponse = (
  res: Response,
  context: string = '',
  messageDetail: string = '',
  error?: any
): Response =>
  sendNewResponse(
    res,
    'CONFLICT',
    context,
    messageDetail,
    undefined,
    error ?? undefined
  );

export const errorResponse = (
  res: Response,
  context: string = '',
  messageDetail: string = '',
  error?: any
): Response =>
  sendNewResponse(
    res,
    'ERROR',
    context,
    messageDetail,
    undefined,
    error ?? undefined
  );
