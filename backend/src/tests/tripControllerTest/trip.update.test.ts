// backend/src/tests/tripControllerTest/trip.update.test.ts
import request from 'supertest';
import app from '../../app';
import prismaNewClient from '../../lib/prisma';
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
} from '../test.utils';

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
});

afterAll(async () => {
  await resetDB();
  await prismaNewClient.$disconnect();
});

describe('TripController: PUT /api/trips/:id', () => {
  it('PUT /api/trips/:id: 200<> should update an existing trip', async () => {
    const res = await request(app)
      .put(`/api/trips/${tripIds[0]}`)
      .set('Cookie', cookies[0])
      .send({
        price: 22,
        availableSeats: 2,
        arrivalCity: 'Brussels',
      });

    expect(res.status).toBe(200);
    expect(res.body.trip).toHaveProperty('id', tripIds[0]);
    expect(res.body.trip).toHaveProperty('price', 22);
    expect(res.body.trip).toHaveProperty('availableSeats', 2);
    expect(res.body.trip).toHaveProperty('arrivalCity', 'Brussels');
  });

  it('PUT /api/trips/:id: 400<Invalid ID> trip ID is invalid format', async () => {
    const res = await request(app)
      .put(`/api/trips/${invalidFormatId}`)
      .set('Cookie', cookies[0])
      .send({
        price: 30,
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message', 'Invalid ID');
  });

  it('PUT /api/trips/:id: 404<Trip not found> trip ID is invalid value', async () => {
    const res = await request(app)
      .put(`/api/trips/${invalidValueId}`)
      .set('Cookie', cookies[0])
      .send({
        price: 30,
      });

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('message', 'Trip not found');
  });

  it('PUT /api/trips/:id: 401<Missing token> not authenticated', async () => {
    const res = await request(app).put(`/api/trips/${tripIds[0]}`).send({
      price: 30,
    });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('message', 'Missing token');
  });

  it('PUT /api/trips/:id: 403<Unauthorized> user is not the owner', async () => {
    const res = await request(app)
      .put(`/api/trips/${tripIds[0]}`)
      .set('Cookie', cookies[1])
      .send({
        price: 30,
      });

    expect(res.status).toBe(403);
    expect(res.body).toHaveProperty('message', 'Unauthorized');
  });

  it('PUT /api/trips/:id: 403<Access denied: insufficient permissions> user does not have permission to update', async () => {
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
      'Access denied: insufficient permissions'
    );
  });
});
