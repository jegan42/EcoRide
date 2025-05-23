// backend/src/tests/vehicleControllerTest/vehicle.read.test.ts
import request from 'supertest';
import app from '../../../app';
import prismaNewClient from '../../../lib/prisma';
import {
  cookies,
  createUserAndSignIn,
  createVehicleAndGetId,
  invalidFormatId,
  invalidValueId,
  resetDB,
  testEmails,
  vehicleIds,
} from '../../test.utils';
import { UUID_REGEX } from '../../../utils/validation';

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
  it('GET /api/vehicles: 200<Successfully Vehicle: getAll> should return all vehicles', async () => {
    const res = await request(app).get('/api/vehicles');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'Successfully Vehicle: getAll');
    expect(res.body.vehicles).toBeDefined();
    expect(Array.isArray(res.body.vehicles)).toBe(true);
  });

  it('GET /api/vehicles/:id: 200<Successfully Vehicle: getById> return vehicle by ID', async () => {
    const res = await request(app).get(`/api/vehicles/${vehicleIds[0]}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'Successfully Vehicle: getById');
    expect(res.body.vehicle).toHaveProperty('id');
    expect(res.body.vehicle).toHaveProperty('id', vehicleIds[0]);
    expect(res.body.vehicle.id).toMatch(UUID_REGEX);
    expect(res.body.vehicle).toHaveProperty('userId');
    expect(res.body.vehicle.userId).toMatch(UUID_REGEX);
    expect(res.body.vehicle).toHaveProperty('brand', 'Peugeot');
    expect(res.body.vehicle).toHaveProperty('model', '308');
    expect(res.body.vehicle).toHaveProperty('color', 'Blue');
    expect(res.body.vehicle).toHaveProperty('vehicleYear', 2023);
    expect(res.body.vehicle).toHaveProperty(
      'licensePlate',
      `LP_${testEmails[0].split('@')[0]}`
    );
    expect(res.body.vehicle).toHaveProperty('energy', 'petrol');
    expect(res.body.vehicle).toHaveProperty('seatCount', 4);
  });

  it('GET /api/vehicles/:id: 400<Bad request Validator: Invalid ID> if invalid Format Id', async () => {
    const res = await request(app).get(`/api/vehicles/${invalidFormatId}`);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty(
      'message',
      'Bad request Validator: Invalid ID'
    );
  });

  it('GET /api/vehicles/:id: 404<Not found Vehicle: vehicle not found> if invalid Value Id', async () => {
    const res = await request(app).get(`/api/vehicles/${invalidValueId}`);

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty(
      'message',
      'Not found Vehicle: vehicle not found'
    );
  });

  it('GET /api/vehicles: 404<Not found Vehicle: vehicle not found>', async () => {
    await prismaNewClient.vehicle.deleteMany();
    const res = await request(app).get('/api/vehicles');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty(
      'message',
      'Not found Vehicle: vehicle not found'
    );
  });

  it('GET /api/vehicles: 500<Internal error Auth: failed to getAll>', async () => {
    jest
      .spyOn(prismaNewClient.vehicle, 'findMany')
      .mockRejectedValue(new Error('DB exploded'));
    const res = await request(app).get('/api/vehicles');

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty(
      'message',
      'Internal error Vehicle: failed to getAll'
    );
  });

  it('GET /api/vehicles/:id: 500<Internal error Auth: failed to getById>', async () => {
    jest
      .spyOn(prismaNewClient.vehicle, 'findUnique')
      .mockRejectedValue(new Error('DB exploded'));
    const res = await request(app).get(`/api/vehicles/${vehicleIds[0]}`);

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty(
      'message',
      'Internal error Vehicle: failed to getById'
    );
  });
});
