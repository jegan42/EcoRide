// backend/src/tests/test.utils.test.ts
import request from 'supertest';
import app from '../app';
import prismaNewClient from '../lib/prisma';
import { UUID_REGEX } from '../utils/validation';
import {
  resetDB,
  createUserAndSignIn,
  testEmails,
  unikUserName,
  userIds,
  cookies,
  createVehicleAndGetId,
  vehicleIds,
  testPassword,
  createTripAndGetId,
  tripIds,
  bookingsIds,
  createBookingAndGetId,
} from './test.utils';

beforeAll(async () => {
  await resetDB();
  console.log('✅ Entering First FunctionTest');
});

afterAll(async () => {
  await resetDB();
  await prismaNewClient.$disconnect();
});

describe('Test Utils Funtions createUserAndSignIn', () => {
  it('ROUTE_USED: POST /api/auth/signup: 201<> return USER', async () => {
    const name = testEmails[0].split('@')[0];
    const res = await request(app)
      .post('/api/auth/signup')
      .send({
        email: testEmails[0],
        password: testPassword,
        firstName: `firstName${name}`,
        lastName: `lastName${name}`,
        username: unikUserName,
        phone: `1234${name}`,
        address: `123 ${name} St`,
      });

    expect(res).toBeDefined();
    expect(res.status).toBe(201);
    expect(res.body.user).not.toHaveProperty('password');
    expect(res.body.user).toHaveProperty('id');
    expect(res.body.user.id).toMatch(UUID_REGEX);
    expect(res.body.user).toHaveProperty('firstName', `firstName${name}`);
    expect(res.body.user).toHaveProperty('lastName', `lastName${name}`);
    expect(res.body.user).toHaveProperty('username', unikUserName);
    expect(res.body.user).toHaveProperty('email', testEmails[0]);
    expect(res.body.user).toHaveProperty('phone', `1234${name}`);
    expect(res.body.user).toHaveProperty('address', `123 ${name} St`);
    expect(res.body.user).toHaveProperty('role', ['passenger']);
    expect(res.body.user).toHaveProperty('credits', 20);

    cookies[0] = res.headers['set-cookie'];
    expect(cookies[0]).toBeDefined();
    expect(cookies[0][0]).toMatch(/jwtToken=/);
    expect(cookies[0][0]).toMatch(/HttpOnly/);

    userIds[0] = res.body.user.id;
    expect(userIds[0]).toBeDefined();
    expect(userIds[0]).toHaveLength(36);
    expect(userIds[0]).toMatch(UUID_REGEX);
  });

  it('ROUTE_USED: POST /api/auth/signin: 200<> return USER', async () => {
    const name = testEmails[0].split('@')[0];
    const res = await request(app).post('/api/auth/signin').send({
      email: testEmails[0],
      password: testPassword,
    });

    expect(res).toBeDefined();
    expect(res.status).toBe(200);
    expect(res.body.user).not.toHaveProperty('password');
    expect(res.body.user).toHaveProperty('id');
    expect(res.body.user.id).toMatch(UUID_REGEX);
    expect(res.body.user).toHaveProperty('firstName', `firstName${name}`);
    expect(res.body.user).toHaveProperty('lastName', `lastName${name}`);
    expect(res.body.user).toHaveProperty('username', unikUserName);
    expect(res.body.user).toHaveProperty('email', testEmails[0]);
    expect(res.body.user).toHaveProperty('phone', `1234${name}`);
    expect(res.body.user).toHaveProperty('address', `123 ${name} St`);
    expect(res.body.user).toHaveProperty('role', ['passenger']);
    expect(res.body.user).toHaveProperty('credits', 20);

    cookies[0] = res.headers['set-cookie'];
    expect(cookies[0]).toBeDefined();
    expect(cookies[0][0]).toMatch(/jwtToken=/);
    expect(cookies[0][0]).toMatch(/HttpOnly/);

    userIds[0] = res.body.user.id;
    expect(userIds[0]).toBeDefined();
    expect(userIds[0]).toHaveLength(36);
    expect(userIds[0]).toMatch(UUID_REGEX);
  });

  it('FUNCTION: createUserAndSignIn: 200<> return USER with POST /api/auth/signup THEN POST /api/auth/signin', async () => {
    const name = testEmails[1].split('@')[0];
    const res = await createUserAndSignIn(testEmails[1]);
    expect(res).toBeDefined();
    expect(res).toHaveProperty('status', 200);
    expect(res.body.user).not.toHaveProperty('password');
    expect(res.body.user).toHaveProperty('id');
    expect(res.body.user.id).toMatch(UUID_REGEX);
    expect(res.body.user).toHaveProperty('firstName', `firstName${name}`);
    expect(res.body.user).toHaveProperty('lastName', `lastName${name}`);
    expect(res.body.user).toHaveProperty('username', `username${name}`);
    expect(res.body.user).toHaveProperty('email', testEmails[1]);
    expect(res.body.user).toHaveProperty('phone', `1234${name}`);
    expect(res.body.user).toHaveProperty('address', `123 ${name} St`);
    expect(res.body.user).toHaveProperty('role', ['passenger']);
    expect(res.body.user).toHaveProperty('credits', 20);

    cookies[1] = res.headers['set-cookie'];
    expect(cookies[1]).toBeDefined();
    expect(cookies[1][0]).toMatch(/jwtToken=/);
    expect(cookies[1][0]).toMatch(/HttpOnly/);

    userIds[1] = res.body.user.id;
    expect(userIds[1]).toBeDefined();
    expect(userIds[1]).toHaveLength(36);
    expect(userIds[1]).toMatch(UUID_REGEX);
  });
});

