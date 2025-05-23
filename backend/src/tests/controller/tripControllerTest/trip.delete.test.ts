// backend/src/tests/tripControllerTest/trip.read.test.ts
import request from 'supertest';
import app from '../../../app';
import prismaNewClient from '../../../lib/prisma';
import {
  createUserAndSignIn,
  testEmails,
  cookies,
  tripIds,
  resetDB,
  createVehicleAndGetId,
  createTripAndGetId,
  vehicleIds,
  invalidFormatId,
  invalidValueId,
} from '../../test.utils';

beforeAll(async () => {
  await resetDB();

  cookies[0] = (await createUserAndSignIn(testEmails[0])).headers['set-cookie'];
  cookies[1] = (await createUserAndSignIn(testEmails[1])).headers['set-cookie'];
  await prismaNewClient.user.update({
    where: { email: testEmails[1] },
    data: { role: { push: 'driver' } },
  });

  vehicleIds[0] = await createVehicleAndGetId(testEmails[0], cookies[0]);
  tripIds[0] = await createTripAndGetId(vehicleIds[0], cookies[0]);
  tripIds[1] = await createTripAndGetId(
    vehicleIds[0],
    cookies[0],
    '2125-12-05T08:00:00Z',
    '2125-12-05T10:00:00Z'
  );
});

afterAll(async () => {
  await resetDB();
  await prismaNewClient.$disconnect();
});

describe('TripController: DELETE /api/trips/:id', () => {
  it('DELETE /api/trips/:id: 200<Successfully Trip: deleted>', async () => {
    const res = await request(app)
      .delete(`/api/trips/${tripIds[0]}`)
      .set('Cookie', cookies[0]);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'Successfully Trip: deleted');

    const check = await prismaNewClient.trip.findUnique({
      where: { id: tripIds[0] },
    });
    expect(check).toBeNull();
  });

  it('DELETE /api/trips/:id: 400<Bad request Validator: Invalid ID> with invalid format Id', async () => {
    const res = await request(app)
      .delete(`/api/trips/${invalidFormatId}`)
      .set('Cookie', cookies[0]);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty(
      'message',
      'Bad request Validator: Invalid ID'
    );
  });

  it('DELETE /api/trips/:id: 404<Not found Trip: trip not found> with invalid Value Id', async () => {
    const res = await request(app)
      .delete(`/api/trips/${invalidValueId}`)
      .set('Cookie', cookies[0]);

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty(
      'message',
      'Not found Trip: trip not found'
    );
  });

  it('DELETE /api/trips/:id: 404<Not found Trip: trip not found> if trip does not exist', async () => {
    const res = await request(app)
      .delete(`/api/trips/${tripIds[0]}`)
      .set('Cookie', cookies[0]);

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty(
      'message',
      'Not found Trip: trip not found'
    );
  });

  it('DELETE /api/trips/:id: 403<Access denied Trip: not a driver> user is not the owner (unauthorized delete)', async () => {
    const res = await request(app)
      .delete(`/api/trips/${tripIds[1]}`)
      .set('Cookie', cookies[1]);

    expect(res.status).toBe(403);
    expect(res.body).toHaveProperty(
      'message',
      'Access denied Trip: not a driver'
    );
  });
});
