// backend/src/tests/tripControllerTest/trip.search.test.ts
import request from 'supertest';
import app from '../../../app';
import prismaNewClient from '../../../lib/prisma';
import {
  cookies,
  createTripAndGetId,
  createUserAndSignIn,
  createVehicleAndGetId,
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
});

afterAll(async () => {
  await resetDB();
  await prismaNewClient.$disconnect();
});

describe('TripController: GET /api/trips (search)', () => {
  it('GET /api/trips (search): 200<Successfully Trip: getAll> should return trips matching from/to params', async () => {
    const res = await request(app).get('/api/trips?from=Paris&to=Lyon');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'Successfully Trip: getAll');
    expect(Array.isArray(res.body.trips)).toBe(true);
    expect(res.body.trips[0]).toHaveProperty('departureCity', 'Paris');
    expect(res.body.trips[0]).toHaveProperty('arrivalCity', 'Lyon');
  });

  it('GET /api/trips (search): 200<Successfully Trip: trips not found matching your criteria> should return no results for unmatched cities', async () => {
    const res = await request(app).get('/api/trips?from=Berlin&to=Rome');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty(
      'message',
      'Successfully Trip: trips not found matching your criteria'
    );
  });

  it('GET /api/trips (search): 200<Successfully Trip: getAll> should return trips with exact date', async () => {
    const res = await request(app).get('/api/trips?date=2125-12-01');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'Successfully Trip: getAll');
    expect(Array.isArray(res.body.trips)).toBe(true);
  });

  it('GET /api/trips (search): 200<Successfully Trip: getAll> should return trips with flexible date', async () => {
    const res = await request(app).get(
      '/api/trips?date=2125-12-03&flexible=true'
    );
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'Successfully Trip: getAll');
    expect(Array.isArray(res.body.trips)).toBe(true);
  });

  it('GET /api/trips (search): 200<Successfully Trip: alternative trips founded> should return alternative trips with no-match date', async () => {
    const res = await request(app).get('/api/trips?date=2125-12-03');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty(
      'message',
      'Successfully Trip: alternative trips founded'
    );
    expect(Array.isArray(res.body.trips)).toBe(true);
  });

  it('GET /api/trips (search): 200<Successfully Trip: trips not found matching your criteria> no trip and no alternative for a date', async () => {
    const res = await request(app).get('/api/trips?date=2125-01-01');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty(
      'message',
      'Successfully Trip: trips not found matching your criteria'
    );
  });
});
