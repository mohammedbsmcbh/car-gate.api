import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
export type AuditLogInput = {
    actorId?: string | null;
    action: string;
    entityType?: string;
    entityId?: string;
    metadata?: Prisma.InputJsonValue;
    ip?: string;
    userAgent?: string;
};
export declare class AuditLogsService {
    private prisma;
    constructor(prisma: PrismaService);
    log(input: AuditLogInput): Promise<void>;
    findAll(params: {
        page?: number;
        limit?: number;
        actorId?: string;
        action?: string;
    }): Promise<{
        data: ({
            actor: {
                email: string;
                name: string | null;
                role: import("@prisma/client").$Enums.UserRole;
                id: string;
            } | null;
        } & {
            id: string;
            createdAt: Date;
            ip: string | null;
            action: string;
            entityType: string | null;
            entityId: string | null;
            metadata: Prisma.JsonValue | null;
            userAgent: string | null;
            actorId: string | null;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
}
