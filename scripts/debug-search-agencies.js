"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Testing searchAgencies query...');
    try {
        const where = { isApproved: true };
        const skip = 0;
        const limit = 20;
        const data = await prisma.agency.findMany({
            where,
            include: {
                _count: {
                    select: { listings: true },
                },
            },
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
        });
        console.log('Data:', JSON.stringify(data, null, 2));
        const count = await prisma.agency.count({ where });
        console.log('Count:', count);
    }
    catch (error) {
        console.error('Error executing query:', error);
    }
    finally {
        await prisma.$disconnect();
    }
}
main();
//# sourceMappingURL=debug-search-agencies.js.map