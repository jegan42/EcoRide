// backend/src/tests/tripControllerTest/trip.search.test.ts
import request from 'supertest';
import app from '../../app';
import prismaNewClient from '../../lib/prisma';
import {
  cookies,
  createTripAndGetId,
  createUserAndSignIn,
  createVehicleAndGetId,
  resetDB,
  testEmails,
  tripIds,
  vehicleIds,
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

describe('TripController: GET /api/trips (search)', () => {
  it('GET /api/trips (search): 200<> should return trips matching from/to params', async () => {
    const res = await request(app).get('/api/trips?from=Paris&to=Lyon');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty('departureCity', 'Paris');
    expect(res.body[0]).toHaveProperty('arrivalCity', 'Lyon');
  });

  it('GET /api/trips (search): 200<No trips found matching your criteria.> should return no results for unmatched cities', async () => {
    const res = await request(app).get('/api/trips?from=Berlin&to=Rome');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty(
      'message',
      'No trips found matching your criteria.'
    );
  });

  it('GET /api/trips (search): 200<> should return trips with exact date', async () => {
    const res = await request(app).get('/api/trips?date=2125-12-01');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /api/trips (search): 200<> should return trips with flexible date', async () => {
    const res = await request(app).get(
      '/api/trips?date=2125-12-02&flexible=true'
    );
    expect(res.status).toBe(200);
    expect(
      Array.isArray(res.body) ||
        res.body.alternative === true ||
        res.body.message
    ).toBe(true);
  });

  it('GET /api/trips (search): 200<> should return alternative trips with no-match date', async () => {
    const res = await request(app).get(
      '/api/trips?date=2125-12-02&flexible=true'
    );
    expect(res.status).toBe(200);
    expect(
      Array.isArray(res.body) ||
        res.body.alternative === true ||
        res.body.message
    ).toBe(true);
  });

  it('GET /api/trips (search): 200<No trips found matching your criteria.> should return no results for date with no match', async () => {
    const res = await request(app).get('/api/trips?date=2125-01-01');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty(
      'message',
      'No trips found matching your criteria.'
    );
  });
});
