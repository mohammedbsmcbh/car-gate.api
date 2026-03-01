import { PrismaService } from '../prisma/prisma.service';
import { CreateStoryDto } from './dto/create-story.dto';
import { ApprovalStatus } from '@prisma/client';
import { NotificationsService } from '../notifications/notifications.service';
export declare class StoriesService {
    private prisma;
    private notificationsService;
    constructor(prisma: PrismaService, notificationsService: NotificationsService);
    create(userId: string, createStoryDto: CreateStoryDto): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.ApprovalStatus;
        createdAt: Date;
        userId: string;
        expiresAt: Date;
        views: number;
        mediaUrl: string;
        mediaType: string;
        caption: string | null;
    }>;
    findAllPending(): Promise<({
        user: {
            agency: {
                name: string;
                logo: string | null;
            } | null;
            showroom: {
                name: string;
                logo: string | null;
            } | null;
            email: string;
            name: string | null;
            role: import("@prisma/client").$Enums.UserRole;
            id: string;
        };
    } & {
        id: string;
        status: import("@prisma/client").$Enums.ApprovalStatus;
        createdAt: Date;
        userId: string;
        expiresAt: Date;
        views: number;
        mediaUrl: string;
        mediaType: string;
        caption: string | null;
    })[]>;
    updateStatus(id: string, status: ApprovalStatus): Promise<{
        user: {
            email: string;
            password: string;
            name: string | null;
            role: import("@prisma/client").$Enums.UserRole;
            phone: string | null;
            commercialRecord: string | null;
            whatsapp: string | null;
            preferredLanguage: import("@prisma/client").$Enums.Language;
            otp: string | null;
            id: string;
            avatar: string | null;
            coverImage: string | null;
            pushToken: string | null;
            otpExpiresAt: Date | null;
            isApproved: boolean;
            status: import("@prisma/client").$Enums.ApprovalStatus;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
        };
    } & {
        id: string;
        status: import("@prisma/client").$Enums.ApprovalStatus;
        createdAt: Date;
        userId: string;
        expiresAt: Date;
        views: number;
        mediaUrl: string;
        mediaType: string;
        caption: string | null;
    }>;
    findAllActive(role?: 'AGENCY' | 'SHOWROOM' | 'INDIVIDUAL' | 'CUSTOMS_CLEARER' | 'INSPECTION_CENTER' | 'POLISHING_CENTER'): Promise<({
        user: {
            agency: {
                name: string;
                coverImage: string | null;
                logo: string | null;
            } | null;
            showroom: {
                name: string;
                coverImage: string | null;
                logo: string | null;
            } | null;
            serviceProvider: {
                name: string | null;
                type: import("@prisma/client").$Enums.ServiceProviderType;
                nameAr: string | null;
                logo: string | null;
            } | null;
            name: string | null;
            role: import("@prisma/client").$Enums.UserRole;
            id: string;
            avatar: string | null;
        };
    } & {
        id: string;
        status: import("@prisma/client").$Enums.ApprovalStatus;
        createdAt: Date;
        userId: string;
        expiresAt: Date;
        views: number;
        mediaUrl: string;
        mediaType: string;
        caption: string | null;
    })[]>;
    findMyStories(userId: string): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.ApprovalStatus;
        createdAt: Date;
        userId: string;
        expiresAt: Date;
        views: number;
        mediaUrl: string;
        mediaType: string;
        caption: string | null;
    }[]>;
}
