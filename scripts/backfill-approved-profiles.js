"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("node:fs"));
const path = __importStar(require("node:path"));
const client_1 = require("@prisma/client");
function loadDotEnvIfPresent() {
    const envPath = path.join(__dirname, '..', '.env');
    if (!fs.existsSync(envPath))
        return;
    const content = fs.readFileSync(envPath, 'utf8');
    for (const rawLine of content.split(/\r?\n/)) {
        const line = rawLine.trim();
        if (!line || line.startsWith('#'))
            continue;
        const eqIndex = line.indexOf('=');
        if (eqIndex === -1)
            continue;
        const key = line.slice(0, eqIndex).trim();
        let value = line.slice(eqIndex + 1).trim();
        if ((value.startsWith('"') && value.endsWith('"')) ||
            (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1);
        }
        if (!process.env[key]) {
            process.env[key] = value;
        }
    }
}
async function main() {
    loadDotEnvIfPresent();
    const prisma = new client_1.PrismaClient();
    try {
        const approvedUsers = await prisma.user.findMany({
            where: {
                isApproved: true,
                role: { in: [client_1.UserRole.AGENCY, client_1.UserRole.SHOWROOM] },
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
            if (user.role === client_1.UserRole.AGENCY) {
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
            if (user.role === client_1.UserRole.SHOWROOM) {
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
        console.log(JSON.stringify({
            approvedUsers: approvedUsers.length,
            agenciesUpserted,
            showroomsUpserted,
        }, null, 2));
    }
    finally {
        await prisma.$disconnect();
    }
}
main().catch((err) => {
    const message = err instanceof Error ? err.message : String(err);
    console.error(message);
    process.exit(1);
});
//# sourceMappingURL=backfill-approved-profiles.js.map