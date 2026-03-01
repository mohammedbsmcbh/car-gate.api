"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const p = new client_1.PrismaClient();
async function main() {
    const total = await p.listing.count({ where: { status: 'APPROVED', type: 'CAR' } });
    console.log('Total approved CAR listings:', total);
    const byRole = await p.listing.groupBy({
        by: ['type'],
        where: { owner: { role: { in: ['INDIVIDUAL', 'TRADER'] } }, status: 'APPROVED' },
        _count: true
    });
    console.log('By type for INDIVIDUAL/TRADER:', JSON.stringify(byRole, null, 2));
    const samples = await p.listing.findMany({
        where: { owner: { role: { in: ['INDIVIDUAL', 'TRADER'] } }, status: 'APPROVED', type: 'CAR' },
        select: { id: true, title: true, bodyType: true, type: true, owner: { select: { role: true } } },
        take: 5
    });
    console.log('Sample listings:', JSON.stringify(samples, null, 2));
}
main().catch(console.error).finally(() => p.$disconnect());
//# sourceMappingURL=debug-market.js.map