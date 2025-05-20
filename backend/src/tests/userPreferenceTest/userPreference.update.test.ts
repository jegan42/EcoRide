// backend/src/tests/userPreferencesControllerTest/userPreferences.update.test.ts
import request from 'supertest';
import app from '../../app';
import prismaNewClient from '../../lib/prisma';
import {
  cookies,
  createUserAndSignIn,
  createUserPreferences,
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
  await createUserPreferences(userIds[0], cookies[0]);
});

afterAll(async () => {
  await resetDB();
  await prismaNewClient.$disconnect();
});

describe('UserPreferencesController: PUT /api/user-preferences/:id', () => {
  it('PUT /api/user-preferences/:id: 200<> return a UserPreferences', async () => {
    const beforeRes = await prismaNewClient.userPreferences.findUnique({
      where: { userId: userIds[0] },
    });
    expect(beforeRes).toHaveProperty('id');
    expect(beforeRes?.id).toMatch(UUID_REGEX);
    expect(beforeRes).toHaveProperty('userId', userIds[0]);
    expect(beforeRes?.userId).toMatch(UUID_REGEX);
    expect(beforeRes).toHaveProperty('acceptsSmoker', true);
    expect(beforeRes).toHaveProperty('acceptsPets', false);
    expect(beforeRes).toHaveProperty('acceptsMusic', true);
    expect(beforeRes).toHaveProperty('acceptsChatter', false);

    const res = await request(app)
      .put(`/api/user-preferences/${userIds[0]}`)
      .set('Cookie', cookies[0])
      .send({
        acceptsSmoker: false,
        acceptsPets: true,
        acceptsMusic: false,
        acceptsChatter: true,
      });

    expect(res.status).toBe(200);
    expect(res.body.userPreferences).toBeDefined();
    expect(res.body.userPreferences).toHaveProperty('id');
    expect(res.body.userPreferences.id).toMatch(UUID_REGEX);
    expect(res.body.userPreferences).toHaveProperty('userId', userIds[0]);
    expect(res.body.userPreferences.userId).toMatch(UUID_REGEX);
    expect(res.body.userPreferences).toHaveProperty('acceptsSmoker', false);
    expect(res.body.userPreferences).toHaveProperty('acceptsPets', true);
    expect(res.body.userPreferences).toHaveProperty('acceptsMusic', false);
    expect(res.body.userPreferences).toHaveProperty('acceptsChatter', true);
  });

  it('PUT /api/user-preferences/:id: 400<Must be true or false>', async () => {
    const res = await request(app)
      .put(`/api/user-preferences/${userIds[0]}`)
      .set('Cookie', cookies[0])
      .send({
        acceptsSmoker: 123,
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message', 'Must be true or false');
  });

  it('PUT /api/user-preferences/:id: 400<Must be true or false>', async () => {
    const res = await request(app)
      .put(`/api/user-preferences/${userIds[0]}`)
      .set('Cookie', cookies[0])
      .send({
        acceptsSmoker: 'hello',
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message', 'Must be true or false');
  });

  it('PUT /api/user-preferences/:id: 400<Invalid or missing fields>', async () => {
    const res = await request(app)
      .put(`/api/user-preferences/${userIds[0]}`)
      .set('Cookie', cookies[0])
      .send({});

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message', 'Invalid or missing fields');
  });

  it('PUT /api/user-preferences/:id: 401<Missing token>', async () => {
    const res = await request(app)
      .put(`/api/user-preferences/${userIds[0]}`)
      .send({
        acceptsSmoker: false,
      });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('message', 'Missing token');
  });

  it('PUT /api/user-preferences/:id: 401<Invalid token>', async () => {
    const res = await request(app)
      .put(`/api/user-preferences/${userIds[0]}`)
      .set('Cookie', invalidCookie)
      .send({
        acceptsSmoker: false,
      });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('message', 'Invalid token');
  });

  it('PUT /api/user-preferences/:id: 400<Invalid ID>', async () => {
    const res = await request(app)
      .put(`/api/user-preferences/${invalidFormatId}`)
      .set('Cookie', cookies[0])
      .send({
        acceptsSmoker: false,
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message', 'Invalid ID');
  });

  it('PUT /api/user-preferences/:id: 403<Forbidden>', async () => {
    const res = await request(app)
      .put(`/api/user-preferences/${invalidValueId}`)
      .set('Cookie', cookies[0])
      .send({
        acceptsSmoker: false,
      });

    expect(res.status).toBe(403);
    expect(res.body).toHaveProperty('message', 'Forbidden');
  });
});
