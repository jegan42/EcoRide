// backend/src/tests/utils/response.test.ts
import { Response } from 'express';
import { messages, statusCodes } from '../../constant';
import { sendJsonResponse } from '../../utils/response';

describe('sendJsonResponse', () => {
  let mockStatus: jest.Mock;
  let mockJson: jest.Mock;
  let res: Response;

  beforeEach(() => {
    mockStatus = jest.fn().mockReturnThis(); // pour chaînage
    mockJson = jest.fn();
    res = {
      status: mockStatus,
      json: mockJson,
    } as any;
  });

  it('should send response with message and data when dataKey and data are provided', () => {
    const data = { name: 'test' };
    sendJsonResponse(res, 'SUCCESS', 'GET', 'item', 'itemData', data);

    expect(mockStatus).toHaveBeenCalledWith(statusCodes.SUCCESS);
    expect(mockJson).toHaveBeenCalledWith({
      message: messages.SUCCESS('GET', 'item'),
      itemData: data,
    });
  });

  it('should send response with error object when error is an instance of Error', () => {
    const error = new Error('Something went wrong');

    sendJsonResponse(
      res,
      'BAD_REQUEST',
      'POST',
      'trip',
      undefined,
      undefined,
      error
    );

    expect(mockStatus).toHaveBeenCalledWith(statusCodes.BAD_REQUEST);
    expect(mockJson).toHaveBeenCalledWith({
      message: messages.BAD_REQUEST('POST', 'trip'),
      error: { message: 'Something went wrong' },
    });
  });

  it('should send response with raw error when error is not an Error instance', () => {
    const error = { code: 'INVALID', detail: 'Missing field' };

    sendJsonResponse(
      res,
      'BAD_REQUEST',
      'POST',
      'user',
      undefined,
      undefined,
      error
    );

    expect(mockStatus).toHaveBeenCalledWith(statusCodes.BAD_REQUEST);
    expect(mockJson).toHaveBeenCalledWith({
      message: messages.BAD_REQUEST('POST', 'user'),
      error: error,
    });
  });

  it('should send only message when no dataKey, data, or error are provided', () => {
    sendJsonResponse(res, 'BAD_REQUEST', 'DELETE', 'trip');

    expect(mockStatus).toHaveBeenCalledWith(statusCodes.BAD_REQUEST);
    expect(mockJson).toHaveBeenCalledWith({
      message: messages.BAD_REQUEST('DELETE', 'trip'),
    });
  });

  it('should send response with message and data when dataKey and data are provided', () => {
    sendJsonResponse(res, 'SUCCESS');

    expect(mockStatus).toHaveBeenCalledWith(statusCodes.SUCCESS);
    expect(mockJson).toHaveBeenCalledWith({
      message: messages.SUCCESS('', ''),
    });
  });
});
