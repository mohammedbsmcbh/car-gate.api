"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Disabling broken Mixkit video banners...');
    const banners = await prisma.banner.findMany({
        where: {
            mediaUrl: {
                contains: 'mixkit.co'
            }
        }
    });
    console.log(`Found ${banners.length} mixkit banners.`);
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
//# sourceMappingURL=fix-broken-banners.js.map