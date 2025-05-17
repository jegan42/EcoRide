// backend/src/tests/vehicleControllerTest/vehicle.create.test.ts
import request from 'supertest';
import app from '../../app';
import prismaNewClient from '../../lib/prisma';
import {
  cookies,
  createUserAndSignIn,
  invalidCookie,
  resetDB,
  testEmails,
} from '../test.utils';

beforeAll(async () => {
  await resetDB();

  cookies[0] = (await createUserAndSignIn(testEmails[0])).headers['set-cookie'];
});

afterAll(async () => {
  await resetDB();
  await prismaNewClient.$disconnect();
});

describe('VehicleController: POST /api/vehicles', () => {
  it('POST /api/vehicles: 201<> should create a new vehicle', async () => {
    const res = await request(app)
      .post('/api/vehicles')
      .set('Cookie', cookies[0])
      .send({
        brand: 'Tesla',
        model: 'Model S',
        color: 'Red',
        vehicleYear: 2022,
        licensePlate: 'TESLA123',
        energy: 'electric',
        seatCount: 5,
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('brand', 'Tesla');
    expect(res.body).toHaveProperty('model', 'Model S');
    expect(res.body).toHaveProperty('color', 'Red');
    expect(res.body).toHaveProperty('vehicleYear', 2022);
    expect(res.body).toHaveProperty('licensePlate', 'TESLA123');
    expect(res.body).toHaveProperty('energy', 'electric');
    expect(res.body).toHaveProperty('seatCount', 5);
  });

  it('POST /api/vehicles: 400<Color is required> should not create vehicle with missing fields -color-', async () => {
    const res = await request(app)
      .post('/api/vehicles')
      .set('Cookie', cookies[0])
      .send({
        brand: 'Tesla',
        model: '3',
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message', 'Color is required');
  });

  it('POST /api/vehicles: 400<Model is required>  should not create vehicle with missing fields -model-', async () => {
    const res = await request(app)
      .post('/api/vehicles')
      .set('Cookie', cookies[0])
      .send({
        brand: 'Tesla',
        color: 'Red',
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message', 'Model is required');
  });

  it('POST /api/vehicles: 400<Vehicle with this license plate already exists> should not create vehicle with existing license plate', async () => {
    const res = await request(app)
      .post('/api/vehicles')
      .set('Cookie', cookies[0])
      .send({
        brand: 'Tesla',
        model: 'Model S',
        color: 'Red',
        vehicleYear: 2022,
        licensePlate: 'TESLA123',
        energy: 'electric',
        seatCount: 5,
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty(
      'message',
      'Vehicle with this license plate already exists'
    );
  });

  it('POST /api/vehicles: 401<Missing token> if user not authenticated', async () => {
    const res = await request(app).post('/api/vehicles').send({
      brand: 'Tesla',
      model: 'X',
      color: 'White',
      vehicleYear: 2023,
      licensePlate: 'TESLA999',
      energy: 'electric',
      seatCount: 5,
    });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('message', 'Missing token');
  });

  it('POST /api/vehicles: 403<Invalid token> if JWT is invalid', async () => {
    const res = await request(app)
      .post('/api/vehicles')
      .set('Cookie', invalidCookie)
      .send({
        brand: 'Tesla',
        model: 'Y',
        color: 'Black',
        vehicleYear: 2023,
        licensePlate: 'TESLA888',
        energy: 'electric',
        seatCount: 5,
      });

    expect(res.status).toBe(403);
    expect(res.body).toHaveProperty('message', 'Invalid token');
  });

  it('POST /api/vehicles: 400<License plate must be between 3 and 20 characters> should not allow creation of vehicle with too short license plate', async () => {
    const res = await request(app)
      .post('/api/vehicles')
      .set('Cookie', cookies[0])
      .send({
        brand: 'Tesla',
        model: 'Model S',
        color: 'Red',
        vehicleYear: 2022,
        licensePlate: 'TS',
        energy: 'electric',
        seatCount: 5,
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty(
      'message',
      'License plate must be between 3 and 20 characters'
    );
  });

  it('POST /api/vehicles: 400<Vehicle year must be a valid year> should not allow creation of vehicle with invalid vehicle year', async () => {
    const res = await request(app)
      .post('/api/vehicles')
      .set('Cookie', cookies[0])
      .send({
        brand: 'Tesla',
        model: 'Model S',
        color: 'Red',
        vehicleYear: 1800,
        licensePlate: 'TESLA123',
        energy: 'electric',
        seatCount: 5,
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty(
      'message',
      'Vehicle year must be a valid year'
    );
  });
});
