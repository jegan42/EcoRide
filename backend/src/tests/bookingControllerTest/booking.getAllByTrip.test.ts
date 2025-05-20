// backend/src/tests/bookingControllerTest/booking.getAllByTrip.test.ts
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
  bookingsIds,
  createBookingAndGetId,
  invalidCookie,
  invalidFormatId,
  invalidValueId,
} from '../test.utils';

beforeAll(async () => {
  await resetDB();

  const user0 = await createUserAndSignIn(testEmails[0]);
  userIds[0] = user0.body.user.id;
  cookies[0] = user0.headers['set-cookie'];
  vehicleIds[0] = await createVehicleAndGetId(testEmails[0], cookies[0]);
  vehicleIds[1] = await createVehicleAndGetId(testEmails[0], cookies[0], '0');
  tripIds[0] = await createTripAndGetId(vehicleIds[0], cookies[0]);
  tripIds[1] = await createTripAndGetId(
    vehicleIds[1],
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
  const user2 = await createUserAndSignIn(testEmails[2]);
  userIds[2] = user2.body.user.id;
  cookies[2] = user2.headers['set-cookie'];
  await prismaNewClient.user.update({
    where: { id: userIds[2] },
    data: { credits: { increment: 200 } },
  });
  bookingsIds[2] = await createBookingAndGetId(tripIds[0] ?? '', cookies[2], 1);
  bookingsIds[3] = await createBookingAndGetId(tripIds[1] ?? '', cookies[2], 1);
});

afterAll(async () => {
  await resetDB();
  await prismaNewClient.$disconnect();
});

describe('TripController: GET /api/bookings/trip/:id', () => {
  it('GET /api/bookings/trip/:id: 200<> return BOOKINGS', async () => {
    const res = await request(app)
      .get(`/api/bookings/trip/${tripIds[0]}`)
      .set('Cookie', cookies[1]);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.bookings)).toBe(true);
    expect(res.body.bookings[0]).toHaveProperty('id', bookingsIds[0]);
    expect(res.body.bookings[1]).toHaveProperty('id', bookingsIds[2]);
  });

  it('GET /api/bookings/trip/:id: 200<> return BOOKINGS', async () => {
    const res = await request(app)
      .get(`/api/bookings/trip/${tripIds[1]}`)
      .set('Cookie', cookies[0]);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.bookings)).toBe(true);
    expect(res.body.bookings[0]).toHaveProperty('id', bookingsIds[1]);
    expect(res.body.bookings[1]).toHaveProperty('id', bookingsIds[3]);
  });

  it('GET /api/bookings/trip/:id: 401<Invalid token>', async () => {
    const res = await request(app)
      .get(`/api/bookings/trip/${tripIds[0]}`)
      .set('Cookie', invalidCookie);

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('message', 'Invalid token');
  });

  it('GET /api/bookings/trip/:id: 401<Missing token>', async () => {
    const res = await request(app).get(`/api/bookings/trip/${tripIds[0]}`);

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('message', 'Missing token');
  });

  it('GET /api/bookings/trip/:id: 400<Invalid ID>', async () => {
    const res = await request(app)
      .get(`/api/bookings/trip/${invalidFormatId}`)
      .set('Cookie', cookies[0]);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message', 'Invalid ID');
  });

  it('GET /api/bookings/trip/:id: 200<> return empty array if uuid not exist', async () => {
    const res = await request(app)
      .get(`/api/bookings/trip/${invalidValueId}`)
      .set('Cookie', cookies[0]);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.bookings)).toBe(true);
    expect(res.body.bookings.length === 0).toBe(true);
  });
});
