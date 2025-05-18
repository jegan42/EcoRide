// backend/src/tests/authControllerTest/auth.signin.test.ts
import request from 'supertest';
import app from '../../app';
import prismaNewClient from '../../lib/prisma';
import {
  createUserAndSignIn,
  invalidMail,
  resetDB,
  testEmails,
  testPassword,
  unikUserName,
} from '../test.utils';
import { UUID_REGEX } from '../../validators/validator';

beforeAll(async () => {
  await resetDB();
  await createUserAndSignIn(testEmails[0], unikUserName);
});

afterAll(async () => {
  await resetDB();
  await prismaNewClient.$disconnect();
});

describe('AuthController: POST /api/auth/signin', () => {
  it('POST /api/auth/signin: 200<> return the current user', async () => {
    const res = await request(app).post('/api/auth/signin').send({
      email: testEmails[0],
      password: testPassword,
    });

    expect(res.status).toBe(200);
    expect(res.body.user).not.toHaveProperty('googleId');
    expect(res.body.user).not.toHaveProperty('password');
    expect(res.body.user).not.toHaveProperty('jwtToken');
    expect(res.body.user).not.toHaveProperty('googleAccessToken');
    expect(res.body.user).not.toHaveProperty('googleRefreshToken');
    expect(res.body.user).toHaveProperty('id');
    expect(res.body.user.id).toMatch(UUID_REGEX);

    const name = testEmails[0].split('@')[0];
    expect(res.body.user).toHaveProperty('firstName', `firstName${name}`);
    expect(res.body.user).toHaveProperty('lastName', `lastName${name}`);
    expect(res.body.user).toHaveProperty('username', unikUserName);
    expect(res.body.user).toHaveProperty('email', testEmails[0]);
    expect(res.body.user).toHaveProperty('phone', `1234${name}`);
    expect(res.body.user).toHaveProperty('address', `123 ${name} St`);
    expect(res.body.user).toHaveProperty('role', ['passenger']);
    expect(res.body.user).toHaveProperty('credits', 20);

    const cookies = res.headers['set-cookie'];
    expect(cookies).toBeDefined();
    expect(cookies[0]).toMatch(/jwtToken=/);
    expect(cookies[0]).toMatch(/HttpOnly/);
  });

  it('POST /api/auth/signin: 400<Email is required>', async () => {
    const res = await request(app).post('/api/auth/signin').send({
      password: testPassword,
    });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message', 'Email is required');
  });

  it('POST /api/auth/signin: 400<Please provide a valid email address>', async () => {
    const res = await request(app).post('/api/auth/signin').send({
      email: invalidMail,
      password: testPassword,
    });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty(
      'message',
      'Please provide a valid email address'
    );
  });

  it('POST /api/auth/signin: 400<Password is required>', async () => {
    const res = await request(app).post('/api/auth/signin').send({
      email: testEmails[0],
    });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message', 'Password is required');
  });

  it('POST /api/auth/signin: 400<Password must be at least 8 characters long>', async () => {
    const res = await request(app).post('/api/auth/signin').send({
      email: testEmails[0],
      password: '12345',
    });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty(
      'message',
      'Password must be at least 8 characters long'
    );
  });

  it('POST /api/auth/signin: 400<Password must contain a number>', async () => {
    const res = await request(app).post('/api/auth/signin').send({
      email: testEmails[0],
      password: 'abcdefgh',
    });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty(
      'message',
      'Password must contain a number'
    );
  });

  it('POST /api/auth/signin: 400<Password must contain both letters and numbers>', async () => {
    const res = await request(app).post('/api/auth/signin').send({
      email: testEmails[0],
      password: '12345678',
    });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty(
      'message',
      'Password must contain both letters and numbers'
    );
  });

  it('POST /api/auth/signin: 400<Password must contain a special character>', async () => {
    const res = await request(app).post('/api/auth/signin').send({
      email: testEmails[0],
      password: 'abcdefgh123',
    });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty(
      'message',
      'Password must contain a special character'
    );
  });

  it('POST /api/auth/signin: 401<Invalid credentials> wrong email', async () => {
    const res = await request(app).post('/api/auth/signin').send({
      email: testEmails[1],
      password: testPassword,
    });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('message', 'Invalid credentials');
  });

  it('POST /api/auth/signin: 401<Invalid credentials> wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/signin')
      .send({
        email: testEmails[0],
        password: testPassword.replace('@', '!'),
      });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('message', 'Invalid credentials');
  });
});
