import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
export declare class SubscriptionsService {
    private prisma;
    private mailService;
    constructor(prisma: PrismaService, mailService: MailService);
    getCurrentSubscription(userId: string): Promise<({
        package: {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            nameAr: string;
            descriptionAr: string | null;
            price: import("@prisma/client/runtime/library").Decimal;
            features: import("@prisma/client/runtime/library").JsonValue;
            sortOrder: number;
            nameEn: string;
            nameUr: string | null;
            descriptionEn: string | null;
            descriptionUr: string | null;
            billingType: import("@prisma/client").$Enums.PackageBillingType;
            targetAudience: import("@prisma/client").$Enums.PackageTarget;
        };
    } & {
        id: string;
        status: import("@prisma/client").$Enums.SubscriptionStatus;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        packageId: string;
        startDate: Date;
        endDate: Date;
        listingsUsed: number;
        storiesUsed: number;
        featuredListingsUsed: number;
        limits: import("@prisma/client/runtime/library").JsonValue;
    }) | null>;
    getUsageStats(userId: string): Promise<{
        hasActiveSubscription: boolean;
        subscription?: undefined;
        usage?: undefined;
    } | {
        hasActiveSubscription: boolean;
        subscription: {
            nameEn: string;
            nameAr: string;
            startDate: Date;
            endDate: Date;
            daysRemaining: number;
        };
        usage: {
            listings: {
                used: number;
                limit: any;
                remaining: number;
            };
            stories: {
                used: number;
                limit: any;
                remaining: number;
            };
            features: {
                priorityListing: any;
                enableFeatured: any;
            };
        };
    }>;
    subscribe(userId: string, packageId: string): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.SubscriptionStatus;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        packageId: string;
        startDate: Date;
        endDate: Date;
        listingsUsed: number;
        storiesUsed: number;
        featuredListingsUsed: number;
        limits: import("@prisma/client/runtime/library").JsonValue;
    }>;
    activateSubscription(subscriptionId: string): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.SubscriptionStatus;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        packageId: string;
        startDate: Date;
        endDate: Date;
        listingsUsed: number;
        storiesUsed: number;
        featuredListingsUsed: number;
        limits: import("@prisma/client/runtime/library").JsonValue;
    }>;
    findAll(status?: 'PENDING' | 'ACTIVE' | 'CANCELLED' | 'EXPIRED'): Promise<{
        listingsUsed: number;
        storiesUsed: number;
        package: {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            nameAr: string;
            descriptionAr: string | null;
            price: import("@prisma/client/runtime/library").Decimal;
            features: import("@prisma/client/runtime/library").JsonValue;
            sortOrder: number;
            nameEn: string;
            nameUr: string | null;
            descriptionEn: string | null;
            descriptionUr: string | null;
            billingType: import("@prisma/client").$Enums.PackageBillingType;
            targetAudience: import("@prisma/client").$Enums.PackageTarget;
        };
        user: {
            email: string;
            name: string | null;
            role: import("@prisma/client").$Enums.UserRole;
            phone: string | null;
            id: string;
            avatar: string | null;
        };
        id: string;
        status: import("@prisma/client").$Enums.SubscriptionStatus;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        packageId: string;
        startDate: Date;
        endDate: Date;
        featuredListingsUsed: number;
        limits: import("@prisma/client/runtime/library").JsonValue;
    }[]>;
    cancelSubscription(id: string): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.SubscriptionStatus;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        packageId: string;
        startDate: Date;
        endDate: Date;
        listingsUsed: number;
        storiesUsed: number;
        featuredListingsUsed: number;
        limits: import("@prisma/client/runtime/library").JsonValue;
    }>;
    deleteSubscription(id: string): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.SubscriptionStatus;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        packageId: string;
        startDate: Date;
        endDate: Date;
        listingsUsed: number;
        storiesUsed: number;
        featuredListingsUsed: number;
        limits: import("@prisma/client/runtime/library").JsonValue;
    }>;
    updateSubscription(id: string, data: {
        endDate?: string | Date;
        status?: any;
        limits?: any;
    }): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.SubscriptionStatus;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        packageId: string;
        startDate: Date;
        endDate: Date;
        listingsUsed: number;
        storiesUsed: number;
        featuredListingsUsed: number;
        limits: import("@prisma/client/runtime/library").JsonValue;
    }>;
}
