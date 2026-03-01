import { PrismaService } from '../prisma/prisma.service';
import { UpsertSettingDto } from './dto/upsert-setting.dto';
import { CreateFeaturedPricingDto, UpdateFeaturedPricingDto } from './dto/featured-pricing.dto';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
export declare class SettingsService {
    private prisma;
    private auditLogs;
    constructor(prisma: PrismaService, auditLogs: AuditLogsService);
    listSettings(): Promise<{
        value: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        key: string;
    }[]>;
    getSetting(key: string): Promise<{
        value: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        key: string;
    } | null>;
    upsertSetting(key: string, dto: UpsertSettingDto, actorId?: string): Promise<{
        value: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        key: string;
    }>;
    listFeaturedPricing(publicOnly?: boolean): Promise<{
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        days: number;
        price: import("@prisma/client/runtime/library").Decimal;
        currency: string;
    }[]>;
    createFeaturedPricing(dto: CreateFeaturedPricingDto, actorId?: string): Promise<{
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        days: number;
        price: import("@prisma/client/runtime/library").Decimal;
        currency: string;
    }>;
    updateFeaturedPricing(id: string, dto: UpdateFeaturedPricingDto, actorId?: string): Promise<{
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        days: number;
        price: import("@prisma/client/runtime/library").Decimal;
        currency: string;
    }>;
}
