// backend/src/tests/bookingControllerTest/booking.getById.test.ts
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
  bookingsIds,
  createBookingAndGetId,
  invalidCookie,
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
  bookingsIds[0] = await createBookingAndGetId(tripIds[0] ?? '', cookies[1], 1);
});

afterAll(async () => {
  await resetDB();
  await prismaNewClient.$disconnect();
});

describe('TripController: GET /api/bookings/:id', () => {
  it('GET /api/bookings/:id: 200<Successfully Booking: getById> return BOOKING', async () => {
    const res = await request(app)
      .get(`/api/bookings/${bookingsIds[0]}`)
      .set('Cookie', cookies[0]);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'Successfully Booking: getById');
    expect(res.body.booking).toHaveProperty('id', bookingsIds[0]);
    expect(res.body.booking.id).toMatch(UUID_REGEX);
    expect(res.body.booking).toHaveProperty('userId', userIds[1]);
    expect(res.body.booking).toHaveProperty('tripId', tripIds[0]);
    expect(res.body.booking).toHaveProperty('status', 'pending');
    expect(res.body.booking).toHaveProperty('totalPrice', 45.5);
    expect(res.body.booking).toHaveProperty('seatCount', 1);
  });

  it('GET /api/bookings/:id: 401<Unauthorized access Athenticate: missing token>', async () => {
    const res = await request(app).get(`/api/bookings/${bookingsIds[0]}`);

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty(
      'message',
      'Unauthorized access Athenticate: missing token'
    );
  });

  it('GET /api/bookings/:id: 401<Unauthorized access Athenticate: invalid token>', async () => {
    const res = await request(app)
      .get(`/api/bookings/${bookingsIds[0]}`)
      .set('Cookie', invalidCookie);

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty(
      'message',
      'Unauthorized access Athenticate: invalid token'
    );
  });

  it('GET /api/bookings/:id: 400<Bad request Validator: Invalid ID>', async () => {
    const res = await request(app)
      .get(`/api/bookings/${invalidFormatId}`)
      .set('Cookie', cookies[0]);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty(
      'message',
      'Bad request Validator: Invalid ID'
    );
  });

  it('GET /api/bookings/:id: 404<Not found Booking: booking not found>', async () => {
    const res = await request(app)
      .get(`/api/bookings/${invalidValueId}`)
      .set('Cookie', cookies[0]);

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty(
      'message',
      'Not found Booking: booking not found'
    );
  });
});
