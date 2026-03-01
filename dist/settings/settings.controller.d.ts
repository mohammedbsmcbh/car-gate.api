import { SettingsService } from './settings.service';
import { UpsertSettingDto } from './dto/upsert-setting.dto';
import { CreateFeaturedPricingDto, UpdateFeaturedPricingDto } from './dto/featured-pricing.dto';
export declare class SettingsController {
    private settingsService;
    constructor(settingsService: SettingsService);
    listFeaturedPricing(): Promise<{
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        days: number;
        price: import("@prisma/client/runtime/library").Decimal;
        currency: string;
    }[]>;
    listFeaturedPricingAdmin(): Promise<{
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        days: number;
        price: import("@prisma/client/runtime/library").Decimal;
        currency: string;
    }[]>;
    createFeaturedPricing(dto: CreateFeaturedPricingDto, adminId: string): Promise<{
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        days: number;
        price: import("@prisma/client/runtime/library").Decimal;
        currency: string;
    }>;
    updateFeaturedPricing(id: string, dto: UpdateFeaturedPricingDto, adminId: string): Promise<{
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        days: number;
        price: import("@prisma/client/runtime/library").Decimal;
        currency: string;
    }>;
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
    upsertSetting(key: string, dto: UpsertSettingDto, adminId: string): Promise<{
        value: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        key: string;
    }>;
    getPublicSetting(key?: string): Promise<{
        value: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        key: string;
    } | {
        message: string;
        key?: undefined;
        value?: undefined;
    } | {
        key: string;
        value: null;
        message?: undefined;
    }>;
}
