const { PrismaClient, ListingStatus, UserRole } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const latest = await prisma.listing.findMany({
    take: 15,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      status: true,
      createdAt: true,
      agencyId: true,
      showroomId: true,
      owner: { select: { email: true, role: true } },
    },
  });

  const agencyApproved = await prisma.listing.count({
    where: { status: ListingStatus.APPROVED, owner: { role: UserRole.AGENCY } },
  });

  const agencyPending = await prisma.listing.count({
    where: { status: ListingStatus.PENDING, owner: { role: UserRole.AGENCY } },
  });

  console.log(
    JSON.stringify(
      {
        agencyApproved,
        agencyPending,
        latest,
      },
      null,
      2,
    ),
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
