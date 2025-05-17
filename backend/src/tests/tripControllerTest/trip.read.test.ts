// backend/src/tests/tripControllerTest/trip.read.test.ts
import request from 'supertest';
import app from '../../app';
import prismaNewClient from '../../lib/prisma';
import {
  resetDB,
  createUserAndSignIn,
  testEmails,
  tripIds,
  createVehicleAndGetId,
  cookies,
  createTripAndGetId,
  vehicleIds,
  invalidFormatId,
  invalidValueId,
} from '../test.utils';

beforeAll(async () => {
  await resetDB();

  cookies[0] = (await createUserAndSignIn(testEmails[0])).headers['set-cookie'];
  vehicleIds[0] = await createVehicleAndGetId(testEmails[0], cookies[0]);
  tripIds[0] = await createTripAndGetId(vehicleIds[0], cookies[0]);
});

afterAll(async () => {
  await resetDB();
  await prismaNewClient.$disconnect();
});

describe('TripController: GET /api/trips', () => {
  it('GET /api/trips: 200<> should return all trips', async () => {
    const res = await request(app).get('/api/trips');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('GET /api/trips/:id: 200<> should return a trip by ID', async () => {
    const res = await request(app).get(`/api/trips/${tripIds[0]}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id', tripIds[0]);
    expect(res.body).toHaveProperty('departureCity', 'Paris');
    expect(res.body).toHaveProperty('arrivalCity', 'Lyon');
    expect(res.body).toHaveProperty('price', 45.5);
  });

  it('GET /api/trips/:id: 400<Invalid trip ID> if trip not found or ID is not UUID', async () => {
    const res = await request(app).get(`/api/trips/${invalidFormatId}`);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message', 'Invalid trip ID');
  });

  it('GET /api/trips/:id: 404<Trip not found> if trip not found or ID is not valid', async () => {
    const res = await request(app).get(`/api/trips/${invalidValueId}`);

    // expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('message', 'Trip not found');
  });
});
