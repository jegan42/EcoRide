// backend/src/tests/authControllerTest/auth.me.test.ts
import request from 'supertest';
import app from '../../../app';
import prismaNewClient from '../../../lib/prisma';
import {
  cookies,
  createUserAndSignIn,
  invalidCookie,
  resetDB,
  testEmails,
  unikUserName,
} from '../../test.utils';
import { UUID_REGEX } from '../../../utils/validation';

beforeAll(async () => {
  await resetDB();

  cookies[0] = (await createUserAndSignIn(testEmails[0], unikUserName)).headers[
    'set-cookie'
  ];
});

afterAll(async () => {
  await resetDB();
  await prismaNewClient.$disconnect();
});

describe('AuthController: GET /api/auth/me', () => {
  it('GET /api/auth/me: 200<Successfully Auth: getMe> return the current user', async () => {
    const name = testEmails[0].split('@')[0];
    const res = await request(app)
      .get('/api/auth/me')
      .set('Cookie', cookies[0]);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'Successfully Auth: getMe');
    expect(res.body.data).not.toHaveProperty('googleId');
    expect(res.body.data).not.toHaveProperty('password');
    expect(res.body.data).not.toHaveProperty('jwtToken');
    expect(res.body.data).not.toHaveProperty('googleAccessToken');
    expect(res.body.data).not.toHaveProperty('googleRefreshToken');
    expect(res.body.data).toHaveProperty('id');
    expect(res.body.data.id).toMatch(UUID_REGEX);
    expect(res.body.data).toHaveProperty('firstName', `firstName${name}`);
    expect(res.body.data).toHaveProperty('lastName', `lastName${name}`);
    expect(res.body.data).toHaveProperty('username', unikUserName);
    expect(res.body.data).toHaveProperty('email', testEmails[0]);
    expect(res.body.data).toHaveProperty('phone', `1234${name}`);
    expect(res.body.data).toHaveProperty('address', `123 ${name} St`);
    expect(res.body.data).toHaveProperty('role', ['passenger']);
    expect(res.body.data).toHaveProperty('credits', 20);
  });

  it('GET /api/auth/me: 401<Unauthorized access Athenticate: missing token>', async () => {
    const res = await request(app).get('/api/auth/me');

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty(
      'message',
      'Unauthorized access Athenticate: missing token'
    );
  });

  it('GET /api/auth/me: 401<Unauthorized access Athenticate: invalid token>', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Cookie', invalidCookie);
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty(
      'message',
      'Unauthorized access Athenticate: invalid token'
    );
  });
});
