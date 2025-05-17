// backend/src/tests/vehicleControllerTest/vehicle.update.test.ts
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
  cookies[1] = (await createUserAndSignIn(testEmails[1])).headers['set-cookie'];
  vehicleIds[1] = await createVehicleAndGetId(testEmails[1], cookies[1]);
});

afterAll(async () => {
  await resetDB();
  await prismaNewClient.$disconnect();
});

describe('VehicleController: PUT /api/vehicles', () => {
  it('PUT /api/vehicles/:id: 200<> should update vehicle info', async () => {
    const res = await request(app)
      .put(`/api/vehicles/${vehicleIds[0]}`)
      .set('Cookie', cookies[0])
      .send({ color: 'Blue' });

    expect(res.status).toBe(200);
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

  it('PUT /api/vehicles/:id: 403<Unauthorized> should not update vehicle of another user', async () => {
    const res = await request(app)
      .put(`/api/vehicles/${vehicleIds[1]}`)
      .set('Cookie', cookies[0])
      .send({ color: 'Green' });

    expect(res.status).toBe(403);
    expect(res.body).toHaveProperty('message', 'Unauthorized');
  });

  it('PUT /api/vehicles/:id: 403<Unauthorized> if Invalid vehicle ID: Unauthorized', async () => {
    const res = await request(app)
      .put(`/api/vehicles/${invalidValueId}`)
      .set('Cookie', cookies[0])
      .send({ color: 'Green' });

    expect(res.status).toBe(403);
    expect(res.body).toHaveProperty('message', 'Unauthorized');
  });

  it('PUT /api/vehicles/:id: 400<Invalid vehicle ID> if invalid Format Id: Invalid vehicle ID', async () => {
    const res = await request(app)
      .put(`/api/vehicles/${invalidFormatId}`)
      .set('Cookie', cookies[0])
      .send({ color: 'Green' });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message', 'Invalid vehicle ID');
  });

  it('PUT /api/vehicles/:id: 400<Color must not be empty> if invalid data is sent', async () => {
    const res = await request(app)
      .put(`/api/vehicles/${vehicleIds[0]}`)
      .set('Cookie', cookies[0])
      .send({ color: '' });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message', 'Color must not be empty');
  });

  it('PUT /api/vehicles/:id: 400<Vehicle year must be a valid year> if invalid data is sent', async () => {
    const res = await request(app)
      .put(`/api/vehicles/${vehicleIds[0]}`)
      .set('Cookie', cookies[0])
      .send({ vehicleYear: 10 });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty(
      'message',
      'Vehicle year must be a valid year'
    );
  });

  it('PUT /api/vehicles/:id: 401<Missing token> if not authenticated', async () => {
    const res = await request(app)
      .put(`/api/vehicles/${vehicleIds[0]}`)
      .send({ color: 'Green' });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('message', 'Missing token');
  });
});
