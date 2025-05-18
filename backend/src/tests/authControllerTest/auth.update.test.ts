// backend/src/tests/authControllerTest/auth.update.test.ts
import request from 'supertest';
import app from '../../app';
import prismaNewClient from '../../lib/prisma';
import {
  adminMail,
  cookies,
  createUserAndSignIn,
  invalidCookie,
  invalidFormatId,
  invalidMail,
  invalidValueId,
  resetDB,
  testEmails,
  unikUserName,
  userIds,
} from '../test.utils';
import { UUID_REGEX } from '../../validators/validator';

beforeAll(async () => {
  await resetDB();

  const userRes = await createUserAndSignIn(testEmails[0], unikUserName);
  cookies[0] = userRes.headers['set-cookie'];
  userIds[0] = userRes.body.user.id;

  userIds[1] = (
    await createUserAndSignIn(testEmails[1], 'ecorider')
  ).body.user.id;

  const adminRes = await createUserAndSignIn(adminMail);
  await prismaNewClient.user.update({
    where: { email: adminMail },
    data: { role: { push: 'admin' } },
  });
  cookies[99] = adminRes.headers['set-cookie'];
  userIds[99] = adminRes.body.user.id;
});

afterAll(async () => {
  await resetDB();
  await prismaNewClient.$disconnect();
});

