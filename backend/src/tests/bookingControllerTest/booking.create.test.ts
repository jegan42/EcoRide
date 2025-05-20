// backend/src/tests/bookingControllerTest/booking.create.test.ts
import request from 'supertest';
import app from '../../app';
import prismaNewClient from '../../lib/prisma';
import {
  resetDB,
  cookies,
  createUserAndSignIn,
  testEmails,
  vehicleIds,
  createVehicleAndGetId,
  tripIds,
  createTripAndGetId,
  userIds,
  invalidFormatId,
  invalidValueId,
} from '../test.utils';
import { UUID_REGEX } from '../../utils/validation';

beforeAll(async () => {
  await resetDB();

  const user0 = await createUserAndSignIn(testEmails[0]);
  userIds[0] = user0.body.user.id;
  cookies[0] = user0.headers['set-cookie'];
  vehicleIds[0] = await createVehicleAndGetId(testEmails[0], cookies[0]);
  tripIds[0] = await createTripAndGetId(vehicleIds[0], cookies[0]);
  const user1 = await createUserAndSignIn(testEmails[1]);
  userIds[1] = user1.body.user.id;
  cookies[1] = user1.headers['set-cookie'];
  await prismaNewClient.user.update({
    where: { id: userIds[1] },
    data: { credits: { increment: 200 } },
  });
});

afterAll(async () => {
  await resetDB();
  await prismaNewClient.$disconnect();
});

describe('TripController: POST /api/bookings', () => {
  it('POST /api/bookings: 201<> should create a new booking with valid data', async () => {
    const res = await request(app)
      .post('/api/bookings')
      .set('Cookie', cookies[1])
      .send({
        tripId: tripIds[0],
        seatCount: 2,
      });

    expect(res.status).toBe(201);
    expect(res.body.booking).toHaveProperty('id');
    expect(res.body.booking.id).toMatch(UUID_REGEX);
    expect(res.body.booking).toHaveProperty('userId', userIds[1]);
    expect(res.body.booking).toHaveProperty('tripId', tripIds[0]);
    expect(res.body.booking).toHaveProperty('status', 'pending');
    expect(res.body.booking).toHaveProperty('totalPrice', 91);
    expect(res.body.booking).toHaveProperty('seatCount', 2);
  });

  it('POST /api/bookings: 400<Trip ID is required>', async () => {
    const res = await request(app)
      .post('/api/bookings')
      .set('Cookie', cookies[1])
      .send({
        seatCount: 1,
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message', 'Trip ID is required');
  });

  it('POST /api/bookings: 400<Invalid Trip ID>', async () => {
    const res = await request(app)
      .post('/api/bookings')
      .set('Cookie', cookies[1])
      .send({
        tripId: invalidFormatId,
        seatCount: 1,
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message', 'Invalid Trip ID');
  });

  it('POST /api/bookings: 400<Seat count is required>', async () => {
    const res = await request(app)
      .post('/api/bookings')
      .set('Cookie', cookies[1])
      .send({
        tripId: tripIds[0],
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message', 'Seat count is required');
  });

  it('POST /api/bookings: 400<Seat count must be between 1 and 10> 0', async () => {
    const res = await request(app)
      .post('/api/bookings')
      .set('Cookie', cookies[1])
      .send({
        tripId: tripIds[0],
        seatCount: 0,
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty(
      'message',
      'Seat count must be between 1 and 10'
    );
  });

  it('POST /api/bookings: 400<Seat count must be between 1 and 10> 20', async () => {
    const res = await request(app)
      .post('/api/bookings')
      .set('Cookie', cookies[1])
      .send({
        tripId: tripIds[0],
        seatCount: 20,
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty(
      'message',
      'Seat count must be between 1 and 10'
    );
  });

  it('POST /api/bookings: 400<Invalid or missing fields>', async () => {
    const res = await request(app)
      .post('/api/bookings')
      .set('Cookie', cookies[1])
      .send({
        tripId: invalidValueId,
        seatCount: 1,
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message', 'Invalid or missing fields');
  });

  it('POST /api/bookings: 400<Not enough seats available>', async () => {
    const res = await request(app)
      .post('/api/bookings')
      .set('Cookie', cookies[1])
      .send({
        tripId: tripIds[0],
        seatCount: 2,
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message', 'Not enough seats available');
  });

  it('POST /api/bookings: 400<Will not booking own trip>', async () => {
    const res = await request(app)
      .post('/api/bookings')
      .set('Cookie', cookies[0])
      .send({
        tripId: tripIds[0],
        seatCount: 1,
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message', 'Will not booking own trip');
  });

  it('POST /api/bookings: 400<Not enough credits>', async () => {
    await prismaNewClient.user.update({
      where: { id: userIds[1] },
      data: { credits: 40 },
    });
    const res = await request(app)
      .post('/api/bookings')
      .set('Cookie', cookies[1])
      .send({
        tripId: tripIds[0],
        seatCount: 1,
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message', 'Not enough credits');
  });

  it('POST /api/bookings: 400<User already booked this trip>', async () => {
    await prismaNewClient.user.update({
      where: { id: userIds[1] },
      data: { credits: 100 },
    });
    const res = await request(app)
      .post('/api/bookings')
      .set('Cookie', cookies[1])
      .send({
        tripId: tripIds[0],
        seatCount: 1,
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message', 'User already booked this trip');
  });
});
