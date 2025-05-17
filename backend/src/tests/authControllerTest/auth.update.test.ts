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
  invalidValueId,
  resetDB,
  testEmails,
  unikUserName,
  userIds,
} from '../test.utils';

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
    expect(res.body.user).toHaveProperty('firstName', 'Jane');
  });

  it('PUT /api/auth/update: 400<Error checking user existence> should not update user with invalid format id', async () => {
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
    expect(res.body).toHaveProperty('message', 'Error checking user existence');
  });

  it('PUT /api/auth/update: 400<User not found> should not update user with invalid value id', async () => {
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

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message', 'User not found');
  });

  it('PUT /api/auth/update: 403<Invalid token> should not update user without JWT', async () => {
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

    expect(res.status).toBe(403);
    expect(res.body).toHaveProperty('message', 'Invalid token');
  });

  it('PUT /api/auth/update: 200<> as non-admin should not update role or credits', async () => {
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
    expect(res.body.user.role).toContainEqual('passenger');
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
    expect(res.body.message).toBe('Email already in use');
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
    expect(res.body.message).toBe('Username already in use');
  });

  it('PUT /api/auth/update: 400<Email already in use> should not update user with no fields to update', async () => {
    const res = await request(app)
      .put('/api/auth/update')
      .set('Cookie', cookies[99])
      .send({
        id: userIds[99],
      });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Field is required');
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
    expect(res.body.message).toBe('Unauthorized');
  });
});