describe('AuthController: PUT /api/auth/update', () => {
  it('PUT /api/auth/update: 200<> should update user information', async () => {
    const res = await request(app)
      .put('/api/auth/update')
      .set('Cookie', cookies[0])
      .send({
        id: userIds[0],
        firstName: 'Jane',
        lastName: 'Doe',
        phone: '987654321',
        address: '2 Test St',
      });

    expect(res.status).toBe(200);
    expect(res.body.user).not.toHaveProperty('googleId');
    expect(res.body.user).not.toHaveProperty('password');
    expect(res.body.user).not.toHaveProperty('jwtToken');
    expect(res.body.user).not.toHaveProperty('googleAccessToken');
    expect(res.body.user).not.toHaveProperty('googleRefreshToken');
    expect(res.body.user).toHaveProperty('id');
    expect(res.body.user.id).toMatch(UUID_REGEX);

    expect(res.body.user).toHaveProperty('firstName', `Jane`);
    expect(res.body.user).toHaveProperty('lastName', `Doe`);
    expect(res.body.user).toHaveProperty('username', unikUserName);
    expect(res.body.user).toHaveProperty('email', testEmails[0]);
    expect(res.body.user).toHaveProperty('phone', `987654321`);
    expect(res.body.user).toHaveProperty('address', `2 Test St`);
    expect(res.body.user).toHaveProperty('role', ['passenger']);
    expect(res.body.user).toHaveProperty('credits', 20);

    const cookiesRes = res.headers['set-cookie'];
    expect(cookiesRes).toBeDefined();
    expect(cookiesRes[0]).toMatch(/jwtToken=/);
    expect(cookiesRes[0]).toMatch(/HttpOnly/);
  });

  it('PUT /api/auth/update: 400<No fields to update>', async () => {
    const res = await request(app)
      .put('/api/auth/update')
      .set('Cookie', cookies[0])
      .send({
        id: userIds[0],
      });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message', 'No fields to update');
  });

  it('PUT /api/auth/update: 400<Invalid ID> user with invalid format id', async () => {
    const res = await request(app)
      .put('/api/auth/update')
      .set('Cookie', cookies[0])
      .send({
        id: invalidFormatId,
        firstName: 'Jane',
        lastName: 'Doe',
        phone: '987654321',
        address: '2 Test St',
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message', 'Invalid ID');
  });

  it('PUT /api/auth/update: 403<Unauthorized> user with invalid value id', async () => {
    const res = await request(app)
      .put('/api/auth/update')
      .set('Cookie', cookies[0])
      .send({
        id: invalidValueId,
        firstName: 'Jane',
        lastName: 'Doe',
        phone: '987654321',
        address: '2 Test St',
      });

    expect(res.status).toBe(403);
    expect(res.body).toHaveProperty('message', 'Unauthorized');
  });

  it('PUT /api/auth/update: 403<Unauthorized> not update if user update other user', async () => {
    const res = await request(app)
      .put('/api/auth/update')
      .set('Cookie', cookies[0])
      .send({
        id: userIds[1],
        firstName: 'Janeterrt',
      });
    expect(res.status).toBe(403);
    expect(res.body).toHaveProperty('message', 'Unauthorized');
  });

  it('PUT /api/auth/update: 401<Invalid token>', async () => {
    const res = await request(app)
      .put('/api/auth/update')
      .set('Cookie', invalidCookie)
      .send({
        id: userIds[0],
        firstName: 'Jane',
        lastName: 'Doe',
        phone: '987654321',
        address: '2 Test St',
      });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('message', 'Invalid token');
  });

  it('PUT /api/auth/update: 200<>(value unchanged) as non-admin should not update role or credits', async () => {
    const res = await request(app)
      .put('/api/auth/update')
      .set('Cookie', cookies[0])
      .send({
        id: userIds[0],
        role: [99],
        credits: 100,
      });
    expect(res.status).toBe(200);
    expect(res.body.user).toHaveProperty('credits', 20);
    expect(res.body.user).toHaveProperty('role');
    expect(Array.isArray(res.body.user.role)).toBe(true);
    expect(res.body.user.role).toHaveLength(1);
    expect(res.body.user.role[0]).toBe('passenger');
    expect(res.body.user.role).toContainEqual('passenger');
    expect(res.body.user.role).toEqual(['passenger']);
  });

  it('PUT /api/auth/update: 400<Please provide a valid email address>', async () => {
    const res = await request(app)
      .put('/api/auth/update')
      .set('Cookie', cookies[99])
      .send({
        id: userIds[0],
        email: invalidMail,
      });

    expect(res.status).toBe(400);

    expect(res.body).toHaveProperty(
      'message',
      `Please provide a valid email address`
    );
  });

  it('PUT /api/auth/update: 400<Password must be at least 8 characters long>', async () => {
    const res = await request(app)
      .put('/api/auth/update')
      .set('Cookie', cookies[99])
      .send({
        id: userIds[0],
        password: '12345',
      });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty(
      'message',
      'Password must be at least 8 characters long'
    );
  });

  it('PUT /api/auth/update: 400<Password must contain a number>', async () => {
    const res = await request(app)
      .put('/api/auth/update')
      .set('Cookie', cookies[99])
      .send({
        id: userIds[0],
        password: 'abcdefgh',
      });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty(
      'message',
      'Password must contain a number'
    );
  });

  it('PUT /api/auth/update: 400<Password must contain both letters and numbers>', async () => {
    const res = await request(app)
      .put('/api/auth/update')
      .set('Cookie', cookies[99])
      .send({
        id: userIds[0],
        password: '12345678',
      });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty(
      'message',
      'Password must contain both letters and numbers'
    );
  });

  it('PUT /api/auth/update: 400<Password must contain a special character>', async () => {
    const res = await request(app)
      .put('/api/auth/update')
      .set('Cookie', cookies[99])
      .send({
        id: userIds[0],
        password: 'abcdefgh123',
      });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty(
      'message',
      'Password must contain a special character'
    );
  });

  it('PUT /api/auth/update: 400<Username must be between 3 and 20 characters> 1 characters', async () => {
    const res = await request(app)
      .put('/api/auth/update')
      .set('Cookie', cookies[99])
      .send({
        id: userIds[0],
        username: 'a',
      });

    expect(res.status).toBe(400);

    expect(res.body).toHaveProperty(
      'message',
      `Username must be between 3 and 20 characters`
    );
  });

  it('PUT /api/auth/update: 400<Username must be between 3 and 20 characters> 24 characters', async () => {
    const res = await request(app)
      .put('/api/auth/update')
      .set('Cookie', cookies[99])
      .send({
        id: userIds[0],
        username: 'usernameIsTooLongForUsed',
      });

    expect(res.status).toBe(400);

    expect(res.body).toHaveProperty(
      'message',
      `Username must be between 3 and 20 characters`
    );
  });

  it('PUT /api/auth/update: 409<Email already in use> admin should not update user with email already used', async () => {
    const res = await request(app)
      .put('/api/auth/update')
      .set('Cookie', cookies[99])
      .send({
        id: userIds[0],
        email: testEmails[1],
        username: 'johndoedidou',
        firstName: 'Jane',
        lastName: 'Doe',
        phone: '987654321',
        address: '2 Test St',
      });
    expect(res.status).toBe(409);
    expect(res.body).toHaveProperty('message', 'Email already in use');
  });

  it('PUT /api/auth/update: 409<Username already in use> admin should not update user with username already used', async () => {
    const res = await request(app)
      .put('/api/auth/update')
      .set('Cookie', cookies[99])
      .send({
        id: userIds[1],
        username: unikUserName,
        firstName: 'Jane',
        lastName: 'Doe',
        phone: '987654321',
        address: '2 Test St',
      });
    expect(res.status).toBe(409);
    expect(res.body).toHaveProperty('message', 'Username already in use');
  });
});
