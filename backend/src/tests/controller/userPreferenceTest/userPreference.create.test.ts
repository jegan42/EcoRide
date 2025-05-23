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
  it('POST /api/user-preferences/:id: 201<Successfully created UserPreferences: created> return a new UserPreferences', async () => {
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
    expect(res.body).toHaveProperty(
      'message',
      'Successfully created UserPreferences: created'
    );
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

  it('POST /api/user-preferences/:id: 400<Bad request Validator: acceptsSmoker is required>', async () => {
    const res = await request(app)
      .post(`/api/user-preferences/${userIds[0]}`)
      .set('Cookie', cookies[0])
      .send({
        acceptsPets: false,
        acceptsMusic: true,
        acceptsChatter: false,
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty(
      'message',
      'Bad request Validator: acceptsSmoker is required'
    );
  });

  it('POST /api/user-preferences/:id: 400<Bad request Validator: Must be true or false>', async () => {
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
    expect(res.body).toHaveProperty(
      'message',
      'Bad request Validator: Must be true or false'
    );
  });

  it('POST /api/user-preferences/:id: 401<Unauthorized access Athenticate: missing token>', async () => {
    const res = await request(app)
      .post(`/api/user-preferences/${userIds[0]}`)
      .send({
        acceptsSmoker: 'true',
        acceptsPets: false,
        acceptsMusic: true,
        acceptsChatter: false,
      });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty(
      'message',
      'Unauthorized access Athenticate: missing token'
    );
  });

  it('POST /api/user-preferences/:id: 401<Unauthorized access Athenticate: invalid token>', async () => {
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
    expect(res.body).toHaveProperty(
      'message',
      'Unauthorized access Athenticate: invalid token'
    );
  });

  it('POST /api/user-preferences/:id: 400<Bad request Validator: Invalid ID>', async () => {
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
    expect(res.body).toHaveProperty(
      'message',
      'Bad request Validator: Invalid ID'
    );
  });

  it('POST /api/user-preferences/:id: 403<Access denied Owner: not the owner>', async () => {
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
    expect(res.body).toHaveProperty(
      'message',
      'Access denied Owner: not the owner'
    );
  });

  it('POST /api/user-preferences/:id: 409<Conflict UserPreferences: already created userPreferences>', async () => {
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
      'Conflict UserPreferences: already created userPreferences'
    );
  });
});
