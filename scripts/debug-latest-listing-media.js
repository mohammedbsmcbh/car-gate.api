const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const listings = await prisma.listing.findMany({
    take: 10,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      type: true,
      status: true,
      createdAt: true,
      media: { select: { id: true, type: true, url: true } },
    },
  });

  const summarized = listings.map((l) => {
    const images = l.media.filter((m) => m.type === 'image').length;
    const videos = l.media.filter((m) => m.type === 'video').length;
    return {
      id: l.id,
      title: l.title,
      type: l.type,
      status: l.status,
      createdAt: l.createdAt,
      images,
      videos,
      mediaTypes: Array.from(new Set(l.media.map((m) => m.type))).sort(),
    };
  });

  console.log(JSON.stringify(summarized, null, 2));
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
