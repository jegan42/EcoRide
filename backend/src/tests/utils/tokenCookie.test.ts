// backend/src/tests/utils/tokenCookie.test.ts
import { Response } from 'express';
import { setTokenCookie, clearTokenCookie } from '../../utils/tokenCookie';

describe('setTokenCookie', () => {
  let res: Response;
  let cookieMock: jest.Mock;

  beforeEach(() => {
    cookieMock = jest.fn();
    res = {
      cookie: cookieMock,
    } as any as Response;
  });

  afterEach(() => {
    jest.restoreAllMocks();
    delete process.env.NODE_ENV;
    delete process.env.COOKIE_SAMESITE;
  });

  it('should set cookie with sameSite=lax when not in production', () => {
    process.env.NODE_ENV = 'development';
    setTokenCookie(res, 'fake-token');

    expect(cookieMock).toHaveBeenCalledWith(
      'jwtToken',
      'fake-token',
      expect.objectContaining({
        sameSite: 'lax',
        secure: false,
      })
    );
  });

  it('should use COOKIE_SAMESITE if defined in production', () => {
    process.env.NODE_ENV = 'production';
    process.env.COOKIE_SAMESITE = 'strict';

    setTokenCookie(res, 'secure-token');

    expect(cookieMock).toHaveBeenCalledWith(
      'jwtToken',
      'secure-token',
      expect.objectContaining({
        sameSite: 'strict',
        secure: true,
      })
    );
  });

  it('should default sameSite to none if COOKIE_SAMESITE is undefined in production', () => {
    process.env.NODE_ENV = 'production';
    delete process.env.COOKIE_SAMESITE;

    setTokenCookie(res, 'secure-token');

    expect(cookieMock).toHaveBeenCalledWith(
      'jwtToken',
      'secure-token',
      expect.objectContaining({
        sameSite: 'none',
        secure: true,
      })
    );
  });
});

describe('clearTokenCookie', () => {
  let res: Response;
  let clearCookieMock: jest.Mock;

  beforeEach(() => {
    clearCookieMock = jest.fn();
    res = {
      clearCookie: clearCookieMock,
    } as any as Response;
  });

  afterEach(() => {
    jest.restoreAllMocks();
    delete process.env.NODE_ENV;
    delete process.env.COOKIE_SAMESITE;
  });

  it('should use sameSite = lax when NODE_ENV !== production', () => {
    process.env.NODE_ENV = 'development';
    clearTokenCookie(res);

    expect(clearCookieMock).toHaveBeenCalledWith(
      'jwtToken',
      expect.objectContaining({
        sameSite: 'lax',
        secure: false,
      })
    );
  });

  it('should use COOKIE_SAMESITE when NODE_ENV === production and COOKIE_SAMESITE is defined', () => {
    process.env.NODE_ENV = 'production';
    process.env.COOKIE_SAMESITE = 'strict';

    clearTokenCookie(res);

    expect(clearCookieMock).toHaveBeenCalledWith(
      'jwtToken',
      expect.objectContaining({
        sameSite: 'strict',
        secure: true,
      })
    );
  });

  it('should default sameSite to none when NODE_ENV === production and COOKIE_SAMESITE is undefined', () => {
    process.env.NODE_ENV = 'production';
    delete process.env.COOKIE_SAMESITE;

    clearTokenCookie(res);

    expect(clearCookieMock).toHaveBeenCalledWith(
      'jwtToken',
      expect.objectContaining({
        sameSite: 'none',
        secure: true,
      })
    );
  });
});
