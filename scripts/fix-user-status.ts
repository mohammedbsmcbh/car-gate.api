import { PrismaClient, ApprovalStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Fixing user statuses...');

  // 1. Fix Approved Users
  const approvedUpdate = await prisma.user.updateMany({
    where: {
      isApproved: true,
      status: ApprovalStatus.PENDING 
    },
    data: {
      status: ApprovalStatus.APPROVED
    }
  });
  console.log(`Updated ${approvedUpdate.count} approved users to APPROVED status.`);

  // 2. Fix Rejected Users
  // We need to find users who are NOT approved, and have a rejection record.
  const potentialRejectedUsers = await prisma.user.findMany({
    where: {
      isApproved: false,
      status: ApprovalStatus.PENDING
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
    // If we have an approval record and it is rejected
    if (user.approvals.length > 0 && user.approvals[0].status === ApprovalStatus.REJECTED) {
      await prisma.user.update({
        where: { id: user.id },
        data: { status: ApprovalStatus.REJECTED }
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
