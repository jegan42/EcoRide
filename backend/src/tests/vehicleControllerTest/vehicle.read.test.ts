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
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /api/vehicles/:id: 200<> should return vehicle by ID', async () => {
    const res = await request(app).get(`/api/vehicles/${vehicleIds[0]}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id', vehicleIds[0]);
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

  it('GET /api/vehicles/:id: 404<Vehicle not found> if invalid Value Id', async () => {
    const res = await request(app).get(`/api/vehicles/${invalidValueId}`);

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('message', 'Vehicle not found');
  });

  it('GET /api/vehicles/:id: 400<Invalid vehicle ID> if invalid Format Id', async () => {
    const res = await request(app).get(`/api/vehicles/${invalidFormatId}`);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message', 'Invalid vehicle ID');
  });
});
