// backend/tests/controllers/csrf.controller.test.ts
import { CsrfController } from '../../../src/controllers/csrf.controller';
import { CsrfService } from '../../../src/services/csrf.service';
import { successResponse } from '../../../src/utils/response';
import { Request, Response } from 'express';

jest.mock('../../../src/services/csrf.service');
jest.mock('../../../src/utils/response');

describe('CsrfController', () => {
  it('doit appeler successResponse avec le token CSRF', () => {
    const mockToken = 'mock-csrf-token';
    const mockReq = {} as Request;
    const mockRes = {} as Response;

    (CsrfService.getCsrfToken as jest.Mock).mockReturnValue(mockToken);

    CsrfController.getCsrf(mockReq, mockRes);

    expect(CsrfService.getCsrfToken).toHaveBeenCalledWith(mockReq);
    expect(successResponse).toHaveBeenCalledWith(
      mockRes,
      'CSRF',
      'getCsrfToken',
      mockToken
    );
  });
});
