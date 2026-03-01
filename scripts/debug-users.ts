
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Checking registered users...');
  const users = await prisma.user.findMany({
    select: { email: true, id: true, name: true }
  });
  console.log('Found users:', users);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
