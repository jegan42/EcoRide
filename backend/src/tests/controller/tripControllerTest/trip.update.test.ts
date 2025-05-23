// backend/src/tests/tripControllerTest/trip.update.test.ts
import request from 'supertest';
import app from '../../../app';
import prismaNewClient from '../../../lib/prisma';
import {
  cookies,
  createTripAndGetId,
  createUserAndSignIn,
  createVehicleAndGetId,
  invalidFormatId,
  invalidValueId,
  resetDB,
  testEmails,
  tripIds,
  vehicleIds,
} from '../../test.utils';

beforeAll(async () => {
  await resetDB();

  cookies[0] = (await createUserAndSignIn(testEmails[0])).headers['set-cookie'];
  vehicleIds[0] = await createVehicleAndGetId(testEmails[0], cookies[0]);
  tripIds[0] = await createTripAndGetId(vehicleIds[0], cookies[0]);
  cookies[1] = (await createUserAndSignIn(testEmails[1])).headers['set-cookie'];
  await prismaNewClient.user.update({
    where: { email: testEmails[1] },
    data: { role: { push: 'driver' } },
  });
  vehicleIds[1] = await createVehicleAndGetId(testEmails[1], cookies[1], '1');

  tripIds[1] = await createTripAndGetId(
    vehicleIds[1],
    cookies[1],
    '2125-11-05T08:00:00Z',
    '2125-11-05T10:00:00Z'
  );
});

afterAll(async () => {
  await resetDB();
  await prismaNewClient.$disconnect();
});

describe('TripController: PUT /api/trips/:id', () => {
  it('PUT /api/trips/:id: 200<Successfully Trip: updated> should update an existing trip', async () => {
    const res = await request(app)
      .put(`/api/trips/${tripIds[0]}`)
      .set('Cookie', cookies[0])
      .send({
        price: 22,
        availableSeats: 2,
        arrivalCity: 'Brussels',
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'Successfully Trip: updated');
    expect(res.body.trip).toHaveProperty('id', tripIds[0]);
    expect(res.body.trip).toHaveProperty('price', 22);
    expect(res.body.trip).toHaveProperty('availableSeats', 2);
    expect(res.body.trip).toHaveProperty('arrivalCity', 'Brussels');
  });

  it('PUT /api/trips/:id: 400<Bad request Validator: invalid ID> trip ID is invalid format', async () => {
    const res = await request(app)
      .put(`/api/trips/${invalidFormatId}`)
      .set('Cookie', cookies[0])
      .send({
        price: 30,
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty(
      'message',
      'Bad request Validator: invalid ID'
    );
  });

  it('PUT /api/trips/:id: 404<Not found Trip: trip not found> trip ID is invalid value', async () => {
    const res = await request(app)
      .put(`/api/trips/${invalidValueId}`)
      .set('Cookie', cookies[0])
      .send({
        price: 30,
      });

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty(
      'message',
      'Not found Trip: trip not found'
    );
  });

  it('PUT /api/trips/:id: 401<Unauthorized access Athenticate: missing token> not authenticated', async () => {
    const res = await request(app).put(`/api/trips/${tripIds[0]}`).send({
      price: 30,
    });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty(
      'message',
      'Unauthorized access Athenticate: missing token'
    );
  });

  it('PUT /api/trips/:id: 403<Access denied Trip: not a driver> user is not the owner', async () => {
    const res = await request(app)
      .put(`/api/trips/${tripIds[0]}`)
      .set('Cookie', cookies[1])
      .send({
        price: 30,
      });

    expect(res.status).toBe(403);
    expect(res.body).toHaveProperty(
      'message',
      'Access denied Trip: not a driver'
    );
  });

  it('PUT /api/trips/:id: 403<Access denied Authorize: insufficient permissions> user does not have permission to update', async () => {
    await prismaNewClient.user.update({
      where: { email: testEmails[0] },
      data: { role: ['passenger'] },
    });
    const res = await request(app)
      .put(`/api/trips/${tripIds[0]}`)
      .set('Cookie', cookies[0])
      .send({
        price: 30,
      });

    expect(res.status).toBe(403);
    expect(res.body).toHaveProperty(
      'message',
      'Access denied Authorize: insufficient permissions'
    );
  });

  it('PUT /api/trips/:id: 500<Internal error Trip: failed to update>', async () => {
    jest
      .spyOn(prismaNewClient.trip, 'update')
      .mockRejectedValue(new Error('DB exploded'));
    const res = await request(app)
      .put(`/api/trips/${tripIds[1]}`)
      .set('Cookie', cookies[1])
      .send({
        price: 22,
        availableSeats: 2,
        arrivalCity: 'Nice',
      });

    expect(res.body).toHaveProperty(
      'message',
      'Internal error Trip: failed to update'
    );
    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty(
      'message',
      'Internal error Trip: failed to update'
    );
  });
});
