// backend/src/tests/test.utils.ts
import request from 'supertest';
import app from '../app';
import prismaNewClient from '../lib/prisma';

export const invalidValueId = 'a99a9a99-9aa9-999a-9a99-aa99999999a9';

export const invalidFormatId = 'non-existent-id';
export const invalidMail = 'i_am_not_a_mail';
export const invalidCookie = ['jwtToken=invalidtoken'];

export const unikUserName = 'UNIKNAME';

export const testPassword = 'testPassword';
export const testEmails = [
  'user0@example.mail',
  'user1@example.mail',
  'user2@example.mail',
  'user3@example.mail',
  'user4@example.mail',
  'user5@example.mail',
  'user6@example.mail',
  'user8@example.mail',
  'user9@example.mail',
];
export const adminMail = 'testAdmin@example.mail';

export const cookies: string[] = [];

export const userIds: string[] = [];

export const resetDB = async () => {
  await prismaNewClient.user.deleteMany();
};

export const createUserAndSignIn = async (
  email: string,
  username?: string
): Promise<request.Response> => {
  const name = email.split('@')[0];
  await request(app)
    .post('/api/auth/signup')
    .send({
      email,
      password: testPassword,
      firstName: `firstName${name}`,
      lastName: `lastName${name}`,
      username: username ?? `username${name}`,
      phone: `1234${name}`,
      address: `123 ${name} St`,
    });

  return await request(app)
    .post('/api/auth/signin')
    .send({ email, password: testPassword });
};
