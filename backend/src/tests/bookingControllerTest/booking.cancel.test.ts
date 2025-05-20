// backend/src/tests/bookingControllerTest/booking.delete.test.ts
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
} from '../test.utils';

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

describe('TripController: DELETE /api/bookings', () => {
  it('DELETE /api/bookings: 200<Booking cancelled successfully>', async () => {
    const res = await request(app)
      .delete(`/api/bookings/${bookingsIds[0]}`)
      .set('Cookie', cookies[1]);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty(
      'message',
      'Booking cancelled successfully'
    );
  });

  it('DELETE /api/bookings: 401<Missing token>', async () => {
    const res = await request(app).delete(`/api/bookings/${bookingsIds[0]}`);

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('message', 'Missing token');
  });

  it('DELETE /api/bookings: 400<Invalid booking ID>', async () => {
    const res = await request(app)
      .delete(`/api/bookings/${invalidFormatId}`)
      .set('Cookie', cookies[1]);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message', 'Invalid booking ID');
  });

  it('DELETE /api/bookings: 400<Booking not found>', async () => {
    const res = await request(app)
      .delete(`/api/bookings/${invalidValueId}`)
      .set('Cookie', cookies[1]);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message', 'Booking not found');
  });

  it('DELETE /api/bookings: 400<Booking already cancelled>', async () => {
    const res = await request(app)
      .delete(`/api/bookings/${bookingsIds[0]}`)
      .set('Cookie', cookies[1]);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message', 'Booking already cancelled');
  });
});
