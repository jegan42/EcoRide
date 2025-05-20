// backend/src/tests/test.utils.ts
import request from 'supertest';
import app from '../app';
import prismaNewClient from '../lib/prisma';
import { User } from '../../generated/prisma';

export const invalidValueId = 'a99a9a99-9aa9-499a-9a99-aa99999999a9';

export const invalidFormatId = 'non-existent-id';
export const invalidMail = 'i_am_not_a_mail';
export const invalidCookie = ['jwtToken=invalidtoken'];

export const unikUserName = 'UNIKNAME';

export const testPassword = 'Password@123';
export const testEmails = [
  'user0@example.mail',
  'user1@example.mail',
  'user2@example.mail',
  'user3@example.mail',
  'user4@example.mail',
  'user5@example.mail',
  'user6@example.mail',
  'user8@example.mail',
  'user9@example.mail',
];
export const adminMail = 'testAdmin@example.mail';
export const names = testEmails.map((email: string) => email.split('@')[0]);

export const cookies: string[] = [];

export const bookingsIds: (string | undefined)[] = [];
export const tripIds: (string | undefined)[] = [];
export const vehicleIds: string[] = [];
export const userIds: string[] = [];

export const users: User[] = [];

export const resetDB = async (): Promise<void> => {
  await prismaNewClient.userPreferences.deleteMany();
  await prismaNewClient.booking.deleteMany();
  await prismaNewClient.trip.deleteMany();
  await prismaNewClient.vehicle.deleteMany();
  await prismaNewClient.user.deleteMany();
};

export const createUserAndSignIn = async (
  email: string,
  username?: string
): Promise<request.Response> => {
  const name = email.split('@')[0];
  await request(app)
    .post('/api/auth/signup')
    .send({
      email,
      password: testPassword,
      firstName: `firstName${name}`,
      lastName: `lastName${name}`,
      username: username ?? `username${name}`,
      phone: `1234${name}`,
      address: `123 ${name} St`,
    });

  return await request(app)
    .post('/api/auth/signin')
    .send({ email, password: testPassword });
};

export const createVehicleAndGetId = async (
  email: string,
  cookies: string,
  nbVehicle: string = ''
): Promise<string> => {
  const name = email.split('@')[0];

  return (
    await request(app)
      .post('/api/vehicles')
      .set('Cookie', cookies)
      .send({
        brand: 'Peugeot',
        model: '308',
        color: 'Blue',
        vehicleYear: 2023,
        licensePlate: `LP_${name}${nbVehicle}`,
        energy: 'petrol',
        seatCount: 4,
      })
  ).body.vehicle.id;
};

export const getAvailableSeats = async (
  vehicleId: string
): Promise<number | undefined> => {
  const res = await prismaNewClient.vehicle.findUnique({
    where: { id: vehicleId },
  });
  if (!res || res.seatCount < 1) return undefined;
  return res.seatCount - 1;
};

export const createTripAndGetId = async (
  vehicleId: string,
  cookies: string,
  departureDate: string = '2125-12-01T08:00:00Z',
  arrivalDate: string = '2125-12-01T10:00:00Z'
) => {
  const availableSeats = await getAvailableSeats(vehicleId);
  if (!availableSeats) return undefined;
  return (
    await request(app).post('/api/trips').set('Cookie', cookies).send({
      vehicleId: vehicleId,
      departureCity: `Paris`,
      arrivalCity: `Lyon`,
      departureDate,
      arrivalDate,
      availableSeats,
      price: 45.5,
    })
  ).body.trip.id;
};

export const createBookingAndGetId = async (
  tripId: string,
  cookies: string,
  seatCount: number
) => {
  const res = await request(app)
    .post('/api/bookings')
    .set('Cookie', cookies)
    .send({
      tripId,
      seatCount,
    });
  return res.body.booking.id;
};

export const createUserPreferences = async (id: string, cookies: string) => {
  return await request(app)
    .post(`/api/user-preferences/${id}`)
    .set('Cookie', cookies)
    .send({
      acceptsSmoker: true,
      acceptsPets: false,
      acceptsMusic: true,
      acceptsChatter: false,
    });
};
