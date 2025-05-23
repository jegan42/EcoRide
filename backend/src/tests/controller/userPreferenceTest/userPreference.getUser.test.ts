// backend/src/tests/userPreferencesControllerTest/userPreferences.getUser.test.ts
import request from 'supertest';
import app from '../../app';
import prismaNewClient from '../../lib/prisma';
import {
  cookies,
  createUserAndSignIn,
  createUserPreferences,
  invalidCookie,
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

describe('UserPreferencesController: GET /api/user-preferences/me', () => {
  it('GET /api/user-preferences/me: 200<Successfully UserPreferences: getByUserId> return a UserPreferences', async () => {
    const res = await request(app)
      .get(`/api/user-preferences/me`)
      .set('Cookie', cookies[0]);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty(
      'message',
      'Successfully UserPreferences: getByUserId'
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

  it('GET /api/user-preferences/me: 401<Unauthorized access Athenticate: missing token>', async () => {
    const res = await request(app).get(`/api/user-preferences/me`);

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty(
      'message',
      'Unauthorized access Athenticate: missing token'
    );
  });

  it('GET /api/user-preferences/me: 401<Unauthorized access Athenticate: invalid token>', async () => {
    const res = await request(app)
      .get(`/api/user-preferences/me`)
      .set('Cookie', invalidCookie);

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty(
      'message',
      'Unauthorized access Athenticate: invalid token'
    );
  });
});
