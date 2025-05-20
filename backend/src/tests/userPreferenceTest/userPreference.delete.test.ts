// backend/src/tests/userPreferencesControllerTest/userPreferences.delete.test.ts
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
  it('DELETE /api/user-preferences/:id: 200<Preferences deleted!>', async () => {
    const res = await request(app)
      .delete(`/api/user-preferences/${userIds[0]}`)
      .set('Cookie', cookies[0]);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'Preferences deleted!');
  });

  it('DELETE /api/user-preferences/:id: 401<Missing token>', async () => {
    const res = await request(app).delete(
      `/api/user-preferences/${userIds[0]}`
    );

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('message', 'Missing token');
  });

  it('DELETE /api/user-preferences/:id: 401<Invalid token>', async () => {
    const res = await request(app)
      .delete(`/api/user-preferences/${userIds[0]}`)
      .set('Cookie', invalidCookie);

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('message', 'Invalid token');
  });

  it('DELETE /api/user-preferences/:id: 400<Invalid ID>', async () => {
    const res = await request(app)
      .delete(`/api/user-preferences/${invalidFormatId}`)
      .set('Cookie', cookies[0]);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message', 'Invalid ID');
  });

  it('DELETE /api/user-preferences/:id: 403<Forbidden>', async () => {
    const res = await request(app)
      .delete(`/api/user-preferences/${invalidValueId}`)
      .set('Cookie', cookies[0]);

    expect(res.status).toBe(403);
    expect(res.body).toHaveProperty('message', 'Forbidden');
  });
});
