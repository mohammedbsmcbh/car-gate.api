import { NotificationsService } from './notifications.service';
import { UserRole, Language } from '@prisma/client';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    send(filters: {
        role?: UserRole | 'ALL';
        language?: Language | 'ALL';
    }, title: string, body: string, data?: any): Promise<{
        targeted: number;
        sentCount: number;
    }>;
    findAll(req: any): Promise<{
        id: string;
        createdAt: Date;
        data: import("@prisma/client/runtime/library").JsonValue | null;
        type: string;
        userId: string;
        isRead: boolean;
        title: string;
        body: string;
    }[]>;
    markAsRead(req: any, id: string): Promise<import("@prisma/client").Prisma.BatchPayload>;
    markAllAsRead(req: any): Promise<import("@prisma/client").Prisma.BatchPayload>;
}
