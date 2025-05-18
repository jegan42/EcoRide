// backend/src/tests/authControllerTest/auth.me.test.ts
import request from 'supertest';
import app from '../../app';
import prismaNewClient from '../../lib/prisma';
import {
  cookies,
  createUserAndSignIn,
  invalidCookie,
  resetDB,
  testEmails,
  unikUserName,
} from '../test.utils';
import { UUID_REGEX } from '../../validators/validator';

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
  it('GET /api/auth/me: 200<> return the current user', async () => {
    const name = testEmails[0].split('@')[0];
    const res = await request(app)
      .get('/api/auth/me')
      .set('Cookie', cookies[0]);

    expect(res.status).toBe(200);
    expect(res.body.user).not.toHaveProperty('googleId');
    expect(res.body.user).not.toHaveProperty('password');
    expect(res.body.user).not.toHaveProperty('jwtToken');
    expect(res.body.user).not.toHaveProperty('googleAccessToken');
    expect(res.body.user).not.toHaveProperty('googleRefreshToken');
    expect(res.body.user).toHaveProperty('id');
    expect(res.body.user.id).toMatch(UUID_REGEX);
    expect(res.body.user).toHaveProperty('firstName', `firstName${name}`);
    expect(res.body.user).toHaveProperty('lastName', `lastName${name}`);
    expect(res.body.user).toHaveProperty('username', unikUserName);
    expect(res.body.user).toHaveProperty('email', testEmails[0]);
    expect(res.body.user).toHaveProperty('phone', `1234${name}`);
    expect(res.body.user).toHaveProperty('address', `123 ${name} St`);
    expect(res.body.user).toHaveProperty('role', ['passenger']);
    expect(res.body.user).toHaveProperty('credits', 20);
  });

  it('GET /api/auth/me: 401<Missing token>', async () => {
    const res = await request(app).get('/api/auth/me');

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('message', 'Missing token');
  });

  it('GET /api/auth/me: 401<Invalid token>', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Cookie', invalidCookie);
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('message', 'Invalid token');
  });
});
