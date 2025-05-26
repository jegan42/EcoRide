// backend/src/tests/utils/jwt.test.ts
import { decodeToken } from '../../utils/jwt';
import jwt from 'jsonwebtoken';
jest.mock('jsonwebtoken');

describe('decodeToken', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should return decoded token if jwt.decode succeeds (try branch)', () => {
    const mockDecoded = { id: 'user-123', email: 'test@example.com' };
    (jwt.decode as jest.Mock).mockReturnValue(mockDecoded);

    const result = decodeToken('valid.token.here');

    expect(jwt.decode).toHaveBeenCalledWith('valid.token.here');
    expect(result).toEqual(mockDecoded);
  });

  it('should return null if jwt.decode throws (catch branch)', () => {
    (jwt.decode as jest.Mock).mockImplementation(() => {
      throw new Error('Invalid token');
    });

    const result = decodeToken('invalid.token');

    expect(jwt.decode).toHaveBeenCalledWith('invalid.token');
    expect(result).toBeNull();
  });
});
