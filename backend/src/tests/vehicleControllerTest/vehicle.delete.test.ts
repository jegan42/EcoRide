// backend/src/tests/vehicleControllerTest/vehicle.delete.test.ts
import request from 'supertest';
import app from '../../app';
import prismaNewClient from '../../lib/prisma';
import {
  cookies,
  createUserAndSignIn,
  createVehicleAndGetId,
  invalidCookie,
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

describe('VehicleController: DELETE /api/vehicles', () => {
  it('DELETE /api/vehicles/:id: 200<Vehicle deleted!>', async () => {
    const res = await request(app)
      .delete(`/api/vehicles/${vehicleIds[0]}`)
      .set('Cookie', cookies[0]);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'Vehicle deleted!');
  });

  it('DELETE /api/vehicles/:id: 401<Missing token> if not authenticated', async () => {
    const res = await request(app).delete(`/api/vehicles/${vehicleIds[0]}`);

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('message', 'Missing token');
  });

  it('DELETE /api/vehicles/:id: 401<Invalid token> JWT invalid', async () => {
    const res = await request(app)
      .delete(`/api/vehicles/${vehicleIds[0]}`)
      .set('Cookie', invalidCookie);

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('message', 'Invalid token');
  });

  it('DELETE /api/vehicles/:id: 403<Unauthorized> if invalidValueId Unauthorized', async () => {
    const res = await request(app)
      .delete(`/api/vehicles/${invalidValueId}`)
      .set('Cookie', cookies[0]);

    expect(res.status).toBe(403);
    expect(res.body).toHaveProperty('message', 'Unauthorized');
  });

  it('DELETE /api/vehicles/:id: 400<Invalid ID> if invalidFormatId vehicle not found', async () => {
    const res = await request(app)
      .delete(`/api/vehicles/${invalidFormatId}`)
      .set('Cookie', cookies[0]);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message', 'Invalid ID');
  });

  it('DELETE /api/vehicles/:id: 403<Unauthorized> should not delete vehicle of another user', async () => {
    const res = await request(app)
      .delete(`/api/vehicles/${vehicleIds[1]}`)
      .set('Cookie', cookies[0]);

    expect(res.status).toBe(403);
    expect(res.body).toHaveProperty('message', 'Unauthorized');
  });
});
