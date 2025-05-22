// backend/src/tests/userPreferencesControllerTest/userPreferences.create.test.ts
import request from 'supertest';
import app from '../../app';
import prismaNewClient from '../../lib/prisma';
import {
  cookies,
  createUserAndSignIn,
  invalidCookie,
  invalidFormatId,
  invalidValueId,
  resetDB,
  testEmails,
  userIds,
} from '../test.utils';
import { UUID_REGEX } from '../../utils/validation';

beforeAll(async () => {
  await resetDB();

  const user = await createUserAndSignIn(testEmails[0]);
  userIds[0] = user.body.user.id;
  cookies[0] = user.headers['set-cookie'];
});

afterAll(async () => {
  await resetDB();
  await prismaNewClient.$disconnect();
});

describe('UserPreferencesController: POST /api/user-preferences/:id', () => {
  it('POST /api/user-preferences/:id: 201<> return a new UserPreferences', async () => {
    const res = await request(app)
      .post(`/api/user-preferences/${userIds[0]}`)
      .set('Cookie', cookies[0])
      .send({
        acceptsSmoker: true,
        acceptsPets: false,
        acceptsMusic: true,
        acceptsChatter: false,
      });

    expect(res.status).toBe(201);
    expect(res.body.userPreferences).toBeDefined();
    expect(res.body.userPreferences).toHaveProperty('id');
    expect(res.body.userPreferences.id).toMatch(UUID_REGEX);
    expect(res.body.userPreferences).toHaveProperty('userId', userIds[0]);
    expect(res.body.userPreferences.userId).toMatch(UUID_REGEX);
    expect(res.body.userPreferences).toHaveProperty('acceptsSmoker', true);
    expect(res.body.userPreferences).toHaveProperty('acceptsPets', false);
    expect(res.body.userPreferences).toHaveProperty('acceptsMusic', true);
    expect(res.body.userPreferences).toHaveProperty('acceptsChatter', false);
  });

  it('POST /api/user-preferences/:id: 400<acceptsSmoker is required>', async () => {
    const res = await request(app)
      .post(`/api/user-preferences/${userIds[0]}`)
      .set('Cookie', cookies[0])
      .send({
        acceptsPets: false,
        acceptsMusic: true,
        acceptsChatter: false,
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message', 'acceptsSmoker is required');
  });

  it('POST /api/user-preferences/:id: 400<Must be true or false>', async () => {
    const res = await request(app)
      .post(`/api/user-preferences/${userIds[0]}`)
      .set('Cookie', cookies[0])
      .send({
        acceptsSmoker: 'hello',
        acceptsPets: false,
        acceptsMusic: true,
        acceptsChatter: false,
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message', 'Must be true or false');
  });

  it('POST /api/user-preferences/:id: 401<Missing token>', async () => {
    const res = await request(app)
      .post(`/api/user-preferences/${userIds[0]}`)
      .send({
        acceptsSmoker: 'true',
        acceptsPets: false,
        acceptsMusic: true,
        acceptsChatter: false,
      });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('message', 'Missing token');
  });

  it('POST /api/user-preferences/:id: 401<Invalid token>', async () => {
    const res = await request(app)
      .post(`/api/user-preferences/${userIds[0]}`)
      .set('Cookie', invalidCookie)
      .send({
        acceptsSmoker: 'true',
        acceptsPets: false,
        acceptsMusic: true,
        acceptsChatter: false,
      });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('message', 'Invalid token');
  });

  it('POST /api/user-preferences/:id: 400<Invalid ID>', async () => {
    const res = await request(app)
      .post(`/api/user-preferences/${invalidFormatId}`)
      .set('Cookie', cookies[0])
      .send({
        acceptsSmoker: 'true',
        acceptsPets: false,
        acceptsMusic: true,
        acceptsChatter: false,
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message', 'Invalid ID');
  });

  it('POST /api/user-preferences/:id: 403<Forbidden>', async () => {
    const res = await request(app)
      .post(`/api/user-preferences/${invalidValueId}`)
      .set('Cookie', cookies[0])
      .send({
        acceptsSmoker: 'true',
        acceptsPets: false,
        acceptsMusic: true,
        acceptsChatter: false,
      });

    expect(res.status).toBe(403);
    expect(res.body).toHaveProperty('message', 'Forbidden');
  });

  it('POST /api/user-preferences/:id: 409<UserPreferences already exists>', async () => {
    const res = await request(app)
      .post(`/api/user-preferences/${userIds[0]}`)
      .set('Cookie', cookies[0])
      .send({
        acceptsSmoker: 'true',
        acceptsPets: false,
        acceptsMusic: true,
        acceptsChatter: false,
      });

    expect(res.status).toBe(409);
    expect(res.body).toHaveProperty(
      'message',
      'UserPreferences already exists'
    );
  });
});
