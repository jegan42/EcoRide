// backend/src/tests/authControllerTest/auth.signout.test.ts
import request from 'supertest';
import app from '../../app';
import prismaNewClient from '../../lib/prisma';
import {
  cookies,
  createUserAndSignIn,
  invalidCookie,
  resetDB,
  testEmails,
} from '../test.utils';

beforeAll(async () => {
  await resetDB();
  cookies[0] = (await createUserAndSignIn(testEmails[0])).headers['set-cookie'];
});

afterAll(async () => {
  await resetDB();
  await prismaNewClient.$disconnect();
});

describe('AuthController: POST /api/auth/signout', () => {
  it('POST /api/auth/signout: 200<Successfully Auth: signout> sign out the user and clear the accessToken cookie', async () => {
    const res = await request(app)
      .post('/api/auth/signout')
      .set('Cookie', cookies[0]);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'Successfully Auth: signout');

    const signoutCookies = Array.isArray(res.headers['set-cookie'])
      ? res.headers['set-cookie']
      : [res.headers['set-cookie']];

    expect(signoutCookies).toBeDefined();
    const jwtTokenCookie = signoutCookies.find((cookie: string) =>
      cookie.startsWith('jwtToken=')
    );

    expect(jwtTokenCookie).toBeDefined();
    expect(jwtTokenCookie).toMatch(/jwtToken=;/);
  });

  it('GET /api/auth/signout: 401<Unauthorized access Athenticate: invalid token>', async () => {
    const res = await request(app)
      .post('/api/auth/signout')
      .set('Cookie', invalidCookie);
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty(
      'message',
      'Unauthorized access Athenticate: invalid token'
    );
  });

  it('GET /api/auth/signout: 401<Unauthorized access Athenticate: missing token>', async () => {
    const res = await request(app).post('/api/auth/signout');
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty(
      'message',
      'Unauthorized access Athenticate: missing token'
    );
  });
});
