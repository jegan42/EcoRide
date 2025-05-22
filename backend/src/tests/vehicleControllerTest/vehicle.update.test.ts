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
import { UUID_REGEX } from '../../utils/validation';

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
  it('PUT /api/vehicles/:id: 200<Successfully Vehicle: updated> should update vehicle info', async () => {
    const res = await request(app)
      .put(`/api/vehicles/${vehicleIds[0]}`)
      .set('Cookie', cookies[0])
      .send({ color: 'Blue' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'Successfully Vehicle: updated');
    expect(res.body.vehicle).toBeDefined();
    expect(res.body.vehicle).toHaveProperty('id');
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

  it('PUT /api/vehicles/:id: 400<Bad request Validator: Invalid vehicle ID>', async () => {
    const res = await request(app)
      .put(`/api/vehicles/${invalidFormatId}`)
      .set('Cookie', cookies[0])
      .send({ color: 'green' });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty(
      'message',
      'Bad request Validator: Invalid vehicle ID'
    );
  });

  it('PUT /api/vehicles/:id: 400<Bad request Validator: Brand must not be empty>', async () => {
    const res = await request(app)
      .put(`/api/vehicles/${vehicleIds[0]}`)
      .set('Cookie', cookies[0])
      .send({ brand: '' });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty(
      'message',
      'Bad request Validator: Brand must not be empty'
    );
  });

  it('PUT /api/vehicles/:id: 400<Bad request Validator: Model must not be empty>', async () => {
    const res = await request(app)
      .put(`/api/vehicles/${vehicleIds[0]}`)
      .set('Cookie', cookies[0])
      .send({ model: '' });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty(
      'message',
      'Bad request Validator: Model must not be empty'
    );
  });

  it('PUT /api/vehicles/:id: 400<Bad request Validator: Color must not be empty>', async () => {
    const res = await request(app)
      .put(`/api/vehicles/${vehicleIds[0]}`)
      .set('Cookie', cookies[0])
      .send({ color: '' });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty(
      'message',
      'Bad request Validator: Color must not be empty'
    );
  });

  it('PUT /api/vehicles/:id: 400<Bad request Validator: Vehicle year must be a valid year> empty', async () => {
    const res = await request(app)
      .put(`/api/vehicles/${vehicleIds[0]}`)
      .set('Cookie', cookies[0])
      .send({ vehicleYear: '' });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty(
      'message',
      'Bad request Validator: Vehicle year must be a valid year'
    );
  });

  it('PUT /api/vehicles/:id: 400<Bad request Validator: Vehicle year must be a valid year> 1850', async () => {
    const res = await request(app)
      .put(`/api/vehicles/${vehicleIds[0]}`)
      .set('Cookie', cookies[0])
      .send({ vehicleYear: 1850 });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty(
      'message',
      'Bad request Validator: Vehicle year must be a valid year'
    );
  });

  it('PUT /api/vehicles/:id: 400<Bad request Validator: Vehicle year must be a valid year> 2525', async () => {
    const res = await request(app)
      .put(`/api/vehicles/${vehicleIds[0]}`)
      .set('Cookie', cookies[0])
      .send({ vehicleYear: 2525 });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty(
      'message',
      'Bad request Validator: Vehicle year must be a valid year'
    );
  });

  it('PUT /api/vehicles/:id: 400<Bad request Validator: License plate must be between 3 and 20 characters> empty', async () => {
    const res = await request(app)
      .put(`/api/vehicles/${vehicleIds[0]}`)
      .set('Cookie', cookies[0])
      .send({ licensePlate: '' });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty(
      'message',
      'Bad request Validator: License plate must be between 3 and 20 characters'
    );
  });

  it('PUT /api/vehicles/:id: 400<Bad request Validator: License plate must be between 3 and 20 characters> 1 character', async () => {
    const res = await request(app)
      .put(`/api/vehicles/${vehicleIds[0]}`)
      .set('Cookie', cookies[0])
      .send({ licensePlate: 'a' });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty(
      'message',
      'Bad request Validator: License plate must be between 3 and 20 characters'
    );
  });

  it('PUT /api/vehicles/:id: 400<Bad request Validator: License plate must be between 3 and 20 characters> 21 character', async () => {
    const res = await request(app)
      .put(`/api/vehicles/${vehicleIds[0]}`)
      .set('Cookie', cookies[0])
      .send({ licensePlate: 'licensePlateIsToolong' });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty(
      'message',
      'Bad request Validator: License plate must be between 3 and 20 characters'
    );
  });

  it('PUT /api/vehicles/:id: 400<Bad request Validator: Energy must not be empty> empty', async () => {
    const res = await request(app)
      .put(`/api/vehicles/${vehicleIds[0]}`)
      .set('Cookie', cookies[0])
      .send({ energy: '' });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty(
      'message',
      'Bad request Validator: Energy must not be empty'
    );
  });

  it('PUT /api/vehicles/:id: 400<Bad request Validator: Seat count must be between 1 and 10> empty', async () => {
    const res = await request(app)
      .put(`/api/vehicles/${vehicleIds[0]}`)
      .set('Cookie', cookies[0])
      .send({ seatCount: '' });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty(
      'message',
      'Bad request Validator: Seat count must be between 1 and 10'
    );
  });

  it('PUT /api/vehicles/:id: 400<Bad request Validator: Seat count must be between 1 and 10> 0', async () => {
    const res = await request(app)
      .put(`/api/vehicles/${vehicleIds[0]}`)
      .set('Cookie', cookies[0])
      .send({ seatCount: 0 });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty(
      'message',
      'Bad request Validator: Seat count must be between 1 and 10'
    );
  });

  it('PUT /api/vehicles/:id: 400<Bad request Validator: Seat count must be between 1 and 10> 15', async () => {
    const res = await request(app)
      .put(`/api/vehicles/${vehicleIds[0]}`)
      .set('Cookie', cookies[0])
      .send({ seatCount: 15 });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty(
      'message',
      'Bad request Validator: Seat count must be between 1 and 10'
    );
  });

  it('PUT /api/vehicles/:id: 403<Access denied Vehicle: not a driver> should not update vehicle of another user', async () => {
    const res = await request(app)
      .put(`/api/vehicles/${vehicleIds[1]}`)
      .set('Cookie', cookies[0])
      .send({ color: 'Green' });

    expect(res.status).toBe(403);
    expect(res.body).toHaveProperty(
      'message',
      'Access denied Vehicle: not a driver'
    );
  });

  it('PUT /api/vehicles/:id: 403<Access denied Vehicle: not a driver> if Invalid vehicle ID: Unauthorized', async () => {
    const res = await request(app)
      .put(`/api/vehicles/${invalidValueId}`)
      .set('Cookie', cookies[0])
      .send({ color: 'Green' });

    expect(res.status).toBe(403);
    expect(res.body).toHaveProperty(
      'message',
      'Access denied Vehicle: not a driver'
    );
  });

  it('PUT /api/vehicles/:id: 401<Unauthorized access Athenticate: missing token> if not authenticated', async () => {
    const res = await request(app)
      .put(`/api/vehicles/${vehicleIds[0]}`)
      .send({ color: 'Green' });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty(
      'message',
      'Unauthorized access Athenticate: missing token'
    );
  });
});
