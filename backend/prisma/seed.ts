import { PrismaClient } from '@prisma/client';
import { AuthService } from '../src/services/auth.service';

const prisma = new PrismaClient();

const main = async () => {
  await prisma.user.create({
    data: {
      email: 'adminfortest@ecoride.dedyn.io',
      password: await AuthService.hashPassword('Mon@email.123'),
      role: ['admin'],
      firstName: 'Admin',
      lastName: 'Test',
      username: 'admin_test',
      phone: '+33600000000',
      address: '123 Rue de la Mobilité, Paris',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
    },
  });

  console.log('✅ Utilisateur admin inséré avec succès.');
};

main()
  .catch((e) => {
    console.error('❌ Erreur pendant le seed:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
