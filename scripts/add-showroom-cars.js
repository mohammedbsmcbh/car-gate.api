"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const CAR_MODELS = [
    { make: 'Toyota', model: 'Camry' },
    { make: 'Toyota', model: 'Corolla' },
    { make: 'Honda', model: 'Civic' },
    { make: 'Honda', model: 'Accord' },
    { make: 'Nissan', model: 'Patrol' },
    { make: 'Nissan', model: 'Altima' },
    { make: 'Ford', model: 'Mustang' },
    { make: 'Chevrolet', model: 'Tahoe' },
    { make: 'Hyundai', model: 'Elantra' },
    { make: 'Kia', model: 'Sportage' },
];
async function main() {
    console.log('🏭 Adding 5 cars to each of the 10 seeded Showrooms...');
    const showrooms = await prisma.user.findMany({
        where: {
            email: { startsWith: 'showroom_new_' },
            role: 'SHOWROOM',
        },
        include: { showroom: true }
    });
    if (showrooms.length === 0) {
        console.log('❌ No showrooms found. Run seed-ten-items.ts first.');
        return;
    }
    console.log(`Found ${showrooms.length} showrooms.`);
    for (const user of showrooms) {
        console.log(`  - Adding cars for ${user.name}...`);
        for (let i = 0; i < 5; i++) {
            const carInfo = CAR_MODELS[Math.floor(Math.random() * CAR_MODELS.length)];
            const price = 4000 + Math.floor(Math.random() * 20000);
            await prisma.listing.create({
                data: {
                    title: `${carInfo.make} ${carInfo.model} ${2020 + i}`,
                    titleAr: `${carInfo.make} ${carInfo.model} ${2020 + i}`,
                    description: 'Showroom vehicle in excellent condition.',
                    descriptionAr: 'سيارة معرض بحالة ممتازة.',
                    type: client_1.ListingType.CAR,
                    status: client_1.ListingStatus.APPROVED,
                    price: price,
                    currency: 'BHD',
                    ownerId: user.id,
                    city: user.showroom?.city || 'Manama',
                    make: carInfo.make,
                    model: carInfo.model,
                    year: 2020 + i,
                    mileage: Math.floor(Math.random() * 50000),
                    bodyType: 'Sedan',
                    transmission: 'Automatic',
                    fuelType: 'Petrol',
                    color: 'White',
                    contactPhone: user.phone || '33333333',
                    media: {
                        create: [{
                                url: `https://dummyimage.com/600x400/${Math.floor(Math.random() * 16777215).toString(16)}/fff&text=${carInfo.make}`,
                                type: 'image',
                                isPrimary: true
                            }]
                    }
                }
            });
        }
    }
    console.log('✅ Added 5 cars to all showrooms.');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=add-showroom-cars.js.map