// backend/src/tests/tripControllerTest/trip.read.test.ts
import request from 'supertest';
import app from '../../../app';
import prismaNewClient from '../../../lib/prisma';
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
} from '../../test.utils';
import { UUID_REGEX } from '../../../utils/validation';

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
  it('GET /api/trips: 200<Successfully Trips: getAll> should return all trips', async () => {
    const res = await request(app).get('/api/trips');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'Successfully Trips: getAll');
    expect(res.body.data).toBeDefined();
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('GET /api/trips/:id: 200<Successfully Trip: getById> should return a trip by ID', async () => {
    const res = await request(app).get(`/api/trips/${tripIds[0]}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'Successfully Trip: getById');
    expect(res.body.data).toBeDefined();
    expect(res.body).toHaveProperty('data');
    expect(res.body.data).toHaveProperty('id', tripIds[0]);
    expect(res.body.data.id).toMatch(UUID_REGEX);
    expect(res.body.data).toHaveProperty('driverId');
    expect(res.body.data.driverId).toMatch(UUID_REGEX);
    expect(res.body.data).toHaveProperty('vehicleId');
    expect(res.body.data.vehicleId).toMatch(UUID_REGEX);
    expect(res.body.data).toHaveProperty('departureCity', 'Paris');
    expect(res.body.data).toHaveProperty('arrivalCity', 'Lyon');
    expect(res.body.data).toHaveProperty('departureDate');
    expect(res.body.data).toHaveProperty('arrivalDate');
    expect(res.body.data).toHaveProperty('availableSeats', 3);
    expect(res.body.data).toHaveProperty('price', 45.5);
    expect(res.body.data).toHaveProperty('status', 'open');
  });

  it('GET /api/trips/:id: 400<Bad request Validator: invalid ID> if trip not found or ID is not UUID', async () => {
    const res = await request(app).get(`/api/trips/${invalidFormatId}`);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty(
      'message',
      'Bad request Validator: invalid ID'
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

  it('GET /api/trips: 500<Internal error Trip: failed to getAll>', async () => {
    jest
      .spyOn(prismaNewClient.trip, 'findMany')
      .mockRejectedValue(new Error('DB exploded'));
    const res = await request(app).get('/api/trips');

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty(
      'message',
      'Internal error Trip: failed to getAll'
    );
  });

  it('GET /api/trips/:id: 500<Internal error Trip: failed to getById>', async () => {
    jest
      .spyOn(prismaNewClient.trip, 'findUnique')
      .mockRejectedValue(new Error('DB exploded'));
    const res = await request(app).get(`/api/trips/${tripIds[0]}`);

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty(
      'message',
      'Internal error Trip: failed to getById'
    );
  });
});
