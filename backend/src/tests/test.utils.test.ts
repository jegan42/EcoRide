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
  names,
  createUserPreferences,
  getAvailableSeats,
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
    const res = await request(app)
      .post('/api/auth/signup')
      .send({
        email: testEmails[0],
        password: testPassword,
        firstName: `firstName${names[0]}`,
        lastName: `lastName${names[0]}`,
        username: unikUserName,
        phone: `1234${names[0]}`,
        address: `123 ${names[0]} St`,
      });

    expect(res).toBeDefined();
    expect(res.status).toBe(201);
    expect(res.body.data).not.toHaveProperty('password');
    expect(res.body.data).toHaveProperty('id');
    expect(res.body.data.id).toMatch(UUID_REGEX);
    expect(res.body.data).toHaveProperty('firstName', `firstName${names[0]}`);
    expect(res.body.data).toHaveProperty('lastName', `lastName${names[0]}`);
    expect(res.body.data).toHaveProperty('username', unikUserName);
    expect(res.body.data).toHaveProperty('email', testEmails[0]);
    expect(res.body.data).toHaveProperty('phone', `1234${names[0]}`);
    expect(res.body.data).toHaveProperty('address', `123 ${names[0]} St`);
    expect(res.body.data).toHaveProperty('role', ['passenger']);
    expect(res.body.data).toHaveProperty('credits', 20);

    cookies[0] = res.headers['set-cookie'];
    expect(cookies[0]).toBeDefined();
    expect(cookies[0][0]).toMatch(/jwtToken=/);
    expect(cookies[0][0]).toMatch(/HttpOnly/);

    userIds[0] = res.body.data.id;
    expect(userIds[0]).toBeDefined();
    expect(userIds[0]).toHaveLength(36);
    expect(userIds[0]).toMatch(UUID_REGEX);
  });

  it('ROUTE_USED: POST /api/auth/signin: 200<> return USER', async () => {
    const res = await request(app).post('/api/auth/signin').send({
      email: testEmails[0],
      password: testPassword,
    });

    expect(res).toBeDefined();
    expect(res.status).toBe(200);
    expect(res.body.data).not.toHaveProperty('password');
    expect(res.body.data).toHaveProperty('id');
    expect(res.body.data.id).toMatch(UUID_REGEX);
    expect(res.body.data).toHaveProperty('firstName', `firstName${names[0]}`);
    expect(res.body.data).toHaveProperty('lastName', `lastName${names[0]}`);
    expect(res.body.data).toHaveProperty('username', unikUserName);
    expect(res.body.data).toHaveProperty('email', testEmails[0]);
    expect(res.body.data).toHaveProperty('phone', `1234${names[0]}`);
    expect(res.body.data).toHaveProperty('address', `123 ${names[0]} St`);
    expect(res.body.data).toHaveProperty('role', ['passenger']);
    expect(res.body.data).toHaveProperty('credits', 20);

    cookies[0] = res.headers['set-cookie'];
    expect(cookies[0]).toBeDefined();
    expect(cookies[0][0]).toMatch(/jwtToken=/);
    expect(cookies[0][0]).toMatch(/HttpOnly/);

    userIds[0] = res.body.data.id;
    expect(userIds[0]).toBeDefined();
    expect(userIds[0]).toHaveLength(36);
    expect(userIds[0]).toMatch(UUID_REGEX);
  });

  it('FUNCTION: createUserAndSignIn: 200<> return USER with POST /api/auth/signup THEN POST /api/auth/signin', async () => {
    const res = await createUserAndSignIn(testEmails[1]);
    expect(res).toBeDefined();
    expect(res).toHaveProperty('status', 200);
    expect(res.body.data).not.toHaveProperty('password');
    expect(res.body.data).toHaveProperty('id');
    expect(res.body.data.id).toMatch(UUID_REGEX);
    expect(res.body.data).toHaveProperty('firstName', `firstName${names[1]}`);
    expect(res.body.data).toHaveProperty('lastName', `lastName${names[1]}`);
    expect(res.body.data).toHaveProperty('username', `username${names[1]}`);
    expect(res.body.data).toHaveProperty('email', testEmails[1]);
    expect(res.body.data).toHaveProperty('phone', `1234${names[1]}`);
    expect(res.body.data).toHaveProperty('address', `123 ${names[1]} St`);
    expect(res.body.data).toHaveProperty('role', ['passenger']);
    expect(res.body.data).toHaveProperty('credits', 20);

    cookies[1] = res.headers['set-cookie'];
    expect(cookies[1]).toBeDefined();
    expect(cookies[1][0]).toMatch(/jwtToken=/);
    expect(cookies[1][0]).toMatch(/HttpOnly/);

    userIds[1] = res.body.data.id;
    expect(userIds[1]).toBeDefined();
    expect(userIds[1]).toHaveLength(36);
    expect(userIds[1]).toMatch(UUID_REGEX);
  });
});

