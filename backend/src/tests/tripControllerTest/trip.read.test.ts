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
import { UUID_REGEX } from '../../utils/validation';

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
  it('GET /api/trips: 200<Successfully Trip: getAll> should return all trips', async () => {
    const res = await request(app).get('/api/trips');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'Successfully Trip: getAll');
    expect(res.body.trips).toBeDefined();
    expect(Array.isArray(res.body.trips)).toBe(true);
  });

  it('GET /api/trips/:id: 200<Successfully Trip: getById> should return a trip by ID', async () => {
    const res = await request(app).get(`/api/trips/${tripIds[0]}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'Successfully Trip: getById');
    expect(res.body.trip).toBeDefined();
    expect(res.body).toHaveProperty('trip');
    expect(res.body.trip).toHaveProperty('id', tripIds[0]);
    expect(res.body.trip.id).toMatch(UUID_REGEX);
    expect(res.body.trip).toHaveProperty('driverId');
    expect(res.body.trip.driverId).toMatch(UUID_REGEX);
    expect(res.body.trip).toHaveProperty('vehicleId');
    expect(res.body.trip.vehicleId).toMatch(UUID_REGEX);
    expect(res.body.trip).toHaveProperty('departureCity', 'Paris');
    expect(res.body.trip).toHaveProperty('arrivalCity', 'Lyon');
    expect(res.body.trip).toHaveProperty('departureDate');
    expect(res.body.trip).toHaveProperty('arrivalDate');
    expect(res.body.trip).toHaveProperty('availableSeats', 3);
    expect(res.body.trip).toHaveProperty('price', 45.5);
    expect(res.body.trip).toHaveProperty('status', 'open');
  });

  it('GET /api/trips/:id: 400<Bad request Validator: Invalid ID> if trip not found or ID is not UUID', async () => {
    const res = await request(app).get(`/api/trips/${invalidFormatId}`);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty(
      'message',
      'Bad request Validator: Invalid ID'
    );
  });

  it('GET /api/trips/:id: 404<Not found Trip: trip not found> if trip not found or ID is not valid', async () => {
    const res = await request(app).get(`/api/trips/${invalidValueId}`);

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty(
      'message',
      'Not found Trip: trip not found'
    );
  });
});
