// backend/src/tests/tripControllerTest/trip.create.test.ts
import request from 'supertest';
import app from '../../app';
import prismaNewClient from '../../lib/prisma';
import {
  createUserAndSignIn,
  testEmails,
  cookies,
  vehicleIds,
  createVehicleAndGetId,
  resetDB,
  invalidFormatId,
  invalidValueId,
} from '../test.utils';

beforeAll(async () => {
  await resetDB();

  cookies[0] = (await createUserAndSignIn(testEmails[0])).headers['set-cookie'];
  vehicleIds[0] = await createVehicleAndGetId(testEmails[0], cookies[0]);
  cookies[1] = (await createUserAndSignIn(testEmails[1])).headers['set-cookie'];
});

afterAll(async () => {
  await resetDB();
  await prismaNewClient.$disconnect();
});

describe('TripController: POST /api/trips', () => {
  it('POST /api/trips: 201<> should create a new trip with valid data', async () => {
    const res = await request(app)
      .post('/api/trips')
      .set('Cookie', cookies[0])
      .send({
        vehicleId: vehicleIds[0],
        departureCity: 'Paris',
        arrivalCity: 'Lyon',
        departureDate: '2125-06-01T08:00:00.000Z',
        arrivalDate: '2125-06-01T12:00:00.000Z',
        availableSeats: 3,
        price: 45.5,
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('departureCity', 'Paris');
    expect(res.body).toHaveProperty('arrivalCity', 'Lyon');
    expect(res.body).toHaveProperty('availableSeats', 3);
    expect(res.body).toHaveProperty('status', 'open');
    expect(res.body).toHaveProperty('price', 45.5);
  });

  it('POST /api/trips: 400<Arrival date is required> if missing Arrival date required fields', async () => {
    const res = await request(app)
      .post('/api/trips')
      .set('Cookie', cookies[0])
      .send({
        vehicleId: vehicleIds[0],
        departureCity: 'Paris',
        arrivalCity: 'Lyon',
        departureDate: '2125-06-01T08:00:00.000Z',
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message', 'Arrival date is required');
  });

  it('POST /api/trips: 400<Price is required> if missing Price required fields', async () => {
    const res = await request(app)
      .post('/api/trips')
      .set('Cookie', cookies[0])
      .send({
        vehicleId: vehicleIds[0],
        departureCity: 'Paris',
        arrivalCity: 'Lyon',
        departureDate: '2125-06-01T08:00:00.000Z',
        arrivalDate: '2125-06-01T12:00:00.000Z',
        availableSeats: 3,
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message', 'Price is required');
  });

  it('POST /api/trips: 401<Missing token> if not authenticated', async () => {
    const res = await request(app).post('/api/trips').send({
      vehicleId: vehicleIds[0],
      departureCity: 'Paris',
      arrivalCity: 'Lyon',
      departureDate: '2125-06-01T08:00:00.000Z',
      arrivalDate: '2125-06-01T12:00:00.000Z',
      availableSeats: 4,
      price: 50.0,
    });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('message', 'Missing token');
  });

  it('POST /api/trips: 400<Departure date must be a valid ISO 8601 date> if departureDate is invalid', async () => {
    const res = await request(app)
      .post('/api/trips')
      .set('Cookie', cookies[0])
      .send({
        vehicleId: vehicleIds[0],
        departureCity: 'Paris',
        arrivalCity: 'Lyon',
        departureDate: 'invalid-date',
        arrivalDate: '2125-06-01T12:00:00.000Z',
        availableSeats: 4,
        price: 50.0,
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty(
      'message',
      'Departure date must be a valid ISO 8601 date'
    );
  });

  it('POST /api/trips: 403<Invalid token> if JWT is invalid', async () => {
    const res = await request(app)
      .post('/api/trips')
      .set('Cookie', ['jwtToken=invalidtoken'])
      .send({
        vehicleId: vehicleIds[0],
        departureCity: 'Paris',
        arrivalCity: 'Lyon',
        departureDate: '2125-06-01T08:00:00.000Z',
        arrivalDate: '2125-06-01T12:00:00.000Z',
        availableSeats: 3,
        price: 45.5,
      });

    expect(res.status).toBe(403);
    expect(res.body).toHaveProperty('message', 'Invalid token');
  });

  it('POST /api/trips: 400<Available seats must be at least 1> if availableSeats is less than 1', async () => {
    const res = await request(app)
      .post('/api/trips')
      .set('Cookie', cookies[0])
      .send({
        vehicleId: vehicleIds[0],
        departureCity: 'Paris',
        arrivalCity: 'Lyon',
        departureDate: '2125-06-01T08:00:00.000Z',
        arrivalDate: '2125-06-01T12:00:00.000Z',
        availableSeats: 0,
        price: 45.5,
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty(
      'message',
      'Available seats must be at least 1'
    );
  });

  it('POST /api/trips: 400<Price must be a positive number> if price is negative', async () => {
    const res = await request(app)
      .post('/api/trips')
      .set('Cookie', cookies[0])
      .send({
        vehicleId: vehicleIds[0],
        departureCity: 'Paris',
        arrivalCity: 'Lyon',
        departureDate: '2125-06-01T08:00:00.000Z',
        arrivalDate: '2125-06-01T12:00:00.000Z',
        availableSeats: 3,
        price: -1,
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty(
      'message',
      'Price must be a positive number'
    );
  });

  it('POST /api/trips: 400<DepartureDate must be before arrivalDate> if departureDate is after arrivalDate', async () => {
    const res = await request(app)
      .post('/api/trips')
      .set('Cookie', cookies[0])
      .send({
        vehicleId: vehicleIds[0],
        departureCity: 'Paris',
        arrivalCity: 'Lyon',
        departureDate: '2125-06-01T20:00:00.000Z',
        arrivalDate: '2125-06-01T08:00:00.000Z',
        availableSeats: 3,
        price: 50,
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty(
      'message',
      'DepartureDate must be before arrivalDate'
    );
  });

  it('POST /api/trips: 400<DepartureDate and arrivalDate can start at the same date but not same time> if departureDate strict equal (time) arrivalDate', async () => {
    const res = await request(app)
      .post('/api/trips')
      .set('Cookie', cookies[0])
      .send({
        vehicleId: vehicleIds[0],
        departureCity: 'Paris',
        arrivalCity: 'Lyon',
        departureDate: '2125-06-01T08:00:00.000Z',
        arrivalDate: '2125-06-01T08:00:00.000Z',
        availableSeats: 3,
        price: 50,
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty(
      'message',
      'DepartureDate and arrivalDate can start at the same date but not same time'
    );
  });

  it('POST /api/trips: 400<availableSeats must be an Int> if fields are of incorrect type', async () => {
    const res = await request(app)
      .post('/api/trips')
      .set('Cookie', cookies[0])
      .send({
        vehicleId: vehicleIds[0],
        departureCity: 'Paris',
        arrivalCity: 'Lyon',
        departureDate: '2125-06-01T12:00:00.000Z',
        arrivalDate: '2125-06-01T20:00:00.000Z',
        availableSeats: 'one',
        price: 10,
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message', 'availableSeats must be an Int');
  });

  it('POST /api/trips: 403<Access denied: insufficient permissions> if user is not a driver', async () => {
    const res = await request(app)
      .post('/api/trips')
      .set('Cookie', cookies[1])
      .send({
        vehicleId: vehicleIds[0],
        departureCity: 'Paris',
        arrivalCity: 'Lyon',
        departureDate: '2125-06-01T12:00:00.000Z',
        arrivalDate: '2125-06-01T20:00:00.000Z',
        availableSeats: 3,
        price: 10,
      });

    expect(res.status).toBe(403);
    expect(res.body).toHaveProperty(
      'message',
      'Access denied: insufficient permissions'
    );
  });

  it('POST /api/trips: 400<Departure city is required> if from city names are empty strings', async () => {
    const res = await request(app)
      .post('/api/trips')
      .set('Cookie', cookies[0])
      .send({
        vehicleId: vehicleIds[0],
        departureCity: '',
        arrivalCity: 'Lyon',
        departureDate: '2125-06-01T12:00:00.000Z',
        arrivalDate: '2125-06-01T20:00:00.000Z',
        availableSeats: 3,
        price: 10,
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message', 'Departure city is required');
  });

  it('POST /api/trips: 400<DepartureDate must be after today>', async () => {
    const res = await request(app)
      .post('/api/trips')
      .set('Cookie', cookies[0])
      .send({
        vehicleId: vehicleIds[0],
        departureCity: 'Paris',
        arrivalCity: 'Lyon',
        departureDate: '2024-06-01T12:00:00.000Z',
        arrivalDate: '2024-06-01T20:00:00.000Z',
        availableSeats: 3,
        price: 10,
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty(
      'message',
      'DepartureDate must be after today'
    );
  });

  it('POST /api/trips: 400<Arrival city is required> if to city names are empty strings', async () => {
    const res = await request(app)
      .post('/api/trips')
      .set('Cookie', cookies[0])
      .send({
        vehicleId: vehicleIds[0],
        departureCity: 'Paris',
        arrivalCity: '',
        departureDate: '2125-06-01T12:00:00.000Z',
        arrivalDate: '2125-06-01T20:00:00.000Z',
        availableSeats: 3,
        price: 10,
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message', 'Arrival city is required');
  });

  it('POST /api/trips: 400<Vehicle ID is required> if vehicleId is missing', async () => {
    const res = await request(app)
      .post('/api/trips')
      .set('Cookie', cookies[0])
      .send({
        departureCity: 'Paris',
        arrivalCity: 'Lyon',
        departureDate: '2125-06-01T12:00:00.000Z',
        arrivalDate: '2125-06-01T20:00:00.000Z',
        availableSeats: 3,
        price: 10,
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message', 'Vehicle ID is required');
  });

  it('POST /api/trips: 400<Vehicle not found> if vehicleId is invalid format', async () => {
    const res = await request(app)
      .post('/api/trips')
      .set('Cookie', cookies[0])
      .send({
        vehicleId: invalidFormatId,
        departureCity: 'Paris',
        arrivalCity: 'Lyon',
        departureDate: '2125-06-01T12:00:00.000Z',
        arrivalDate: '2125-06-01T20:00:00.000Z',
        availableSeats: 3,
        price: 10,
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message', 'Vehicle not found');
  });

  it('POST /api/trips: 400<Vehicle not found> if vehicleId is invalid value', async () => {
    const res = await request(app)
      .post('/api/trips')
      .set('Cookie', cookies[0])
      .send({
        vehicleId: invalidValueId,
        departureCity: 'Paris',
        arrivalCity: 'Lyon',
        departureDate: '2125-06-01T12:00:00.000Z',
        arrivalDate: '2125-06-01T20:00:00.000Z',
        availableSeats: 3,
        price: 10,
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message', 'Vehicle not found');
  });

  it('POST /api/trips: 409<A trip with the same vehicle and user already exists on this date.> trip already exists for same user/date/vehicle', async () => {
    const res = await request(app)
      .post('/api/trips')
      .set('Cookie', cookies[0])
      .send({
        vehicleId: vehicleIds[0],
        departureCity: 'Paris',
        arrivalCity: 'Lyon',
        departureDate: '2125-06-01T08:00:00.000Z',
        arrivalDate: '2125-06-01T12:00:00.000Z',
        availableSeats: 3,
        price: 45.5,
      });

    expect(res.status).toBe(409);
    expect(res.body).toHaveProperty(
      'message',
      'A trip with the same vehicle and user already exists on this date.'
    );
  });
});