describe('Test Utils Funtions createVehicleAndGetId', () => {
  it('ROUTE_USED: POST /api/vehicles: 201<> return VEHICLE', async () => {
    const res = await request(app)
      .post('/api/vehicles')
      .set('Cookie', cookies[0])
      .send({
        brand: 'Peugeot',
        model: '308',
        color: 'Blue',
        vehicleYear: 2023,
        licensePlate: `LP_${names[0]}`,
        energy: 'petrol',
        seatCount: 4,
      });

    expect(res.status).toBe(201);
    expect(res.body.data).toBeDefined();
    expect(res.body.data).toHaveProperty('id');
    expect(res.body.data.id).toMatch(UUID_REGEX);
    expect(res.body.data).toHaveProperty('userId');
    expect(res.body.data.userId).toMatch(UUID_REGEX);
    expect(res.body.data).toHaveProperty('userId', userIds[0]);
    expect(res.body.data).toHaveProperty('brand', 'Peugeot');
    expect(res.body.data).toHaveProperty('model', '308');
    expect(res.body.data).toHaveProperty('color', 'Blue');
    expect(res.body.data).toHaveProperty('vehicleYear', 2023);
    expect(res.body.data).toHaveProperty('licensePlate', `LP_${names[0]}`);
    expect(res.body.data).toHaveProperty('energy', 'petrol');
    expect(res.body.data).toHaveProperty('seatCount', 4);
  });

  it('FUNCTION: createVehicleAndGetId: <> return VEHICLE.ID with POST /api/vehicles', async () => {
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
    expect(vehicle).toHaveProperty(
      'licensePlate',
      `LP_${names[0]}${nbVehicle}`
    );
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
    expect(res.body).toHaveProperty('data');
    expect(res.body.data).toHaveProperty('id');
    expect(res.body.data.id).toMatch(UUID_REGEX);
    expect(res.body.data).toHaveProperty('departureCity', 'Paris');
    expect(res.body.data).toHaveProperty('arrivalCity', 'Lyon');
    expect(res.body.data).toHaveProperty('availableSeats', 3);
    expect(res.body.data).toHaveProperty('price', 45.5);
    expect(res.body.data).toHaveProperty('status', 'open');
  });

  it('FUNCTION: createTripAndGetId: should return undefined if no available date', async () => {
    const result = await createTripAndGetId(
      vehicleIds[0],
      cookies[0],
      '2125-30-01T08:00:00Z',
      '2125-30-01T18:00:00Z'
    );
    expect(result).toBeUndefined();
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
    expect(res.body.data).toHaveProperty('id');
    expect(res.body.data.id).toMatch(UUID_REGEX);
    expect(res.body.data).toHaveProperty('userId', userIds[1]);
    expect(res.body.data).toHaveProperty('tripId', tripIds[0]);
    expect(res.body.data).toHaveProperty('status', 'pending');
    expect(res.body.data).toHaveProperty('totalPrice', 91);
    expect(res.body.data).toHaveProperty('seatCount', 2);
  });

  it('FUNCTION: createBookingAndGetId: should return empty string if booking fails', async () => {
    const res = await request(app)
      .post('/api/bookings')
      .set('Cookie', cookies[1])
      .send({
        tripId: tripIds[0],
        seatCount: 0,
      });

    expect(res.status).toBe(400);
    const result = await createBookingAndGetId(tripIds[0] ?? '', cookies[1], 0);
    expect(result).toBe('');
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

describe('Test Utils Funtions createUserPreferences', () => {
  it('ROUTE_USED: POST /api/user-preferences/:id: 201<> return a new UserPreferences', async () => {
    const res = await request(app)
      .post(`/api/user-preferences/${userIds[0]}`)
      .set('Cookie', cookies[0])
      .send({
        acceptsSmoker: true,
        acceptsPets: false,
        acceptsMusic: true,
        acceptsChatter: false,
      });

    expect(res.status).toBe(201);
    expect(res.body.data).toBeDefined();
    expect(res.body.data).toHaveProperty('id');
    expect(res.body.data.id).toMatch(UUID_REGEX);
    expect(res.body.data).toHaveProperty('userId', userIds[0]);
    expect(res.body.data.userId).toMatch(UUID_REGEX);
    expect(res.body.data).toHaveProperty('acceptsSmoker', true);
    expect(res.body.data).toHaveProperty('acceptsPets', false);
    expect(res.body.data).toHaveProperty('acceptsMusic', true);
    expect(res.body.data).toHaveProperty('acceptsChatter', false);
  });

  describe('getAvailableSeats', () => {
    const vehicleId = 'vehicle-123';

    beforeEach(() => {
      jest.spyOn(prismaNewClient.vehicle, 'findUnique');
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should return seatCount - 1 when vehicle found and seatCount >= 1', async () => {
      (prismaNewClient.vehicle.findUnique as jest.Mock).mockResolvedValue({
        id: vehicleId,
        seatCount: 5,
      });

      const result = await getAvailableSeats(vehicleId);
      expect(result).toBe(4);
    });

    it('should return undefined when vehicle not found', async () => {
      (prismaNewClient.vehicle.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await getAvailableSeats(vehicleId);
      expect(result).toBeUndefined();
    });

    it('should return undefined when seatCount < 1', async () => {
      (prismaNewClient.vehicle.findUnique as jest.Mock).mockResolvedValue({
        id: vehicleId,
        seatCount: 0,
      });

      const result = await getAvailableSeats(vehicleId);
      expect(result).toBeUndefined();
    });

    it('should return undefined if availableSeats is undefined', async () => {
      jest
        .spyOn(require('./test.utils'), 'getAvailableSeats')
        .mockResolvedValue(undefined);

      const result = await createTripAndGetId('fakeVehicleId', 'fakeCookies');
      expect(result).toBeUndefined();
    });
  });

  it('FUNCTION: createUserPreferences: 201<> return a new UserPreferences with POST /api/user-preferences/:id', async () => {
    const res = await createUserPreferences(userIds[1], cookies[1]);

    expect(res.status).toBe(201);
    expect(res.body.data).toBeDefined();
    expect(res.body.data).toHaveProperty('id');
    expect(res.body.data.id).toMatch(UUID_REGEX);
    expect(res.body.data).toHaveProperty('userId', userIds[1]);
    expect(res.body.data.userId).toMatch(UUID_REGEX);
    expect(res.body.data).toHaveProperty('acceptsSmoker', true);
    expect(res.body.data).toHaveProperty('acceptsPets', false);
    expect(res.body.data).toHaveProperty('acceptsMusic', true);
    expect(res.body.data).toHaveProperty('acceptsChatter', false);
  });
});
