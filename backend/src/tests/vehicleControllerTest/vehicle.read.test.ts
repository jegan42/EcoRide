// backend/src/tests/vehicleControllerTest/vehicle.read.test.ts
import request from 'supertest';
import app from '../../app';
import prismaNewClient from '../../lib/prisma';
import {
  cookies,
  createUserAndSignIn,
  createVehicleAndGetId,
  invalidFormatId,
  invalidValueId,
  resetDB,
  testEmails,
  vehicleIds,
} from '../test.utils';
import { UUID_REGEX } from '../../utils/validation';

beforeAll(async () => {
  await resetDB();

  cookies[0] = (await createUserAndSignIn(testEmails[0])).headers['set-cookie'];
  vehicleIds[0] = await createVehicleAndGetId(testEmails[0], cookies[0]);
});

afterAll(async () => {
  await resetDB();
  await prismaNewClient.$disconnect();
});

describe('VehicleController: GET /api/vehicles', () => {
  it('GET /api/vehicles: 200<> should return all vehicles', async () => {
    const res = await request(app).get('/api/vehicles');
    expect(res.status).toBe(200);
    expect(res.body.vehicles).toBeDefined();
    expect(Array.isArray(res.body.vehicles)).toBe(true);
  });

  it('GET /api/vehicles/:id: 200<> return vehicle by ID', async () => {
    const res = await request(app).get(`/api/vehicles/${vehicleIds[0]}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('id', vehicleIds[0]);
    expect(res.body.id).toMatch(UUID_REGEX);
    expect(res.body).toHaveProperty('userId');
    expect(res.body.userId).toMatch(UUID_REGEX);
    expect(res.body).toHaveProperty('brand', 'Peugeot');
    expect(res.body).toHaveProperty('model', '308');
    expect(res.body).toHaveProperty('color', 'Blue');
    expect(res.body).toHaveProperty('vehicleYear', 2023);
    expect(res.body).toHaveProperty(
      'licensePlate',
      `LP_${testEmails[0].split('@')[0]}`
    );
    expect(res.body).toHaveProperty('energy', 'petrol');
    expect(res.body).toHaveProperty('seatCount', 4);
  });

  it('GET /api/vehicles/:id: 400<Invalid ID> if invalid Format Id', async () => {
    const res = await request(app).get(`/api/vehicles/${invalidFormatId}`);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message', 'Invalid ID');
  });

  it('GET /api/vehicles/:id: 404<Vehicle not found> if invalid Value Id', async () => {
    const res = await request(app).get(`/api/vehicles/${invalidValueId}`);

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('message', 'Vehicle not found');
  });
});
