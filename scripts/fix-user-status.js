"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Fixing user statuses...');
    const approvedUpdate = await prisma.user.updateMany({
        where: {
            isApproved: true,
            status: client_1.ApprovalStatus.PENDING
        },
        data: {
            status: client_1.ApprovalStatus.APPROVED
        }
    });
    console.log(`Updated ${approvedUpdate.count} approved users to APPROVED status.`);
    const potentialRejectedUsers = await prisma.user.findMany({
        where: {
            isApproved: false,
            status: client_1.ApprovalStatus.PENDING
        },
        include: {
            approvals: {
                orderBy: { createdAt: 'desc' },
                take: 1
            }
        }
    });
    let rejectedCount = 0;
    for (const user of potentialRejectedUsers) {
        if (user.approvals.length > 0 && user.approvals[0].status === client_1.ApprovalStatus.REJECTED) {
            await prisma.user.update({
                where: { id: user.id },
                data: { status: client_1.ApprovalStatus.REJECTED }
            });
            rejectedCount++;
            console.log(`Marked user ${user.email} as REJECTED based on history.`);
        }
    }
    console.log(`Updated ${rejectedCount} users to REJECTED status.`);
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=fix-user-status.js.map