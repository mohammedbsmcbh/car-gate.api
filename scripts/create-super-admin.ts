import * as fs from 'node:fs';
import * as path from 'node:path';

import * as bcrypt from 'bcrypt';
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

  const email = process.env.SUPER_ADMIN_EMAIL || 'admin@cargate.bh';
  const password = process.env.SUPER_ADMIN_PASSWORD;

  if (!password || password.trim().length < 6) {
    throw new Error(
      'Missing SUPER_ADMIN_PASSWORD (min 6 chars). Set it in your environment or backend-api/.env before running.',
    );
  }

  const prisma = new PrismaClient();

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.upsert({
      where: { email },
      create: {
        email,
        password: hashedPassword,
        role: UserRole.SUPER_ADMIN,
        isApproved: true,
        isActive: true,
        name: 'Super Admin',
      },
      update: {
        password: hashedPassword,
        role: UserRole.SUPER_ADMIN,
        isApproved: true,
        isActive: true,
      },
      select: {
        id: true,
        email: true,
        role: true,
        isApproved: true,
        isActive: true,
        createdAt: true,
      },
    });

    console.log('SUPER_ADMIN_READY', user);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err: unknown) => {
  const message = err instanceof Error ? err.message : String(err);
  console.error(message);
  process.exit(1);
});
