import { PrismaService } from '../prisma/prisma.service';
import { ChatGateway } from '../chat/chat.gateway';
import { UserRole, Language, Prisma } from '@prisma/client';
export declare const NOTIFICATION_TEMPLATES: {
    CHAT_NEW_MESSAGE: {
        EN: {
            title: string;
            body: string;
        };
        AR: {
            title: string;
            body: string;
        };
        UR: {
            title: string;
            body: string;
        };
    };
    OFFER_RECEIVED: {
        EN: {
            title: string;
            body: string;
        };
        AR: {
            title: string;
            body: string;
        };
        UR: {
            title: string;
            body: string;
        };
    };
    OFFER_ACCEPTED: {
        EN: {
            title: string;
            body: string;
        };
        AR: {
            title: string;
            body: string;
        };
        UR: {
            title: string;
            body: string;
        };
    };
    OFFER_REJECTED: {
        EN: {
            title: string;
            body: string;
        };
        AR: {
            title: string;
            body: string;
        };
        UR: {
            title: string;
            body: string;
        };
    };
    LISTING_APPROVED: {
        EN: {
            title: string;
            body: string;
        };
        AR: {
            title: string;
            body: string;
        };
        UR: {
            title: string;
            body: string;
        };
    };
    LISTING_REJECTED: {
        EN: {
            title: string;
            body: string;
        };
        AR: {
            title: string;
            body: string;
        };
        UR: {
            title: string;
            body: string;
        };
    };
    NEW_LISTING_PUBLISHED: {
        EN: {
            title: string;
            body: string;
        };
        AR: {
            title: string;
            body: string;
        };
        UR: {
            title: string;
            body: string;
        };
    };
    NEW_BANNER: {
        EN: {
            title: string;
            body: string;
        };
        AR: {
            title: string;
            body: string;
        };
        UR: {
            title: string;
            body: string;
        };
    };
    STORY_APPROVED: {
        EN: {
            title: string;
            body: string;
        };
        AR: {
            title: string;
            body: string;
        };
        UR: {
            title: string;
            body: string;
        };
    };
    MARKETING_BROADCAST: {
        EN: {
            title: string;
            body: string;
        };
        AR: {
            title: string;
            body: string;
        };
        UR: {
            title: string;
            body: string;
        };
    };
};
export type TemplateKey = keyof typeof NOTIFICATION_TEMPLATES;
export declare class NotificationsService {
    private prisma;
    private chatGateway;
    private expo;
    private logger;
    constructor(prisma: PrismaService, chatGateway: ChatGateway);
    private replacePlaceholders;
    private getTemplate;
    notifyUser(userId: string, templateKey: TemplateKey, data?: any, options?: any): Promise<void>;
    broadcast(templateKey: TemplateKey, data?: any, filters?: {
        role?: UserRole;
        language?: Language;
    }): Promise<void>;
    private sendChunks;
    registerDevice(token: string, platform: string, language: any, userId?: string): Promise<{
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
    sendAdminNotification(filters: {
        role?: UserRole | 'ALL';
        language?: Language | 'ALL';
    }, title: string, body: string, data?: any): Promise<{
        targeted: number;
        sentCount: number;
    }>;
    create(userId: string, title: string, body: string, type: string, data?: any): Promise<{
        id: string;
        createdAt: Date;
        data: Prisma.JsonValue | null;
        type: string;
        userId: string;
        isRead: boolean;
        title: string;
        body: string;
    }>;
    sendPushNotification(userId: string, title: string, body: string, data?: any): Promise<void>;
    findAll(userId: string): Promise<{
        id: string;
        createdAt: Date;
        data: Prisma.JsonValue | null;
        type: string;
        userId: string;
        isRead: boolean;
        title: string;
        body: string;
    }[]>;
    markAsRead(id: string, userId: string): Promise<Prisma.BatchPayload>;
    markAllAsRead(userId: string): Promise<Prisma.BatchPayload>;
}
