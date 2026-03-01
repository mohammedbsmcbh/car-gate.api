import { NotificationsService } from './notifications.service';
export declare class DevicesController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    register(token: string, platform: string, language: string, userId?: string): Promise<{
        id: string;
        pushToken: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
        platform: string;
        language: import("@prisma/client").$Enums.Language;
        optedInChat: boolean;
        optedInSystem: boolean;
        optedInMarketing: boolean;
        lastActiveAt: Date;
    }>;
}
