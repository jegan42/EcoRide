// backend/src/tests/test.utils.test.ts
import prismaNewClient from '../lib/prisma';
import { UUID_REGEX } from '../validators/validator';
import {
  resetDB,
  createUserAndSignIn,
  testEmails,
  unikUserName,
  cookies,
  userIds,
} from './test.utils';

beforeAll(async () => {
  await resetDB();
  console.log('✅ Entering First FunctionTest');
});

afterAll(async () => {
  await resetDB();
  await prismaNewClient.$disconnect();
});

describe('Test Utils Funtions', () => {
  it('Test Utils Funtions createUserAndSignIn: POST /api/auth/signup THEN POST /api/auth/signin RETURN status 200', async () => {
    const res = await createUserAndSignIn(testEmails[0], unikUserName);
    expect(res).toBeDefined();
    expect(res).toHaveProperty('status', 200);
    expect(res).toHaveProperty('body');
    expect(res.body).toHaveProperty('user');
    expect(res.body.user).toHaveProperty('email', testEmails[0]);
    expect(res.body.user).toHaveProperty('username', unikUserName);
    expect(res.body.user).not.toHaveProperty('password');

    cookies[0] = res.headers['set-cookie'];
    expect(cookies[0]).toBeDefined();
    expect(cookies[0][0]).toMatch(/jwtToken=/);
    expect(cookies[0][0]).toMatch(/HttpOnly/);

    userIds[0] = res.body.user.id;
    expect(userIds[0]).toBeDefined();
    expect(userIds[0]).toHaveLength(36);
    expect(userIds[0]).toMatch(UUID_REGEX);
  });
});
