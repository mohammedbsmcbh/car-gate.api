import { PrismaClient, ListingType, ListingStatus } from '@prisma/client';

const prisma = new PrismaClient();

const CAR_DATA = [
  { make: 'Toyota', model: 'Camry', year: 2023, price: 8500, color: 'White', bodyType: 'Sedan' },
  { make: 'Toyota', model: 'Land Cruiser', year: 2024, price: 32000, color: 'Black', bodyType: 'SUV' },
  { make: 'Toyota', model: 'Corolla', year: 2022, price: 6200, color: 'Silver', bodyType: 'Sedan' },
  { make: 'Toyota', model: 'RAV4', year: 2023, price: 12000, color: 'Gray', bodyType: 'SUV' },
  { make: 'Nissan', model: 'Patrol', year: 2024, price: 28000, color: 'White', bodyType: 'SUV' },
  { make: 'Nissan', model: 'Altima', year: 2022, price: 7800, color: 'Blue', bodyType: 'Sedan' },
  { make: 'Nissan', model: 'X-Trail', year: 2023, price: 11500, color: 'Silver', bodyType: 'SUV' },
  { make: 'Honda', model: 'Accord', year: 2023, price: 9200, color: 'Black', bodyType: 'Sedan' },
  { make: 'Honda', model: 'CR-V', year: 2022, price: 10500, color: 'White', bodyType: 'SUV' },
  { make: 'Honda', model: 'Civic', year: 2024, price: 7500, color: 'Red', bodyType: 'Sedan' },
  { make: 'Hyundai', model: 'Tucson', year: 2023, price: 9800, color: 'Gray', bodyType: 'SUV' },
  { make: 'Hyundai', model: 'Elantra', year: 2022, price: 5900, color: 'White', bodyType: 'Sedan' },
  { make: 'Kia', model: 'Sportage', year: 2023, price: 10200, color: 'Silver', bodyType: 'SUV' },
  { make: 'Kia', model: 'Cerato', year: 2022, price: 6500, color: 'Black', bodyType: 'Sedan' },
  { make: 'Ford', model: 'Explorer', year: 2023, price: 18000, color: 'White', bodyType: 'SUV' },
  { make: 'Ford', model: 'Mustang', year: 2022, price: 22000, color: 'Red', bodyType: 'Coupe' },
  { make: 'Chevrolet', model: 'Tahoe', year: 2024, price: 25000, color: 'Black', bodyType: 'SUV' },
  { make: 'GMC', model: 'Yukon', year: 2023, price: 27000, color: 'White', bodyType: 'SUV' },
  { make: 'BMW', model: '3 Series', year: 2023, price: 19000, color: 'Gray', bodyType: 'Sedan' },
  { make: 'Mercedes-Benz', model: 'C-Class', year: 2023, price: 22000, color: 'Black', bodyType: 'Sedan' },
];

async function main() {
  console.log('🏭 Adding cars to ALL showrooms...');

  const showrooms = await prisma.showroom.findMany({
    include: { user: true }
  });

  if (showrooms.length === 0) {
    console.log('❌ No showrooms found.');
    return;
  }

  console.log(`Found ${showrooms.length} showrooms.`);

  let totalAdded = 0;
  for (const showroom of showrooms) {
    const existingCount = await prisma.listing.count({
      where: { showroomId: showroom.id, status: ListingStatus.APPROVED }
    });

    // Add cars to bring total up to 10 per showroom
    const toAdd = Math.max(0, 10 - existingCount);
    if (toAdd === 0) {
      console.log(`  ✓ ${showroom.name} already has ${existingCount} cars, skipping.`);
      continue;
    }

    console.log(`  + Adding ${toAdd} cars to ${showroom.name} (has ${existingCount})...`);

    for (let i = 0; i < toAdd; i++) {
      const car = CAR_DATA[(totalAdded + i) % CAR_DATA.length];
      await prisma.listing.create({
        data: {
          title: `${car.year} ${car.make} ${car.model}`,
          titleAr: `${car.year} ${car.make} ${car.model}`,
          description: `${car.year} ${car.make} ${car.model} - showroom condition, single owner, full service history.`,
          descriptionAr: `${car.year} ${car.make} ${car.model} - حالة ممتازة، مالك واحد، سجل صيانة كامل.`,
          type: ListingType.CAR,
          status: ListingStatus.APPROVED,
          price: car.price + Math.floor(Math.random() * 2000),
          currency: 'BHD',
          ownerId: showroom.userId,
          showroomId: showroom.id,
          city: showroom.city || 'Manama',
          make: car.make,
          model: car.model,
          year: car.year,
          mileage: Math.floor(Math.random() * 30000),
          bodyType: car.bodyType,
          transmission: 'Automatic',
          fuelType: 'Petrol',
          color: car.color,
          contactPhone: showroom.user?.phone || '33333333',
          media: {
            create: [{
              url: `https://dummyimage.com/600x400/${Math.floor(Math.random() * 16777215).toString(16).padStart(6,'0')}/fff&text=${encodeURIComponent(car.make)}`,
              type: 'image',
              isPrimary: true
            }]
          }
        }
      });
    }
    totalAdded += toAdd;
  }

  console.log(`\n✅ Done! Added ${totalAdded} cars across ${showrooms.length} showrooms.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
