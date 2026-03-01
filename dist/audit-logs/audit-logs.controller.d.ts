import { AuditLogsService } from './audit-logs.service';
export declare class AuditLogsController {
    private auditLogsService;
    constructor(auditLogsService: AuditLogsService);
    findAll(page: number, limit: number, actorId?: string, action?: string): Promise<{
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
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
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
