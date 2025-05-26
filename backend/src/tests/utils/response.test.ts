// backend/src/tests/utils/response.test.ts
import { Response } from 'express';
import {
  sendNewResponse,
  successResponse,
  successCreateResponse,
  badRequestResponse,
  unauthorizedResponse,
  forbiddenResponse,
  notFoundResponse,
  conflictResponse,
  errorResponse,
} from '../../utils/response';

describe('response utils', () => {
  let res: Partial<Response> = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  let mockRes = res as Response;

  beforeEach(() => {
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockRes = res as Response;
  });

  it('should sendNewResponse response', () => {
    sendNewResponse(mockRes, 'SUCCESS');

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Successfully : ',
    });
  });

  it('should sendNewResponse response context Auth', () => {
    sendNewResponse(mockRes, 'SUCCESS', 'Auth', 'logged in', { id: 10 });

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Successfully Auth: logged in',
      user: { id: 10 },
    });
  });

  it('should sendNewResponse response context UserPreferences', () => {
    sendNewResponse(
      mockRes,
      'SUCCESS',
      'UserPreferences',
      'UserPreferences fetched',
      { id: 10 }
    );

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Successfully UserPreferences: UserPreferences fetched',
      userPreferences: { id: 10 },
    });
  });

  it('should sendNewResponse response context Trip', () => {
    sendNewResponse(mockRes, 'SUCCESS', 'Trip', 'trip fetched', { id: 10 });

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Successfully Trip: trip fetched',
      trip: { id: 10 },
    });
  });

  it('should default lcContext to empty string when context is undefined', () => {
    sendNewResponse(mockRes, 'SUCCESS', undefined as any);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Successfully : ',
    });
  });

  it('should handle context without toLowerCase method (non-string)', () => {
    sendNewResponse(mockRes, 'SUCCESS', {} as any);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: expect.stringContaining('Successfully'),
      })
    );
  });

  it('should send a success response', () => {
    successResponse(mockRes, 'Trip', 'fetched', { id: 1 });

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: expect.stringContaining('Trip'),
      trip: { id: 1 },
    });
  });

  it('should send a success response', () => {
    successResponse(mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Successfully : ',
    });
  });

  it('should send a success create response', () => {
    successCreateResponse(mockRes, 'Booking', 'created', { id: 10 });

    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: expect.stringContaining('Booking'),
      booking: { id: 10 },
    });
  });

  it('should send a success create response', () => {
    successCreateResponse(mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Successfully created : ',
    });
  });

  it('should send a bad request response with error message', () => {
    badRequestResponse(mockRes, 'User', 'invalid input', {
      message: 'Invalid data',
    });

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: expect.stringContaining('User'),
      error: { message: 'Invalid data' },
    });
  });

  it('should send a bad request response with error message', () => {
    badRequestResponse(mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Bad request : ',
    });
  });

  it('should send an unauthorized response', () => {
    unauthorizedResponse(mockRes, 'Auth', 'token missing', {
      message: 'Unauthorized',
    });

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: expect.stringContaining('Auth'),
      error: { message: 'Unauthorized' },
    });
  });

  it('should send an unauthorized response', () => {
    unauthorizedResponse(mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Unauthorized access : ',
    });
  });

  it('should send a forbidden response', () => {
    forbiddenResponse(mockRes, 'Access', 'denied', {
      message: 'No permission',
    });

    expect(mockRes.status).toHaveBeenCalledWith(403);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: expect.stringContaining('Access'),
      error: { message: 'No permission' },
    });
  });

  it('should send a forbidden response', () => {
    forbiddenResponse(mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(403);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Access denied : ',
    });
  });

  it('should send a not found response', () => {
    notFoundResponse(mockRes, 'Trip', 'not found', {
      message: 'No trip found',
    });

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: expect.stringContaining('Trip'),
      error: { message: 'No trip found' },
    });
  });

  it('should send a not found response', () => {
    notFoundResponse(mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Not found : ',
    });
  });

  it('should send a conflict response', () => {
    conflictResponse(mockRes, 'Booking', 'already exists', {
      message: 'Duplicate booking',
    });

    expect(mockRes.status).toHaveBeenCalledWith(409);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: expect.stringContaining('Booking'),
      error: { message: 'Duplicate booking' },
    });
  });

  it('should send a conflict response', () => {
    conflictResponse(mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(409);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Conflict : ',
    });
  });

  it('should send a generic error response', () => {
    errorResponse(mockRes, 'Server', 'crash', new Error('Something broke'));

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: expect.stringContaining('Server'),
      error: { message: 'Something broke' },
    });
  });

  it('should send a generic error response', () => {
    errorResponse(mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Internal error : ',
    });
  });
});
