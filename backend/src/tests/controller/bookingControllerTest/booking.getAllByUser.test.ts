// backend/src/tests/bookingControllerTest/booking.getAllByUser.test.ts
import request from 'supertest';
import app from '../../../app';
import prismaNewClient from '../../../lib/prisma';
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
  bookingsIds,
  createBookingAndGetId,
  invalidCookie,
} from '../../test.utils';

beforeAll(async () => {
  await resetDB();

  const user0 = await createUserAndSignIn(testEmails[0]);
  userIds[0] = user0.body.user.id;
  cookies[0] = user0.headers['set-cookie'];
  vehicleIds[0] = await createVehicleAndGetId(testEmails[0], cookies[0]);
  tripIds[0] = await createTripAndGetId(vehicleIds[0], cookies[0]);
  tripIds[1] = await createTripAndGetId(
    vehicleIds[0],
    cookies[0],
    '2127-12-01T08:00:00Z',
    '2127-12-01T18:00:00Z'
  );
  const user1 = await createUserAndSignIn(testEmails[1]);
  userIds[1] = user1.body.user.id;
  cookies[1] = user1.headers['set-cookie'];
  await prismaNewClient.user.update({
    where: { id: userIds[1] },
    data: { credits: { increment: 200 } },
  });
  bookingsIds[0] = await createBookingAndGetId(tripIds[0] ?? '', cookies[1], 1);
  bookingsIds[1] = await createBookingAndGetId(tripIds[1] ?? '', cookies[1], 1);
});

afterAll(async () => {
  await resetDB();
  await prismaNewClient.$disconnect();
});

describe('TripController: GET /api/bookings/me', () => {
  it('GET /api/bookings/me: 200<Successfully Booking: getAllByUser> return BOOKINGS', async () => {
    const res = await request(app)
      .get(`/api/bookings/me`)
      .set('Cookie', cookies[1]);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty(
      'message',
      'Successfully Booking: getAllByUser'
    );
    expect(Array.isArray(res.body.bookings)).toBe(true);
    expect(res.body.bookings[0]).toHaveProperty('id', bookingsIds[0]);
    expect(res.body.bookings[0]).toHaveProperty('userId', userIds[1]);
  });

  it('GET /api/bookings/me: 200<Successfully Booking: getAllByUser> return BOOKINGS', async () => {
    const res = await request(app)
      .get(`/api/bookings/me`)
      .set('Cookie', cookies[0]);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty(
      'message',
      'Successfully Booking: getAllByUser'
    );
    expect(Array.isArray(res.body.bookings)).toBe(true);
  });

  it('GET /api/bookings/me: 401<Unauthorized access Athenticate: invalid token>', async () => {
    const res = await request(app)
      .get(`/api/bookings/me`)
      .set('Cookie', invalidCookie);

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty(
      'message',
      'Unauthorized access Athenticate: invalid token'
    );
  });

  it('GET /api/bookings/me: 401<Unauthorized access Athenticate: missing token>', async () => {
    const res = await request(app).get(`/api/bookings/me`);

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty(
      'message',
      'Unauthorized access Athenticate: missing token'
    );
  });
});
