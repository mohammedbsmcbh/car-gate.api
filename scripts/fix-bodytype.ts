import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const luxuryBrands = ['Rolls Royce', 'Bentley', 'Ferrari', 'Lamborghini', 'Aston Martin', 'McLaren', 'Bugatti', 'Maserati', 'Porsche', 'Maybach'];

  const luxuryRes = await prisma.listing.updateMany({
    where: { make: { in: luxuryBrands } },
    data: { bodyType: 'Luxury' }
  });
  console.log('✅ Luxury cars updated:', luxuryRes.count);

  const classicRes = await prisma.listing.updateMany({
    where: { make: 'Classic' },
    data: { bodyType: 'Classic' }
  });
  console.log('✅ Classic cars updated:', classicRes.count);

  const otherRes = await prisma.listing.updateMany({
    where: { make: 'Other' },
    data: { bodyType: 'Other' }
  });
  console.log('✅ Other cars updated:', otherRes.count);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
