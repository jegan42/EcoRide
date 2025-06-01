// backend/tests/services/csrf.service.test.ts
import { CsrfService } from '../../../src/services/csrf.service';
import { Request } from 'express';

describe('CsrfService', () => {
  it('getCsrfToken doit retourner le token CSRF depuis req.csrfToken()', () => {
    const mockToken = 'mocked-token';
    const mockRequest = {
      csrfToken: jest.fn().mockReturnValue(mockToken),
    } as unknown as Request;

    const result = CsrfService.getCsrfToken(mockRequest);

    expect(mockRequest.csrfToken).toHaveBeenCalled();
    expect(result).toBe(mockToken);
  });
});
