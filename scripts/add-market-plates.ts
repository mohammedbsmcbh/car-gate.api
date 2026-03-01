
import { PrismaClient, ListingType, ListingStatus, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔢 Adding Plates specifically for Individuals and Traders...');

  // 1. Find 5 Individuals
  const individuals = await prisma.user.findMany({
    where: { role: UserRole.INDIVIDUAL },
    take: 5
  });

  // 2. Find 5 Traders
  const traders = await prisma.user.findMany({
    where: { role: UserRole.TRADER },
    take: 5
  });

  if (individuals.length === 0 || traders.length === 0) {
      console.log("No individuals or traders found. Run seed-ten-items.ts first.");
      return;
  }

  // Create 1 plate for each Individual
  for (const user of individuals) {
    const num = Math.floor(Math.random() * 900000) + 100000;
    console.log(`  - Adding Plate ${num} for Individual ${user.name}`);
    
    await prisma.listing.create({
        data: {
            title: `Plate ${num}`,
            titleAr: `لوحة ${num}`,
            description: 'Private 6 digit plate',
            descriptionAr: 'لوحة خصوصي 6 أرقام',
            type: ListingType.PLATE,
            status: ListingStatus.APPROVED,
            price: 5000 + Math.floor(Math.random() * 20000),
            currency: 'BHD',
            ownerId: user.id,
            city: 'Manama',
            plateNumber: num.toString(),
            plateCategory: 'Private',
            contactPhone: user.phone || '33333333',
            media: {
                create: [{
                    url: `https://dummyimage.com/600x400/000/fff&text=PLATE-${num}`,
                    type: 'image',
                    isPrimary: true
                }]
            }
        }
    });
  }

  // Create 1 plate for each Trader
  for (const user of traders) {
    const num = Math.floor(Math.random() * 90000) + 10000;
    console.log(`  - Adding Plate ${num} for Trader ${user.name}`);
    
    await prisma.listing.create({
        data: {
            title: `Plate ${num}`,
            titleAr: `لوحة ${num}`,
            description: 'Special 5 digit plate',
            descriptionAr: 'لوحة مميزة 5 أرقام',
            type: ListingType.PLATE,
            status: ListingStatus.APPROVED,
            price: 15000 + Math.floor(Math.random() * 30000),
            currency: 'BHD',
            ownerId: user.id,
            city: 'Manama',
            plateNumber: num.toString(),
            plateCategory: 'Private',
            contactPhone: user.phone || '33333333',
            media: {
                create: [{
                    url: `https://dummyimage.com/600x400/000/fff&text=PLATE-${num}`,
                    type: 'image',
                    isPrimary: true
                }]
            }
        }
    });
  }

  console.log('✅ Added 5 Plates for Individuals and 5 Plates for Traders.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
