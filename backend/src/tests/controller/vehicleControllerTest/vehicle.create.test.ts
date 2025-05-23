// backend/src/tests/vehicleControllerTest/vehicle.create.test.ts
import request from 'supertest';
import app from '../../../app';
import prismaNewClient from '../../../lib/prisma';
import {
  cookies,
  createUserAndSignIn,
  invalidCookie,
  resetDB,
  testEmails,
} from '../../test.utils';
import { UUID_REGEX } from '../../../utils/validation';

beforeAll(async () => {
  await resetDB();

  cookies[0] = (await createUserAndSignIn(testEmails[0])).headers['set-cookie'];
});

afterAll(async () => {
  await resetDB();
  await prismaNewClient.$disconnect();
});

describe('VehicleController: POST /api/vehicles', () => {
  it('POST /api/vehicles: 201<Successfully created Vehicle: created> should create a new vehicle', async () => {
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
    expect(res.body).toHaveProperty(
      'message',
      'Successfully created Vehicle: created'
    );
    expect(res.body.vehicle).toBeDefined();
    expect(res.body.vehicle).toHaveProperty('id');
    expect(res.body.vehicle.id).toMatch(UUID_REGEX);
    expect(res.body.vehicle).toHaveProperty('userId');
    expect(res.body.vehicle.userId).toMatch(UUID_REGEX);
    expect(res.body.vehicle).toHaveProperty('brand', 'Tesla');
    expect(res.body.vehicle).toHaveProperty('model', 'Model S');
    expect(res.body.vehicle).toHaveProperty('color', 'Red');
    expect(res.body.vehicle).toHaveProperty('vehicleYear', 2022);
    expect(res.body.vehicle).toHaveProperty('licensePlate', 'TESLA123');
    expect(res.body.vehicle).toHaveProperty('energy', 'electric');
    expect(res.body.vehicle).toHaveProperty('seatCount', 5);
  });

  it('POST /api/vehicles: 401<Unauthorized access Athenticate: missing token> if user not authenticated', async () => {
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
    expect(res.body).toHaveProperty(
      'message',
      'Unauthorized access Athenticate: missing token'
    );
  });

  it('POST /api/vehicles: 401<Unauthorized access Athenticate: invalid token> if JWT is invalid', async () => {
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
    expect(res.body).toHaveProperty(
      'message',
      'Unauthorized access Athenticate: invalid token'
    );
  });

  it('POST /api/vehicles: 400<Bad request Validator: Brand is required> missing fields', async () => {
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
    expect(res.body).toHaveProperty(
      'message',
      'Bad request Validator: Brand is required'
    );
  });

  it('POST /api/vehicles: 400<Bad request Validator: Model is required> missing fields', async () => {
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
    expect(res.body).toHaveProperty(
      'message',
      'Bad request Validator: Model is required'
    );
  });

  it('POST /api/vehicles: 400<Bad request Validator: Color is required> missing fields', async () => {
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
    expect(res.body).toHaveProperty(
      'message',
      'Bad request Validator: Color is required'
    );
  });

  it('POST /api/vehicles: 400<Bad request Validator: Vehicle year is required> missing fields', async () => {
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
    expect(res.body).toHaveProperty(
      'message',
      'Bad request Validator: Vehicle year is required'
    );
  });

  it('POST /api/vehicles: 400<Bad request Validator: Vehicle year must be a valid year>', async () => {
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
      'Bad request Validator: Vehicle year must be a valid year'
    );
  });

  it('POST /api/vehicles: 400<Bad request Validator: Vehicle year must be a valid year> 1850', async () => {
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
      'Bad request Validator: Vehicle year must be a valid year'
    );
  });

  it('POST /api/vehicles: 400<Bad request Validator: Vehicle year must be a valid year> 2525', async () => {
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
      'Bad request Validator: Vehicle year must be a valid year'
    );
  });

  it('POST /api/vehicles: 400<Bad request Validator: License plate is required> missing fields', async () => {
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
    expect(res.body).toHaveProperty(
      'message',
      'Bad request Validator: License plate is required'
    );
  });

  it('POST /api/vehicles: 400<Bad request Validator: License plate must be between 3 and 20 characters> 1 character', async () => {
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
      'Bad request Validator: License plate must be between 3 and 20 characters'
    );
  });

  it('POST /api/vehicles: 400<Bad request Validator: License plate must be between 3 and 20 characters> 21 character', async () => {
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
      'Bad request Validator: License plate must be between 3 and 20 characters'
    );
  });

  it('POST /api/vehicles: 400<Bad request Validator: Energy is required> missing fields', async () => {
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
    expect(res.body).toHaveProperty(
      'message',
      'Bad request Validator: Energy is required'
    );
  });

  it('POST /api/vehicles: 400<Bad request Validator: Seat count is required> missing fields', async () => {
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
    expect(res.body).toHaveProperty(
      'message',
      'Bad request Validator: Seat count is required'
    );
  });

  it('POST /api/vehicles: 400<Bad request Validator: Seat count must be between 1 and 10> 0', async () => {
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
      'Bad request Validator: Seat count must be between 1 and 10'
    );
  });

  it('POST /api/vehicles: 400<Bad request Validator: Seat count must be between 1 and 10> 15', async () => {
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
      'Bad request Validator: Seat count must be between 1 and 10'
    );
  });

  it('POST /api/vehicles: 409<Conflict Vehicle: already used this license plate>', async () => {
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
      'Conflict Vehicle: already used this license plate'
    );
  });
});
