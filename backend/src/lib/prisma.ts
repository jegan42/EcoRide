// backend/src/lib/prisma.ts
import { PrismaClient } from '../../generated/prisma';

console.log('🔍 DATABASE_URL:', process.env.DATABASE_URL);

const prismaNewClient = new PrismaClient();

prismaNewClient.$connect().then((res) => console.log('✅ DB connected!', res))
.catch((err) => console.error('❌ Cannot connect DB:', err));

prismaNewClient.user.findMany()
  .then((res) => console.log('✅ DB reachable!', res))
  .catch((err) => console.error('❌ Cannot reach DB:', err));

export default prismaNewClient;
