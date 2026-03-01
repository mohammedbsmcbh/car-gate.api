"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Seeding initial banner...');
    const banner = await prisma.banner.upsert({
        where: {
            id: 'default-seed-banner-1'
        },
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
//# sourceMappingURL=seed-banners.js.map