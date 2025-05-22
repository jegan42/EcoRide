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
import { UUID_REGEX } from '../../utils/validation';

beforeAll(async () => {
  await resetDB();
});

afterAll(async () => {
  await resetDB();
  await prismaNewClient.$disconnect();
});

describe('AuthController: POST /api/auth/signup', () => {
  it('POST /api/auth/signup: 201<Successfully created Auth: signup> sign up a new user', async () => {
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

    expect(res.body).toHaveProperty(
      'message',
      'Successfully created Auth: signup'
    );
    expect(res.body.user).not.toHaveProperty('googleId');
    expect(res.body.user).not.toHaveProperty('password');
    expect(res.body.user).not.toHaveProperty('jwtToken');
    expect(res.body.user).not.toHaveProperty('googleAccessToken');
    expect(res.body.user).not.toHaveProperty('googleRefreshToken');
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

  it('POST /api/auth/signup: 400<Bad request Validator: Email is required>', async () => {
    const res = await request(app).post('/api/auth/signup').send({
      firstName: 'qq',
      lastName: 'ww',
      username: 'qwdqwddoe',
      phone: '123456789',
      address: '1 Test St',
    });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty(
      'message',
      'Bad request Validator: Email is required'
    );
  });

  it('POST /api/auth/signup: 400<Bad request Validator: Please provide a valid email address>', async () => {
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
    expect(res.body).toHaveProperty(
      'message',
      'Bad request Validator: Please provide a valid email address'
    );
  });

  it('POST /api/auth/signup: 400<Bad request Validator: Password is required>', async () => {
    const res = await request(app).post('/api/auth/signup').send({
      email: testEmails[1],
      firstName: 'qq',
      lastName: 'ww',
      username: 'aatss',
      phone: '123456789',
      address: '1 Test St',
    });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty(
      'message',
      'Bad request Validator: Password is required'
    );
  });

  it('POST /api/auth/signup: 400<Bad request Validator: Password must be at least 8 characters long>', async () => {
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
    expect(res.body).toHaveProperty(
      'message',
      'Bad request Validator: Password must be at least 8 characters long'
    );
  });

  it('POST /api/auth/signup: 400<Bad request Validator: Password must contain a number>', async () => {
    const res = await request(app).post('/api/auth/signup').send({
      email: testEmails[1],
      password: 'abcdefgh',
      firstName: 'qq',
      lastName: 'ww',
      username: 'aatss',
      phone: '123456789',
      address: '1 Test St',
    });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty(
      'message',
      'Bad request Validator: Password must contain a number'
    );
  });

  it('POST /api/auth/signup: 400<Bad request Validator: Password must contain both letters and numbers>', async () => {
    const res = await request(app).post('/api/auth/signup').send({
      email: testEmails[1],
      password: '12345678',
      firstName: 'qq',
      lastName: 'ww',
      username: 'aatss',
      phone: '123456789',
      address: '1 Test St',
    });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty(
      'message',
      'Bad request Validator: Password must contain both letters and numbers'
    );
  });

  it('POST /api/auth/signup: 400<Bad request Validator: Password must contain a special character>', async () => {
    const res = await request(app).post('/api/auth/signup').send({
      email: testEmails[1],
      password: 'abcdefgh123',
      firstName: 'qq',
      lastName: 'ww',
      username: 'aatss',
      phone: '123456789',
      address: '1 Test St',
    });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty(
      'message',
      'Bad request Validator: Password must contain a special character'
    );
  });

  it('POST /api/auth/signup: 400<Bad request Validator: Username must be between 3 and 20 characters> with 1 character', async () => {
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
    expect(res.body).toHaveProperty(
      'message',
      'Bad request Validator: Username must be between 3 and 20 characters'
    );
  });

  it('POST /api/auth/signup: 400<Bad request Validator: Username must be between 3 and 20 characters> with 26 character', async () => {
    const res = await request(app).post('/api/auth/signup').send({
      email: testEmails[1],
      password: testPassword,
      firstName: 'qq',
      lastName: 'ww',
      username: 'UsernameIsTooLongToBeValid',
      phone: '123456789',
      address: '1 Test St',
    });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty(
      'message',
      'Bad request Validator: Username must be between 3 and 20 characters'
    );
  });

  it('POST /api/auth/signup: 400<Bad request Validator: First name is required>', async () => {
    const res = await request(app).post('/api/auth/signup').send({
      email: testEmails[1],
      password: testPassword,
      lastName: 'ww',
      username: 'aatss',
      phone: '123456789',
      address: '1 Test St',
    });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty(
      'message',
      'Bad request Validator: First name is required'
    );
  });

  it('POST /api/auth/signup: 400<Bad request Validator: Last name is required>', async () => {
    const res = await request(app).post('/api/auth/signup').send({
      email: testEmails[1],
      password: testPassword,
      firstName: 'ww',
      username: 'aatss',
      phone: '123456789',
      address: '1 Test St',
    });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty(
      'message',
      'Bad request Validator: Last name is required'
    );
  });

  it('POST /api/auth/signup: 400<Bad request Validator: Phone number is required>', async () => {
    const res = await request(app).post('/api/auth/signup').send({
      email: testEmails[1],
      password: testPassword,
      firstName: 'qq',
      lastName: 'ww',
      username: 'qwdqwddoe',
      address: '1 Test St',
    });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty(
      'message',
      'Bad request Validator: Phone number is required'
    );
  });

  it('POST /api/auth/signup: 400<Bad request Validator: Address is required>', async () => {
    const res = await request(app).post('/api/auth/signup').send({
      email: testEmails[1],
      password: testPassword,
      firstName: 'qq',
      lastName: 'ww',
      username: 'qwdqwddoe',
      phone: '123456789',
    });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty(
      'message',
      'Bad request Validator: Address is required'
    );
  });

  it('POST /api/auth/signup: 409<Conflict Auth: already used email>', async () => {
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
    expect(res.body).toHaveProperty(
      'message',
      'Conflict Auth: already used email'
    );
  });

  it('POST /api/auth/signup: 409<Conflict Auth: already used username>', async () => {
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
    expect(res.body).toHaveProperty(
      'message',
      'Conflict Auth: already used username'
    );
  });
});
