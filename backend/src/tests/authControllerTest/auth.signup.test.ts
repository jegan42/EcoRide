// backend/src/tests/authControllerTest/auth.signup.test.ts
import request from 'supertest';
import app from '../../app';
import prismaNewClient from '../../lib/prisma';
import {
  invalidMail,
  resetDB,
  testEmails,
  testPassword,
  unikUserName,
} from '../test.utils';
import { UUID_REGEX } from '../../validators/validator';

beforeAll(async () => {
  await resetDB();
});

afterAll(async () => {
  await resetDB();
  await prismaNewClient.$disconnect();
});

describe('AuthController: POST /api/auth/signup', () => {
  it('POST /api/auth/signup: 201<> sign up a new user', async () => {
    const res = await request(app).post('/api/auth/signup').send({
      email: testEmails[0],
      password: testPassword,
      firstName: 'John',
      lastName: 'Doe',
      username: unikUserName,
      phone: '123456789',
      address: '1 Test St',
    });

    expect(res.status).toBe(201);

    expect(res.body.user).not.toHaveProperty('password');
    expect(res.body.user).toHaveProperty('jwtToken');
    expect(res.body.user).toHaveProperty('id');
    expect(res.body.user.id).toMatch(UUID_REGEX);
    expect(res.body.user).toHaveProperty('firstName', 'John');
    expect(res.body.user).toHaveProperty('lastName', 'Doe');
    expect(res.body.user).toHaveProperty('username', unikUserName);
    expect(res.body.user).toHaveProperty('email', testEmails[0]);
    expect(res.body.user).toHaveProperty('phone', '123456789');
    expect(res.body.user).toHaveProperty('address', '1 Test St');
    expect(res.body.user).toHaveProperty('role', ['passenger']);
    expect(res.body.user).toHaveProperty('credits', 20);

    const cookies = res.headers['set-cookie'];
    expect(cookies).toBeDefined();
    expect(cookies[0]).toMatch(/jwtToken=/);
    expect(cookies[0]).toMatch(/HttpOnly/);
  });

  it('POST /api/auth/signup: 409<Email already in use> should not allow duplicate signups email', async () => {
    const res = await request(app).post('/api/auth/signup').send({
      email: testEmails[0],
      password: testPassword,
      firstName: 'John',
      lastName: 'Doe',
      username: 'johndoe',
      phone: '123456789',
      address: '1 Test St',
    });

    expect(res.status).toBe(409);
    expect(res.body).toHaveProperty('message', 'Email already in use');
  });

  it('POST /api/auth/signup: 409<Username already in use> with Username used', async () => {
    const res = await request(app).post('/api/auth/signup').send({
      email: testEmails[1],
      password: testPassword,
      firstName: 'qq',
      lastName: 'ww',
      username: unikUserName,
      phone: '123456789',
      address: '1 Test St',
    });
    expect(res.status).toBe(409);
    expect(res.body).toHaveProperty('message', 'Username already in use');
  });

  it('POST /api/auth/signup: 400<Invalid value> with invalid email should', async () => {
    const res = await request(app).post('/api/auth/signup').send({
      email: invalidMail,
      password: testPassword,
      firstName: 'qq',
      lastName: 'ww',
      username: 'qwdqwddoe',
      phone: '123456789',
      address: '1 Test St',
    });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message', 'Invalid value');
  });

  it('POST /api/auth/signup: 400<Invalid value> with invalid username', async () => {
    const res = await request(app).post('/api/auth/signup').send({
      email: testEmails[1],
      password: testPassword,
      firstName: 'qq',
      lastName: 'ww',
      username: 'a',
      phone: '123456789',
      address: '1 Test St',
    });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message', 'Invalid value');
  });

  it('POST /api/auth/signup: 400<Invalid value> with short password should', async () => {
    const res = await request(app).post('/api/auth/signup').send({
      email: testEmails[1],
      password: '12345',
      firstName: 'qq',
      lastName: 'ww',
      username: 'aatss',
      phone: '123456789',
      address: '1 Test St',
    });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message', 'Invalid value');
  });

  it('POST /api/auth/signup: 400<Invalid value> missing required fields', async () => {
    const res = await request(app).post('/api/auth/signup').send({
      email: testEmails[1],
      password: '12345',
      lastName: 'ww',
      username: 'aatss',
      phone: '123456789',
      address: '1 Test St',
    });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message', 'Invalid value');
  });
});
