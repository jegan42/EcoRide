// backend/src/tests/test.utils.test.ts
import request from 'supertest';
import app from '../app';
import prismaNewClient from '../lib/prisma';
import { UUID_REGEX } from '../validators/validator';
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
    expect(res.body.user).toHaveProperty('jwtToken');
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
    expect(res.body.user).toHaveProperty('jwtToken');
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
    expect(res.body.user).toHaveProperty('jwtToken');
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
    expect(res.body).toHaveProperty('id');
    expect(res.body.id).toMatch(UUID_REGEX);
    expect(res.body).toHaveProperty('userId', userIds[0]);
    expect(res.body).toHaveProperty('brand', 'Peugeot');
    expect(res.body).toHaveProperty('model', '308');
    expect(res.body).toHaveProperty('color', 'Blue');
    expect(res.body).toHaveProperty('vehicleYear', 2023);
    expect(res.body).toHaveProperty('licensePlate', `LP_${name}`);
    expect(res.body).toHaveProperty('energy', 'petrol');
    expect(res.body).toHaveProperty('seatCount', 4);
  });

  it('FUNCTION: createVehicleAndGetId: 200<> return VEHICLE.ID with POST /api/vehicles', async () => {
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
