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
import { UUID_REGEX } from '../../utils/validation';

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
    expect(res.body.id).toMatch(UUID_REGEX);
    expect(res.body).toHaveProperty('userId');
    expect(res.body.userId).toMatch(UUID_REGEX);
    expect(res.body).toHaveProperty('brand', 'Tesla');
    expect(res.body).toHaveProperty('model', 'Model S');
    expect(res.body).toHaveProperty('color', 'Red');
    expect(res.body).toHaveProperty('vehicleYear', 2022);
    expect(res.body).toHaveProperty('licensePlate', 'TESLA123');
    expect(res.body).toHaveProperty('energy', 'electric');
    expect(res.body).toHaveProperty('seatCount', 5);
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

  it('POST /api/vehicles: 401<Invalid token> if JWT is invalid', async () => {
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

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('message', 'Invalid token');
  });

  it('POST /api/vehicles: 400<Brand is required> missing fields', async () => {
    const res = await request(app)
      .post('/api/vehicles')
      .set('Cookie', cookies[0])
      .send({
        model: 'Model S',
        color: 'Red',
        vehicleYear: 2022,
        licensePlate: 'TESLA1234',
        energy: 'electric',
        seatCount: 5,
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message', 'Brand is required');
  });

  it('POST /api/vehicles: 400<Model is required> missing fields', async () => {
    const res = await request(app)
      .post('/api/vehicles')
      .set('Cookie', cookies[0])
      .send({
        brand: 'Tesla',
        color: 'Red',
        vehicleYear: 2022,
        licensePlate: 'TESLA1234',
        energy: 'electric',
        seatCount: 5,
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message', 'Model is required');
  });

  it('POST /api/vehicles: 400<Color is required> missing fields', async () => {
    const res = await request(app)
      .post('/api/vehicles')
      .set('Cookie', cookies[0])
      .send({
        brand: 'Tesla',
        model: 'Model S',
        vehicleYear: 2022,
        licensePlate: 'TESLA1234',
        energy: 'electric',
        seatCount: 5,
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message', 'Color is required');
  });

  it('POST /api/vehicles: 400<Vehicle year is required> missing fields', async () => {
    const res = await request(app)
      .post('/api/vehicles')
      .set('Cookie', cookies[0])
      .send({
        brand: 'Tesla',
        model: 'Model S',
        color: 'Red',
        licensePlate: 'TESLA1234',
        energy: 'electric',
        seatCount: 5,
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message', 'Vehicle year is required');
  });

  it('POST /api/vehicles: 400<Vehicle year must be a valid year>', async () => {
    const res = await request(app)
      .post('/api/vehicles')
      .set('Cookie', cookies[0])
      .send({
        brand: 'Tesla',
        model: 'Model S',
        color: 'Red',
        vehicleYear: 'not an int',
        licensePlate: 'TESLA1234',
        energy: 'electric',
        seatCount: 5,
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty(
      'message',
      'Vehicle year must be a valid year'
    );
  });

  it('POST /api/vehicles: 400<Vehicle year must be a valid year> 1850', async () => {
    const res = await request(app)
      .post('/api/vehicles')
      .set('Cookie', cookies[0])
      .send({
        brand: 'Tesla',
        model: 'Model S',
        color: 'Red',
        vehicleYear: 1850,
        licensePlate: 'TESLA1234',
        energy: 'electric',
        seatCount: 5,
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty(
      'message',
      'Vehicle year must be a valid year'
    );
  });

  it('POST /api/vehicles: 400<Vehicle year must be a valid year> 2525', async () => {
    const res = await request(app)
      .post('/api/vehicles')
      .set('Cookie', cookies[0])
      .send({
        brand: 'Tesla',
        model: 'Model S',
        color: 'Red',
        vehicleYear: 2525,
        licensePlate: 'TESLA1234',
        energy: 'electric',
        seatCount: 5,
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty(
      'message',
      'Vehicle year must be a valid year'
    );
  });

  it('POST /api/vehicles: 400<License plate is required> missing fields', async () => {
    const res = await request(app)
      .post('/api/vehicles')
      .set('Cookie', cookies[0])
      .send({
        brand: 'Tesla',
        model: 'Model S',
        color: 'Red',
        vehicleYear: 2022,
        energy: 'electric',
        seatCount: 5,
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message', 'License plate is required');
  });

  it('POST /api/vehicles: 400<License plate must be between 3 and 20 characters> 1 character', async () => {
    const res = await request(app)
      .post('/api/vehicles')
      .set('Cookie', cookies[0])
      .send({
        brand: 'Tesla',
        model: 'Model S',
        color: 'Red',
        vehicleYear: 2022,
        licensePlate: 'T',
        energy: 'electric',
        seatCount: 5,
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty(
      'message',
      'License plate must be between 3 and 20 characters'
    );
  });

  it('POST /api/vehicles: 400<License plate must be between 3 and 20 characters> 21 character', async () => {
    const res = await request(app)
      .post('/api/vehicles')
      .set('Cookie', cookies[0])
      .send({
        brand: 'Tesla',
        model: 'Model S',
        color: 'Red',
        vehicleYear: 2022,
        licensePlate: 'LicensePlateIsTooLong',
        energy: 'electric',
        seatCount: 5,
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty(
      'message',
      'License plate must be between 3 and 20 characters'
    );
  });

  it('POST /api/vehicles: 400<Energy is required> missing fields', async () => {
    const res = await request(app)
      .post('/api/vehicles')
      .set('Cookie', cookies[0])
      .send({
        brand: 'Tesla',
        model: 'Model S',
        color: 'Red',
        vehicleYear: 2022,
        licensePlate: 'TESLA1234',
        seatCount: 5,
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message', 'Energy is required');
  });

  it('POST /api/vehicles: 400<Seat count is required> missing fields', async () => {
    const res = await request(app)
      .post('/api/vehicles')
      .set('Cookie', cookies[0])
      .send({
        brand: 'Tesla',
        model: 'Model S',
        color: 'Red',
        vehicleYear: 2022,
        licensePlate: 'TESLA1234',
        energy: 'electric',
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message', 'Seat count is required');
  });

  it('POST /api/vehicles: 400<Seat count must be between 1 and 10> 0', async () => {
    const res = await request(app)
      .post('/api/vehicles')
      .set('Cookie', cookies[0])
      .send({
        brand: 'Tesla',
        model: 'Model S',
        color: 'Red',
        vehicleYear: 2022,
        licensePlate: 'TESLA1234',
        energy: 'electric',
        seatCount: 0,
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty(
      'message',
      'Seat count must be between 1 and 10'
    );
  });

  it('POST /api/vehicles: 400<Seat count must be between 1 and 10> 15', async () => {
    const res = await request(app)
      .post('/api/vehicles')
      .set('Cookie', cookies[0])
      .send({
        brand: 'Tesla',
        model: 'Model S',
        color: 'Red',
        vehicleYear: 2022,
        licensePlate: 'TESLA1234',
        energy: 'electric',
        seatCount: 15,
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty(
      'message',
      'Seat count must be between 1 and 10'
    );
  });

  it('POST /api/vehicles: 409<Vehicle with this license plate already exists>', async () => {
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

    expect(res.status).toBe(409);
    expect(res.body).toHaveProperty(
      'message',
      'Vehicle with this license plate already exists'
    );
  });
});
