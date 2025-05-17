// backend/src/tests/test.utils.ts
import request from 'supertest';
import app from '../app';
import prismaNewClient from '../lib/prisma';

export const invalidValueId = 'a99a9a99-9aa9-999a-9a99-aa99999999a9';

export const invalidFormatId = 'non-existent-id';
export const invalidMail = 'i_am_not_a_mail';
export const invalidCookie = ['jwtToken=invalidtoken'];

export const unikUserName = 'UNIKNAME';

export const testPassword = 'testPassword';
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

export const cookies: string[] = [];

export const tripIds: string[] = [];
export const vehicleIds: string[] = [];
export const userIds: string[] = [];

export const resetDB = async (): Promise<void> => {
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
  ).body.id;
};

export const createTripAndGetId = async (
  vehicleId: string,
  cookies: string,
  departureDate: string = '2125-12-01T08:00:00Z',
  arrivalDate: string = '2125-12-01T10:00:00Z'
): Promise<string> =>
  (
    await request(app).post('/api/trips').set('Cookie', cookies).send({
      vehicleId: vehicleId,
      departureCity: `Paris`,
      arrivalCity: `Lyon`,
      departureDate,
      arrivalDate,
      availableSeats: 3,
      price: 45.5,
    })
  ).body.id;
