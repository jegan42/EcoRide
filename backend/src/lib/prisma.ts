// backend/src/lib/prisma.ts
import { PrismaClient } from '../../generated/prisma';

const prismaNewClient = new PrismaClient();

export default prismaNewClient;
