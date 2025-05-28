// backend/src/tests/userPreferencesControllerTest/userPreferences.getUser.test.ts
import request from 'supertest';
import app from '../../../app';
import prismaNewClient from '../../../lib/prisma';
import {
  cookies,
  createUserAndSignIn,
  createUserPreferences,
  invalidCookie,
  resetDB,
  testEmails,
  userIds,
} from '../../test.utils';
import { UUID_REGEX } from '../../../utils/validation';

beforeAll(async () => {
  await resetDB();

  const user = await createUserAndSignIn(testEmails[0]);
  userIds[0] = user.body.data.id;
  cookies[0] = user.headers['set-cookie'];
  await createUserPreferences(userIds[0], cookies[0]);
});

afterEach(() => {
  jest.restoreAllMocks();
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
    expect(res.body.data).toBeDefined();
    expect(res.body.data).toHaveProperty('id');
    expect(res.body.data.id).toMatch(UUID_REGEX);
    expect(res.body.data).toHaveProperty('userId', userIds[0]);
    expect(res.body.data.userId).toMatch(UUID_REGEX);
    expect(res.body.data).toHaveProperty('acceptsSmoker', true);
    expect(res.body.data).toHaveProperty('acceptsPets', false);
    expect(res.body.data).toHaveProperty('acceptsMusic', true);
    expect(res.body.data).toHaveProperty('acceptsChatter', false);
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

  it('GET /api/user-preferences/me: 404<Not found UserPreferences: userPreferences not found>', async () => {
    jest
      .spyOn(prismaNewClient.userPreferences, 'findUnique')
      .mockResolvedValue(null);
    const res = await request(app)
      .get(`/api/user-preferences/me`)
      .set('Cookie', cookies[0]);

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty(
      'message',
      'Not found UserPreferences: userPreferences not found'
    );
  });

  it('GET /api/user-preferences/me: 500<Internal error UserPreferences: failed to getByUserId>', async () => {
    jest
      .spyOn(prismaNewClient.userPreferences, 'findUnique')
      .mockRejectedValue(new Error('DB exploded'));
    const res = await request(app)
      .get(`/api/user-preferences/me`)
      .set('Cookie', cookies[0]);

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty(
      'message',
      'Internal error UserPreferences: failed to getByUserId'
    );
  });
});
