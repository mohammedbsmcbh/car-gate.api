
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Disabling broken Mixkit video banners...');
  
  // Find banners with mixkit in the URL
  const banners = await prisma.banner.findMany({
    where: {
      mediaUrl: {
        contains: 'mixkit.co'
      }
    }
  });

  console.log(`Found ${banners.length} mixkit banners.`);

  // Update them to inactive
  const result = await prisma.banner.updateMany({
    where: {
      mediaUrl: {
         contains: 'mixkit.co'
      }
    },
    data: {
      isActive: false
    }
  });

  console.log(`Updated ${result.count} banners to inactive.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
