const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const total = await prisma.media.count();
  const videos = await prisma.media.count({ where: { type: 'video' } });
  const images = await prisma.media.count({ where: { type: 'image' } });

  console.log(JSON.stringify({ total, images, videos }, null, 2));
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
