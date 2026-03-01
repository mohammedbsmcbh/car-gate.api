import { ListingType, ListingStatus } from '@prisma/client';
export declare class CreateListingDto {
    type: ListingType;
    title: string;
    titleAr?: string;
    description?: string;
    descriptionAr?: string;
    price: number;
    currency?: string;
    make?: string;
    model?: string;
    year?: number;
    mileage?: number;
    color?: string;
    condition?: string;
    transmission?: string;
    fuelType?: string;
    bodyType?: string;
    engineSize?: string;
    plateNumber?: string;
    plateCategory?: string;
    city?: string;
    address?: string;
    latitude?: number;
    longitude?: number;
    contactPhone?: string;
    contactWhatsapp?: string;
    contactEmail?: string;
    images?: string[];
}
export declare class UpdateListingDto extends CreateListingDto {
    status?: ListingStatus;
}
export declare class ListingFilterDto {
    page?: number;
    limit?: number;
    category?: string;
    type?: ListingType;
    status?: ListingStatus;
    make?: string;
    model?: string;
    yearMin?: number;
    yearMax?: number;
    priceMin?: number;
    priceMax?: number;
    city?: string;
    condition?: string;
    ownerRole?: string;
    isFeatured?: boolean;
    minFeaturedPriority?: number;
    maxFeaturedPriority?: number;
    search?: string;
    ownerId?: string;
    agencyId?: string;
    showroomId?: string;
    latitude?: number;
    longitude?: number;
    radiusKm?: number;
    sortBy?: 'price' | 'createdAt' | 'year' | 'mileage' | 'random';
    sortOrder?: 'asc' | 'desc';
}
export declare class FeatureListingDto {
    days: number;
}
