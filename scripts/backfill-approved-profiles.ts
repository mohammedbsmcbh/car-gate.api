import * as fs from 'node:fs';
import * as path from 'node:path';

import { PrismaClient, UserRole } from '@prisma/client';

function loadDotEnvIfPresent() {
  const envPath = path.join(__dirname, '..', '.env');
  if (!fs.existsSync(envPath)) return;

  const content = fs.readFileSync(envPath, 'utf8');
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;

    const eqIndex = line.indexOf('=');
    if (eqIndex === -1) continue;

    const key = line.slice(0, eqIndex).trim();
    let value = line.slice(eqIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

async function main() {
  loadDotEnvIfPresent();

  const prisma = new PrismaClient();

  try {
    const approvedUsers = await prisma.user.findMany({
      where: {
        isApproved: true,
        role: { in: [UserRole.AGENCY, UserRole.SHOWROOM] },
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        commercialRecord: true,
      },
    });

    let agenciesUpserted = 0;
    let showroomsUpserted = 0;

    for (const user of approvedUsers) {
      const defaultName = user.name?.trim() || user.email;

      if (user.role === UserRole.AGENCY) {
        await prisma.agency.upsert({
          where: { userId: user.id },
          create: {
            userId: user.id,
            name: defaultName,
            commercialRecord: user.commercialRecord ?? null,
            isApproved: true,
          },
          update: {
            isApproved: true,
            commercialRecord: user.commercialRecord ?? undefined,
          },
        });
        agenciesUpserted += 1;
      }

      if (user.role === UserRole.SHOWROOM) {
        await prisma.showroom.upsert({
          where: { userId: user.id },
          create: {
            userId: user.id,
            name: defaultName,
            commercialRecord: user.commercialRecord ?? null,
            isApproved: true,
          },
          update: {
            isApproved: true,
            commercialRecord: user.commercialRecord ?? undefined,
          },
        });
        showroomsUpserted += 1;
      }
    }

    console.log(
      JSON.stringify(
        {
          approvedUsers: approvedUsers.length,
          agenciesUpserted,
          showroomsUpserted,
        },
        null,
        2,
      ),
    );
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err: unknown) => {
  const message = err instanceof Error ? err.message : String(err);
  console.error(message);
  process.exit(1);
});
