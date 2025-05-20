// backend/src/tests/bookingControllerTest/booking.validate.test.ts
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
  users,
} from '../test.utils';
import { BookingStatus } from '../../../generated/prisma';

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
  users[1] = await prismaNewClient.user.update({
    where: { id: userIds[1] },
    data: { credits: { increment: 200 } },
  });
  bookingsIds[0] = await createBookingAndGetId(tripIds[0] ?? '', cookies[1], 1);
  bookingsIds[1] = await createBookingAndGetId(tripIds[1] ?? '', cookies[1], 1);
  const user2 = await createUserAndSignIn(testEmails[2]);
  userIds[2] = user2.body.user.id;
  cookies[2] = user2.headers['set-cookie'];
  users[2] = await prismaNewClient.user.update({
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

describe('TripController: POST /api/bookings/:id/validate', () => {
  it('POST /api/bookings/:id/validate: 200<Booking accepted>', async () => {
    const beforeCreditsDriver = (
      await prismaNewClient.user.findUnique({ where: { id: userIds[0] } })
    )?.credits;
    expect(beforeCreditsDriver).toBe(20);
    const beforeBooking = await prismaNewClient.booking.findUnique({
      where: { id: bookingsIds[0] },
    });
    expect(beforeBooking?.status).toBe(BookingStatus.pending);
    const res = await request(app)
      .post(`/api/bookings/${bookingsIds[0]}/validate`)
      .set('Cookie', cookies[0])
      .send({ action: 'accept' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'Booking accepted');

    const afterCreditsDriver = (
      await prismaNewClient.user.findUnique({ where: { id: userIds[0] } })
    )?.credits;
    expect(afterCreditsDriver).toBe(65.5);
    const afterBooking = await prismaNewClient.booking.findUnique({
      where: { id: bookingsIds[0] },
    });
    expect(afterBooking?.status).toBe(BookingStatus.confirmed);
  });

  it('POST /api/bookings/:id/validate: 200<Booking is not pending>', async () => {
    const res = await request(app)
      .post(`/api/bookings/${bookingsIds[0]}/validate`)
      .set('Cookie', cookies[0])
      .send({ action: 'accept' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'Booking is not pending');
  });

  it('POST /api/bookings/:id/validate: 200<Booking rejected>', async () => {
    const beforeCreditsBuyer = (
      await prismaNewClient.user.findUnique({ where: { id: userIds[1] } })
    )?.credits;
    expect(beforeCreditsBuyer).toBe(129);
    const beforeBooking = await prismaNewClient.booking.findUnique({
      where: { id: bookingsIds[1] },
    });
    expect(beforeBooking?.status).toBe(BookingStatus.pending);
    const res = await request(app)
      .post(`/api/bookings/${bookingsIds[1]}/validate`)
      .set('Cookie', cookies[0])
      .send({ action: 'reject' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'Booking rejected');

    const afterCreditsBuyer = (
      await prismaNewClient.user.findUnique({ where: { id: userIds[1] } })
    )?.credits;
    expect(afterCreditsBuyer).toBe(174.5);
    const afterBooking = await prismaNewClient.booking.findUnique({
      where: { id: bookingsIds[1] },
    });
    expect(afterBooking?.status).toBe(BookingStatus.cancelled);
    expect(afterBooking?.cancellerId).toBe(userIds[0]);
  });

  it('POST /api/bookings/:id/validate: 200<Booking is not pending>', async () => {
    const res = await request(app)
      .post(`/api/bookings/${bookingsIds[1]}/validate`)
      .set('Cookie', cookies[0])
      .send({ action: 'reject' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'Booking is not pending');
  });

  it('POST /api/bookings/:id/validate: 400<Action is required>', async () => {
    const res = await request(app)
      .post(`/api/bookings/${bookingsIds[2]}/validate`)
      .set('Cookie', cookies[0]);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message', 'Action is required');
  });

  it('POST /api/bookings/:id/validate: 400<Action must be a string>', async () => {
    const res = await request(app)
      .post(`/api/bookings/${bookingsIds[2]}/validate`)
      .set('Cookie', cookies[0])
      .send({ action: 8 });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message', 'Action must be a string');
  });

  it('POST /api/bookings/:id/validate: 400<Action must be either "accept" or "reject">', async () => {
    const res = await request(app)
      .post(`/api/bookings/${bookingsIds[2]}/validate`)
      .set('Cookie', cookies[0])
      .send({ action: '8' });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty(
      'message',
      'Action must be either "accept" or "reject"'
    );
  });

  it('POST /api/bookings/:id/validate: 401<Missing token>', async () => {
    const res = await request(app)
      .post(`/api/bookings/${bookingsIds[2]}/validate`)
      .send({ action: 'accept' });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('message', 'Missing token');
  });

  it('POST /api/bookings/:id/validate: 401<Invalid token>', async () => {
    const res = await request(app)
      .post(`/api/bookings/${bookingsIds[2]}/validate`)
      .set('Cookie', invalidCookie)
      .send({ action: 'accept' });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('message', 'Invalid token');
  });

  it('POST /api/bookings/:id/validate: 403<Access denied: insufficient permissions>', async () => {
    const res = await request(app)
      .post(`/api/bookings/${bookingsIds[2]}/validate`)
      .set('Cookie', cookies[1])
      .send({ action: 'accept' });

    expect(res.status).toBe(403);
    expect(res.body).toHaveProperty(
      'message',
      'Access denied: insufficient permissions'
    );
  });

  it('POST /api/bookings/:id/validate: 400<Invalid ID>', async () => {
    const res = await request(app)
      .post(`/api/bookings/${invalidFormatId}/validate`)
      .set('Cookie', cookies[0])
      .send({ action: 'accept' });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message', 'Invalid ID');
  });

  it('POST /api/bookings/:id/validate: 404<Booking not found>', async () => {
    const res = await request(app)
      .post(`/api/bookings/${invalidValueId}/validate`)
      .set('Cookie', cookies[0])
      .send({ action: 'accept' });

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('message', 'Booking not found');
  });
});