describe('Test Utils Funtions createVehicleAndGetId', () => {
  it('ROUTE_USED: POST /api/vehicles: 201<> return VEHICLE', async () => {
    const name = testEmails[0].split('@')[0];
    const res = await request(app)
      .post('/api/vehicles')
      .set('Cookie', cookies)
      .send({
        brand: 'Peugeot',
        model: '308',
        color: 'Blue',
        vehicleYear: 2023,
        licensePlate: `LP_${name}`,
        energy: 'petrol',
        seatCount: 4,
      });

    expect(res.status).toBe(201);
    expect(res.body.vehicle).toBeDefined();
    expect(res.body.vehicle).toHaveProperty('id');
    expect(res.body.vehicle.id).toMatch(UUID_REGEX);
    expect(res.body.vehicle).toHaveProperty('userId');
    expect(res.body.vehicle.userId).toMatch(UUID_REGEX);
    expect(res.body.vehicle).toHaveProperty('userId', userIds[0]);
    expect(res.body.vehicle).toHaveProperty('brand', 'Peugeot');
    expect(res.body.vehicle).toHaveProperty('model', '308');
    expect(res.body.vehicle).toHaveProperty('color', 'Blue');
    expect(res.body.vehicle).toHaveProperty('vehicleYear', 2023);
    expect(res.body.vehicle).toHaveProperty('licensePlate', `LP_${name}`);
    expect(res.body.vehicle).toHaveProperty('energy', 'petrol');
    expect(res.body.vehicle).toHaveProperty('seatCount', 4);
  });

  it('FUNCTION: createVehicleAndGetId: <> return VEHICLE.ID with POST /api/vehicles', async () => {
    const name = testEmails[0].split('@')[0];
    const nbVehicle = '0';
    vehicleIds[0] = await createVehicleAndGetId(
      testEmails[0],
      cookies[0],
      nbVehicle
    );
    expect(vehicleIds[0]).toBeDefined();
    expect(vehicleIds[0]).toHaveLength(36);
    expect(vehicleIds[0]).toMatch(UUID_REGEX);

    const vehicle = await prismaNewClient.vehicle.findUnique({
      where: { id: vehicleIds[0] },
    });

    expect(vehicle).toBeDefined();
    expect(vehicle?.id).toBeDefined();
    expect(vehicle?.id).toHaveLength(36);
    expect(vehicle?.id).toMatch(UUID_REGEX);
    expect(vehicle).toHaveProperty('userId', userIds[0]);
    expect(vehicle).toHaveProperty('brand', 'Peugeot');
    expect(vehicle).toHaveProperty('model', '308');
    expect(vehicle).toHaveProperty('color', 'Blue');
    expect(vehicle).toHaveProperty('vehicleYear', 2023);
    expect(vehicle).toHaveProperty('licensePlate', `LP_${name}${nbVehicle}`);
    expect(vehicle).toHaveProperty('energy', 'petrol');
    expect(vehicle).toHaveProperty('seatCount', 4);
  });
});

