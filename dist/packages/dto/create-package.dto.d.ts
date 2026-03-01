import { PackageBillingType } from '@prisma/client';
export declare enum PackageTarget {
    ALL = "ALL",
    AGENCY = "AGENCY",
    SHOWROOM = "SHOWROOM",
    TRADER = "TRADER",
    INDIVIDUAL = "INDIVIDUAL"
}
export declare class PackageFeaturesDto {
    enableStories?: boolean;
    enableFeatured?: boolean;
    enableFeaturedPlus?: boolean;
    priorityListing?: boolean;
    highlightedBadge?: boolean;
    maxListings?: number;
    maxStories?: number;
    maxFeaturedListings?: number;
    autoApproveListings?: boolean;
    durationDays?: number;
    maxSubAdmins?: number;
}
export declare class CreatePackageDto {
    nameEn: string;
    nameAr: string;
    nameUr?: string;
    descriptionEn?: string;
    descriptionAr?: string;
    descriptionUr?: string;
    price: number;
    billingType: PackageBillingType;
    targetAudience?: PackageTarget;
    features: PackageFeaturesDto;
    isActive?: boolean;
    sortOrder?: number;
}
