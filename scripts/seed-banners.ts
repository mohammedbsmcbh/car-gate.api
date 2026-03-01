import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding initial banner...');

  const banner = await prisma.banner.upsert({
    where: {
        // We don't have a unique field like title, so we can check if any exists or just create one.
        // For upsert, we need a unique constraint. If none exists on title, we might just query first.
        // Let's just use findFirst and create if not exists for this script.
        id: 'default-seed-banner-1'
    } as any, // bypassing TS check for non-unique where logic simplifiction or just create
    update: {},
    create: {
      title: 'Special Offer on Luxury Cars',
      mediaUrl: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=1000',
      mediaType: 'IMAGE',
      link: 'https://cargate.bh/luxury-offers',
      isActive: true,
      position: 'HOME_TOP',
      sortOrder: 1
    },
  });

  console.log('Created banner:', banner);
  
  // Create a video banner test
  const videoBanner = await prisma.banner.create({
      data: {
          title: 'Car Gate Promo',
          mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-red-car-driving-on-a-highway-at-sunset-41334-large.mp4',
          mediaType: 'VIDEO',
          isActive: true,
          position: 'HOME_TOP',
          sortOrder: 2
      }
  });
  console.log('Created video banner:', videoBanner);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
