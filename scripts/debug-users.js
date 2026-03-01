"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Checking registered users...');
    const users = await prisma.user.findMany({
        select: { email: true, id: true, name: true }
    });
    console.log('Found users:', users);
}
main()
    .catch((e) => console.error(e))
    .finally(async () => await prisma.$disconnect());
//# sourceMappingURL=debug-users.js.map