describe('Test Utils Funtions createTripAndGetId', () => {
  it('ROUTE_USED: POST /api/trips: 201<> return TRIP', async () => {
    const res = await request(app)
      .post('/api/trips')
      .set('Cookie', cookies[0])
      .send({
        vehicleId: vehicleIds[0],
        departureCity: 'Paris',
        arrivalCity: 'Lyon',
        departureDate: '2126-05-01T08:00:00.000Z',
        arrivalDate: '2126-05-01T12:00:00.000Z',
        availableSeats: 3,
        price: 45.5,
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('trip');
    expect(res.body.trip).toHaveProperty('id');
    expect(res.body.trip.id).toMatch(UUID_REGEX);
    expect(res.body.trip).toHaveProperty('departureCity', 'Paris');
    expect(res.body.trip).toHaveProperty('arrivalCity', 'Lyon');
    expect(res.body.trip).toHaveProperty('availableSeats', 3);
    expect(res.body.trip).toHaveProperty('price', 45.5);
    expect(res.body.trip).toHaveProperty('status', 'open');
  });

  it('FUNCTION: createTripAndGetId: <> RETURN trip ID with POST /api/trips', async () => {
    tripIds[0] = await createTripAndGetId(vehicleIds[0], cookies[0]);
    expect(tripIds[0]).toBeDefined();
    expect(tripIds[0]).toHaveLength(36);
    expect(tripIds[0]).toMatch(UUID_REGEX);

    const res = await prismaNewClient.trip.findUnique({
      where: { id: tripIds[0] ?? undefined },
    });
    expect(res).toBeDefined();
    expect(res).toHaveProperty('vehicleId', vehicleIds[0]);
    expect(res?.id).toBeDefined();
    expect(res?.id).toHaveLength(36);
    expect(res?.id).toMatch(UUID_REGEX);
    expect(res).toHaveProperty('vehicleId', vehicleIds[0]);
    expect(res).toHaveProperty('departureCity', 'Paris');
    expect(res).toHaveProperty('arrivalCity', 'Lyon');
    expect(res).toHaveProperty(
      'departureDate',
      new Date('2125-12-01T08:00:00Z')
    );
    expect(res).toHaveProperty('arrivalDate', new Date('2125-12-01T10:00:00Z'));
    expect(res).toHaveProperty('availableSeats', 3);
    expect(res).toHaveProperty('price', 45.5);
  });
});

describe('Test Utils Funtions createBookingAndGetId', () => {
  it('ROUTE_USED: POST /api/bookings: 201<> return BOOKING', async () => {
    await prismaNewClient.user.update({
      where: { id: userIds[1] },
      data: { credits: { increment: 200 } },
    });
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

  it('FUNCTION: createBookingAndGetId: <> RETURN Booking ID with POST /api/bookings', async () => {
    tripIds[1] = await createTripAndGetId(
      vehicleIds[0],
      cookies[0],
      '2127-10-01T08:00:00.000Z',
      '2127-10-01T18:00:00.000Z'
    );
    expect(tripIds[1]).toBeDefined();
    expect(tripIds[1]).toHaveLength(36);
    expect(tripIds[1]).toMatch(UUID_REGEX);

    bookingsIds[0] = await createBookingAndGetId(
      tripIds[1] ?? '',
      cookies[1],
      1
    );
    expect(bookingsIds[0]).toBeDefined();
    expect(bookingsIds[0]).toHaveLength(36);
    expect(bookingsIds[0]).toMatch(UUID_REGEX);

    const res = await prismaNewClient.booking.findUnique({
      where: { id: bookingsIds[0] ?? undefined },
    });
    expect(res).toBeDefined();
    expect(res).toHaveProperty('id');
    expect(res?.id).toMatch(UUID_REGEX);
    expect(res).toHaveProperty('userId', userIds[1]);
    expect(res).toHaveProperty('tripId', tripIds[1]);
    expect(res).toHaveProperty('status', 'pending');
    expect(res).toHaveProperty('totalPrice', 45.5);
    expect(res).toHaveProperty('seatCount', 1);
  });
});
