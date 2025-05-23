// backend/src/tests/userPreferencesControllerTest/userPreferences.delete.test.ts
import request from 'supertest';
import app from '../../../app';
import prismaNewClient from '../../../lib/prisma';
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
} from '../../test.utils';

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

describe('UserPreferencesController: DELETE /api/user-preferences/:id', () => {
  it('DELETE /api/user-preferences/:id: 200<Successfully UserPreferences: deleted>', async () => {
    const res = await request(app)
      .delete(`/api/user-preferences/${userIds[0]}`)
      .set('Cookie', cookies[0]);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty(
      'message',
      'Successfully UserPreferences: deleted'
    );
  });

  it('DELETE /api/user-preferences/:id: 401<Unauthorized access Athenticate: missing token>', async () => {
    const res = await request(app).delete(
      `/api/user-preferences/${userIds[0]}`
    );

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty(
      'message',
      'Unauthorized access Athenticate: missing token'
    );
  });

  it('DELETE /api/user-preferences/:id: 401<Unauthorized access Athenticate: invalid token>', async () => {
    const res = await request(app)
      .delete(`/api/user-preferences/${userIds[0]}`)
      .set('Cookie', invalidCookie);

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty(
      'message',
      'Unauthorized access Athenticate: invalid token'
    );
  });

  it('DELETE /api/user-preferences/:id: 400<Bad request Validator: Invalid ID>', async () => {
    const res = await request(app)
      .delete(`/api/user-preferences/${invalidFormatId}`)
      .set('Cookie', cookies[0]);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty(
      'message',
      'Bad request Validator: Invalid ID'
    );
  });

  it('DELETE /api/user-preferences/:id: 403<Access denied Owner: not the owner>', async () => {
    const res = await request(app)
      .delete(`/api/user-preferences/${invalidValueId}`)
      .set('Cookie', cookies[0]);

    expect(res.status).toBe(403);
    expect(res.body).toHaveProperty(
      'message',
      'Access denied Owner: not the owner'
    );
  });
});
