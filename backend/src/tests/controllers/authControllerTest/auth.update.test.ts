// backend/src/tests/authControllerTest/auth.update.test.ts
import request from 'supertest';
import app from '../../../app';
import prismaNewClient from '../../../lib/prisma';
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
} from '../../test.utils';
import { UUID_REGEX } from '../../../utils/validation';

beforeAll(async () => {
  await resetDB();
  jest.clearAllMocks();

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
  it('PUT /api/auth/update: 200<Successfully Auth: update> should update user information', async () => {
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
    expect(res.body).toHaveProperty('message', 'Successfully Auth: update');
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

  it('PUT /api/auth/update: 404<Not found Auth: user not found> admin update invalidValueId', async () => {
    const res = await request(app)
      .put('/api/auth/update')
      .set('Cookie', cookies[99])
      .send({
        id: invalidValueId,
        firstName: 'Jane',
        lastName: 'Doe',
        phone: '987654321',
        address: '2 Test St',
      });

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty(
      'message',
      'Not found Auth: user not found'
    );
  });

  it('PUT /api/auth/update: 400<Bad request Auth: invalid or missing fields>', async () => {
    const res = await request(app)
      .put('/api/auth/update')
      .set('Cookie', cookies[0])
      .send({
        id: userIds[0],
      });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty(
      'message',
      'Bad request Auth: invalid or missing fields'
    );
  });

  it('PUT /api/auth/update: 400<Bad request Validator: invalid ID> user with invalid format id', async () => {
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
    expect(res.body).toHaveProperty(
      'message',
      'Bad request Validator: invalid ID'
    );
  });

  it('PUT /api/auth/update: 403<Access denied Auth: not own user> user with invalid value id', async () => {
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
    expect(res.body).toHaveProperty(
      'message',
      'Access denied Auth: not own user'
    );
  });

  it('PUT /api/auth/update: 403<Access denied Auth: not own user> not update if user update other user', async () => {
    const res = await request(app)
      .put('/api/auth/update')
      .set('Cookie', cookies[0])
      .send({
        id: userIds[1],
        firstName: 'Janeterrt',
      });
    expect(res.status).toBe(403);
    expect(res.body).toHaveProperty(
      'message',
      'Access denied Auth: not own user'
    );
  });

  it('PUT /api/auth/update: 401<Unauthorized access Athenticate: invalid token>', async () => {
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
    expect(res.body).toHaveProperty(
      'message',
      'Unauthorized access Athenticate: invalid token'
    );
  });

  it('PUT /api/auth/update: 200<Successfully Auth: update>(value unchanged) as non-admin should not update role or credits', async () => {
    const res = await request(app)
      .put('/api/auth/update')
      .set('Cookie', cookies[0])
      .send({
        id: userIds[0],
        role: [99],
        credits: 100,
      });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'Successfully Auth: update');
    expect(res.body.user).toHaveProperty('credits', 20);
    expect(res.body.user).toHaveProperty('role');
    expect(Array.isArray(res.body.user.role)).toBe(true);
    expect(res.body.user.role).toHaveLength(1);
    expect(res.body.user.role[0]).toBe('passenger');
    expect(res.body.user.role).toContainEqual('passenger');
    expect(res.body.user.role).toEqual(['passenger']);
  });

  it('PUT /api/auth/update: 400<Bad request Validator: email must be a valid email address>', async () => {
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
      `Bad request Validator: email must be a valid email address`
    );
  });

  it('PUT /api/auth/update: 400<Bad request Validator: password must be at least 8 characters long>', async () => {
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
      'Bad request Validator: password must be at least 8 characters long'
    );
  });

  it('PUT /api/auth/update: 400<Bad request Validator: password must contain a number>', async () => {
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
      'Bad request Validator: password must contain a number'
    );
  });

  it('PUT /api/auth/update: 400<Bad request Validator: password must contain both letters and numbers>', async () => {
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
      'Bad request Validator: password must contain both letters and numbers'
    );
  });

  it('PUT /api/auth/update: 400<Bad request Validator: password must contain a special character>', async () => {
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
      'Bad request Validator: password must contain a special character'
    );
  });

  it('PUT /api/auth/update: 400<Bad request Validator: username must be between 3 and 20 characters> 1 characters', async () => {
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
      `Bad request Validator: username must be between 3 and 20 characters`
    );
  });

  it('PUT /api/auth/update: 400<Bad request Validator: username must be between 3 and 20 characters> 24 characters', async () => {
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
      `Bad request Validator: username must be between 3 and 20 characters`
    );
  });

  it('PUT /api/auth/update: 409<Conflict Auth: already used email> admin should not update user with email already used', async () => {
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
    expect(res.body).toHaveProperty(
      'message',
      'Conflict Auth: already used email'
    );
  });

  it('PUT /api/auth/update: 409<Conflict Auth: already used username> admin should not update user with username already used', async () => {
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
    expect(res.body).toHaveProperty(
      'message',
      'Conflict Auth: already used username'
    );
  });

  it('PUT /api/auth/update: 200<Successfully Auth: update>(value unchanged) as non-admin should not update role or credits', async () => {
    jest.spyOn(prismaNewClient.user, 'create').mockImplementation(() => {
      throw new Error('DB exploded');
    });
    const res = await request(app)
      .put('/api/auth/update')
      .set('Cookie', cookies[0])
      .send({
        id: userIds[0],
        firstname: 'testme',
      });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'Successfully Auth: update');
  });

  it('PUT /api/auth/update: 500<Internal error Auth: failed to update>', async () => {
    jest
      .spyOn(prismaNewClient.user, 'update')
      .mockRejectedValue(new Error('DB exploded'));

    const res = await request(app)
      .put('/api/auth/update')
      .set('Cookie', cookies[0])
      .send({
        id: userIds[0],
        firstname: 'testme',
      });

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty(
      'message',
      'Internal error Auth: failed to update'
    );
    expect(res.body.error).toBeDefined();
  });
});
