"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🔢 Adding Plates specifically for Individuals and Traders...');
    const individuals = await prisma.user.findMany({
        where: { role: client_1.UserRole.INDIVIDUAL },
        take: 5
    });
    const traders = await prisma.user.findMany({
        where: { role: client_1.UserRole.TRADER },
        take: 5
    });
    if (individuals.length === 0 || traders.length === 0) {
        console.log("No individuals or traders found. Run seed-ten-items.ts first.");
        return;
    }
    for (const user of individuals) {
        const num = Math.floor(Math.random() * 900000) + 100000;
        console.log(`  - Adding Plate ${num} for Individual ${user.name}`);
        await prisma.listing.create({
            data: {
                title: `Plate ${num}`,
                titleAr: `لوحة ${num}`,
                description: 'Private 6 digit plate',
                descriptionAr: 'لوحة خصوصي 6 أرقام',
                type: client_1.ListingType.PLATE,
                status: client_1.ListingStatus.APPROVED,
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
    for (const user of traders) {
        const num = Math.floor(Math.random() * 90000) + 10000;
        console.log(`  - Adding Plate ${num} for Trader ${user.name}`);
        await prisma.listing.create({
            data: {
                title: `Plate ${num}`,
                titleAr: `لوحة ${num}`,
                description: 'Special 5 digit plate',
                descriptionAr: 'لوحة مميزة 5 أرقام',
                type: client_1.ListingType.PLATE,
                status: client_1.ListingStatus.APPROVED,
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
//# sourceMappingURL=add-market-plates.js.map