// backend/src/lib/prisma.ts
import { PrismaClient } from '../../generated/prisma';

console.log('🔍 DATABASE_URL:', process.env.DATABASE_URL);

const prismaNewClient = new PrismaClient();

export default prismaNewClient;
