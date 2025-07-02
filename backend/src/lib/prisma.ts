// backend/src/lib/prisma.ts
import { PrismaClient } from '../../generated/prisma';
import dns from 'dns/promises';

dns
  .lookup('db.bfxafnzrvkxesttgjqqk.supabase.co')
  .then((r) => console.log('🔍 DNS resolved:', r))
  .catch((e) => console.error('❌ DNS ERR', e));

(async () => {
  try {
    const res = await dns.lookup('db.bfxafnzrvkxesttgjqqk.supabase.co');
    console.log('✅ Resolved DNS OK ✅ :', res);
  } catch (err) {
    console.error('❌ ERROR DNS ❌ :', err);
  }
})();

console.log('🔍 DATABASE_URL:', process.env.DATABASE_URL);

const prismaNewClient = new PrismaClient();

prismaNewClient
  .$connect()
  .then((res) => console.log('✅ DB connected!', res))
  .catch((err) => console.error('❌ Cannot connect DB:', err));

prismaNewClient.user
  .findMany()
  .then((res) => console.log('✅ DB reachable!', res))
  .catch((err) => console.error('❌ Cannot reach DB:', err));

export default prismaNewClient;
