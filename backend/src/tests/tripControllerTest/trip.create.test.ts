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
import { UUID_REGEX } from '../../utils/validation';

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
    expect(res.body).toHaveProperty('trip');
    expect(res.body.trip).toHaveProperty('id');
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

  it('POST /api/trips: 400<Vehicle ID is required>', async () => {
    const res = await request(app)
      .post('/api/trips')
      .set('Cookie', cookies[0])
      .send({
        departureCity: 'Paris',
        arrivalCity: 'Lyon',
        departureDate: '2125-01-01T08:00:00.000Z',
        arrivalDate: '2125-01-01T12:00:00.000Z',
        availableSeats: 3,
        price: 45.5,
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message', 'Vehicle ID is required');
  });

  it('POST /api/trips: 400<Departure city is required>', async () => {
    const res = await request(app)
      .post('/api/trips')
      .set('Cookie', cookies[0])
      .send({
        vehicleId: vehicleIds[0],
        arrivalCity: 'Lyon',
        departureDate: '2125-01-01T08:00:00.000Z',
        arrivalDate: '2125-01-01T12:00:00.000Z',
        availableSeats: 3,
        price: 45.5,
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message', 'Departure city is required');
  });

  it('POST /api/trips: 400<Arrival city is required>', async () => {
    const res = await request(app)
      .post('/api/trips')
      .set('Cookie', cookies[0])
      .send({
        vehicleId: vehicleIds[0],
        departureCity: 'Paris',
        departureDate: '2125-01-01T08:00:00.000Z',
        arrivalDate: '2125-01-01T12:00:00.000Z',
        availableSeats: 3,
        price: 45.5,
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message', 'Arrival city is required');
  });

  it('POST /api/trips: 400<Departure date is required>', async () => {
    const res = await request(app)
      .post('/api/trips')
      .set('Cookie', cookies[0])
      .send({
        vehicleId: vehicleIds[0],
        departureCity: 'Paris',
        arrivalCity: 'Lyon',
        arrivalDate: '2125-01-01T12:00:00.000Z',
        availableSeats: 3,
        price: 45.5,
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message', 'Departure date is required');
  });

  it('POST /api/trips: 400<Departure date must be a valid ISO 8601 date>', async () => {
    const res = await request(app)
      .post('/api/trips')
      .set('Cookie', cookies[0])
      .send({
        vehicleId: vehicleIds[0],
        departureCity: 'Paris',
        arrivalCity: 'Lyon',
        departureDate: 'hello',
        arrivalDate: '2125-01-01T12:00:00.000Z',
        availableSeats: 3,
        price: 45.5,
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty(
      'message',
      'Departure date must be a valid ISO 8601 date'
    );
  });

  it('POST /api/trips: 400<Arrival date is required>', async () => {
    const res = await request(app)
      .post('/api/trips')
      .set('Cookie', cookies[0])
      .send({
        vehicleId: vehicleIds[0],
        departureCity: 'Paris',
        arrivalCity: 'Lyon',
        departureDate: '2125-01-01T08:00:00.000Z',
        availableSeats: 3,
        price: 45.5,
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message', 'Arrival date is required');
  });

  it('POST /api/trips: 400<Arrival date must be a valid ISO 8601 date>', async () => {
    const res = await request(app)
      .post('/api/trips')
      .set('Cookie', cookies[0])
      .send({
        vehicleId: vehicleIds[0],
        departureCity: 'Paris',
        arrivalCity: 'Lyon',
        departureDate: '2125-01-01T08:00:00.000Z',
        arrivalDate: 'hello',
        availableSeats: 3,
        price: 45.5,
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty(
      'message',
      'Arrival date must be a valid ISO 8601 date'
    );
  });

  it('POST /api/trips: 400<Available seats are required>', async () => {
    const res = await request(app)
      .post('/api/trips')
      .set('Cookie', cookies[0])
      .send({
        vehicleId: vehicleIds[0],
        departureCity: 'Paris',
        arrivalCity: 'Lyon',
        departureDate: '2125-01-01T08:00:00.000Z',
        arrivalDate: '2125-01-01T12:00:00.000Z',
        price: 45.5,
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message', 'Available seats are required');
  });

  it('POST /api/trips: 400<availableSeats must be an Int>', async () => {
    const res = await request(app)
      .post('/api/trips')
      .set('Cookie', cookies[0])
      .send({
        vehicleId: vehicleIds[0],
        departureCity: 'Paris',
        arrivalCity: 'Lyon',
        departureDate: '2125-01-01T08:00:00.000Z',
        arrivalDate: '2125-01-01T12:00:00.000Z',
        availableSeats: 'number',
        price: 45.5,
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message', 'availableSeats must be an Int');
  });

  it('POST /api/trips: 400<Available seats must be at least 1>', async () => {
    const res = await request(app)
      .post('/api/trips')
      .set('Cookie', cookies[0])
      .send({
        vehicleId: vehicleIds[0],
        departureCity: 'Paris',
        arrivalCity: 'Lyon',
        departureDate: '2125-01-01T08:00:00.000Z',
        arrivalDate: '2125-01-01T12:00:00.000Z',
        availableSeats: 0,
        price: 45.5,
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty(
      'message',
      'Available seats must be at least 1'
    );
  });

  it('POST /api/trips: 400<Price is required>', async () => {
    const res = await request(app)
      .post('/api/trips')
      .set('Cookie', cookies[0])
      .send({
        vehicleId: vehicleIds[0],
        departureCity: 'Paris',
        arrivalCity: 'Lyon',
        departureDate: '2125-01-01T08:00:00.000Z',
        arrivalDate: '2125-01-01T12:00:00.000Z',
        availableSeats: 3,
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message', 'Price is required');
  });

  it('POST /api/trips: 400<Price must be a positive number>', async () => {
    const res = await request(app)
      .post('/api/trips')
      .set('Cookie', cookies[0])
      .send({
        vehicleId: vehicleIds[0],
        departureCity: 'Paris',
        arrivalCity: 'Lyon',
        departureDate: '2125-01-01T08:00:00.000Z',
        arrivalDate: '2125-01-01T12:00:00.000Z',
        availableSeats: 3,
        price: 'price',
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty(
      'message',
      'Price must be a positive number'
    );
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

  it('POST /api/trips: 400<DepartureDate must be before arrivalDate>', async () => {
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

  it('POST /api/trips: 400<DepartureDate and arrivalDate can start at the same date but not same time>', async () => {
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

  it('POST /api/trips: 400<Invalid or missing fields> if vehicleId is invalid format', async () => {
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
    expect(res.body).toHaveProperty('message', 'Invalid or missing fields');
  });

  it('POST /api/trips: 404<Vehicle not found> if vehicleId is invalid value', async () => {
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

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('message', 'Vehicle not found');
  });

  it('POST /api/trips: 400<Available seats cannot exceed maxPassengerSeats (total seats minus 1 for the driver)>', async () => {
    const res = await request(app)
      .post('/api/trips')
      .set('Cookie', cookies[0])
      .send({
        vehicleId: vehicleIds[0],
        departureCity: 'Paris',
        arrivalCity: 'Lyon',
        departureDate: '2125-01-01T08:00:00.000Z',
        arrivalDate: '2125-01-01T12:00:00.000Z',
        availableSeats: 10,
        price: 45.5,
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty(
      'message',
      'Available seats cannot exceed maxPassengerSeats (total seats minus 1 for the driver)'
    );
  });

  it('POST /api/trips: 409<A trip with the same vehicle and user already exists on this date.>', async () => {
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

  it('POST /api/trips: 401<Invalid token> if JWT is invalid', async () => {
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

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('message', 'Invalid token');
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
});
